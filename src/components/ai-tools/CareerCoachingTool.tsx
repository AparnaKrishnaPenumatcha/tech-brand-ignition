
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, TrendingUp, Target, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { renderMarkdownText } from './utils/markdownUtils';

interface CareerCoachingToolProps {
  onBack: () => void;
}

const CareerCoachingTool: React.FC<CareerCoachingToolProps> = ({ onBack }) => {
  const [targetRole, setTargetRole] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [coaching, setCoaching] = useState('');
  const { getCareerCoaching, loading } = useAITools();
  const { toast } = useToast();

  const handleGetCoaching = async () => {
    if (!targetRole.trim() || !careerGoals.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both target role and career goals.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get resume data from localStorage
      const storedData = localStorage.getItem('resumeData');
      const resumeData: ResumeData | null = storedData ? JSON.parse(storedData) : null;

      if (!resumeData) {
        toast({
          title: "No profile found",
          description: "Please create your profile first in the Profile Builder.",
          variant: "destructive"
        });
        return;
      }

      const result = await getCareerCoaching(resumeData, targetRole, careerGoals);
      setCoaching(result);
      
      toast({
        title: "Career coaching ready!",
        description: "Your personalized career roadmap is complete.",
      });
    } catch (error) {
      toast({
        title: "Coaching failed",
        description: "Failed to generate career coaching. Please try again.",
        variant: "destructive"
      });
    }
  };

  const parseCoachingContent = (content: string) => {
    const sections = content.split(/(?=###?\s)/);
    return sections.filter(section => section.trim().length > 0);
  };

  const renderSection = (content: string, index: number) => {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const title = lines[0]?.replace(/^#+\s*/, '').trim();
    const body = lines.slice(1);

    const getIcon = (title: string) => {
      if (title.toLowerCase().includes('skill gap')) return Target;
      if (title.toLowerCase().includes('learning') || title.toLowerCase().includes('roadmap')) return BookOpen;
      if (title.toLowerCase().includes('timeline')) return Calendar;
      if (title.toLowerCase().includes('next steps')) return CheckCircle;
      return TrendingUp;
    };

    const IconComponent = getIcon(title);

    return (
      <Card key={index} className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <IconComponent className="w-5 h-5 text-orange-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {body.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              
              // Handle subheadings
              if (trimmedLine.startsWith('####')) {
                return (
                  <h4 key={lineIndex} className="font-semibold text-navy-800 mt-4 mb-2 text-base">
                    {renderMarkdownText(trimmedLine.replace(/^#+\s*/, ''))}
                  </h4>
                );
              }
              
              // Handle bullet points
              if (trimmedLine.startsWith('-')) {
                return (
                  <div key={lineIndex} className="flex items-start gap-2 ml-4">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-navy-700">
                      {renderMarkdownText(trimmedLine.substring(1).trim())}
                    </span>
                  </div>
                );
              }
              
              // Handle numbered lists
              if (/^\d+\./.test(trimmedLine)) {
                return (
                  <div key={lineIndex} className="flex items-start gap-2 ml-4">
                    <span className="text-orange-500 font-medium text-sm mt-0.5 flex-shrink-0">
                      {trimmedLine.match(/^\d+\./)?.[0]}
                    </span>
                    <span className="text-navy-700">
                      {renderMarkdownText(trimmedLine.replace(/^\d+\.\s*/, ''))}
                    </span>
                  </div>
                );
              }
              
              // Handle phase headers (e.g., "Phase 1:")
              if (/^Phase\s+\d+:/i.test(trimmedLine)) {
                return (
                  <div key={lineIndex} className="bg-electric-50 p-3 rounded-lg border-l-4 border-electric-500 mt-3">
                    <h5 className="font-semibold text-electric-700">
                      {renderMarkdownText(trimmedLine)}
                    </h5>
                  </div>
                );
              }
              
              // Handle regular paragraphs
              if (trimmedLine.length > 0) {
                return (
                  <p key={lineIndex} className="text-navy-700 leading-relaxed">
                    {renderMarkdownText(trimmedLine)}
                  </p>
                );
              }
              
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Career Tools
        </Button>
        <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-orange-500" />
          Career Coaching & Skill Gap Analysis
        </h1>
        <p className="text-navy-600 mt-2">
          Get personalized career roadmaps and skill development plans
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Career Goals & Aspirations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Role/Position
              </label>
              <Input
                placeholder="e.g., Senior Engineering Manager, VP of Product"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Career Goals & Timeline
              </label>
              <Textarea
                placeholder="Describe your career goals, timeline, and what you want to achieve..."
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleGetCoaching}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {loading ? 'Analyzing...' : 'Get Career Coaching'}
            </Button>
          </CardContent>
        </Card>

        {coaching && (
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              Your Personalized Career Roadmap
            </h2>
            {parseCoachingContent(coaching).map((section, index) => 
              renderSection(section, index)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerCoachingTool;
