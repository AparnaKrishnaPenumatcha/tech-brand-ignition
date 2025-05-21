
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { processResumeFile } from '@/utils/resumeApiClient';
import { validatePdfFile } from '@/utils/fileValidation';

export function useResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF resume",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!validatePdfFile(file)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Process the file
      const completeResumeData = await processResumeFile(file!);
      
      // Save to localStorage
      localStorage.setItem('resumeData', JSON.stringify(completeResumeData));
      
      // Navigate to portfolio page
      setIsLoading(false);
      toast({
        title: "Resume processed successfully",
        description: "Building your portfolio...",
      });
      navigate('/portfolio');
    } catch (error) {
      setIsLoading(false);
      console.error("Error processing resume:", error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    file,
    setFile,
    isLoading,
    setIsLoading,
    handleFileChange,
    handleUpload
  };
}
