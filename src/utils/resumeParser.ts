
import { ResumeData } from './resumeProcessing';

export const parseResumeText = (text: string, fileName: string): ResumeData => {
  console.log('Parsing resume text:', text.substring(0, 500) + '...');
  
  // Clean the text for better parsing
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Extract sections
  const personalInfo = extractPersonalInfo(cleanText);
  const summary = extractSummary(cleanText);
  const experience = extractExperience(cleanText);
  const education = extractEducation(cleanText);
  const skills = extractSkills(cleanText);
  const projects = extractProjects(cleanText);
  const certifications = extractCertifications(cleanText);
  
  console.log('Parsed data:', { personalInfo, experience: experience.length, education: education.length, skills: skills.length, projects: projects.length });
  
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
  // Extract name (usually at the top, look for capitalized words)
  const namePatterns = [
    /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m,
    /([A-Z][A-Z\s]+[A-Z])\s*\n/,
    /^([A-Z][a-zA-Z\s]{5,30})\s*$/m
  ];
  
  let name = '';
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].length < 50) {
      name = match[1].trim();
      break;
    }
  }
  
  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';
  
  // Extract phone (multiple formats)
  const phonePatterns = [
    /(\+?1?\s*\(?[0-9]{3}\)?\s*[-.\s]*[0-9]{3}[-.\s]*[0-9]{4})/,
    /(\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4})/,
    /([0-9]{3}-[0-9]{3}-[0-9]{4})/
  ];
  
  let phone = '';
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      phone = match[1].trim();
      break;
    }
  }
  
  // Extract location (city, state patterns)
  const locationPatterns = [
    /([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+[0-9]{5})?)/,
    /([A-Z][a-z]+\s*,\s*[A-Z][a-z]+)/,
    /Location:\s*([A-Z][a-zA-Z\s,]+)/i
  ];
  
  let location = '';
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      location = match[1].trim();
      break;
    }
  }
  
  // Extract LinkedIn
  const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9-]+)/);
  const linkedin = linkedinMatch ? `https://${linkedinMatch[1]}` : '';
  
  // Extract title from common patterns
  const titlePatterns = [
    new RegExp(`${name}\\s*\\n\\s*([A-Z][a-zA-Z\\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant|Director|Lead))`),
    /(?:^|\n)([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant|Director|Lead))(?:\s*\n|\s*$)/m,
    /OBJECTIVE:\s*([A-Z][a-zA-Z\s]+)/i
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
    /(?:SUMMARY|PROFILE|OBJECTIVE|ABOUT)[\s:]*\n([\s\S]*?)(?=\n(?:[A-Z\s]{2,}:|EXPERIENCE|EDUCATION|SKILLS))/i,
    /(?:^|\n)((?:Experienced|Professional|Skilled|Dedicated)[^.]*\.(?:[^.]*\.){0,4})/m
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
  const expSectionMatch = text.match(/(?:EXPERIENCE|EMPLOYMENT|WORK\s*HISTORY|PROFESSIONAL\s*EXPERIENCE)[\s:]*\n([\s\S]*?)(?=\n(?:[A-Z\s]{2,}:|EDUCATION|SKILLS|PROJECTS|$))/i);
  
  if (expSectionMatch) {
    const expText = expSectionMatch[1];
    
    // Multiple patterns for job entries
    const jobPatterns = [
      // Pattern: Title at Company, Duration
      /([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant|Director|Lead|Associate|Intern)[a-zA-Z\s]*)\s+(?:at|@)\s+([A-Z][a-zA-Z\s&.,]+)\s*(?:\n|,|\s+)([0-9]{4}[\s-]+(?:[0-9]{4}|Present|Current))/gi,
      // Pattern: Company - Title, Duration
      /([A-Z][a-zA-Z\s&.,]+)\s*[-–]\s*([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant|Director|Lead|Associate|Intern)[a-zA-Z\s]*)\s*(?:\n|,|\s+)([0-9]{4}[\s-]+(?:[0-9]{4}|Present|Current))/gi,
      // Pattern: Company, Title (Duration)
      /([A-Z][a-zA-Z\s&.,]+),\s*([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Specialist|Consultant|Director|Lead|Associate|Intern)[a-zA-Z\s]*)\s*\(([0-9]{4}[\s-]+(?:[0-9]{4}|Present|Current))\)/gi
    ];
    
    jobPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(expText)) !== null) {
        let title, company, duration;
        
        if (index === 0) { // Title at Company
          title = match[1].trim();
          company = match[2].trim();
          duration = match[3].trim();
        } else { // Company - Title or Company, Title
          company = match[1].trim();
          title = match[2].trim();
          duration = match[3].trim();
        }
        
        // Extract description from surrounding text
        const startPos = match.index + match[0].length;
        const nextJobMatch = expText.substring(startPos).match(/(?:\n|^)([A-Z][a-zA-Z\s&.,]+(?:\s*[-–]\s*|\s+at\s+|\s*,\s*))/);
        const endPos = nextJobMatch ? startPos + nextJobMatch.index : startPos + 200;
        
        let description = expText.substring(startPos, endPos).trim();
        description = description.replace(/\n+/g, ' ').replace(/\s+/g, ' ').substring(0, 300);
        
        if (!experiences.some(exp => exp.title === title && exp.company === company)) {
          experiences.push({
            title,
            company,
            duration,
            description: description || 'Professional experience in the role'
          });
        }
      }
    });
  }
  
  return experiences;
};

