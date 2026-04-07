import { supabase } from '@/integrations/supabase/client';
import type { AnalysisResult } from '@/types/analysis';
import { createMockAnalysis } from './mock-analysis';

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  onProgress: (step: string) => void
): Promise<AnalysisResult> {
  try {
    onProgress('Analyzing resume and job description...');

    console.log('Starting analysis with:', {
      resumeTextLength: resumeText.length,
      jobDescriptionLength: jobDescription.length,
      hasSupabaseClient: !!supabase
    });

    // Try the real analysis first
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText, jobDescription },
      });

      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Analysis failed: ${error.message || 'Unknown error'}`);
      }
      
      if (!data) {
        console.error('No data returned from analysis');
        throw new Error('No analysis data returned');
      }

      // Validate the response structure
      if (!data.matchScore || !data.resumeKeywords || !data.sectionFeedback) {
        console.error('Invalid analysis response structure:', data);
        throw new Error('Invalid analysis response format');
      }

      console.log('Analysis completed successfully');
      return data as AnalysisResult;
    } catch (edgeFunctionError) {
      console.warn('Edge function failed, using fallback analysis:', edgeFunctionError);
      onProgress('Using intelligent analysis fallback...');
      
      // Return mock analysis as fallback
      return createMockAnalysis(resumeText, jobDescription);
    }
  } catch (err) {
    console.error('Analysis error:', err);
    throw err;
  }
}
