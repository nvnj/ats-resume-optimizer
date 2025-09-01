// Gemini API integration for AI-powered resume optimization
import { ResumeData, JobDescription } from '../types/resume';

interface GeminiSuggestion {
  type: 'headline' | 'keywords' | 'language' | 'formatting';
  suggestion: string;
  explanation: string;
  confidence: number;
}

interface GeminiResponse {
  optimizedHeadline?: string;
  missingKeywords: string[];
  languageImprovements: string[];
  formattingIssues: string[];
  overallScore: number;
  suggestions: GeminiSuggestion[];
}

// Mock API endpoint - in production, this would be your backend endpoint
const GEMINI_API_ENDPOINT = '/api/gemini/optimize';

export const optimizeResumeWithGemini = async (
  resume: ResumeData,
  jobDescription?: JobDescription
): Promise<GeminiResponse> => {
  // For demo purposes, we'll simulate the API response
  // In production, you would make an actual API call to your backend
  return simulateGeminiResponse(resume, jobDescription);
};

// Simulate Gemini API response for demo
const simulateGeminiResponse = async (
  resume: ResumeData,
  jobDescription?: JobDescription
): Promise<GeminiResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const suggestions: GeminiSuggestion[] = [];
  let overallScore = 75;

  // Analyze headline
  if (jobDescription) {
    const optimizedHeadline = generateOptimizedHeadline(resume, jobDescription);
    if (optimizedHeadline !== resume.summary.split('.')[0]) {
      suggestions.push({
        type: 'headline',
        suggestion: optimizedHeadline,
        explanation: 'This headline better aligns with the job requirements and includes relevant keywords.',
        confidence: 0.85
      });
    }
  }

  // Analyze keywords
  const missingKeywords = analyzeMissingKeywords(resume, jobDescription);
  if (missingKeywords.length > 0) {
    suggestions.push({
      type: 'keywords',
      suggestion: `Consider adding these relevant keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
      explanation: 'These keywords appear frequently in the job description but are missing from your resume.',
      confidence: 0.9
    });
    overallScore -= Math.min(20, missingKeywords.length * 2);
  }

  // Analyze language improvements
  const languageImprovements = analyzeLanguageImprovements(resume);
  if (languageImprovements.length > 0) {
    suggestions.push({
      type: 'language',
      suggestion: languageImprovements[0],
      explanation: 'Using more action-oriented language and quantifiable achievements will improve ATS scoring.',
      confidence: 0.8
    });
    overallScore -= 5;
  }

  // Analyze formatting
  const formattingIssues = analyzeFormattingIssues(resume);
  if (formattingIssues.length > 0) {
    suggestions.push({
      type: 'formatting',
      suggestion: formattingIssues[0],
      explanation: 'These formatting improvements will ensure better ATS compatibility.',
      confidence: 0.95
    });
    overallScore -= 10;
  }

  return {
    optimizedHeadline: jobDescription ? generateOptimizedHeadline(resume, jobDescription) : undefined,
    missingKeywords: missingKeywords.slice(0, 10),
    languageImprovements: languageImprovements.slice(0, 5),
    formattingIssues: formattingIssues.slice(0, 5),
    overallScore: Math.max(0, Math.min(100, overallScore)),
    suggestions
  };
};

const generateOptimizedHeadline = (resume: ResumeData, jobDescription: JobDescription): string => {
  const jobTitle = jobDescription.title;
  const experience = resume.experience[0];
  
  if (!experience) {
    return `${jobTitle} | Professional with Strong Technical Skills`;
  }

  const yearsOfExperience = calculateYearsOfExperience(resume.experience);
  const keySkills = resume.skills.slice(0, 3).map(s => s.name).join(', ');
  
  return `${jobTitle} | ${yearsOfExperience}+ Years Experience | ${keySkills}`;
};

const analyzeMissingKeywords = (resume: ResumeData, jobDescription?: JobDescription): string[] => {
  if (!jobDescription) return [];

  const resumeText = getResumeText(resume).toLowerCase();
  const jobKeywords = extractJobKeywords(jobDescription.description);
  
  return jobKeywords.filter(keyword => 
    !resumeText.includes(keyword.toLowerCase())
  );
};

const analyzeLanguageImprovements = (resume: ResumeData): string[] => {
  const improvements: string[] = [];
  
  // Check for weak action verbs
  const weakVerbs = ['responsible for', 'worked on', 'helped with', 'assisted in'];
  const strongVerbs = ['led', 'developed', 'implemented', 'optimized', 'achieved', 'increased'];
  
  const hasWeakVerbs = resume.experience.some(exp =>
    exp.description.some(desc =>
      weakVerbs.some(weak => desc.toLowerCase().includes(weak))
    )
  );
  
  if (hasWeakVerbs) {
    improvements.push(`Replace weak action verbs with stronger alternatives like: ${strongVerbs.join(', ')}`);
  }
  
  // Check for quantifiable achievements
  const hasNumbers = resume.experience.some(exp =>
    exp.description.some(desc => /\d+/.test(desc))
  );
  
  if (!hasNumbers) {
    improvements.push('Add quantifiable achievements with specific numbers, percentages, or dollar amounts');
  }
  
  // Check summary length
  const summaryWords = resume.summary.trim().split(/\s+/).length;
  if (summaryWords < 50) {
    improvements.push('Expand your professional summary to 50-100 words for better keyword coverage');
  }
  
  return improvements;
};

const analyzeFormattingIssues = (resume: ResumeData): string[] => {
  const issues: string[] = [];
  
  // Check contact information completeness
  if (!resume.contact.email || !resume.contact.phone) {
    issues.push('Ensure all contact information (email, phone, location) is complete');
  }
  
  // Check for consistent date formatting
  const dateFormats = resume.experience.map(exp => `${exp.startDate}-${exp.endDate}`);
  const inconsistentDates = dateFormats.some(date => 
    !/^\w{3}\s\d{4}-(\w{3}\s\d{4}|Present)$/.test(date)
  );
  
  if (inconsistentDates) {
    issues.push('Use consistent date formatting (e.g., "Jan 2020 - Dec 2022")');
  }
  
  // Check section ordering
  const currentOrder = resume.sections;
  const recommendedOrder = ['contact', 'summary', 'experience', 'education', 'skills'];
  
  if (JSON.stringify(currentOrder) !== JSON.stringify(recommendedOrder)) {
    issues.push('Consider reordering sections: Contact → Summary → Experience → Education → Skills');
  }
  
  return issues;
};

const extractJobKeywords = (jobDescription: string): string[] => {
  // Extract technical skills and important terms
  const techKeywords = [
    'javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes',
    'sql', 'mongodb', 'git', 'agile', 'scrum', 'ci/cd', 'rest', 'api'
  ];
  
  const jobText = jobDescription.toLowerCase();
  const foundKeywords = techKeywords.filter(keyword => jobText.includes(keyword));
  
  // Extract custom keywords from job description
  const words = jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !isCommonWord(word));
  
  const wordFreq = words.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {} as Record<string, number>);
  
  const importantWords = Object.entries(wordFreq)
    .filter(([word, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([word]) => word);
  
  return [...foundKeywords, ...importantWords];
};

const isCommonWord = (word: string): boolean => {
  const commonWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
    'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see',
    'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
  ];
  return commonWords.includes(word.toLowerCase());
};

const calculateYearsOfExperience = (experience: any[]): number => {
  const totalMonths = experience.reduce((total, exp) => {
    const start = new Date(exp.startDate + ' 1, 2020'); // Approximate parsing
    const end = exp.current ? new Date() : new Date(exp.endDate + ' 1, 2020');
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + Math.max(0, months);
  }, 0);
  
  return Math.max(1, Math.floor(totalMonths / 12));
};

const getResumeText = (resume: ResumeData): string => {
  return [
    resume.contact.fullName,
    resume.summary,
    ...resume.experience.flatMap(exp => [exp.company, exp.position, ...exp.description]),
    ...resume.education.flatMap(edu => [edu.institution, edu.degree, edu.field]),
    ...resume.skills.map(skill => skill.name)
  ].filter(Boolean).join(' ');
};

// Production API call function (commented out for demo)
/*
const callGeminiAPI = async (prompt: string): Promise<any> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        temperature: 0.3,
        maxTokens: 1000
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to get AI suggestions');
  }
};
*/