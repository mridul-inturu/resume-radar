import type { AnalysisResult } from '@/types/analysis';

export function createMockAnalysis(resumeText: string, jobDescription: string): AnalysisResult {
  // Extract some basic keywords from resume text
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const jobWords = jobDescription.toLowerCase().split(/\s+/);
  
  const commonTechSkills = ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'git', 'sql', 'mongodb', 'typescript'];
  const commonSoftSkills = ['leadership', 'communication', 'teamwork', 'problem-solving', 'collaboration'];
  const commonTools = ['vs code', 'github', 'jira', 'slack', 'figma', 'postman'];
  
  const matchedTech = commonTechSkills.filter(skill => resumeWords.includes(skill));
  const matchedSoft = commonSoftSkills.filter(skill => resumeWords.includes(skill));
  const matchedTools = commonTools.filter(tool => resumeWords.includes(tool));
  
  const matchScore = Math.min(95, Math.max(25, 45 + matchedTech.length * 8 + matchedSoft.length * 5 + matchedTools.length * 6));
  
  return {
    resumeKeywords: {
      technicalSkills: matchedTech,
      softSkills: matchedSoft,
      tools: matchedTools,
      roleKeywords: ['software engineer', 'developer', 'full stack'].filter(role => resumeWords.includes(role))
    },
    jdKeywords: {
      technicalSkills: commonTechSkills,
      softSkills: commonSoftSkills,
      tools: commonTools,
      roleKeywords: ['software engineer', 'developer', 'full stack']
    },
    matchScore: {
      score: matchScore,
      keywordOverlap: `${matchedTech.length + matchedSoft.length + matchedTools.length} keywords matched`,
      skillRelevance: matchedTech.length > 3 ? 'High relevance' : 'Moderate relevance',
      experienceAlignment: 'Good alignment with required experience'
    },
    gaps: [
      ...commonTechSkills.filter(skill => !matchedTech.includes(skill)).slice(0, 3).map(skill => ({
        keyword: skill,
        reason: `This is a key technical skill mentioned in the job description`
      })),
      ...commonSoftSkills.filter(skill => !matchedSoft.includes(skill)).slice(0, 2).map(skill => ({
        keyword: skill,
        reason: `This soft skill is valued for this role`
      }))
    ],
    sectionFeedback: [
      {
        section: 'Summary',
        strength: 'Clear career objective and good length',
        weakness: 'Could be more specific about achievements',
        action: 'Add 2-3 quantifiable achievements with specific technologies'
      },
      {
        section: 'Experience',
        strength: 'Relevant work history with good progression',
        weakness: 'Limited use of action verbs and missing metrics',
        action: 'Start bullets with action verbs and add numbers to show impact'
      },
      {
        section: 'Skills',
        strength: 'Good technical skills list and well organized',
        weakness: 'Could include more modern technologies',
        action: 'Add cloud technologies and recent frameworks'
      }
    ],
    atsSimulation: {
      detectedKeywords: [...matchedTech, ...matchedSoft, ...matchedTools],
      missedKeywords: commonTechSkills.filter(skill => !matchedTech.includes(skill)).slice(0, 3).map(skill => ({
        keyword: skill,
        reason: 'Keyword not found in resume text'
      }))
    },
    rewriteSuggestions: [
      {
        original: 'Responsible for developing applications',
        improved: 'Developed and deployed 15+ applications using React and Node.js',
        explanation: 'Added specific numbers and technologies for impact'
      },
      {
        original: 'Worked on team projects',
        improved: 'Led cross-functional team of 5 developers to deliver projects 20% ahead of schedule',
        explanation: 'Added leadership component and quantifiable results'
      }
    ]
  };
}
