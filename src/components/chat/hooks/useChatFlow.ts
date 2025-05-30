
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
    dataCollector.askNextQuestion({
      parsedData: flowManager.parsedData,
      collectedData: flowManager.collectedData,
      fieldsToEdit: flowManager.fieldsToEdit,
      addMessage: messageHandler.addMessage,
      onDataComplete: flowManager.completeDataCollection
    });
  };

  const startDataCollection = () => {
    flowManager.setCurrentStep('data-collection');
    messageHandler.addMessage({
      type: 'bot',
      content: "Let's start building your profile! I'll ask you some questions to gather your information."
    });
    askNextQuestion();
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
