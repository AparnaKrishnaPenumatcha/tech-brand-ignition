
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload, Send, Check, X } from 'lucide-react';

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  field?: string;
  options?: string[];
  inputType?: 'text' | 'textarea' | 'file' | 'select';
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
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
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (currentInputType === 'file' && selectedFile) {
      onFileUpload(selectedFile, currentField);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (inputValue.trim()) {
      onSendMessage(inputValue.trim(), currentField);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border shadow-sm">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
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
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-gray-100 p-3 mr-12">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        {currentInputType === 'file' ? (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">{selectedFile.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-electric-500 hover:bg-electric-600"
                onClick={handleSend}
                disabled={!selectedFile || isLoading}
              >
                Upload
              </Button>
              <Button
                variant="outline"
                onClick={() => onOptionSelect('skip', currentField)}
                disabled={isLoading}
              >
                Skip
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            {currentInputType === 'textarea' ? (
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={isLoading}
              />
            ) : (
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className="flex-1"
                disabled={isLoading}
              />
            )}
            
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-electric-500 hover:bg-electric-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
