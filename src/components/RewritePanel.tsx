import type { RewriteSuggestion } from '@/types/analysis';
import { ArrowRight } from 'lucide-react';

interface RewritePanelProps {
  suggestions: RewriteSuggestion[];
}

export function RewritePanel({ suggestions }: RewritePanelProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Rewrite Suggestions</h3>
        <p className="text-sm text-muted-foreground mt-1">
          JD-aligned rewrites that preserve your experience truthfully
        </p>
      </div>

      <div className="space-y-4">
        {suggestions.map((s, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Original</p>
              <p className="text-sm">{s.original}</p>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-primary">Optimized</p>
            </div>
            <div>
              <p className="text-sm font-medium">{s.improved}</p>
            </div>
            <p className="text-xs text-muted-foreground">{s.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
