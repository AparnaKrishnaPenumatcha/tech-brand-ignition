
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LeadershipSection: React.FC = () => {
  const leadershipRoles = [
    {
      title: "Tech Club President",
      organization: "University Technology Society",
      duration: "2023-Present",
      impact: "Led a team of 50+ members, organized 15+ tech events, increased membership by 200%"
    },
    {
      title: "Volunteer Coordinator",
      organization: "Local Code for Good Initiative",
      duration: "2022-2023",
      impact: "Coordinated 100+ volunteers for nonprofit tech projects, delivered 5 web applications"
    },
    {
      title: "Student Representative",
      organization: "Computer Science Department",
      duration: "2022-2023",
      impact: "Represented 300+ students, implemented new curriculum feedback system"
    }
  ];

  return (
    <section id="leadership" className="py-24 bg-navy-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-electric-500 mb-2">Leadership & Activities</h2>
          <h3 className="text-3xl font-bold text-navy-900">Driving Change & Innovation</h3>
          <p className="text-navy-600 mt-4 max-w-2xl mx-auto">
            Passionate about leading initiatives that create meaningful impact and drive positive change 
            in technology and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadershipRoles.map((role, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-navy-900">{role.title}</CardTitle>
                <p className="text-electric-500 font-medium">{role.organization}</p>
                <p className="text-sm text-navy-500">{role.duration}</p>
              </CardHeader>
              <CardContent>
                <p className="text-navy-600">{role.impact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
