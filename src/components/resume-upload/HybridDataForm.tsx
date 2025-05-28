
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResumeData } from '@/utils/resumeProcessing';

interface HybridDataFormProps {
  parsedData: ResumeData;
  onComplete: (completeData: ResumeData) => void;
}

const HybridDataForm: React.FC<HybridDataFormProps> = ({ parsedData, onComplete }) => {
  const [formData, setFormData] = useState(parsedData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDefaultValue = (value: string, defaultValues: string[]) => {
    return defaultValues.some(def => value.includes(def) || def.includes(value));
  };

  const validateAndGetMissingFields = () => {
    const missing: Record<string, string> = {};
    
    // Check personal info
    if (!formData.personalInfo.name || isDefaultValue(formData.personalInfo.name, ["Your Name"])) {
      missing['personalInfo.name'] = 'Name is required';
    }
    if (!formData.personalInfo.email || isDefaultValue(formData.personalInfo.email, ["email@example.com"])) {
      missing['personalInfo.email'] = 'Email is required';
    }
    if (!formData.personalInfo.phone || isDefaultValue(formData.personalInfo.phone, ["(123) 456-7890"])) {
      missing['personalInfo.phone'] = 'Phone is required';
    }
    if (!formData.personalInfo.location || isDefaultValue(formData.personalInfo.location, ["City, Country"])) {
      missing['personalInfo.location'] = 'Location is required';
    }
    if (!formData.personalInfo.title || isDefaultValue(formData.personalInfo.title, ["Professional Title"])) {
      missing['personalInfo.title'] = 'Professional title is required';
    }

    // Check if there's meaningful experience
    const hasValidExperience = formData.experience.some(exp => 
      exp.title && exp.company && 
      !isDefaultValue(exp.title, ["Professional", "Developer"]) &&
      !isDefaultValue(exp.company, ["Company", "Tech Company"])
    );
    if (!hasValidExperience) {
      missing['experience'] = 'At least one valid work experience is required';
    }

    // Check skills
    const validSkills = formData.skills.filter(skill => 
      skill.name && !isDefaultValue(skill.name, ["JavaScript", "TypeScript", "React"])
    );
    if (validSkills.length < 3) {
      missing['skills'] = 'At least 3 skills are required';
    }

    return missing;
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
    
    const missingFields = validateAndGetMissingFields();
    
    if (Object.keys(missingFields).length > 0) {
      setErrors(missingFields);
      return;
    }
    
    onComplete(formData);
  };

  const missingFields = validateAndGetMissingFields();
  const canProceed = Object.keys(missingFields).length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900">Review & Complete Your Information</h2>
        <p className="text-navy-600 mt-2">
          We've extracted some information from your resume. Please fill in any missing details or type "Ignore" to skip.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input
              value={formData.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              placeholder="Enter your full name or type 'Ignore'"
              className={errors['personalInfo.name'] ? 'border-red-500' : ''}
            />
            {errors['personalInfo.name'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.name']}</p>
            )}
          </div>
          
          <div>
            <Label>Professional Title *</Label>
            <Input
              value={formData.personalInfo.title}
              onChange={(e) => updatePersonalInfo('title', e.target.value)}
              placeholder="Enter your title or type 'Ignore'"
              className={errors['personalInfo.title'] ? 'border-red-500' : ''}
            />
            {errors['personalInfo.title'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.title']}</p>
            )}
          </div>
          
          <div>
            <Label>Email *</Label>
            <Input
              value={formData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="Enter your email or type 'Ignore'"
              className={errors['personalInfo.email'] ? 'border-red-500' : ''}
            />
            {errors['personalInfo.email'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.email']}</p>
            )}
          </div>
          
          <div>
            <Label>Phone *</Label>
            <Input
              value={formData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="Enter your phone or type 'Ignore'"
              className={errors['personalInfo.phone'] ? 'border-red-500' : ''}
            />
            {errors['personalInfo.phone'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.phone']}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Label>Location *</Label>
            <Input
              value={formData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="Enter your location or type 'Ignore'"
              className={errors['personalInfo.location'] ? 'border-red-500' : ''}
            />
            {errors['personalInfo.location'] && (
              <p className="text-red-500 text-sm mt-1">{errors['personalInfo.location']}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Experience *</CardTitle>
          <Button type="button" onClick={addExperience} variant="outline" size="sm">
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Job Title</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="Enter job title or type 'Ignore'"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Enter company name or type 'Ignore'"
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
          <CardTitle>Skills * (minimum 3)</CardTitle>
          <Button type="button" onClick={addSkill} variant="outline" size="sm">
            Add Skill
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div>
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="Enter skill or type 'Ignore'"
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
          {errors['skills'] && (
            <p className="text-red-500 text-sm mt-2">{errors['skills']}</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          type="submit" 
          size="lg" 
          className={`${canProceed ? 'bg-electric-500 hover:bg-electric-600' : 'bg-gray-400 cursor-not-allowed'} text-white`}
          disabled={!canProceed}
        >
          Build Profile
        </Button>
        {!canProceed && (
          <p className="text-sm text-red-600 mt-2">
            Please fill in all required fields or type "Ignore" to skip
          </p>
        )}
      </div>
    </form>
  );
};

export default HybridDataForm;
