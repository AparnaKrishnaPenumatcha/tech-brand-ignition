
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoverLetterToolProps {
  onBack: () => void;
}

const CoverLetterTool: React.FC<CoverLetterToolProps> = ({ onBack }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const { generateCoverLetter, loading } = useAITools();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to generate a cover letter.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get resume data from localStorage
      const storedData = localStorage.getItem('resumeData');
      const resumeData: ResumeData | null = storedData ? JSON.parse(storedData) : null;

      const result = await generateCoverLetter(jobDescription, resumeData);
      setCoverLetter(result);
      
      toast({
        title: "Cover letter generated!",
        description: "Your personalized cover letter is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadCoverLetter = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Career Tools
        </Button>
        <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-500" />
          AI Cover Letter Writer
        </h1>
        <p className="text-navy-600 mt-2">
          Generate personalized cover letters tailored to specific job postings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[300px]"
            />
            <Button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
            >
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Cover Letter
              {coverLetter && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadCoverLetter}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coverLetter ? (
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg min-h-[300px]">
                {coverLetter}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Generated cover letter will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetterTool;
