
export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  field?: string;
  options?: string[];
  inputType?: 'text' | 'textarea' | 'file' | 'select';
}

export interface FieldQuestion {
  field: string;
  question: string;
  inputType: 'text' | 'textarea' | 'file';
  required: boolean;
  category: string;
}
