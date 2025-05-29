
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { parseTextContent } from './fileProcessor.ts';
import { createEnhancedPrompt, callOpenAI, extractJSONFromResponse } from './openaiProcessor.ts';
import { validateAndStructureResumeData } from './dataValidator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { textContent, fileName } = await req.json()
    
    if (!textContent) {
      throw new Error('No text content provided')
    }

    console.log('=== Parse Resume: Starting enhanced extraction ===')
    console.log('File name:', fileName)
    
    // Process the text content based on file type
    const processedText = parseTextContent(textContent, fileName || 'unknown.txt');
    
    if (!processedText || processedText.length < 20) {
      console.log('=== Parse Resume: Insufficient text extracted ===');
      throw new Error('Could not extract meaningful text from the file');
    }
    
    console.log('=== Parse Resume: Text extraction successful ===');
    console.log('Processed text preview:', processedText.substring(0, 300));
    
    // Create enhanced prompt and call OpenAI
    const enhancedPrompt = createEnhancedPrompt(processedText);
    const data = await callOpenAI(enhancedPrompt);
    
    console.log('=== Parse Resume: OpenAI response received ===');
    
    let extractedContent = data.choices[0].message.content
    console.log('Raw OpenAI response length:', extractedContent.length)

    // Robust JSON extraction
    let parsedData
    try {
      parsedData = extractJSONFromResponse(extractedContent);
      console.log('=== Parse Resume: Successfully parsed JSON ===');
      console.log('Extracted fields:', Object.keys(parsedData));
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', e)
      console.error('Raw content:', extractedContent.substring(0, 500))
      throw new Error('Failed to parse resume data from OpenAI response')
    }

    // Validate and structure the final data
    const resumeData = validateAndStructureResumeData(parsedData, fileName);

    return new Response(
      JSON.stringify({ resumeData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('=== Parse Resume: Error occurred ===', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
