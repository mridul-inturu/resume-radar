import type {
  ResumeData,
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  SkillCategory,
} from '@/types/resume';

/* ─── Regexes ───────────────────────────────────────────────── */

const EMAIL_RE    = /[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,}/;
const PHONE_RE    = /(\+?[\d][\d\s\-().]{7,14}[\d])/;
const LINKEDIN_RE = /linkedin\.com\/in\/([\w\-]+)/i;
const GITHUB_RE   = /github\.com\/([\w\-]+)/i;
const GPA_RE      = /gpa[:\s]+(\d+\.?\d*)/i;
const PCT_RE      = /percentage[:\s]+(\d+\.?\d*\s*%?)/i;
const YEAR_RE     = /\(?\s*(\d{4})\s*[-\u2013\u2014]\s*(\d{4})\s*\)?/;
const DATE_RANGE_RE =
  /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\.?\s*\d{4}|\d{4})\s*[-\u2013\u2014]\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\.?\s*\d{4}|\d{4}|present|current)/i;
const DURATION_RE  = /\[[\d\-\s\w]+(?:month|week|year)s?\]/i;

/* Known ALL-CAPS section header phrases to split on during pre-processing */
const SPLIT_PHRASES = [
  'CAREER OBJECTIVE', 'PROFESSIONAL SUMMARY', 'TECHNICAL SKILLS', 'KEY SKILLS',
  'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'CERTIFICATIONS', 'CERTIFICATION',
  'ACHIEVEMENTS', 'ACHIEVEMENT', 'HOBBIES', 'EDUCATION', 'PROJECTS', 'PROJECT',
  'CONTACT INFORMATION', 'AREAS OF EXPERTISE', 'CORE COMPETENCIES',
  'EXTRA CURRICULAR', 'EXTRACURRICULAR', 'VOLUNTEER', 'LANGUAGES', 'DECLARATION',
];

/* Section key map */
const SECTION_PATTERNS: Array<{ key: string; re: RegExp }> = [
  { key: 'contact',        re: /^(contact|contact information|contact details)$/i },
  { key: 'summary',        re: /^(career objective|professional summary|objective|profile|summary|about|about me)$/i },
  { key: 'experience',     re: /^(experience|work experience|professional experience|employment|work history|internships?)$/i },
  { key: 'education',      re: /^(education|academic background|qualifications|academic)$/i },
  { key: 'skills',         re: /^(technical skills|key skills|core competencies|technologies|technical competencies|areas of expertise)$/i },
  { key: 'softskills',     re: /^(skills|soft skills|personal skills)$/i },
  { key: 'projects',       re: /^(projects|personal projects|side projects|notable projects|academic projects|project work)$/i },
  { key: 'certifications', re: /^(certifications?|certificates?|licenses?)$/i },
  { key: 'achievements',   re: /^(achievements?|awards?|honors?|accomplishments?|recognition)$/i },
  { key: 'hobbies',        re: /^(hobbies?|interests?|activities)$/i },
  { key: 'declaration',    re: /^declaration$/i },
];

/* ─── Utility ───────────────────────────────────────────────── */

function uid() { return Math.random().toString(36).slice(2, 9); }

/**
 * Pre-process raw PDF text.
 * Inserts newlines before known ALL-CAPS section headers that were
 * merged into surrounding text by PDF column extraction.
 */
function preprocess(raw: string): string {
  let text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Build alternation of exact phrases
  const escaped = SPLIT_PHRASES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const splitRe = new RegExp(`(?<![\\w])(${escaped.join('|')})(?![\\w])`, 'g');
  text = text.replace(splitRe, '\n$1');

  // Collapse 3+ blank lines
  text = text.replace(/\n{3,}/g, '\n\n');
  return text;
}

