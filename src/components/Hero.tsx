
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-navy-50 to-navy-100"
    >
      <div className="container-custom grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-electric-500 font-semibold text-lg mb-2">
              Hello, I'm
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy-900 leading-tight">
              Your Name
            </h1>
            <p className="text-2xl sm:text-3xl text-navy-700 mt-2">
              Professional Title
            </p>
          </div>
          
          <p className="text-lg text-navy-600 max-w-lg">
            I specialize in creating elegant solutions to complex problems. 
            With expertise in development and design, I build modern applications 
            that deliver exceptional user experiences.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Button className="bg-electric-500 hover:bg-electric-600 text-white">
              <a href="#projects">View My Work</a>
            </Button>
            <Button variant="outline" className="border-electric-500 text-electric-500 hover:bg-electric-50">
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
          
          <div className="pt-4 flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               className="text-navy-500 hover:text-electric-500 transition-colors" 
               aria-label="GitHub profile">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
               className="text-navy-500 hover:text-electric-500 transition-colors" 
               aria-label="LinkedIn profile">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.223 0h.002z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
               className="text-navy-500 hover:text-electric-500 transition-colors" 
               aria-label="Twitter profile">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="hidden md:block relative animate-fade-in-slow">
          {/* Placeholder for professional headshot or illustration */}
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-electric-400 to-teal-500 shadow-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white text-lg font-medium">
              Your Photo Here
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -z-10 top-10 -right-10 w-40 h-40 bg-navy-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -z-10 -bottom-10 -left-10 w-60 h-60 bg-teal-200 rounded-full blur-3xl opacity-20"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
