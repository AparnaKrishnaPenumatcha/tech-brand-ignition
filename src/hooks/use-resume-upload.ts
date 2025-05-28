
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { processResumeFile } from '@/utils/resumeApiClient';
import { validateResumeFile } from '@/utils/fileValidation';

export function useResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMissingDataForm, setShowMissingDataForm] = useState<boolean>(false);
  const [incompleteResumeData, setIncompleteResumeData] = useState<any>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF or DOCX resume",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!validateResumeFile(file)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Process the file
      const completeResumeData = await processResumeFile(file!);
      
      // Check for missing data
      const { checkMissingData } = await import('@/utils/dataValidation');
      const missingDataReport = checkMissingData(completeResumeData);
      
      if (missingDataReport.hasMissingData) {
        setIncompleteResumeData(completeResumeData);
        setShowMissingDataForm(true);
        setIsLoading(false);
        
        toast({
          title: "Additional information needed",
          description: `Please provide: ${missingDataReport.missingFields.join(', ')}`,
        });
      } else {
        // Data is complete, proceed to portfolio
        localStorage.setItem('resumeData', JSON.stringify(completeResumeData));
        setIsLoading(false);
        toast({
          title: "Resume processed successfully",
          description: "Building your portfolio...",
        });
        navigate('/portfolio');
      }
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

  const handleCompleteData = (completeData: any) => {
    if (completeData) {
      // Save complete data to localStorage
      localStorage.setItem('resumeData', JSON.stringify(completeData));
      
      toast({
        title: "Portfolio data completed",
        description: "Building your portfolio...",
      });
      
      navigate('/portfolio');
    } else {
      // Trigger manual entry form
      setShowMissingDataForm(true);
      // Create empty resume data structure for manual entry
      const emptyResumeData = {
        personalInfo: {
          name: "Your Name",
          title: "Professional Title", 
          email: "email@example.com",
          phone: "(123) 456-7890",
          location: "City, Country",
          about: "Professional with a passion for creating impactful solutions"
        },
        summary: "Experienced professional with expertise in web development and project management.",
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
          }
        ],
        projects: [
          {
            title: "Project One",
            description: "A comprehensive web application built with React and Node.js.",
            tags: ["React", "Node.js", "MongoDB"]
          }
        ],
        skills: [
          { name: "JavaScript", level: 90, category: "Frontend" },
          { name: "TypeScript", level: 85, category: "Frontend" },
          { name: "React", level: 90, category: "Frontend" }
        ],
        certifications: [
          {
            name: "Professional Certification",
            issuer: "Certification Body",
            year: "2023"
          }
        ],
        fileName: "manual_entry",
        fileData: null,
        uploadDate: new Date().toISOString()
      };
      setIncompleteResumeData(emptyResumeData);
    }
  };

  return {
    file,
    setFile,
    isLoading,
    setIsLoading,
    showMissingDataForm,
    incompleteResumeData,
    handleFileChange,
    handleUpload,
    handleCompleteData
  };
}
