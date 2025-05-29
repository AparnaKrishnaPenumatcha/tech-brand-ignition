
import React, { useState } from 'react';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import ChatResumeBuilder from '@/components/chat/ChatResumeBuilder';
import BuildProfile from '@/components/resume-upload/BuildProfile';
import { ResumeData } from '@/utils/resumeProcessing';

const ProfileBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [showBuildProfile, setShowBuildProfile] = useState(false);

  const handleChatComplete = (data: ResumeData) => {
    console.log('ProfileBuilder: Chat completed with data:', data);
    setResumeData(data);
    setShowBuildProfile(true);
  };

  const handleBackToChat = () => {
    setShowBuildProfile(false);
    setResumeData(null);
  };

  return (
    <div className="min-h-screen bg-navy-50">
      <GlobalNavigation />
      
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

export default ProfileBuilder;
