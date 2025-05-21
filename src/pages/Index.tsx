
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ResumeUploader from '@/components/resume-upload/ResumeUploader';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-navy-900">Build Your Portfolio</h1>
              <p className="text-navy-600 mt-2">
                Upload your resume to automatically create a personalized portfolio website
              </p>
            </div>
            
            <ResumeUploader />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
