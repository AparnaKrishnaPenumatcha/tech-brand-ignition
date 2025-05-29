
import { extractTextFromPDF, extractTextFromDOCX } from './textExtraction.ts';

export const parseTextContent = (textContent: string, fileName: string): string => {
  console.log('=== parseTextContent: Processing text ===');
  console.log('Raw text length:', textContent.length);
  console.log('File name:', fileName);
  
  // Determine file type and extract accordingly
  const fileExt = fileName.toLowerCase().split('.').pop();
  
  if (fileExt === 'pdf') {
    // Convert base64 to Uint8Array if needed
    let uint8Array: Uint8Array;
    
    if (textContent.startsWith('data:')) {
      // Remove data URL prefix
      const base64Data = textContent.split(',')[1];
      const binaryString = atob(base64Data);
      uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
    } else {
      // Assume it's already text content
      const encoder = new TextEncoder();
      uint8Array = encoder.encode(textContent);
    }
    
    const extractedText = extractTextFromPDF(uint8Array);
    console.log('=== PDF extraction result ===');
    console.log('Extracted text length:', extractedText.length);
    console.log('Sample text:', extractedText.substring(0, 200));
    return extractedText;
  } else if (fileExt === 'docx' || fileExt === 'doc') {
    // Similar processing for DOCX
    let uint8Array: Uint8Array;
    
    if (textContent.startsWith('data:')) {
      const base64Data = textContent.split(',')[1];
      const binaryString = atob(base64Data);
      uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
    } else {
      const encoder = new TextEncoder();
      uint8Array = encoder.encode(textContent);
    }
    
    const extractedText = extractTextFromDOCX(uint8Array);
    console.log('=== DOCX extraction result ===');
    console.log('Extracted text length:', extractedText.length);
    console.log('Sample text:', extractedText.substring(0, 200));
    return extractedText;
  }
  
  // Default: assume it's already text
  return textContent;
};
