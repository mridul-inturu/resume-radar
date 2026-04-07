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
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
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
      <h3 className="text-lg font-semibold mb-4">JD Keywords vs Your Resume</h3>
      <p className="text-xs text-muted-foreground mb-4">
        <Badge variant="default" className="text-xs mr-1">Matched</Badge> = found in your resume
        <Badge variant="secondary" className="text-xs ml-2 mr-1">Missing</Badge> = not found
      </p>
      <div className="space-y-4">
        <KeywordList label="Technical Skills" keywords={jdKeywords.technicalSkills} matchSet={resumeAll} />
        <KeywordList label="Tools & Technologies" keywords={jdKeywords.tools} matchSet={resumeAll} />
        <KeywordList label="Soft Skills" keywords={jdKeywords.softSkills} matchSet={resumeAll} />
        <KeywordList label="Role-Specific" keywords={jdKeywords.roleKeywords} matchSet={resumeAll} />
      </div>
    </div>
  );
}
