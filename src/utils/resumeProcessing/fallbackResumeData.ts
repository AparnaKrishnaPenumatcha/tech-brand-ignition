
import { ResumeData } from '../resumeProcessing';

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
