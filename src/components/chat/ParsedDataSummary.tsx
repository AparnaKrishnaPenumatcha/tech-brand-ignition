
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  // Check if data has meaningful content (not placeholders)
  const isMissingOrPlaceholder = (value: any, field: string): boolean => {
    if (!value) return true;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return true;
      
      // Check for placeholder data
      if (field === 'education') {
        return value.every(edu => 
          !edu.degree || 
          !edu.institution || 
          edu.degree.includes('Degree') || 
          edu.institution.includes('University Name')
        );
      }
      
      if (field === 'experience') {
        return value.every(exp => 
          !exp.title || 
          !exp.company || 
          exp.title.includes('Professional') || 
          exp.company.includes('Company')
        );
      }
      
      if (field === 'skills') {
        return value.length < 3 || value.every(skill => !skill.name || skill.name.trim() === '');
      }
      
      if (field === 'projects') {
        return value.every(proj => 
          !proj.title || 
          !proj.description || 
          proj.title.includes('Project')
        );
      }
    }
    
    if (typeof value === 'string') {
      if (!value.trim()) return true;
      
      const placeholders = [
        'Your Name', 'Professional Title', 'email@example.com', 
        '(123) 456-7890', 'City, Country', 'Professional with a passion'
      ];
      return placeholders.some(placeholder => value.includes(placeholder));
    }
    
    return false;
  };

  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    
    // Check personal info
    if (isMissingOrPlaceholder(data.personalInfo?.name, 'name')) missing.push('name');
    if (isMissingOrPlaceholder(data.personalInfo?.title, 'title')) missing.push('title');
    if (isMissingOrPlaceholder(data.personalInfo?.email, 'email')) missing.push('email');
    if (isMissingOrPlaceholder(data.personalInfo?.phone, 'phone')) missing.push('phone');
    if (isMissingOrPlaceholder(data.personalInfo?.location, 'location')) missing.push('location');
    
    // Check other fields
    if (isMissingOrPlaceholder(data.education, 'education')) missing.push('education');
    if (isMissingOrPlaceholder(data.experience, 'experience')) missing.push('experience');
    if (isMissingOrPlaceholder(data.skills, 'skills')) missing.push('skills');
    
    return missing;
  };

  const missingFields = getMissingFields();
  const hasSignificantData = missingFields.length < 5; // Allow proceeding if most data is present
  const hasMinimumData = !isMissingOrPlaceholder(data.personalInfo?.name, 'name') && 
                        !isMissingOrPlaceholder(data.personalInfo?.email, 'email');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Resume Data Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Here's what we extracted from your resume. You can edit specific fields or proceed if everything looks good.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            Personal Information
            {missingFields.some(f => ['name', 'title', 'email', 'phone', 'location'].includes(f)) && (
              <Badge variant="destructive" className="text-xs">Missing Data</Badge>
            )}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {data.personalInfo?.name || 'Not provided'}</div>
            <div><strong>Title:</strong> {data.personalInfo?.title || 'Not provided'}</div>
            <div><strong>Email:</strong> {data.personalInfo?.email || 'Not provided'}</div>
            <div><strong>Phone:</strong> {data.personalInfo?.phone || 'Not provided'}</div>
            <div className="col-span-2"><strong>Location:</strong> {data.personalInfo?.location || 'Not provided'}</div>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            Work Experience
            {missingFields.includes('experience') && (
              <Badge variant="destructive" className="text-xs">Missing Data</Badge>
            )}
          </h3>
          {data.experience && data.experience.length > 0 ? (
            <div className="space-y-2">
              {data.experience.slice(0, 3).map((exp, index) => (
                <div key={index} className="text-sm">
                  <strong>{exp.title}</strong> at {exp.company} ({exp.duration})
                </div>
              ))}
              {data.experience.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  And {data.experience.length - 3} more...
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No experience data found</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            Skills
            {missingFields.includes('skills') && (
              <Badge variant="destructive" className="text-xs">Missing Data</Badge>
            )}
          </h3>
          {data.skills && data.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {data.skills.slice(0, 10).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              {data.skills.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{data.skills.length - 10} more
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills data found</p>
          )}
        </div>

        {/* Education */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            Education
            {missingFields.includes('education') && (
              <Badge variant="destructive" className="text-xs">Missing Data</Badge>
            )}
          </h3>
          {data.education && data.education.length > 0 ? (
            <div className="space-y-2">
              {data.education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <strong>{edu.degree}</strong> from {edu.institution} ({edu.year})
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No education data found</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {missingFields.length > 0 && (
            <>
              <Button
                onClick={() => onEditRequest(['personalInfo.name', 'personalInfo.title', 'personalInfo.email'])}
                variant="outline"
                size="sm"
              >
                Complete Personal Info
              </Button>
              
              {missingFields.includes('experience') && (
                <Button
                  onClick={() => onEditRequest(['experience'])}
                  variant="outline"
                  size="sm"
                >
                  Add Experience
                </Button>
              )}
              
              {missingFields.includes('skills') && (
                <Button
                  onClick={() => onEditRequest(['skills'])}
                  variant="outline"
                  size="sm"
                >
                  Add Skills
                </Button>
              )}
              
              {missingFields.includes('education') && (
                <Button
                  onClick={() => onEditRequest(['education'])}
                  variant="outline"
                  size="sm"
                >
                  Add Education
                </Button>
              )}
            </>
          )}

          {/* Only show "proceed" options if we have minimum required data */}
          {hasMinimumData && (
            <>
              {hasSignificantData ? (
                <Button
                  onClick={onAcceptAll}
                  className="bg-electric-500 hover:bg-electric-600"
                  size="sm"
                >
                  Build Profile with Current Data
                </Button>
              ) : (
                <Button
                  onClick={onAcceptAll}
                  variant="outline"
                  size="sm"
                >
                  Continue with Basic Info Only
                </Button>
              )}
            </>
          )}
        </div>

        {!hasMinimumData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Missing Required Information:</strong> Please provide at least your name and email to continue.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParsedDataSummary;
