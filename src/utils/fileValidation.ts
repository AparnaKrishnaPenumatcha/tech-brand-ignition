
import { toast } from '@/hooks/use-toast';

/**
 * Validates a file to ensure it's a PDF or DOCX
 * @param file File to validate
 * @returns True if validation passes, false otherwise
 */
export function validateResumeFile(file: File | null): boolean {
  if (!file) {
    toast({
      title: "No file selected",
      description: "Please select a resume file to upload",
      variant: "destructive",
    });
    return false;
  }

  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (!validTypes.includes(file.type)) {
    toast({
      title: "Invalid file format",
      description: "Please upload a PDF or DOCX resume",
      variant: "destructive",
    });
    return false;
  }

  return true;
}
