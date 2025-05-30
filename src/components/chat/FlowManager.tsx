
import { useState } from 'react';
import { ResumeData } from '@/utils/resumeProcessing';

export type FlowStep = 'welcome' | 'upload-summary' | 'data-collection' | 'complete';

export const useFlowManager = (onComplete: (data: ResumeData) => void) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [parsedData, setParsedData] = useState<Partial<ResumeData> | null>(null);
  const [collectedData, setCollectedData] = useState<Partial<ResumeData>>({});
  const [fieldsToEdit, setFieldsToEdit] = useState<string[]>([]);

  const getDefaultResumeData = (): ResumeData => ({
    fileName: 'chat_generated_resume',
    fileData: null,
    uploadDate: new Date().toISOString(),
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      about: '',
      profilePhoto: '',
      linkedin: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    leadership: '',
    testimonials: []
  });

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const parseEducationData = (text: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(' - ');
      return {
        degree: parts[0] || line,
        institution: parts[1] || '',
        year: parts[2] || ''
      };
    });
  };

  const parseExperienceData = (text: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(' | ');
      const titleCompany = parts[0] || line;
      let title = titleCompany;
      let company = '';
      
      // Handle "Title at Company" format
      if (titleCompany.includes(' at ')) {
        const atIndex = titleCompany.lastIndexOf(' at ');
        title = titleCompany.substring(0, atIndex);
        company = titleCompany.substring(atIndex + 4);
      }
      
      return {
        title: title.trim(),
        company: company.trim(),
        duration: parts[1] || '',
        description: parts[2] || ''
      };
    });
  };

  const parseProjectsData = (text: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(' | ');
      return {
        title: parts[0] || line,
        description: parts[1] || '',
        outcome: parts[2] || '',
        tags: []
      };
    });
  };

  const parseCertificationsData = (text: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(' - ');
      return {
        name: parts[0] || line,
        issuer: parts[1] || '',
        year: parts[2] || ''
      };
    });
  };

  const parseSkillsData = (text: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => ({
      name: line.trim(),
      level: 80,
      category: 'Other'
    }));
  };

  const parseTestimonialsData = (text: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(' - ');
      return {
        quote: parts[0] || line,
        name: parts[1] || '',
        role: parts[2] || ''
      };
    });
  };

  const parseListData = (text: string, field: string): any[] => {
    switch (field) {
      case 'education':
        return parseEducationData(text);
      case 'experience':
        return parseExperienceData(text);
      case 'projects':
        return parseProjectsData(text);
      case 'certifications':
        return parseCertificationsData(text);
      case 'skills':
        return parseSkillsData(text);
      case 'testimonials':
        return parseTestimonialsData(text);
      default:
        return text.split('\n').filter(line => line.trim());
    }
  };

  const startDataCollectionFlow = () => {
    console.log('=== FlowManager: Starting data collection flow ===');
    setCurrentStep('data-collection');
    return true;
  };

  const completeDataCollection = () => {
    console.log('=== FlowManager: Starting data completion ===');
    console.log('Parsed data:', parsedData);
    console.log('Collected data:', collectedData);

    const baseData = getDefaultResumeData();
    const mergedData = {
      ...baseData,
      ...parsedData,
      ...collectedData
    };

    // Merge personal info carefully
    mergedData.personalInfo = {
      ...baseData.personalInfo,
      ...parsedData?.personalInfo,
      ...collectedData?.personalInfo
    };

    // Process array fields that might have been collected as text
    ['education', 'experience', 'projects', 'certifications', 'skills', 'testimonials'].forEach(field => {
      const textValue = getNestedValue(collectedData, field);
      if (typeof textValue === 'string' && textValue.trim()) {
        console.log(`=== FlowManager: Processing ${field} from text ===`);
        mergedData[field as keyof ResumeData] = parseListData(textValue, field) as any;
      } else if (parsedData && Array.isArray(getNestedValue(parsedData, field))) {
        // Use parsed data if available and collected data is not provided
        mergedData[field as keyof ResumeData] = getNestedValue(parsedData, field) as any;
      }
    });

    console.log('Final merged data:', mergedData);
    setCurrentStep('complete');
    onComplete(mergedData);
  };

  return {
    currentStep,
    setCurrentStep,
    parsedData,
    setParsedData,
    collectedData,
    setCollectedData,
    fieldsToEdit,
    setFieldsToEdit,
    completeDataCollection,
    startDataCollectionFlow,
    getDefaultResumeData
  };
};
