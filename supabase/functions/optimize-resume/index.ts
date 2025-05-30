
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, targetRole } = await req.json();
    
    console.log('Resume optimization request:', { 
      hasResumeData: !!resumeData, 
      targetRole,
      resumeDataKeys: resumeData ? Object.keys(resumeData) : []
    });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not set');
      throw new Error('OpenAI API key not configured');
    }

    // Safely extract resume content with null checks
    const personalInfo = resumeData?.personalInfo || {};
    const experience = resumeData?.experience || [];
    const skills = resumeData?.skills || [];
    const education = resumeData?.education || [];
    
    // Build resume text safely
    let resumeText = '';
    
    if (personalInfo.name) {
      resumeText += `Name: ${personalInfo.name}\n`;
    }
    if (personalInfo.title) {
      resumeText += `Title: ${personalInfo.title}\n`;
    }
    if (resumeData?.summary) {
      resumeText += `Summary: ${resumeData.summary}\n`;
    }
    
    if (experience.length > 0) {
      resumeText += '\nExperience:\n';
      experience.forEach((exp, index) => {
        if (exp && typeof exp === 'object') {
          resumeText += `${index + 1}. ${exp.title || 'Unknown Position'} at ${exp.company || 'Unknown Company'}\n`;
          if (exp.description) {
            resumeText += `   ${exp.description}\n`;
          }
        }
      });
    }
    
    if (skills.length > 0) {
      resumeText += '\nSkills:\n';
      skills.forEach((skill, index) => {
        if (skill && (typeof skill === 'string' || skill.name)) {
          const skillName = typeof skill === 'string' ? skill : skill.name;
          resumeText += `- ${skillName}\n`;
        }
      });
    }
    
    if (education.length > 0) {
      resumeText += '\nEducation:\n';
      education.forEach((edu, index) => {
        if (edu && typeof edu === 'object') {
          resumeText += `${index + 1}. ${edu.degree || 'Unknown Degree'} from ${edu.institution || 'Unknown Institution'}\n`;
        }
      });
    }

    console.log('Constructed resume text length:', resumeText.length);

    if (!resumeText.trim()) {
      return new Response(JSON.stringify({
        analysis: {
          overallScore: 0,
          strengths: [],
          improvements: ['No resume data provided for analysis'],
          missingKeywords: [],
          suggestions: ['Please provide resume data to receive optimization suggestions']
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Create the analysis prompt
    const prompt = `Analyze this resume and provide optimization suggestions${targetRole ? ` for a ${targetRole} role` : ''}:

Resume:
${resumeText}

Provide a JSON response with:
{
  "overallScore": number (0-100),
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Focus on actionable improvements and relevant keywords${targetRole ? ` for ${targetRole} positions` : ''}.`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume optimization expert. Provide detailed, actionable feedback in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI');
    }

    let analysis;
    try {
      const content = data.choices[0].message.content;
      console.log('Raw OpenAI content:', content);
      
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Provide fallback analysis
      analysis = {
        overallScore: 75,
        strengths: ['Professional experience listed', 'Skills section included'],
        improvements: ['Add more quantifiable achievements', 'Include relevant keywords'],
        missingKeywords: targetRole ? [`${targetRole} specific terms`] : ['Industry keywords'],
        suggestions: ['Add metrics to work experience', 'Tailor content to job requirements']
      };
    }

    console.log('Resume optimization completed successfully');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Resume optimization error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        analysis: {
          overallScore: 0,
          strengths: [],
          improvements: ['Error occurred during analysis'],
          missingKeywords: [],
          suggestions: ['Please try again or contact support']
        }
      }),
      { 
        status: 200, // Return 200 to avoid throwing errors in frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
