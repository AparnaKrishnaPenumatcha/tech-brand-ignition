
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ChatInterface from './ChatInterface';
import ParsedDataSummary from './ParsedDataSummary';
import { ResumeData } from '@/utils/resumeProcessing';
import { useFlowManager } from './FlowManager';
import { useDataCollector } from './DataCollector';
import { useMessageHandler } from './MessageHandler';
import { useFileHandler } from './FileHandler';

interface ChatResumeBuilderProps {
  onComplete: (data: ResumeData) => void;
}

const ChatResumeBuilder: React.FC<ChatResumeBuilderProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use the custom hooks
  const {
    currentStep,
    setCurrentStep,
    parsedData,
    setParsedData,
    collectedData,
    setCollectedData,
    fieldsToEdit,
    setFieldsToEdit,
    completeDataCollection
  } = useFlowManager(onComplete);

  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    ignoredFields,
    setIgnoredFields,
    askNextQuestion: askNextQuestionBase,
    getNestedValue,
    setNestedValue
  } = useDataCollector();

  const {
    messages,
    addMessage,
    formatResumeDataSummary
  } = useMessageHandler();

  const askNextQuestion = () => {
    askNextQuestionBase({
      parsedData,
      collectedData,
      fieldsToEdit,
      addMessage,
      onDataComplete: completeDataCollection
    });
  };

  const startDataCollection = () => {
    setCurrentStep('data-collection');
    addMessage({
      type: 'bot',
      content: "Let's start building your profile! I'll ask you some questions to gather your information."
    });
    askNextQuestion();
  };

  const { handleFileUpload: handleFileUploadBase } = useFileHandler({
    addMessage,
    setIsLoading,
    setParsedData,
    setCurrentStep,
    startDataCollection,
    formatResumeDataSummary
  });

  const handleFileUpload = (file: File, field?: string) => {
    return handleFileUploadBase(file, field, {
      setCollectedData,
      setNestedValue,
      askNextQuestion
    });
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
    } else if (option === "No, looks good" || option === "Proceed with this information") {
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
                content: "Proceed with this information"
              });
              handleOptionSelect("Proceed with this information");
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
