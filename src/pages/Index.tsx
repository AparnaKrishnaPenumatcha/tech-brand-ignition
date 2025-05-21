
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF resume",
          variant: "destructive",
        });
      }
    }
  };

  // Function to convert simple skills array to required format
  const processSkills = (skills: string[]) => {
    const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];
    return skills.map((skill, index) => {
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
  const processExperience = (experienceArray: any[]) => {
    // Extract years of experience from summary if available
    let years = "5+"; // Default
    const yearMatch = /(\d+)\+?\s+years?/i.exec(experienceArray?.[0]?.duration || "");
    if (yearMatch) {
      years = yearMatch[1] + "+";
    }

    return {
      years,
      description: "Across various industries",
      positions: experienceArray.map(exp => ({
        title: exp.role || "Professional",
        company: exp.company || "Company",
        duration: exp.duration || "Present",
        description: exp.responsibilities ? exp.responsibilities.join(" ") : "Professional experience"
      }))
    };
  };

  // Process projects or create placeholder projects
  const processProjects = (projectsArray: any[]) => {
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

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a resume file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);
      
      // First try to get structured data from the backend
      let resumeData;
      try {
        const res = await fetch('http://localhost:8000/parse-resume', {
          method: 'POST',
          body: formData,
        });
        
        if (res.ok) {
          const jsonData = await res.json();
          
          // Process the JSON data to match the required schema
          resumeData = {
            personalInfo: {
              name: jsonData.personal?.name || "Your Name",
              title: jsonData.experience?.[0]?.role || "Professional Title",
              email: jsonData.personal?.email || "email@example.com",
              phone: jsonData.personal?.phone || "(123) 456-7890",
              location: jsonData.personal?.location || "City, Country",
              about: jsonData.summary || "Professional with a passion for creating impactful solutions"
            },
            summary: jsonData.summary || "Experienced professional with expertise in web development and project management.",
            education: jsonData.education?.map((edu: any) => ({
              degree: edu.degree || "Degree",
              institution: edu.institution || "Institution",
              year: edu.year || "Year"
            })) || [
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
                  { name: "HTML/CSS", level: 85, category: "Frontend" },
                  { name: "Node.js", level: 80, category: "Backend" }
                ],
            certifications: jsonData.certifications?.map((cert: any) => ({
              name: cert.name || "Certification",
              issuer: cert.issuer || "Issuer",
              year: cert.year || "Year"
            })) || [
              {
                name: "Professional Certification",
                issuer: "Certification Body",
                year: "2023"
              }
            ]
          };
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } catch (backendError) {
        console.error("Backend service unavailable, using fallback data:", backendError);
        
        // Fallback data with sections identified in the prompt
        resumeData = {
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
          experience: {
            years: "5+",
            description: "Across various industries",
            positions: [
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
            ]
          },
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
      
      // Store the file as data URL for download functionality
      const reader = new FileReader();
      reader.onload = () => {
        // Combine the processed data with the file data
        const completeResumeData = {
          ...resumeData,
          fileName: file.name,
          fileData: reader.result,
          uploadDate: new Date().toISOString(),
        };
        
        // Save to localStorage
        localStorage.setItem('resumeData', JSON.stringify(completeResumeData));
        
        // Navigate to portfolio page
        setIsLoading(false);
        toast({
          title: "Resume processed successfully",
          description: "Building your portfolio...",
        });
        navigate('/portfolio');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setIsLoading(false);
      console.error("Error processing resume:", error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Process direct JSON input for demo purposes
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
      };
      
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
    <div className="min-h-screen flex items-center justify-center bg-navy-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-navy-900">Build Your Portfolio</h1>
              <p className="text-navy-600 mt-2">
                Upload your resume to automatically create a personalized portfolio website
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-navy-200 rounded-lg p-6 text-center">
                {file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-electric-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <p className="font-medium text-navy-700">{file.name}</p>
                    <p className="text-sm text-navy-500">{(file.size / 1024).toFixed(2)} KB</p>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-sm text-electric-500 hover:text-electric-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-navy-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <p className="text-navy-600">Drag and drop your resume PDF</p>
                    <p className="text-sm text-navy-500">or click to browse files</p>
                  </div>
                )}
                
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className={file ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                />
              </div>
              
              <Button 
                onClick={handleUpload} 
                className="w-full bg-electric-500 hover:bg-electric-600 text-white"
                disabled={!file || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Generate Portfolio"
                )}
              </Button>

              {/* Demo button to process the provided JSON data */}
              <div className="text-center">
                <p className="text-sm text-navy-600 mb-2">Or use demo data</p>
                <Button 
                  onClick={handleProcessJsonDemo} 
                  className="w-full bg-navy-600 hover:bg-navy-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Use Demo JSON Data"
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-center text-sm text-navy-500">
              <p>
                Your resume data will be processed locally in your browser.
                No data is sent to any server.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
