import { useState, useCallback, useRef, useMemo } from 'react';
import type { CSSProperties } from 'react';
import type {
  ResumeData, ResumeStyle, ExperienceEntry, EducationEntry,
  ProjectEntry, SkillCategory, CustomSection, ResumeTemplate, ResumeFont, SpacingOption,
} from '@/types/resume';
import { ResumePreview, FONT_FAMILIES, FONT_LINK } from '@/components/ResumePreview';
import { callGemini } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Download, Palette, Plus, Trash2, Wand2, Loader2,
  ChevronDown, ChevronRight, GripVertical, Check, X, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── helpers ─────────────────────────────────────────────────── */

function uid() { return Math.random().toString(36).slice(2, 9); }

const COLORS = [
  { label: 'Blue',     value: '#3b82f6' },
  { label: 'Cyan',     value: '#06b6d4' },
  { label: 'Fuchsia',  value: '#d946ef' },
  { label: 'Emerald',  value: '#059669' },
  { label: 'Rose',     value: '#e11d48' },
  { label: 'Violet',   value: '#7c3aed' },
  { label: 'Teal',     value: '#0d9488' },
  { label: 'Orange',   value: '#ea580c' },
];

const FONT_OPTIONS: Array<{ value: ResumeFont; label: string }> = [
  { value: 'inter',    label: 'Inter (Modern)' },
  { value: 'georgia',  label: 'Georgia (Classic)' },
  { value: 'playfair', label: 'Playfair (Elegant)' },
];

const TEMPLATE_OPTIONS: Array<{ value: ResumeTemplate; label: string; desc: string }> = [
  { value: 'classic',  label: 'Classic',  desc: 'Traditional one-column layout' },
  { value: 'modern',   label: 'Modern',   desc: 'Coloured sidebar with main content' },
  { value: 'minimal',  label: 'Minimal',  desc: 'Ultra-clean with thin dividers' },
];

/* ─── Outer tab nav ────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'contact',    label: 'Contact' },
  { id: 'summary',    label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education',  label: 'Education' },
  { id: 'skills',     label: 'Skills' },
  { id: 'projects',   label: 'Projects' },
  { id: 'custom',     label: 'Custom' },
  { id: 'style',      label: '🎨 Style' },
] as const;

/* ─── PDF export ───────────────────────────────────────────────── */

function downloadResumePDF(data: ResumeData, style: ResumeStyle) {
  const el = document.getElementById('resume-live-preview');
  if (!el) return;

  const fontLink = FONT_LINK[style.font]
    ? `<link rel="stylesheet" href="${FONT_LINK[style.font]}">`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${data.contact.name || 'Resume'}</title>
${fontLink}
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: Letter; margin: 0.5in 0.6in; }
  html, body { background: white; font-family: ${FONT_FAMILIES[style.font]}; }
  @media print {
    html, body { margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
</style>
</head>
<body style="background:white; margin:0; padding:0;">
${el.innerHTML}
<script>
  window.addEventListener('load', function() { setTimeout(function() { window.print(); }, 800); });
<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank', 'width=900,height=1100');
  if (win) setTimeout(() => URL.revokeObjectURL(url), 90_000);
}

/* ─── Section accordion wrapper ────────────────────────────────── */

function AccordionItem({
  open, onToggle, title, children,
}: { open: boolean; onToggle: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/6 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-white/3 hover:bg-white/5 text-left transition-colors"
        onClick={onToggle}
      >
        <span className="text-sm font-medium text-white">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronRight className="h-4 w-4 text-zinc-400" />}
      </button>
      {open && <div className="px-4 pb-4 pt-3 space-y-3 bg-white/2">{children}</div>}
    </div>
  );
}

/* ─── Label wrapper ─────────────────────────────────────────────── */

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-zinc-400 font-medium">{text}</p>
      {children}
    </div>
  );
}

/* ─── Inline style for inputs ────────────────────────────────────── */

const INP = 'bg-[#0a0e1a] border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 text-sm h-8';
const TXA = 'bg-[#0a0e1a] border-white/10 text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 text-sm resize-none';

/* ─── Bullet row with AI rewrite ─────────────────────────────────── */