function detectSection(line: string): string | null {
  const clean = line.replace(/[:\-_=*#|•]+$/g, '').trim();
  if (!clean || clean.length > 65) return null;
  for (const { key, re } of SECTION_PATTERNS) {
    if (re.test(clean)) return key;
  }
  return null;
}

/** True if the line looks like a person's full name */
function isNameLine(line: string): boolean {
  const t = line.trim();
  if (!t || t.length > 55) return false;
  const words = t.split(/\s+/);
  if (words.length < 1 || words.length > 5) return false;
  if (EMAIL_RE.test(t)) return false;
  if (/https?:|linkedin|github|www\./i.test(t)) return false;
  if (/^\+?\d/.test(t)) return false;
  if (!/^[A-Z]/.test(t)) return false;
  // Only letters, hyphens, spaces, apostrophes
  if (!/^[A-Za-z][\w\s.\-']*$/.test(t)) return false;
  // At least one of the words looks like a proper name (not ALL lowercase)
  const hasProper = words.some((w) => /^[A-Z]/.test(w) && w.length > 1);
  return hasProper;
}

/** Scan ALL lines globally for contact fields */
function extractContactGlobal(lines: string[]): ContactInfo {
  const c: ContactInfo = {
    name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '',
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Email
    if (!c.email) { const m = EMAIL_RE.exec(line); if (m) c.email = m[0]; }

    // Phone (strip letters first to avoid matching years in dates)
    if (!c.phone) {
      const stripped = line.replace(/[a-zA-Z@.]/g, ' ');
      const m = PHONE_RE.exec(stripped);
      if (m && m[0].replace(/\D/g, '').length >= 10) c.phone = m[0].trim();
    }

    // LinkedIn URL
    if (!c.linkedin) {
      const m = LINKEDIN_RE.exec(line);
      if (m) { c.linkedin = `linkedin.com/in/${m[1]}`; }
      else if (/^linkedin\s*:/i.test(line)) {
        // "LINKEDIN: vaibhavsorcar" style label
        const val = line.replace(/^linkedin\s*:\s*/i, '').trim();
        const urlM = LINKEDIN_RE.exec(val);
        if (urlM) c.linkedin = `linkedin.com/in/${urlM[1]}`;
        // else skip display names like "(13) Vaibhav Sorcar | LinkedIn"
      }
    }

    // GitHub URL
    if (!c.github) {
      const m = GITHUB_RE.exec(line);
      if (m) { c.github = `github.com/${m[1]}`; }
      else if (/^github\s*:/i.test(line)) {
        const val = line.replace(/^github\s*:\s*/i, '').trim();
        const urlM = GITHUB_RE.exec(val);
        if (urlM) c.github = `github.com/${urlM[1]}`;
        else {
          // "github: vaibhavsorcar (display name)" — grab the first word
          const username = val.split(/[\s(|]/)[0].replace(/[^a-zA-Z0-9\-_]/, '');
          if (username && username.length > 0 && username.length < 40)
            c.github = `github.com/${username}`;
        }
      }
    }

    // Website
    if (!c.website && /https?:\/\//.test(line) && !/linkedin|github/i.test(line)) {
      const m = /https?:\/\/[\w.\-/]+/.exec(line);
      if (m) c.website = m[0];
    }

    // Location "City, State/Country"
    if (!c.location && /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)?,\s*[A-Z]/.test(line) && line.length < 50)
      c.location = line.trim();
  }
  return c;
}

/* ─── Section parsers ───────────────────────────────────────── */

function parseBullets(lines: string[]): string[] {
  return lines
    .filter((l) => /^[•\-*◦▸▷►▹>]|^\d+[.)]\s/.test(l))
    .map((l) => l.replace(/^[•\-*◦▸▷►▹>\s]+|^\d+[.)]\s*/, '').trim())
    .filter(Boolean);
}

function parseExperience(block: string[]): ExperienceEntry[] {
  const entries: ExperienceEntry[] = [];
  let cur: ExperienceEntry | null = null;
  const flush = () => { if (cur) entries.push(cur); cur = null; };

  for (const line of block) {
    if (!line) continue;
    const dateM = DATE_RANGE_RE.exec(line) ?? YEAR_RE.exec(line);

    if (/^[•\-*◦▸▷►▹>]|^\d+[.)]\s/.test(line)) {
      if (cur) cur.bullets.push(line.replace(/^[•\-*◦▸▷►▹>\s]+|^\d+[.)]\s*/, '').trim());
      continue;
    }

    if (dateM || (line.length < 100 && /^[A-Z]/.test(line) && !detectSection(line))) {
      flush();
      cur = { id: uid(), company: '', role: '', startDate: '', endDate: '', current: false, location: '', bullets: [] };
      if (dateM) {
        cur.startDate = dateM[1] ?? '';
        cur.endDate   = dateM[2] ?? '';
        cur.current   = /present|current/i.test(dateM[2] ?? '');
        const before  = line.slice(0, dateM.index).trim();
        const parts   = before.split(/\s*[|,·]\s*/).filter(Boolean);
        cur.company   = parts[0] ?? '';
        cur.role      = parts[1] ?? '';
      } else {
        cur.company = line;
      }
    } else if (cur) {
      if (!cur.role && line.length < 70) cur.role = line;
      else cur.bullets.push(line);
    }
  }
  flush();
  return entries.filter((e) => e.company || e.role);
}