const extractEducation = (text: string) => {
  const education: any[] = [];
  
  const eduSectionMatch = text.match(/(?:EDUCATION|ACADEMIC|QUALIFICATIONS)[\s:]*\n([\s\S]*?)(?=\n(?:[A-Z\s]{2,}:|EXPERIENCE|SKILLS|PROJECTS|$))/i);
  
  if (eduSectionMatch) {
    const eduText = eduSectionMatch[1];
    
    // Multiple patterns for education
    const degreePatterns = [
      /(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate|Doctorate)[a-zA-Z\s]*(?:in|of|degree)\s+([A-Z][a-zA-Z\s]+)\s*(?:from\s+)?([A-Z][a-zA-Z\s&.,]+)\s*(?:\()?([0-9]{4})(?:\))?/gi,
      /([A-Z][a-zA-Z\s&.,]+)\s*[-–]\s*(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate)[a-zA-Z\s]*(?:in|of)?\s+([A-Z][a-zA-Z\s]+)\s*(?:\()?([0-9]{4})(?:\))?/gi,
      /(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate)[a-zA-Z\s]*\s+([A-Z][a-zA-Z\s]+)\s*([0-9]{4})/gi
    ];
    
    degreePatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(eduText)) !== null) {
        let degree, institution, year, field;
        
        if (index === 0) {
          degree = `${match[1]} in ${match[2]}`.trim();
          institution = match[3].trim();
          year = match[4];
        } else if (index === 1) {
          institution = match[1].trim();
          degree = `${match[2]} in ${match[3]}`.trim();
          year = match[4];
        } else {
          degree = `${match[1]} ${match[2]}`.trim();
          institution = 'Institution';
          year = match[3];
        }
        
        if (!education.some(edu => edu.degree === degree && edu.institution === institution)) {
          education.push({
            degree,
            institution,
            year
          });
        }
      }
    });
  }
  
  return education;
};

const extractSkills = (text: string) => {
  const skills: any[] = [];
  
  const skillsSectionMatch = text.match(/(?:SKILLS|TECHNOLOGIES|COMPETENCIES|TECHNICAL\s*SKILLS)[\s:]*\n([\s\S]*?)(?=\n(?:[A-Z\s]{2,}:|EXPERIENCE|EDUCATION|PROJECTS|$))/i);
  
  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[1];
    
    // Comprehensive list of technical skills
    const technicalSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
      'React', 'Angular', 'Vue', 'Svelte', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'HTML', 'CSS', 'SCSS', 'Sass', 'Bootstrap', 'Tailwind', 'Material-UI', 'Chakra UI',
      'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite', 'Cassandra',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git', 'GitHub', 'GitLab',
      'REST', 'GraphQL', 'API', 'Microservices', 'Serverless',
      'Figma', 'Adobe', 'Photoshop', 'Illustrator', 'Sketch',
      'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence',
      'TensorFlow', 'PyTorch', 'Machine Learning', 'AI', 'Data Science',
      'Unity', 'Unreal Engine', 'Game Development'
    ];
    
    // Find skills in the text
    technicalSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(skillsText)) {
        skills.push({
          name: skill,
          level: Math.floor(Math.random() * 26) + 70, // Random level 70-95
          category: categorizeSkill(skill)
        });
      }
    });
    
    // Extract additional skills from bullet points or comma-separated lists
    const skillLines = skillsText.split(/\n|•|,/).filter(line => line.trim());
    skillLines.forEach(line => {
      const cleanLine = line.trim().replace(/^[-•\s]+/, '');
      if (cleanLine.length > 2 && cleanLine.length < 30 && /^[A-Za-z0-9\s.+-]+$/.test(cleanLine)) {
        if (!skills.some(s => s.name.toLowerCase() === cleanLine.toLowerCase())) {
          skills.push({
            name: cleanLine,
            level: Math.floor(Math.random() * 26) + 70,
            category: categorizeSkill(cleanLine)
          });
        }
      }
    });
  }
  
  return skills.slice(0, 20); // Limit to 20 skills
};