function BulletRow({
  value, onChange, onDelete, onRewrite, rewriting,
}: {
  value: string;
  onChange: (v: string) => void;
  onDelete: () => void;
  onRewrite: () => void;
  rewriting: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <GripVertical className="h-4 w-4 text-zinc-600 shrink-0 mt-1.5" />
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(TXA, 'flex-1 min-h-[60px]')}
        placeholder="Describe an achievement with numbers/impact…"
      />
      <div className="flex flex-col gap-1 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
          onClick={onRewrite}
          disabled={rewriting || !value.trim()}
          title="AI Rewrite"
        >
          {rewriting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
          onClick={onDelete}
          title="Remove"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */

interface ResumeEditorProps {
  initialData: ResumeData;
  jobDescription?: string;
  resumeText?: string;
  onBack: () => void;
}

export function ResumeEditor({ initialData, jobDescription = '', resumeText = '', onBack }: ResumeEditorProps) {
  const [data, setData] = useState<ResumeData>(initialData);
  const [style, setStyle] = useState<ResumeStyle>({
    template: 'classic',
    font: 'inter',
    primaryColor: '#3b82f6',
    fontSize: 11,
    spacing: 'normal',
  });
  const [activeSection, setActiveSection] = useState<string>('contact');
  const [rewritingKey, setRewritingKey] = useState<string | null>(null); // "entryId-bulletIdx"
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(['exp-0']));
  const [aiState, setAiState] = useState<'idle' | 'filling' | 'done' | 'error'>('idle');
  const [aiFillMsg, setAiFillMsg] = useState('');
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

  /* helpers */
  const toggleAccordion = (key: string) =>
    setOpenAccordions((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  const setContact = useCallback((field: keyof typeof data.contact, val: string) =>
    setData((d) => ({ ...d, contact: { ...d.contact, [field]: val } })), []);

  /* experience */
  const addExp = () =>
    setData((d) => ({
      ...d,
      experience: [...d.experience, { id: uid(), company: '', role: '', startDate: '', endDate: '', current: false, location: '', bullets: [] }],
    }));
  const updateExp = (id: string, field: keyof ExperienceEntry, val: unknown) =>
    setData((d) => ({ ...d, experience: d.experience.map((e) => e.id === id ? { ...e, [field]: val } : e) }));
  const removeExp = (id: string) =>
    setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));
  const addBullet = (id: string) =>
    updateExp(id, 'bullets', [...(data.experience.find((e) => e.id === id)?.bullets ?? []), '']);
  const updateBullet = (id: string, idx: number, val: string) => {
    const entry = data.experience.find((e) => e.id === id);
    if (!entry) return;
    const bullets = [...entry.bullets];
    bullets[idx] = val;
    updateExp(id, 'bullets', bullets);
  };
  const removeBullet = (id: string, idx: number) => {
    const entry = data.experience.find((e) => e.id === id);
    if (!entry) return;
    updateExp(id, 'bullets', entry.bullets.filter((_, i) => i !== idx));
  };

  /* education */
  const addEdu = () =>
    setData((d) => ({
      ...d,
      education: [...d.education, { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', bullets: [] }],
    }));
  const updateEdu = (id: string, field: keyof EducationEntry, val: unknown) =>
    setData((d) => ({ ...d, education: d.education.map((e) => e.id === id ? { ...e, [field]: val } : e) }));
  const removeEdu = (id: string) =>
    setData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));

  /* projects */
  const addProj = () =>
    setData((d) => ({
      ...d,
      projects: [...d.projects, { id: uid(), name: '', tech: '', link: '', bullets: [] }],
    }));
  const updateProj = (id: string, field: keyof ProjectEntry, val: unknown) =>
    setData((d) => ({ ...d, projects: d.projects.map((p) => p.id === id ? { ...p, [field]: val } : p) }));
  const removeProj = (id: string) =>
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
  const addProjBullet = (id: string) =>
    updateProj(id, 'bullets', [...(data.projects.find((p) => p.id === id)?.bullets ?? []), '']);
  const updateProjBullet = (id: string, idx: number, val: string) => {
    const proj = data.projects.find((p) => p.id === id);
    if (!proj) return;
    const b = [...proj.bullets]; b[idx] = val;
    updateProj(id, 'bullets', b);
  };
  const removeProjBullet = (id: string, idx: number) => {
    const proj = data.projects.find((p) => p.id === id);
    if (!proj) return;
    updateProj(id, 'bullets', proj.bullets.filter((_, i) => i !== idx));
  };

  /* skills */
  const addSkillCat = () =>
    setData((d) => ({ ...d, skills: [...d.skills, { id: uid(), category: 'New Category', skills: [] }] }));
  const updateSkillCat = (id: string, field: keyof SkillCategory, val: unknown) =>
    setData((d) => ({ ...d, skills: d.skills.map((c) => c.id === id ? { ...c, [field]: val } : c) }));
  const removeSkillCat = (id: string) =>
    setData((d) => ({ ...d, skills: d.skills.filter((c) => c.id !== id) }));
  const addSkill = (id: string, skill: string) => {
    const cat = data.skills.find((c) => c.id === id);
    if (!cat || !skill.trim()) return;
    updateSkillCat(id, 'skills', [...cat.skills, skill.trim()]);
  };
  const removeSkill = (id: string, skillIdx: number) => {
    const cat = data.skills.find((c) => c.id === id);
    if (!cat) return;
    updateSkillCat(id, 'skills', cat.skills.filter((_, i) => i !== skillIdx));
  };

  /* custom sections */
  const addCustom = () =>
    setData((d) => ({ ...d, customSections: [...d.customSections, { id: uid(), title: 'New Section', content: '' }] }));
  const updateCustom = (id: string, field: keyof CustomSection, val: string) =>
    setData((d) => ({ ...d, customSections: d.customSections.map((s) => s.id === id ? { ...s, [field]: val } : s) }));
  const removeCustom = (id: string) =>
    setData((d) => ({ ...d, customSections: d.customSections.filter((s) => s.id !== id) }));

  /* AI bullet rewrite */
  const handleBulletRewrite = async (
    entryId: string,
    bulletIdx: number,
    currentText: string,
    section: 'exp' | 'proj',
  ) => {
    if (!currentText.trim()) return;
    const key = `${entryId}-${bulletIdx}`;
    setRewritingKey(key);

    const prompt = `Rewrite this resume bullet to be stronger, ATS-optimised and JD-aligned.
Start with a strong action verb. Add measurable outcomes if implied. Don't invent facts.
Keep it to 1–2 lines max.

Bullet: ${currentText}
JD context: ${jobDescription.slice(0, 800) || 'Not provided'}

Return ONLY the improved bullet text — no JSON, no quotes, no explanation.`;

    try {
      const improved = (await callGemini(prompt, 250)).trim().replace(/^["']|["']$/g, '');
      if (section === 'exp') updateBullet(entryId, bulletIdx, improved);
      else updateProjBullet(entryId, bulletIdx, improved);
    } catch {
      /* silently fail — user keeps original */
    } finally {
      setRewritingKey(null);
    }
  };

  /* AI smart fill — sends raw resume text to Gemini, gets back structured ResumeData */
  const handleAIFill = async () => {
    if (!resumeText.trim()) return;
    setAiState('filling');
    setAiFillMsg('');

    const prompt = `You are a resume data extractor. Read the resume text below and extract all information into a JSON object.

Return ONLY valid JSON — no markdown fences, no explanation, no comments.

JSON schema (follow exactly):
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1 234 567 8900",
    "location": "City, State / Country",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "website": "yoursite.com"
  },
  "summary": "2-4 sentence professional summary. If absent from the resume, compose one from the candidate's experience and skills.",
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "MMM YYYY",
      "endDate": "MMM YYYY",
      "current": false,
      "location": "City, Country",
      "bullets": ["Strong action-verb achievement sentence with measurable impact"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "B.Tech / B.Sc / M.S. etc.",
      "field": "Computer Science",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "gpa": "9.5 CGPA  (leave empty string if not mentioned)",
      "bullets": []
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "skills": ["Python", "JavaScript"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "tech": "React, Node.js, MongoDB",
      "link": "github.com/user/project  (empty string if not found)",
      "bullets": ["What the project does and its key impact"]
    }
  ],
  "customSections": [
    {
      "title": "Achievements",
      "content": "First achievement\\nSecond achievement"
    }
  ]
}

Rules:
- Leave a field as an empty string if the information is not present — do NOT omit fields
- For linkedin/github strip the https:// prefix; keep only the path (e.g. linkedin.com/in/john)
- If a job has no end date or says "Present", set current:true and endDate:"Present"
- Group skills sensibly (Languages, Frameworks, Tools, Databases, etc.)
- Put Achievements, Certifications, Hobbies, Soft Skills into customSections
- Do NOT include id fields — those are added automatically
- Bullets should be complete sentences, not fragments

Resume text:
${resumeText}`;

    try {
      const raw = await callGemini(prompt, 3500);
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned) as Omit<ResumeData, never>;

      // Stamp fresh IDs onto every array item
      const filled: ResumeData = {
        contact: {
          name: '', email: '', phone: '', location: '',
          linkedin: '', github: '', website: '',
          ...(parsed.contact ?? {}),
        },
        summary: parsed.summary ?? '',
        experience:     (parsed.experience     ?? []).map((e) => ({ ...e, id: uid() })),
        education:      (parsed.education      ?? []).map((e) => ({ ...e, id: uid() })),
        skills:         (parsed.skills         ?? []).map((s) => ({ ...s, id: uid() })),
        projects:       (parsed.projects       ?? []).map((p) => ({ ...p, id: uid() })),
        customSections: (parsed.customSections ?? []).map((c) => ({ ...c, id: uid() })),
      };

      setData(filled);

      // Count filled fields for the success message
      const filledFields = [
        filled.contact.name, filled.contact.email, filled.contact.phone,
        filled.contact.location, filled.contact.linkedin, filled.contact.github,
      ].filter(Boolean).length;
      const sections = [
        filled.experience.length > 0 && 'Experience',
        filled.education.length  > 0 && 'Education',
        filled.skills.length     > 0 && 'Skills',
        filled.projects.length   > 0 && 'Projects',
        filled.customSections.length > 0 && 'Custom',
      ].filter(Boolean);

      setAiFillMsg(`Filled ${filledFields} contact fields · ${sections.join(', ')}`);
      setAiState('done');
      setTimeout(() => setAiState('idle'), 5000);
    } catch (err) {
      console.error('[AI Fill]', err);
      setAiFillMsg('AI fill failed — check console');
      setAiState('error');
      setTimeout(() => setAiState('idle'), 4000);
    }
  };

  const ContactPanel = () => (
    <div className="space-y-3">
      {(Object.keys(data.contact) as Array<keyof typeof data.contact>).map((field) => (
        <Label key={field} text={field.charAt(0).toUpperCase() + field.slice(1)}>
          <Input
            value={data.contact[field]}
            onChange={(e) => setContact(field, e.target.value)}
            className={INP}
            placeholder={
              field === 'linkedin' ? 'linkedin.com/in/yourname' :
              field === 'github'   ? 'github.com/yourname' :
              field === 'website'  ? 'yoursite.com' : ''
            }
          />
        </Label>
      ))}
    </div>
  );

  const SummaryPanel = () => (
    <div className="space-y-2">
      <p className="text-xs text-zinc-400">2–4 sentence professional summary tailored to the JD</p>
      <Textarea
        value={data.summary}
        onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))}
        className={cn(TXA, 'min-h-[100px]')}
        placeholder="Results-driven software engineer with 3+ years building scalable web applications…"
      />
      <p className="text-xs text-zinc-600">{data.summary.length} chars</p>
    </div>
  );

  const ExperiencePanel = () => (
    <div className="space-y-4">
      {data.experience.map((exp, i) => (
        <AccordionItem
          key={exp.id}
          open={openAccordions.has(`exp-${exp.id}`)}
          onToggle={() => toggleAccordion(`exp-${exp.id}`)}
          title={exp.company || exp.role || `Entry ${i + 1}`}
        >
          <div className="grid grid-cols-2 gap-3">
            <Label text="Company">
              <Input value={exp.company} onChange={(e) => updateExp(exp.id, 'company', e.target.value)} className={INP} placeholder="Company Name" />
            </Label>
            <Label text="Role / Title">
              <Input value={exp.role} onChange={(e) => updateExp(exp.id, 'role', e.target.value)} className={INP} placeholder="Senior Engineer" />
            </Label>
            <Label text="Start Date">
              <Input value={exp.startDate} onChange={(e) => updateExp(exp.id, 'startDate', e.target.value)} className={INP} placeholder="Jan 2022" />
            </Label>
            <Label text="End Date">
              <Input value={exp.endDate} onChange={(e) => updateExp(exp.id, 'endDate', e.target.value)} className={INP} placeholder="Present" disabled={exp.current} />
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id={`cur-${exp.id}`} checked={exp.current} onChange={(e) => updateExp(exp.id, 'current', e.target.checked)} className="accent-cyan-500" />
            <label htmlFor={`cur-${exp.id}`} className="text-xs text-zinc-400">Current role</label>
          </div>
          <Label text="Location (optional)">
            <Input value={exp.location} onChange={(e) => updateExp(exp.id, 'location', e.target.value)} className={INP} placeholder="San Francisco, CA" />
          </Label>
          <div className="space-y-2">
            <p className="text-xs text-zinc-400 font-medium">Bullet Points <span className="text-zinc-600 ml-1">— click ✨ to AI-rewrite any bullet</span></p>
            {exp.bullets.map((b, bi) => (
              <BulletRow
                key={bi}
                value={b}
                onChange={(v) => updateBullet(exp.id, bi, v)}
                onDelete={() => removeBullet(exp.id, bi)}
                onRewrite={() => handleBulletRewrite(exp.id, bi, b, 'exp')}
                rewriting={rewritingKey === `${exp.id}-${bi}`}
              />
            ))}
            <Button variant="outline" size="sm" onClick={() => addBullet(exp.id)} className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add Bullet
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => removeExp(exp.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 text-xs">
            <Trash2 className="h-3 w-3 mr-1" /> Remove Entry
          </Button>
        </AccordionItem>
      ))}
      <Button variant="outline" size="sm" onClick={addExp} className="w-full border-dashed border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 h-9">
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Experience Entry
      </Button>
    </div>
  );

  const EducationPanel = () => (
    <div className="space-y-4">
      {data.education.map((edu, i) => (
        <AccordionItem
          key={edu.id}
          open={openAccordions.has(`edu-${edu.id}`)}
          onToggle={() => toggleAccordion(`edu-${edu.id}`)}
          title={edu.institution || `Entry ${i + 1}`}
        >
          <Label text="Institution">
            <Input value={edu.institution} onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)} className={INP} placeholder="University of Technology" />
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Label text="Degree">
              <Input value={edu.degree} onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)} className={INP} placeholder="B.S." />
            </Label>
            <Label text="Field of Study">
              <Input value={edu.field} onChange={(e) => updateEdu(edu.id, 'field', e.target.value)} className={INP} placeholder="Computer Science" />
            </Label>
            <Label text="Start Date">
              <Input value={edu.startDate} onChange={(e) => updateEdu(edu.id, 'startDate', e.target.value)} className={INP} placeholder="Sep 2018" />
            </Label>
            <Label text="End Date">
              <Input value={edu.endDate} onChange={(e) => updateEdu(edu.id, 'endDate', e.target.value)} className={INP} placeholder="Jun 2022" />
            </Label>
          </div>
          <Label text="GPA (optional)">
            <Input value={edu.gpa} onChange={(e) => updateEdu(edu.id, 'gpa', e.target.value)} className={INP} placeholder="3.8" />
          </Label>
          <Button variant="ghost" size="sm" onClick={() => removeEdu(edu.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 text-xs">
            <Trash2 className="h-3 w-3 mr-1" /> Remove
          </Button>
        </AccordionItem>
      ))}
      <Button variant="outline" size="sm" onClick={addEdu} className="w-full border-dashed border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 h-9">
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Education
      </Button>
    </div>
  );

  const SkillsPanel = () => (
      <div className="space-y-4">
        {data.skills.map((cat) => (
          <div key={cat.id} className="border border-white/6 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={cat.category}
                onChange={(e) => updateSkillCat(cat.id, 'category', e.target.value)}
                className={cn(INP, 'flex-1 font-medium')}
                placeholder="Category name"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400 shrink-0" onClick={() => removeSkillCat(cat.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((sk, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-cyan-500/15 border border-cyan-500/25 text-cyan-300 text-xs px-2 py-0.5 rounded-full">
                  {sk}
                  <button onClick={() => removeSkill(cat.id, idx)} className="hover:text-white ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkillInputs[cat.id] ?? ''}
                onChange={(e) => setNewSkillInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSkill(cat.id, newSkillInputs[cat.id] ?? '');
                    setNewSkillInputs((prev) => ({ ...prev, [cat.id]: '' }));
                  }
                }}
                className={cn(INP, 'flex-1')}
                placeholder="Add skill & press Enter"
              />
              <Button size="sm" variant="outline" className="border-white/10 text-zinc-400 hover:text-white h-8"
                onClick={() => {
                  addSkill(cat.id, newSkillInputs[cat.id] ?? '');
                  setNewSkillInputs((prev) => ({ ...prev, [cat.id]: '' }));
                }}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addSkillCat} className="w-full border-dashed border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 h-9">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Category
        </Button>
      </div>
  );

  const ProjectsPanel = () => (
    <div className="space-y-4">
      {data.projects.map((proj, i) => (
        <AccordionItem
          key={proj.id}
          open={openAccordions.has(`proj-${proj.id}`)}
          onToggle={() => toggleAccordion(`proj-${proj.id}`)}
          title={proj.name || `Project ${i + 1}`}
        >
          <Label text="Project Name">
            <Input value={proj.name} onChange={(e) => updateProj(proj.id, 'name', e.target.value)} className={INP} placeholder="My Awesome App" />
          </Label>
          <Label text="Tech Stack">
            <Input value={proj.tech} onChange={(e) => updateProj(proj.id, 'tech', e.target.value)} className={INP} placeholder="React, Node.js, PostgreSQL" />
          </Label>
          <Label text="Link (optional)">
            <Input value={proj.link} onChange={(e) => updateProj(proj.id, 'link', e.target.value)} className={INP} placeholder="github.com/user/repo" />
          </Label>
          <div className="space-y-2">
            <p className="text-xs text-zinc-400 font-medium">Bullet Points</p>
            {proj.bullets.map((b, bi) => (
              <BulletRow
                key={bi}
                value={b}
                onChange={(v) => updateProjBullet(proj.id, bi, v)}
                onDelete={() => removeProjBullet(proj.id, bi)}
                onRewrite={() => handleBulletRewrite(proj.id, bi, b, 'proj')}
                rewriting={rewritingKey === `${proj.id}-${bi}`}
              />
            ))}
            <Button variant="outline" size="sm" onClick={() => addProjBullet(proj.id)} className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add Bullet
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => removeProj(proj.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 text-xs">
            <Trash2 className="h-3 w-3 mr-1" /> Remove
          </Button>
        </AccordionItem>
      ))}
      <Button variant="outline" size="sm" onClick={addProj} className="w-full border-dashed border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 h-9">
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Project
      </Button>
    </div>
  );

  const CustomPanel = () => (
    <div className="space-y-4">
      {data.customSections.map((sec) => (
        <div key={sec.id} className="border border-white/6 rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Input value={sec.title} onChange={(e) => updateCustom(sec.id, 'title', e.target.value)} className={cn(INP, 'flex-1 font-medium')} placeholder="Section title" />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-400" onClick={() => removeCustom(sec.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Textarea value={sec.content} onChange={(e) => updateCustom(sec.id, 'content', e.target.value)} className={cn(TXA, 'min-h-[80px]')} placeholder="Section content…" />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addCustom} className="w-full border-dashed border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 h-9">
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Custom Section
      </Button>
    </div>
  );

  const StylePanel = () => (
    <div className="space-y-5">
      {/* Template */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-400 font-medium">Template</p>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATE_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setStyle((s) => ({ ...s, template: t.value }))}
              className={cn(
                'rounded-lg border p-3 text-left space-y-1 transition-colors',
                style.template === t.value
                  ? 'border-blue-500/60 bg-blue-500/10'
                  : 'border-white/8 bg-white/2 hover:bg-white/4',
              )}
            >
              <p className={cn('text-xs font-semibold', style.template === t.value ? 'text-cyan-300' : 'text-white')}>{t.label}</p>
              <p className="text-[10px] text-zinc-500">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-400 font-medium">Font</p>
        <div className="space-y-1.5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStyle((s) => ({ ...s, font: f.value }))}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors',
                style.font === f.value
                  ? 'border-blue-500/60 bg-blue-500/10 text-cyan-300'
                  : 'border-white/8 bg-white/2 text-zinc-300 hover:bg-white/4',
              )}
            >
              <span>{f.label}</span>
              {style.font === f.value && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-400 font-medium">Accent Colour</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => setStyle((s) => ({ ...s, primaryColor: c.value }))}
              className={cn('h-8 w-8 rounded-full border-2 transition-all', style.primaryColor === c.value ? 'border-white scale-110' : 'border-transparent hover:scale-105')}
              style={{ background: c.value } as CSSProperties}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-zinc-500">Custom:</p>
          <input
            type="color"
            value={style.primaryColor}
            onChange={(e) => setStyle((s) => ({ ...s, primaryColor: e.target.value }))}
            className="h-7 w-12 rounded cursor-pointer bg-transparent border border-white/10"
          />
          <span className="text-xs text-zinc-500 font-mono">{style.primaryColor}</span>
        </div>
      </div>

      {/* Font size */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-400 font-medium">Font Size</p>
        <div className="flex gap-2">
          {([10, 11, 12] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => setStyle((s) => ({ ...s, fontSize: sz }))}
              className={cn(
                'flex-1 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                style.fontSize === sz
                  ? 'border-blue-500/60 bg-blue-500/10 text-cyan-300'
                  : 'border-white/8 text-zinc-400 hover:bg-white/4',
              )}
            >
              {sz}pt
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-400 font-medium">Line Spacing</p>
        <div className="flex gap-2">
          {(['compact', 'normal', 'spacious'] as SpacingOption[]).map((sp) => (
            <button
              key={sp}
              onClick={() => setStyle((s) => ({ ...s, spacing: sp }))}
              className={cn(
                'flex-1 py-1.5 rounded-lg border text-xs font-medium capitalize transition-colors',
                style.spacing === sp
                  ? 'border-blue-500/60 bg-blue-500/10 text-cyan-300'
                  : 'border-white/8 text-zinc-400 hover:bg-white/4',
              )}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── render ─────────────────────────────────────────────────── */

  const renderSidebarContent = () => {
    switch (activeSection) {
      case 'contact':    return ContactPanel();
      case 'summary':    return SummaryPanel();
      case 'experience': return ExperiencePanel();
      case 'education':  return EducationPanel();
      case 'skills':     return SkillsPanel();
      case 'projects':   return ProjectsPanel();
      case 'custom':     return CustomPanel();
      case 'style':      return StylePanel();
      default:           return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f0f12] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0f0f12] shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-white border border-white/10 hover:bg-white/5">
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Analysis
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Palette className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-white">Resume Editor</span>
          <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/20 text-[10px] ml-1">Live Preview</Badge>
        </div>
        <div className="flex-1" />
        {/* AI Smart Fill status message */}
        {aiState !== 'idle' && (
          <p className={cn(
            'text-xs hidden sm:block transition-all',
            aiState === 'filling' && 'text-cyan-300',
            aiState === 'done'    && 'text-emerald-400',
            aiState === 'error'   && 'text-red-400',
          )}>
            {aiState === 'filling' ? 'AI is reading your resume…' : aiFillMsg}
          </p>
        )}
        {aiState === 'idle' && (
          <p className="text-xs text-zinc-500 hidden sm:block">All changes update the preview instantly</p>
        )}
        {/* AI Smart Fill button — only shown when raw resume text is available */}
        {resumeText.trim() && (
          <Button
            onClick={handleAIFill}
            disabled={aiState === 'filling'}
            size="sm"
            className={cn(
              'font-medium transition-all',
              aiState === 'done'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                : aiState === 'error'
                ? 'bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30'
                : 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500/80 hover:to-cyan-500/80 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10',
            )}
          >
            {aiState === 'filling'
              ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Filling…</>
              : aiState === 'done'
              ? <><Check className="h-3.5 w-3.5 mr-1.5" />Filled!</>
              : aiState === 'error'
              ? <><X className="h-3.5 w-3.5 mr-1.5" />Retry Fill</>
              : <><Sparkles className="h-3.5 w-3.5 mr-1.5" />AI Smart Fill</>
            }
          </Button>
        )}
        <Button
          onClick={() => downloadResumePDF(data, style)}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-lg shadow-blue-500/20"
          size="sm"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[400px] shrink-0 flex flex-col border-r border-white/5 bg-[#13131a] overflow-hidden">
          {/* Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide px-2 pt-2 gap-1 shrink-0 border-b border-white/5 pb-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                  activeSection === s.id
                  ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderSidebarContent()}
          </div>
        </div>

        {/* Right preview pane */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 flex justify-center py-8 px-6">
          <div
            id="resume-live-preview"
            className="w-full shadow-2xl shadow-black/60"
            style={{ maxWidth: 760 } as CSSProperties}
          >
            <ResumePreview data={data} style={style} />
          </div>
        </div>
      </div>
    </div>
  );
}
