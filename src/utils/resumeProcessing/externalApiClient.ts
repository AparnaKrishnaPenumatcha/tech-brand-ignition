
import { toast } from '@/hooks/use-toast';

/**
 * Attempts to parse a resume using the external API
 * @param formData FormData containing the resume file
 * @returns Parsed resume data or null if parsing failed
 */
export async function parseResumeWithApi(formData: FormData): Promise<any | null> {
  try {
    console.log('=== Sending request to external API ===');
    const res = await fetch('https://apenumat-100xminicapstoneapi.hf.space/parse-resume', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (res.ok) {
      const jsonData = await res.json();
      console.log('=== RAW API RESPONSE ===');
      console.log(JSON.stringify(jsonData, null, 2));
      console.log('=== END RAW API RESPONSE ===');
      return jsonData;
    } else {
      throw new Error(`Server responded with status: ${res.status}`);
    }
  } catch (error) {
    console.error("External API unavailable:", error);
    toast({
      title: "Parser unavailable",
      description: "Resume parser service is not responding. Using fallback data instead.",
    });
    return null;
  }
}
