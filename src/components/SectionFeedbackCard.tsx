import type { SectionFeedback } from '@/types/analysis';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface SectionFeedbackCardProps {
  feedback: SectionFeedback;
}

export function SectionFeedbackCard({ feedback }: SectionFeedbackCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
      <h4 className="font-semibold text-base">{feedback.section}</h4>
      <div className="space-y-2.5 text-sm">
        <div className="flex gap-2.5">
          <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
          <p><span className="font-medium">Strength:</span> {feedback.strength}</p>
        </div>
        <div className="flex gap-2.5">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p><span className="font-medium">Weakness:</span> {feedback.weakness}</p>
        </div>
        <div className="flex gap-2.5">
          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p><span className="font-medium">Action:</span> {feedback.action}</p>
        </div>
      </div>
    </div>
  );
}
