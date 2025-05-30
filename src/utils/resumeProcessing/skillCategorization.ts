
/**
 * Automatically categorizes a skill based on its name
 */
export function categorizeSkill(skillName: string): string {
  const skill = skillName.toLowerCase();
  
  // Frontend technologies
  if (skill.includes('react') || skill.includes('vue') || skill.includes('angular') || 
      skill.includes('javascript') || skill.includes('typescript') || skill.includes('html') || 
      skill.includes('css') || skill.includes('sass') || skill.includes('less') || 
      skill.includes('bootstrap') || skill.includes('tailwind') || skill.includes('jquery') ||
      skill.includes('next') || skill.includes('nuxt') || skill.includes('svelte') ||
      skill.includes('web') || skill.includes('frontend') || skill.includes('ui') ||
      skill.includes('ux') || skill.includes('figma') || skill.includes('design')) {
    return 'Frontend';
  }
  
  // Backend technologies
  if (skill.includes('node') || skill.includes('express') || skill.includes('django') || 
      skill.includes('flask') || skill.includes('spring') || skill.includes('laravel') || 
      skill.includes('ruby') || skill.includes('rails') || skill.includes('php') || 
      skill.includes('java') || skill.includes('python') || skill.includes('c#') || 
      skill.includes('c++') || skill.includes('go') || skill.includes('rust') ||
      skill.includes('backend') || skill.includes('server') || skill.includes('api') ||
      skill.includes('rest') || skill.includes('graphql') || skill.includes('microservices')) {
    return 'Backend';
  }
  
  // Database technologies
  if (skill.includes('sql') || skill.includes('mysql') || skill.includes('postgresql') || 
      skill.includes('mongodb') || skill.includes('redis') || skill.includes('elasticsearch') || 
      skill.includes('oracle') || skill.includes('sqlite') || skill.includes('cassandra') ||
      skill.includes('database') || skill.includes('db') || skill.includes('nosql')) {
    return 'Database';
  }
  
  // Cloud and DevOps
  if (skill.includes('aws') || skill.includes('azure') || skill.includes('gcp') || 
      skill.includes('docker') || skill.includes('kubernetes') || skill.includes('jenkins') || 
      skill.includes('git') || skill.includes('github') || skill.includes('gitlab') ||
      skill.includes('devops') || skill.includes('ci/cd') || skill.includes('terraform') ||
      skill.includes('ansible') || skill.includes('cloud')) {
    return 'Tools';
  }
  
  // Default to Tools for anything else
  return 'Tools';
}
