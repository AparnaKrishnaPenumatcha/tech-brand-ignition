
import { ResumeData } from '@/utils/resumeProcessing';

interface ChatMessageHandlersProps {
  flowManager: any;
  dataCollector: any;
  messageHandler: any;
  fileHandler: any;
  askNextQuestion: () => void;
  startDataCollection: () => void;
}

export const useChatMessageHandlers = ({
  flowManager,
  dataCollector,
  messageHandler,
  fileHandler,
  askNextQuestion,
  startDataCollection
}: ChatMessageHandlersProps) => {
  
  const handleFileUpload = (file: File, field?: string) => {
    return fileHandler.handleFileUpload(file, field, {
      setCollectedData: flowManager.setCollectedData,
      setNestedValue: dataCollector.setNestedValue,
      askNextQuestion
    });
  };

  const handleSendMessage = (message: string, field?: string) => {
    messageHandler.addMessage({
      type: 'user',
      content: message
    });

    if (field) {
      console.log(`=== ChatMessageHandlers: Updating field ${field} with value:`, message);
      
      flowManager.setCollectedData((prev: any) => {
        const updated = dataCollector.setNestedValue(prev, field, message);
        console.log('Updated collected data:', updated);
        return updated;
      });
      
      messageHandler.addMessage({
        type: 'bot',
        content: "Got it! Moving on to the next question."
      });
      
      dataCollector.setCurrentQuestionIndex((prev: number) => prev + 1);
      setTimeout(askNextQuestion, 500);
    }
  };

  const handleOptionSelect = (option: string, field?: string) => {
    messageHandler.addMessage({
      type: 'user',
      content: option
    });

    if (option === 'Upload Resume') {
      messageHandler.addMessage({
        type: 'bot',
        content: "Great! Please upload your resume file (PDF or DOCX format).",
        inputType: 'file'
      });
    } else if (option === 'Enter Data Manually') {
      messageHandler.addMessage({
        type: 'bot',
        content: "Perfect! I'll guide you through entering your information step by step."
      });
      startDataCollection();
    } else if (option === 'Skip this field' && field) {
      dataCollector.setIgnoredFields(prev => new Set([...prev, field]));
      messageHandler.addMessage({
        type: 'bot',
        content: "No problem! Let's move on to the next question."
      });
      dataCollector.setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(askNextQuestion, 500);
    } else if (option === "No, looks good" || option === "Proceed with this information") {
      messageHandler.addMessage({
        type: 'bot',
        content: "Perfect! Your information looks complete. Let me build your resume and portfolio now."
      });
      flowManager.completeDataCollection();
    } else if (option.startsWith("Edit ")) {
      const fieldToEdit = option.replace("Edit ", "").toLowerCase();
      flowManager.setFieldsToEdit([fieldToEdit]);
      messageHandler.addMessage({
        type: 'bot',
        content: `Let's update your ${fieldToEdit}. What would you like to change?`
      });
      startDataCollection();
    }
  };

  return {
    handleFileUpload,
    handleSendMessage,
    handleOptionSelect
  };
};
