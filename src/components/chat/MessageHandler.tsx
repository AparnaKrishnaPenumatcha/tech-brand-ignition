
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

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);
  }, []);

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
