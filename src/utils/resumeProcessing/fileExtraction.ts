
// Enhanced PDF text extraction
export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        console.log('=== Enhanced PDF Processing ===');
        console.log('File size:', uint8Array.length, 'bytes');
        
        // Convert to base64 for sending to edge function
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64String = btoa(binary);
        const dataUrl = `data:application/pdf;base64,${base64String}`;
        
        console.log('=== PDF converted to base64 ===');
        console.log('Base64 length:', base64String.length);
        
        resolve(dataUrl);
      } catch (error) {
        console.error('=== PDF Processing Error ===', error);
        reject(new Error('Failed to process PDF file'));
      }
    };
    
    reader.onerror = () => {
      console.error('=== FileReader Error ===');
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Enhanced DOCX text extraction
export const extractTextFromDOCX = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        console.log('=== Enhanced DOCX Processing ===');
        console.log('File size:', uint8Array.length, 'bytes');
        
        // Convert to base64 for sending to edge function
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const base64String = btoa(binary);
        const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64String}`;
        
        console.log('=== DOCX converted to base64 ===');
        console.log('Base64 length:', base64String.length);
        
        resolve(dataUrl);
      } catch (error) {
        console.error('=== DOCX Processing Error ===', error);
        reject(new Error('Failed to process DOCX file'));
      }
    };
    
    reader.onerror = () => {
      console.error('=== FileReader Error ===');
      reject(new Error('Failed to read DOCX file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
