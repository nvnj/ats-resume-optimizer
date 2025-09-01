export interface Contact {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Certification';
}

export interface ResumeData {
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  sections: ResumeSectionType[];
}

export type ResumeSectionType = 'contact' | 'summary' | 'experience' | 'education' | 'skills';

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  structure: number;
  details: {
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
    warnings: string[];
  };
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export interface OptimizationSuggestion {
  type: 'keyword' | 'format' | 'structure' | 'content';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export interface Template {
  id: string;
  name: string;
  layout: 'single-column' | 'two-column';
  preview: string;
}