
import React from 'react';

export const renderMarkdownText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split text by bold markers and render accordingly
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** markers and render as bold
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-semibold">{boldText}</strong>;
    }
    
    // Handle line breaks
    const lines = part.split('\n');
    return lines.map((line, lineIndex) => (
      <React.Fragment key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  });
};
