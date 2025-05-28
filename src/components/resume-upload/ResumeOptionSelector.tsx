
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Edit } from 'lucide-react';

interface ResumeOptionSelectorProps {
  onUploadSelect: () => void;
  onManualSelect: () => void;
}

const ResumeOptionSelector: React.FC<ResumeOptionSelectorProps> = ({ 
  onUploadSelect, 
  onManualSelect 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Choose Your Approach</h2>
        <p className="text-navy-600">
          Upload an existing resume or start from scratch
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onUploadSelect}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-electric-100 rounded-full flex items-center justify-center mb-2">
              <Upload className="w-6 h-6 text-electric-600" />
            </div>
            <CardTitle className="text-lg">Upload Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-navy-600 text-sm mb-4">
              Upload your existing resume and we'll extract the information for you
            </p>
            <Button 
              onClick={onUploadSelect}
              className="w-full bg-electric-500 hover:bg-electric-600"
            >
              Upload Resume
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onManualSelect}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-2">
              <Edit className="w-6 h-6 text-teal-600" />
            </div>
            <CardTitle className="text-lg">Enter Data Manually</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-navy-600 text-sm mb-4">
              Fill out the form step by step to build your resume from scratch
            </p>
            <Button 
              onClick={onManualSelect}
              variant="outline"
              className="w-full border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              Start Fresh
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeOptionSelector;
