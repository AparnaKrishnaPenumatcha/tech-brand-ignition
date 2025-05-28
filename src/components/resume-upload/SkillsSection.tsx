
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ResumeData } from '@/utils/resumeProcessing';

interface SkillsSectionProps {
  skills: ResumeData['skills'];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onAdd, onUpdate }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skills * (minimum 3 required)</CardTitle>
        <Button type="button" onClick={onAdd} variant="outline" size="sm">
          Add Skill
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="space-y-2">
                <div>
                  <Label>Skill Name *</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => onUpdate(index, 'name', e.target.value)}
                    placeholder="JavaScript"
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={skill.category}
                    onChange={(e) => onUpdate(index, 'category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
