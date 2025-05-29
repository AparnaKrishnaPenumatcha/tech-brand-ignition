
import { ResumeData, processSkills, processExperience, processProjects } from '../resumeProcessing';

/**
 * Automatically categorizes a skill based on its name
 */
function categorizeSkill(skillName: string): string {
  const skill = skillName.toLowerCase();
  
  // Frontend technologies
  if (skill.includes('react') || skill.includes('vue') || skill.includes('angular') || 
      skill.includes('javascript') || skill.includes('typescript') || skill.includes('html') || 
      skill.includes('css') || skill.includes('sass') || skill.includes('less') || 
      skill.includes('bootstrap') || skill.includes('tailwind') || skill.includes('jquery') ||
      skill.includes('next') || skill.includes('nuxt') || skill.includes('svelte') ||
      skill.includes('web') || skill.includes('frontend') || skill.includes('ui') ||
      skill.includes('ux') || skill.includes('figma') || skill.includes('design')) {
    return 'Frontend';
  }
  
  // Backend technologies
  if (skill.includes('node') || skill.includes('express') || skill.includes('django') || 
      skill.includes('flask') || skill.includes('spring') || skill.includes('laravel') || 
      skill.includes('ruby') || skill.includes('rails') || skill.includes('php') || 
      skill.includes('java') || skill.includes('python') || skill.includes('c#') || 
      skill.includes('c++') || skill.includes('go') || skill.includes('rust') ||
      skill.includes('backend') || skill.includes('server') || skill.includes('api') ||
      skill.includes('rest') || skill.includes('graphql') || skill.includes('microservices')) {
    return 'Backend';
  }
  
  // Database technologies
  if (skill.includes('sql') || skill.includes('mysql') || skill.includes('postgresql') || 
      skill.includes('mongodb') || skill.includes('redis') || skill.includes('elasticsearch') || 
      skill.includes('oracle') || skill.includes('sqlite') || skill.includes('cassandra') ||
      skill.includes('database') || skill.includes('db') || skill.includes('nosql')) {
    return 'Database';
  }
  
  // Cloud and DevOps
  if (skill.includes('aws') || skill.includes('azure') || skill.includes('gcp') || 
      skill.includes('docker') || skill.includes('kubernetes') || skill.includes('jenkins') || 
      skill.includes('git') || skill.includes('github') || skill.includes('gitlab') ||
      skill.includes('devops') || skill.includes('ci/cd') || skill.includes('terraform') ||
      skill.includes('ansible') || skill.includes('cloud')) {
    return 'Tools';
  }
  
  // Default to Tools for anything else
  return 'Tools';
}

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

/**
 * Returns fallback resume data when API parsing fails
 */
export function getFallbackResumeData(): ResumeData {
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
    ],
    fileName: "fallback_data",
    fileData: null,
    uploadDate: new Date().toISOString()
  };
}
