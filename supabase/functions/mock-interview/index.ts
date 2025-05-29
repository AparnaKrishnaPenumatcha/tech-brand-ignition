
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { message, conversationHistory, role, interviewType } = await req.json()
    
    const systemPrompt = interviewType === 'technical' 
      ? `You are conducting a technical interview for a ${role} position. Ask relevant technical questions, evaluate answers, and provide constructive feedback. Be encouraging but thorough. Use proper markdown formatting with **bold text** for emphasis and line breaks for readability. Structure your questions clearly with proper spacing.`
      : `You are conducting a behavioral interview for a ${role} position. Ask behavioral questions using the STAR method, evaluate responses, and provide helpful feedback. Be supportive and professional. Use proper markdown formatting with **bold text** for emphasis and line breaks for readability. Structure your questions clearly with proper spacing and use **Question X:** format for question headers.`
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.8,
        max_tokens: 800
      }),
    })

    const data = await openAIResponse.json()
    const response = data.choices[0].message.content

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Mock interview error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
