export interface KeywordExtraction {
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  roleKeywords: string[];
}

export interface MatchScore {
  score: number;
  keywordOverlap: string;
  skillRelevance: string;
  experienceAlignment: string;
}

export interface GapItem {
  keyword: string;
  reason: string;
}

export interface SectionFeedback {
  section: string;
  strength: string;
  weakness: string;
  action: string;
}

export interface ATSSimulation {
  detectedKeywords: string[];
  missedKeywords: { keyword: string; reason: string }[];
}

export interface RewriteSuggestion {
  original: string;
  improved: string;
  explanation: string;
}

export interface AnalysisResult {
  resumeKeywords: KeywordExtraction;
  jdKeywords: KeywordExtraction;
  matchScore: MatchScore;
  gaps: GapItem[];
  sectionFeedback: SectionFeedback[];
  atsSimulation: ATSSimulation;
  rewriteSuggestions: RewriteSuggestion[];
}
