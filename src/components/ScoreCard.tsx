import type { MatchScore } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  matchScore: MatchScore;
}

export function ScoreCard({ matchScore }: ScoreCardProps) {
  const { score } = matchScore;
  const tier = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

  const tierStyles = {
    high: 'score-gradient-high',
    medium: 'score-gradient-medium',
    low: 'score-gradient-low',
  };

  const tierLabel = {
    high: 'Strong Match',
    medium: 'Moderate Match',
    low: 'Needs Work',
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-6">
        <div className={cn('flex h-20 w-20 items-center justify-center rounded-2xl text-primary-foreground shrink-0', tierStyles[tier])}>
          <span className="text-2xl font-bold">{score}%</span>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold">ATS Match Score</h3>
            <p className={cn('text-sm font-medium', {
              'text-score-high': tier === 'high',
              'text-score-medium': tier === 'medium',
              'text-score-low': tier === 'low',
            })}>{tierLabel[tier]}</p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Keywords:</span> {matchScore.keywordOverlap}</p>
            <p><span className="font-medium text-foreground">Skills:</span> {matchScore.skillRelevance}</p>
            <p><span className="font-medium text-foreground">Experience:</span> {matchScore.experienceAlignment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
