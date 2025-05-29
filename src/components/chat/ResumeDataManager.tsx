
import React from 'react';
import { ResumeData } from '@/utils/resumeProcessing';

interface ResumeDataManagerProps {
  children: (helpers: {
    getNestedValue: (obj: any, path: string) => any;
    setNestedValue: (obj: any, path: string, value: any) => any;
    getDefaultResumeData: () => ResumeData;
  }) => React.ReactNode;
}

const ResumeDataManager: React.FC<ResumeDataManagerProps> = ({ children }) => {
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  };

  const getDefaultResumeData = (): ResumeData => ({
    fileName: '',
    fileData: null,
    uploadDate: new Date().toISOString(),
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      about: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: []
  });

  return <>{children({ getNestedValue, setNestedValue, getDefaultResumeData })}</>;
};

export default ResumeDataManager;
