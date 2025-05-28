
import { ResumeData } from './resumeProcessing';

export interface MissingDataReport {
  hasMissingData: boolean;
  missingFields: string[];
  incompleteData: ResumeData;
}

export function checkMissingData(resumeData: ResumeData): MissingDataReport {
  const missingFields: string[] = [];
  
  // Check personal info
  if (!resumeData.personalInfo.name || resumeData.personalInfo.name === "Your Name") {
    missingFields.push("Full Name");
  }
  if (!resumeData.personalInfo.title || resumeData.personalInfo.title === "Professional Title") {
    missingFields.push("Professional Title");
  }
  if (!resumeData.personalInfo.email || resumeData.personalInfo.email === "email@example.com") {
    missingFields.push("Email");
  }
  if (!resumeData.personalInfo.phone || resumeData.personalInfo.phone === "(123) 456-7890") {
    missingFields.push("Phone");
  }
  if (!resumeData.personalInfo.location || resumeData.personalInfo.location === "City, Country") {
    missingFields.push("Location");
  }

  // Check if experience has meaningful data
  const hasRealExperience = resumeData.experience.some(exp => 
    exp.title && exp.company && 
    !exp.title.includes("Professional") && 
    !exp.company.includes("Company")
  );
  if (!hasRealExperience) {
    missingFields.push("Work Experience");
  }

  // Check if education has meaningful data
  const hasRealEducation = resumeData.education.some(edu => 
    edu.degree && edu.institution && 
    !edu.degree.includes("Degree") && 
    !edu.institution.includes("University Name")
  );
  if (!hasRealEducation) {
    missingFields.push("Education");
  }

  // Check if skills are meaningful (not just defaults)
  const hasRealSkills = resumeData.skills.some(skill => 
    skill.name && !["JavaScript", "TypeScript", "React", "HTML/CSS", "Node.js"].includes(skill.name)
  );
  if (resumeData.skills.length < 3 || !hasRealSkills) {
    missingFields.push("Skills");
  }

  return {
    hasMissingData: missingFields.length > 0,
    missingFields,
    incompleteData: resumeData
  };
}
