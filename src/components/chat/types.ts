
export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  field?: string;
  options?: string[];
  inputType?: 'text' | 'textarea' | 'file' | 'select';
}
