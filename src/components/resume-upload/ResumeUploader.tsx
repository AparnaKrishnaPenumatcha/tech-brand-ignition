
import React from 'react';
import ResumeOptionSelector from './ResumeOptionSelector';
import UploadStep from './UploadStep';
import HybridStep from './HybridStep';
import BuildStep from './BuildStep';
import { useUploadFlow } from '@/hooks/use-upload-flow';

const ResumeUploader: React.FC = () => {
  const {
    currentStep,
    finalResumeData,
    file,
    setFile,
    isLoading,
    setIsLoading,
    handleFileChange,
    handleUploadSelect,
    handleManualSelect,
    handleUploadComplete,
    handleHybridComplete,
    handleBackToSelector
  } = useUploadFlow();

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
        <UploadStep
          file={file}
          setFile={setFile}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onFileChange={handleFileChange}
          onUploadComplete={handleUploadComplete}
          onBackToSelector={handleBackToSelector}
        />
      );

    case 'hybrid':
      return (
        <HybridStep
          finalResumeData={finalResumeData}
          onComplete={handleHybridComplete}
          onBackToSelector={handleBackToSelector}
        />
      );

    case 'build':
      return (
        <BuildStep
          finalResumeData={finalResumeData}
          onBack={handleBackToSelector}
        />
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
