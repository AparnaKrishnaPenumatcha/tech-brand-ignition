
import { ChatMessage } from '../types';

export const getCurrentInputType = (messages: ChatMessage[]): 'text' | 'textarea' | 'file' | 'select' => {
  const lastBotMessage = [...messages].reverse().find(m => m.type === 'bot');
  return lastBotMessage?.inputType || 'text';
};

export const getCurrentField = (messages: ChatMessage[]): string | undefined => {
  const lastBotMessage = [...messages].reverse().find(m => m.type === 'bot');
  return lastBotMessage?.field;
};
