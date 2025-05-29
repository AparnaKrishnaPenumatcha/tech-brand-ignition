
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
    const { resumeData, targetRole, fileData } = await req.json()
    
    let messages = []
    
    if (fileData && fileData.startsWith('data:')) {
      // If we have file data, send it directly to OpenAI with vision
      messages = [
        {
          role: 'system',
          content: 'You are a resume optimization expert. Analyze resumes and provide specific, actionable feedback in JSON format with a numerical score (1-100) and detailed improvement suggestions.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this resume for a ${targetRole || 'professional'} role and provide optimization suggestions in the following JSON structure:
              
              {
                "overallScore": number (1-100),
                "strengths": [
                  "strength 1",
                  "strength 2", 
                  "strength 3"
                ],
                "improvements": [
                  {
                    "area": "area name",
                    "suggestion": "specific suggestion",
                    "impact": "expected impact"
                  }
                ],
                "keywordsToAdd": ["keyword1", "keyword2"],
                "summary": "overall assessment summary"
              }`
            },
            {
              type: 'image_url',
              image_url: {
                url: fileData
              }
            }
          ]
        }
      ]
    } else {
      // Fallback to text-based analysis
      messages = [
        {
          role: 'system',
          content: 'You are a resume optimization expert. Analyze resumes and provide specific, actionable feedback in JSON format with a numerical score (1-100) and detailed improvement suggestions.'
        },
        {
          role: 'user',
          content: `Analyze this resume for a ${targetRole || 'professional'} role and provide optimization suggestions in the following JSON structure:

{
  "overallScore": number (1-100),
  "strengths": [
    "strength 1",
    "strength 2", 
    "strength 3"
  ],
  "improvements": [
    {
      "area": "area name",
      "suggestion": "specific suggestion",
      "impact": "expected impact"
    }
  ],
  "keywordsToAdd": ["keyword1", "keyword2"],
  "summary": "overall assessment summary"
}

Resume Data:
Name: ${resumeData?.personalInfo?.name}
Title: ${resumeData?.personalInfo?.title}
Summary: ${resumeData?.summary || resumeData?.personalInfo?.about}
Experience: ${JSON.stringify(resumeData?.experience)}
Skills: ${JSON.stringify(resumeData?.skills)}
Education: ${JSON.stringify(resumeData?.education)}`
        }
      ]
    }
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: fileData ? 'gpt-4o' : 'gpt-4o-mini',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1500
      }),
    })

    const data = await openAIResponse.json()
    let analysis = data.choices[0].message.content

    // Try to parse as JSON, fallback to formatted text if it fails
    let structuredAnalysis
    try {
      structuredAnalysis = JSON.parse(analysis)
    } catch (e) {
      // If JSON parsing fails, create a structured format from the text
      structuredAnalysis = {
        overallScore: 75,
        strengths: ["Experience provided", "Skills listed", "Education included"],
        improvements: [
          {
            area: "General",
            suggestion: analysis,
            impact: "Overall improvement in resume quality"
          }
        ],
        keywordsToAdd: [],
        summary: "Resume analysis completed"
      }
    }

    return new Response(
      JSON.stringify({ analysis: structuredAnalysis }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Resume optimization error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
