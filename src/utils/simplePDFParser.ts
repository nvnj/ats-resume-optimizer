// Simple PDF text extraction without PDF.js dependency issues
import { ResumeData } from '../types/resume';

export const parseResumeFromText = (text: string): ResumeData => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  return {
    contact: extractContactFromText(text),
    summary: extractSummaryFromText(text),
    experience: extractExperienceFromText(text),
    education: extractEducationFromText(text),
    skills: extractSkillsFromText(text),
    sections: ['contact', 'summary', 'experience', 'education', 'skills']
  };
};

const extractContactFromText = (text: string) => {
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi;
  const githubRegex = /github\.com\/[\w-]+/gi;
  
  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  // Extract name from first few lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let fullName = '';
  
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (!emailRegex.test(line) && !phoneRegex.test(line) && 
        line.split(' ').length >= 2 && line.split(' ').length <= 4 &&
        /^[A-Za-z\s]+$/.test(line) && line.length > 5) {
      fullName = line;
      break;
    }
  }

  return {
    fullName,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    location: extractLocationFromText(text),
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : '',
    github: githubMatch ? `https://${githubMatch[0]}` : '',
    website: ''
  };
};

const extractLocationFromText = (text: string): string => {
  const locationRegex = /(?:^|\n)([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)/gm;
  const match = text.match(locationRegex);
  return match ? match[0].trim() : '';
};

const extractSummaryFromText = (text: string): string => {
  const summaryKeywords = ['summary', 'profile', 'objective', 'overview', 'about'];
  const lines = text.split('\n').map(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (summaryKeywords.some(keyword => line.includes(keyword))) {
      let summary = '';
      let j = i + 1;
      while (j < lines.length && j < i + 8) {
        const nextLine = lines[j];
        if (nextLine.length < 20) break;
        if (/^(experience|education|skills|work)/i.test(nextLine)) break;
        summary += nextLine + ' ';
        j++;
      }
      if (summary.trim().length > 50) {
        return summary.trim();
      }
    }
  }
  
  return '';
};

const extractExperienceFromText = (text: string) => {
  const experiences = [];
  const lines = text.split('\n').map(line => line.trim());
  
  let inExperienceSection = false;
  let currentExp = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (/^(experience|employment|work\s*history)/i.test(line)) {
      inExperienceSection = true;
      continue;
    }
    
    if (inExperienceSection && /^(education|skills)/i.test(line)) {
      break;
    }
    
    if (inExperienceSection) {
      const datePattern = /\d{4}|present|current/i;
      if (datePattern.test(line) && line.length > 10) {
        if (currentExp) {
          experiences.push(currentExp);
        }
        
        currentExp = {
          id: `exp-${experiences.length + 1}`,
          company: extractCompanyFromLine(line),
          position: extractPositionFromLine(line),
          location: '',
          startDate: extractStartDateFromLine(line),
          endDate: extractEndDateFromLine(line),
          current: /present|current/i.test(line),
          description: []
        };
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
        currentExp.description.push(line.replace(/^[•\-*]\s*/, ''));
      }
    }
  }
  
  if (currentExp) {
    experiences.push(currentExp);
  }
  
  return experiences;
};

const extractEducationFromText = (text: string) => {
  const education = [];
  const lines = text.split('\n').map(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/bachelor|master|phd|degree|university|college/i.test(line)) {
      education.push({
        id: `edu-${education.length + 1}`,
        institution: extractInstitutionFromLine(line),
        degree: extractDegreeFromLine(line),
        field: '',
        location: '',
        startDate: '',
        endDate: extractEducationYearFromLine(line),
        gpa: extractGPAFromLine(line)
      });
    }
  }
  
  return education;
};

const extractSkillsFromText = (text: string) => {
  const skills = [];
  const lines = text.split('\n').map(line => line.trim());
  
  let inSkillsSection = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (/^skills|technologies|competencies/i.test(line)) {
      inSkillsSection = true;
      continue;
    }
    
    if (inSkillsSection) {
      if (line.includes(',') || line.includes('•')) {
        const skillNames = line.split(/[,•]/).map(s => s.trim()).filter(s => s.length > 0);
        skillNames.forEach(skillName => {
          if (skillName.length < 30 && skillName.length > 1) {
            skills.push({
              id: `skill-${skills.length + 1}`,
              name: skillName,
              level: 'Intermediate' as const,
              category: 'Technical' as const
            });
          }
        });
      }
      
      if (skills.length > 0 && (line.length < 5 || /^(experience|education)/i.test(line))) {
        break;
      }
    }
  }
  
  return skills;
};

// Helper functions
const extractCompanyFromLine = (line: string): string => {
  return line.split(/\d{4}/)[0].trim() || 'Company Name';
};

const extractPositionFromLine = (line: string): string => {
  return 'Position Title';
};

const extractStartDateFromLine = (line: string): string => {
  const match = line.match(/(\d{4})/);
  return match ? match[1] : '';
};

const extractEndDateFromLine = (line: string): string => {
  if (/present|current/i.test(line)) return 'Present';
  const matches = line.match(/\d{4}/g);
  return matches && matches.length > 1 ? matches[1] : '';
};

const extractInstitutionFromLine = (line: string): string => {
  return line.split(/\d{4}/)[0].trim() || 'Institution';
};

const extractDegreeFromLine = (line: string): string => {
  if (/bachelor/i.test(line)) return "Bachelor's Degree";
  if (/master/i.test(line)) return "Master's Degree";
  if (/phd|doctorate/i.test(line)) return 'Doctorate';
  return 'Degree';
};

const extractEducationYearFromLine = (line: string): string => {
  const match = line.match(/\d{4}/);
  return match ? match[0] : '';
};

const extractGPAFromLine = (line: string): string => {
  const match = line.match(/GPA:?\s*(\d\.\d+)/i);
  return match ? match[1] : '';
};