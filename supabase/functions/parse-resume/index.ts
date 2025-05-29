
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Improved PDF text extraction function
const extractTextFromPDF = (uint8Array: Uint8Array): string => {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let text = '';
  
  // Convert to string and look for text patterns
  const pdfString = decoder.decode(uint8Array);
  
  // Look for text between BT and ET markers (text objects in PDF)
  const textObjectRegex = /BT\s*(.*?)\s*ET/gs;
  const matches = pdfString.match(textObjectRegex);
  
  if (matches) {
    for (const match of matches) {
      // Extract text from within parentheses and brackets
      const textRegex = /\((.*?)\)|<(.*?)>/g;
      let textMatch;
      while ((textMatch = textRegex.exec(match)) !== null) {
        const extractedText = textMatch[1] || textMatch[2];
        if (extractedText) {
          text += extractedText + ' ';
        }
      }
    }
  }
  
  // Fallback: extract readable characters
  if (text.length < 50) {
    const readableChars = pdfString.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const words = readableChars.split(/\s+/).filter(word => 
      word.length > 1 && /[a-zA-Z]/.test(word)
    );
    text = words.join(' ');
  }
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s@.\-()]/g, ' ')
    .trim();
    
  return text;
};

const extractTextFromDOCX = (uint8Array: Uint8Array): string => {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const docxString = decoder.decode(uint8Array);
  
  // Extract text from XML content in DOCX
  const textRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
  let text = '';
  let match;
  
  while ((match = textRegex.exec(docxString)) !== null) {
    text += match[1] + ' ';
  }
  
  // Fallback to simple text extraction
  if (text.length < 50) {
    const cleanText = docxString
      .replace(/<[^>]*>/g, ' ')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    text = cleanText;
  }
  
  return text;
};

const parseTextContent = (textContent: string, fileName: string): string => {
  console.log('=== parseTextContent: Processing text ===');
  console.log('Raw text length:', textContent.length);
  console.log('File name:', fileName);
  
  // Determine file type and extract accordingly
  const fileExt = fileName.toLowerCase().split('.').pop();
  
  if (fileExt === 'pdf') {
    // Convert base64 to Uint8Array if needed
    let uint8Array: Uint8Array;
    
    if (textContent.startsWith('data:')) {
      // Remove data URL prefix
      const base64Data = textContent.split(',')[1];
      const binaryString = atob(base64Data);
      uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
    } else {
      // Assume it's already text content
      const encoder = new TextEncoder();
      uint8Array = encoder.encode(textContent);
    }
    
    const extractedText = extractTextFromPDF(uint8Array);
    console.log('=== PDF extraction result ===');
    console.log('Extracted text length:', extractedText.length);
    console.log('Sample text:', extractedText.substring(0, 200));
    return extractedText;
  } else if (fileExt === 'docx' || fileExt === 'doc') {
    // Similar processing for DOCX
    let uint8Array: Uint8Array;
    
    if (textContent.startsWith('data:')) {
      const base64Data = textContent.split(',')[1];
      const binaryString = atob(base64Data);
      uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
    } else {
      const encoder = new TextEncoder();
      uint8Array = encoder.encode(textContent);
    }
    
    const extractedText = extractTextFromDOCX(uint8Array);
    console.log('=== DOCX extraction result ===');
    console.log('Extracted text length:', extractedText.length);
    console.log('Sample text:', extractedText.substring(0, 200));
    return extractedText;
  }
  
  // Default: assume it's already text
  return textContent;
};

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
    
    // Enhanced OpenAI prompt with better structure
    const enhancedPrompt = `Extract and structure ALL information from this resume text into the exact JSON format below. Be thorough and accurate.

IMPORTANT: Return ONLY the JSON object, no additional text or formatting.

Required JSON structure:
{
  "personalInfo": {
    "name": "Full Name",
    "title": "Professional Title or Job Title",
    "email": "email@example.com",
    "phone": "Phone Number",
    "location": "City, State/Country",
    "about": "Professional summary or objective",
    "linkedin": "LinkedIn URL if present"
  },
  "summary": "Professional summary or objective",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date (or Present)",
      "description": "Key responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree Name and Field",
      "institution": "School/University Name",
      "year": "Graduation Year or Date Range"
    }
  ],
  "skills": [
    {
      "name": "Skill Name",
      "level": 85,
      "category": "Frontend"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description and technologies used",
      "tags": ["technology1", "technology2"]
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "year": "Year Obtained"
    }
  ]
}

Instructions:
- Extract ALL information you can find
- For skills, assign appropriate levels (70-95) and categories (Frontend/Backend/Database/Tools/Other)
- If any section is missing, return empty arrays [] for arrays or empty strings "" for strings
- Be thorough in extracting work experience, education, and technical skills
- Include all certifications, projects, and achievements mentioned

Resume Text:
${processedText}`;

    console.log('=== Parse Resume: Sending enhanced request to OpenAI ===')
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume parser. Extract structured information from resume text and return it in the exact JSON format requested. Be thorough and accurate.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 3000
      }),
    })

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${openAIResponse.status}`)
    }

    const data = await openAIResponse.json()
    console.log('=== Parse Resume: OpenAI response received ===')
    
    let extractedContent = data.choices[0].message.content
    console.log('Raw OpenAI response length:', extractedContent.length)

    // Robust JSON extraction (similar to your Python approach)
    let parsedData
    try {
      // Remove any markdown formatting
      extractedContent = extractedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      // Find JSON object boundaries
      const startIndex = extractedContent.indexOf('{');
      if (startIndex === -1) {
        throw new Error('No JSON object found in response');
      }
      
      let braceCount = 0;
      let endIndex = -1;
      
      for (let i = startIndex; i < extractedContent.length; i++) {
        if (extractedContent[i] === '{') {
          braceCount++;
        } else if (extractedContent[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      if (endIndex === -1) {
        throw new Error('Malformed JSON - braces not balanced');
      }
      
      const jsonStr = extractedContent.substring(startIndex, endIndex);
      parsedData = JSON.parse(jsonStr);
      
      console.log('=== Parse Resume: Successfully parsed JSON ===');
      console.log('Extracted fields:', Object.keys(parsedData));
      
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', e)
      console.error('Raw content:', extractedContent.substring(0, 500))
      throw new Error('Failed to parse resume data from OpenAI response')
    }

    // Validate and ensure required structure
    const resumeData = {
      personalInfo: parsedData.personalInfo || {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        about: '',
        linkedin: ''
      },
      summary: parsedData.summary || '',
      experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
      education: Array.isArray(parsedData.education) ? parsedData.education : [],
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
      certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
      fileName: fileName || 'uploaded_resume',
      uploadDate: new Date().toISOString()
    }

    console.log('=== Parse Resume: Final structured data ===');
    console.log('Personal info:', resumeData.personalInfo.name ? 'Found' : 'Missing');
    console.log('Experience count:', resumeData.experience.length);
    console.log('Skills count:', resumeData.skills.length);
    console.log('Education count:', resumeData.education.length);

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
