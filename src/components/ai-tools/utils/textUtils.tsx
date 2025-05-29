
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
  console.log('🔍 Input type:', typeof improvements);
  
  // If improvements is already a properly formatted array, return it
  if (Array.isArray(improvements)) {
    const validImprovements = improvements.filter(item => 
      item && typeof item === 'object' && item.area && item.suggestion
    );
    console.log('✅ Valid array found:', validImprovements);
    return validImprovements;
  }
  
  // If it's a string that contains JSON, try to extract and parse it
  if (typeof improvements === 'string') {
    console.log('📝 Processing string input:', improvements.substring(0, 200) + '...');
    
    try {
      // First, try to parse the entire string as JSON
      let parsed;
      try {
        parsed = JSON.parse(improvements);
        console.log('✅ Successfully parsed entire string as JSON:', parsed);
      } catch (e) {
        // If that fails, look for JSON content within the string
        console.log('⚠️ Direct parse failed, looking for JSON within string');
        
        // Look for JSON array pattern
        const arrayMatch = improvements.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          console.log('🎯 Found array pattern:', arrayMatch[0].substring(0, 100) + '...');
          parsed = JSON.parse(arrayMatch[0]);
        } else {
          // Look for JSON object pattern
          const objectMatch = improvements.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            console.log('🎯 Found object pattern:', objectMatch[0].substring(0, 100) + '...');
            parsed = JSON.parse(objectMatch[0]);
          } else {
            throw new Error('No JSON pattern found');
          }
        }
      }
      
      // Handle the parsed result
      if (Array.isArray(parsed)) {
        console.log('✅ Parsed result is array:', parsed);
        return parsed.filter(item => 
          item && typeof item === 'object' && item.area && item.suggestion
        );
      }
      
      // If parsed result is an object, check for improvements property
      if (parsed && typeof parsed === 'object') {
        if (parsed.improvements && Array.isArray(parsed.improvements)) {
          console.log('✅ Found improvements property in object:', parsed.improvements);
          return parsed.improvements.filter(item => 
            item && typeof item === 'object' && item.area && item.suggestion
          );
        }
        
        // If it's an object but not an array, try to convert it to improvement format
        console.log('🔄 Converting object to improvements format');
        const converted = Object.entries(parsed)
          .filter(([key, value]) => key !== 'overallScore' && key !== 'summary' && key !== 'strengths' && key !== 'keywordsToAdd')
          .map(([key, value]) => ({
            area: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            suggestion: typeof value === 'string' ? value : JSON.stringify(value),
            impact: "Improved resume effectiveness"
          }));
        
        if (converted.length > 0) {
          console.log('✅ Successfully converted object:', converted);
          return converted;
        }
      }
    } catch (e) {
      console.error('❌ Failed to parse improvements JSON:', e);
      console.log('📝 Using fallback for string content');
      
      // If all parsing fails, create a single improvement from the string
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
      return improvements.improvements.filter(item => 
        item && typeof item === 'object' && item.area && item.suggestion
      );
    }
    
    // Convert object entries to improvement format, excluding known metadata fields
    const excludedKeys = ['overallScore', 'summary', 'strengths', 'keywordsToAdd'];
    const converted = Object.entries(improvements)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => ({
        area: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        suggestion: typeof value === 'string' ? value : JSON.stringify(value),
        impact: "Improved resume effectiveness"
      }));
    
    if (converted.length > 0) {
      console.log('🔄 Converted object to improvements:', converted);
      return converted;
    }
  }
  
  // Fallback: return empty array
  console.log('⚠️ No valid improvements found, returning empty array');
  return [];
};
