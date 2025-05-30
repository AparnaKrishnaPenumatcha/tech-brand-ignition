
import { ResumeData, processSkills, processExperience, processProjects } from '../resumeProcessing';
import { categorizeSkill } from './skillCategorization';

/**
 * Maps API response data to the required ResumeData schema
 */
export function mapApiDataToResumeData(jsonData: any): ResumeData {
  // Process skills from API response
  let processedSkills = [];
  if (Array.isArray(jsonData.skills)) {
    processedSkills = jsonData.skills.map((skill: any) => {
      // Handle both string and object formats
      const skillName = typeof skill === 'string' ? skill : skill.name || skill;
      return {
        name: skillName,
        level: 80, // Default level since we don't get this from API
        category: categorizeSkill(skillName)
      };
    });
  } else {
    // Fallback skills if none provided
    processedSkills = [
      { name: "JavaScript", level: 90, category: "Frontend" },
      { name: "TypeScript", level: 85, category: "Frontend" },
      { name: "React", level: 90, category: "Frontend" },
      { name: "HTML/CSS", level: 85, category: "Frontend" },
      { name: "Node.js", level: 80, category: "Backend" }
    ];
  }

  return {
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
    skills: processedSkills,
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
    ],
    fileName: "",
    fileData: null,
    uploadDate: new Date().toISOString()
  };
}
