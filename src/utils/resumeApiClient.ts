
import { toast } from '@/hooks/use-toast';
import { ResumeData, processSkills, processExperience, processProjects } from './resumeProcessing';

/**
 * Attempts to parse a resume using the backend API
 * @param formData FormData containing the resume file
 * @returns Parsed resume data or null if parsing failed
 */
export async function parseResumeWithApi(formData: FormData): Promise<any | null> {
  // Check if we're likely in a development environment
  const isDevelopmentEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // If we're not in development, show a toast explaining why we're using fallback data
  if (!isDevelopmentEnvironment) {
    toast({
      title: "Using sample data",
      description: "The resume parser service is only available in local development. Using fallback data instead.",
    });
    return null;
  }
  
  try {
    const res = await fetch('https://apenumat-100xminicapstoneapi.hf.space/parse-resume', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(`Server responded with status: ${res.status}`);
    }
  } catch (error) {
    console.error("Backend service unavailable:", error);
    toast({
      title: "Parser unavailable",
      description: "Resume parser service is not running. Using fallback data instead.",
    });
    return null;
  }
}

/**
 * Processes a file into resume data (either from API or fallback)
 * @param file The PDF file to process
 * @returns A promise resolving to the processed resume data
 */
export async function processResumeFile(file: File): Promise<ResumeData> {
  const formData = new FormData();
  formData.append('file', file);
  
  // First try to get structured data from the backend
  const jsonData = await parseResumeWithApi(formData);
  
  // Prepare resume data (either from API or fallback)
  let resumeData;
  
  if (jsonData) {
    // Process the JSON data from API to match the required schema
    resumeData = {
      personalInfo: {
        name: jsonData.personal?.name || "Your Name",
        title: jsonData.experience?.[0]?.role || "Professional Title",
        email: jsonData.personal?.email || "email@example.com",
        phone: jsonData.personal?.phone || "(123) 456-7890",
        location: jsonData.personal?.location || "City, Country",
        about: jsonData.summary || "Professional with a passion for creating impactful solutions"
      },
      summary: jsonData.summary || "Experienced professional with expertise in web development and project management.",
      education: Array.isArray(jsonData.education) ? jsonData.education.map((edu: any) => ({
        degree: edu.degree || "Degree",
        institution: edu.institution || "Institution",
        year: edu.year || "Year"
      })) : [
        {
          degree: "Bachelor's Degree in Computer Science",
          institution: "University Name",
          year: "20XX-20XX"
        }
      ],
      experience: processExperience(Array.isArray(jsonData.experience) ? jsonData.experience : []),
      projects: processProjects(Array.isArray(jsonData.projects) ? jsonData.projects : []),
      skills: Array.isArray(jsonData.skills) 
        ? processSkills(jsonData.skills) 
        : [
            { name: "JavaScript", level: 90, category: "Frontend" },
            { name: "TypeScript", level: 85, category: "Frontend" },
            { name: "React", level: 90, category: "Frontend" },
            { name: "HTML/CSS", level: 85, category: "Frontend" },
            { name: "Node.js", level: 80, category: "Backend" }
          ],
      certifications: Array.isArray(jsonData.certifications) ? jsonData.certifications.map((cert: any) => ({
        name: cert.name || "Certification",
        issuer: cert.issuer || "Issuer",
        year: cert.year || "Year"
      })) : [
        {
          name: "Professional Certification",
          issuer: "Certification Body",
          year: "2023"
        }
      ]
    };
  } else {
    // Use fallback data
    resumeData = getFallbackResumeData();
  }
  
  // Create a data URL for the file for download functionality
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Add file metadata to the resume data
      const completeResumeData = {
        ...resumeData,
        fileName: file.name,
        fileData: reader.result,
        uploadDate: new Date().toISOString(),
      };
      resolve(completeResumeData);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Returns fallback resume data when API parsing fails
 */
function getFallbackResumeData() {
  return {
    personalInfo: {
      name: "Your Name",
      title: "Professional Title",
      email: "email@example.com",
      phone: "(123) 456-7890",
      location: "City, Country",
      about: "Professional with a passion for creating impactful solutions"
    },
    summary: "Experienced professional with expertise in web development, data analysis, and project management.",
    education: [
      {
        degree: "Bachelor's Degree in Computer Science",
        institution: "University Name",
        year: "20XX-20XX"
      }
    ],
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Company",
        duration: "2020-Present",
        description: "Led development of key features and mentored junior team members."
      },
      {
        title: "Developer",
        company: "Software Agency",
        duration: "2018-2020",
        description: "Implemented client solutions using modern web technologies."
      }
    ],
    projects: [
      {
        title: "Project One",
        description: "A comprehensive web application built with React and Node.js.",
        tags: ["React", "Node.js", "MongoDB"]
      },
      {
        title: "Project Two",
        description: "An e-commerce platform with advanced filtering and search.",
        tags: ["Next.js", "Stripe", "PostgreSQL"]
      },
      {
        title: "Project Three",
        description: "A data visualization dashboard for complex datasets.",
        tags: ["D3.js", "TypeScript", "Express"]
      }
    ],
    skills: [
      { name: "JavaScript", level: 90, category: "Frontend" },
      { name: "TypeScript", level: 85, category: "Frontend" },
      { name: "React", level: 90, category: "Frontend" },
      { name: "HTML/CSS", level: 85, category: "Frontend" },
      { name: "Node.js", level: 80, category: "Backend" },
      { name: "Python", level: 75, category: "Backend" },
      { name: "SQL", level: 80, category: "Database" },
      { name: "MongoDB", level: 75, category: "Database" },
      { name: "Git", level: 85, category: "Tools" }
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        year: "2023"
      },
      {
        name: "Professional Scrum Master",
        issuer: "Scrum.org",
        year: "2022"
      }
    ]
  };
}
