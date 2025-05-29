
import React from 'react';

export const renderMarkdownText = (text: string) => {
  if (!text) return text;
  
  // Replace **text** with bold formatting
  const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace line breaks
  const withLineBreaks = boldFormatted.replace(/\n/g, '<br />');
  
  return <span dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
};

export const parseImprovements = (improvements: any) => {
  // If improvements is already an array, return it
  if (Array.isArray(improvements)) {
    return improvements;
  }
  
  // If it's a string that looks like JSON, try to parse it
  if (typeof improvements === 'string') {
    try {
      const parsed = JSON.parse(improvements);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse improvements JSON:', e);
      // If it's just a plain string, wrap it in an object
      return [{
        area: "General Improvement",
        suggestion: improvements,
        impact: "Enhanced resume quality"
      }];
    }
  }
  
  // If it's an object but not an array, try to extract meaningful data
  if (typeof improvements === 'object' && improvements !== null) {
    return Object.entries(improvements).map(([key, value]) => ({
      area: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      suggestion: typeof value === 'string' ? value : JSON.stringify(value),
      impact: "Improved resume effectiveness"
    }));
  }
  
  // Fallback: return empty array
  return [];
};
