
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import { ChatMessage as ChatMessageType } from './types';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string, field?: string) => void;
  onFileUpload: (file: File, field?: string) => void;
  onOptionSelect: (option: string, field?: string) => void;
  isLoading?: boolean;
  currentField?: string;
  currentInputType?: 'text' | 'textarea' | 'file' | 'select';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onFileUpload,
  onOptionSelect,
  isLoading = false,
  currentField,
  currentInputType = 'text'
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border shadow-sm">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onOptionSelect={onOptionSelect}
          />
        ))}
        
        {isLoading && <LoadingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <ChatInput
          onSendMessage={onSendMessage}
          onFileUpload={onFileUpload}
          onOptionSelect={onOptionSelect}
          isLoading={isLoading}
          currentField={currentField}
          currentInputType={currentInputType}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
