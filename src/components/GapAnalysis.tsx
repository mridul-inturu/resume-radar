import type { GapItem } from '@/types/analysis';
import { AlertCircle } from 'lucide-react';

interface GapAnalysisProps {
  gaps: GapItem[];
}

export function GapAnalysis({ gaps }: GapAnalysisProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-1">Gap Analysis</h3>
      <p className="text-xs text-zinc-500 mb-4">Keywords in the JD that are missing from your resume</p>
      <div className="space-y-2.5">
        {gaps.map((gap, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-red-300">{gap.keyword}</span>
              <span className="text-zinc-400"> — {gap.reason}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
