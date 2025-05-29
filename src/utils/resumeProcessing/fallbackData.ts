
import type { ResumeData } from '../types/resumeTypes';

export const createFallbackResumeData = (file: File): Promise<ResumeData> => {
  console.log('=== createFallbackResumeData: Returning fallback structure ===');
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        fileName: file.name,
        fileData: reader.result,
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
    };
    reader.readAsDataURL(file);
  });
};

export const addFileDataToResumeData = (resumeData: ResumeData, file: File): Promise<ResumeData> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const completeResumeData = {
        ...resumeData,
        fileData: reader.result
      };
      resolve(completeResumeData);
    };
    reader.readAsDataURL(file);
  });
};
