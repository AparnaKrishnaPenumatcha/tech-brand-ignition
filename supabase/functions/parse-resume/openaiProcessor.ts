
export const createEnhancedPrompt = (processedText: string): string => {
  return `Extract and structure ALL information from this resume text into the exact JSON format below. Be thorough and accurate.

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
};

export const callOpenAI = async (prompt: string) => {
  console.log('=== Parse Resume: Sending enhanced request to OpenAI ===');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 3000
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  return await response.json();
};

export const extractJSONFromResponse = (content: string): any => {
  // Remove any markdown formatting
  let extractedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
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
  return JSON.parse(jsonStr);
};
