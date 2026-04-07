import { useEffect, useState } from 'react';
import type { MatchScore } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { TrendingUp, Zap, AlertTriangle, Sparkles } from 'lucide-react';

interface ScoreCardProps { matchScore: MatchScore; }

export function ScoreCard({ matchScore }: ScoreCardProps) {
  const { score } = matchScore;
  const tier = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

  const tierConfig = {
    high:   { label: 'Strong Match',   color: 'text-emerald-400', ringColor: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', icon: TrendingUp,    gradFrom: '#10b981', gradTo: '#34d399', glow: 'shadow-emerald-500/20' },
    medium: { label: 'Moderate Match', color: 'text-amber-400',   ringColor: '#f59e0b', bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   icon: Zap,           gradFrom: '#f59e0b', gradTo: '#fcd34d', glow: 'shadow-amber-500/20'   },
    low:    { label: 'Needs Work',      color: 'text-red-400',     ringColor: '#ef4444', bg: 'bg-red-500/10',     border: 'border-red-500/25',     icon: AlertTriangle, gradFrom: '#ef4444', gradTo: '#f87171', glow: 'shadow-red-500/20'     },
  }[tier];

  const Icon = tierConfig.icon;
  const circumference = 2 * Math.PI * 36;

  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  const dash = (animated / 100) * circumference;

  return (
    <div className={cn(
      'relative rounded-2xl border overflow-hidden bg-gradient-to-br from-[#16161f] to-[#0f0f12]',
      'shadow-2xl shadow-black/40',
      tierConfig.border,
    )}>
      {/* Top glow line */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${tierConfig.ringColor}66, transparent)` }} />
      {/* Ambient blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20"
        style={{ background: tierConfig.gradFrom }} />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">

          {/* Circular gauge */}
          <div className="relative shrink-0 w-32 h-32">
            {/* Outer glow ring */}
            <div className={cn('absolute inset-0 rounded-full blur-lg opacity-30', `shadow-xl ${tierConfig.glow}`)}
              style={{ background: `radial-gradient(circle, ${tierConfig.gradFrom}30, transparent)` }} />
            <svg className="-rotate-90 w-full h-full" viewBox="0 0 80 80">
              {/* Track */}
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
              {/* Progress */}
              <circle
                cx="40" cy="40" r="36"
                fill="none"
                stroke={`url(#sg-${tier})`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
              <defs>
                <linearGradient id={`sg-${tier}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={tierConfig.gradFrom} />
                  <stop offset="100%" stopColor={tierConfig.gradTo} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white tracking-tight">{score}</span>
              <span className="text-[10px] text-zinc-500 font-medium mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-3">
              <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', tierConfig.bg)}>
                <Icon className={cn('h-4.5 w-4.5', tierConfig.color)} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">ATS Match Score</h3>
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
                <p className={cn('text-sm font-semibold', tierConfig.color)}>{tierConfig.label}</p>
              </div>
            </div>

            {/* Sub-score pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { label: 'Keyword Coverage', value: matchScore.keywordOverlap },
                { label: 'Skills Relevance',  value: matchScore.skillRelevance },
                { label: 'Exp. Alignment',    value: matchScore.experienceAlignment },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-white/6 bg-white/3 hover:bg-white/5 transition-colors p-3.5 space-y-1.5">
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{label}</p>
                  <p className="text-zinc-200 text-xs leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
