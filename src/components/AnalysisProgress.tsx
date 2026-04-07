import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  step: string;
}

export function AnalysisProgress({ step }: AnalysisProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <div className="text-center">
        <p className="text-sm font-medium">{step}</p>
        <p className="text-xs text-muted-foreground mt-1">This usually takes 15–30 seconds</p>
      </div>
    </div>
  );
}