function parseEducation(block: string[]): EducationEntry[] {
  const entries: EducationEntry[] = [];
  let cur: EducationEntry | null = null;
  const flush = () => { if (cur?.institution) entries.push(cur!); cur = null; };

  // Collect dangling year ranges (e.g. two "(2022-2026) (2020-2022)" on the same line)
  const yearRanges: string[][] = [];
  for (const line of block) {
    const allYears = [...line.matchAll(new RegExp(YEAR_RE.source, 'g'))];
    for (const m of allYears) yearRanges.push([m[1], m[2]]);
  }
  let yearIdx = 0;

  for (const line of block) {
    if (!line) continue;
    // Stop at declaration
    if (/^declaration/i.test(line)) break;

    const yearM  = YEAR_RE.exec(line);
    const gpaM   = GPA_RE.exec(line);
    const pctM   = PCT_RE.exec(line);
    const courseM = /^course\s*:\s*(.+)/i.exec(line);

    if (gpaM && cur)    { cur.gpa = gpaM[1]; continue; }
    if (pctM && cur)    { cur.gpa = pctM[1]; continue; }
    if (courseM && cur) { cur.degree = courseM[1].trim(); continue; }
    if (yearM) {
      if (cur && !cur.startDate) { cur.startDate = yearM[1]; cur.endDate = yearM[2]; }
      else if (cur && cur.startDate) {
        // Assign dangling years: if entry has start/end already, try next entry
      }
      continue;
    }

    if (line.length < 100 && /^[A-Z]/.test(line) && !detectSection(line)) {
      if (!cur) {
        cur = { id: uid(), institution: line.trim(), degree: '', field: '', startDate: '', endDate: '', gpa: '', bullets: [] };
      } else if (!cur.degree) {
        // Degree line — check for "Bachelor of Technology – AIML" pattern
        const dashM = line.match(/^(.+?)\s*[-\u2013\u2014]\s*(.+)$/);
        if (dashM && dashM[1].trim().split(/\s+/).length <= 6) {
          cur.degree = dashM[1].trim();
          cur.field  = dashM[2].trim();
        } else {
          cur.degree = line.trim();
        }
      } else {
        // New institution
        flush();
        cur = { id: uid(), institution: line.trim(), degree: '', field: '', startDate: '', endDate: '', gpa: '', bullets: [] };
      }
    } else if (cur && line.length > 0) {
      // May be continuation of degree info
      if (!cur.degree && line.length < 80) cur.degree = line.trim();
    }
  }
  flush();

  // Second pass: assign collected year ranges in order to entries missing dates
  let yr = 0;
  for (const edu of entries) {
    if (!edu.startDate && yr < yearRanges.length) {
      edu.startDate = yearRanges[yr][0];
      edu.endDate   = yearRanges[yr][1];
      yr++;
    }
  }

  return entries;
}

