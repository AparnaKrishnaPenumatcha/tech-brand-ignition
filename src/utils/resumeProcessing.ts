
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
}

interface RawSkill { name: string; }
interface Skill     { name: string; level: number; category: string; }

// Function to convert simple skills array to required format
export const processSkills = (skills: RawSkill[]): Skill[] => {
  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];
  return skills.map((skillObj, index) => {
    const { name: skill } = skillObj;
    // Generate random level between 70 and 95
    const level = Math.floor(Math.random() * 26) + 70;
    // Assign category based on skill or use a simple rotation
    let category = categories[index % categories.length];
    
    // Try to categorize common technologies
    if (/html|css|javascript|jquery|react|vue|angular|typescript|ajax/i.test(skill)) {
      category = 'Frontend';
    } else if (/java|spring|boot|node|python|php|servlets|j2ee/i.test(skill)) {
      category = 'Backend';
    } else if (/oracle|sql|mongodb|mysql|postgresql|hana|database|hibernate/i.test(skill)) {
      category = 'Database';
    } else if (/git|jenkins|maven|eclipse|junit|mockito|docker|kubernetes/i.test(skill)) {
      category = 'Tools';
    }
    
    return {
      name: skill,
      level,
      category
    };
  });
};

// Function to process experience data
export const processExperience = (experienceArray: any[]) => {
  console.log("Experience array: ", experienceArray);
  return experienceArray.map(exp => ({
    title: exp.role || "Professional",
    company: exp.company || "Company",
    duration: exp.duration || "Present",
    description: exp.responsibilities ? exp.responsibilities.join(" ") : "Professional experience"
  }));
};

// Process projects or create placeholder projects
export const processProjects = (projectsArray: any[]) => {
  if (!projectsArray || projectsArray.length === 0) {
    // Create placeholder projects based on experience if available
    return [
      {
        title: "SAP Commerce Cloud Implementation",
        description: "Developed and implemented new functionality for Digital Commerce Platform on Commerce Cloud.",
        tags: ["SAP", "Commerce Cloud", "E-commerce"]
      },
      {
        title: "Architecture Blueprint Design",
        description: "Created architectural overview, decisions, data flow diagrams for e-commerce solutions.",
        tags: ["Architecture", "Design", "E-commerce"]
      },
      {
        title: "Continuous Integration Pipeline",
        description: "Implemented continuous delivery using Git, Maven, and Jenkins for SAP Commerce Cloud.",
        tags: ["CI/CD", "Git", "Jenkins"]
      }
    ];
  }
  return projectsArray;
};
