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
  // Other resume data properties
}

interface HeroProps {
  resumeData?: ResumeData;
}

const Hero: React.FC<HeroProps> = ({ resumeData }) => {
  const name = resumeData?.personalInfo?.name || "Your Name";
  const title = resumeData?.personalInfo?.title || "Professional Title";
  
  return (
    <section id="home" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Hero Content */}
          <div className="w-full md:w-7/12 space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
                Hello, I'm <span className="text-electric-500">{name}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-navy-700 mt-4">
                {title}
              </h2>
            </div>
            
            <p className="text-lg text-navy-600 max-w-xl">
              Passionate about delivering exceptional results through innovative solutions and 
              attention to detail. Let's collaborate and bring your vision to life.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button className="bg-electric-500 hover:bg-electric-600 text-white">
                <a href="#contact">Get In Touch</a>
              </Button>
              <Button variant="outline" className="border-electric-500 text-electric-500 hover:bg-electric-50">
                <a href="#projects">View Portfolio</a>
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full md:w-5/12 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Placeholder image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-navy-100 to-navy-200 overflow-hidden flex items-center justify-center">
                <span className="text-navy-500 font-medium">Profile Image</span>
              </div>
              {/* Shape decorations */}
              <div className="absolute -z-10 w-16 h-16 bg-electric-500 rounded-lg -bottom-4 -left-4 md:-bottom-6 md:-left-6"></div>
              <div className="absolute -z-10 w-12 h-12 bg-teal-600 rounded-full -top-2 -right-2 md:-top-4 md:-right-4"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-electric-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-navy-100 rounded-full opacity-50"></div>
    </section>
  );
};

export default Hero;
