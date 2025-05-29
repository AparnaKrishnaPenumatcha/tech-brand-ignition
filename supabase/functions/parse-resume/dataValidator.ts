
export const validateAndStructureResumeData = (parsedData: any, fileName: string) => {
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
  };

  console.log('=== Parse Resume: Final structured data ===');
  console.log('Personal info:', resumeData.personalInfo.name ? 'Found' : 'Missing');
  console.log('Experience count:', resumeData.experience.length);
  console.log('Skills count:', resumeData.skills.length);
  console.log('Education count:', resumeData.education.length);

  return resumeData;
};
