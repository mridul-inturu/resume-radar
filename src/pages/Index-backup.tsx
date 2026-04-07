import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileSearch, 
  Shield, 
  Zap, 
  TrendingUp, 
  Sparkles,
  Rocket,
  BarChart3,
  Users,
  Target,
  Award,
  BookOpen,
  Briefcase,
  Code,
  Palette,
  Heart,
  GraduationCap,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Globe,
  Cpu,
  Brain,
  Lightbulb
} from 'lucide-react';

export function PremiumHomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze your resume with industry-specific scoring.',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Visual Heatmaps',
      description: 'See keyword density and skill distribution with interactive visualizations.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Competitive Intelligence',
      description: 'Compare your resume against thousands of real job applications.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Industry-Specific',
      description: 'Get tailored feedback for tech, finance, healthcare, and 6 major industries.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is never stored. We analyze and immediately delete your resume.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ResumeIQ
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform Your Resume
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-slate-700">
                with AI-Powered Intelligence
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Get recruiter-level feedback on your resume in seconds. 
              <span className="font-semibold text-blue-600">Advanced AI analysis</span>, 
              <span className="font-semibold text-purple-600">visual heatmaps</span>, and 
              <span className="font-semibold text-pink-600">competitive benchmarking</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/analyze')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-2" />
                Analyze Resume
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo')}
                className="px-8 py-4 text-lg border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 font-semibold transform hover:scale-105 transition-all duration-300"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ResumeIQ</span>?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The most advanced resume analysis platform with enterprise-grade features
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who've landed their dream jobs with AI-powered resume analysis
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/analyze')}
              className="px-12 py-6 text-xl bg-white text-blue-600 font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
