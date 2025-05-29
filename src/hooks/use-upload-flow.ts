
import { useState } from 'react';
import { useResumeUpload } from './use-resume-upload';

export type FlowStep = 'selector' | 'upload' | 'manual' | 'hybrid' | 'build';

export const useUploadFlow = () => {
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

  const handleUploadSelect = () => {
    setCurrentStep('upload');
  };

  const handleManualSelect = () => {
    // Create empty resume data structure for manual entry
    const emptyResumeData = {
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        about: ""
      },
      summary: "",
      education: [
        {
          degree: "",
          institution: "",
          year: ""
        }
      ],
      experience: [
        {
          title: "",
          company: "",
          duration: "",
          description: ""
        }
      ],
      projects: [
        {
          title: "",
          description: "",
          tags: []
        }
      ],
      skills: [
        { name: "", level: 80, category: "Other" }
      ],
      certifications: [
        {
          name: "",
          issuer: "",
          year: ""
        }
      ],
      fileName: "manual_entry",
      fileData: null,
      uploadDate: new Date().toISOString()
    };
    
    setFinalResumeData(emptyResumeData);
    setCurrentStep('hybrid');
  };

  const handleUploadComplete = async () => {
    await handleUpload();
    // After upload processing, show hybrid form with parsed data
    if (incompleteResumeData) {
      setFinalResumeData(incompleteResumeData);
      setCurrentStep('hybrid');
    }
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

  return {
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
  };
};
