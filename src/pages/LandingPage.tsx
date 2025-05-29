
import React, { useState, useEffect } from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import EnhancedHero from '@/components/landing/EnhancedHero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import LeadershipSection from '@/components/landing/LeadershipSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { ResumeData } from '@/utils/resumeProcessing';

const LandingPage: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    // Load resume data from localStorage if available
    const storedData = localStorage.getItem('resumeData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as ResumeData;
        setResumeData(parsedData);
      } catch (error) {
        console.error("Error parsing resume data:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <LandingHeader />
      <main>
        <EnhancedHero resumeData={resumeData} />
        <About resumeData={resumeData} />
        <Projects resumeData={resumeData} />
        <LeadershipSection resumeData={resumeData} />
        <Skills resumeData={resumeData} />
        <TestimonialsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
