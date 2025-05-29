
import React, { useState } from 'react';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Target, 
  MessageCircle, 
  TrendingUp,
  Sparkles,
  Brain
} from 'lucide-react';
import CoverLetterTool from '@/components/ai-tools/CoverLetterTool';
import ResumeOptimizerTool from '@/components/ai-tools/ResumeOptimizerTool';
import MockInterviewTool from '@/components/ai-tools/MockInterviewTool';
import CareerCoachingTool from '@/components/ai-tools/CareerCoachingTool';

type ToolType = 'cover-letter' | 'optimizer' | 'interview' | 'coaching' | null;

const CareerTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);

  const tools = [
    {
      id: 'cover-letter' as const,
      title: 'AI Cover Letter Writer',
      description: 'Generate personalized cover letters for any role with AI assistance',
      icon: FileText,
      badge: 'Generate',
      color: 'bg-blue-500'
    },
    {
      id: 'optimizer' as const,
      title: 'Resume/Portfolio Optimizer',
      description: 'Real-time AI scoring and optimization suggestions for your content',
      icon: Target,
      badge: 'Optimize',
      color: 'bg-green-500'
    },
    {
      id: 'interview' as const,
      title: 'AI Mock Interviewer',
      description: 'Practice interviews with AI for technical and behavioral questions',
      icon: MessageCircle,
      badge: 'Practice',
      color: 'bg-purple-500'
    },
    {
      id: 'coaching' as const,
      title: 'Career Coaching & Skill Gap Analysis',
      description: 'Get personalized career roadmaps and skill development plans',
      icon: TrendingUp,
      badge: 'Analyze',
      color: 'bg-orange-500'
    }
  ];

  const renderTool = () => {
    switch (selectedTool) {
      case 'cover-letter':
        return <CoverLetterTool onBack={() => setSelectedTool(null)} />;
      case 'optimizer':
        return <ResumeOptimizerTool onBack={() => setSelectedTool(null)} />;
      case 'interview':
        return <MockInterviewTool onBack={() => setSelectedTool(null)} />;
      case 'coaching':
        return <CareerCoachingTool onBack={() => setSelectedTool(null)} />;
      default:
        return null;
    }
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-navy-50">
        <GlobalNavigation />
        <main className="py-12">
          <div className="container-custom max-w-4xl">
            {renderTool()}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <GlobalNavigation />
      
      <main className="py-12">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-electric-500" />
              <h1 className="text-4xl font-bold text-navy-900">
                AI-Powered Career Tools
              </h1>
            </div>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              Leverage cutting-edge artificial intelligence to accelerate your career growth, 
              optimize your professional presence, and land your dream role.
            </p>
            <Badge className="mt-4 bg-electric-500 text-white">
              Powered by OpenAI GPT-4
            </Badge>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-electric-500 group cursor-pointer"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${tool.color} text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{tool.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {tool.badge}
                          </Badge>
                        </div>
                        <p className="text-navy-600">{tool.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-electric-500 hover:bg-electric-600 text-white group-hover:bg-electric-600 transition-colors"
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      Launch Tool
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Preview */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-navy-900 text-center mb-8">
              What Makes Our AI Tools Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-electric-500" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">Real-Time Analysis</h3>
                <p className="text-sm text-navy-600">
                  Get instant feedback and optimization suggestions as you work
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-electric-500" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">Personalized Insights</h3>
                <p className="text-sm text-navy-600">
                  AI learns from your profile to provide tailored recommendations
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-electric-500" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">Industry Leading</h3>
                <p className="text-sm text-navy-600">
                  Powered by the latest OpenAI models for optimal results
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerTools;
