
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAITools = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCoverLetter = async (jobDescription: string, resumeData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: { jobDescription, resumeData }
      });
      
      if (error) throw error;
      return data.coverLetter;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const optimizeResume = async (resumeData: any, targetRole?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('optimize-resume', {
        body: { 
          resumeData, 
          targetRole,
          fileData: resumeData?.fileData // Pass the original file data if available
        }
      });
      
      if (error) throw error;
      return data.analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const conductMockInterview = async (
    message: string, 
    conversationHistory: any[], 
    role: string, 
    interviewType: 'technical' | 'behavioral'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: { message, conversationHistory, role, interviewType }
      });
      
      if (error) throw error;
      return data.response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCareerCoaching = async (resumeData: any, targetRole: string, careerGoals: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('career-coaching', {
        body: { resumeData, targetRole, careerGoals }
      });
      
      if (error) throw error;
      return data.coaching;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateCoverLetter,
    optimizeResume,
    conductMockInterview,
    getCareerCoaching,
    loading,
    error,
    isSupabaseConfigured: true
  };
};
