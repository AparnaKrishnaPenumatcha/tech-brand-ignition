
import React from 'react';
import ChatInterface from './ChatInterface';
import ParsedDataSummary from './ParsedDataSummary';
import ChatHeader from './components/ChatHeader';
import { ResumeData } from '@/utils/resumeProcessing';
import { useChatFlow } from './hooks/useChatFlow';
import { useChatMessageHandlers } from './handlers/ChatMessageHandlers';
import { getCurrentInputType, getCurrentField } from './utils/chatUtils';

interface ChatResumeBuilderProps {
  onComplete: (data: ResumeData) => void;
}

const ChatResumeBuilder: React.FC<ChatResumeBuilderProps> = ({ onComplete }) => {
  const {
    isLoading,
    flowManager,
    dataCollector,
    messageHandler,
    fileHandler,
    askNextQuestion,
    startDataCollection
  } = useChatFlow(onComplete);

  const {
    handleFileUpload,
    handleSendMessage,
    handleOptionSelect
  } = useChatMessageHandlers({
    flowManager,
    dataCollector,
    messageHandler,
    fileHandler,
    askNextQuestion,
    startDataCollection
  });

  return (
    <div className="max-w-4xl mx-auto">
      <ChatHeader />

      {flowManager.currentStep === 'upload-summary' && flowManager.parsedData && (
        <div className="mb-6">
          <ParsedDataSummary 
            data={flowManager.parsedData}
            onEditRequest={(fields) => {
              flowManager.setFieldsToEdit(fields);
              startDataCollection();
            }}
            onAcceptAll={() => {
              messageHandler.addMessage({
                type: 'user',
                content: "Proceed with this information"
              });
              handleOptionSelect("Proceed with this information");
            }}
          />
        </div>
      )}

      <ChatInterface
        messages={messageHandler.messages}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onOptionSelect={handleOptionSelect}
        isLoading={isLoading}
        currentField={getCurrentField(messageHandler.messages)}
        currentInputType={getCurrentInputType(messageHandler.messages)}
      />
    </div>
  );
};

export default ChatResumeBuilder;
