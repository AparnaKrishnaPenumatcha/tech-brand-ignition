
import { toast } from '@/hooks/use-toast';

/**
 * Validates a file to ensure it's a PDF
 * @param file File to validate
 * @returns True if validation passes, false otherwise
 */
export function validatePdfFile(file: File | null): boolean {
  if (!file) {
    toast({
      title: "No file selected",
      description: "Please select a resume file to upload",
      variant: "destructive",
    });
    return false;
  }

  if (file.type !== 'application/pdf') {
    toast({
      title: "Invalid file format",
      description: "Please upload a PDF resume",
      variant: "destructive",
    });
    return false;
  }

  return true;
}
