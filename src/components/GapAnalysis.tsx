import type { GapItem } from '@/types/analysis';
import { AlertCircle } from 'lucide-react';

interface GapAnalysisProps {
  gaps: GapItem[];
}

export function GapAnalysis({ gaps }: GapAnalysisProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Gap Analysis</h3>
      <div className="space-y-3">
        {gaps.map((gap, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">{gap.keyword}</span>
              <span className="text-muted-foreground"> — {gap.reason}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
