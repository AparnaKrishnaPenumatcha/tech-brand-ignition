
import React from 'react';
import LoadingButton from './LoadingButton';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { processSkills, processExperience, processProjects, ResumeData } from '@/utils/resumeProcessing';

interface DemoDataProcessorProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const DemoDataProcessor: React.FC<DemoDataProcessorProps> = ({ isLoading, setIsLoading }) => {
  const navigate = useNavigate();

  const handleProcessJsonDemo = () => {
    setIsLoading(true);
    
    try {
      // Example JSON data provided in the prompt
      const jsonData = {
        "personal": {
          "name": "Aparna K Penumatcha",
          "email": "aparnakrishna.penumatcha@gmail.com",
          "phone": "+1-248-704-0856",
          "location": ""
        },
        "summary": "16+ years of experience in Information Technology with over 6 years of working experience with SAP Commerce Cloud. Expertise in requirements gathering, software analysis, design, development, and implementation. Experienced in Agile methodology and Object-Oriented Design.",
        "experience": [
          {
            "company": "IBM",
            "duration": "Aug 2008 – Present",
            "role": "SAP Commerce Architect",
            "responsibilities": [
              "Act as the designer of the overall architectural concept of the future e-commerce platform of SAP.",
              "Develop and implement new functionality for the Digital Commerce Platform on Commerce Cloud.",
              "Lead and manage the team in designing the technical architecture.",
              "Guide stakeholders in reaching consensus on the problem and vision.",
              "Collect in-depth information about the problem-statement and context by working with stakeholders.",
              "Create Architecture Overview, Architectural Decisions, Data Flow Diagram, and Assumptions as an outcome of the Blueprint Design.",
              "Responsible for High Level design for Product, Category, Classification, Catalog, and Customer Hierarchy for B2B Customer.",
              "Mentor the team with day-to-day activities for critical deadlines.",
              "Responsible for continuous delivery using tools Git, Maven, Jenkins."
            ]
          }
        ],
        "education": [],
        "projects": [],
        "skills": [
          "J2EE", "JSP", "Servlets", "JavaScript", "CSS", "Ajax", "jQuery", "JSON", "XML", "HTML",
          "Spring", "Spring Boot", "Hibernate", "Oracle", "SAP HANA", "Maven", "Eclipse", "JUnit", "Mockito", "GitHub", "Jenkins"
        ],
        "certifications": []
      };
      
      // Process the JSON data to match the required schema
      const resumeData = {
        personalInfo: {
          name: jsonData.personal?.name || "Your Name",
          title: jsonData.experience?.[0]?.role || "Professional Title",
          email: jsonData.personal?.email || "email@example.com",
          phone: jsonData.personal?.phone || "(123) 456-7890",
          location: jsonData.personal?.location || "City, Country",
          about: jsonData.summary || "Professional with a passion for creating impactful solutions"
        },
        summary: jsonData.summary || "Experienced professional with expertise in web development and project management.",
        education: jsonData.education?.length ? jsonData.education.map((edu: any) => ({
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
        experience: processExperience(jsonData.experience || []),
        projects: processProjects(jsonData.projects || []),
        skills: Array.isArray(jsonData.skills) 
          ? processSkills(jsonData.skills) 
          : [
              { name: "JavaScript", level: 90, category: "Frontend" },
              { name: "TypeScript", level: 85, category: "Frontend" },
              { name: "React", level: 90, category: "Frontend" },
            ],
        certifications: jsonData.certifications?.length ? jsonData.certifications.map((cert: any) => ({
          name: cert.name || "Certification",
          issuer: cert.issuer || "Issuer",
          year: cert.year || "Year"
        })) : [
          {
            name: "SAP Commerce Cloud Certification",
            issuer: "SAP",
            year: "2020"
          }
        ]
      };
      
      // Create a placeholder file data URL for the demo
      const placeholderFileData = "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL1Jlc291cmNlcyA8PAo+PgovQ29udGVudHMgNCAwIFIKL1BhcmVudCAyIDAgUgo+PgplbmRvYmoKNCAwIG9iago8PCAvTGVuZ3RoIDEwMCAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeJwzUvDiMtAzNVcoSy1SCAp2c/H083HVUyjPLMlQ8OJSUDBQcHf19AjR4wIAEiQKxAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDE1IDAwMDAwIG4KMDAwMDAwMDA2NiAwMDAwMCBuCjAwMDAwMDAxMjcgMDAwMDAgbgowMDAwMDAwMjI5IDAwMDAwIG4KdHJhaWxlcgo8PAovUm9vdCAxIDAgUgovU2l6ZSA1Cj4+CnN0YXJ0eHJlZgozOTcKJSVFT0YK";
      
      // Combine the processed data with the placeholder file data
      const completeResumeData = {
        ...resumeData,
        fileName: "demo_resume.pdf",
        fileData: placeholderFileData,
        uploadDate: new Date().toISOString(),
      } as ResumeData;
      
      // Save to localStorage
      localStorage.setItem('resumeData', JSON.stringify(completeResumeData));
      
      // Navigate to portfolio page
      setIsLoading(false);
      toast({
        title: "Demo resume data processed",
        description: "Building your portfolio with the provided JSON data...",
      });
      navigate('/portfolio');
    } catch (error) {
      setIsLoading(false);
      console.error("Error processing JSON data:", error);
      toast({
        title: "Processing failed",
        description: "There was an error processing the JSON data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-center">
      <p className="text-sm text-navy-600 mb-2">Or use demo data</p>
      <LoadingButton 
        onClick={handleProcessJsonDemo} 
        isLoading={isLoading}
        className="w-full bg-navy-600 hover:bg-navy-700 text-white"
      >
        Use Demo JSON Data
      </LoadingButton>
    </div>
  );
};

export default DemoDataProcessor;
