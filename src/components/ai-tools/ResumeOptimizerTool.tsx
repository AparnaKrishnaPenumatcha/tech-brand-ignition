
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from './types/resumeAnalysis';
import ScoreCard from './components/ScoreCard';
import StrengthsCard from './components/StrengthsCard';
import ImprovementsCard from './components/ImprovementsCard';
import KeywordsCard from './components/KeywordsCard';

interface ResumeOptimizerToolProps {
  onBack: () => void;
}

const ResumeOptimizerTool: React.FC<ResumeOptimizerToolProps> = ({ onBack }) => {
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { optimizeResume, loading } = useAITools();
  const { toast } = useToast();

  const handleOptimize = async () => {
    try {
      // Get resume data from localStorage
      const storedData = localStorage.getItem('resumeData');
      const resumeData: ResumeData | null = storedData ? JSON.parse(storedData) : null;

      if (!resumeData) {
        toast({
          title: "No resume data found",
          description: "Please create your profile first in the Profile Builder.",
          variant: "destructive"
        });
        return;
      }

      const result = await optimizeResume(resumeData, targetRole);
      console.log('Raw analysis result:', result);
      
      // Parse the result if it's a string
      let parsedResult = result;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (e) {
          console.error('Failed to parse result as JSON:', e);
        }
      }
      
      setAnalysis(parsedResult);
      
      toast({
        title: "Analysis complete!",
        description: "Your resume optimization report is ready.",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Career Tools
        </Button>
        <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-2">
          <Target className="w-8 h-8 text-green-500" />
          Resume Optimizer
        </h1>
        <p className="text-navy-600 mt-2">
          Get AI-powered optimization suggestions for your resume
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Role (Optional)
              </label>
              <Input
                placeholder="e.g., Senior Software Engineer, Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleOptimize}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6">
            <ScoreCard score={analysis.overallScore} summary={analysis.summary} />
            <StrengthsCard strengths={analysis.strengths} />
            <ImprovementsCard improvements={analysis.improvements} />
            <KeywordsCard keywords={analysis.keywordsToAdd} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeOptimizerTool;
