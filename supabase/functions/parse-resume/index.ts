
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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

    console.log('=== Parse Resume: Starting OpenAI extraction ===')
    console.log('File name:', fileName)
    console.log('Text content preview:', textContent.substring(0, 200) + '...')
    
    const messages = [
      {
        role: 'system',
        content: `You are an expert resume parser. Extract structured information from resume text and return it in a specific JSON format. Be thorough and accurate in extracting all relevant information.`
      },
      {
        role: 'user',
        content: `Please extract all information from this resume text and return it in the following exact JSON structure:

{
  "personalInfo": {
    "name": "Full Name",
    "title": "Professional Title",
    "email": "email@example.com",
    "phone": "Phone Number",
    "location": "City, State/Country",
    "about": "Professional summary or objective",
    "linkedin": "LinkedIn URL if present"
  },
  "summary": "Professional summary or objective (if different from about)",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name", 
      "duration": "Start Date - End Date",
      "description": "Key responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School/University Name",
      "year": "Graduation Year"
    }
  ],
  "skills": [
    {
      "name": "Skill Name",
      "level": 80,
      "category": "Frontend/Backend/Database/Tools/Other"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
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

Extract ALL information you can find. For skills, assign appropriate categories (Frontend, Backend, Database, Tools, Other) and levels (70-95). If any section is missing, return an empty array for arrays or empty string for strings. Return ONLY the JSON, no additional text.

Resume Text:
${textContent}`
      }
    ]
    
    console.log('=== Parse Resume: Sending request to OpenAI ===')
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.1,
        max_tokens: 2000
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
    console.log('Raw OpenAI response:', extractedContent)

    // Try to parse the JSON response
    let parsedData
    try {
      // Remove any markdown formatting if present
      extractedContent = extractedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsedData = JSON.parse(extractedContent)
      console.log('=== Parse Resume: Successfully parsed JSON ===', parsedData)
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', e)
      console.error('Raw content:', extractedContent)
      throw new Error('Failed to parse resume data from OpenAI response')
    }

    // Add metadata
    const resumeData = {
      ...parsedData,
      fileName: fileName || 'uploaded_resume',
      uploadDate: new Date().toISOString()
    }

    console.log('=== Parse Resume: Final structured data ===', resumeData)

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
