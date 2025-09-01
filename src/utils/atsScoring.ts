import { ResumeData, JobDescription, ATSScore, OptimizationSuggestion } from '../types/resume';

// ATS Rules and Constants
export const ATS_RULES = {
  fonts: ['Arial', 'Calibri', 'Times New Roman', 'Helvetica'],
  formats: ['pdf', 'docx'],
  maxKeywordDensity: 0.03, // 3%
  minKeywordDensity: 0.005, // 0.5%
  requiredSections: ['experience', 'education', 'skills'],
  optimalSummaryLength: { min: 50, max: 150 },
  optimalBulletPoints: { min: 2, max: 6 },
  maxLineLength: 80,
  minExperience: 2, // minimum 2 experiences for good score
  minEducation: 1
};

export const calculateATSScore = (resume: ResumeData, jobDescription?: JobDescription): ATSScore => {
  let totalScore = 0;
  let maxScore = 0;
  const details = {
    matchedKeywords: [] as string[],
    missingKeywords: [] as string[],
    suggestions: [] as string[],
    warnings: [] as string[]
  };

  // 1. Keyword Match Score (40% of total)
  const keywordScore = calculateKeywordScore(resume, jobDescription, details);
  totalScore += keywordScore.score;
  maxScore += keywordScore.maxScore;

  // 2. Formatting Score (30% of total)
  const formatScore = calculateFormatScore(resume, details);
  totalScore += formatScore.score;
  maxScore += formatScore.maxScore;

  // 3. Structure Score (30% of total)
  const structureScore = calculateStructureScore(resume, details);
  totalScore += structureScore.score;
  maxScore += structureScore.maxScore;

  const overall = Math.round((totalScore / maxScore) * 100);

  return {
    overall: Math.max(0, Math.min(100, overall)),
    keywordMatch: Math.round((keywordScore.score / keywordScore.maxScore) * 100),
    formatting: Math.round((formatScore.score / formatScore.maxScore) * 100),
    structure: Math.round((structureScore.score / structureScore.maxScore) * 100),
    details
  };
};

const calculateKeywordScore = (
  resume: ResumeData, 
  jobDescription: JobDescription | undefined,
  details: ATSScore['details']
): { score: number; maxScore: number } => {
  const maxScore = 40;
  
  if (!jobDescription) {
    details.suggestions.push('Add a job description to get keyword matching analysis');
    return { score: maxScore * 0.5, maxScore }; // Give partial credit when no JD
  }

  const resumeText = getResumeText(resume).toLowerCase();
  const jobKeywords = extractKeywords(jobDescription.description).map(k => k.toLowerCase());
  
  if (jobKeywords.length === 0) {
    details.warnings.push('No keywords could be extracted from job description');
    return { score: maxScore * 0.5, maxScore };
  }

  let matchedCount = 0;
  const density = calculateKeywordDensity(resumeText, jobKeywords);
  
  jobKeywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      details.matchedKeywords.push(keyword);
      matchedCount++;
    } else {
      details.missingKeywords.push(keyword);
    }
  });

  // Calculate score based on matched keywords and density
  const matchPercentage = matchedCount / jobKeywords.length;
  let score = matchPercentage * maxScore;

  // Adjust for keyword density
  if (density > ATS_RULES.maxKeywordDensity) {
    details.warnings.push('Keyword density too high - may appear as keyword stuffing');
    score *= 0.8; // Penalty for stuffing
  } else if (density < ATS_RULES.minKeywordDensity) {
    details.suggestions.push('Include more relevant keywords from the job description');
    score *= 0.9;
  }

  return { score, maxScore };
};

const calculateFormatScore = (
  resume: ResumeData,
  details: ATSScore['details']
): { score: number; maxScore: number } => {
  const maxScore = 30;
  let score = maxScore;

  // Check contact information
  const contact = resume.contact;
  if (!contact.fullName) {
    score -= 5;
    details.suggestions.push('Add your full name');
  }
  if (!contact.email) {
    score -= 5;
    details.suggestions.push('Add your email address');
  }
  if (!contact.phone) {
    score -= 3;
    details.suggestions.push('Add your phone number');
  }
  if (!contact.location) {
    score -= 2;
    details.suggestions.push('Add your location (city, state)');
  }

  // Check for proper email format
  if (contact.email && !isValidEmail(contact.email)) {
    score -= 3;
    details.warnings.push('Email format appears invalid');
  }

  // Check for professional email
  if (contact.email && !isProfessionalEmail(contact.email)) {
    score -= 2;
    details.suggestions.push('Consider using a professional email address');
  }

  // Check summary length
  const summaryWordCount = resume.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (summaryWordCount < ATS_RULES.optimalSummaryLength.min) {
    score -= 3;
    details.suggestions.push('Professional summary is too short - aim for 50-150 words');
  } else if (summaryWordCount > ATS_RULES.optimalSummaryLength.max) {
    score -= 2;
    details.suggestions.push('Professional summary is too long - keep it under 150 words');
  }

  return { score: Math.max(0, score), maxScore };
};

