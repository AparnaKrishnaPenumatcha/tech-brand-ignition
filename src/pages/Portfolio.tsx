
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

interface ResumeData {
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
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience: {
    years: string;
    description: string;
    positions?: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
  };
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    tags: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  summary?: string;
}

const Portfolio: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if resume data exists in localStorage
    const storedData = localStorage.getItem('resumeData');
    
    if (!storedData) {
      toast({
        title: "No resume data found",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedData) as ResumeData;
      setResumeData(parsedData);
      
      // Create a downloadable URL for the resume if fileData exists
      if (typeof parsedData.fileData === 'string' && parsedData.fileData.startsWith('data:')) {
        setResumeUrl(parsedData.fileData);
      }
    } catch (error) {
      console.error("Error parsing resume data:", error);
      toast({
        title: "Data error",
        description: "Could not load your resume data",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [navigate]);

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-electric-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-navy-700">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main>
        <Hero resumeData={resumeData} />
        <About resumeData={resumeData} resumeUrl={resumeUrl} />
        <Skills resumeData={resumeData} />
        <Projects resumeData={resumeData} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
