
// Text extraction utilities for different file types

export const extractTextFromPDF = (uint8Array: Uint8Array): string => {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let text = '';
  
  // Convert to string and look for text patterns
  const pdfString = decoder.decode(uint8Array);
  
  // Look for text between BT and ET markers (text objects in PDF)
  const textObjectRegex = /BT\s*(.*?)\s*ET/gs;
  const matches = pdfString.match(textObjectRegex);
  
  if (matches) {
    for (const match of matches) {
      // Extract text from within parentheses and brackets
      const textRegex = /\((.*?)\)|<(.*?)>/g;
      let textMatch;
      while ((textMatch = textRegex.exec(match)) !== null) {
        const extractedText = textMatch[1] || textMatch[2];
        if (extractedText) {
          text += extractedText + ' ';
        }
      }
    }
  }
  
  // Fallback: extract readable characters
  if (text.length < 50) {
    const readableChars = pdfString.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const words = readableChars.split(/\s+/).filter(word => 
      word.length > 1 && /[a-zA-Z]/.test(word)
    );
    text = words.join(' ');
  }
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s@.\-()]/g, ' ')
    .trim();
    
  return text;
};

export const extractTextFromDOCX = (uint8Array: Uint8Array): string => {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const docxString = decoder.decode(uint8Array);
  
  // Extract text from XML content in DOCX
  const textRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
  let text = '';
  let match;
  
  while ((match = textRegex.exec(docxString)) !== null) {
    text += match[1] + ' ';
  }
  
  // Fallback to simple text extraction
  if (text.length < 50) {
    const cleanText = docxString
      .replace(/<[^>]*>/g, ' ')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    text = cleanText;
  }
  
  return text;
};
