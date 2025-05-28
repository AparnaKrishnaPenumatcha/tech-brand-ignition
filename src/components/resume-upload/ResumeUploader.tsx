
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import ResumeOptionSelector from './ResumeOptionSelector';
import FileUpload from './FileUpload';
import LoadingButton from './LoadingButton';
import DemoDataProcessor from './DemoDataProcessor';
import MissingDataForm from './MissingDataForm';
import HybridDataForm from './HybridDataForm';
import BuildProfile from './BuildProfile';
import { useResumeUpload } from '@/hooks/use-resume-upload';

type FlowStep = 'selector' | 'upload' | 'manual' | 'hybrid' | 'missing' | 'build';

const ResumeUploader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('selector');
  const [finalResumeData, setFinalResumeData] = useState<any>(null);
  
  const { 
    file, 
    setFile, 
    isLoading, 
    setIsLoading,
    showMissingDataForm,
    incompleteResumeData,
    handleFileChange, 
    handleUpload,
    handleCompleteData
  } = useResumeUpload();

  // Check if we're likely in a development environment
  const isDevelopmentEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const handleUploadSelect = () => {
    setCurrentStep('upload');
  };

  const handleManualSelect = () => {
    setCurrentStep('manual');
  };

  const handleUploadComplete = async () => {
    await handleUpload();
    // After upload processing, check if we need hybrid form
    if (showMissingDataForm && incompleteResumeData) {
      setCurrentStep('hybrid');
    } else {
      setCurrentStep('build');
    }
  };

  const handleManualComplete = (data: any) => {
    setFinalResumeData(data);
    setCurrentStep('build');
  };

  const handleHybridComplete = (data: any) => {
    setFinalResumeData(data);
    setCurrentStep('build');
  };

  const handleBackToSelector = () => {
    setCurrentStep('selector');
    setFile(null);
    setFinalResumeData(null);
  };

  // Handle the existing missing data form flow
  if (showMissingDataForm && incompleteResumeData && currentStep === 'manual') {
    return (
      <div className="w-full max-w-none">
        <MissingDataForm 
          incompleteData={incompleteResumeData}
          onComplete={handleManualComplete}
        />
      </div>
    );
  }

  // Main flow rendering
  switch (currentStep) {
    case 'selector':
      return (
        <ResumeOptionSelector 
          onUploadSelect={handleUploadSelect}
          onManualSelect={handleManualSelect}
        />
      );

    case 'upload':
      return (
        <div className="space-y-4">
          <FileUpload 
            file={file}
            setFile={setFile}
            onFileChange={handleFileChange}
          />
          
          {!isDevelopmentEnvironment && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs text-muted-foreground">
                You're using the hosted app. The resume parser is only available in local development, 
                so your portfolio will be generated with sample data.
              </AlertDescription>
            </Alert>
          )}
          
          <LoadingButton 
            onClick={handleUploadComplete} 
            isLoading={isLoading}
            disabled={!file}
          >
            Process Resume
          </LoadingButton>

          <DemoDataProcessor 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
          
          <div className="text-center">
            <button 
              onClick={handleBackToSelector}
              className="text-sm text-navy-500 hover:text-navy-700 underline"
            >
              ← Back to options
            </button>
          </div>
        </div>
      );

    case 'hybrid':
      return (
        <div className="w-full max-w-none">
          <HybridDataForm 
            parsedData={incompleteResumeData}
            onComplete={handleHybridComplete}
          />
          <div className="text-center mt-4">
            <button 
              onClick={handleBackToSelector}
              className="text-sm text-navy-500 hover:text-navy-700 underline"
            >
              ← Start over
            </button>
          </div>
        </div>
      );

    case 'manual':
      // This will trigger the existing MissingDataForm through the hook
      handleCompleteData(null);
      return null;

    case 'build':
      return (
        <div className="w-full max-w-none">
          <BuildProfile 
            resumeData={finalResumeData || incompleteResumeData}
            onBack={handleBackToSelector}
          />
        </div>
      );

    default:
      return (
        <ResumeOptionSelector 
          onUploadSelect={handleUploadSelect}
          onManualSelect={handleManualSelect}
        />
      );
  }
};

export default ResumeUploader;
