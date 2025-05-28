
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { processResumeFile } from '@/utils/resumeApiClient';
import { validateResumeFile } from '@/utils/fileValidation';

export function useResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMissingDataForm, setShowMissingDataForm] = useState<boolean>(false);
  const [incompleteResumeData, setIncompleteResumeData] = useState<any>(null);
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
      
      // Set the incomplete data for the hybrid form
      setIncompleteResumeData(completeResumeData);
      setShowMissingDataForm(true);
      setIsLoading(false);
      
      toast({
        title: "Resume processed successfully",
        description: "Please review and complete any missing information.",
      });
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

  const handleCompleteData = (completeData: any) => {
    if (completeData) {
      // Save complete data to localStorage
      localStorage.setItem('resumeData', JSON.stringify(completeData));
      
      toast({
        title: "Portfolio data completed",
        description: "Building your portfolio...",
      });
      
      navigate('/portfolio');
    }
  };

  return {
    file,
    setFile,
    isLoading,
    setIsLoading,
    showMissingDataForm,
    incompleteResumeData,
    handleFileChange,
    handleUpload,
    handleCompleteData
  };
}
