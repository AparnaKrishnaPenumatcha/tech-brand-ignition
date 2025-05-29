
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, Target, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
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
        // If it's just a plain string, wrap it in an object
        return [{
          area: "General Improvement",
          suggestion: improvements,
          impact: "Enhanced resume quality"
        }];
      }
    }
    
    // If it's an object but not an array, try to extract meaningful data
    if (typeof improvements === 'object' && improvements !== null) {
      return Object.entries(improvements).map(([key, value]) => ({
        area: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        suggestion: typeof value === 'string' ? value : JSON.stringify(value),
        impact: "Improved resume effectiveness"
      }));
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
          <div className="space-y-6">
            {/* Overall Score Card */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-500" />
                    Overall Score
                  </span>
                  <div className="flex items-center gap-2">
                    {getScoreIcon(analysis.overallScore)}
                    <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}/100
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 leading-relaxed">
                  {renderMarkdownText(analysis.summary)}
                </div>
              </CardContent>
            </Card>

            {/* Strengths Card */}
            <Card className="border-l-4 border-l-green-400">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  What's Working Well
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800 leading-relaxed">
                        {renderMarkdownText(strength)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvements Card */}
            <Card className="border-l-4 border-l-orange-400">
              <CardHeader>
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Areas for Improvement
                </CardTitle>
                <p className="text-sm text-orange-600 mt-1">
                  Specific recommendations to enhance your resume's impact
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parseImprovements(analysis.improvements).map((improvement, index) => (
                    <div key={index} className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-200">
                      <div className="mb-3">
                        <h4 className="font-semibold text-orange-800 text-lg">
                          {improvement.area || `Improvement ${index + 1}`}
                        </h4>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className="font-medium text-gray-700 mb-2">Suggestion:</h5>
                        <div className="text-sm text-gray-700 leading-relaxed pl-3 border-l-2 border-gray-200">
                          {renderMarkdownText(improvement.suggestion || improvement)}
                        </div>
                      </div>
                      
                      {improvement.impact && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Expected Impact:</h5>
                          <div className="text-sm text-green-700 leading-relaxed pl-3 border-l-2 border-green-200">
                            {renderMarkdownText(improvement.impact)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keywords Card */}
            {analysis.keywordsToAdd && analysis.keywordsToAdd.length > 0 && (
              <Card className="border-l-4 border-l-blue-400">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Recommended Keywords
                  </CardTitle>
                  <p className="text-sm text-blue-600 mt-1">
                    Strategic keywords to improve ATS compatibility and relevance
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordsToAdd.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 hover:bg-blue-200 transition-colors"
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
