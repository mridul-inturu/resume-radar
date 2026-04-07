import { useMemo } from 'react';
import type { AnalysisResult } from '@/types/analysis';

interface HeatmapData {
  section: string;
  score: number;
  keywords: string[];
  density: number;
  position: { x: number; y: number; width: number; height: number };
}

interface ResumeHeatmapProps {
  analysisResult: AnalysisResult;
  resumeText: string;
}

export function ResumeHeatmap({ analysisResult, resumeText }: ResumeHeatmapProps) {
  const heatmapData = useMemo((): HeatmapData[] => {
    const sections = ['Summary', 'Skills', 'Experience', 'Projects', 'Education'];
    const jdKeywords = new Set([
      ...analysisResult.jdKeywords.technicalSkills,
      ...analysisResult.jdKeywords.softSkills,
      ...analysisResult.jdKeywords.tools,
      ...analysisResult.jdKeywords.roleKeywords
    ]);

    return sections.map((section, index) => {
      const sectionText = resumeText.split(section)[1]?.split(sections[index + 1] || 'END')[0] || '';
      const sectionKeywords = sectionText.toLowerCase().split(' ').filter(word => 
        jdKeywords.has(word.toLowerCase())
      );
      
      const density = sectionKeywords.length / Math.max(sectionText.split(' ').length, 1) * 100;
      const score = Math.min(100, density * 10 + (sectionText.length % 20));

      return {
        section,
        score,
        keywords: sectionKeywords.slice(0, 5),
        density,
        position: {
          x: 10,
          y: 100 + index * 120,
          width: Math.max(200, sectionText.length / 10),
          height: 80
        }
      };
    });
  }, [analysisResult, resumeText]);

  const maxScore = Math.max(...heatmapData.map(d => d.score));

  const getHeatmapColor = (score: number) => {
    const intensity = score / maxScore;
    if (intensity > 0.7) return 'bg-green-500';
    if (intensity > 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Resume Keyword Heatmap</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Visual density of job-relevant keywords across your resume sections
        </p>
      </div>

      {/* Visual Resume Layout */}
      <div className="relative bg-muted/20 rounded-lg p-4 h-96 overflow-hidden">
        <div className="absolute inset-0">
          {heatmapData.map((data, index) => (
            <div key={data.section} className="relative">
              {/* Section Label */}
              <div 
                className="absolute text-xs font-medium text-muted-foreground"
                style={{ left: data.position.x, top: data.position.y - 20 }}
              >
                {data.section}
              </div>
              
              {/* Heatmap Block */}
              <div
                className={`absolute rounded-md opacity-70 transition-all duration-500 ${getHeatmapColor(data.score)}`}
                style={{
                  left: data.position.x,
                  top: data.position.y,
                  width: `${Math.min(data.position.width, 300)}px`,
                  height: `${data.position.height}px`
                }}
              >
                <div className="p-2 text-white text-xs">
                  <div className="font-semibold">{data.score.toFixed(0)}%</div>
                  <div className="opacity-90">{data.density.toFixed(1)}% density</div>
                </div>
              </div>

              {/* Keywords */}
              <div 
                className="absolute text-xs"
                style={{ 
                  left: data.position.x + data.position.width + 10, 
                  top: data.position.y + 10 
                }}
              >
                {data.keywords.map((keyword, i) => (
                  <span key={i} className="inline-block bg-primary/10 text-primary px-1 py-0.5 rounded mr-1 mb-1">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>High Match (70%+)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Medium Match (40-70%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Low Match (&lt;40%)</span>
        </div>
      </div>
    </div>
  );
}
