import type { KeywordExtraction } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';

interface KeywordComparisonProps {
  resumeKeywords: KeywordExtraction;
  jdKeywords: KeywordExtraction;
}

function KeywordList({ label, keywords, matchSet }: { label: string; keywords: string[]; matchSet: Set<string> }) {
  if (!keywords.length) return null;
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <Badge
            key={kw}
            variant={matchSet.has(kw.toLowerCase()) ? 'default' : 'secondary'}
            className="text-xs"
          >
            {kw}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function KeywordComparison({ resumeKeywords, jdKeywords }: KeywordComparisonProps) {
  const resumeAll = new Set(
    [...resumeKeywords.technicalSkills, ...resumeKeywords.softSkills, ...resumeKeywords.tools, ...resumeKeywords.roleKeywords]
      .map((k) => k.toLowerCase())
  );

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-1">JD Keywords vs Your Resume</h3>
      <div className="text-xs text-zinc-500 mb-4 flex items-center gap-2 flex-wrap">
        <Badge variant="default" className="text-xs">Matched</Badge> = found in your resume
        <Badge variant="secondary" className="text-xs">Missing</Badge> = not found
      </div>
      <div className="space-y-4">
        <KeywordList label="Technical Skills" keywords={jdKeywords.technicalSkills} matchSet={resumeAll} />
        <KeywordList label="Tools & Technologies" keywords={jdKeywords.tools} matchSet={resumeAll} />
        <KeywordList label="Soft Skills" keywords={jdKeywords.softSkills} matchSet={resumeAll} />
        <KeywordList label="Role-Specific" keywords={jdKeywords.roleKeywords} matchSet={resumeAll} />
      </div>
    </div>
  );
}
