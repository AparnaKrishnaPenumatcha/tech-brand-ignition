
import { ResumeData } from '../resumeProcessing';
import { parseResumeWithApi } from './externalApiClient';
import { mapApiDataToResumeData, getFallbackResumeData } from './dataMapping';

/**
 * Adds file metadata to resume data
 */
export function addFileMetadata(resumeData: ResumeData, file: File): Promise<ResumeData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const completeResumeData = {
        ...resumeData,
        fileName: file.name,
        fileData: reader.result,
        uploadDate: new Date().toISOString(),
      };
      resolve(completeResumeData);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Processes a file into resume data (either from API or fallback)
 * @param file The PDF file to process
 * @returns A promise resolving to the processed resume data
 */
export async function processResumeFile(file: File): Promise<ResumeData> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Try to get structured data from the external API
  const jsonData = await parseResumeWithApi(formData);
  
  // Prepare resume data (either from API or fallback)
  let resumeData: ResumeData;
  
  if (jsonData) {
    // Process the JSON data from API to match the required schema
    resumeData = mapApiDataToResumeData(jsonData);
  } else {
    // Use fallback data
    resumeData = getFallbackResumeData();
  }
  
  // Add file metadata to the resume data
  return addFileMetadata(resumeData, file);
}
