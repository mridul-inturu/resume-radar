import { useState } from 'react';
import { FileSearch, Shield, Zap, ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeUpload } from '@/components/ResumeUpload';
import { MobileResumeUpload } from '@/components/MobileResumeUpload';
import { MobileLayout } from '@/components/MobileLayout';
import { ScoreCard } from '@/components/ScoreCard';
import { KeywordComparison } from '@/components/KeywordComparison';
import { SectionFeedbackCard } from '@/components/SectionFeedbackCard';
import { ATSSimulationCard } from '@/components/ATSSimulationCard';
import { RewritePanel } from '@/components/RewritePanel';
import { GapAnalysis } from '@/components/GapAnalysis';
import { ResumeHeatmap } from '@/components/ResumeHeatmap';
import { CompetitiveBenchmarking } from '@/components/CompetitiveBenchmarking';
import { UserSuccessTracking } from '@/components/UserSuccessTracking';
import { IndustrySpecificScoring } from '@/components/IndustrySpecificScoring';
import { DemoDataSets } from '@/components/DemoDataSets';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { analyzeResume } from '@/lib/analyze';
import type { AnalysisResult } from '@/types/analysis';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState('');
  const { toast } = useToast();

  const canAnalyze = file && jobDescription.trim().length > 50;

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      setProgressStep('Extracting text from PDF...');
      const extractedText = await extractTextFromPdf(file);
      setResumeText(extractedText);

      if (extractedText.trim().length < 50) {
        toast({
          title: 'Could not extract text',
          description: 'The PDF may be image-based or empty. Try a text-based PDF.',
          variant: 'destructive',
        });
        setIsAnalyzing(false);
        return;
      }

      const analysis = await analyzeResume(extractedText, jobDescription.trim(), setProgressStep);
      setResult(analysis);
    } catch (err: any) {
      toast({
        title: 'Analysis failed',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0"></div>
          </div>
          <AnalysisProgress step={progressStep} />
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <MobileLayout showNewAnalysisButton={true} onNewAnalysis={handleReset}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm md:hidden">
            <div className="mx-auto max-w-5xl flex items-center gap-3 px-4 py-3">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <ArrowLeft className="h-4 w-4 mr-1" /> New Analysis
              </Button>
              <div className="flex-1" />
              <p className="text-xs text-muted-foreground">Your resume data was not stored</p>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
            <ScoreCard matchScore={result.matchScore} />

            {/* NEW: Visual Heatmap */}
            <ResumeHeatmap analysisResult={result} resumeText={resumeText} />

            {/* NEW: Competitive Benchmarking */}
            <CompetitiveBenchmarking analysisResult={result} />

            <div className="grid gap-6 md:grid-cols-2">
              <KeywordComparison 
                resumeKeywords={result.resumeKeywords}
                jdKeywords={result.jdKeywords}
              />
              <GapAnalysis gaps={result.gaps} />
            </div>

            <ATSSimulationCard simulation={result.atsSimulation} />

            <div>
              <h2 className="text-xl font-semibold mb-4">Section-by-Section Feedback</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {result.sectionFeedback.map((fb) => (
                  <SectionFeedbackCard key={fb.section} feedback={fb} />
                ))}
              </div>
            </div>

            {/* NEW: User Success Tracking */}
            <UserSuccessTracking 
              currentScore={result.matchScore.score} 
              analysisCount={Math.floor(Math.random() * 20) + 5}
            />

            {/* NEW: Industry-Specific Scoring */}
            <IndustrySpecificScoring 
              resumeText={resumeText}
              initialScore={result.matchScore.score}
            />

            {/* NEW: Demo Data Sets */}
            <DemoDataSets />

            <RewritePanel suggestions={result.rewriteSuggestions} />
          </main>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero */}
        <div className="mx-auto max-w-3xl px-4 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Shield className="h-3.5 w-3.5" />
            Privacy-first - your resume is never stored
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            ATS Resume Analyzer
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Get recruiter-level feedback on your resume in seconds. See exactly what ATS systems see - and what they miss.
          </p>
        </div>

        {/* Features */}
        <div className="mx-auto max-w-3xl px-4 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileSearch, label: 'Visual Heatmap', desc: 'See keyword density' },
              { icon: Zap, label: 'Benchmarking', desc: 'Compare with peers' },
              { icon: Shield, label: 'Success Tracking', desc: 'Monitor progress' },
              { icon: TrendingUp, label: 'Industry Scoring', desc: 'Role-specific analysis' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center p-4 rounded-xl bg-card border">
                <Icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="mx-auto max-w-3xl px-4 pb-16">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Resume (PDF)</label>
              <div className="hidden md:block">
                <ResumeUpload
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                />
              </div>
              <div className="md:hidden">
                <MobileResumeUpload
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Job Description</label>
              <Textarea
                placeholder="Paste full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[160px] resize-y"
              />
              {jobDescription.length > 0 && jobDescription.length < 50 && (
                <p className="text-xs text-muted-foreground mt-1">Please paste a more complete job description</p>
              )}
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              size="lg"
              className="w-full"
            >
              <FileSearch className="h-4 w-4 mr-2" />
              Analyze Resume
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
