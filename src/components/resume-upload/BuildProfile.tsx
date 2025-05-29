import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, Eye } from 'lucide-react';
import { ResumeData } from '@/utils/resumeProcessing';

interface BuildProfileProps {
  resumeData: ResumeData;
  onBack: () => void;
}

const BuildProfile: React.FC<BuildProfileProps> = ({ resumeData, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateProfile = async () => {
      setIsGenerating(true);
      
      console.log('=== BuildProfile: Starting data save process ===');
      console.log('Raw resumeData received:', resumeData);
      
      // Ensure we have a complete data structure
      const completeResumeData: ResumeData = {
        fileName: resumeData.fileName || 'chat_generated_resume',
        fileData: resumeData.fileData,
        uploadDate: resumeData.uploadDate || new Date().toISOString(),
        personalInfo: {
          name: resumeData.personalInfo?.name || '',
          title: resumeData.personalInfo?.title || '',
          email: resumeData.personalInfo?.email || '',
          phone: resumeData.personalInfo?.phone || '',
          location: resumeData.personalInfo?.location || '',
          about: resumeData.personalInfo?.about || '',
          profilePhoto: resumeData.personalInfo?.profilePhoto || ''
        },
        summary: resumeData.summary || '',
        education: resumeData.education || [],
        experience: resumeData.experience || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || []
      };
      
      console.log('Complete structured data to save:', completeResumeData);
      
      // Save to localStorage
      const dataToSave = JSON.stringify(completeResumeData);
      console.log('Data being saved to localStorage:', dataToSave);
      
      localStorage.setItem('resumeData', dataToSave);
      
      // Verify the save worked
      const savedData = localStorage.getItem('resumeData');
      console.log('Verification - data retrieved from localStorage:', savedData);
      
      if (savedData) {
        try {
          const parsedSavedData = JSON.parse(savedData);
          console.log('Parsed saved data:', parsedSavedData);
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a resume file for download
      const resumeContent = generateResumeContent(completeResumeData);
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setIsGenerating(false);
      setIsComplete(true);
      
      // Trigger update event for other components
      console.log('Dispatching resumeDataUpdated event');
      window.dispatchEvent(new CustomEvent('resumeDataUpdated'));
      
      console.log('=== BuildProfile: Data save process complete ===');
    };

    generateProfile();
  }, [resumeData]);

  const generateResumeContent = (data: ResumeData): string => {
    let content = `${data.personalInfo.name}\n`;
    content += `${data.personalInfo.title}\n`;
    content += `Email: ${data.personalInfo.email}\n`;
    if (data.personalInfo.phone) content += `Phone: ${data.personalInfo.phone}\n`;
    if (data.personalInfo.location) content += `Location: ${data.personalInfo.location}\n\n`;
    
    if (data.summary) {
      content += `SUMMARY\n${data.summary}\n\n`;
    }
    
    if (data.experience?.length) {
      content += `EXPERIENCE\n`;
      data.experience.forEach(exp => {
        content += `${exp.title} at ${exp.company}\n`;
        content += `${exp.duration}\n`;
        content += `${exp.description}\n\n`;
      });
    }
    
    if (data.skills?.length) {
      content += `SKILLS\n`;
      data.skills.forEach(skill => {
        content += `• ${skill.name} (${skill.category})\n`;
      });
      content += '\n';
    }
    
    if (data.education?.length) {
      content += `EDUCATION\n`;
      data.education.forEach(edu => {
        content += `${edu.degree}\n${edu.institution}\n${edu.year}\n\n`;
      });
    }
    
    if (data.certifications?.length) {
      content += `CERTIFICATIONS\n`;
      data.certifications.forEach(cert => {
        content += `${cert.name} - ${cert.issuer} (${cert.year})\n`;
      });
    }
    
    return content;
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Building Your Profile</h2>
        <p className="text-navy-600">
          We're creating your personalized resume and portfolio based on the information you provided
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <div className="w-5 h-5 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
            )}
            Profile Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-electric-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
              <p className="text-center text-navy-600">
                Processing your information and generating your portfolio...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700 font-medium">Portfolio generated successfully!</p>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Your personalized resume is ready for download and your portfolio landing page has been updated.
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleDownload}
                  className="bg-electric-500 hover:bg-electric-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
                
                <Link to="/">
                  <Button variant="outline" className="border-electric-500 text-electric-500 hover:bg-electric-50">
                    <Eye className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                </Link>
                
                <Button
                  onClick={onBack}
                  variant="outline"
                >
                  Make Changes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isComplete && (
        <div className="text-center text-sm text-navy-500">
          <p>
            Your portfolio has been generated and your landing page has been updated with your information.
            You can now view your complete portfolio or download your resume.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuildProfile;
