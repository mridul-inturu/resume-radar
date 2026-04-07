import { useState } from 'react';
import { autoFixResume, type FixProgress } from '@/lib/auto-fix';
import type { AnalysisResult } from '@/types/analysis';
import type { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, CheckCircle, ArrowRight, Zap, Eye, Loader2,
  TrendingUp, Star, Target, ChevronRight, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  currentScore:   number;
  analysisResult: AnalysisResult;
  resumeText:     string;
  jobDescription: string;
  onPreviewOptimized: (data: ResumeData) => void;
}

type Phase = 'idle' | 'fixing' | 'done' | 'error';

const STEPS = [
  { n: 1, verb: 'Injecting', label: 'Missing Keywords Added',   icon: Target    },
  { n: 2, verb: 'Applying',  label: 'Weak Bullets Rewritten',   icon: Sparkles  },
  { n: 3, verb: 'Polishing', label: 'Action Verbs Restructured', icon: Zap       },
] as const;

export function UserSuccessTracking({
  currentScore,
  analysisResult,
  resumeText,
  jobDescription,
  onPreviewOptimized,
}: Props) {
  const [phase,    setPhase]    = useState<Phase>('idle');
  const [progress, setProgress] = useState<FixProgress | null>(null);
  const [fixed,    setFixed]    = useState<ResumeData | null>(null);
  const [errMsg,   setErrMsg]   = useState('');

  const tier = currentScore >= 70 ? 'high' : currentScore >= 40 ? 'medium' : 'low';

  const nextSteps =
    tier === 'high'
      ? [
          'Polish 2–3 remaining weak bullets with the Rewrite Assistant',
          'Ensure every section header mirrors exact JD terminology',
          'Add quantified outcomes to any bullets still missing numbers',
        ]
      : tier === 'medium'
      ? [
          'Add the missing keywords highlighted in the Gap Analysis',
          'Rewrite weak bullets to lead with strong action verbs',
          'Restructure your experience for ATS compatibility',
        ]
      : [
          'Add missing JD keywords directly into your Skills section',
          'Rewrite your summary to mirror the job title & requirements',
          'Add a Projects section with results measured in numbers',
        ];

  const estimatedScore = Math.min(currentScore + (tier === 'low' ? 28 : tier === 'medium' ? 18 : 9), 97);

  const handleAutoFix = async () => {
    setPhase('fixing');
    setErrMsg('');
    try {
      const data = await autoFixResume(
        resumeText,
        analysisResult,
        jobDescription,
        (p) => setProgress(p),
      );
      setFixed(data);
      setPhase('done');
    } catch (err: any) {
      setErrMsg(err.message || 'Auto-fix failed. Please try again.');
      setPhase('error');
    }
  };

  const progressPct = progress
    ? progress.step === 1 ? 33
    : progress.step === 2 ? 66
    : 95
    : 10;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-gradient-to-br from-[#16161f] to-[#0f0f12] shadow-2xl shadow-black/40">
      {/* Ambient top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-48 rounded-full bg-indigo-600/10 blur-[80px] pointer-events-none" />

      <div className="relative p-7 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Resume Optimizer</h3>
              <Badge className="bg-indigo-500/15 text-indigo-300 border-indigo-500/20 text-[10px]">Auto-Fix</Badge>
            </div>
            <p className="text-sm text-zinc-500">
              Let AI fix your resume automatically — adds keywords, rewrites bullets, restructures for ATS
            </p>
          </div>

          <div className={cn(
            'shrink-0 text-sm font-bold px-3 py-1.5 rounded-full border',
            tier === 'high'   && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            tier === 'medium' && 'bg-amber-500/10   text-amber-400   border-amber-500/20',
            tier === 'low'    && 'bg-red-500/10     text-red-400     border-red-500/20',
          )}>
            {currentScore}%
          </div>
        </div>

        {/* ── IDLE: next steps + CTA ── */}
        {phase === 'idle' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STEPS.map((s) => (
                <div key={s.n} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/2 p-3.5 group hover:bg-white/4 hover:border-indigo-500/25 transition-all">
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <s.icon className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{s.label}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{nextSteps[s.n - 1]}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Estimate bar */}
            <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Projected score after auto-fix</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-400 line-through">{currentScore}%</span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                  <span className="text-lg font-bold text-emerald-400">~{estimatedScore}%</span>
                </div>
              </div>
              <div className="relative h-2 bg-white/6 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${estimatedScore}%` }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-white/20"
                  style={{ left: `${currentScore}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Based on missing keyword count and bullet quality analysis</p>
            </div>

            <Button
              onClick={handleAutoFix}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-indigo-500/25 border border-indigo-500/30 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Auto-Fix My Resume with AI
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </>
        )}

        {/* ── FIXING: animated progress ── */}
        {phase === 'fixing' && (
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-indigo-400 animate-spin shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{progress?.label ?? 'Initialising…'}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{progress?.detail}</p>
              </div>
            </div>

            <Progress value={progressPct} className="h-1.5 bg-white/5" />

            <div className="grid grid-cols-3 gap-3">
              {STEPS.map((s) => {
                const done    = (progress?.step ?? 0) > s.n;
                const active  = progress?.step === s.n;
                const pending = (progress?.step ?? 0) < s.n;
                return (
                  <div key={s.n} className={cn(
                    'rounded-xl border p-3.5 transition-all',
                    done    && 'border-emerald-500/30 bg-emerald-500/8',
                    active  && 'border-indigo-500/40 bg-indigo-500/10',
                    pending && 'border-white/5 bg-white/2 opacity-50',
                  )}>
                    <div className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center mb-2',
                      done   && 'bg-emerald-500/20',
                      active && 'bg-indigo-500/20',
                    )}>
                      {done
                        ? <Check className="h-4 w-4 text-emerald-400" />
                        : active
                        ? <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                        : <s.icon className="h-3.5 w-3.5 text-zinc-600" />
                      }
                    </div>
                    <p className={cn('text-xs font-semibold', done ? 'text-emerald-400' : active ? 'text-indigo-300' : 'text-zinc-600')}>
                      Step {s.n}
                    </p>
                    <p className={cn('text-[11px] mt-0.5', done || active ? 'text-zinc-400' : 'text-zinc-600')}>
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DONE: completion state + CTA ── */}
        {phase === 'done' && fixed && (
          <div className="space-y-5">
            {/* Completion banner */}
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Your resume has been fully optimized!</p>
                  <p className="text-xs text-zinc-400 mt-0.5">All 3 AI improvements applied successfully</p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                  <p className="text-xs text-zinc-500">Est. new score</p>
                  <p className="text-2xl font-bold text-emerald-400">~{estimatedScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {STEPS.map((s) => (
                  <div key={s.n} className="flex items-center gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-300">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shortlist confidence */}
            <div className="rounded-xl border border-white/6 bg-white/2 p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                <Star className="h-6 w-6 text-white fill-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Shortlist-Ready Resume</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  ATS keywords injected · Bullets lead with action verbs · Optimised for human review
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-400 shrink-0" />
            </div>

            <Button
              onClick={() => onPreviewOptimized(fixed)}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-400 hover:to-indigo-400 text-white shadow-xl shadow-emerald-500/20 border border-emerald-500/25 transition-all"
            >
              <Eye className="h-5 w-5 mr-2" />
              Preview &amp; Download Your Optimized Resume
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <p className="text-center text-[11px] text-zinc-600">
              Opens the Resume Editor with all AI improvements pre-applied · Export as PDF
            </p>
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === 'error' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-400">
              {errMsg}
            </div>
            <Button variant="outline" onClick={() => setPhase('idle')} className="border-white/10 text-zinc-300">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
