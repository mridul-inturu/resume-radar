/**
 * auto-fix.ts — AI-powered resume optimisation engine.
 *
 * Given the original resume text + analysis results + JD, produces a fully
 * improved ResumeData by:
 *   1. Injecting every missing keyword into the Skills section
 *   2. Replacing weak bullets with the AI suggestions already in the analysis
 *   3. Running a final AI pass to ensure every remaining bullet leads with a
 *      strong action verb and is ATS-aligned
 */

import { parseResumeText } from '@/lib/resume-parser';
import { callGemini } from '@/lib/gemini';
import type { AnalysisResult } from '@/types/analysis';
import type { ResumeData } from '@/types/resume';

export type FixProgress = {
  step: 1 | 2 | 3;
  label: string;
  detail: string;
};

/* ─── tiny fuzzy match (title-cased substring) ─────────────────── */
function bulletMatches(haystack: string, needle: string): boolean {
  if (!needle.trim()) return false;
  const h = haystack.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const n = needle.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  // Match if 60%+ of the needle words appear in the haystack
  const words = n.split(' ').filter((w) => w.length > 3);
  if (!words.length) return h.includes(n);
  const matches = words.filter((w) => h.includes(w)).length;
  return matches / words.length >= 0.6;
}

/* ─── Step 1: Inject missing keywords into Skills ──────────────── */
function injectKeywords(data: ResumeData, missing: string[]): ResumeData {
  if (!missing.length) return data;

  // Flatten all existing skills for dedup
  const existingFlat = data.skills.flatMap((c) => c.skills.map((s) => s.toLowerCase()));
  const toAdd = missing.filter((kw) => !existingFlat.includes(kw.toLowerCase()));

  if (!toAdd.length) return data;

  // Find a catch-all category or create one
  let skills = [...data.skills];
  const catchAll = skills.find(
    (c) =>
      /key skills|additional|technical|core/i.test(c.category) ||
      c.skills.length > 2,
  );

  if (catchAll) {
    skills = skills.map((c) =>
      c.id === catchAll.id ? { ...c, skills: [...c.skills, ...toAdd] } : c,
    );
  } else {
    skills = [
      ...skills,
      {
        id: 'autofix-kw',
        category: 'Key Skills',
        skills: toAdd,
      },
    ];
  }

  return { ...data, skills };
}

/* ─── Step 2: Apply pre-computed rewrite suggestions ───────────── */
function applyRewriteSuggestions(
  data: ResumeData,
  suggestions: AnalysisResult['rewriteSuggestions'],
): ResumeData {
  if (!suggestions.length) return data;

  const experience = data.experience.map((exp) => ({
    ...exp,
    bullets: exp.bullets.map((bullet) => {
      const match = suggestions.find((s) => bulletMatches(bullet, s.original));
      return match ? match.improved : bullet;
    }),
  }));

  const projects = data.projects.map((proj) => ({
    ...proj,
    bullets: proj.bullets.map((bullet) => {
      const match = suggestions.find((s) => bulletMatches(bullet, s.original));
      return match ? match.improved : bullet;
    }),
  }));

  return { ...data, experience, projects };
}

/* ─── Step 3: AI pass — action-verb restructure + ATS polish ───── */
async function aiPolishBullets(
  data: ResumeData,
  jobDescription: string,
): Promise<ResumeData> {
  // Collect all bullets that need polishing
  const allBullets: { section: 'exp' | 'proj'; entryId: string; idx: number; text: string }[] = [];

  data.experience.forEach((exp) => {
    exp.bullets.forEach((b, i) => allBullets.push({ section: 'exp', entryId: exp.id, idx: i, text: b }));
  });
  data.projects.forEach((proj) => {
    proj.bullets.forEach((b, i) => allBullets.push({ section: 'proj', entryId: proj.id, idx: i, text: b }));
  });

  if (!allBullets.length) return data;

  const bulletsJson = allBullets
    .map((b, i) => `${i}: ${b.text}`)
    .join('\n');

  const prompt = `You are an expert technical resume writer and ATS specialist helping a candidate get shortlisted.

TASK: Rewrite every resume bullet below to:
1. Start with a STRONG past-tense action verb (Led, Built, Reduced, Optimised, Engineered, Delivered, Automated, etc.)
2. Include quantifiable outcomes or metrics where the text implies them
3. Naturally incorporate relevant keywords from the job description
4. Stay factually truthful – never invent specific numbers that aren't implied
5. Be concise: 1–2 lines maximum per bullet

Job Description (for keyword alignment):
${jobDescription.slice(0, 1000)}

Resume Bullets (index: text):
${bulletsJson}

Return ONLY valid JSON array – no markdown, no comments, no trailing text:
[
  { "idx": 0, "improved": "..." },
  { "idx": 1, "improved": "..." }
]`;

  let improved: { idx: number; improved: string }[] = [];
  try {
    const raw = await callGemini(prompt, 1500);
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    improved = JSON.parse(cleaned);
  } catch {
    // If AI fails, return data as-is (steps 1+2 are already applied)
    return data;
  }

  // Apply improvements back
  const bulletMap = new Map(improved.map((r) => [r.idx, r.improved]));

  let idx = 0;
  const experience = data.experience.map((exp) => ({
    ...exp,
    bullets: exp.bullets.map((b) => {
      const improved = bulletMap.get(idx++);
      return improved ?? b;
    }),
  }));

  const projects = data.projects.map((proj) => ({
    ...proj,
    bullets: proj.bullets.map((b) => {
      const improved = bulletMap.get(idx++);
      return improved ?? b;
    }),
  }));

  return { ...data, experience, projects };
}

/* ─── Public entry point ────────────────────────────────────────── */

export async function autoFixResume(
  resumeText: string,
  analysisResult: AnalysisResult,
  jobDescription: string,
  onProgress: (p: FixProgress) => void,
): Promise<ResumeData> {
  // Step 1
  onProgress({ step: 1, label: 'Injecting missing keywords', detail: 'Adding gap keywords to your Skills section…' });
  const parsed = parseResumeText(resumeText);
  const missingKws = analysisResult.gaps.map((g) => g.keyword);
  const afterKeywords = injectKeywords(parsed, missingKws);
  // Small delay so the UI animation is visible
  await new Promise((r) => setTimeout(r, 600));

  // Step 2
  onProgress({ step: 2, label: 'Applying AI rewrite suggestions', detail: 'Replacing weak bullets with recruiter-grade language…' });
  const afterRewrite = applyRewriteSuggestions(afterKeywords, analysisResult.rewriteSuggestions);
  await new Promise((r) => setTimeout(r, 400));

  // Step 3
  onProgress({ step: 3, label: 'Restructuring with strong action verbs', detail: 'AI is polishing every bullet for ATS & human readers…' });
  const final = await aiPolishBullets(afterRewrite, jobDescription);

  return final;
}
