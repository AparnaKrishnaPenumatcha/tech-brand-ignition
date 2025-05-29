
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

// Convert file to base64 data URL for OpenAI vision
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Main function to process resume files using OpenAI
export const processResumeFile = async (file: File): Promise<ResumeData> => {
  console.log('=== processResumeFile: Starting OpenAI-based processing ===');
  console.log('File details:', { name: file.name, type: file.type, size: file.size });
  
  try {
    // Convert file to base64 for OpenAI vision API
    console.log('=== processResumeFile: Converting file to base64 ===');
    const fileData = await fileToBase64(file);
    console.log('=== processResumeFile: File converted successfully ===');
    
    // Call the Supabase edge function for OpenAI parsing
    console.log('=== processResumeFile: Calling parse-resume edge function ===');
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { 
        fileData,
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
    
    console.log('=== processResumeFile: OpenAI parsing successful ===');
    console.log('Extracted data preview:', {
      name: data.resumeData.personalInfo?.name,
      experienceCount: data.resumeData.experience?.length || 0,
      skillsCount: data.resumeData.skills?.length || 0,
      educationCount: data.resumeData.education?.length || 0
    });
    
    return data.resumeData;
  } catch (error) {
    console.error('=== processResumeFile: Error in OpenAI processing ===', error);
    
    // Return a basic structure with file metadata on failure
    console.log('=== processResumeFile: Returning fallback structure ===');
    return {
      fileName: file.name,
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
    };
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
