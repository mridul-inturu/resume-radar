import type { SectionFeedback } from '@/types/analysis';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface SectionFeedbackCardProps {
  feedback: SectionFeedback;
}

export function SectionFeedbackCard({ feedback }: SectionFeedbackCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <h4 className="font-semibold text-white text-sm px-2 py-0.5 rounded-md bg-white/5 border border-white/8 inline-block">
        {feedback.section}
      </h4>
      <div className="space-y-3 text-sm">
        <div className="flex gap-2.5">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-zinc-300"><span className="font-medium text-white">Strength: </span>{feedback.strength}</p>
        </div>
        <div className="flex gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-zinc-300"><span className="font-medium text-white">Weakness: </span>{feedback.weakness}</p>
        </div>
        <div className="flex gap-2.5 rounded-lg bg-indigo-500/8 border border-indigo-500/15 p-2.5">
          <ArrowRight className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-indigo-200 text-xs"><span className="font-medium text-indigo-300">Action: </span>{feedback.action}</p>
        </div>
      </div>
    </div>
  );
}