const categorizeSkill = (skill: string): string => {
  const categories = {
    Frontend: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'SCSS', 'Bootstrap', 'Tailwind'],
    Backend: ['Python', 'Java', 'Node.js', 'PHP', 'C++', 'C#', 'Ruby', 'Go', 'Django', 'Flask', 'Spring', 'Express'],
    Database: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle', 'SQLite'],
    Tools: ['Git', 'Docker', 'Jenkins', 'AWS', 'Azure', 'GCP', 'Kubernetes', 'CI/CD'],
    Design: ['Figma', 'Adobe', 'Photoshop', 'Illustrator', 'Sketch']
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
  
  const projectsSectionMatch = text.match(/(?:PROJECTS|PORTFOLIO|PERSONAL\s*PROJECTS)[\s:]*\n([\s\S]*?)(?=\n(?:[A-Z\s]{2,}:|EXPERIENCE|EDUCATION|SKILLS|$))/i);
  
  if (projectsSectionMatch) {
    const projectsText = projectsSectionMatch[1];
    
    // Look for project patterns
    const projectPatterns = [
      /([A-Z][a-zA-Z\s]+(?:System|Platform|Application|Tool|Website|App|Project))\s*[:-]?\s*([^.\n]+)/g,
      /•\s*([A-Z][a-zA-Z\s]+)\s*[:-]\s*([^.\n]+)/g,
      /\n([A-Z][a-zA-Z\s]{5,40})\s*\n([^.\n]+)/g
    ];
    
    projectPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(projectsText)) !== null) {
        const title = match[1].trim();
        const description = match[2].trim();
        
        if (title.length > 3 && description.length > 10) {
          projects.push({
            title,
            description,
            tags: extractProjectTags(description)
          });
        }
      }
    });
  }
  
  return projects.slice(0, 6); // Limit to 6 projects
};

const extractProjectTags = (description: string): string[] => {
  const techWords = ['React', 'Node', 'Python', 'JavaScript', 'API', 'Database', 'Web', 'Mobile', 'AI', 'ML'];
  const tags: string[] = [];
  
  techWords.forEach(word => {
    if (new RegExp(word, 'i').test(description)) {
      tags.push(word);
    }
  });
  
  return tags.slice(0, 3);
};

const extractCertifications = (text: string) => {
  const certifications: any[] = [];
  
  const certSectionMatch = text.match(/(?:CERTIFICATIONS|CERTIFICATES|LICENSES)[\s:]*\n([\s\S]*?)(?=\n(?:[A-Z\s]{2,}:|EXPERIENCE|EDUCATION|SKILLS|$))/i);
  
  if (certSectionMatch) {
    const certText = certSectionMatch[1];
    
    // Look for certification patterns
    const certPatterns = [
      /([A-Z][a-zA-Z\s]+(?:Certified|Certificate|Certification))\s*(?:[-–]\s*)?([A-Z][a-zA-Z\s&.]+)?\s*(?:\()?([0-9]{4})(?:\))?/g,
      /•\s*([A-Z][a-zA-Z\s]+)\s*(?:[-–]\s*)?([A-Z][a-zA-Z\s&.]+)?\s*(?:\()?([0-9]{4})(?:\))?/g
    ];
    
    certPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(certText)) !== null) {
        certifications.push({
          name: match[1].trim(),
          issuer: match[2]?.trim() || 'Certification Body',
          year: match[3] || new Date().getFullYear().toString()
        });
      }
    });
  }
  
  return certifications;
};
