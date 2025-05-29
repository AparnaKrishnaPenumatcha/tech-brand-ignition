
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Check, User, Briefcase, GraduationCap, Award } from 'lucide-react';
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
  const renderPersonalInfo = () => {
    if (!data.personalInfo) return null;
    
    const { name, title, email, phone, location } = data.personalInfo;
    const fields = [
      { label: 'Name', value: name, field: 'personalInfo.name' },
      { label: 'Title', value: title, field: 'personalInfo.title' },
      { label: 'Email', value: email, field: 'personalInfo.email' },
      { label: 'Phone', value: phone, field: 'personalInfo.phone' },
      { label: 'Location', value: location, field: 'personalInfo.location' }
    ].filter(item => item.value);

    if (!fields.length) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-electric-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {fields.map((field, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <span className="font-medium text-navy-700">{field.label}:</span>
              <div className="flex items-center gap-2">
                <span className="text-navy-600">{field.value}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditRequest([field.field])}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderExperience = () => {
    if (!data.experience?.length) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-electric-500" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-electric-200 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-navy-900">{exp.title}</h4>
                  <p className="text-navy-700">{exp.company}</p>
                  <p className="text-sm text-navy-500">{exp.duration}</p>
                  {exp.description && (
                    <p className="text-sm text-navy-600 mt-1">{exp.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditRequest([`experience.${index}`])}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderEducation = () => {
    if (!data.education?.length) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="w-5 h-5 text-electric-500" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-navy-900">{edu.degree}</p>
                <p className="text-navy-700">{edu.institution}</p>
                <p className="text-sm text-navy-500">{edu.year}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEditRequest([`education.${index}`])}
                className="h-6 w-6 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderSkills = () => {
    if (!data.skills?.length) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5 text-electric-500" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-electric-100 text-electric-700">
                {skill.name}
              </Badge>
            ))}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEditRequest(['skills'])}
            className="mt-2 h-6 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit Skills
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-navy-900 mb-2">
          Resume Analysis Complete
        </h3>
        <p className="text-navy-600 mb-4">
          Here's what I found in your resume. You can edit any field or proceed if everything looks good.
        </p>
      </div>

      <div className="grid gap-4">
        {renderPersonalInfo()}
        {renderExperience()}
        {renderEducation()}
        {renderSkills()}
      </div>

      <div className="flex gap-3 justify-center pt-4">
        <Button
          onClick={onAcceptAll}
          className="bg-electric-500 hover:bg-electric-600"
        >
          <Check className="w-4 h-4 mr-2" />
          Looks Good - Continue
        </Button>
        <Button
          variant="outline"
          onClick={() => onEditRequest([])}
        >
          <Edit className="w-4 h-4 mr-2" />
          I Want to Edit Some Fields
        </Button>
      </div>
    </div>
  );
};

export default ParsedDataSummary;
