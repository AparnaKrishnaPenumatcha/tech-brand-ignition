
import React from 'react';
import { ResumeData } from '@/utils/resumeProcessing';

export interface FieldQuestion {
  field: string;
  question: string;
  inputType: 'text' | 'textarea' | 'file';
  required: boolean;
  category: string;
}

export const FIELD_QUESTIONS: FieldQuestion[] = [
  { field: 'personalInfo.name', question: "What is your full name?", inputType: 'text', required: true, category: 'Personal' },
  { field: 'personalInfo.profilePhoto', question: "Please upload a professional headshot or profile photo.", inputType: 'file', required: false, category: 'Personal' },
  { field: 'personalInfo.about', question: "Write a short bio sharing your mission, leadership drive, and career goals.", inputType: 'textarea', required: false, category: 'Personal' },
  { field: 'personalInfo.title', question: "What's your professional title or the title you'd like to be known by?", inputType: 'text', required: true, category: 'Personal' },
  { field: 'personalInfo.email', question: "What email should appear on your portfolio?", inputType: 'text', required: true, category: 'Contact' },
  { field: 'personalInfo.phone', question: "What's your phone number?", inputType: 'text', required: false, category: 'Contact' },
  { field: 'personalInfo.location', question: "Where are you located? (City, State/Country)", inputType: 'text', required: false, category: 'Contact' },
  { field: 'personalInfo.linkedin', question: "What's your LinkedIn URL?", inputType: 'text', required: false, category: 'Contact' },
  { field: 'summary', question: "Please provide a brief professional summary about yourself.", inputType: 'textarea', required: false, category: 'About' },
  { field: 'certifications', question: "List any professional certificates you hold (one per line, format: Certificate Name - Issuer - Year).", inputType: 'textarea', required: false, category: 'Qualifications' },
  { field: 'projects', question: "Provide up to 5 projects, including the title, a one-sentence summary, and outcomes for each (format: Title | Description | Outcome).", inputType: 'textarea', required: false, category: 'Experience' },
  { field: 'experience', question: "For each past role, share the company name, dates, and 2–3 key responsibilities or results (format: Title at Company | Duration | Description).", inputType: 'textarea', required: false, category: 'Experience' },
  { field: 'leadership', question: "Describe any leadership roles or volunteer activities and their impact.", inputType: 'textarea', required: false, category: 'Leadership' },
  { field: 'skills', question: "List your technical and soft skills (one per line).", inputType: 'textarea', required: false, category: 'Skills' },
  { field: 'testimonials', question: "Provide up to 3 short quotes from mentors or colleagues, with names and roles (format: Quote - Name - Role).", inputType: 'textarea', required: false, category: 'Testimonials' },
];

interface DataCollectorProps {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;
  parsedData: Partial<ResumeData> | null;
  collectedData: Partial<ResumeData>;
  setCollectedData: (data: Partial<ResumeData> | ((prev: Partial<ResumeData>) => Partial<ResumeData>)) => void;
  fieldsToEdit: string[];
  ignoredFields: Set<string>;
  setIgnoredFields: (fields: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  onQuestionComplete: () => void;
  onDataComplete: () => void;
  addMessage: (message: any) => void;
}

export const useDataCollector = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [ignoredFields, setIgnoredFields] = React.useState<Set<string>>(new Set());

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
    const availableQuestions = FIELD_QUESTIONS.filter(q => 
      !ignoredFields.has(q.field) && 
      (!fieldsToEdit.length || fieldsToEdit.includes(q.field) || !getNestedValue(parsedData, q.field))
    );
    
    if (currentQuestionIndex >= availableQuestions.length) {
      onDataComplete();
      return;
    }

    const question = availableQuestions[currentQuestionIndex];
    const existingValue = getNestedValue(parsedData, question.field) || getNestedValue(collectedData, question.field);
    
    let questionText = question.question;
    if (existingValue && typeof existingValue === 'string') {
      questionText += `\n\nCurrent value: "${existingValue}"\nYou can modify it or press Enter to keep it.`;
    }

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
