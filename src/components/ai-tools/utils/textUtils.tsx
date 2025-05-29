
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
  // Early return for null/undefined
  if (!improvements) {
    console.log('⚠️ No improvements data provided');
    return [];
  }

  console.log('🔍 parseImprovements input:', improvements);
  console.log('🔍 Input type:', typeof improvements);
  
  // If improvements is already a properly formatted array, return it immediately
  if (Array.isArray(improvements)) {
    const validImprovements = improvements.filter(item => 
      item && typeof item === 'object' && item.area && item.suggestion
    );
    console.log('✅ Valid array found:', validImprovements);
    return validImprovements;
  }
  
  // If it's a string, try to extract JSON from it
  if (typeof improvements === 'string') {
    console.log('📝 Processing string input');
    
    try {
      // Look for JSON content within the string - check for the improvements array specifically
      const improvementsMatch = improvements.match(/"improvements"\s*:\s*\[[\s\S]*?\]/);
      if (improvementsMatch) {
        // Extract just the improvements array value
        const improvementsArrayStr = improvementsMatch[0].replace(/"improvements"\s*:\s*/, '');
        const parsed = JSON.parse(improvementsArrayStr);
        console.log('✅ Successfully extracted improvements array:', parsed);
        return parsed.filter(item => 
          item && typeof item === 'object' && item.area && item.suggestion
        );
      }

      // Fallback: try to parse the entire string as JSON
      const parsed = JSON.parse(improvements);
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
  
  // If it's an object, try to extract improvements
  if (typeof improvements === 'object' && improvements !== null) {
    console.log('🔍 Processing object format');
    
    // Check for improvements property
    if (improvements.improvements && Array.isArray(improvements.improvements)) {
      console.log('✅ Found improvements property:', improvements.improvements);
      return improvements.improvements.filter(item => 
        item && typeof item === 'object' && item.area && item.suggestion
      );
    }
  }
  
  // Fallback: return empty array
  console.log('⚠️ No valid improvements found, returning empty array');
  return [];
};
