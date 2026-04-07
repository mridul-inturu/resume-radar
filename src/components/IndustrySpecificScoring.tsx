import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Code, 
  Briefcase, 
  Heart, 
  GraduationCap, 
  Palette, 
  TrendingUp,
  Building,
  Users,
  DollarSign,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Industry {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  keywords: {
    technical: string[];
    soft: string[];
    tools: string[];
    role: string[];
  };
  scoringWeights: {
    technical: number;
    experience: number;
    education: number;
    projects: number;
  };
}

interface IndustryScore {
  industry: string;
  overallScore: number;
  breakdown: {
    technical: number;
    experience: number;
    education: number;
    projects: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

interface IndustrySpecificScoringProps {
  resumeText: string;
  initialScore: number;
}

export function IndustrySpecificScoring({ resumeText, initialScore }: IndustrySpecificScoringProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('tech');
  const [scores, setScores] = useState<IndustryScore[]>([]);

  const industries: Industry[] = [
    {
      id: 'tech',
      name: 'Technology',
      icon: Code,
      color: 'text-blue-600',
      keywords: {
        technical: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Git', 'SQL', 'MongoDB', 'TypeScript'],
        soft: ['Problem-solving', 'Teamwork', 'Communication', 'Leadership', 'Agile', 'Scrum', 'Critical thinking'],
        tools: ['VS Code', 'Jira', 'Slack', 'GitHub', 'Figma', 'Postman', 'Docker', 'Kubernetes'],
        role: ['Software Engineer', 'Developer', 'Full Stack', 'Frontend', 'Backend', 'DevOps', 'SDE']
      },
      scoringWeights: { technical: 40, experience: 30, education: 15, projects: 15 }
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: DollarSign,
      color: 'text-green-600',
      keywords: {
        technical: ['Financial modeling', 'Excel', 'Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Bloomberg', 'Risk analysis'],
        soft: ['Analytical thinking', 'Attention to detail', 'Communication', 'Negotiation', 'Leadership', 'Teamwork'],
        tools: ['Excel', 'Bloomberg Terminal', 'FactSet', 'Capital IQ', 'Python', 'R', 'Tableau', 'QuickBooks'],
        role: ['Financial Analyst', 'Investment Banking', 'Risk Manager', 'Portfolio Manager', 'Quantitative Analyst']
      },
      scoringWeights: { technical: 35, experience: 35, education: 20, projects: 10 }
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: Heart,
      color: 'text-red-600',
      keywords: {
        technical: ['Medical terminology', 'Patient care', 'Electronic health records', 'Clinical research', 'HIPAA', 'Medical coding'],
        soft: ['Empathy', 'Communication', 'Teamwork', 'Problem-solving', 'Attention to detail', 'Time management'],
        tools: ['Epic Systems', 'Cerner', 'Medical coding software', 'Telemedicine platforms', 'Clinical software'],
        role: ['Registered Nurse', 'Medical Assistant', 'Healthcare Administrator', 'Clinical Research Coordinator']
      },
      scoringWeights: { technical: 30, experience: 40, education: 25, projects: 5 }
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      color: 'text-purple-600',
      keywords: {
        technical: ['Curriculum development', 'Classroom management', 'Educational technology', 'Assessment', 'Lesson planning'],
        soft: ['Patience', 'Communication', 'Leadership', 'Creativity', 'Adaptability', 'Mentoring'],
        tools: ['Learning management systems', 'Google Classroom', 'Zoom', 'Microsoft Teams', 'Educational software'],
        role: ['Teacher', 'Professor', 'Education Coordinator', 'Curriculum Developer', 'Instructional Designer']
      },
      scoringWeights: { technical: 25, experience: 35, education: 30, projects: 10 }
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      color: 'text-pink-600',
      keywords: {
        technical: ['UI/UX design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User research', 'Design systems'],
        soft: ['Creativity', 'Communication', 'Collaboration', 'Problem-solving', 'Attention to detail', 'Time management'],
        tools: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InVision', 'Miro'],
        role: ['UI Designer', 'UX Designer', 'Product Designer', 'Graphic Designer', 'Design Lead']
      },
      scoringWeights: { technical: 35, experience: 25, education: 15, projects: 25 }
    },
    {
      id: 'business',
      name: 'Business',
      icon: Briefcase,
      color: 'text-orange-600',
      keywords: {
        technical: ['Business strategy', 'Market analysis', 'Project management', 'Data analysis', 'Financial planning'],
        soft: ['Leadership', 'Communication', 'Negotiation', 'Strategic thinking', 'Team management', 'Problem-solving'],
        tools: ['Microsoft Office', 'Salesforce', 'HubSpot', 'Asana', 'Trello', 'LinkedIn Sales Navigator'],
        role: ['Business Analyst', 'Project Manager', 'Product Manager', 'Marketing Manager', 'Operations Manager']
      },
      scoringWeights: { technical: 30, experience: 35, education: 20, projects: 15 }
    }
  ];

  const generateIndustryScore = (industry: Industry): IndustryScore => {
    const allKeywords = [
      ...industry.keywords.technical,
      ...industry.keywords.soft,
      ...industry.keywords.tools,
      ...industry.keywords.role
    ];

    const resumeLower = resumeText.toLowerCase();
    const matchedKeywords = allKeywords.filter(keyword => 
      resumeLower.includes(keyword.toLowerCase())
    );

    const missingKeywords = allKeywords.filter(keyword => 
      !resumeLower.includes(keyword.toLowerCase())
    );

    const matchRate = matchedKeywords.length / allKeywords.length;
    
    // Generate scores based on industry weights
    const breakdown = {
      technical: Math.min(100, Math.max(0, (matchRate * 100) + (Math.random() * 20 - 10))),
      experience: Math.min(100, Math.max(0, (matchRate * 90) + (Math.random() * 30 - 15))),
      education: Math.min(100, Math.max(0, (matchRate * 85) + (Math.random() * 25 - 12))),
      projects: Math.min(100, Math.max(0, (matchRate * 95) + (Math.random() * 20 - 10)))
    };

    const overallScore = Math.round(
      breakdown.technical * industry.scoringWeights.technical / 100 +
      breakdown.experience * industry.scoringWeights.experience / 100 +
      breakdown.education * industry.scoringWeights.education / 100 +
      breakdown.projects * industry.scoringWeights.projects / 100
    );

    const recommendations = [
      `Add more ${industry.name.toLowerCase()}-specific technical skills`,
      `Highlight relevant ${industry.name.toLowerCase()} experience`,
      `Include ${industry.name.toLowerCase()} certifications and education`,
      `Showcase ${industry.name.toLowerCase()} projects and achievements`
    ].slice(0, 2 + Math.floor(Math.random() * 2));

    return {
      industry: industry.name,
      overallScore,
      breakdown,
      matchedKeywords: matchedKeywords.slice(0, 8),
      missingKeywords: missingKeywords.slice(0, 5),
      recommendations
    };
  };

  const handleIndustryAnalysis = () => {
    const industry = industries.find(ind => ind.id === selectedIndustry);
    if (industry) {
      const newScore = generateIndustryScore(industry);
      setScores(prev => {
        const filtered = prev.filter(s => s.industry !== industry.name);
        return [...filtered, newScore];
      });
    }
  };

  const currentIndustryData = industries.find(ind => ind.id === selectedIndustry);
  const currentIndustryScore = scores.find(s => s.industry === currentIndustryData?.name);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Industry-Specific Scoring</h3>
        <p className="text-sm text-muted-foreground mt-1">
          See how your resume performs across different industries
        </p>
      </div>

      {/* Industry Selection */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  <div className="flex items-center gap-2">
                    <industry.icon className={cn('h-4 w-4', industry.color)} />
                    {industry.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleIndustryAnalysis} disabled={!selectedIndustry}>
            Analyze
          </Button>
        </div>

        {/* Industry Overview */}
        {currentIndustryData && (
          <Card className="p-4">
            <CardContent className="p-0 space-y-3">
              <div className="flex items-center gap-3">
                <currentIndustryData.icon className={cn('h-6 w-6', currentIndustryData.color)} />
                <div>
                  <h4 className="font-medium">{currentIndustryData.name} Industry</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus: {currentIndustryData.scoringWeights.technical}% Technical, 
                    {currentIndustryData.scoringWeights.experience}% Experience
                  </p>
                </div>
              </div>
              
              {/* Key Keywords */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Key Skills We Look For:</p>
                <div className="flex flex-wrap gap-1">
                  {currentIndustryData.keywords.technical.slice(0, 6).map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Score Results */}
      {currentIndustryScore && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-3xl font-bold text-primary">{currentIndustryScore.overallScore}%</div>
            <p className="text-sm text-muted-foreground">Match for {currentIndustryScore.industry}</p>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Score Breakdown</h4>
            {Object.entries(currentIndustryScore.breakdown).map(([category, score]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{category}</span>
                  <span>{(score as number).toFixed(0)}%</span>
                </div>
                <Progress value={score as number} className="h-2" />
              </div>
            ))}
          </div>

          {/* Keywords */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">Matched Keywords</p>
              <div className="flex flex-wrap gap-1">
                {currentIndustryScore.matchedKeywords.map((keyword) => (
                  <Badge key={keyword} variant="default" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600">Missing Keywords</p>
              <div className="flex flex-wrap gap-1">
                {currentIndustryScore.missingKeywords.map((keyword) => (
                  <Badge key={keyword} variant="destructive" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Recommendations</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {currentIndustryScore.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* All Industries Comparison */}
      {scores.length > 1 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Industry Comparison</h4>
          <div className="space-y-2">
            {scores.map((score) => (
              <div key={score.industry} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">{score.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <Progress value={score.overallScore} className="h-2" />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{score.overallScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
