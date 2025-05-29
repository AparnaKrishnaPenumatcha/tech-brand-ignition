
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
