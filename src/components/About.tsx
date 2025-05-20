
import React from 'react';
import { Button } from '@/components/ui/button';

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
  experience: {
    years: string;
    description: string;
  };
}

interface AboutProps {
  resumeData?: ResumeData;
}

const About: React.FC<AboutProps> = ({ resumeData }) => {
  const about = resumeData?.personalInfo?.about || "Professional with a passion for creating impactful solutions";
  const education = resumeData?.education?.[0] || { 
    degree: "Bachelor's Degree in Computer Science",
    institution: "University Name", 
    year: "20XX-20XX" 
  };
  const experience = resumeData?.experience || { 
    years: "X+", 
    description: "Across various industries" 
  };

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* About Image */}
          <div className="w-full md:w-5/12 lg:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-lg relative">
              {/* Placeholder image */}
              <div className="aspect-[4/5] bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center">
                <div className="text-navy-500 font-medium">About Image</div>
              </div>
              
              {/* Decoration */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-24 h-24 bg-electric-500 rounded-lg"></div>
            </div>
          </div>
          
          {/* About Content */}
          <div className="w-full md:w-7/12 lg:w-1/2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-electric-500 mb-2">About Me</h2>
              <h3 className="text-3xl font-bold text-navy-900">{about}</h3>
            </div>
            
            <p className="text-navy-600">
              With over {experience.years} years of experience in the industry, I've developed a deep understanding of 
              building solutions that balance technical excellence with user-centered design. 
              My approach combines analytical thinking with creative problem-solving to deliver 
              results that exceed expectations.
            </p>
            
            <p className="text-navy-600">
              I believe in continuous learning and staying on top of industry trends, which allows 
              me to implement cutting-edge solutions while ensuring they remain accessible and intuitive 
              for end users.
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
                  {experience.years} Years Professional Experience<br />
                  <span className="text-sm text-navy-500">{experience.description}</span>
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button className="bg-electric-500 hover:bg-electric-600 text-white">
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  Download Resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
