import type { ATSSimulation } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

interface ATSSimulationCardProps {
  simulation: ATSSimulation;
}

export function ATSSimulationCard({ simulation }: ATSSimulationCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-white">ATS Simulation</h3>
        <p className="text-xs text-zinc-500 mt-1">
          What an automated screening bot detects — and what it silently ignores
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-success" />
            <p className="text-sm font-medium text-zinc-200">Keywords Detected ({simulation.detectedKeywords.length})</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {simulation.detectedKeywords.map((kw) => (
              <Badge key={kw} variant="default" className="text-xs">{kw}</Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="h-4 w-4 text-destructive" />
            <p className="text-sm font-medium text-zinc-200">Keywords Missed ({simulation.missedKeywords.length})</p>
          </div>
          <div className="space-y-2">
            {simulation.missedKeywords.map((item) => (
              <div key={item.keyword} className="flex items-start gap-2 text-sm">
                <Badge variant="destructive" className="text-xs shrink-0">{item.keyword}</Badge>
                <span className="text-zinc-400 text-xs">{item.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
