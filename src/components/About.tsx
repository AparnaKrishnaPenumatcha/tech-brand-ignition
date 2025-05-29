
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useResumeDownload } from '@/hooks/use-resume-download';

interface ResumeData {
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
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
}

interface AboutProps {
  resumeData?: ResumeData;
  resumeUrl?: string | null;
}

const About: React.FC<AboutProps> = ({ resumeData }) => {
  const { handleResumeDownload } = useResumeDownload();
  
  const about = resumeData?.personalInfo?.about || "Professional with a passion for creating impactful solutions and driving innovation in technology";
  const education = resumeData?.education?.[0] || { 
    degree: "Bachelor's Degree in Computer Science",
    institution: "University Name", 
    year: "20XX-20XX" 
  };
  
  // Get years of experience based on the number of positions
  const experienceYears = resumeData?.experience?.length ? `${resumeData.experience.length}+` : "5+";
  const experienceDescription = "Leading teams and delivering innovative solutions";

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* About Image */}
          <div className="w-full md:w-5/12 lg:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-lg relative">
              {/* Placeholder image */}
              <div className="aspect-[4/5] bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
                <span className="text-navy-500 font-medium">About Image</span>
              </div>
              
              {/* Decoration */}
              <div className="absolute -z-10 w-16 h-16 bg-electric-500 rounded-lg -bottom-4 -left-4 md:-bottom-6 md:-left-6"></div>
              <div className="absolute -z-10 w-12 h-12 bg-teal-600 rounded-full -top-2 -right-2 md:-top-4 md:-right-4"></div>
            </div>
          </div>
          
          {/* About Content */}
          <div className="w-full md:w-7/12 lg:w-1/2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-electric-500 mb-2">About Me</h2>
              <h3 className="text-3xl font-bold text-navy-900">{about}</h3>
            </div>
            
            <p className="text-navy-600">
              With {experienceYears} years of experience in technology and leadership, I've developed a deep understanding of 
              building solutions that balance technical excellence with user-centered design. 
              My approach combines analytical thinking with creative problem-solving to deliver 
              results that exceed expectations and drive meaningful change.
            </p>
            
            <p className="text-navy-600">
              I believe in continuous learning and staying at the forefront of technological innovation, 
              which allows me to implement cutting-edge solutions while ensuring they remain accessible 
              and create real impact for users and organizations.
            </p>
            
            <div className="pt-4 grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-navy-800">Education</h4>
                <p className="text-navy-600 mt-2">
                  {education.degree}<br />
                  <span className="text-sm text-navy-500">{education.institution}, {education.year}</span>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-navy-800">Experience</h4>
                <p className="text-navy-600 mt-2">
                  {experienceYears} Years Professional Experience<br />
                  <span className="text-sm text-navy-500">{experienceDescription}</span>
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="bg-electric-500 hover:bg-electric-600 text-white"
                onClick={handleResumeDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
