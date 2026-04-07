import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Heart, 
  Palette,
  Download,
  Eye,
  Copy,
  FileText,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoProfile {
  id: string;
  name: string;
  role: string;
  industry: string;
  experience: string;
  education: string;
  skills: string[];
  currentScore: number;
  targetScore: number;
  story: string;
}

interface JobDescription {
  id: string;
  title: string;
  company: string;
  industry: string;
  level: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

interface DemoDataSetsProps {
  onLoadDemo?: (profile: DemoProfile, jobDescription: JobDescription) => void;
}

export function DemoDataSets({ onLoadDemo }: DemoDataSetsProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>('1');
  const [selectedJob, setSelectedJob] = useState<string>('1');

  const demoProfiles: DemoProfile[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      role: 'Software Engineer',
      industry: 'Technology',
      experience: '3 years',
      education: 'BS Computer Science',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Git'],
      currentScore: 45,
      targetScore: 85,
      story: 'Recent bootcamp graduate struggling to get past ATS filters despite strong project experience.'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Product Manager',
      industry: 'Business',
      experience: '5 years',
      education: 'MBA',
      skills: ['Product Strategy', 'Data Analysis', 'Agile', 'SQL', 'Tableau', 'Leadership'],
      currentScore: 62,
      targetScore: 92,
      story: 'Experienced PM looking to transition to tech company, needs to highlight technical skills.'
    },
    {
      id: '3',
      name: 'Marcus Johnson',
      role: 'Financial Analyst',
      industry: 'Finance',
      experience: '4 years',
      education: 'BS Finance',
      skills: ['Financial Modeling', 'Excel', 'Python', 'SQL', 'Risk Analysis', 'Bloomberg'],
      currentScore: 38,
      targetScore: 88,
      story: 'Finance professional wanting to move into fintech, needs to emphasize technical abilities.'
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      industry: 'Design',
      experience: '2 years',
      education: 'BFA Design',
      skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      currentScore: 55,
      targetScore: 90,
      story: 'Creative designer struggling to quantify design impact and business value.'
    },
    {
      id: '5',
      name: 'Dr. James Kim',
      role: 'Healthcare Administrator',
      industry: 'Healthcare',
      experience: '8 years',
      education: 'PhD Healthcare Administration',
      skills: ['Healthcare Management', 'Policy Analysis', 'Budget Management', 'HIPAA', 'EHR Systems'],
      currentScore: 70,
      targetScore: 94,
      story: 'Healthcare executive transitioning to health tech, needs to bridge clinical and technical experience.'
    },
    {
      id: '6',
      name: 'Lisa Wang',
      role: 'Data Scientist',
      industry: 'Technology',
      experience: '6 years',
      education: 'MS Statistics',
      skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau', 'Deep Learning'],
      currentScore: 78,
      targetScore: 95,
      story: 'Data scientist targeting senior roles at FAANG companies, needs to optimize for specific keywords.'
    }
  ];

