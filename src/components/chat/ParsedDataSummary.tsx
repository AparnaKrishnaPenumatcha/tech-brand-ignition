
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import { ResumeData } from '@/utils/resumeProcessing';

interface ParsedDataSummaryProps {
  data: Partial<ResumeData>;
  onEditRequest: (fields: string[]) => void;
  onAcceptAll: () => void;
}

const ParsedDataSummary: React.FC<ParsedDataSummaryProps> = ({
  data,
  onEditRequest,
  onAcceptAll
}) => {
  const handleEditSection = (section: string) => {
    onEditRequest([section]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Resume Analysis Complete
        </CardTitle>
        <p className="text-sm text-navy-600">
          Here's what I found in your resume. You can edit any section or accept all the information.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Personal Information */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-navy-500" />
              <h3 className="font-medium">Personal Information</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditSection('personalInfo')}
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><strong>Name:</strong> {data.personalInfo?.name || 'Not found'}</div>
            <div><strong>Title:</strong> {data.personalInfo?.title || 'Not found'}</div>
            <div><strong>Email:</strong> {data.personalInfo?.email || 'Not found'}</div>
            <div><strong>Phone:</strong> {data.personalInfo?.phone || 'Not found'}</div>
            <div className="md:col-span-2"><strong>Location:</strong> {data.personalInfo?.location || 'Not found'}</div>
          </div>
        </div>

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-navy-500" />
                <h3 className="font-medium">Work Experience ({data.experience.length} entries)</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditSection('experience')}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              {data.experience.slice(0, 2).map((exp, index) => (
                <div key={index} className="text-sm">
                  <div><strong>{exp.title}</strong> at {exp.company}</div>
                  <div className="text-navy-600">{exp.duration}</div>
                </div>
              ))}
              {data.experience.length > 2 && (
                <div className="text-sm text-navy-500">
                  +{data.experience.length - 2} more entries
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-navy-500" />
                <h3 className="font-medium">Education ({data.education.length} entries)</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditSection('education')}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              {data.education.slice(0, 2).map((edu, index) => (
                <div key={index} className="text-sm">
                  <div><strong>{edu.degree}</strong></div>
                  <div className="text-navy-600">{edu.institution} - {edu.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-navy-500" />
                <h3 className="font-medium">Skills ({data.skills.length} skills)</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditSection('skills')}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.skills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-navy-100 text-navy-700 rounded text-xs"
                >
                  {skill.name}
                </span>
              ))}
              {data.skills.length > 8 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  +{data.skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onAcceptAll}
            className="flex-1 bg-electric-500 hover:bg-electric-600 text-white"
          >
            Looks Good - Continue
          </Button>
          <Button
            variant="outline"
            onClick={() => onEditRequest(['personalInfo', 'experience', 'education', 'skills'])}
          >
            Edit All Sections
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParsedDataSummary;
