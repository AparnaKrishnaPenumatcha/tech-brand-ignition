
// Utility functions for extracting text from different file formats

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // For PDF files, we'll use a simple approach to extract text
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string and try to extract readable text
    // This is a basic approach - in production you'd use a library like pdf-parse
    let text = '';
    for (let i = 0; i < uint8Array.length; i++) {
      const char = String.fromCharCode(uint8Array[i]);
      if (char.match(/[a-zA-Z0-9\s@.-]/)) {
        text += char;
      }
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    // For DOCX files, we'll read the file as text
    // This is a simplified approach - in production you'd use a library like mammoth
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    return await extractTextFromPDF(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file type');
  }
};
