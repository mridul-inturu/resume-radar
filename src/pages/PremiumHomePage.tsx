import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

// Premium color system
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  accent: {
    50: '#fdf4ff',
    100: '#f3e8ff',
    200: '#e0e7ff',
    300: '#c7d2fe',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#022c22',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e7eb',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    dark: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
  }
};

export function PremiumHomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze your resume against job requirements with industry-specific scoring.',
      color: 'from-violet-500 to-purple-600',
      stats: { value: '95%', label: 'Accuracy' }
    },
    {
      icon: BarChart3,
      title: 'Visual Heatmaps',
      description: 'See keyword density and skill distribution with interactive visualizations.',
      color: 'from-blue-500 to-cyan-500',
      stats: { value: '50+', label: 'Insights' }
    },
    {
      icon: Users,
      title: 'Competitive Intelligence',
      description: 'Compare your resume against thousands of real job applications and candidates.',
      color: 'from-green-500 to-emerald-500',
      stats: { value: '10K+', label: 'Users' }
    },
    {
      icon: Target,
      title: 'Industry-Specific',
      description: 'Get tailored feedback for tech, finance, healthcare, and 6 major industries.',
      color: 'from-orange-500 to-red-500',
      stats: { value: '6', label: 'Industries' }
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is never stored. We analyze and immediately delete your resume.',
      color: 'from-pink-500 to-rose-500',
      stats: { value: '100%', label: 'Secure' }
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      content: 'ResumeIQ helped me optimize my resume and land my dream job. The AI insights were game-changing!',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      company: 'Microsoft',
      content: 'The competitive benchmarking showed me exactly where I stood out. Invaluable tool!',
      avatar: 'MJ',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      company: 'Meta',
      content: 'Industry-specific scoring helped me tailor my resume for data science roles. Got 3 offers!',
      avatar: 'ER',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tl from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

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
                onClick={() => navigate('/login')}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/signup')}
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
            {/* Main Heading */}
            <div className="space-y-4">
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
            </div>

            {/* CTA Buttons */}
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
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    
                    {/* Stats */}
                    {feature.stats && (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold text-slate-800">{feature.stats.value}</span>
                        <span className="text-sm text-slate-500">{feature.stats.label}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Trusted by Professionals
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Join thousands of job seekers who've transformed their careers with ResumeIQ
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-slate-700 font-medium mb-1">
                          {testimonial.name}
                        </p>
                        <p className="text-slate-600 text-sm mb-2">
                          {testimonial.role} at {testimonial.company}
                        </p>
                        <p className="text-slate-600 italic">
                          "{testimonial.content}"
                        </p>
                      </div>
                    </div>
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
