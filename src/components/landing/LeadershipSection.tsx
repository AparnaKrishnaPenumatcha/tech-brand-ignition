
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award } from 'lucide-react';
import { ResumeData } from '@/utils/resumeProcessing';

interface LeadershipSectionProps {
  resumeData?: ResumeData | null;
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ resumeData }) => {
  // Default leadership activities
  const defaultActivities = [
    {
      title: "Student Organization Leader",
      organization: "Tech Innovation Club",
      duration: "2023-Present",
      description: "Leading a team of 25+ students in organizing tech workshops and hackathons, resulting in 300+ student participants.",
      icon: Users
    },
    {
      title: "Community Volunteer",
      organization: "Local Tech Mentorship Program",
      duration: "2022-Present",
      description: "Mentoring high school students in programming and career development, helping 15+ students secure internships.",
      icon: Target
    },
    {
      title: "Research Assistant",
      organization: "University Innovation Lab",
      duration: "2023",
      description: "Contributing to cutting-edge research in AI applications, co-authoring 2 published papers.",
      icon: Award
    }
  ];

  // Use experience data if available, otherwise use default activities
  const activities = resumeData?.experience?.length ? 
    resumeData.experience.filter(exp => exp.title !== 'Ignore' && exp.company !== 'Ignore').slice(0, 3).map((exp, index) => ({
      title: exp.title,
      organization: exp.company,
      duration: exp.duration,
      description: exp.description,
      icon: [Users, Target, Award][index] || Users
    })) : defaultActivities;

  return (
    <section className="py-24 bg-navy-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-lg font-semibold text-electric-500 mb-2">Leadership & Activities</h2>
          <h3 className="text-3xl font-bold text-navy-900">Making an Impact</h3>
          <p className="text-navy-600 mt-4 max-w-2xl mx-auto">
            Driving change through leadership roles, community involvement, and collaborative initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-electric-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-electric-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <p className="text-sm text-navy-600">{activity.organization}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-electric-500 font-medium mb-2">{activity.duration}</p>
                  <p className="text-navy-700">{activity.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
