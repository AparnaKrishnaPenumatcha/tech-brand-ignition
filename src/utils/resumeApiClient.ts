
// Re-export the main functionality from the refactored modules
export { processResumeFile } from './resumeProcessing/fileProcessor';
export { parseResumeWithApi } from './resumeProcessing/externalApiClient';
export { mapApiDataToResumeData, getFallbackResumeData } from './resumeProcessing/dataMapping';
