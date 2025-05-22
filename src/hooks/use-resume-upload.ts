
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { processResumeFile } from '@/utils/resumeApiClient';
import { validateResumeFile } from '@/utils/fileValidation';

export function useResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF or DOCX resume",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!validateResumeFile(file)) {
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
