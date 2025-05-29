
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
    const { jobDescription, resumeData } = await req.json()
    
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
            content: 'You are a professional cover letter writer. Generate personalized, compelling cover letters that highlight relevant experience and skills for the specific job.'
          },
          {
            role: 'user',
            content: `Generate a cover letter for this job:\n\n${jobDescription}\n\nBased on this candidate profile:\nName: ${resumeData?.personalInfo?.name || 'Candidate'}\nTitle: ${resumeData?.personalInfo?.title || 'Professional'}\nExperience: ${resumeData?.experience?.map(exp => `${exp.title} at ${exp.company}`).join(', ') || 'Various roles'}\nSkills: ${resumeData?.skills?.map(skill => skill.name).join(', ') || 'Multiple skills'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    })

    const data = await openAIResponse.json()
    const coverLetter = data.choices[0].message.content

    return new Response(
      JSON.stringify({ coverLetter }),
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
