
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
    console.log('=== ChatMessageHandlers: handleSendMessage ===', { message, field });
    
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
    console.log('=== ChatMessageHandlers: handleOptionSelect ===', { option, field });
    
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
      console.log('=== ChatMessageHandlers: Starting manual data collection ===');
      startDataCollection();
    } else if (option === 'Skip this field' && field) {
      dataCollector.setIgnoredFields(prev => new Set([...prev, field]));
      messageHandler.addMessage({
        type: 'bot',
        content: "No problem! Let's move on to the next question."
      });
      dataCollector.setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(askNextQuestion, 500);
    } else if (option === "Build Profile with Current Data" || option === "Continue with Basic Info Only" || option === "Proceed with this information") {
      console.log('=== ChatMessageHandlers: Build profile option selected ===');
      messageHandler.addMessage({
        type: 'bot',
        content: "Perfect! Building your resume and portfolio now with the available information."
      });
      
      // Immediately complete the data collection flow
      console.log('=== ChatMessageHandlers: Calling completeDataCollection ===');
      flowManager.completeDataCollection();
    } else if (option.startsWith("Complete ") || option.startsWith("Add ")) {
      // Handle specific field editing requests from the summary
      let fieldsToEdit: string[] = [];
      
      if (option.includes("Personal Info")) {
        fieldsToEdit = ['personalInfo.name', 'personalInfo.title', 'personalInfo.email', 'personalInfo.phone', 'personalInfo.location'];
      } else if (option.includes("Experience")) {
        fieldsToEdit = ['experience'];
      } else if (option.includes("Skills")) {
        fieldsToEdit = ['skills'];
      } else if (option.includes("Education")) {
        fieldsToEdit = ['education'];
      }
      
      if (fieldsToEdit.length > 0) {
        flowManager.setFieldsToEdit(fieldsToEdit);
        messageHandler.addMessage({
          type: 'bot',
          content: `Let's update your ${option.replace('Complete ', '').replace('Add ', '').toLowerCase()}. I'll ask you a few questions.`
        });
        startDataCollection();
      }
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
