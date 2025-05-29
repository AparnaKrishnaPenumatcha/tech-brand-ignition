
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ChatResumeBuilder from '@/components/chat/ChatResumeBuilder';
import BuildProfile from '@/components/resume-upload/BuildProfile';
import { ResumeData } from '@/utils/resumeProcessing';

const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [showBuildProfile, setShowBuildProfile] = useState(false);
  const navigate = useNavigate();

  const handleChatComplete = (data: ResumeData) => {
    setResumeData(data);
    setShowBuildProfile(true);
  };

  const handleBackToChat = () => {
    setShowBuildProfile(false);
    setResumeData(null);
  };

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-custom flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-navy-900">
            Portfolio<span className="text-electric-500">.</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container-custom max-w-4xl">
          {showBuildProfile && resumeData ? (
            <BuildProfile 
              resumeData={resumeData}
              onBack={handleBackToChat}
            />
          ) : (
            <ChatResumeBuilder onComplete={handleChatComplete} />
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
