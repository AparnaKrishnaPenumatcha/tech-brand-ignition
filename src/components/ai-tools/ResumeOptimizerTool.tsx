
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, Target, CheckCircle, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';
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

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
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
            <Card className={`border-2 ${getScoreBadgeColor(analysis.overallScore)}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-500" />
                    Resume Score Analysis
                  </span>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getScoreBadgeColor(analysis.overallScore)} border`}>
                    {getScoreIcon(analysis.overallScore)}
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}/100
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {renderMarkdownText(analysis.summary)}
                </div>
              </CardContent>
            </Card>

            {/* Strengths Card */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <Card className="border-l-4 border-l-green-400">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Your Resume Strengths
                  </CardTitle>
                  <p className="text-sm text-green-600 mt-1">
                    These elements are working well in your resume
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-green-800 leading-relaxed">
                          {renderMarkdownText(strength)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Improvements Card */}
            <Card className="border-l-4 border-l-orange-400">
              <CardHeader>
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Priority Improvements
                </CardTitle>
                <p className="text-sm text-orange-600 mt-1">
                  Focus on these areas to significantly enhance your resume's impact
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {parseImprovements(analysis.improvements).map((improvement, index) => (
                    <div key={index} className="bg-white rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                      {/* Area Header */}
                      <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-orange-800">
                            {improvement.area || `Area ${index + 1}`}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Suggestion */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-blue-500" />
                            <h4 className="font-semibold text-gray-800">Recommendation</h4>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                            <p className="text-gray-700 leading-relaxed">
                              {renderMarkdownText(improvement.suggestion || improvement)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Impact */}
                        {improvement.impact && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Target className="w-5 h-5 text-green-500" />
                              <h4 className="font-semibold text-gray-800">Expected Impact</h4>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                              <p className="text-gray-700 leading-relaxed">
                                {renderMarkdownText(improvement.impact)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
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
                    Strategic Keywords to Add
                  </CardTitle>
                  <p className="text-sm text-blue-600 mt-1">
                    Include these keywords to improve ATS compatibility and relevance
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {analysis.keywordsToAdd.map((keyword, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{keyword}</span>
                      </div>
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
