
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client only if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not found. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const useAITools = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSupabaseConnection = () => {
    if (!supabase) {
      throw new Error('Supabase is not properly configured. Please check your environment variables.');
    }
  };

  const generateCoverLetter = async (jobDescription: string, resumeData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      checkSupabaseConnection();
      
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
      checkSupabaseConnection();
      
      const { data, error } = await supabase.functions.invoke('optimize-resume', {
        body: { resumeData, targetRole }
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
      checkSupabaseConnection();
      
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
      checkSupabaseConnection();
      
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
    isSupabaseConfigured: !!supabase
  };
};
