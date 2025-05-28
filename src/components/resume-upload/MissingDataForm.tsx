
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/utils/resumeProcessing';
import PersonalInfoSection from './PersonalInfoSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';

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

      <PersonalInfoSection 
        personalInfo={formData.personalInfo}
        onUpdate={updatePersonalInfo}
      />

      <ExperienceSection 
        experience={formData.experience}
        onAdd={addExperience}
        onUpdate={updateExperience}
      />

      <EducationSection 
        education={formData.education}
        onAdd={addEducation}
        onUpdate={updateEducation}
      />

      <SkillsSection 
        skills={formData.skills}
        onAdd={addSkill}
        onUpdate={updateSkill}
      />

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
