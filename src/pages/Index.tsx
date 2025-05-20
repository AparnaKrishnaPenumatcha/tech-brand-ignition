
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
      // In a real application, you would process the PDF here
      // For now, we'll simulate processing and store the file in localStorage
      
      // Read file as data URL to store in localStorage
      const reader = new FileReader();
      reader.onload = () => {
        const resumeData = {
          fileName: file.name,
          fileData: reader.result,
          uploadDate: new Date().toISOString(),
          // Mock data that would be extracted from resume
          personalInfo: {
            name: "Your Name",
            title: "Professional Title",
            email: "email@example.com",
            phone: "(123) 456-7890",
            location: "City, Country",
            about: "Professional with a passion for creating impactful solutions"
          },
          education: [
            {
              degree: "Bachelor's Degree in Computer Science",
              institution: "University Name",
              year: "20XX-20XX"
            }
          ],
          experience: {
            years: "X+",
            description: "Across various industries"
          },
          skills: [
            { name: "JavaScript", level: 90, category: "Frontend" },
            { name: "TypeScript", level: 85, category: "Frontend" },
            { name: "React", level: 90, category: "Frontend" },
            { name: "Node.js", level: 80, category: "Backend" }
          ]
        };
        
        // Save to localStorage
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        
        // Navigate to portfolio page
        setTimeout(() => {
          setIsLoading(false);
          toast({
            title: "Resume uploaded successfully",
            description: "Building your portfolio...",
          });
          navigate('/portfolio');
        }, 1500);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume",
        variant: "destructive",
      });
      console.error("Error uploading resume:", error);
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
