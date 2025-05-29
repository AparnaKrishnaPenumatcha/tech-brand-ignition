
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import FileUpload from './FileUpload';
import LoadingButton from './LoadingButton';
import DemoDataProcessor from './DemoDataProcessor';

interface UploadStepProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadComplete: () => void;
  onBackToSelector: () => void;
}

const UploadStep: React.FC<UploadStepProps> = ({
  file,
  setFile,
  isLoading,
  setIsLoading,
  onFileChange,
  onUploadComplete,
  onBackToSelector
}) => {
  // Check if we're likely in a development environment
  const isDevelopmentEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div className="space-y-4">
      <FileUpload 
        file={file}
        setFile={setFile}
        onFileChange={onFileChange}
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
        onClick={onUploadComplete} 
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
          onClick={onBackToSelector}
          className="text-sm text-navy-500 hover:text-navy-700 underline"
        >
          ← Back to options
        </button>
      </div>
    </div>
  );
};

export default UploadStep;
