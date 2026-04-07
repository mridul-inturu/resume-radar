import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AnalysisResult } from '@/types/analysis';

interface AnalysisState {
  // Core analysis data
  resumeText: string;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  progressStep: string;
  
  // Multi-analysis types
  heatmapData: Record<string, any> | null;
  benchmarkData: Record<string, any> | null;
  industryScores: Record<string, any> | null;
  userProgress: Record<string, any> | null;
  
  // Advanced features
  analysisHistory: AnalysisResult[];
  currentIndustry: string;
  userProfile: UserProfile | null;
  
  // Actions
  setResumeText: (text: string) => void;
  setJobDescription: (desc: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setProgressStep: (step: string) => void;
  setHeatmapData: (data: any) => void;
  setBenchmarkData: (data: any) => void;
  setIndustryScores: (scores: any) => void;
  setUserProgress: (progress: any) => void;
  addAnalysisToHistory: (result: AnalysisResult) => void;
  setCurrentIndustry: (industry: string) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  resetAnalysis: () => void;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  analysesCount: number;
  createdAt: string;
  lastLogin: string;
}

export const useAnalysisStore = create<AnalysisState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        resumeText: '',
        jobDescription: '',
        analysisResult: null,
        isAnalyzing: false,
        progressStep: '',
        heatmapData: null,
        benchmarkData: null,
        industryScores: null,
        userProgress: null,
        analysisHistory: [],
        currentIndustry: 'tech',
        userProfile: null,

        // Core actions
        setResumeText: (text) => set({ resumeText: text }),
        setJobDescription: (desc) => set({ jobDescription: desc }),
        setAnalysisResult: (result) => set({ analysisResult: result }),
        setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
        setProgressStep: (step) => set({ progressStep: step }),
        
        // Advanced actions
        setHeatmapData: (data) => set({ heatmapData: data }),
        setBenchmarkData: (data) => set({ benchmarkData: data }),
        setIndustryScores: (scores) => set({ industryScores: scores }),
        setUserProgress: (progress) => set({ userProgress: progress }),
        
        addAnalysisToHistory: (result) => set((state) => ({
          analysisHistory: [result, ...state.analysisHistory.slice(0, 9)]
        })),
        
        setCurrentIndustry: (industry) => set({ currentIndustry: industry }),
        setUserProfile: (profile) => set({ userProfile: profile }),
        
        resetAnalysis: () => set({
          analysisResult: null,
          isAnalyzing: false,
          progressStep: '',
          heatmapData: null,
          benchmarkData: null,
          industryScores: null,
          userProgress: null
        })
      }),
      {
        name: 'resumeiq-storage',
        partialize: (state) => ({
          analysisHistory: state.analysisHistory,
          userProfile: state.userProfile,
          currentIndustry: state.currentIndustry
        })
      }
    )
  )
);

// Advanced selectors for complex state operations
export const useAnalysisSelectors = () => {
  const store = useAnalysisStore();
  
  return {
    // Computed values
    hasAnalysis: !!store.analysisResult,
    canAnalyze: store.resumeText.length > 50 && store.jobDescription.length > 50,
    isPremiumUser: store.userProfile?.subscriptionTier !== 'free',
    analysesRemaining: store.userProfile?.subscriptionTier === 'free' 
      ? Math.max(0, 5 - store.analysisHistory.length) 
      : Infinity,
    
    // Advanced selectors
    getLatestAnalysis: () => store.analysisHistory[0] || null,
    getIndustryScore: (industry: string) => store.industryScores?.[industry] || null,
    getProgressPercentage: () => {
      if (!store.userProgress) return 0;
      const completed = store.userProgress.journey?.filter((j: any) => j.status === 'completed').length || 0;
      return (completed / (store.userProgress.journey?.length || 1)) * 100;
    }
  };
};
