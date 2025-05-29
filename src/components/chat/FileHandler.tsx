
import React from 'react';
import { processResumeFile, ResumeData } from '@/utils/resumeProcessing';
import { validateResumeFile } from '@/utils/fileValidation';

interface FileHandlerProps {
  addMessage: (message: any) => void;
  setIsLoading: (loading: boolean) => void;
  setParsedData: (data: Partial<ResumeData>) => void;
  setCurrentStep: (step: any) => void;
  setCollectedData: (data: any) => void;
  setNestedValue: (obj: any, path: string, value: any) => any;
  askNextQuestion: () => void;
  startDataCollection: () => void;
  formatResumeDataSummary: (data: ResumeData) => string;
}

export const useFileHandler = ({
  addMessage,
  setIsLoading,
  setParsedData,
  setCurrentStep,
  setCollectedData,
  setNestedValue,
  askNextQuestion,
  startDataCollection,
  formatResumeDataSummary
}: Omit<FileHandlerProps, 'setCollectedData' | 'setNestedValue' | 'askNextQuestion'>) => {
  
  const handleFileUpload = async (file: File, field?: string, callbacks?: {
    setCollectedData: (fn: (prev: any) => any) => void;
    setNestedValue: (obj: any, path: string, value: any) => any;
    askNextQuestion: () => void;
  }) => {
    if (field === 'personalInfo.profilePhoto' && callbacks) {
      const reader = new FileReader();
      reader.onload = () => {
        callbacks.setCollectedData(prev => callbacks.setNestedValue(prev, field, reader.result as string));
        
        addMessage({
          type: 'user',
          content: `Uploaded: ${file.name}`
        });
        
        addMessage({
          type: 'bot',
          content: "Great! I've saved your profile photo. Let's continue with the next question."
        });
        
        callbacks.askNextQuestion();
      };
      reader.readAsDataURL(file);
      return;
    }

    if (!validateResumeFile(file)) return;
    
    setIsLoading(true);
    addMessage({
      type: 'user',
      content: `Uploaded: ${file.name}`
    });
    
    addMessage({
      type: 'bot',
      content: "Processing your resume... This might take a moment."
    });

    try {
      console.log('=== FileHandler: Starting resume processing ===');
      const resumeData = await processResumeFile(file);
      console.log('=== FileHandler: Resume processed successfully ===', resumeData);
      
      setParsedData(resumeData);
      
      addMessage({
        type: 'bot',
        content: "Perfect! I've analyzed your resume and extracted the following information. Please review and let me know if you'd like to edit anything:"
      });
      
      const summaryContent = formatResumeDataSummary(resumeData);
      addMessage({
        type: 'bot',
        content: summaryContent
      });
      
      setCurrentStep('upload-summary');
    } catch (error) {
      console.error('=== FileHandler: Resume processing failed ===', error);
      addMessage({
        type: 'bot',
        content: "I had trouble processing your resume, but don't worry! Let's collect your information manually."
      });
      startDataCollection();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleFileUpload
  };
};
