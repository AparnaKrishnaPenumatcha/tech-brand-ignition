
import { toast } from '@/hooks/use-toast';
import { ResumeData, processSkills, processExperience, processProjects } from './resumeProcessing';

/**
 * Attempts to parse a resume using the external API
 * @param formData FormData containing the resume file
 * @returns Parsed resume data or null if parsing failed
 */
export async function parseResumeWithApi(formData: FormData): Promise<any | null> {
  try {
    console.log('=== Sending request to external API ===');
    const res = await fetch('https://apenumat-100xminicapstoneapi.hf.space/parse-resume', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (res.ok) {
      const jsonData = await res.json();
      console.log('=== RAW API RESPONSE ===');
      console.log(JSON.stringify(jsonData, null, 2));
      console.log('=== END RAW API RESPONSE ===');
      return jsonData;
    } else {
      throw new Error(`Server responded with status: ${res.status}`);
    }
  } catch (error) {
    console.error("External API unavailable:", error);
    toast({
      title: "Parser unavailable",
      description: "Resume parser service is not responding. Using fallback data instead.",
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
  
  // Try to get structured data from the external API
  const jsonData = await parseResumeWithApi(formData);
  
  // Prepare resume data (either from API or fallback)
  let resumeData;
  
  if (jsonData) {
    // Process the JSON data from API to match the required schema
    // The API returns 'personalInfo' not 'personal'
    resumeData = {
      personalInfo: {
        name: jsonData.personalInfo?.name || "Your Name",
        title: jsonData.experience?.[0]?.role || "Professional Title",
        email: jsonData.personalInfo?.email || "email@example.com",
        phone: jsonData.personalInfo?.phone || "(123) 456-7890",
        location: jsonData.personalInfo?.location || "City, Country",
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
