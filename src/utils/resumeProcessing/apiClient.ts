
import { supabase } from '@/integrations/supabase/client';
import type { ResumeData } from '../types/resumeTypes';

export const callResumeParsingAPI = async (fileContent: string, fileName: string): Promise<ResumeData> => {
  console.log('=== callResumeParsingAPI: Calling enhanced parse-resume function ===');
  const { data, error } = await supabase.functions.invoke('parse-resume', {
    body: { 
      textContent: fileContent,
      fileName: fileName
    }
  });
  
  if (error) {
    console.error('=== callResumeParsingAPI: Supabase function error ===', error);
    throw new Error(`Resume parsing failed: ${error.message}`);
  }
  
  if (!data || !data.resumeData) {
    console.error('=== callResumeParsingAPI: No data returned ===', data);
    throw new Error('No resume data returned from parsing service');
  }
  
  console.log('=== callResumeParsingAPI: Enhanced parsing successful ===');
  console.log('Extracted data summary:', {
    name: data.resumeData.personalInfo?.name || 'Not found',
    experienceCount: data.resumeData.experience?.length || 0,
    skillsCount: data.resumeData.skills?.length || 0,
    educationCount: data.resumeData.education?.length || 0,
    hasContent: !!(data.resumeData.personalInfo?.name || 
                   data.resumeData.experience?.length > 0 || 
                   data.resumeData.skills?.length > 0)
  });
  
  return data.resumeData;
};
