
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import EnhancedHero from '@/components/landing/EnhancedHero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import LeadershipSection from '@/components/landing/LeadershipSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <LandingHeader />
      <main>
        <EnhancedHero />
        <About />
        <Projects />
        <LeadershipSection />
        <Skills />
        <TestimonialsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
