
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
  console.log('🔍 parseImprovements input:', improvements);
  
  // If improvements is already a properly formatted array, return it
  if (Array.isArray(improvements)) {
    const validImprovements = improvements.filter(item => 
      item && typeof item === 'object' && item.area && item.suggestion
    );
    console.log('✅ Valid array found:', validImprovements);
    return validImprovements;
  }
  
  // If it's a string that looks like it contains JSON, try to extract it
  if (typeof improvements === 'string') {
    try {
      // Look for JSON content within the string
      const jsonMatch = improvements.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const extractedJson = jsonMatch[0];
        console.log('🔍 Extracted JSON string:', extractedJson);
        
        const parsed = JSON.parse(extractedJson);
        console.log('📋 Parsed JSON object:', parsed);
        
        // If the parsed object has an improvements array, use that
        if (parsed.improvements && Array.isArray(parsed.improvements)) {
          console.log('✅ Found improvements array in nested JSON:', parsed.improvements);
          return parsed.improvements;
        }
        
        // If it's an array at the root level, use it
        if (Array.isArray(parsed)) {
          console.log('✅ Found direct array in JSON:', parsed);
          return parsed;
        }
      }
      
      // Try parsing the whole string as JSON
      const directParse = JSON.parse(improvements);
      if (Array.isArray(directParse)) {
        console.log('✅ Direct parse as array successful:', directParse);
        return directParse;
      }
    } catch (e) {
      console.error('❌ Failed to parse improvements JSON:', e);
      console.log('📝 Using raw string as fallback');
      
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
    console.log('🔍 Processing object format:', improvements);
    
    // Check if it has an improvements property
    if (improvements.improvements && Array.isArray(improvements.improvements)) {
      console.log('✅ Found improvements property:', improvements.improvements);
      return improvements.improvements;
    }
    
    // Convert object entries to improvement format
    const converted = Object.entries(improvements).map(([key, value]) => ({
      area: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      suggestion: typeof value === 'string' ? value : JSON.stringify(value),
      impact: "Improved resume effectiveness"
    }));
    
    console.log('🔄 Converted object to improvements:', converted);
    return converted;
  }
  
  // Fallback: return empty array
  console.log('⚠️ No valid improvements found, returning empty array');
  return [];
};
