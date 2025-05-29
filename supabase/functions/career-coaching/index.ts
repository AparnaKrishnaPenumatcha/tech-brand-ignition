
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
    const { resumeData, targetRole, careerGoals } = await req.json()
    
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
            content: 'You are a career coach and skill gap analyst. Provide personalized career roadmaps, identify skill gaps, and suggest specific learning paths and resources.'
          },
          {
            role: 'user',
            content: `Analyze this professional profile and provide career coaching:\n\nCurrent Role: ${resumeData?.personalInfo?.title}\nExperience: ${JSON.stringify(resumeData?.experience)}\nSkills: ${resumeData?.skills?.map(s => s.name).join(', ')}\nEducation: ${JSON.stringify(resumeData?.education)}\nTarget Role: ${targetRole}\nCareer Goals: ${careerGoals}\n\nProvide: 1) Skill gap analysis, 2) Learning roadmap with specific resources, 3) Timeline recommendations, 4) Next steps to advance career`
          }
        ],
        temperature: 0.4,
        max_tokens: 1500
      }),
    })

    const data = await openAIResponse.json()
    const coaching = data.choices[0].message.content

    return new Response(
      JSON.stringify({ coaching }),
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
