
import { useState } from 'react';
import { ResumeData } from '@/utils/resumeProcessing';
import { FieldQuestion } from './types';

export const FIELD_QUESTIONS: FieldQuestion[] = [
  { field: 'personalInfo.name', question: "What is your full name?", inputType: 'text', required: true, category: 'Personal' },
  { field: 'personalInfo.profilePhoto', question: "Please upload a professional headshot or profile photo.", inputType: 'file', required: false, category: 'Personal' },
  { field: 'personalInfo.about', question: "**About me:** Write a short bio sharing your mission, leadership drive, and career goals.", inputType: 'textarea', required: false, category: 'Personal' },
  { field: 'personalInfo.title', question: "What's your professional title or the title you'd like to be known by?", inputType: 'text', required: true, category: 'Personal' },
  { field: 'personalInfo.email', question: "What email should appear on your portfolio?", inputType: 'text', required: true, category: 'Contact' },
  { field: 'personalInfo.phone', question: "What's your phone number?", inputType: 'text', required: false, category: 'Contact' },
  { field: 'personalInfo.location', question: "Where are you located? (City, State/Country)", inputType: 'text', required: false, category: 'Contact' },
  { field: 'personalInfo.linkedin', question: "What's your LinkedIn URL?", inputType: 'text', required: false, category: 'Contact' },
  { field: 'summary', question: "**About me:** Please provide a brief professional summary about yourself.", inputType: 'textarea', required: false, category: 'About' },
  { field: 'education', question: "**Education:** Please provide your educational background (format: Degree - Institution - Year, one per line).", inputType: 'textarea', required: false, category: 'Education' },
  { field: 'experience', question: "**Experience:** For each past role, share the company name, dates, and 2–3 key responsibilities or results (format: Title at Company | Duration | Description).", inputType: 'textarea', required: false, category: 'Experience' },
  { field: 'projects', question: "**Projects:** Provide up to 5 projects, including the title, a one-sentence summary, and outcomes for each (format: Title | Description | Outcome).", inputType: 'textarea', required: false, category: 'Projects' },
  { field: 'skills', question: "**Skills:** List your technical and soft skills (one per line).", inputType: 'textarea', required: false, category: 'Skills' },
  { field: 'certifications', question: "**Certificates:** List any professional certificates you hold (one per line, format: Certificate Name - Issuer - Year).", inputType: 'textarea', required: false, category: 'Certifications' },
  { field: 'leadership', question: "**Leadership:** Describe any leadership roles or volunteer activities and their impact.", inputType: 'textarea', required: false, category: 'Leadership' },
  { field: 'testimonials', question: "**Testimonials:** Provide up to 3 short quotes from mentors or colleagues, with names and roles (format: Quote - Name - Role).", inputType: 'textarea', required: false, category: 'Testimonials' },
];

export const useDataCollector = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ignoredFields, setIgnoredFields] = useState<Set<string>>(new Set());

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  };

  const isMissingOrEmpty = (value: any, field: string): boolean => {
    if (!value) return true;
    
    // For arrays, check if empty or contains only placeholder data
    if (Array.isArray(value)) {
      if (value.length === 0) return true;
      
      // Check for placeholder education data
      if (field === 'education') {
        return value.every(edu => 
          !edu.degree || 
          !edu.institution || 
          edu.degree.includes('Degree') || 
          edu.institution.includes('University Name')
        );
      }
      
      // Check for placeholder experience data
      if (field === 'experience') {
        return value.every(exp => 
          !exp.title || 
          !exp.company || 
          exp.title.includes('Professional') || 
          exp.company.includes('Company')
        );
      }
      
      // Check for placeholder projects
      if (field === 'projects') {
        return value.every(proj => 
          !proj.title || 
          !proj.description || 
          proj.title.includes('Project')
        );
      }
      
      // Check for placeholder certifications
      if (field === 'certifications') {
        return value.every(cert => 
          !cert.name || 
          cert.name.includes('Certification')
        );
      }
      
      // For skills, check if we have meaningful skills
      if (field === 'skills') {
        return value.length < 3 || value.every(skill => !skill.name || skill.name.trim() === '');
      }
    }
    
    // For strings, check if empty or placeholder
    if (typeof value === 'string') {
      if (!value.trim()) return true;
      
      // Check for common placeholder values
      const placeholders = [
        'Your Name', 'Professional Title', 'email@example.com', 
        '(123) 456-7890', 'City, Country', 'Professional with a passion'
      ];
      return placeholders.some(placeholder => value.includes(placeholder));
    }
    
    return false;
  };

  const askNextQuestion = ({
    parsedData,
    collectedData,
    fieldsToEdit,
    addMessage,
    onDataComplete
  }: {
    parsedData: Partial<ResumeData> | null;
    collectedData: Partial<ResumeData>;
    fieldsToEdit: string[];
    addMessage: (message: any) => void;
    onDataComplete: () => void;
  }) => {
    // Filter questions to only include missing or placeholder data
    const questionsToAsk = FIELD_QUESTIONS.filter(q => {
      if (ignoredFields.has(q.field)) return false;
      
      // If we have specific fields to edit, only ask about those
      if (fieldsToEdit.length > 0) {
        return fieldsToEdit.includes(q.field);
      }
      
      // Check if the field is missing or has placeholder data
      const parsedValue = getNestedValue(parsedData, q.field);
      const collectedValue = getNestedValue(collectedData, q.field);
      
      // If we already have collected data for this field, skip it
      if (collectedValue && !isMissingOrEmpty(collectedValue, q.field)) {
        return false;
      }
      
      // Ask for this field if it's missing or has placeholder data
      return isMissingOrEmpty(parsedValue, q.field);
    });
    
    console.log('=== DataCollector: Questions to ask ===');
    console.log('Total questions:', questionsToAsk.length);
    console.log('Current question index:', currentQuestionIndex);
    console.log('Questions:', questionsToAsk.map(q => q.field));
    
    if (currentQuestionIndex >= questionsToAsk.length) {
      console.log('=== DataCollector: All questions completed ===');
      onDataComplete();
      return;
    }

    const question = questionsToAsk[currentQuestionIndex];
    const existingValue = getNestedValue(parsedData, question.field) || getNestedValue(collectedData, question.field);
    
    let questionText = question.question;
    if (existingValue && typeof existingValue === 'string' && !isMissingOrEmpty(existingValue, question.field)) {
      questionText += `\n\nCurrent value: "${existingValue}"\nYou can modify it or press Enter to keep it.`;
    }

    console.log('=== DataCollector: Asking question ===');
    console.log('Field:', question.field);
    console.log('Question:', questionText);

    addMessage({
      type: 'bot',
      content: questionText,
      field: question.field,
      inputType: question.inputType,
      options: question.required ? undefined : ['Skip this field']
    });
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    ignoredFields,
    setIgnoredFields,
    askNextQuestion,
    getNestedValue,
    setNestedValue
  };
};
