
import React, { useState, useEffect } from 'react';
import GlobalNavigation from '@/components/navigation/GlobalNavigation';
import EnhancedHero from '@/components/landing/EnhancedHero';
import About from '@/components/About';
import CertificatesSection from '@/components/CertificatesSection';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import LeadershipSection from '@/components/landing/LeadershipSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { ResumeData } from '@/utils/resumeProcessing';

const LandingPage: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const loadResumeData = () => {
      console.log('=== LandingPage: Loading resume data ===');
      
      const storedData = localStorage.getItem('resumeData');
      console.log('Raw data from localStorage:', storedData);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as ResumeData;
          console.log('Parsed resume data in LandingPage:', parsedData);
          console.log('Personal info:', parsedData.personalInfo);
          setResumeData(parsedData);
        } catch (error) {
          console.error("Error parsing resume data:", error);
        }
      } else {
        console.log('No resume data found in localStorage');
      }
    };

    loadResumeData();

    const handleResumeUpdate = () => {
      console.log('=== LandingPage: Resume update event received ===');
      loadResumeData();
    };

    window.addEventListener('resumeDataUpdated', handleResumeUpdate);
    
    return () => {
      window.removeEventListener('resumeDataUpdated', handleResumeUpdate);
    };
  }, []);

  console.log('LandingPage render - current resumeData state:', resumeData);

  return (
    <div className="min-h-screen overflow-hidden">
      <GlobalNavigation />
      <main>
        <EnhancedHero resumeData={resumeData} />
        <About resumeData={resumeData} />
        <CertificatesSection resumeData={resumeData} />
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
