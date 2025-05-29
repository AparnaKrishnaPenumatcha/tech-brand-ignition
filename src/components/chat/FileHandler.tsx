

import { processResumeFile } from '@/utils/resumeApiClient';
import { validateResumeFile } from '@/utils/fileValidation';
import { ResumeData } from '@/utils/types/resumeTypes';

interface FileHandlerProps {
  addMessage: (message: any) => void;
  setIsLoading: (loading: boolean) => void;
  setParsedData: (data: Partial<ResumeData>) => void;
  setCurrentStep: (step: any) => void;
  startDataCollection: () => void;
  formatResumeDataSummary: (data: ResumeData) => string;
}

export const useFileHandler = ({
  addMessage,
  setIsLoading,
  setParsedData,
  setCurrentStep,
  startDataCollection,
  formatResumeDataSummary
}: FileHandlerProps) => {
  
  const handleFileUpload = async (file: File, field?: string, callbacks?: {
    setCollectedData: (fn: (prev: any) => any) => void;
    setNestedValue: (obj: any, path: string, value: any) => any;
    askNextQuestion: () => void;
  }) => {
    // Handle profile photo upload
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

    // Handle resume file upload with external API processing
    if (!validateResumeFile(file)) return;
    
    setIsLoading(true);
    addMessage({
      type: 'user',
      content: `Uploaded: ${file.name}`
    });
    
    addMessage({
      type: 'bot',
      content: "Perfect! I'm now processing your resume using our external parser. This might take a moment..."
    });

    try {
      console.log('=== FileHandler: Starting external API resume processing ===');
      const resumeData = await processResumeFile(file);
      console.log('=== FileHandler: External API processing complete ===');
      console.log('=== FULL JSON RESPONSE FROM API ===', JSON.stringify(resumeData, null, 2));
      
      setParsedData(resumeData);
      
      // Enhanced content detection
      console.log('=== FileHandler: Checking content quality ===');
      console.log('Name:', resumeData.personalInfo?.name);
      console.log('Experience count:', resumeData.experience?.length || 0);
      console.log('Skills count:', resumeData.skills?.length || 0);
      console.log('Summary length:', resumeData.summary?.length || 0);
      
      // Check if we got meaningful data - improved logic
      const hasRealName = resumeData.personalInfo?.name && 
                         resumeData.personalInfo.name !== "Your Name" && 
                         resumeData.personalInfo.name.trim().length > 0;
      
      const hasSkills = resumeData.skills && resumeData.skills.length > 3;
      const hasSummary = resumeData.summary && resumeData.summary.length > 50;
      const hasExperience = resumeData.experience && resumeData.experience.length > 0;
      
      const hasContent = hasRealName || hasSkills || hasSummary || hasExperience;
      
      console.log('=== Content Detection Results ===');
      console.log('Has real name:', hasRealName);
      console.log('Has skills:', hasSkills);
      console.log('Has summary:', hasSummary);
      console.log('Has experience:', hasExperience);
      console.log('Overall hasContent:', hasContent);
      
      if (hasContent) {
        console.log('=== FileHandler: Content detected, showing summary ===');
        addMessage({
          type: 'bot',
          content: "Excellent! I've successfully analyzed your resume using our external parser and extracted comprehensive information. Here's what I found:"
        });
        
        const summaryContent = formatResumeDataSummary(resumeData);
        console.log('=== FileHandler: Generated summary content ===', summaryContent);
        
        // Add a small delay to ensure proper message sequencing
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: summaryContent
          });
        }, 100);
        
        console.log('=== FileHandler: Setting current step to upload-summary ===');
        setCurrentStep('upload-summary');
      } else {
        console.log('=== FileHandler: No meaningful content detected, starting data collection ===');
        addMessage({
          type: 'bot',
          content: "I had some difficulty extracting specific information from your resume. No worries - let's collect your information step by step!"
        });
        startDataCollection();
      }
    } catch (error) {
      console.error('=== FileHandler: External API processing failed ===', error);
      addMessage({
        type: 'bot',
        content: "I encountered an issue processing your resume with the external parser, but that's okay! Let's gather your information manually to ensure we capture everything perfectly."
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