function parseSkills(block: string[]): SkillCategory[] {
  const cats: SkillCategory[] = [];

  for (const line of block) {
    if (!line) continue;
    const colonIdx = line.indexOf(':');
    // Category label can be up to 60 chars (e.g. "Data Science & Machine Learning")
    if (colonIdx > 0 && colonIdx < 65) {
      const cat    = line.slice(0, colonIdx).trim();
      const skills = line.slice(colonIdx + 1)
        .split(/[,|]/)
        .map((s) => s.trim())
        .filter((s) => s && s.length < 45);
      if (skills.length > 0 && cat.split(/\s+/).length <= 8) {
        cats.push({ id: uid(), category: cat, skills });
        continue;
      }
    }
    // Comma-separated list without a label
    const items = line.split(/[,|]/).map((s) => s.trim()).filter((s) => s && s.length < 35 && s.length > 1);
    if (items.length >= 2) {
      const last = cats[cats.length - 1];
      if (last) last.skills.push(...items.filter((sk) => !last.skills.includes(sk)));
      else cats.push({ id: uid(), category: 'Skills', skills: items });
    }
  }

  return cats.length > 0
    ? cats
    : [{ id: uid(), category: 'Technical', skills: [] }, { id: uid(), category: 'Tools', skills: [] }];
}

function parseProjects(block: string[]): ProjectEntry[] {
  const entries: ProjectEntry[] = [];
  let cur: ProjectEntry | null = null;
  let descLines: string[] = [];

  const flush = () => {
    if (!cur) return;
    if (descLines.length > 0 && cur.bullets.length === 0) {
      // Turn description paragraph into bullet sentences
      const combined = descLines.join(' ').trim();
      const sentences = combined
        .split(/(?<=[.!?])\s+(?=[A-Z])/)
        .map((s) => s.trim())
        .filter(Boolean);
      cur.bullets = sentences.length > 1 ? sentences : combined ? [combined] : [];
    }
    entries.push(cur);
    cur = null;
    descLines = [];
  };

  // Verbs / phrases that signal a description line, NOT a project title
  const DESC_STARTS =
    /^(developed|built|implemented|created|designed|tested|a web|a robust|simple|the robot|using|uploaded|this|it |based|allows|engaged|chats? are|deployed|trained|achieved|optimized|engineered|generated|leveraged|tracked)/i;

  for (const line of block) {
    if (!line) continue;

    // "Tech Stack: ..." line
    const techM = /^tech\s*stack\s*:(.+)/i.exec(line);
    if (techM) {
      if (cur) cur.tech = techM[1].trim();
      continue;
    }

    // Bullet or numbered list
    if (/^[•\-*◦▸▷►▹>]|^\d+[.)]\s/.test(line)) {
      if (cur) cur.bullets.push(line.replace(/^[•\-*◦▸▷►▹>\s]+|^\d+[.)]\s*/, '').trim());
      continue;
    }

    // Pure duration line
    if (DURATION_RE.test(line) && line.replace(DURATION_RE, '').trim().length < 5) continue;

    // Strip duration from candidate
    const nameCandidate = line.replace(DURATION_RE, '').trim();

    const couldBeTitle =
      nameCandidate.length > 3 &&
      nameCandidate.length < 85 &&
      /^[A-Z]/.test(nameCandidate) &&
      !DESC_STARTS.test(nameCandidate);

    const looksLikeSentence =
      (nameCandidate.match(/,/g) || []).length >= 2 ||
      nameCandidate.split(/\s+/).length > 12;

    if (couldBeTitle && !looksLikeSentence) {
      flush();
      cur = { id: uid(), name: nameCandidate, tech: '', link: '', bullets: [] };
    } else if (cur) {
      descLines.push(nameCandidate);
    }
  }
  flush();
  return entries.filter((e) => e.name.length > 2);
}

/* ─── Main export ───────────────────────────────────────────── */

