
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, Target, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from './types/resumeAnalysis';
import ResumeFeedback from './components/ResumeFeedback';

interface ResumeOptimizerToolProps {
  onBack: () => void;
}

const ResumeOptimizerTool: React.FC<ResumeOptimizerToolProps> = ({ onBack }) => {
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { optimizeResume, loading } = useAITools();
  const { toast } = useToast();

  const parseNestedJson = (text: string) => {
    // Look for JSON within the text
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Failed to parse nested JSON:', e);
        return null;
      }
    }
    return null;
  };

  const transformApiResponseToAnalysisResult = (apiResponse: any): AnalysisResult => {
    console.log('🔄 Transforming API response:', apiResponse);
    
    // Transform improvements from string array to object array
    const improvements = Array.isArray(apiResponse.improvements) 
      ? apiResponse.improvements.map((improvement: string, index: number) => ({
          area: `Improvement ${index + 1}`,
          suggestion: improvement,
          impact: 'Medium'
        }))
      : [];

    // Map missingKeywords to keywordsToAdd
    const keywordsToAdd = apiResponse.missingKeywords || [];

    // Generate a summary from suggestions if not provided
    const summary = apiResponse.summary || 
      (Array.isArray(apiResponse.suggestions) ? apiResponse.suggestions.join(' ') : 
       'Focus on adding more quantifiable achievements and relevant keywords to improve your resume impact.');

    const result: AnalysisResult = {
      overallScore: apiResponse.overallScore || 0,
      strengths: apiResponse.strengths || [],
      improvements,
      keywordsToAdd,
      summary
    };

    console.log('✅ Transformed result:', result);
    return result;
  };

  const handleOptimize = async () => {
    console.log('🔍 Starting resume optimization process...');
    console.log('Target role:', targetRole || 'No target role specified');
    
    try {
      // Get resume data from localStorage
      const storedData = localStorage.getItem('resumeData');
      console.log('📄 Retrieved stored resume data:', storedData ? 'Found' : 'Not found');
      
      const resumeData: ResumeData | null = storedData ? JSON.parse(storedData) : null;
      console.log('📊 Parsed resume data:', resumeData);

      if (!resumeData) {
        console.error('❌ No resume data found in localStorage');
        toast({
          title: "No resume data found",
          description: "Please create your profile first in the Profile Builder.",
          variant: "destructive"
        });
        return;
      }

      console.log('🚀 Calling optimizeResume API...');
      const result = await optimizeResume(resumeData, targetRole);
      console.log('📥 Raw analysis result received:', result);
      
      // Parse the result if it's a string
      let parsedResult = result;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
          console.log('✅ Successfully parsed JSON result:', parsedResult);
        } catch (e) {
          console.error('❌ Failed to parse result as JSON:', e);
          console.log('📝 Using raw string result');
        }
      }

      // Handle nested improvements structure
      if (parsedResult?.improvements && Array.isArray(parsedResult.improvements)) {
        const processedImprovements = [];
        
        for (const improvement of parsedResult.improvements) {
          if (improvement && typeof improvement === 'object') {
            // Check if suggestion contains nested JSON
            if (improvement.suggestion && typeof improvement.suggestion === 'string') {
              const nestedData = parseNestedJson(improvement.suggestion);
              if (nestedData && nestedData.improvements && Array.isArray(nestedData.improvements)) {
                // Replace with the nested improvements
                processedImprovements.push(...nestedData.improvements);
                // Also update other fields if they exist in nested data
                if (nestedData.overallScore) parsedResult.overallScore = nestedData.overallScore;
                if (nestedData.strengths) parsedResult.strengths = nestedData.strengths;
                if (nestedData.keywordsToAdd) parsedResult.keywordsToAdd = nestedData.keywordsToAdd;
                if (nestedData.summary) parsedResult.summary = nestedData.summary;
              } else {
                // Keep original improvement
                processedImprovements.push(improvement);
              }
            } else {
              processedImprovements.push(improvement);
            }
          }
        }
        
        parsedResult.improvements = processedImprovements;
      }
      
      // Transform the API response to match AnalysisResult interface
      const transformedAnalysis = transformApiResponseToAnalysisResult(parsedResult);
      
      console.log('📋 Final analysis result structure:');
      console.log('- Overall Score:', transformedAnalysis.overallScore);
      console.log('- Strengths Count:', transformedAnalysis.strengths.length);
      console.log('- Improvements Count:', transformedAnalysis.improvements.length);
      console.log('- Keywords Count:', transformedAnalysis.keywordsToAdd.length);
      console.log('- Summary Length:', transformedAnalysis.summary.length);
      
      setAnalysis(transformedAnalysis);
      
      toast({
        title: "Analysis complete!",
        description: "Your resume optimization report is ready.",
      });
    } catch (error) {
      console.error('💥 Optimization error occurred:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      toast({
        title: "Analysis failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const hasResumeData = () => {
    const storedData = localStorage.getItem('resumeData');
    return !!storedData;
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Career Tools
        </Button>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Resume Optimizer</h1>
            <p className="text-navy-600">Get AI-powered optimization suggestions for your resume</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Status Check Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="w-5 h-5" />
              Resume Data Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {hasResumeData() ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-medium">Resume data found and ready for analysis</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-700 font-medium">No resume data found. Please create your profile first.</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Settings */}
        <Card className="border-l-4 border-l-electric-500">
          <CardHeader>
            <CardTitle className="text-electric-700">Optimization Settings</CardTitle>
            <p className="text-sm text-gray-600">Customize your analysis parameters</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Target Role (Optional)
              </label>
              <Input
                placeholder="e.g., Senior Software Engineer, Product Manager, Data Analyst"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-electric-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Specify a role to get tailored optimization suggestions
              </p>
            </div>
            <Button 
              onClick={handleOptimize}
              disabled={loading || !hasResumeData()}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Resume...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Analyze & Optimize Resume
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <div className="border-t-4 border-electric-500 pt-6">
              <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                Analysis Results
              </h2>
              <ResumeFeedback feedback={analysis} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeOptimizerTool;
