
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
    const { resumeData, targetRole } = await req.json()
    
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
            content: 'You are a resume optimization expert. Analyze resumes and provide specific, actionable feedback with a numerical score (1-100) and detailed improvement suggestions.'
          },
          {
            role: 'user',
            content: `Analyze this resume for a ${targetRole || 'professional'} role and provide optimization suggestions:\n\nName: ${resumeData?.personalInfo?.name}\nTitle: ${resumeData?.personalInfo?.title}\nSummary: ${resumeData?.summary || resumeData?.personalInfo?.about}\nExperience: ${JSON.stringify(resumeData?.experience)}\nSkills: ${JSON.stringify(resumeData?.skills)}\nEducation: ${JSON.stringify(resumeData?.education)}\n\nProvide: 1) Overall score (1-100), 2) Top 3 strengths, 3) Top 3 areas for improvement with specific suggestions, 4) Keywords to add`
          }
        ],
        temperature: 0.3,
        max_tokens: 1200
      }),
    })

    const data = await openAIResponse.json()
    const analysis = data.choices[0].message.content

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
