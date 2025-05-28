
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResumeData } from '@/utils/resumeProcessing';

interface MissingDataFormProps {
  incompleteData: ResumeData;
  onComplete: (completeData: ResumeData) => void;
}

const MissingDataForm: React.FC<MissingDataFormProps> = ({ incompleteData, onComplete }) => {
  const [formData, setFormData] = useState(incompleteData);

  const validateForm = () => {
    const { personalInfo, experience, education, skills } = formData;
    
    // Check required personal info fields
    if (!personalInfo.name.trim() || personalInfo.name === "Your Name") return false;
    if (!personalInfo.title.trim() || personalInfo.title === "Professional Title") return false;
    if (!personalInfo.email.trim() || personalInfo.email === "email@example.com") return false;
    if (!personalInfo.phone.trim() || personalInfo.phone === "(123) 456-7890") return false;
    if (!personalInfo.location.trim() || personalInfo.location === "City, Country") return false;
    
    // Check that at least one meaningful experience exists
    const hasValidExperience = experience.some(exp => 
      exp.title.trim() && exp.company.trim() && 
      !exp.title.includes("Professional") && 
      !exp.company.includes("Company")
    );
    if (!hasValidExperience) return false;
    
    // Check that at least one meaningful education exists
    const hasValidEducation = education.some(edu => 
      edu.degree.trim() && edu.institution.trim() && 
      !edu.degree.includes("Degree") && 
      !edu.institution.includes("University Name")
    );
    if (!hasValidEducation) return false;
    
    // Check that at least 3 skills exist with names
    const validSkills = skills.filter(skill => skill.name.trim());
    if (validSkills.length < 3) return false;
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }
    
    onComplete(formData);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: '', company: '', duration: '', description: '' }
      ]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', year: '' }
      ]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { name: '', level: 80, category: 'Other' }
      ]
    }));
  };

  const updateSkill = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const isFormValid = validateForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900">Complete Your Profile</h2>
        <p className="text-navy-600 mt-2">
          Please fill in any missing information to create your personalized portfolio
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information *</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <Label htmlFor="title">Professional Title *</Label>
            <Input
              id="title"
              value={formData.personalInfo.title}
              onChange={(e) => updatePersonalInfo('title', e.target.value)}
              placeholder="Software Developer"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="(123) 456-7890"
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="City, Country"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.personalInfo.about}
              onChange={(e) => updatePersonalInfo('about', e.target.value)}
              placeholder="Brief description about yourself"
              rows={3}
            />
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
                <Label>Job Title *</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="Software Developer"
                  required
                />
              </div>
              <div>
                <Label>Company *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  placeholder="2020-Present"
                />
              </div>
              <div className="md:col-span-1">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Key responsibilities and achievements"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education *</CardTitle>
          <Button type="button" onClick={addEducation} variant="outline" size="sm">
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Degree *</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Bachelor's in Computer Science"
                  required
                />
              </div>
              <div>
                <Label>Institution *</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="University Name"
                  required
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  placeholder="2020-2024"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Skills * (minimum 3 required)</CardTitle>
          <Button type="button" onClick={addSkill} variant="outline" size="sm">
            Add Skill
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="space-y-2">
                  <div>
                    <Label>Skill Name *</Label>
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      placeholder="JavaScript"
                      required
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          type="submit" 
          size="lg" 
          className={`${isFormValid ? 'bg-electric-500 hover:bg-electric-600' : 'bg-gray-400 cursor-not-allowed'} text-white`}
          disabled={!isFormValid}
        >
          Generate Portfolio
        </Button>
        {!isFormValid && (
          <p className="text-sm text-red-600 mt-2">
            Please fill in all required fields (marked with *)
          </p>
        )}
      </div>
    </form>
  );
};

export default MissingDataForm;
