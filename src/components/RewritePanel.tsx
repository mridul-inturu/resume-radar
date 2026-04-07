import { useState } from 'react';
import type { RewriteSuggestion } from '@/types/analysis';
import { ArrowRight, Wand2, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { callGeminiJSON } from '@/lib/gemini';

interface RewritePanelProps {
  suggestions: RewriteSuggestion[];
  jobDescription?: string;
}

interface RewriteResult {
  improved: string;
  explanation: string;
  keywordsAdded: string[];
}

export function RewritePanel({ suggestions, jobDescription = '' }: RewritePanelProps) {
  const [customBullet, setCustomBullet] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [customResult, setCustomResult] = useState<RewriteResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCustomRewrite = async () => {
    if (!customBullet.trim()) return;
    setIsRewriting(true);
    setCustomResult(null);
    setError('');

    const prompt = `You are an expert resume writer and ATS specialist.

Rewrite the following resume bullet point to be stronger, more impactful, and better aligned with the job description. 

Rules:
- Preserve truthfulness — never add achievements the candidate didn't have
- Start with a strong past-tense action verb (Led, Built, Reduced, Increased, etc.)
- Add measurable outcomes or quantifiable results where the original implies them
- Incorporate relevant keywords from the JD naturally
- Keep it to 1–2 lines max
- Do NOT invent specific numbers if none are implied

Resume bullet:
${customBullet.trim()}

Job description context (use for keywords):
${jobDescription.slice(0, 1200) || 'Not provided'}

Return ONLY valid JSON (no markdown, no code fences):
{
  "improved": "the rewritten bullet point here",
  "explanation": "2-sentence explanation of what changed and why it is stronger",
  "keywordsAdded": ["keyword1", "keyword2"]
}`;

    try {
      const result = await callGeminiJSON<RewriteResult>(prompt, 500);
      if (!result.improved) throw new Error('No rewrite returned');
      setCustomResult(result);
    } catch (err: any) {
      setError(err.message || 'Rewrite failed. Check your VITE_GOOGLE_AI_API_KEY in .env');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = async () => {
    if (!customResult?.improved) return;
    await navigator.clipboard.writeText(customResult.improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Rewrite Assistant</h3>
        <p className="text-sm text-zinc-500 mt-1">
          Paste any bullet point — Gemini AI rewrites it to be stronger and JD-aligned
        </p>
      </div>

      {/* Interactive rewrite input */}
      <div className="rounded-lg border-2 border-dashed border-indigo-500/25 bg-indigo-500/5 p-4 space-y-3">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
          <Wand2 className="h-3.5 w-3.5" /> Paste any bullet from your resume
        </p>
        <Textarea
          placeholder="e.g. Responsible for developing the backend API for the product..."
          value={customBullet}
          onChange={(e) => setCustomBullet(e.target.value)}
          className="min-h-[80px] text-sm resize-none bg-[#0f0f12] border-white/10 text-zinc-200 placeholder:text-zinc-600"
        />
        <Button
          onClick={handleCustomRewrite}
          disabled={!customBullet.trim() || isRewriting}
          size="sm"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
        >
          {isRewriting ? (
            <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Rewriting with AI...</>
          ) : (
            <><Wand2 className="h-3.5 w-3.5 mr-1.5" /> Rewrite with AI</>
          )}
        </Button>

        {error && (
          <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {customResult && (
          <div className="mt-3 rounded-lg border border-white/8 bg-white/3 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Optimized</p>
                <p className="text-sm font-medium text-white leading-relaxed">{customResult.improved}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0 text-zinc-400 hover:text-white">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            {customResult.keywordsAdded?.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <p className="text-xs text-zinc-500">Keywords added:</p>
                {customResult.keywordsAdded.map((kw) => (
                  <Badge key={kw} variant="default" className="text-xs">{kw}</Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-zinc-500 border-t border-white/8 pt-2">{customResult.explanation}</p>
          </div>
        )}
      </div>

      {/* Pre-generated suggestions from analysis */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">AI suggestions from your analysis</p>
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-lg border border-white/6 bg-white/2 p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1">Original</p>
                <p className="text-sm text-zinc-400">{s.original}</p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-400" />
                <p className="text-xs font-medium text-indigo-400">Optimized</p>
              </div>
              <p className="text-sm font-medium text-white">{s.improved}</p>
              <p className="text-xs text-zinc-500">{s.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
