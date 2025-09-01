import { ResumeData, Experience, Education, Skill, Contact } from '../types/resume';
import { extractTextFromPDF, createGuidedResumeStructure } from './simplePdfExtractor';
import { parseResumeWithAdvancedParser } from './advancedResumeParser';

// Dynamic import for PDF.js to handle worker issues
let pdfjsLib: any = null;

export const parseResumeFile = async (file: File): Promise<ResumeData> => {
  let text = '';
  
  try {
    if (file.type === 'application/pdf') {
      // Try PDF.js first, then fall back to simple extraction
      try {
        console.log('Attempting PDF.js parsing...');
        text = await parsePDF(file);
      } catch (pdfError) {
        console.warn('PDF.js failed, trying simple extraction:', pdfError);
        try {
          text = await extractTextFromPDF(file);
          console.log('Simple extraction succeeded');
        } catch (simpleError) {
          console.warn('Simple extraction also failed:', simpleError);
          console.log('Using guided structure instead');
          return createGuidedResumeStructure(file.name);
        }
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await parseDOCX(file);
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }

    if (!text || text.trim().length < 10) {
      console.log('No meaningful text extracted, using guided structure');
      return createGuidedResumeStructure(file.name);
    }

    console.log('🚀 Using advanced parser for text processing...');
    const resumeData = parseResumeWithAdvancedParser(text);
    
    // If we got very little structured data, still return what we have
    if (!resumeData.contact.fullName && !resumeData.contact.email && resumeData.experience.length === 0) {
      console.warn('Very little structured data extracted, but proceeding with basic parsing');
      // Add a helpful message to the summary
      if (!resumeData.summary.trim()) {
        resumeData.summary = `Text was extracted from "${file.name}" but automatic parsing had limited success. Please review and edit the information below.`;
      }
    }
    
    return resumeData;
    
  } catch (error) {
    console.error('All resume parsing methods failed:', error);
    
    // Final fallback - always provide a guided structure
    return createGuidedResumeStructure(file.name);
  }
};

const initializePDFJS = async () => {
  if (!pdfjsLib) {
    try {
      pdfjsLib = await import('pdfjs-dist');
      
      // Get the exact version that's loaded and use matching worker
      const version = pdfjsLib.version || '5.4.149';
      console.log('PDF.js version:', version);
      
      // Use the same version for the worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;
      
      console.log('PDF.js worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    } catch (error) {
      console.error('Failed to load PDF.js:', error);
      throw new Error('PDF processing library failed to load. Please try refreshing the page.');
    }
  }
  return pdfjsLib;
};

const parsePDF = async (file: File): Promise<string> => {
  try {
    console.log('Starting PDF parsing for file:', file.name, 'Size:', file.size);
    
    // Initialize PDF.js
    const pdfjs = await initializePDFJS();
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    // Get the version for consistent URLs
    const version = pdfjs.version || '5.4.149';
    
    // Simple PDF.js configuration with matching version
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${version}/standard_fonts/`
    });
    
    const pdf = await loadingTask.promise;
    console.log('PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 10); // Limit to first 10 pages for performance

    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => {
            if (item && typeof item.str === 'string') {
              return item.str;
            }
            return '';
          })
          .filter(text => text && text.trim().length > 0)
          .join(' ');
        
        if (pageText.trim()) {
          fullText += pageText + '\n';
        }
        console.log(`Page ${i} parsed, text length:`, pageText.length);
      } catch (pageError) {
        console.warn(`Error parsing page ${i}:`, pageError);
        // Continue with other pages
      }
    }

    if (!fullText.trim()) {
      throw new Error('No text could be extracted from the PDF. This might be an image-based PDF or have complex formatting.');
    }

    console.log('PDF parsing completed, total text length:', fullText.length);
    return fullText;
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF') || error.message.includes('not a PDF')) {
        throw new Error('The uploaded file is not a valid PDF. Please check the file format.');
      } else if (error.message.includes('password') || error.message.includes('encrypted')) {
        throw new Error('This PDF is password-protected. Please upload an unprotected version.');
      } else if (error.message.includes('No text could be extracted')) {
        throw error;
      } else if (error.message.includes('PDF processing library')) {
        throw error;
      }
    }
    
    throw new Error('Unable to process this PDF file. Please try a different file or use "Start Fresh" to enter information manually.');
  }
};

const parseDOCX = async (file: File): Promise<string> => {
  try {
    // For browser environment, we'll use a simple approach
    // In a real implementation, you'd use mammoth.js or similar
    const arrayBuffer = await file.arrayBuffer();
    
    // This is a simplified implementation
    // In production, you should use mammoth.js:
    // const mammoth = await import('mammoth');
    // const result = await mammoth.extractRawText({ arrayBuffer });
    // return result.value;
    
    // For now, return a placeholder that encourages PDF upload
    throw new Error('DOCX parsing is not fully implemented in this demo. Please upload a PDF file instead.');
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file. Please try uploading a PDF version instead.');
  }
};

const parseResumeText = (text: string): ResumeData => {
  console.log('Parsing resume text, length:', text.length);
  console.log('First 500 characters:', text.substring(0, 500));
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  console.log('Total lines after filtering:', lines.length);
  
  const contact = extractContact(text);
  const summary = extractSummary(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  const skills = extractSkills(text);
  
  console.log('Extracted data:', {
    contact,
    summary: summary.substring(0, 100),
    experienceCount: experience.length,
    educationCount: education.length,
    skillsCount: skills.length
  });
  
  return {
    contact,
    summary,
    experience,
    education,
    skills,
    sections: ['contact', 'summary', 'experience', 'education', 'skills']
  };
};

const extractContact = (text: string): Contact => {
  console.log('Extracting contact information...');
  
  // More comprehensive regex patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/g;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/gi;
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w]{2,}/gi;
  
  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  console.log('Contact regex matches:', {
    email: emailMatch,
    phone: phoneMatch,
    linkedin: linkedinMatch,
    github: githubMatch
  });

  // Extract name - more sophisticated approach
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let fullName = '';
  
  // Look for name in the first few lines
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    
    // Skip lines with email, phone, or URLs
    if (emailRegex.test(line) || phoneRegex.test(line) || urlRegex.test(line)) {
      continue;
    }
    
    // Skip very short or very long lines
    if (line.length < 5 || line.length > 50) {
      continue;
    }
    
    // Look for name patterns
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5) {
      // Check if it looks like a name (mostly letters, some punctuation ok)
      const namePattern = /^[A-Za-z\s\.,'-]+$/;
      if (namePattern.test(line)) {
        // Additional checks - avoid section headers
        const lowerLine = line.toLowerCase();
        if (!lowerLine.includes('resume') && 
            !lowerLine.includes('cv') && 
            !lowerLine.includes('profile') &&
            !lowerLine.includes('summary') &&
            !lowerLine.includes('experience') &&
            !lowerLine.includes('education') &&
            !lowerLine.includes('skills')) {
          fullName = line;
          console.log('Found name:', fullName);
          break;
        }
      }
    }
  }

  const contact = {
    fullName,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    location: extractLocation(text),
    linkedin: linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '',
    github: githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '',
    website: ''
  };
  
  console.log('Extracted contact:', contact);
  return contact;
};

const extractLocation = (text: string): string => {
  console.log('Extracting location...');
  
  // Multiple location patterns
  const patterns = [
    // City, State ZIP
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)/g,
    // City, State
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2})/g,
    // City, State (more flexible)
    /([A-Za-z\s]+,\s*[A-Z]{2})/g,
    // International: City, Country
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+)/g
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      // Filter out matches that are likely not locations
      for (const match of matches) {
        const cleanMatch = match.trim();
        const lowerMatch = cleanMatch.toLowerCase();
        
        // Skip if it contains common non-location words
        if (!lowerMatch.includes('experience') && 
            !lowerMatch.includes('education') &&
            !lowerMatch.includes('university') &&
            !lowerMatch.includes('college') &&
            !lowerMatch.includes('company') &&
            cleanMatch.length > 5 && 
            cleanMatch.length < 50) {
          console.log('Found location:', cleanMatch);
          return cleanMatch;
        }
      }
    }
  }
  
  console.log('No location found');
  return '';
};

const extractSummary = (text: string): string => {
  console.log('Extracting summary...');
  
  const summaryKeywords = [
    'summary', 'profile', 'objective', 'overview', 'about', 
    'professional summary', 'career summary', 'executive summary',
    'personal statement', 'career objective'
  ];
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Method 1: Look for explicit summary sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check if this line is a summary header
    const isHeader = summaryKeywords.some(keyword => {
      const cleanLine = line.replace(/[^a-z\s]/g, '').trim();
      return cleanLine === keyword || cleanLine.startsWith(keyword);
    });
    
    if (isHeader) {
      console.log('Found summary header:', line);
      let summary = '';
      let j = i + 1;
      
      // Collect the summary content
      while (j < lines.length && j < i + 15) {
        const nextLine = lines[j];
        const lowerNextLine = nextLine.toLowerCase();
        
        // Stop if we hit another section
        if (lowerNextLine.includes('experience') || 
            lowerNextLine.includes('education') ||
            lowerNextLine.includes('skills') ||
            lowerNextLine.includes('work history') ||
            lowerNextLine.includes('employment')) {
          break;
        }
        
        // Skip very short lines (likely formatting)
        if (nextLine.length < 15) {
          j++;
          continue;
        }
        
        summary += nextLine + ' ';
        j++;
      }
      
      const cleanSummary = summary.trim();
      if (cleanSummary.length > 30) {
        console.log('Found summary:', cleanSummary.substring(0, 100) + '...');
        return cleanSummary;
      }
    }
  }
  
  // Method 2: Look for paragraph-like text near the top (after contact info)
  let startIndex = 0;
  
  // Skip contact information lines
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];
    if (/@/.test(line) || /\d{3}.*\d{3}.*\d{4}/.test(line) || /linkedin|github/i.test(line)) {
      startIndex = i + 1;
    }
  }
  
  // Look for a substantial paragraph
  for (let i = startIndex; i < Math.min(startIndex + 8, lines.length); i++) {
    const line = lines[i];
    
    // Skip section headers
    if (/^(experience|education|skills|work|employment)/i.test(line)) {
      break;
    }
    
    // Look for substantial content
    if (line.length > 80 && !/@/.test(line) && !/\d{3}.*\d{3}.*\d{4}/.test(line)) {
      console.log('Found potential summary paragraph:', line.substring(0, 100) + '...');
      return line;
    }
  }
  
  console.log('No summary found');
  return '';
};

const extractExperience = (text: string): Experience[] => {
  console.log('Extracting experience...');
  
  const experiences: Experience[] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Find experience section
  let startIndex = -1;
  let endIndex = lines.length;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('experience') || line.includes('employment') || 
        line.includes('work history') || line.includes('professional experience')) {
      startIndex = i + 1;
      console.log('Found experience section at line', i, ':', line);
    }
    if (startIndex > -1 && (line.includes('education') || line.includes('skills'))) {
      endIndex = i;
      console.log('Experience section ends at line', i);
      break;
    }
  }
  
  if (startIndex === -1) {
    console.log('No experience section found');
    return experiences;
  }
  
  console.log('Processing experience lines from', startIndex, 'to', endIndex);
  
  let currentExp: Partial<Experience> | null = null;
  
  for (let i = startIndex; i < endIndex; i++) {
    const line = lines[i];
    
    // Check if line has dates (likely a job entry)
    const datePattern = /\b(19|20)\d{2}\b|present|current/i;
    const hasDate = datePattern.test(line);
    
    // Check if line looks like job title + company pattern
    const jobPattern = /^[A-Za-z].*\s+(at|@|-|,|\|)\s+.*$/;
    const looksLikeJob = jobPattern.test(line) || hasDate;
    
    if (looksLikeJob && line.length > 10) {
      // Save previous experience if exists
      if (currentExp && (currentExp.position || currentExp.company)) {
        experiences.push(currentExp as Experience);
        console.log('Added experience:', currentExp.position, 'at', currentExp.company);
      }
      
      // Parse new experience
      const { position, company } = parseJobLine(line);
      
      currentExp = {
        id: `exp-${experiences.length + 1}`,
        company: company || 'Company Name',
        position: position || 'Position Title',
        location: extractLocationFromJobLine(line),
        startDate: extractStartDate(line),
        endDate: extractEndDate(line),
        current: /present|current/i.test(line),
        description: []
      };
      
      console.log('Found new job entry:', line);
    } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || 
                              line.startsWith('*') || line.startsWith('◦') ||
                              (line.length > 20 && !hasDate))) {
      // This is likely a bullet point or job description
      const description = line.replace(/^[•\-*◦]\s*/, '').trim();
      if (description.length > 5) {
        currentExp.description = currentExp.description || [];
        currentExp.description.push(description);
      }
    }
  }
  
  // Don't forget the last experience
  if (currentExp && (currentExp.position || currentExp.company)) {
    experiences.push(currentExp as Experience);
    console.log('Added final experience:', currentExp.position, 'at', currentExp.company);
  }
  
  console.log('Total experiences found:', experiences.length);
  return experiences;
};

const extractEducation = (text: string): Education[] => {
  const education: Education[] = [];
  const lines = text.split('\n').map(line => line.trim());
  
  // Simple education extraction
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/bachelor|master|phd|degree|university|college/i.test(line)) {
      education.push({
        id: `edu-${education.length + 1}`,
        institution: extractInstitution(line),
        degree: extractDegree(line),
        field: '',
        location: '',
        startDate: '',
        endDate: extractEducationYear(line),
        gpa: extractGPA(line)
      });
    }
  }
  
  return education;
};

const extractSkills = (text: string): Skill[] => {
  const skills: Skill[] = [];
  const lines = text.split('\n').map(line => line.trim());
  
  // Find skills section
  let skillsStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/skills|technologies|competencies/i.test(lines[i])) {
      skillsStartIndex = i + 1;
      break;
    }
  }
  
  if (skillsStartIndex === -1) return skills;
  
  // Extract skills from the next few lines
  for (let i = skillsStartIndex; i < Math.min(skillsStartIndex + 10, lines.length); i++) {
    const line = lines[i];
    if (line.includes(',') || line.includes('•')) {
      const skillNames = line.split(/[,•]/).map(s => s.trim()).filter(s => s.length > 0);
      skillNames.forEach(skillName => {
        if (skillName.length < 30) { // Reasonable skill name length
          skills.push({
            id: `skill-${skills.length + 1}`,
            name: skillName,
            level: 'Intermediate',
            category: 'Technical'
          });
        }
      });
    }
  }
  
  return skills;
};

// Helper functions for job parsing
const parseJobLine = (line: string): { position: string; company: string } => {
  console.log('Parsing job line:', line);
  
  // Common patterns: "Position at Company", "Position | Company", "Position - Company"
  const patterns = [
    /^(.+?)\s+at\s+(.+?)(?:\s*[\|\-]|\s*\d{4}|$)/i,
    /^(.+?)\s*[\|\-]\s*(.+?)(?:\s*\d{4}|$)/i,
    /^(.+?),\s*(.+?)(?:\s*\d{4}|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      const position = match[1].trim();
      const company = match[2].trim();
      
      // Remove dates from company name
      const cleanCompany = company.replace(/\b(19|20)\d{2}\b.*/, '').trim();
      
      if (position.length > 2 && cleanCompany.length > 2) {
        console.log('Parsed:', { position, company: cleanCompany });
        return { position, company: cleanCompany };
      }
    }
  }
  
  // Fallback: split by common separators and take first two parts
  const parts = line.split(/[\|\-@]/).map(p => p.trim());
  if (parts.length >= 2) {
    const position = parts[0].replace(/\b(19|20)\d{2}\b.*/, '').trim();
    const company = parts[1].replace(/\b(19|20)\d{2}\b.*/, '').trim();
    
    if (position.length > 2 && company.length > 2) {
      return { position, company };
    }
  }
  
  // Last resort
  const cleanLine = line.replace(/\b(19|20)\d{2}\b.*/, '').trim();
  if (cleanLine.length > 5) {
    const words = cleanLine.split(/\s+/);
    if (words.length > 2) {
      const midPoint = Math.floor(words.length / 2);
      return {
        position: words.slice(0, midPoint).join(' '),
        company: words.slice(midPoint).join(' ')
      };
    }
  }
  
  return { position: 'Position Title', company: 'Company Name' };
};

const extractLocationFromJobLine = (line: string): string => {
  // Look for location at the end of job lines
  const locationPattern = /([A-Z][a-z]+,\s*[A-Z]{2})\s*$/;
  const match = line.match(locationPattern);
  return match ? match[1] : '';
};

// Legacy helper functions (simplified)
const extractCompany = (line: string): string => {
  return parseJobLine(line).company;
};

const extractPosition = (line: string): string => {
  return parseJobLine(line).position;
};

const extractStartDate = (line: string): string => {
  const match = line.match(/(\d{4})/);
  return match ? match[1] : '';
};

const extractEndDate = (line: string): string => {
  if (/present|current/i.test(line)) return 'Present';
  const matches = line.match(/\d{4}/g);
  return matches && matches.length > 1 ? matches[1] : '';
};

const extractInstitution = (line: string): string => {
  return line.split(/\d{4}/)[0].trim() || 'Institution';
};

const extractDegree = (line: string): string => {
  return 'Degree'; // Simplified
};

const extractEducationYear = (line: string): string => {
  const match = line.match(/\d{4}/);
  return match ? match[0] : '';
};

const extractGPA = (line: string): string => {
  const match = line.match(/GPA:?\s*(\d\.\d+)/i);
  return match ? match[1] : '';
};