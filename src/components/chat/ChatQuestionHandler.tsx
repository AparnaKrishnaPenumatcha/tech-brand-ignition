
import React from 'react';
import { FieldQuestion } from './types';
import { ResumeData } from '@/utils/resumeProcessing';

interface ChatQuestionHandlerProps {
  questions: FieldQuestion[];
  currentIndex: number;
  parsedData: Partial<ResumeData> | null;
  collectedData: Partial<ResumeData>;
  fieldsToEdit: string[];
  ignoredFields: Set<string>;
  onAddMessage: (message: any) => void;
  onComplete: () => void;
}

const ChatQuestionHandler: React.FC<ChatQuestionHandlerProps> = ({
  questions,
  currentIndex,
  parsedData,
  collectedData,
  fieldsToEdit,
  ignoredFields,
  onAddMessage,
  onComplete
}) => {
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const askNextQuestion = () => {
    const availableQuestions = questions.filter(q => 
      !ignoredFields.has(q.field) && 
      (!fieldsToEdit.length || fieldsToEdit.includes(q.field) || !getNestedValue(parsedData, q.field))
    );
    
    if (currentIndex >= availableQuestions.length) {
      onComplete();
      return;
    }

    const question = availableQuestions[currentIndex];
    const existingValue = getNestedValue(parsedData, question.field) || getNestedValue(collectedData, question.field);
    
    let questionText = question.question;
    if (existingValue && typeof existingValue === 'string') {
      questionText += `\n\nCurrent value: "${existingValue}"\nYou can modify it or press Enter to keep it.`;
    }

    onAddMessage({
      type: 'bot',
      content: questionText,
      field: question.field,
      inputType: question.inputType,
      options: question.required ? undefined : ['Skip this field']
    });
  };

  React.useEffect(() => {
    askNextQuestion();
  }, [currentIndex]);

  return null; // This is a logic component, no UI
};

export default ChatQuestionHandler;
