
export interface AnalysisResult {
  overallScore: number;
  strengths: string[];
  improvements: Array<{
    area: string;
    suggestion: string;
    impact: string;
  }>;
  keywordsToAdd: string[];
  summary: string;
}

export interface Improvement {
  area: string;
  suggestion: string;
  impact: string;
}
