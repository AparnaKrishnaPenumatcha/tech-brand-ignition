
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface ResumeData {
  skills: Skill[];
}

interface SkillsProps {
  resumeData?: ResumeData;
}

const Skills: React.FC<SkillsProps> = ({ resumeData }) => {
  // Use resume data if available, otherwise use default skills
  const skills: Skill[] = resumeData?.skills || [
    { name: "JavaScript", level: 90, category: "Frontend" },
    { name: "TypeScript", level: 85, category: "Frontend" },
    { name: "React", level: 90, category: "Frontend" },
    { name: "HTML/CSS", level: 85, category: "Frontend" },
    { name: "Node.js", level: 80, category: "Backend" },
    { name: "Express", level: 75, category: "Backend" },
    { name: "Python", level: 70, category: "Backend" },
    { name: "SQL", level: 75, category: "Database" },
    { name: "MongoDB", level: 70, category: "Database" },
    { name: "Git", level: 85, category: "Tools" },
    { name: "UX/UI Design", level: 75, category: "Design" },
    { name: "Figma", level: 70, category: "Design" },
  ];

  // Extract unique categories from skills
  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  return (
    <section id="skills" className="py-24 bg-navy-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-electric-500 mb-2">My Expertise</h2>
          <h3 className="text-3xl font-bold text-navy-900">Technical Skills & Competencies</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const categorySkills = skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) return null;
            
            return (
              <Card key={category} className="card-hover">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-navy-800 mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span 
                        key={skill.name}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          skill.category === "Frontend" ? "bg-electric-100 text-electric-700" :
                          skill.category === "Backend" ? "bg-teal-100 text-teal-700" :
                          skill.category === "Database" ? "bg-electric-50 text-electric-600" :
                          "bg-navy-100 text-navy-700"
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Additional Card for Soft Skills */}
          <Card className="card-hover">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-navy-800 mb-4">Soft Skills</h3>
              <ul className="space-y-2 text-navy-700">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-electric-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Problem Solving
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-electric-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Team Collaboration
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-electric-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Communication
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-electric-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Time Management
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-electric-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Adaptability
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Languages or Certifications Card */}
          <Card className="card-hover">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-navy-800 mb-4">Certifications</h3>
              <ul className="space-y-3 text-navy-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-electric-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <div>
                    <span className="font-medium">AWS Certified Developer</span>
                    <p className="text-sm text-navy-500">Amazon Web Services, 2023</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-electric-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <div>
                    <span className="font-medium">Professional Scrum Master</span>
                    <p className="text-sm text-navy-500">Scrum.org, 2022</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
