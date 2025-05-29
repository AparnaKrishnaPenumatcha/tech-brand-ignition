
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect: (option: string, field?: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionSelect }) => {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <Card className={`max-w-[80%] p-3 ${
        message.type === 'user'
          ? 'bg-electric-500 text-white ml-12'
          : message.type === 'system'
          ? 'bg-navy-100 text-navy-800'
          : 'bg-gray-100 text-navy-900 mr-12'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {/* Options for bot messages */}
        {message.type === 'bot' && message.options && (
          <div className="mt-3 space-y-2">
            {message.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start"
                onClick={() => onOptionSelect(option, message.field)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;
