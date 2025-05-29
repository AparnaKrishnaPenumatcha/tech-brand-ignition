
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

  const parseListData = (text: string, field: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    
    switch (field) {
      case 'certifications':
        return lines.map(line => {
          const parts = line.split(' - ');
          return {
            name: parts[0] || line,
            issuer: parts[1] || '',
            year: parts[2] || ''
          };
        });
      
      case 'projects':
        return lines.map(line => {
          const parts = line.split(' | ');
          return {
            title: parts[0] || line,
            description: parts[1] || '',
            outcome: parts[2] || '',
            tags: []
          };
        });
      
      case 'experience':
        return lines.map(line => {
          const parts = line.split(' | ');
          return {
            title: parts[0] || line,
            company: parts[0]?.includes(' at ') ? parts[0].split(' at ')[1] : '',
            duration: parts[1] || '',
            description: parts[2] || ''
          };
        });
      
      case 'skills':
        return lines.map(line => ({
          name: line.trim(),
          level: 80,
          category: 'Other'
        }));
      
      case 'testimonials':
        return lines.map(line => {
          const parts = line.split(' - ');
          return {
            quote: parts[0] || line,
            name: parts[1] || '',
            role: parts[2] || ''
          };
        });
      
      default:
        return lines;
    }
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

    mergedData.personalInfo = {
      ...baseData.personalInfo,
      ...parsedData?.personalInfo,
      ...collectedData?.personalInfo
    };

    ['certifications', 'projects', 'experience', 'skills', 'testimonials'].forEach(field => {
      const textValue = getNestedValue(collectedData, field);
      if (typeof textValue === 'string' && textValue.trim()) {
        mergedData[field as keyof ResumeData] = parseListData(textValue, field) as any;
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
    getDefaultResumeData
  };
};
