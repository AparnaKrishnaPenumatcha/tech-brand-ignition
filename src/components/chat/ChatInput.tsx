
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Send, Check, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, field?: string) => void;
  onFileUpload: (file: File, field?: string) => void;
  onOptionSelect: (option: string, field?: string) => void;
  isLoading?: boolean;
  currentField?: string;
  currentInputType?: 'text' | 'textarea' | 'file' | 'select';
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onFileUpload,
  onOptionSelect,
  isLoading = false,
  currentField,
  currentInputType = 'text'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (currentInputType === 'file') {
    return (
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
    );
  }

  return (
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
  );
};

export default ChatInput;
