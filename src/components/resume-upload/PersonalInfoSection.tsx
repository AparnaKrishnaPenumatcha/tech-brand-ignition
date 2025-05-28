
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResumeData } from '@/utils/resumeProcessing';

interface PersonalInfoSectionProps {
  personalInfo: ResumeData['personalInfo'];
  onUpdate: (field: string, value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ personalInfo, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information *</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <Label htmlFor="title">Professional Title *</Label>
          <Input
            id="title"
            value={personalInfo.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="Software Developer"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => onUpdate('phone', e.target.value)}
            placeholder="(123) 456-7890"
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => onUpdate('location', e.target.value)}
            placeholder="City, Country"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            value={personalInfo.about}
            onChange={(e) => onUpdate('about', e.target.value)}
            placeholder="Brief description about yourself"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
