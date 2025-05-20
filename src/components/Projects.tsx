
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  links: {
    demo?: string;
    code?: string;
  };
}

const Projects: React.FC = () => {
  // Sample projects data - replace with your own
  const projects: Project[] = [
    {
      title: "Project One",
      description: "A comprehensive web application built with React and Node.js that helps users manage their tasks efficiently with real-time updates.",
      image: "project1",
      tags: ["React", "Node.js", "MongoDB", "Socket.io"],
      links: {
        demo: "https://demo-url.com",
        code: "https://github.com/yourusername/project1"
      }
    },
    {
      title: "Project Two",
      description: "An e-commerce platform with advanced filtering, search, and payment integration to provide seamless shopping experience.",
      image: "project2",
      tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
      links: {
        demo: "https://demo-url.com",
        code: "https://github.com/yourusername/project2"
      }
    },
    {
      title: "Project Three",
      description: "A data visualization dashboard that transforms complex datasets into interactive and insightful visual representations.",
      image: "project3",
      tags: ["D3.js", "TypeScript", "Express", "Redux"],
      links: {
        demo: "https://demo-url.com",
        code: "https://github.com/yourusername/project3"
      }
    }
  ];

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-electric-500 mb-2">My Portfolio</h2>
          <h3 className="text-3xl font-bold text-navy-900">Recent Projects</h3>
          <p className="mt-4 text-navy-600 max-w-2xl mx-auto">
            Here are some of my recent projects that demonstrate my skills and experience.
            Each project reflects my commitment to quality and attention to detail.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden card-hover">
              <div className="aspect-video bg-navy-100 relative">
                {/* Project image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-300/50 to-navy-400/50 flex items-center justify-center text-navy-600 font-medium">
                  {project.title} Screenshot
                </div>
              </div>
              
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-navy-900 mb-2">{project.title}</h4>
                <p className="text-navy-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-electric-100 text-electric-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-4">
                  {project.links.demo && (
                    <Button 
                      variant="default" 
                      className="bg-electric-500 hover:bg-electric-600 text-white text-sm"
                      size="sm"
                    >
                      <a 
                        href={project.links.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <span>Live Demo</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    </Button>
                  )}
                  
                  {project.links.code && (
                    <Button 
                      variant="outline" 
                      className="text-navy-700 text-sm"
                      size="sm"
                    >
                      <a 
                        href={project.links.code} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <span>Source Code</span>
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="border-electric-500 text-electric-500 hover:bg-electric-50">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <span>View More On GitHub</span>
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
