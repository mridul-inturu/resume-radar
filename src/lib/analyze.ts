import { supabase } from '@/integrations/supabase/client';
import type { AnalysisResult } from '@/types/analysis';

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  onProgress: (step: string) => void
): Promise<AnalysisResult> {
  onProgress('Analyzing resume and job description...');

  const { data, error } = await supabase.functions.invoke('analyze-resume', {
    body: { resumeText, jobDescription },
  });

  if (error) throw new Error(error.message || 'Analysis failed');
  if (!data) throw new Error('No analysis data returned');

  return data as AnalysisResult;
}
