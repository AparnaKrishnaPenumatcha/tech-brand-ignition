
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
  console.log('🔍 parseImprovements called with:', improvements);
  
  // Early return for null/undefined
  if (!improvements) {
    console.log('⚠️ No improvements data provided');
    return [];
  }

  // If improvements is already a properly formatted array, return it immediately
  if (Array.isArray(improvements)) {
    const validImprovements = improvements.filter(item => 
      item && typeof item === 'object' && item.area && item.suggestion
    );
    console.log('✅ Valid array found:', validImprovements);
    return validImprovements;
  }
  
  // If it's an object with improvements property
  if (typeof improvements === 'object' && improvements !== null && improvements.improvements) {
    if (Array.isArray(improvements.improvements)) {
      console.log('✅ Found improvements in object:', improvements.improvements);
      return improvements.improvements.filter(item => 
        item && typeof item === 'object' && item.area && item.suggestion
      );
    }
  }
  
  // If it's a string, try to parse as JSON
  if (typeof improvements === 'string') {
    console.log('📝 Processing string input');
    
    try {
      const parsed = JSON.parse(improvements);
      
      // Check if parsed result has improvements property
      if (parsed.improvements && Array.isArray(parsed.improvements)) {
        console.log('✅ Found improvements in parsed object:', parsed.improvements);
        return parsed.improvements.filter(item => 
          item && typeof item === 'object' && item.area && item.suggestion
        );
      }
      
      // If it's an array at the root level
      if (Array.isArray(parsed)) {
        return parsed.filter(item => 
          item && typeof item === 'object' && item.area && item.suggestion
        );
      }
    } catch (e) {
      console.error('❌ Failed to parse improvements JSON:', e);
      
      // Create a single improvement from the string content
      return [{
        area: "General Improvement",
        suggestion: improvements,
        impact: "Enhanced resume quality"
      }];
    }
  }
  
  // Fallback: return empty array
  console.log('⚠️ No valid improvements found, returning empty array');
  return [];
};
