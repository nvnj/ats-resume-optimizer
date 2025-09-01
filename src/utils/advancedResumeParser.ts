// Advanced Resume Parser with state-of-the-art text processing
import { ResumeData, Experience, Education, Skill, Contact } from '../types/resume';

interface ParsingContext {
  lines: string[];
  originalText: string;
  sections: SectionBoundary[];
  tokens: Token[];
}

interface SectionBoundary {
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  startLine: number;
  endLine: number;
  confidence: number;
  headerLine: string;
}

interface Token {
  text: string;
  type: 'word' | 'email' | 'phone' | 'url' | 'date' | 'location' | 'name';
  line: number;
  position: number;
  confidence: number;
}

export class AdvancedResumeParser {
  private context: ParsingContext;

  constructor() {
    this.context = {
      lines: [],
      originalText: '',
      sections: [],
      tokens: []
    };
  }

  public parseResumeText(text: string): ResumeData {
    console.log('🚀 Starting advanced resume parsing...');
    console.log('Text length:', text.length);

    // Initialize parsing context
    this.initializeContext(text);
    
    // Perform multi-pass analysis
    this.tokenizeText();
    this.identifySections();
    this.enrichTokens();
    
    // Extract structured data
    const contact = this.extractAdvancedContact();
    const summary = this.extractAdvancedSummary();
    const experience = this.extractAdvancedExperience();
    const education = this.extractAdvancedEducation();
    const skills = this.extractAdvancedSkills();

    const result: ResumeData = {
      contact,
      summary,
      experience,
      education,
      skills,
      sections: ['contact', 'summary', 'experience', 'education', 'skills']
    };

    console.log('✅ Advanced parsing completed');
    console.log('Results:', {
      hasName: !!contact.fullName,
      hasEmail: !!contact.email,
      hasPhone: !!contact.phone,
      experienceCount: experience.length,
      educationCount: education.length,
      skillsCount: skills.length
    });

    return result;
  }

  private initializeContext(text: string): void {
    this.context.originalText = text;
    this.context.lines = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log('📝 Initialized context with', this.context.lines.length, 'lines');
  }

