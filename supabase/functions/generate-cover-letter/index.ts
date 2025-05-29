
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
    
    // Build a comprehensive candidate profile from resume data
    const candidateProfile = buildCandidateProfile(resumeData);
    
    // Extract personal info for the header
    const personalInfo = resumeData?.personalInfo || {};
    const name = personalInfo.name || 'Your Name';
    const email = personalInfo.email || 'your.email@example.com';
    const phone = personalInfo.phone || '';
    const location = personalInfo.location || '';
    
    // Build the header with actual personal information
    const headerInfo = buildCoverLetterHeader(personalInfo);
    
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
            content: `You are a professional cover letter writer. Generate personalized, compelling cover letters that highlight relevant experience and skills for the specific job. Use specific details from the candidate's background to create a connection with the job requirements. Write in a professional but engaging tone.

IMPORTANT FORMATTING RULES:
- Start with the candidate's actual contact information (name: ${name}, email: ${email}, phone: ${phone}, location: ${location})
- Do NOT use placeholder text like [Company's Name], [Your Address], [Hiring Manager's Name], etc.
- Use the actual company names from their experience when relevant
- Reference specific projects, skills, and achievements from their background
- Make the letter feel genuine and personalized, not templated`
          },
          {
            role: 'user',
            content: `${headerInfo}

Generate a professional cover letter for this job posting:

${jobDescription}

Based on this candidate's detailed profile:
${candidateProfile}

Please create a compelling cover letter that:
1. Uses the candidate's actual personal information in the header (no placeholders like [Your Address])
2. Addresses the specific job requirements using real examples from their background
3. Mentions specific companies, projects, or achievements when relevant
4. Shows enthusiasm for the role and company
5. Uses a professional greeting (Dear Hiring Manager is fine if company name not specified)
6. Does not include placeholder text - use actual data or omit sections if data is missing

Format the letter professionally with proper spacing and structure.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
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

function buildCoverLetterHeader(personalInfo: any): string {
  let header = '';
  
  if (personalInfo.name) {
    header += `${personalInfo.name}\n`;
  }
  
  if (personalInfo.location) {
    header += `${personalInfo.location}\n`;
  }
  
  if (personalInfo.email) {
    header += `${personalInfo.email}\n`;
  }
  
  if (personalInfo.phone) {
    header += `${personalInfo.phone}\n`;
  }
  
  if (personalInfo.linkedin) {
    header += `LinkedIn: ${personalInfo.linkedin}\n`;
  }
  
  header += `\nDate: ${new Date().toLocaleDateString()}\n\n`;
  
  return header;
}

function buildCandidateProfile(resumeData: any): string {
  if (!resumeData) {
    return "No resume data available";
  }

  let profile = "";
  
  // Personal Information
  if (resumeData.personalInfo) {
    const { name, title, email, phone, location, about, linkedin } = resumeData.personalInfo;
    profile += `PERSONAL INFORMATION:\n`;
    if (name) profile += `Name: ${name}\n`;
    if (title) profile += `Current Title: ${title}\n`;
    if (location) profile += `Location: ${location}\n`;
    if (email) profile += `Email: ${email}\n`;
    if (phone) profile += `Phone: ${phone}\n`;
    if (linkedin) profile += `LinkedIn: ${linkedin}\n`;
    if (about) profile += `About: ${about}\n`;
    profile += `\n`;
  }

  // Professional Summary
  if (resumeData.summary) {
    profile += `PROFESSIONAL SUMMARY:\n${resumeData.summary}\n\n`;
  }

  // Work Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    profile += `WORK EXPERIENCE:\n`;
    resumeData.experience.forEach((exp: any, index: number) => {
      profile += `${index + 1}. ${exp.title || 'Position'}`;
      if (exp.company) profile += ` at ${exp.company}`;
      profile += `\n`;
      if (exp.duration) profile += `   Duration: ${exp.duration}\n`;
      if (exp.description) profile += `   Description: ${exp.description}\n`;
      profile += `\n`;
    });
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    profile += `SKILLS:\n`;
    const skillsByCategory: { [key: string]: string[] } = {};
    
    resumeData.skills.forEach((skill: any) => {
      const category = skill.category || 'General';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill.name);
    });

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      profile += `${category}: ${skills.join(', ')}\n`;
    });
    profile += `\n`;
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    profile += `KEY PROJECTS:\n`;
    resumeData.projects.forEach((project: any, index: number) => {
      profile += `${index + 1}. ${project.title || 'Project'}\n`;
      if (project.description) profile += `   Description: ${project.description}\n`;
      if (project.outcome) profile += `   Outcome: ${project.outcome}\n`;
      if (project.tags && project.tags.length > 0) {
        profile += `   Technologies: ${project.tags.join(', ')}\n`;
      }
      profile += `\n`;
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    profile += `EDUCATION:\n`;
    resumeData.education.forEach((edu: any, index: number) => {
      profile += `${index + 1}. ${edu.degree || 'Degree'} in ${edu.field || 'Field'}\n`;
      if (edu.school) profile += `   Institution: ${edu.school}\n`;
      if (edu.year) profile += `   Year: ${edu.year}\n`;
      if (edu.gpa) profile += `   GPA: ${edu.gpa}\n`;
      profile += `\n`;
    });
  }

  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    profile += `CERTIFICATIONS:\n`;
    resumeData.certifications.forEach((cert: any, index: number) => {
      profile += `${index + 1}. ${cert.name || 'Certification'}`;
      if (cert.issuer) profile += ` - ${cert.issuer}`;
      if (cert.year) profile += ` (${cert.year})`;
      profile += `\n`;
    });
    profile += `\n`;
  }

  // Leadership Experience
  if (resumeData.leadership) {
    profile += `LEADERSHIP EXPERIENCE:\n${resumeData.leadership}\n\n`;
  }

  // Testimonials
  if (resumeData.testimonials && resumeData.testimonials.length > 0) {
    profile += `TESTIMONIALS:\n`;
    resumeData.testimonials.forEach((testimonial: any, index: number) => {
      profile += `${index + 1}. "${testimonial.quote || 'Quote'}"`;
      if (testimonial.name) profile += ` - ${testimonial.name}`;
      if (testimonial.role) profile += `, ${testimonial.role}`;
      profile += `\n`;
    });
  }

  return profile;
}
