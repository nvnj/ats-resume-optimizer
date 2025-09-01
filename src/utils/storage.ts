import { ResumeData, JobDescription } from '../types/resume';

const STORAGE_KEYS = {
  RESUME_DATA: 'ats-resume-data',
  JOB_DESCRIPTION: 'ats-job-description',
  USER_PREFERENCES: 'ats-user-preferences'
};

export const saveResumeToStorage = (resumeData: ResumeData): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(resumeData));
  } catch (error) {
    console.error('Failed to save resume to localStorage:', error);
  }
};

export const loadResumeFromStorage = (): ResumeData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESUME_DATA);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load resume from localStorage:', error);
    return null;
  }
};

export const saveJobDescriptionToStorage = (jobDescription: JobDescription): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTION, JSON.stringify(jobDescription));
  } catch (error) {
    console.error('Failed to save job description to localStorage:', error);
  }
};

export const loadJobDescriptionFromStorage = (): JobDescription | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTION);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load job description from localStorage:', error);
    return null;
  }
};

export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const getStorageSize = (): string => {
  try {
    const totalSize = Object.values(STORAGE_KEYS).reduce((size, key) => {
      const item = localStorage.getItem(key);
      return size + (item ? item.length : 0);
    }, 0);
    
    return totalSize < 1024 ? `${totalSize} bytes` : `${(totalSize / 1024).toFixed(2)} KB`;
  } catch (error) {
    return 'Unable to calculate';
  }
};