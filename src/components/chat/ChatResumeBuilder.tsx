import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ChatInterface from './ChatInterface';
import ParsedDataSummary from './ParsedDataSummary';
import { processResumeFile, ResumeData } from '@/utils/resumeProcessing';
import { validateResumeFile } from '@/utils/fileValidation';
import { ChatMessage, FieldQuestion } from './types';

interface ChatResumeBuilderProps {
  onComplete: (data: ResumeData) => void;
}

type FlowStep = 'welcome' | 'upload-summary' | 'data-collection' | 'complete';

const FIELD_QUESTIONS: FieldQuestion[] = [
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

const ChatResumeBuilder: React.FC<ChatResumeBuilderProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm here to help you create your professional resume and portfolio. How would you like to get started?",
      timestamp: new Date(),
      options: ['Upload Resume', 'Enter Data Manually']
    }
  ]);
  
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [parsedData, setParsedData] = useState<Partial<ResumeData> | null>(null);
  const [collectedData, setCollectedData] = useState<Partial<ResumeData>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldsToEdit, setFieldsToEdit] = useState<string[]>([]);
  const [ignoredFields, setIgnoredFields] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);
  }, []);

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

  const getDefaultResumeData = (): ResumeData => ({
    fileName: 'chat_generated_resume',
    fileData: null,
    uploadDate: new Date().toISOString(),
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      about: '',
      profilePhoto: '',
      linkedin: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    leadership: '',
    testimonials: []
  });

  const parseListData = (text: string, field: string): any[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter(line => line.trim());
    
    switch (field) {
      case 'certifications':
        return lines.map(line => {
          const parts = line.split(' - ');
          return {
            name: parts[0] || line,
            issuer: parts[1] || '',
            year: parts[2] || ''
          };
        });
      
      case 'projects':
        return lines.map(line => {
          const parts = line.split(' | ');
          return {
            title: parts[0] || line,
            description: parts[1] || '',
            outcome: parts[2] || '',
            tags: []
          };
        });
      
      case 'experience':
        return lines.map(line => {
          const parts = line.split(' | ');
          return {
            title: parts[0] || line,
            company: parts[0]?.includes(' at ') ? parts[0].split(' at ')[1] : '',
            duration: parts[1] || '',
            description: parts[2] || ''
          };
        });
      
      case 'skills':
        return lines.map(line => ({
          name: line.trim(),
          level: 80,
          category: 'Other'
        }));
      
      case 'testimonials':
        return lines.map(line => {
          const parts = line.split(' - ');
          return {
            quote: parts[0] || line,
            name: parts[1] || '',
            role: parts[2] || ''
          };
        });
      
      default:
        return lines;
    }
  };

  const handleFileUpload = async (file: File, field?: string) => {
    if (field === 'personalInfo.profilePhoto') {
      const reader = new FileReader();
      reader.onload = () => {
        setCollectedData(prev => setNestedValue(prev, field, reader.result as string));
        
        addMessage({
          type: 'user',
          content: `Uploaded: ${file.name}`
        });
        
        addMessage({
          type: 'bot',
          content: "Great! I've saved your profile photo. Let's continue with the next question."
        });
        
        askNextQuestion();
      };
      reader.readAsDataURL(file);
      return;
    }

    if (!validateResumeFile(file)) return;
    
    setIsLoading(true);
    addMessage({
      type: 'user',
      content: `Uploaded: ${file.name}`
    });
    
    addMessage({
      type: 'bot',
      content: "Processing your resume... This might take a moment."
    });

    try {
      const resumeData = await processResumeFile(file);
      setParsedData(resumeData);
      
      addMessage({
        type: 'bot',
        content: "Perfect! I've analyzed your resume. Here's what I found:"
      });
      
      setCurrentStep('upload-summary');
    } catch (error) {
      addMessage({
        type: 'bot',
        content: "I had trouble processing your resume, but don't worry! Let's collect your information manually."
      });
      startDataCollection();
    } finally {
      setIsLoading(false);
    }
  };

  const startDataCollection = () => {
    setCurrentStep('data-collection');
    addMessage({
      type: 'bot',
      content: "Let's start building your profile! I'll ask you some questions to gather your information."
    });
    askNextQuestion();
  };

  const askNextQuestion = () => {
    const availableQuestions = FIELD_QUESTIONS.filter(q => 
      !ignoredFields.has(q.field) && 
      (!fieldsToEdit.length || fieldsToEdit.includes(q.field) || !getNestedValue(parsedData, q.field))
    );
    
    if (currentQuestionIndex >= availableQuestions.length) {
      completeDataCollection();
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

  const completeDataCollection = () => {
    console.log('=== ChatResumeBuilder: Starting data completion ===');
    console.log('Parsed data:', parsedData);
    console.log('Collected data:', collectedData);

    const baseData = getDefaultResumeData();
    const mergedData = {
      ...baseData,
      ...parsedData,
      ...collectedData
    };

    mergedData.personalInfo = {
      ...baseData.personalInfo,
      ...parsedData?.personalInfo,
      ...collectedData?.personalInfo
    };

    ['certifications', 'projects', 'experience', 'skills', 'testimonials'].forEach(field => {
      const textValue = getNestedValue(collectedData, field);
      if (typeof textValue === 'string' && textValue.trim()) {
        mergedData[field as keyof ResumeData] = parseListData(textValue, field) as any;
      }
    });

    console.log('Final merged data:', mergedData);

    addMessage({
      type: 'bot',
      content: "Excellent! I have all the information I need. Your resume and portfolio are ready!"
    });

    setCurrentStep('complete');
    onComplete(mergedData);
  };

  const handleSendMessage = (message: string, field?: string) => {
    addMessage({
      type: 'user',
      content: message
    });

    if (field) {
      console.log(`=== ChatResumeBuilder: Updating field ${field} with value:`, message);
      
      setCollectedData(prev => {
        const updated = setNestedValue(prev, field, message);
        console.log('Updated collected data:', updated);
        return updated;
      });
      
      addMessage({
        type: 'bot',
        content: "Got it! Moving on to the next question."
      });
      
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(askNextQuestion, 500);
    }
  };

  const handleOptionSelect = (option: string, field?: string) => {
    addMessage({
      type: 'user',
      content: option
    });

    if (option === 'Upload Resume') {
      addMessage({
        type: 'bot',
        content: "Great! Please upload your resume file (PDF or DOCX format).",
        inputType: 'file'
      });
    } else if (option === 'Enter Data Manually') {
      addMessage({
        type: 'bot',
        content: "Perfect! I'll guide you through entering your information step by step."
      });
      startDataCollection();
    } else if (option === 'Skip this field' && field) {
      setIgnoredFields(prev => new Set([...prev, field]));
      addMessage({
        type: 'bot',
        content: "No problem! Let's move on to the next question."
      });
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(askNextQuestion, 500);
    } else if (option === "No, looks good") {
      addMessage({
        type: 'bot',
        content: "Perfect! Your information looks complete. Let me build your resume and portfolio now."
      });
      completeDataCollection();
    } else if (option.startsWith("Edit ")) {
      const fieldToEdit = option.replace("Edit ", "").toLowerCase();
      setFieldsToEdit([fieldToEdit]);
      addMessage({
        type: 'bot',
        content: `Let's update your ${fieldToEdit}. What would you like to change?`
      });
      startDataCollection();
    }
  };

  const getCurrentInputType = (): 'text' | 'textarea' | 'file' | 'select' => {
    const lastBotMessage = [...messages].reverse().find(m => m.type === 'bot');
    return lastBotMessage?.inputType || 'text';
  };

  const getCurrentField = (): string | undefined => {
    const lastBotMessage = [...messages].reverse().find(m => m.type === 'bot');
    return lastBotMessage?.field;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">
          Build Your Resume & Portfolio
        </h1>
        <p className="text-navy-600">
          Let me help you create a professional resume and showcase your talents as a future leader in tech
        </p>
      </div>

      {currentStep === 'upload-summary' && parsedData && (
        <div className="mb-6">
          <ParsedDataSummary 
            data={parsedData}
            onEditRequest={(fields) => {
              setFieldsToEdit(fields);
              startDataCollection();
            }}
            onAcceptAll={() => {
              addMessage({
                type: 'user',
                content: "No, looks good"
              });
              handleOptionSelect("No, looks good");
            }}
          />
        </div>
      )}

      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onOptionSelect={handleOptionSelect}
        isLoading={isLoading}
        currentField={getCurrentField()}
        currentInputType={getCurrentInputType()}
      />
    </div>
  );
};

export default ChatResumeBuilder;
