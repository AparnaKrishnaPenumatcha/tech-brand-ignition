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

// Extract text content from PDF files
const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Basic PDF text extraction
        // This is a simplified approach - for better results, consider using a PDF parsing library
        let text = '';
        let inTextObject = false;
        let buffer = '';
        
        for (let i = 0; i < uint8Array.length - 1; i++) {
          const char = String.fromCharCode(uint8Array[i]);
          
          // Look for text objects in PDF
          if (char === 'B' && String.fromCharCode(uint8Array[i + 1]) === 'T') {
            inTextObject = true;
            continue;
          }
          
          if (char === 'E' && String.fromCharCode(uint8Array[i + 1]) === 'T') {
            inTextObject = false;
            continue;
          }
          
          if (inTextObject && char.match(/[a-zA-Z0-9\s@.\-()]/)) {
            buffer += char;
          } else if (buffer.length > 0) {
            text += buffer + ' ';
            buffer = '';
          }
        }
        
        // Clean up the extracted text
        text = text.replace(/\s+/g, ' ').trim();
        
        if (text.length < 50) {
          // If extraction failed, try a different approach
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawText = decoder.decode(uint8Array);
          const cleanText = rawText.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
          text = cleanText.length > text.length ? cleanText : text;
        }
        
        console.log('=== PDF Text Extraction: Success ===');
        console.log('Extracted text preview:', text.substring(0, 300) + '...');
        console.log('Total text length:', text.length);
        
        resolve(text);
      } catch (error) {
        console.error('=== PDF Text Extraction: Error ===', error);
        reject(new Error('Failed to extract text from PDF'));
      }
    };
    
    reader.onerror = () => {
      console.error('=== PDF Text Extraction: FileReader error ===');
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Extract text content from DOCX files
const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    // For DOCX files, try to read as text (simplified approach)
    const text = await file.text();
    console.log('=== DOCX Text Extraction: Success ===');
    console.log('Extracted text preview:', text.substring(0, 300) + '...');
    return text;
  } catch (error) {
    console.error('=== DOCX Text Extraction: Error ===', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

// Main function to process resume files using OpenAI
export const processResumeFile = async (file: File): Promise<ResumeData> => {
  console.log('=== processResumeFile: Starting text extraction and OpenAI processing ===');
  console.log('File details:', { name: file.name, type: file.type, size: file.size });
  
  try {
    // Step 1: Extract text content from the file
    console.log('=== processResumeFile: Extracting text content ===');
    let textContent: string;
    
    if (file.type === 'application/pdf') {
      textContent = await extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      textContent = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
    
    if (!textContent || textContent.length < 10) {
      throw new Error('Could not extract meaningful text from the file');
    }
    
    console.log('=== processResumeFile: Text extraction successful ===');
    
    // Step 2: Send text content to OpenAI for parsing
    console.log('=== processResumeFile: Calling parse-resume edge function ===');
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { 
        textContent,
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
    
    // Step 3: Add file data for download functionality
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
    console.error('=== processResumeFile: Error in processing ===', error);
    
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
