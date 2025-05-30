
import { useState } from 'react';
import { ResumeData } from '@/utils/resumeProcessing';
import { useFlowManager } from '../FlowManager';
import { useDataCollector } from '../DataCollector';
import { useMessageHandler } from '../MessageHandler';
import { useFileHandler } from '../FileHandler';

export const useChatFlow = (onComplete: (data: ResumeData) => void) => {
  const [isLoading, setIsLoading] = useState(false);

  // Use the existing hooks
  const flowManager = useFlowManager(onComplete);
  const dataCollector = useDataCollector();
  const messageHandler = useMessageHandler();

  const askNextQuestion = () => {
    console.log('=== useChatFlow: askNextQuestion called ===');
    console.log('Current step:', flowManager.currentStep);
    
    dataCollector.askNextQuestion({
      parsedData: flowManager.parsedData,
      collectedData: flowManager.collectedData,
      fieldsToEdit: flowManager.fieldsToEdit,
      addMessage: messageHandler.addMessage,
      onDataComplete: flowManager.completeDataCollection
    });
  };

  const startDataCollection = () => {
    console.log('=== useChatFlow: Starting data collection ===');
    
    // Start the data collection flow
    flowManager.startDataCollectionFlow();
    
    // Add initial message
    messageHandler.addMessage({
      type: 'bot',
      content: "Let's start building your profile! I'll ask you some questions to gather your information."
    });
    
    // Reset question index and start asking questions
    dataCollector.setCurrentQuestionIndex(0);
    
    // Ask the first question after a short delay to ensure the flow state is updated
    setTimeout(() => {
      console.log('=== useChatFlow: Triggering first question ===');
      askNextQuestion();
    }, 100);
  };

  const fileHandler = useFileHandler({
    addMessage: messageHandler.addMessage,
    setIsLoading,
    setParsedData: flowManager.setParsedData,
    setCurrentStep: flowManager.setCurrentStep,
    startDataCollection,
    formatResumeDataSummary: messageHandler.formatResumeDataSummary
  });

  return {
    isLoading,
    setIsLoading,
    flowManager,
    dataCollector,
    messageHandler,
    fileHandler,
    askNextQuestion,
    startDataCollection
  };
};
