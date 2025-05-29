
// Main resume processing module
export type { ResumeData } from './types/resumeTypes';
export { processSkills, processExperience, processProjects } from './resumeProcessing/legacyProcessors';

import { extractTextFromPDF, extractTextFromDOCX } from './resumeProcessing/fileExtraction';
import { callResumeParsingAPI } from './resumeProcessing/apiClient';
import { createFallbackResumeData, addFileDataToResumeData } from './resumeProcessing/fallbackData';
import type { ResumeData } from './types/resumeTypes';

// Main function to process resume files using enhanced OpenAI parsing
export const processResumeFile = async (file: File): Promise<ResumeData> => {
  console.log('=== processResumeFile: Starting enhanced processing ===');
  console.log('File details:', { name: file.name, type: file.type, size: file.size });
  
  try {
    // Step 1: Convert file to base64 based on type
    console.log('=== processResumeFile: Converting file to base64 ===');
    let fileContent: string;
    
    if (file.type === 'application/pdf') {
      fileContent = await extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileContent = await extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
    
    console.log('=== processResumeFile: File conversion successful ===');
    
    // Step 2: Send to enhanced edge function for processing
    const resumeData = await callResumeParsingAPI(fileContent, file.name);
    
    // Step 3: Add original file data for download functionality
    return await addFileDataToResumeData(resumeData, file);
    
  } catch (error) {
    console.error('=== processResumeFile: Error in enhanced processing ===', error);
    
    // Return a basic structure with file metadata on failure
    return await createFallbackResumeData(file);
  }
};