export function parseResumeText(raw: string): ResumeData {
  const preprocessed = preprocess(raw);
  const lines  = preprocessed.split('\n').map((l) => l.trim());
  const nonEmpty = lines.filter((l) => l.length > 0);

  // Locate section headers
  const headerPositions: Array<{ key: string; idx: number }> = [];
  const seenKeys = new Set<string>();
  for (let i = 0; i < nonEmpty.length; i++) {
    const key = detectSection(nonEmpty[i]);
    if (!key || key === 'declaration') continue;
    if (key === 'softskills' && seenKeys.has('skills')) {
      // "SKILLS" appearing after "TECHNICAL SKILLS" is the soft-skills section
      headerPositions.push({ key, idx: i });
      continue;
    }
    if (!seenKeys.has(key)) {
      headerPositions.push({ key, idx: i });
      seenKeys.add(key);
    }
  }

  // Global contact scan (finds email/phone/github even inside sections)
  const contact = extractContactGlobal(nonEmpty);

  // Name: look in the pre-section preamble + CONTACT section block
  const firstSectionIdx = headerPositions[0]?.idx ?? Math.min(20, nonEmpty.length);
  const contactSectionBlock: string[] = [];
  const contactEntry = headerPositions.find((h) => h.key === 'contact');
  if (contactEntry) {
    const nextIdx = headerPositions.find((h) => h.idx > contactEntry.idx)?.idx ?? nonEmpty.length;
    contactSectionBlock.push(...nonEmpty.slice(contactEntry.idx + 1, nextIdx));
  }
  const nameCandidateLines = [...nonEmpty.slice(0, firstSectionIdx), ...contactSectionBlock];
  for (const line of nameCandidateLines) {
    if (isNameLine(line) && line.split(/\s+/).length >= 2) {
      contact.name = line.trim();
      break;
    }
  }
  // Fallback: any short name-like line
  if (!contact.name) {
    for (const line of nameCandidateLines) {
      if (isNameLine(line)) { contact.name = line.trim(); break; }
    }
  }

  const result: ResumeData = {
    contact,
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    customSections: [],
  };

  for (let i = 0; i < headerPositions.length; i++) {
    const { key, idx } = headerPositions[i];
    const nextIdx = headerPositions[i + 1]?.idx ?? nonEmpty.length;
    const block = nonEmpty.slice(idx + 1, nextIdx).filter(Boolean);

    switch (key) {
      case 'contact':
        // Already handled globally above
        break;
      case 'summary':
        result.summary = block.join(' ').replace(/\s{2,}/g, ' ').trim();
        break;
      case 'experience':
        result.experience = parseExperience(block);
        break;
      case 'education':
        result.education = parseEducation(block);
        break;
      case 'skills':
        result.skills = parseSkills(block);
        break;
      case 'projects':
        result.projects = parseProjects(block);
        break;
      case 'softskills': {
        const bullets = parseBullets(block);
        const content  = bullets.length ? bullets.join('\n') : block.join('\n').trim();
        if (content) result.customSections.push({ id: uid(), title: 'Soft Skills', content });
        break;
      }
      case 'hobbies': {
        const bullets = parseBullets(block);
        const content  = bullets.length ? bullets.join('\n') : block.join('\n').trim();
        if (content) result.customSections.push({ id: uid(), title: 'Hobbies & Interests', content });
        break;
      }
      case 'certifications': {
        const bullets = parseBullets(block);
        const content  = bullets.length ? bullets.join('\n') : block.join('\n').trim();
        if (content) result.customSections.push({ id: uid(), title: 'Certifications', content });
        break;
      }
      case 'achievements': {
        const bullets = parseBullets(block);
        const content  = bullets.length ? bullets.join('\n') : block.join('\n').trim();
        if (content) result.customSections.push({ id: uid(), title: 'Achievements', content });
        break;
      }
      default: {
        const title   = key.charAt(0).toUpperCase() + key.slice(1);
        const bullets = parseBullets(block);
        const content  = bullets.length ? bullets.join('\n') : block.join('\n').trim();
        if (content) result.customSections.push({ id: uid(), title, content });
      }
    }
  }

  if (result.skills.length === 0) {
    result.skills = [
      { id: uid(), category: 'Technical', skills: [] },
      { id: uid(), category: 'Tools', skills: [] },
    ];
  }

  return result;
}
