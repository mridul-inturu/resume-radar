export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  bullets: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  tech: string;
  link: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  customSections: CustomSection[];
}

export type ResumeTemplate = 'classic' | 'modern' | 'minimal';
export type ResumeFont = 'inter' | 'georgia' | 'playfair';
export type SpacingOption = 'compact' | 'normal' | 'spacious';

export interface ResumeStyle {
  template: ResumeTemplate;
  font: ResumeFont;
  primaryColor: string;
  fontSize: 10 | 11 | 12;
  spacing: SpacingOption;
}
