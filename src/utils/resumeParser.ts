
import { ResumeData } from './resumeProcessing';

export const parseResumeText = (text: string, fileName: string): ResumeData => {
  console.log('Parsing resume text:', text.substring(0, 500) + '...');
  
  // Extract personal information
  const personalInfo = extractPersonalInfo(text);
  
  // Extract sections
  const summary = extractSummary(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  const skills = extractSkills(text);
  const projects = extractProjects(text);
  const certifications = extractCertifications(text);
  
  return {
    fileName,
    fileData: null,
    uploadDate: new Date().toISOString(),
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications
  };
};

const extractPersonalInfo = (text: string) => {
  // Extract name (usually at the top)
  const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m);
  const name = nameMatch ? nameMatch[1].trim() : '';
  
  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';
  
  // Extract phone
  const phoneMatch = text.match(/(\+?1?\s*\(?[0-9]{3}\)?[-.\s]*[0-9]{3}[-.\s]*[0-9]{4})/);
  const phone = phoneMatch ? phoneMatch[1].trim() : '';
  
  // Extract location (city, state pattern)
  const locationMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2}(?:\s+[0-9]{5})?)/);
  const location = locationMatch ? locationMatch[1] : '';
  
  // Extract LinkedIn
  const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9-]+)/);
  const linkedin = linkedinMatch ? `https://${linkedinMatch[1]}` : '';
  
  // Try to extract title from context
  const titlePatterns = [
    /(?:^|\n)([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant))/,
    /(?:TITLE|Position|Role):\s*([A-Z][a-zA-Z\s]+)/i
  ];
  
  let title = '';
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      title = match[1].trim();
      break;
    }
  }
  
  return {
    name,
    title,
    email,
    phone,
    location,
    about: '',
    linkedin
  };
};

const extractSummary = (text: string): string => {
  const summaryPatterns = [
    /(?:SUMMARY|PROFILE|OBJECTIVE|ABOUT)[\s:]*\n([\s\S]*?)(?=\n[A-Z\s]{2,}:|\n\n|$)/i,
    /(?:^|\n)((?:Experienced|Professional|Skilled|Dedicated)[^.]*\.(?:[^.]*\.){0,3})/m
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim().replace(/\s+/g, ' ');
    }
  }
  
  return '';
};

const extractExperience = (text: string) => {
  const experiences: any[] = [];
  
  // Look for experience section
  const expSectionMatch = text.match(/(?:EXPERIENCE|EMPLOYMENT|WORK HISTORY)[\s:]*\n([\s\S]*?)(?=\n[A-Z\s]{2,}:|\n\n|$)/i);
  
  if (expSectionMatch) {
    const expText = expSectionMatch[1];
    
    // Split by job entries (look for patterns like "Title at Company" or "Company - Title")
    const jobPatterns = [
      /([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant)[a-zA-Z\s]*)\s+(?:at|@)\s+([A-Z][a-zA-Z\s&.]+)\s*\n?([0-9]{4}[\s-]+(?:[0-9]{4}|Present))/g,
      /([A-Z][a-zA-Z\s&.]+)\s*[-–]\s*([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant)[a-zA-Z\s]*)\s*\n?([0-9]{4}[\s-]+(?:[0-9]{4}|Present))/g
    ];
    
    for (const pattern of jobPatterns) {
      let match;
      while ((match = pattern.exec(expText)) !== null) {
        experiences.push({
          title: match[1].trim(),
          company: match[2].trim(),
          duration: match[3].trim(),
          description: 'Professional experience in the role'
        });
      }
    }
  }
  
  return experiences;
};

const extractEducation = (text: string) => {
  const education: any[] = [];
  
  const eduSectionMatch = text.match(/(?:EDUCATION|ACADEMIC|QUALIFICATIONS)[\s:]*\n([\s\S]*?)(?=\n[A-Z\s]{2,}:|\n\n|$)/i);
  
  if (eduSectionMatch) {
    const eduText = eduSectionMatch[1];
    
    // Look for degree patterns
    const degreePattern = /(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate)[a-zA-Z\s]*(?:in|of)\s+([A-Z][a-zA-Z\s]+)\s+(?:from\s+)?([A-Z][a-zA-Z\s&.]+)\s*(?:\()?([0-9]{4})(?:\))?/gi;
    
    let match;
    while ((match = degreePattern.exec(eduText)) !== null) {
      education.push({
        degree: `${match[1]} in ${match[2]}`.trim(),
        institution: match[3].trim(),
        year: match[4]
      });
    }
  }
  
  return education;
};

