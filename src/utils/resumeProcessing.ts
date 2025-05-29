export interface ResumeData {
  fileName: string;
  fileData: string | ArrayBuffer | null;
  uploadDate: string;
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    about: string;
    profilePhoto?: string;
    linkedin?: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    tags: string[];
    links?: {
      demo?: string;
      code?: string;
    };
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  summary?: string;
  leadership?: string;
  testimonials?: Array<{
    quote: string;
    name: string;
    role: string;
  }>;
}

import { supabase } from '@/integrations/supabase/client';

// Enhanced PDF text extraction
const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        console.log('=== Enhanced PDF Processing ===');
        console.log('File size:', uint8Array.length, 'bytes');
        
        // Convert to base64 for sending to edge function
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64String = btoa(binary);
        const dataUrl = `data:application/pdf;base64,${base64String}`;
        
        console.log('=== PDF converted to base64 ===');
        console.log('Base64 length:', base64String.length);
        
        resolve(dataUrl);
      } catch (error) {
        console.error('=== PDF Processing Error ===', error);
        reject(new Error('Failed to process PDF file'));
      }
    };
    
    reader.onerror = () => {
      console.error('=== FileReader Error ===');
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Enhanced DOCX text extraction
const extractTextFromDOCX = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        console.log('=== Enhanced DOCX Processing ===');
        console.log('File size:', uint8Array.length, 'bytes');
        
        // Convert to base64 for sending to edge function
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64String = btoa(binary);
        const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64String}`;
        
        console.log('=== DOCX converted to base64 ===');
        console.log('Base64 length:', base64String.length);
        
        resolve(dataUrl);
      } catch (error) {
        console.error('=== DOCX Processing Error ===', error);
        reject(new Error('Failed to process DOCX file'));
      }
    };
    
    reader.onerror = () => {
      console.error('=== FileReader Error ===');
      reject(new Error('Failed to read DOCX file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Main function to process resume files using enhanced OpenAI parsing
export const processResumeFile = async (file: File): Promise<ResumeData> => {
  console.log('=== processResumeFile: Starting enhanced processing ===');
  console.log('File details:', { name: file.name, type: file.type, size: file.size });
  
  try {
    // Step 1: Convert file to base64 based on type
    console.log('=== processResumeFile: Converting file to base64 ===');
    let fileContent: string;
    
    if (file.type === 'application/pdf') {
      fileContent = await extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileContent = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
    
    console.log('=== processResumeFile: File conversion successful ===');
    
    // Step 2: Send to enhanced edge function for processing
    console.log('=== processResumeFile: Calling enhanced parse-resume function ===');
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { 
        textContent: fileContent,
        fileName: file.name
      }
    });
    
    if (error) {
      console.error('=== processResumeFile: Supabase function error ===', error);
      throw new Error(`Resume parsing failed: ${error.message}`);
    }
    
    if (!data || !data.resumeData) {
      console.error('=== processResumeFile: No data returned ===', data);
      throw new Error('No resume data returned from parsing service');
    }
    
    console.log('=== processResumeFile: Enhanced parsing successful ===');
    console.log('Extracted data summary:', {
      name: data.resumeData.personalInfo?.name || 'Not found',
      experienceCount: data.resumeData.experience?.length || 0,
      skillsCount: data.resumeData.skills?.length || 0,
      educationCount: data.resumeData.education?.length || 0,
      hasContent: !!(data.resumeData.personalInfo?.name || 
                     data.resumeData.experience?.length > 0 || 
                     data.resumeData.skills?.length > 0)
    });
    
    // Step 3: Add original file data for download functionality
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const completeResumeData = {
          ...data.resumeData,
          fileData: reader.result
        };
        resolve(completeResumeData);
      };
      reader.readAsDataURL(file);
    });
    
  } catch (error) {
    console.error('=== processResumeFile: Error in enhanced processing ===', error);
    
    // Return a basic structure with file metadata on failure
    console.log('=== processResumeFile: Returning fallback structure ===');
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
  }
};

// Legacy functions for backward compatibility
interface RawSkill { name: string; }
interface Skill { name: string; level: number; category: string; }

export const processSkills = (skills: RawSkill[]): Skill[] => {
  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];
  return skills.map((skillObj, index) => {
    const { name: skill } = skillObj;
    const level = Math.floor(Math.random() * 26) + 70;
    let category = categories[index % categories.length];
    
    if (/html|css|javascript|jquery|react|vue|angular|typescript|ajax/i.test(skill)) {
      category = 'Frontend';
    } else if (/java|spring|boot|node|python|php|servlets|j2ee/i.test(skill)) {
      category = 'Backend';
    } else if (/oracle|sql|mongodb|mysql|postgresql|hana|database|hibernate/i.test(skill)) {
      category = 'Database';
    } else if (/git|jenkins|maven|eclipse|junit|mockito|docker|kubernetes/i.test(skill)) {
      category = 'Tools';
    }
    
    return { name: skill, level, category };
  });
};

export const processExperience = (experienceArray: any[]) => {
  return experienceArray.map(exp => ({
    title: exp.role || "Professional",
    company: exp.company || "Company",
    duration: exp.duration || "Present",
    description: exp.responsibilities ? exp.responsibilities.join(" ") : "Professional experience"
  }));
};

export const processProjects = (projectsArray: any[]) => {
  if (!projectsArray || projectsArray.length === 0) {
    return [
      {
        title: "Professional Project",
        description: "Developed and implemented solutions using modern technologies.",
        tags: ["Development", "Implementation"]
      }
    ];
  }
  return projectsArray;
};
