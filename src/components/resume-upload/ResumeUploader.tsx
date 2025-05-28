
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import FileUpload from './FileUpload';
import LoadingButton from './LoadingButton';
import DemoDataProcessor from './DemoDataProcessor';
import MissingDataForm from './MissingDataForm';
import { useResumeUpload } from '@/hooks/use-resume-upload';

const ResumeUploader: React.FC = () => {
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

  if (showMissingDataForm && incompleteResumeData) {
    return (
      <div className="w-full max-w-none">
        <MissingDataForm 
          incompleteData={incompleteResumeData}
          onComplete={handleCompleteData}
        />
      </div>
    );
  }

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
        onClick={handleUpload} 
        isLoading={isLoading}
        disabled={!file}
      >
        Generate Portfolio
      </LoadingButton>

      <DemoDataProcessor 
        isLoading={isLoading} 
        setIsLoading={setIsLoading} 
      />
      
      <div className="text-center text-sm text-navy-500">
        <p>
          Your resume data will be processed locally in your browser.
          No data is sent to any server.
        </p>
      </div>
    </div>
  );
};

export default ResumeUploader;
