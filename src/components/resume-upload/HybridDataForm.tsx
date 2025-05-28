
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ResumeData } from '@/utils/resumeProcessing';

interface HybridDataFormProps {
  parsedData: ResumeData;
  onComplete: (completeData: ResumeData) => void;
}

const HybridDataForm: React.FC<HybridDataFormProps> = ({ parsedData, onComplete }) => {
  const [formData, setFormData] = useState(parsedData);
  const [ignoredFields, setIgnoredFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    console.log('Validating form...', { formData, ignoredFields });
    const newErrors: Record<string, string> = {};
    
    // Check personal info
    if (!formData.personalInfo.name && !ignoredFields['personalInfo.name']) {
      newErrors['personalInfo.name'] = 'Name is required or check Ignore';
    }
    if (!formData.personalInfo.email && !ignoredFields['personalInfo.email']) {
      newErrors['personalInfo.email'] = 'Email is required or check Ignore';
    }
    if (!formData.personalInfo.phone && !ignoredFields['personalInfo.phone']) {
      newErrors['personalInfo.phone'] = 'Phone is required or check Ignore';
    }
    if (!formData.personalInfo.location && !ignoredFields['personalInfo.location']) {
      newErrors['personalInfo.location'] = 'Location is required or check Ignore';
    }
    if (!formData.personalInfo.title && !ignoredFields['personalInfo.title']) {
      newErrors['personalInfo.title'] = 'Professional title is required or check Ignore';
    }

    // Check if there's meaningful experience
    const hasValidExperience = formData.experience.some(exp => 
      exp.title && exp.company && exp.title.trim() !== '' && exp.company.trim() !== ''
    );
    if (!hasValidExperience && !ignoredFields['experience']) {
      newErrors['experience'] = 'At least one valid work experience is required or check Ignore';
    }

    // Check skills - count skills with non-empty names
    const validSkills = formData.skills.filter(skill => 
      skill.name && skill.name.trim() !== ''
    );
    console.log('Valid skills count:', validSkills.length, validSkills);
    
    if (validSkills.length < 3 && !ignoredFields['skills']) {
      newErrors['skills'] = 'At least 3 skills are required or check Ignore';
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
    
    // Clear error for this field
    const fieldKey = `personalInfo.${field}`;
    if (errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: '' }));
    }
  };

  const toggleIgnoreField = (fieldKey: string, checked: boolean) => {
    console.log('Toggling ignore field:', fieldKey, checked);
    setIgnoredFields(prev => ({ ...prev, [fieldKey]: checked }));
    
    // Clear error for this field if ignored
    if (checked && errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: '' }));
    }
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
    
    if (errors['experience']) {
      setErrors(prev => ({ ...prev, experience: '' }));
    }
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 80, category: 'Other' }]
    }));
  };

  const updateSkill = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
    
    if (errors['skills']) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted, validating...');
    if (!validateForm()) {
      console.log('Validation failed, not proceeding');
      return;
    }
    
    console.log('Validation passed, calling onComplete');
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900">Review & Complete Your Information</h2>
        <p className="text-navy-600 mt-2">
          Fill in any missing details or check "Ignore" to skip optional fields.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.personalInfo.name}
                onChange={(e) => updatePersonalInfo('name', e.target.value)}
                placeholder="Enter your full name"
                className={errors['personalInfo.name'] ? 'border-red-500' : ''}
                disabled={ignoredFields['personalInfo.name']}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-name"
                  checked={ignoredFields['personalInfo.name'] || false}
                  onCheckedChange={(checked) => toggleIgnoreField('personalInfo.name', checked as boolean)}
                />
                <Label htmlFor="ignore-name" className="text-sm">Ignore</Label>
              </div>
            </div>
            {errors['personalInfo.name'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.name']}</p>
            )}
          </div>
          
          <div>
            <Label>Professional Title</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                placeholder="Enter your title"
                className={errors['personalInfo.title'] ? 'border-red-500' : ''}
                disabled={ignoredFields['personalInfo.title']}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-title"
                  checked={ignoredFields['personalInfo.title'] || false}
                  onCheckedChange={(checked) => toggleIgnoreField('personalInfo.title', checked as boolean)}
                />
                <Label htmlFor="ignore-title" className="text-sm">Ignore</Label>
              </div>
            </div>
            {errors['personalInfo.title'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.title']}</p>
            )}
          </div>
          
          <div>
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="Enter your email"
                className={errors['personalInfo.email'] ? 'border-red-500' : ''}
                disabled={ignoredFields['personalInfo.email']}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-email"
                  checked={ignoredFields['personalInfo.email'] || false}
                  onCheckedChange={(checked) => toggleIgnoreField('personalInfo.email', checked as boolean)}
                />
                <Label htmlFor="ignore-email" className="text-sm">Ignore</Label>
              </div>
            </div>
            {errors['personalInfo.email'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.email']}</p>
            )}
          </div>
          
          <div>
            <Label>Phone</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="Enter your phone"
                className={errors['personalInfo.phone'] ? 'border-red-500' : ''}
                disabled={ignoredFields['personalInfo.phone']}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-phone"
                  checked={ignoredFields['personalInfo.phone'] || false}
                  onCheckedChange={(checked) => toggleIgnoreField('personalInfo.phone', checked as boolean)}
                />
                <Label htmlFor="ignore-phone" className="text-sm">Ignore</Label>
              </div>
            </div>
            {errors['personalInfo.phone'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.phone']}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="Enter your location"
                className={errors['personalInfo.location'] ? 'border-red-500' : ''}
                disabled={ignoredFields['personalInfo.location']}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-location"
                  checked={ignoredFields['personalInfo.location'] || false}
                  onCheckedChange={(checked) => toggleIgnoreField('personalInfo.location', checked as boolean)}
                />
                <Label htmlFor="ignore-location" className="text-sm">Ignore</Label>
              </div>
            </div>
            {errors['personalInfo.location'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.location']}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Work Experience
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-experience"
                  checked={ignoredFields['experience'] || false}
                  onCheckedChange={(checked) => toggleIgnoreField('experience', checked as boolean)}
                />
                <Label htmlFor="ignore-experience" className="text-sm">Ignore</Label>
              </div>
            </CardTitle>
          </div>
          <Button type="button" onClick={addExperience} variant="outline" size="sm" disabled={ignoredFields['experience']}>
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!ignoredFields['experience'] && formData.experience.map((exp, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  placeholder="e.g., 2020-Present"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Brief description of your role"
                  rows={2}
                />
              </div>
            </div>
          ))}
          {errors['experience'] && (
            <p className="text-red-500 text-sm">{errors['experience']}</p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Skills (minimum 3 required)
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-skills"
                  checked={ignoredFields['skills'] || false}
                  onCheckedChange={(checked) => toggleIgnoreField('skills', checked as boolean)}
                />
                <Label htmlFor="ignore-skills" className="text-sm">Ignore</Label>
              </div>
            </CardTitle>
          </div>
          <Button type="button" onClick={addSkill} variant="outline" size="sm" disabled={ignoredFields['skills']}>
            Add Skill
          </Button>
        </CardHeader>
        <CardContent>
          {!ignoredFields['skills'] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div>
                    <Label>Skill Name</Label>
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      placeholder="Enter skill"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(index, 'category', e.target.value)}
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
              ))}
            </div>
          )}
          {errors['skills'] && (
            <p className="text-red-500 text-sm mt-2">{errors['skills']}</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          type="submit" 
          size="lg" 
          className="bg-electric-500 hover:bg-electric-600 text-white"
        >
          Build Profile
        </Button>
      </div>
    </form>
  );
};

export default HybridDataForm;