  private tokenizeText(): void {
    console.log('🔍 Tokenizing text...');
    this.context.tokens = [];

    // Enhanced regex patterns
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
      url: /https?:\/\/[^\s]+|www\.[^\s]+|[A-Za-z0-9.-]+\.(?:com|org|net|edu|gov|io|ai|co)\b/g,
      linkedin: /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/)[A-Za-z0-9-]+/gi,
      github: /(?:github\.com\/)[A-Za-z0-9-]+/gi,
      date: /\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\b|present|current|now\b/gi,
      monthYear: /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(?:19|20)\d{2}\b/gi,
      location: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?\b/g,
      gpa: /GPA:?\s*(\d\.\d+)/gi,
      degree: /\b(?:Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|MBA|Ph\.?D\.?)[^,\n]*/gi,
      year: /\b(?:19|20)\d{2}\b/g
    };

    this.context.lines.forEach((line, lineIndex) => {
      let position = 0;
      
      // Extract typed tokens
      Object.entries(patterns).forEach(([type, regex]) => {
        let match;
        const localRegex = new RegExp(regex.source, regex.flags);
        
        while ((match = localRegex.exec(line)) !== null) {
          this.context.tokens.push({
            text: match[0],
            type: type as any,
            line: lineIndex,
            position: match.index,
            confidence: this.calculateTokenConfidence(match[0], type)
          });
        }
      });

      // Extract potential names (enhanced logic)
      if (lineIndex < 10) { // Names are typically in first 10 lines
        const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z]+)*\b/g;
        let nameMatch;
        
        while ((nameMatch = namePattern.exec(line)) !== null) {
          const nameCandidate = nameMatch[0];
          
          // Enhanced name validation
          if (this.isLikelyName(nameCandidate, line, lineIndex)) {
            this.context.tokens.push({
              text: nameCandidate,
              type: 'name',
              line: lineIndex,
              position: nameMatch.index,
              confidence: this.calculateNameConfidence(nameCandidate, line, lineIndex)
            });
          }
        }
      }
    });

    console.log(`✨ Found ${this.context.tokens.length} tokens`);
  }

  private identifySections(): void {
    console.log('📑 Identifying resume sections...');
    this.context.sections = [];

    const sectionKeywords = {
      contact: ['contact', 'personal', 'information'],
      summary: ['summary', 'profile', 'objective', 'overview', 'about', 'professional summary', 'career summary', 'personal statement'],
      experience: ['experience', 'employment', 'work history', 'professional experience', 'career', 'work experience'],
      education: ['education', 'academic', 'qualifications', 'academic background'],
      skills: ['skills', 'technical skills', 'competencies', 'expertise', 'technologies', 'proficiencies'],
      projects: ['projects', 'portfolio', 'personal projects'],
      certifications: ['certifications', 'certificates', 'licenses', 'credentials']
    };

    this.context.lines.forEach((line, index) => {
      const cleanLine = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
      
      Object.entries(sectionKeywords).forEach(([sectionType, keywords]) => {
        keywords.forEach(keyword => {
          if (cleanLine === keyword || 
              cleanLine.startsWith(keyword + ' ') || 
              (cleanLine.length < keyword.length + 5 && cleanLine.includes(keyword))) {
            
            const confidence = this.calculateSectionConfidence(line, keyword, index);
            
            if (confidence > 0.6) {
              this.context.sections.push({
                type: sectionType as any,
                startLine: index,
                endLine: this.findSectionEnd(index),
                confidence,
                headerLine: line
              });
            }
          }
        });
      });
    });

    // Sort sections by line number and merge overlapping ones
    this.context.sections.sort((a, b) => a.startLine - b.startLine);
    this.mergeSections();

    console.log(`🎯 Identified ${this.context.sections.length} sections:`, 
      this.context.sections.map(s => s.type));
  }

  private extractAdvancedContact(): Contact {
    console.log('👤 Extracting contact information...');

    // Get the best email
    const emailTokens = this.context.tokens.filter(t => t.type === 'email');
    const email = emailTokens.sort((a, b) => b.confidence - a.confidence)[0]?.text || '';

    // Get the best phone
    const phoneTokens = this.context.tokens.filter(t => t.type === 'phone');
    const phone = phoneTokens.sort((a, b) => b.confidence - a.confidence)[0]?.text || '';

    // Get the best name
    const nameTokens = this.context.tokens.filter(t => t.type === 'name');
    const bestName = nameTokens.sort((a, b) => b.confidence - a.confidence)[0];
    const fullName = bestName?.text || this.extractNameFromFirstLines();

    // Get location
    const locationTokens = this.context.tokens.filter(t => t.type === 'location');
    const location = locationTokens.sort((a, b) => b.confidence - a.confidence)[0]?.text || '';

    // Get social profiles
    const linkedinTokens = this.context.tokens.filter(t => t.type === 'linkedin');
    const githubTokens = this.context.tokens.filter(t => t.type === 'github');
    
    const linkedin = linkedinTokens[0]?.text ? this.normalizeUrl(linkedinTokens[0].text) : '';
    const github = githubTokens[0]?.text ? this.normalizeUrl(githubTokens[0].text) : '';

    // Extract website from other URLs
    const urlTokens = this.context.tokens.filter(t => t.type === 'url' && 
      !t.text.includes('linkedin') && !t.text.includes('github'));
    const website = urlTokens[0]?.text ? this.normalizeUrl(urlTokens[0].text) : '';

    const result = {
      fullName,
      email,
      phone,
      location,
      linkedin,
      github,
      website
    };

    console.log('👤 Contact extracted:', result);
    return result;
  }

  private extractAdvancedSummary(): string {
    console.log('📄 Extracting professional summary...');

    const summarySection = this.context.sections.find(s => s.type === 'summary');
    
    if (summarySection) {
      const summaryLines = this.context.lines.slice(
        summarySection.startLine + 1, 
        summarySection.endLine
      );
      
      const summary = summaryLines
        .filter(line => line.length > 20) // Filter out short formatting lines
        .join(' ')
        .trim();
      
      if (summary.length > 30) {
        console.log('📄 Found summary in dedicated section');
        return summary;
      }
    }

    // Fallback: Look for paragraph-style summary near the top
    const potentialSummary = this.findParagraphSummary();
    
    console.log('📄 Summary extraction result:', potentialSummary.substring(0, 100) + '...');
    return potentialSummary;
  }

  private extractAdvancedExperience(): Experience[] {
    console.log('💼 Extracting work experience...');
    const experiences: Experience[] = [];

    const experienceSection = this.context.sections.find(s => s.type === 'experience');
    
    if (!experienceSection) {
      console.log('❌ No experience section found');
      return experiences;
    }

    const experienceLines = this.context.lines.slice(
      experienceSection.startLine + 1,
      experienceSection.endLine
    );

    let currentJob: Partial<Experience> | null = null;
    let currentDescriptions: string[] = [];

    experienceLines.forEach((line, index) => {
      // Check if this line starts a new job entry
      if (this.isJobEntryLine(line)) {
        // Save previous job if exists
        if (currentJob) {
          currentJob.description = currentDescriptions.filter(desc => desc.length > 10);
          experiences.push(this.finalizeExperience(currentJob));
        }

        // Parse new job
        const jobInfo = this.parseJobEntry(line);
        currentJob = {
          id: `exp-${experiences.length + 1}`,
          ...jobInfo
        };
        currentDescriptions = [];

        console.log('💼 Found job:', jobInfo.position, 'at', jobInfo.company);
      } else if (currentJob && this.isDescriptionLine(line)) {
        // Add to current job description
        const cleanDescription = this.cleanDescriptionLine(line);
        if (cleanDescription.length > 5) {
          currentDescriptions.push(cleanDescription);
        }
      }
    });

    // Don't forget the last job
    if (currentJob) {
      currentJob.description = currentDescriptions.filter(desc => desc.length > 10);
      experiences.push(this.finalizeExperience(currentJob));
    }

    console.log(`💼 Extracted ${experiences.length} work experiences`);
    return experiences;
  }

  private extractAdvancedEducation(): Education[] {
    console.log('🎓 Extracting education...');
    const educations: Education[] = [];

    const educationSection = this.context.sections.find(s => s.type === 'education');
    
    if (!educationSection) {
      // Fallback: search entire document for education entries
      return this.findEducationInText();
    }

    const educationLines = this.context.lines.slice(
      educationSection.startLine + 1,
      educationSection.endLine
    );

    educationLines.forEach(line => {
      if (this.isEducationEntryLine(line)) {
        const eduInfo = this.parseEducationEntry(line);
        educations.push({
          id: `edu-${educations.length + 1}`,
          ...eduInfo
        });
        console.log('🎓 Found education:', eduInfo.degree, 'from', eduInfo.institution);
      }
    });

    console.log(`🎓 Extracted ${educations.length} education entries`);
    return educations;
  }

  private extractAdvancedSkills(): Skill[] {
    console.log('🛠️ Extracting skills...');
    const skills: Skill[] = [];

    const skillsSection = this.context.sections.find(s => s.type === 'skills');
    
    if (!skillsSection) {
      console.log('❌ No skills section found');
      return skills;
    }

    const skillsLines = this.context.lines.slice(
      skillsSection.startLine + 1,
      skillsSection.endLine
    );

    // Enhanced skill extraction
    const skillCategories = this.identifySkillCategories(skillsLines);
    
    skillCategories.forEach(category => {
      category.skills.forEach(skillName => {
        skills.push({
          id: `skill-${skills.length + 1}`,
          name: skillName,
          level: this.inferSkillLevel(skillName, category.name),
          category: category.name
        });
      });
    });

    console.log(`🛠️ Extracted ${skills.length} skills across ${skillCategories.length} categories`);
    return skills;
  }

  // Helper methods
  private isLikelyName(candidate: string, line: string, lineIndex: number): boolean {
    // Enhanced name validation logic
    const words = candidate.split(/\s+/);
    
    // Basic checks
    if (words.length < 2 || words.length > 4) return false;
    if (candidate.length < 4 || candidate.length > 50) return false;
    
    // Check for non-name patterns
    const excludePatterns = [
      /\d/, // Contains numbers
      /@/, // Contains email
      /\.com|\.org|\.net/, // Contains URLs
      /experience|education|skills|summary/i, // Section headers
      /january|february|march|april|may|june|july|august|september|october|november|december/i // Dates
    ];
    
    if (excludePatterns.some(pattern => pattern.test(candidate))) {
      return false;
    }
    
    // Prefer names in first few lines
    if (lineIndex < 3) return true;
    
    // Check if line contains other non-name content
    const otherContent = line.replace(candidate, '').trim();
    if (otherContent.length > candidate.length) return false;
    
    return true;
  }

  private calculateTokenConfidence(text: string, type: string): number {
    let confidence = 0.5;
    
    switch (type) {
      case 'email':
        if (text.includes('@') && text.includes('.')) confidence = 0.95;
        break;
      case 'phone':
        if (/\d{3}.*\d{3}.*\d{4}/.test(text)) confidence = 0.9;
        break;
      case 'date':
        if (/\d{4}/.test(text)) confidence = 0.8;
        break;
      case 'location':
        if (/[A-Z]{2}/.test(text)) confidence = 0.7;
        break;
    }
    
    return confidence;
  }

  private calculateNameConfidence(name: string, line: string, lineIndex: number): number {
    let confidence = 0.5;
    
    // Higher confidence for names in first few lines
    if (lineIndex === 0) confidence += 0.3;
    else if (lineIndex < 3) confidence += 0.2;
    
    // Higher confidence if line contains only the name
    if (line.trim() === name) confidence += 0.2;
    
    // Check name structure
    const words = name.split(/\s+/);
    if (words.length === 2) confidence += 0.1; // First Last
    if (words.length === 3) confidence += 0.05; // First Middle Last
    
    return Math.min(confidence, 1.0);
  }

  private calculateSectionConfidence(line: string, keyword: string, index: number): number {
    let confidence = 0.5;
    
    // Exact match gets higher confidence
    if (line.toLowerCase().trim() === keyword) confidence += 0.3;
    
    // Section headers are typically standalone
    if (line.trim().toLowerCase() === keyword) confidence += 0.2;
    
    // Headers often have formatting
    if (/^[A-Z\s]+$/.test(line)) confidence += 0.1;
    if (line.includes(':')) confidence += 0.1;
    
    // Reasonable position in document
    if (index > 0 && index < 100) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private findSectionEnd(startLine: number): number {
    // Find where this section ends (next section or end of document)
    for (let i = startLine + 1; i < this.context.lines.length; i++) {
      const line = this.context.lines[i].toLowerCase().replace(/[^a-z\s]/g, '');
      
      // Check if this looks like another section header
      const sectionKeywords = ['experience', 'education', 'skills', 'summary', 'profile', 'contact', 'projects', 'certifications'];
      if (sectionKeywords.some(keyword => line.includes(keyword))) {
        return i;
      }
    }
    
    return this.context.lines.length;
  }

  private mergeSections(): void {
    // Remove duplicate or overlapping sections
    const unique = this.context.sections.filter((section, index) => {
      const others = this.context.sections.filter((_, i) => i !== index);
      return !others.some(other => 
        other.type === section.type && Math.abs(other.startLine - section.startLine) < 3
      );
    });
    
    this.context.sections = unique;
  }

  private extractNameFromFirstLines(): string {
    // Fallback name extraction from first few lines
    for (let i = 0; i < Math.min(5, this.context.lines.length); i++) {
      const line = this.context.lines[i];
      
      // Skip lines with contact info
      if (/@/.test(line) || /\d{3}.*\d{3}.*\d{4}/.test(line)) continue;
      
      // Look for name pattern
      const nameMatch = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})$/);
      if (nameMatch) {
        return nameMatch[1];
      }
    }
    
    return '';
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  }

  private findParagraphSummary(): string {
    // Look for substantial paragraphs in the first part of the document
    const earlyLines = this.context.lines.slice(0, 15);
    
    for (const line of earlyLines) {
      if (line.length > 80 && 
          !/@/.test(line) && 
          !/\d{3}.*\d{3}.*\d{4}/.test(line) &&
          !/^(experience|education|skills)/i.test(line)) {
        return line;
      }
    }
    
    return '';
  }

  private isJobEntryLine(line: string): boolean {
    // Enhanced job entry detection
    const hasDate = /\b(?:19|20)\d{2}\b|present|current/i.test(line);
    const hasJobPattern = /\s+(at|@|-|\|)\s+/.test(line);
    const hasMultipleWords = line.split(/\s+/).length >= 3;
    const reasonableLength = line.length > 10 && line.length < 150;
    
    return (hasDate || hasJobPattern) && hasMultipleWords && reasonableLength;
  }

  private parseJobEntry(line: string): Partial<Experience> {
    console.log('Parsing job entry:', line);
    
    // Enhanced parsing patterns
    const patterns = [
      // "Position Title at Company Name (Date - Date)"
      /^(.+?)\s+at\s+(.+?)(?:\s*[\(\[].*[\)\]]|\s*(?:19|20)\d{2}.*)?$/i,
      // "Position Title | Company Name"
      /^(.+?)\s*[\|\-]\s*(.+?)(?:\s*(?:19|20)\d{2}.*)?$/i,
      // "Position Title, Company Name"
      /^(.+?),\s*(.+?)(?:\s*(?:19|20)\d{2}.*)?$/i
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let position = match[1].trim();
        let company = match[2].trim();
        
        // Clean up dates from position and company
        position = position.replace(/\s*\(.*\)|\s*(?:19|20)\d{2}.*/, '').trim();
        company = company.replace(/\s*\(.*\)|\s*(?:19|20)\d{2}.*/, '').trim();
        
        if (position.length > 2 && company.length > 2) {
          const dates = this.extractJobDates(line);
          
          return {
            position,
            company,
            location: this.extractJobLocation(line),
            startDate: dates.start,
            endDate: dates.end,
            current: dates.current,
            description: []
          };
        }
      }
    }
    
    // Fallback parsing
    const cleanLine = line.replace(/\s*\(.*\)|\s*(?:19|20)\d{2}.*/, '').trim();
    const words = cleanLine.split(/\s+/);
    const midPoint = Math.floor(words.length / 2);
    
    return {
      position: words.slice(0, midPoint).join(' ') || 'Position Title',
      company: words.slice(midPoint).join(' ') || 'Company Name',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: []
    };
  }

  private extractJobDates(line: string): { start: string; end: string; current: boolean } {
    const current = /present|current|now/i.test(line);
    const yearMatches = line.match(/\b(?:19|20)\d{2}\b/g) || [];
    
    if (yearMatches.length >= 2) {
      return {
        start: yearMatches[0],
        end: current ? 'Present' : yearMatches[1],
        current
      };
    } else if (yearMatches.length === 1) {
      return {
        start: yearMatches[0],
        end: current ? 'Present' : '',
        current
      };
    }
    
    return { start: '', end: current ? 'Present' : '', current };
  }

  private extractJobLocation(line: string): string {
    const locationMatch = line.match(/\b([A-Z][a-z]+,\s*[A-Z]{2})\b/);
    return locationMatch ? locationMatch[1] : '';
  }

  private isDescriptionLine(line: string): boolean {
    return (
      line.startsWith('•') ||
      line.startsWith('-') ||
      line.startsWith('*') ||
      line.startsWith('◦') ||
      (line.length > 20 && !this.isJobEntryLine(line) && !/^[A-Z\s]+$/.test(line))
    );
  }

  private cleanDescriptionLine(line: string): string {
    return line.replace(/^[•\-*◦]\s*/, '').trim();
  }

  private finalizeExperience(exp: Partial<Experience>): Experience {
    return {
      id: exp.id || 'exp-1',
      company: exp.company || 'Company Name',
      position: exp.position || 'Position Title',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || []
    };
  }

  private isEducationEntryLine(line: string): boolean {
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'b.s.', 'm.s.', 'b.a.', 'm.a.', 'mba'];
    const hasEducationKeyword = educationKeywords.some(keyword => line.toLowerCase().includes(keyword));
    const hasYear = /\b(?:19|20)\d{2}\b/.test(line);
    
    return hasEducationKeyword || hasYear;
  }

  private parseEducationEntry(line: string): Partial<Education> {
    console.log('Parsing education entry:', line);
    
    // Extract degree
    const degreePatterns = [
      /\b(Bachelor[^,\n]*|Master[^,\n]*|PhD|Ph\.?D\.?|B\.S\.|M\.S\.|B\.A\.|M\.A\.|MBA)[^,\n]*/gi,
      /\b(Degree[^,\n]*)/gi
    ];
    
    let degree = '';
    for (const pattern of degreePatterns) {
      const match = line.match(pattern);
      if (match) {
        degree = match[0].trim();
        break;
      }
    }
    
    // Extract institution - usually the longest phrase or after "at"/"from"
    let institution = '';
    const institutionPatterns = [
      /(?:at|from)\s+([^,\n]+)/i,
      /([A-Z][^,\n]*(?:University|College|Institute|School)[^,\n]*)/i
    ];
    
    for (const pattern of institutionPatterns) {
      const match = line.match(pattern);
      if (match) {
        institution = match[1].trim();
        break;
      }
    }
    
    // Extract year
    const yearMatch = line.match(/\b((?:19|20)\d{2})\b/);
    const endDate = yearMatch ? yearMatch[1] : '';
    
    // Extract GPA
    const gpaMatch = line.match(/GPA:?\s*(\d\.\d+)/i);
    const gpa = gpaMatch ? gpaMatch[1] : '';
    
    return {
      institution: institution || 'Institution',
      degree: degree || 'Degree',
      field: '',
      location: '',
      startDate: '',
      endDate,
      gpa
    };
  }

  private findEducationInText(): Education[] {
    const educations: Education[] = [];
    
    this.context.lines.forEach(line => {
      if (this.isEducationEntryLine(line)) {
        const eduInfo = this.parseEducationEntry(line);
        educations.push({
          id: `edu-${educations.length + 1}`,
          ...eduInfo
        });
      }
    });
    
    return educations;
  }

  private identifySkillCategories(skillsLines: string[]): Array<{ name: string; skills: string[] }> {
    const categories: Array<{ name: string; skills: string[] }> = [];
    
    let currentCategory = 'Technical';
    let currentSkills: string[] = [];
    
    skillsLines.forEach(line => {
      // Check if this line is a category header
      if (this.isSkillCategory(line)) {
        // Save previous category
        if (currentSkills.length > 0) {
          categories.push({
            name: currentCategory,
            skills: [...currentSkills]
          });
        }
        
        currentCategory = this.extractCategoryName(line);
        currentSkills = [];
      } else {
        // Extract skills from this line
        const lineSkills = this.extractSkillsFromLine(line);
        currentSkills.push(...lineSkills);
      }
    });
    
    // Don't forget the last category
    if (currentSkills.length > 0) {
      categories.push({
        name: currentCategory,
        skills: currentSkills
      });
    }
    
    return categories.filter(cat => cat.skills.length > 0);
  }

  private isSkillCategory(line: string): boolean {
    const categoryKeywords = [
      'programming', 'languages', 'frameworks', 'databases', 'tools', 'technologies',
      'technical', 'software', 'web', 'mobile', 'cloud', 'devops', 'frontend', 'backend'
    ];
    
    const cleanLine = line.toLowerCase().replace(/[^a-z\s]/g, '');
    return categoryKeywords.some(keyword => cleanLine.includes(keyword)) && line.length < 50;
  }

  private extractCategoryName(line: string): string {
    const cleaned = line.replace(/[^a-zA-Z\s]/g, '').trim();
    return cleaned || 'Technical';
  }

  private extractSkillsFromLine(line: string): string[] {
    // Split by common delimiters
    const delimiters = /[,•\-\|\n]/;
    const skills = line
      .split(delimiters)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 1 && skill.length < 30)
      .filter(skill => !skill.toLowerCase().includes('years')); // Filter out experience indicators
    
    return skills;
  }

  private inferSkillLevel(skillName: string, category: string): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    // Simple skill level inference based on common patterns
    const skillLower = skillName.toLowerCase();
    
    // Advanced indicators
    if (skillLower.includes('expert') || skillLower.includes('advanced')) {
      return 'Expert';
    }
    
    // Beginner indicators
    if (skillLower.includes('basic') || skillLower.includes('familiar')) {
      return 'Beginner';
    }
    
    // Default to intermediate
    return 'Intermediate';
  }
}

// Export function for backward compatibility
export const parseResumeWithAdvancedParser = (text: string): ResumeData => {
  const parser = new AdvancedResumeParser();
  return parser.parseResumeText(text);
};