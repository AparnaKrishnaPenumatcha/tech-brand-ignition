
import { processResumeFile, ResumeData } from '@/utils/resumeProcessing';
import { validateResumeFile } from '@/utils/fileValidation';

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

    // Handle resume file upload with OpenAI processing
    if (!validateResumeFile(file)) return;
    
    setIsLoading(true);
    addMessage({
      type: 'user',
      content: `Uploaded: ${file.name}`
    });
    
    addMessage({
      type: 'bot',
      content: "Perfect! I'm now using AI to intelligently extract all information from your resume. This might take a moment..."
    });

    try {
      console.log('=== FileHandler: Starting OpenAI resume processing ===');
      const resumeData = await processResumeFile(file);
      console.log('=== FileHandler: OpenAI processing complete ===', resumeData);
      
      setParsedData(resumeData);
      
      // Check if we got meaningful data
      const hasContent = resumeData.personalInfo.name || 
                        resumeData.experience.length > 0 || 
                        resumeData.skills.length > 0;
      
      if (hasContent) {
        addMessage({
          type: 'bot',
          content: "Excellent! I've successfully analyzed your resume using AI and extracted comprehensive information. Here's what I found:"
        });
        
        const summaryContent = formatResumeDataSummary(resumeData);
        addMessage({
          type: 'bot',
          content: summaryContent
        });
        
        setCurrentStep('upload-summary');
      } else {
        addMessage({
          type: 'bot',
          content: "I had some difficulty extracting information from your resume. No worries - let's collect your information step by step!"
        });
        startDataCollection();
      }
    } catch (error) {
      console.error('=== FileHandler: OpenAI processing failed ===', error);
      addMessage({
        type: 'bot',
        content: "I encountered an issue processing your resume with AI, but that's okay! Let's gather your information manually to ensure we capture everything perfectly."
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
