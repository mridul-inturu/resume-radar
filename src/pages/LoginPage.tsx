import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Chrome, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Award,
  BookOpen,
  Briefcase,
  Code,
  Palette,
  Heart,
  GraduationCap
} from 'lucide-react';

// Premium color palette
const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  accent: {
    50: '#fdf4ff',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  success: {
    500: '#10b981',
    600: '#059669',
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706',
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
  }
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; stroke=&quot;rgba(139, 92, 246, 0.1)&quot; stroke-width=&quot;1&quot;%3E%3Cpath d=&quot;M30 30c0 16.569-13.431 30-30s13.431-30-30z&quot;/%3E%3Cpath d=&quot;M30 5c0-2.761 2.239-5 5-5s2.239 5z&quot;/%3E%3Cpath d=&quot;M30 55c0 2.761-2.239 5-5s2.239 5z&quot;/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex min-h-screen">
          {/* Left Panel - Login Form */}
          <div className="flex-1 flex flex-col justify-center px-4 py-12">
            <div className="mx-auto w-full max-w-md">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-lg text-white/80">Sign in to your ResumeIQ account</p>
              </div>

              {/* Login Card */}
              <Card className="w-full backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl font-semibold text-center text-white">
                    Sign In
                  </CardTitle>
                  <p className="text-center text-white/70">
                    Access your personalized resume analysis dashboard
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-white">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/50" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-white">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/50" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-0 h-full px-3 hover:bg-white/20"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-white/60" />
                          ) : (
                            <Eye className="h-4 w-4 text-white/60" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-transparent animate-spin rounded-full"></div>
                          Signing In...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Sign In
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-900 px-2 text-white/80">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    disabled={isLoading}
                  >
                    <Chrome className="h-5 w-5 mr-2" />
                    Continue with Google
                  </Button>

                  {/* Links */}
                  <div className="flex items-center justify-between text-sm">
                    <a href="#" className="text-white/80 hover:text-white transition-colors">
                      Forgot password?
                    </a>
                    <a href="#" className="text-white/80 hover:text-white transition-colors">
                      Create account
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <p className="text-center text-white/60 text-sm mt-8">
                By signing in, you agree to our{' '}
                <a href="#" className="underline hover:text-white transition-colors">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Right Panel - Features Showcase */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
            <div className="flex flex-col justify-center px-12 py-12">
              <div className="max-w-md mx-auto space-y-8">
                {/* Feature Cards */}
                {[
                  {
                    icon: Shield,
                    title: 'Privacy First',
                    description: 'Your resume data is never stored. We analyze and delete immediately.',
                    gradient: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: Zap,
                    title: 'AI-Powered',
                    description: 'Advanced AI analysis with industry-specific scoring and insights.',
                    gradient: 'from-purple-500 to-pink-500'
                  },
                  {
                    icon: BarChart3,
                    title: 'Real-time Analytics',
                    description: 'Get instant feedback with visual heatmaps and competitive benchmarking.',
                    gradient: 'from-green-500 to-emerald-500'
                  },
                  {
                    icon: Users,
                    title: 'Industry Insights',
                    description: 'Compare your resume against thousands of real job applications.',
                    gradient: 'from-orange-500 to-red-500'
                  }
                ].map((feature, index) => (
                  <Card key={index} className="backdrop-blur-xl bg-white/10 border-white/20 transform transition-all duration-500 hover:scale-105">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="backdrop-blur-xl bg-white/10 border-white/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">50K+</div>
                    <div className="text-white/80 text-sm">Active Users</div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/10 border-white/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">95%</div>
                    <div className="text-white/80 text-sm">Success Rate</div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/10 border-white/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                    <div className="text-white/80 text-sm">User Rating</div>
                  </div>
                </div>

                {/* Testimonial */}
                <Card className="backdrop-blur-xl bg-white/10 border-white/20 mt-8">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">JD</span>
                      </div>
                      <div>
                        <p className="text-white/90 italic">"ResumeIQ helped me land my dream job at Google. The AI insights were game-changing!"</p>
                        <p className="text-white/70 text-sm">- John Doe, Software Engineer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
