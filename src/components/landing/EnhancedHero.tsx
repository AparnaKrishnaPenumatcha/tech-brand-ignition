
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useResumeDownload } from '@/hooks/use-resume-download';

const EnhancedHero: React.FC = () => {
  const { handleResumeDownload, hasResume } = useResumeDownload();
  
  return (
    <section id="home" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Hero Content */}
          <div className="w-full md:w-7/12 space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
                Hello, I'm <span className="text-electric-500">Your Name</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-navy-700 mt-4">
                Future Leader in Tech & Innovation
              </h2>
            </div>
            
            <p className="text-lg text-navy-600 max-w-xl">
              Passionate about driving technological advancement and leading innovative solutions 
              that create meaningful impact. Ready to shape the future of technology.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button 
                className="bg-electric-500 hover:bg-electric-600 text-white"
                onClick={handleResumeDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
              <Button variant="outline" className="border-electric-500 text-electric-500 hover:bg-electric-50">
                <a href="#projects">View Projects</a>
              </Button>
            </div>
            
            {!hasResume && (
              <p className="text-sm text-navy-500">
                No resume available yet? <a href="/resume-builder" className="text-electric-500 hover:underline">Build one here</a>
              </p>
            )}
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

export default EnhancedHero;
