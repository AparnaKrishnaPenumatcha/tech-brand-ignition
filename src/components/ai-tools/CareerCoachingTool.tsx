
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAITools } from '@/hooks/useAITools';
import { ResumeData } from '@/utils/resumeProcessing';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Career Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {coaching}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CareerCoachingTool;
