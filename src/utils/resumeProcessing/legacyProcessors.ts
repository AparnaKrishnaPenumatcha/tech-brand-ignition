
// Legacy functions for backward compatibility
interface RawSkill { name: string; }
interface Skill { name: string; level: number; category: string; }

export const processSkills = (skills: RawSkill[]): Skill[] => {
  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Other'];
  return skills.map((skillObj, index) => {
    const { name: skill } = skillObj;
    const level = Math.floor(Math.random() * 26) + 70;
    let category = categories[index % categories.length];
    
    if (/html|css|javascript|jquery|react|vue|angular|typescript|ajax/i.test(skill)) {
      category = 'Frontend';
    } else if (/java|spring|boot|node|python|php|servlets|j2ee/i.test(skill)) {
      category = 'Backend';
    } else if (/oracle|sql|mongodb|mysql|postgresql|hana|database|hibernate/i.test(skill)) {
      category = 'Database';
    } else if (/git|jenkins|maven|eclipse|junit|mockito|docker|kubernetes/i.test(skill)) {
      category = 'Tools';
    }
    
    return { name: skill, level, category };
  });
};

export const processExperience = (experienceArray: any[]) => {
  return experienceArray.map(exp => ({
    title: exp.role || "Professional",
    company: exp.company || "Company",
    duration: exp.duration || "Present",
    description: exp.responsibilities ? exp.responsibilities.join(" ") : "Professional experience"
  }));
};

export const processProjects = (projectsArray: any[]) => {
  if (!projectsArray || projectsArray.length === 0) {
    return [
      {
        title: "Professional Project",
        description: "Developed and implemented solutions using modern technologies.",
        tags: ["Development", "Implementation"]
      }
    ];
  }
  return projectsArray;
};