const calculateStructureScore = (
  resume: ResumeData,
  details: ATSScore['details']
): { score: number; maxScore: number } => {
  const maxScore = 30;
  let score = maxScore;

  // Check required sections
  ATS_RULES.requiredSections.forEach(section => {
    if (!resume.sections.includes(section as any)) {
      score -= 5;
      details.suggestions.push(`Add ${section} section to your resume`);
    }
  });

  // Check experience quality
  if (resume.experience.length < ATS_RULES.minExperience) {
    score -= 5;
    details.suggestions.push('Add more work experience entries for better ATS scoring');
  }

  resume.experience.forEach((exp, index) => {
    if (!exp.company || !exp.position) {
      score -= 2;
      details.suggestions.push(`Complete company and position for experience #${index + 1}`);
    }
    
    const bulletCount = exp.description.filter(d => d.trim()).length;
    if (bulletCount < ATS_RULES.optimalBulletPoints.min) {
      score -= 1;
      details.suggestions.push(`Add more bullet points to experience #${index + 1}`);
    }
    
    // Check for quantified achievements
    const hasNumbers = exp.description.some(desc => /\d+/.test(desc));
    if (!hasNumbers) {
      details.suggestions.push(`Add quantified achievements to experience #${index + 1}`);
    }
  });

  // Check education
  if (resume.education.length < ATS_RULES.minEducation) {
    score -= 3;
    details.suggestions.push('Add your education information');
  }

  // Check skills
  if (resume.skills.length === 0) {
    score -= 5;
    details.suggestions.push('Add relevant skills to your resume');
  } else if (resume.skills.length < 5) {
    score -= 2;
    details.suggestions.push('Add more relevant skills (aim for 10-20)');
  }

  return { score: Math.max(0, score), maxScore };
};

export const extractKeywords = (jobDescription: string): string[] => {
  // Remove common words and extract meaningful keywords
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'job', 'position', 'role', 'candidate', 'applicant', 'employee', 'work', 'working',
    'company', 'organization', 'team', 'department', 'office', 'business'
  ]);

  const words = jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !commonWords.has(word) &&
      !/^\d+$/.test(word)
    );

  // Count frequency and return top keywords
  const wordCount = words.reduce((count, word) => {
    count[word] = (count[word] || 0) + 1;
    return count;
  }, {} as Record<string, number>);

  // Extract multi-word phrases
  const phrases = extractPhrases(jobDescription);
  
  // Combine single words and phrases
  const allKeywords = [
    ...Object.entries(wordCount)
      .filter(([word, count]) => count >= 2 || word.length > 6)
      .map(([word]) => word),
    ...phrases
  ];

  // Prioritize technical terms and skills
  return allKeywords
    .sort((a, b) => {
      const aScore = getKeywordScore(a, jobDescription);
      const bScore = getKeywordScore(b, jobDescription);
      return bScore - aScore;
    })
    .slice(0, 20); // Return top 20 keywords
};

const extractPhrases = (text: string): string[] => {
  const phrases: string[] = [];
  const sentences = text.toLowerCase().split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    // Look for skill patterns
    const skillPatterns = [
      /(\w+\s+(programming|development|engineering|design|management|analysis))/g,
      /(experience\s+with\s+[\w\s]+)/g,
      /(proficiency\s+in\s+[\w\s]+)/g,
      /(knowledge\s+of\s+[\w\s]+)/g
    ];
    
    skillPatterns.forEach(pattern => {
      const matches = sentence.match(pattern);
      if (matches) {
        phrases.push(...matches.map(match => match.trim()));
      }
    });
  });
  
  return phrases.slice(0, 10);
};

const getKeywordScore = (keyword: string, jobDescription: string): number => {
  const lowerText = jobDescription.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  let score = 0;
  
  // Higher score for technical terms
  if (/^(javascript|python|java|react|angular|vue|node|sql|aws|azure|docker|kubernetes|git)$/i.test(keyword)) {
    score += 10;
  }
  
  // Higher score for action words
  if (/^(develop|manage|lead|create|implement|design|analyze|optimize)$/i.test(keyword)) {
    score += 5;
  }
  
  // Score based on frequency
  const matches = (lowerText.match(new RegExp(lowerKeyword, 'g')) || []).length;
  score += matches;
  
  return score;
};

const calculateKeywordDensity = (text: string, keywords: string[]): number => {
  const wordCount = text.split(/\s+/).length;
  let keywordCount = 0;
  
  keywords.forEach(keyword => {
    const matches = (text.match(new RegExp(keyword, 'gi')) || []).length;
    keywordCount += matches;
  });
  
  return keywordCount / wordCount;
};

const getResumeText = (resume: ResumeData): string => {
  const parts = [
    resume.contact.fullName,
    resume.summary,
    ...resume.experience.flatMap(exp => [
      exp.company,
      exp.position,
      ...exp.description
    ]),
    ...resume.education.flatMap(edu => [
      edu.institution,
      edu.degree,
      edu.field
    ]),
    ...resume.skills.map(skill => skill.name)
  ];
  
  return parts.filter(Boolean).join(' ');
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isProfessionalEmail = (email: string): boolean => {
  const unprofessionalDomains = ['yahoo.com', 'hotmail.com', 'aol.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return !unprofessionalDomains.includes(domain);
};

export const generateOptimizationSuggestions = (
  resume: ResumeData,
  jobDescription?: JobDescription
): OptimizationSuggestion[] => {
  const suggestions: OptimizationSuggestion[] = [];
  
  if (jobDescription) {
    const resumeText = getResumeText(resume);
    const keywords = extractKeywords(jobDescription.description);
    const missingKeywords = keywords.filter(keyword => 
      !resumeText.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (missingKeywords.length > 0) {
      suggestions.push({
        type: 'keyword',
        severity: 'high',
        message: 'Missing key terms from job description',
        suggestion: `Consider adding these keywords: ${missingKeywords.slice(0, 5).join(', ')}`
      });
    }
  }
  
  // Structure suggestions
  if (resume.experience.length === 0) {
    suggestions.push({
      type: 'structure',
      severity: 'high',
      message: 'No work experience listed',
      suggestion: 'Add your work experience to improve ATS scoring'
    });
  }
  
  if (resume.skills.length < 5) {
    suggestions.push({
      type: 'structure',
      severity: 'medium',
      message: 'Limited skills listed',
      suggestion: 'Add 10-20 relevant skills to improve keyword matching'
    });
  }
  
  return suggestions;
};