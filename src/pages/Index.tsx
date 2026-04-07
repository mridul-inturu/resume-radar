import { useState } from 'react';
import {
  FileSearch, Sparkles, ArrowLeft, Shield, Zap, TrendingUp,
  CheckCircle, Brain, Target, BarChart3, Wand2, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ResumeUpload } from '@/components/ResumeUpload';
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
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { analyzeResume } from '@/lib/analyze';
import { parseResumeText } from '@/lib/resume-parser';
import { ResumeEditor } from '@/components/ResumeEditor';
import type { AnalysisResult } from '@/types/analysis';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [optimizedData, setOptimizedData] = useState<import('@/types/resume').ResumeData | null>(null);
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
    setShowEditor(false);
    setOptimizedData(null);
  };

  const handlePreviewOptimized = (data: import('@/types/resume').ResumeData) => {
    setOptimizedData(data);
    setShowEditor(true);
  };

  if (showEditor && result) {
    const parsedData = optimizedData ?? parseResumeText(resumeText);
    return (
      <ResumeEditor
        initialData={parsedData}
        jobDescription={jobDescription}
        resumeText={resumeText}
        onBack={() => setShowEditor(false)}
      />
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          {/* Animated logo mark */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-10 w-10 text-cyan-400 animate-pulse" />
            </div>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="4" />
              <circle
                cx="40" cy="40" r="36"
                fill="none"
                stroke="url(#spin-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="226"
                strokeDashoffset="56"
                className="origin-center animate-spin"
                style={{ animationDuration: '1.5s' }}
              />
              <defs>
                <linearGradient id="spin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Analysing your resume</h2>
            <p className="text-cyan-300 text-sm font-medium">{progressStep || 'Getting started...'}</p>
            <p className="text-zinc-500 text-xs">Powered by Gemini AI · usually 15–30 seconds</p>
          </div>
          {/* Step indicators */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            {['Extracting PDF', 'Reading JD', 'Matching skills', 'Generating feedback'].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={progressStep ? 'text-cyan-400' : 'text-zinc-600'}>{s}</span>
                {i < 3 && <span className="text-zinc-700">›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen mesh-bg text-white">
        {/* Sticky results header */}
        <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0f0f12]/80 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl flex items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/30">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">ResumeIQ</span>
            </div>
            <div className="flex-1" />
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300">Score: {result.matchScore.score}%</span>
            </div>
            <Badge variant="outline" className="border-white/10 text-zinc-400 text-xs hidden md:flex">
              <Shield className="h-3 w-3 mr-1" /> Not stored
            </Badge>
            <Button
              size="sm"
              onClick={() => setShowEditor(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-lg shadow-blue-500/20 text-xs"
            >
              <Wand2 className="h-3.5 w-3.5 mr-1.5" />
              Customise &amp; Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              New
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
          {/* Top: Score + quick stats */}
          <ScoreCard matchScore={result.matchScore} />

          {/* Keyword match + gap side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <KeywordComparison
              resumeKeywords={result.resumeKeywords}
              jdKeywords={result.jdKeywords}
            />
            <GapAnalysis gaps={result.gaps} />
          </div>

          {/* ATS simulation */}
          <ATSSimulationCard simulation={result.atsSimulation} />

          {/* Section feedback */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <BarChart3 className="h-4.5 w-4.5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Section-by-Section Feedback</h2>
                <p className="text-xs text-zinc-500">Specific, actionable improvements for each resume section</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {result.sectionFeedback.map((fb) => (
                <SectionFeedbackCard key={fb.section} feedback={fb} />
              ))}
            </div>
          </div>

          {/* Rewrite assistant */}
          <RewritePanel suggestions={result.rewriteSuggestions} jobDescription={jobDescription} />

          {/* Heatmap */}
          <ResumeHeatmap analysisResult={result} resumeText={resumeText} />

          {/* Benchmarking */}
          <CompetitiveBenchmarking analysisResult={result} />

          {/* Industry scoring */}
          <IndustrySpecificScoring
            resumeText={resumeText}
            initialScore={result.matchScore.score}
          />

          {/* Next steps + AI auto-fix */}
          <UserSuccessTracking
            currentScore={result.matchScore.score}
            analysisResult={result}
            resumeText={resumeText}
            jobDescription={jobDescription}
            onPreviewOptimized={handlePreviewOptimized}
          />
        </main>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  LANDING PAGE                                                        */
  /* ------------------------------------------------------------------ */
  const SAMPLE_JD = `We are looking for a Software Engineer to join our team.\n\nResponsibilities:\n- Design, develop, and maintain scalable backend services using Python and Node.js\n- Build REST APIs consumed by web and mobile clients\n- Write clean, testable code with proper documentation\n- Collaborate with product and design in an Agile environment\n- Participate in code reviews, debugging, and performance optimisation\n\nRequirements:\n- Bachelor's degree in Computer Science or equivalent practical experience\n- 1–3 years of experience in software development\n- Strong proficiency in Python or JavaScript/TypeScript\n- Experience with React or similar frontend frameworks\n- Familiarity with PostgreSQL, MongoDB\n- Experience with Git and CI/CD pipelines\n\nNice to Have:\n- Experience with AWS, GCP, or Azure\n- Familiarity with Docker and Kubernetes`;

  const features = [
    { icon: Target,    title: 'ATS Match Score',        desc: 'Instantly see what percentage of JD keywords your resume covers (0–100%).' },
    { icon: Eye,       title: 'ATS Simulation',         desc: 'See exactly which keywords a bot detects and which it silently misses.' },
    { icon: BarChart3, title: 'Section Feedback',       desc: 'Strength, weakness and one clear action for every section of your resume.' },
    { icon: Wand2,     title: 'AI Rewrite Assistant',   desc: 'Paste any bullet point — get a JD-aligned rewrite that stays truthful.' },
    { icon: TrendingUp,title: 'Gap Analysis',           desc: 'Missing keywords ranked by how much they matter for the specific role.' },
    { icon: Shield,    title: 'Zero Data Stored',       desc: 'Your resume is processed in memory only and never persisted anywhere.' },
  ];

  return (
    <div className="min-h-screen mesh-bg text-white">
      {/* Noise / grain overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-40" />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-blue-500/18 blur-[140px]" />
        <div className="absolute top-1/3 -right-56 w-[600px] h-[600px] rounded-full bg-fuchsia-500/12 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/12 blur-[100px]" />
        <div className="absolute top-2/3 left-2/3 w-[300px] h-[300px] rounded-full bg-fuchsia-400/8 blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-white/5 bg-[#0f0f12]/70 backdrop-blur-2xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Brain className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-black text-white tracking-tight text-lg">ResumeIQ</span>
            <span className="text-[10px] font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent border border-cyan-500/25 px-2 py-0.5 rounded-full">AI</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-medium">No account &nbsp;&middot;&nbsp; 100% private &nbsp;&middot;&nbsp; Gemini + Groq</span>
          </div>
        </div>
      </nav>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-xs text-cyan-300 font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Gemini AI &amp; Groq LLaMA — Results in under 45 seconds
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            Know exactly why
            <br />
            <span className="text-gradient">
              your resume gets filtered out
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Upload your PDF resume and paste a job description.
            Get an ATS match score, missing keywords, section-by-section feedback,
            <span className="text-white font-medium"> AI-rewritten bullets</span>, and a
            <span className="text-white font-medium"> one-click auto-fix</span> — in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm">
            {['Match score 0–100%', 'Missing keyword list', 'AI bullet rewriter', 'Auto-Fix + Export'].map((item) => (
              <span key={item} className="flex items-center gap-2 text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 inline-block" />
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Main input card */}
        <section className="pb-16">
          <div className="glow-border rounded-2xl bg-white/2 backdrop-blur-sm p-1 shadow-2xl shadow-black/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {/* Left: upload */}
              <div className="rounded-xl bg-[#13131a] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                    <FileSearch className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Upload Resume</h3>
                    <p className="text-xs text-zinc-500">PDF &middot; text-based &middot; max 10 MB</p>
                  </div>
                </div>
                <ResumeUpload
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                />
              </div>

              {/* Right: JD */}
              <div className="rounded-xl bg-[#13131a] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-fuchsia-500/15 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Job Description</h3>
                      <p className="text-xs text-zinc-500">Paste the full JD — the more detail, the better</p>
                    </div>
                  </div>
                  {!jobDescription && (
                    <button
                      type="button"
                      onClick={() => setJobDescription(SAMPLE_JD)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 px-2.5 py-1 rounded-md transition-colors"
                    >
                      Try sample
                    </button>
                  )}
                </div>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[180px] resize-none bg-[#0a0e1a] border-white/8 text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-sm"
                />
                {jobDescription.length > 0 && jobDescription.length < 50 && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5">
                    <span>⚠</span> Please paste a more complete job description (50+ chars)
                  </p>
                )}
              </div>
            </div>

            {/* Analyse button row */}
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 border-t border-white/4">
              <p className="text-xs text-zinc-600 font-medium">
                {file ? <span className="text-zinc-400">✓ {file.name}</span> : 'No file selected'}
                {jobDescription.length >= 50 ? <span className="text-zinc-400 ml-2">&middot; JD ready</span> : ''}
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-bold px-8 shadow-xl shadow-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-base h-12"
              >
                <Sparkles className="h-4.5 w-4.5 mr-2" />
                Analyse My Resume
              </Button>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">Everything a recruiter checks — <span className="text-gradient">revealed</span></h2>
            <p className="text-zinc-500 text-sm max-w-xl mx-auto">No generic advice. Every insight is specific to your resume + the JD you paste.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group glow-border rounded-2xl bg-white/2 hover:bg-white/4 p-5 space-y-3.5 transition-all duration-200 cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 group-hover:bg-cyan-500/15 flex items-center justify-center transition-colors">
                  <Icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-white text-sm">{title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer strip */}
        <footer className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <span className="font-medium">© 2026 ResumeIQ &nbsp;·&nbsp; Built to win</span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> No account required</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Gemini + Groq AI</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> 100% private</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
