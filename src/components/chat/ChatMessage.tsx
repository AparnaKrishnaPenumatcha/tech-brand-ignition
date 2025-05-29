
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User, Upload } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './types';
import { renderMarkdownText } from '../ai-tools/utils/markdownUtils';

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect: (option: string, field?: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionSelect }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-electric-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isBot 
          ? 'bg-gray-50 text-gray-800' 
          : 'bg-electric-500 text-white ml-auto'
      }`}>
        <div className="text-sm leading-relaxed">
          {renderMarkdownText(message.content)}
        </div>
        
        {message.options && (
          <div className="mt-3 space-y-2">
            {message.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => onOptionSelect(option, message.field)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
        
        {message.inputType === 'file' && (
          <div className="mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload your resume</p>
          </div>
        )}
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
