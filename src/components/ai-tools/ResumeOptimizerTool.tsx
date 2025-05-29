
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeOptimizerToolProps {
  onBack: () => void;
}

interface AnalysisResult {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  const renderMarkdownText = (text: string) => {
    if (!text) return text;
    
    // Replace **text** with bold formatting
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace line breaks
    const withLineBreaks = boldFormatted.replace(/\n/g, '<br />');
    
    return <span dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
  };

  const parseImprovements = (improvements: any) => {
    // If improvements is already an array, return it
    if (Array.isArray(improvements)) {
      return improvements;
    }
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof improvements === 'string') {
      try {
        const parsed = JSON.parse(improvements);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse improvements JSON:', e);
      }
    }
    
    // Fallback: return empty array
    return [];
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
          <div className="space-y-4">
            {/* Overall Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overall Score</span>
                  <div className="flex items-center gap-2">
                    {getScoreIcon(analysis.overallScore)}
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}/100
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">
                  {renderMarkdownText(analysis.summary)}
                </div>
              </CardContent>
            </Card>

            {/* Strengths Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        {renderMarkdownText(strength)}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvements Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">🚀 Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parseImprovements(analysis.improvements).map((improvement, index) => (
                    <div key={index} className="border-l-4 border-orange-200 pl-4">
                      <h4 className="font-medium text-orange-800">
                        {improvement.area || `Improvement ${index + 1}`}
                      </h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {renderMarkdownText(improvement.suggestion || improvement)}
                      </div>
                      {improvement.impact && (
                        <div className="text-xs text-green-600 mt-1">
                          <strong>Expected Impact:</strong> {renderMarkdownText(improvement.impact)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keywords Card */}
            {analysis.keywordsToAdd && analysis.keywordsToAdd.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">🔍 Recommended Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordsToAdd.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
            </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeOptimizerTool;
