
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function useResumeDownload() {
  const [hasResume, setHasResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if resume data exists in localStorage
    const storedData = localStorage.getItem('resumeData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setHasResume(true);
        
        // Create a downloadable URL for the resume if fileData exists
        if (typeof parsedData.fileData === 'string' && parsedData.fileData.startsWith('data:')) {
          setResumeUrl(parsedData.fileData);
        }
      } catch (error) {
        console.error("Error parsing resume data:", error);
        setHasResume(false);
      }
    } else {
      setHasResume(false);
    }
  }, []);

  const handleResumeDownload = () => {
    if (hasResume && resumeUrl) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded successfully",
      });
    } else if (hasResume) {
      // Generate a simple text resume if no file data available
      generateTextResume();
    } else {
      toast({
        title: "No resume available",
        description: "Please build your resume first",
        variant: "destructive",
      });
      navigate('/resume-builder');
    }
  };

  const generateTextResume = () => {
    const storedData = localStorage.getItem('resumeData');
    if (!storedData) return;
    
    try {
      const data = JSON.parse(storedData);
      
      let content = `${data.personalInfo.name}\n`;
      content += `${data.personalInfo.title}\n`;
      content += `Email: ${data.personalInfo.email}\n`;
      content += `Phone: ${data.personalInfo.phone}\n`;
      content += `Location: ${data.personalInfo.location}\n\n`;
      
      if (data.summary) {
        content += `SUMMARY\n${data.summary}\n\n`;
      }
      
      content += `EXPERIENCE\n`;
      data.experience.forEach((exp: any) => {
        if (exp.title && exp.company) {
          content += `${exp.title} at ${exp.company}\n`;
          content += `${exp.duration}\n`;
          content += `${exp.description}\n\n`;
        }
      });
      
      content += `SKILLS\n`;
      data.skills.forEach((skill: any) => {
        if (skill.name) {
          content += `• ${skill.name} (${skill.category})\n`;
        }
      });
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Resume downloaded",
        description: "Your resume has been downloaded as a text file",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your resume",
        variant: "destructive",
      });
    }
  };

  return {
    hasResume,
    resumeUrl,
    handleResumeDownload
  };
}
