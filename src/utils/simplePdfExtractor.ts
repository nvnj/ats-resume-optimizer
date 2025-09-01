// Simple PDF text extraction without external dependencies
import { ResumeData } from '../types/resume';

// Basic PDF text extraction using a different approach
export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log('Attempting simple PDF text extraction...');
  
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string and look for text content
    let text = '';
    let inTextObject = false;
    let currentText = '';
    
    // Simple approach: scan for text between PDF text operators
    const decoder = new TextDecoder('latin1');
    const pdfContent = decoder.decode(uint8Array);
    
    // Look for text content between BT (begin text) and ET (end text)
    const textMatches = pdfContent.match(/BT\s+.*?ET/gs);
    
    if (textMatches) {
      textMatches.forEach(textBlock => {
        // Extract text from Tj and TJ operators
        const textOperators = textBlock.match(/\((.*?)\)\s*Tj/g);
        if (textOperators) {
          textOperators.forEach(op => {
            const match = op.match(/\((.*?)\)/);
            if (match) {
              let extractedText = match[1];
              // Clean up common PDF escape sequences
              extractedText = extractedText
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\'/g, "'")
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
              
              text += extractedText + ' ';
            }
          });
        }
        
        // Also try TJ arrays
        const arrayMatches = textBlock.match(/\[(.*?)\]\s*TJ/g);
        if (arrayMatches) {
          arrayMatches.forEach(arrayMatch => {
            const innerContent = arrayMatch.match(/\[(.*?)\]/);
            if (innerContent) {
              const elements = innerContent[1].match(/\((.*?)\)/g);
              if (elements) {
                elements.forEach(element => {
                  const textMatch = element.match(/\((.*?)\)/);
                  if (textMatch) {
                    text += textMatch[1] + ' ';
                  }
                });
              }
            }
          });
        }
      });
    }
    
    // If no structured text found, try a more brute force approach
    if (!text.trim()) {
      console.log('No structured text found, trying brute force extraction...');
      
      // Look for readable text patterns in the PDF
      const readableText = pdfContent.match(/[A-Za-z]{3,}[\w\s@.,\-()]{10,}/g);
      if (readableText) {
        // Filter out PDF commands and keep likely content
        const filtered = readableText.filter(match => {
          const lower = match.toLowerCase();
          return !lower.includes('obj') && 
                 !lower.includes('endobj') &&
                 !lower.includes('stream') &&
                 !lower.includes('filter') &&
                 match.length > 10 &&
                 /[a-zA-Z]/.test(match);
        });
        
        text = filtered.join(' ');
      }
    }
    
    // Clean up the extracted text
    text = text
      .replace(/\s+/g, ' ')  // Multiple spaces to single space
      .replace(/\n\s*\n/g, '\n')  // Multiple newlines to single
      .trim();
    
    console.log('Simple extraction completed, text length:', text.length);
    console.log('Sample text:', text.substring(0, 200));
    
    if (text.length < 20) {
      throw new Error('Very little text extracted - PDF might be image-based or heavily formatted');
    }
    
    return text;
    
  } catch (error) {
    console.error('Simple PDF extraction failed:', error);
    throw new Error('Could not extract text from this PDF. It may be image-based, password-protected, or have complex formatting.');
  }
};

// Fallback: Create a resume structure with helpful guidance
export const createGuidedResumeStructure = (fileName: string): ResumeData => {
  return {
    contact: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: `File "${fileName}" was uploaded successfully. Please fill in your information manually using the forms below. The ATS optimizer will still work perfectly to help you optimize your resume for job applications.`,
    experience: [
      {
        id: 'exp-1',
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ['']
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }
    ],
    skills: [],
    sections: ['contact', 'summary', 'experience', 'education', 'skills']
  };
};