const extractSkills = (text: string) => {
  const skills: any[] = [];
  
  const skillsSectionMatch = text.match(/(?:SKILLS|TECHNOLOGIES|COMPETENCIES)[\s:]*\n([\s\S]*?)(?=\n[A-Z\s]{2,}:|\n\n|$)/i);
  
  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[1];
    
    // Common technical skills
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 
      'TypeScript', 'Angular', 'Vue', 'SQL', 'MongoDB', 'Git', 'Docker',
      'AWS', 'Azure', 'Kubernetes', 'Jenkins', 'PHP', 'C++', 'C#', '.NET'
    ];
    
    commonSkills.forEach(skill => {
      if (new RegExp(skill, 'i').test(skillsText)) {
        skills.push({
          name: skill,
          level: Math.floor(Math.random() * 26) + 70,
          category: categorizeSkill(skill)
        });
      }
    });
    
    // Extract other skills from text
    const skillMatches = skillsText.match(/([A-Z][a-zA-Z0-9.+-]+)(?:\s*,|\s*\n|\s*$)/g);
    if (skillMatches) {
      skillMatches.forEach(skillMatch => {
        const skill = skillMatch.replace(/[,\n]/g, '').trim();
        if (skill.length > 1 && !skills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
          skills.push({
            name: skill,
            level: Math.floor(Math.random() * 26) + 70,
            category: categorizeSkill(skill)
          });
        }
      });
    }
  }
  
  return skills.slice(0, 15); // Limit to 15 skills
};

const categorizeSkill = (skill: string): string => {
  const categories = {
    Frontend: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS'],
    Backend: ['Python', 'Java', 'Node.js', 'PHP', 'C++', 'C#', '.NET'],
    Database: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL'],
    Tools: ['Git', 'Docker', 'Jenkins', 'AWS', 'Azure', 'Kubernetes']
  };
  
  for (const [category, skills] of Object.entries(categories)) {
    if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      return category;
    }
  }
  
  return 'Other';
};

const extractProjects = (text: string) => {
  const projects: any[] = [];
  
  const projectsSectionMatch = text.match(/(?:PROJECTS|PORTFOLIO)[\s:]*\n([\s\S]*?)(?=\n[A-Z\s]{2,}:|\n\n|$)/i);
  
  if (projectsSectionMatch) {
    const projectsText = projectsSectionMatch[1];
    
    // Look for project patterns
    const projectPattern = /([A-Z][a-zA-Z\s]+(?:System|Platform|Application|Tool|Website|App))\s*[:-]?\s*([^.\n]+)/g;
    
    let match;
    while ((match = projectPattern.exec(projectsText)) !== null) {
      projects.push({
        title: match[1].trim(),
        description: match[2].trim(),
        tags: []
      });
    }
  }
  
  return projects;
};

const extractCertifications = (text: string) => {
  const certifications: any[] = [];
  
  const certSectionMatch = text.match(/(?:CERTIFICATIONS|CERTIFICATES)[\s:]*\n([\s\S]*?)(?=\n[A-Z\s]{2,}:|\n\n|$)/i);
  
  if (certSectionMatch) {
    const certText = certSectionMatch[1];
    
    // Look for certification patterns
    const certPattern = /([A-Z][a-zA-Z\s]+(?:Certified|Certificate|Certification))\s*(?:[-–]\s*)?([A-Z][a-zA-Z\s&.]+)?\s*(?:\()?([0-9]{4})(?:\))?/g;
    
    let match;
    while ((match = certPattern.exec(certText)) !== null) {
      certifications.push({
        name: match[1].trim(),
        issuer: match[2]?.trim() || 'Certification Body',
        year: match[3]
      });
    }
  }
  
  return certifications;
};
