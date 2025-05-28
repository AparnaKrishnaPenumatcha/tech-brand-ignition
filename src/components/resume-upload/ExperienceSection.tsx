
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResumeData } from '@/utils/resumeProcessing';

interface ExperienceSectionProps {
  experience: ResumeData['experience'];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience, onAdd, onUpdate }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Work Experience *</CardTitle>
        <Button type="button" onClick={onAdd} variant="outline" size="sm">
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label>Job Title *</Label>
              <Input
                value={exp.title}
                onChange={(e) => onUpdate(index, 'title', e.target.value)}
                placeholder="Software Developer"
                required
              />
            </div>
            <div>
              <Label>Company *</Label>
              <Input
                value={exp.company}
                onChange={(e) => onUpdate(index, 'company', e.target.value)}
                placeholder="Company Name"
                required
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                value={exp.duration}
                onChange={(e) => onUpdate(index, 'duration', e.target.value)}
                placeholder="2020-Present"
              />
            </div>
            <div className="md:col-span-1">
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => onUpdate(index, 'description', e.target.value)}
                placeholder="Key responsibilities and achievements"
                rows={2}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
