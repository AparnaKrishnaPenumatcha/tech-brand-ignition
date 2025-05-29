
import { useState, useCallback } from 'react';
import { ChatMessage } from './types';
import { ResumeData } from '@/utils/resumeProcessing';

export const useMessageHandler = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm here to help you create your professional resume and portfolio. How would you like to get started?",
      timestamp: new Date(),
      options: ['Upload Resume', 'Enter Data Manually']
    }
  ]);

  // Counter to ensure unique IDs
  const [messageCounter, setMessageCounter] = useState(2);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: `msg-${messageCounter}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    console.log('=== MessageHandler: Adding message with ID ===', newMessage.id);
    
    setMessages(prev => {
      // Check for duplicate IDs to prevent React warnings
      const isDuplicate = prev.some(m => m.id === newMessage.id);
      if (isDuplicate) {
        console.warn('=== MessageHandler: Duplicate message ID detected, regenerating ===');
        newMessage.id = `msg-${messageCounter}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-retry`;
      }
      return [...prev, newMessage];
    });
    
    setMessageCounter(prev => prev + 1);
  }, [messageCounter]);

  const formatResumeDataSummary = (data: ResumeData): string => {
    let summary = "Here's what I extracted from your resume:\n\n";
    
    // Personal Information
    if (data.personalInfo) {
      summary += "**Personal Information:**\n";
      if (data.personalInfo.name) summary += `• Name: ${data.personalInfo.name}\n`;
      if (data.personalInfo.title) summary += `• Title: ${data.personalInfo.title}\n`;
      if (data.personalInfo.email) summary += `• Email: ${data.personalInfo.email}\n`;
      if (data.personalInfo.phone) summary += `• Phone: ${data.personalInfo.phone}\n`;
      if (data.personalInfo.location) summary += `• Location: ${data.personalInfo.location}\n`;
      summary += "\n";
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      summary += "**Work Experience:**\n";
      data.experience.slice(0, 3).forEach((exp, index) => {
        summary += `${index + 1}. ${exp.title} at ${exp.company} (${exp.duration})\n`;
      });
      if (data.experience.length > 3) {
        summary += `... and ${data.experience.length - 3} more positions\n`;
      }
      summary += "\n";
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      summary += "**Skills:**\n";
      const skillNames = data.skills.slice(0, 10).map(skill => skill.name).join(", ");
      summary += `${skillNames}`;
      if (data.skills.length > 10) {
        summary += ` ... and ${data.skills.length - 10} more skills`;
      }
      summary += "\n\n";
    }

    // Education
    if (data.education && data.education.length > 0) {
      summary += "**Education:**\n";
      data.education.forEach((edu, index) => {
        summary += `${index + 1}. ${edu.degree} from ${edu.institution} (${edu.year})\n`;
      });
      summary += "\n";
    }

    summary += "Would you like to proceed with this information or make any changes?";
    
    return summary;
  };

  return {
    messages,
    addMessage,
    formatResumeDataSummary
  };
};