  const jobDescriptions: JobDescription[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Google',
      industry: 'Technology',
      level: 'Senior',
      description: `We're looking for a talented Senior Software Engineer to join our core infrastructure team. You'll work on scalable systems that serve billions of users worldwide.

Responsibilities:
- Design and develop large-scale distributed systems
- Write high-quality code that is maintainable and testable
- Collaborate with cross-functional teams to define requirements
- Mentor junior engineers and conduct code reviews
- Participate in architectural decisions and technical strategy

Requirements:
- BS/MS in Computer Science or related field
- 5+ years of software development experience
- Strong proficiency in Python, Java, or C++
- Experience with distributed systems and cloud platforms
- Deep understanding of algorithms and data structures
- Excellent problem-solving and communication skills`,
      requirements: ['5+ years experience', 'Python/Java/C++', 'Distributed systems', 'Cloud platforms', 'Algorithms'],
      keywords: ['Software Engineer', 'Python', 'Java', 'Distributed Systems', 'Cloud', 'Algorithms', 'Data Structures', 'Scalability', 'Infrastructure']
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Microsoft',
      industry: 'Business',
      level: 'Mid',
      description: `Join our Azure product team as a Product Manager and help shape the future of cloud computing.

Responsibilities:
- Define product vision and strategy for Azure services
- Work with engineering teams to deliver high-quality products
- Conduct market research and competitive analysis
- Create detailed product requirements and user stories
- Collaborate with sales and marketing teams

Requirements:
- 3-5 years of product management experience
- Strong analytical and strategic thinking skills
- Experience with cloud technologies or enterprise software
- Excellent communication and leadership abilities
- MBA or equivalent experience preferred`,
      requirements: ['3-5 years PM experience', 'Cloud technologies', 'Analytical skills', 'Leadership', 'MBA preferred'],
      keywords: ['Product Manager', 'Azure', 'Cloud Computing', 'Strategy', 'Analytics', 'Leadership', 'Enterprise Software', 'Market Research']
    },
    {
      id: '3',
      title: 'Financial Analyst',
      company: 'Goldman Sachs',
      industry: 'Finance',
      level: 'Junior',
      description: `Exciting opportunity for a motivated Financial Analyst to join our investment banking division.

Responsibilities:
- Build complex financial models and valuation analyses
- Support M&A transactions and capital raising activities
- Conduct industry research and company analysis
- Prepare client presentations and pitch materials
- Work with senior bankers on deal execution

Requirements:
- Bachelor's degree in Finance, Economics, or related field
- 1-2 years of investment banking or related experience
- Strong financial modeling and Excel skills
- Excellent analytical and quantitative abilities
- Ability to work in fast-paced environment
- Series 79 license or willingness to obtain`,
      requirements: ['Finance degree', '1-2 years experience', 'Financial modeling', 'Excel', 'Analytical skills'],
      keywords: ['Financial Analyst', 'Investment Banking', 'M&A', 'Financial Modeling', 'Valuation', 'Excel', 'Capital Markets', 'Due Diligence']
    },
    {
      id: '4',
      title: 'Senior UX Designer',
      company: 'Meta',
      industry: 'Design',
      level: 'Senior',
      description: `We're seeking a Senior UX Designer to help create intuitive and engaging experiences for our social media platforms.

Responsibilities:
- Lead design projects from concept to completion
- Conduct user research and usability testing
- Create wireframes, prototypes, and high-fidelity designs
- Collaborate with product managers and engineers
- Develop and maintain design systems

Requirements:
- 5+ years of UX design experience
- Strong portfolio demonstrating user-centered design process
- Proficiency in Figma, Sketch, or Adobe Creative Suite
- Experience with user research methodologies
- Understanding of technical constraints and possibilities
- Bachelor's degree in Design or related field`,
      requirements: ['5+ years UX experience', 'Design portfolio', 'Figma/Sketch', 'User research', 'Design systems'],
      keywords: ['UX Designer', 'User Research', 'Prototyping', 'Figma', 'Design Systems', 'Usability Testing', 'User Centered Design', 'Social Media']
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: 'Amazon',
      industry: 'Technology',
      level: 'Senior',
      description: `Join our data science team to build machine learning models that power Amazon's recommendation systems.

Responsibilities:
- Develop and deploy machine learning models at scale
- Analyze large datasets to extract actionable insights
- Design and run A/B tests to validate hypotheses
- Collaborate with engineering teams to productionize models
- Communicate findings to stakeholders across the organization

Requirements:
- PhD or MS in Computer Science, Statistics, or related field
- 4+ years of experience in data science or machine learning
- Strong programming skills in Python and R
- Experience with deep learning frameworks (TensorFlow, PyTorch)
- Proficiency with big data technologies (Spark, Hadoop)
- Excellent communication and presentation skills`,
      requirements: ['PhD/MS in technical field', '4+ years experience', 'Python/R', 'Machine Learning', 'Big Data'],
      keywords: ['Data Scientist', 'Machine Learning', 'Python', 'R', 'TensorFlow', 'PyTorch', 'Big Data', 'Recommendation Systems', 'A/B Testing']
    }
  ];

  const currentProfile = demoProfiles.find(p => p.id === selectedProfile);
  const currentJob = jobDescriptions.find(j => j.id === selectedJob);

  const generateResumeText = (profile: DemoProfile): string => {
    return `${profile.name}
${profile.role} | ${profile.industry}

PROFESSIONAL SUMMARY
Experienced ${profile.role.toLowerCase()} with ${profile.experience} of experience in ${profile.industry.toLowerCase()}. 
${profile.story}

EDUCATION
${profile.education}

EXPERIENCE
${profile.role} | Current Company (2021-Present)
- Led cross-functional teams to deliver successful projects
- Improved operational efficiency by 25% through strategic initiatives
- Collaborated with stakeholders to define project requirements
- Mentored junior team members and conducted performance reviews

SKILLS
${profile.skills.join(', ')}

PROJECTS
- Developed innovative solution that increased user engagement by 40%
- Implemented new processes that reduced costs by 30%
- Led company-wide initiative that improved customer satisfaction`;
  };

  const handleLoadDemo = () => {
    if (currentProfile && currentJob && onLoadDemo) {
      onLoadDemo(currentProfile, currentJob);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'Technology': return Code;
      case 'Finance': return DollarSign;
      case 'Healthcare': return Heart;
      case 'Design': return Palette;
      case 'Business': return Briefcase;
      default: return User;
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Demo Data Sets</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Test ResumeIQ with realistic profiles and job descriptions
        </p>
      </div>

      {/* Profile Selection */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Candidate Profile</label>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a profile" />
            </SelectTrigger>
            <SelectContent>
              {demoProfiles.map((profile) => {
                const Icon = getIndustryIcon(profile.industry);
                return (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {profile.role} - {profile.industry}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Job Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Select Job Description</label>
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a job" />
            </SelectTrigger>
            <SelectContent>
              {jobDescriptions.map((job) => {
                const Icon = getIndustryIcon(job.industry);
                return (
                  <SelectItem key={job.id} value={job.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {job.company} - {job.level}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview Cards */}
      {currentProfile && currentJob && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="p-4">
            <CardContent className="p-0 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {currentProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{currentProfile.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentProfile.role}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {currentProfile.industry}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Score</span>
                  <span className={getScoreColor(currentProfile.currentScore)}>
                    {currentProfile.currentScore}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential Score</span>
                  <span className={getScoreColor(currentProfile.targetScore)}>
                    {currentProfile.targetScore}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium">Top Skills</p>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic">
                "{currentProfile.story}"
              </p>
            </CardContent>
          </Card>

          {/* Job Card */}
          <Card className="p-4">
            <CardContent className="p-0 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{currentJob.title}</h4>
                  <p className="text-sm text-muted-foreground">{currentJob.company}</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {currentJob.industry}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentJob.level}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium">Key Requirements</p>
                <div className="flex flex-wrap gap-1">
                  {currentJob.requirements.slice(0, 3).map((req) => (
                    <Badge key={req} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium">Target Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {currentJob.keywords.slice(0, 4).map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3">
                {currentJob.description.slice(0, 150)}...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleLoadDemo} className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Load Demo Analysis
        </Button>
        <Button variant="outline" onClick={() => {
          if (currentProfile) {
            navigator.clipboard.writeText(generateResumeText(currentProfile));
          }
        }}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Resume
        </Button>
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="text-lg font-bold">{demoProfiles.length}</div>
          <div className="text-xs text-muted-foreground">Demo Profiles</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="text-lg font-bold">{jobDescriptions.length}</div>
          <div className="text-xs text-muted-foreground">Job Descriptions</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="text-lg font-bold">85%</div>
          <div className="text-xs text-muted-foreground">Avg. Improvement</div>
        </div>
      </div>
    </div>
  );
}
