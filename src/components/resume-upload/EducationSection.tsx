
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/utils/resumeProcessing';

interface EducationSectionProps {
  education: ResumeData['education'];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, onAdd, onUpdate }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education *</CardTitle>
        <Button type="button" onClick={onAdd} variant="outline" size="sm">
          Add Education
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <Label>Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => onUpdate(index, 'degree', e.target.value)}
                placeholder="Bachelor's in Computer Science"
                required
              />
            </div>
            <div>
              <Label>Institution *</Label>
              <Input
                value={edu.institution}
                onChange={(e) => onUpdate(index, 'institution', e.target.value)}
                placeholder="University Name"
                required
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                value={edu.year}
                onChange={(e) => onUpdate(index, 'year', e.target.value)}
                placeholder="2020-2024"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EducationSection;
