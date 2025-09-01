import { ResumeData } from '../types/resume';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export const exportToPDF = async (resumeData: ResumeData, template: 'single' | 'double' = 'single'): Promise<void> => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 6;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false, color: string = '#000000') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color);
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 2;
  };

  const addSection = (title: string) => {
    yPosition += 5;
    doc.setDrawColor(100, 100, 100);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    addText(title, 14, true, '#2563eb');
    yPosition += 3;
  };

  // Header
  addText(resumeData.contact.fullName || 'Your Name', 18, true, '#1f2937');
  
  // Contact information
  const contactInfo = [
    resumeData.contact.email,
    resumeData.contact.phone,
    resumeData.contact.location
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    addText(contactInfo, 10, false, '#6b7280');
  }

  const socialLinks = [
    resumeData.contact.linkedin,
    resumeData.contact.github,
    resumeData.contact.website
  ].filter(Boolean);
  
  if (socialLinks.length > 0) {
    addText(socialLinks.join(' | '), 10, false, '#6b7280');
  }

  // Professional Summary
  if (resumeData.summary) {
    addSection('PROFESSIONAL SUMMARY');
    addText(resumeData.summary);
  }

  // Work Experience
  if (resumeData.experience.length > 0) {
    addSection('WORK EXPERIENCE');
    
    resumeData.experience.forEach((exp) => {
      // Job title and company
      addText(`${exp.position || 'Position'} | ${exp.company || 'Company'}`, 12, true);
      
      // Dates and location
      const dateLocation = [
        `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
        exp.location
      ].filter(Boolean).join(' | ');
      
      if (dateLocation) {
        addText(dateLocation, 10, false, '#6b7280');
      }
      
      // Job description
      exp.description.filter(desc => desc.trim()).forEach((desc) => {
        addText(`• ${desc}`, 10);
      });
      
      yPosition += 5;
    });
  }

  // Education
  if (resumeData.education.length > 0) {
    addSection('EDUCATION');
    
    resumeData.education.forEach((edu) => {
      const degreeField = [edu.degree, edu.field].filter(Boolean).join(' in ');
      addText(`${degreeField} | ${edu.institution || 'Institution'}`, 12, true);
      
      const yearLocation = [edu.endDate, edu.location].filter(Boolean).join(' | ');
      if (yearLocation) {
        addText(yearLocation, 10, false, '#6b7280');
      }
      
      if (edu.gpa) {
        addText(`GPA: ${edu.gpa}`, 10);
      }
      
      yPosition += 5;
    });
  }

  // Skills
  if (resumeData.skills.length > 0) {
    addSection('SKILLS');
    
    const skillsByCategory = resumeData.skills.reduce((groups, skill) => {
      const category = skill.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(skill.name);
      return groups;
    }, {} as Record<string, string[]>);
    
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      addText(`${category}: ${skills.join(', ')}`, 10);
    });
  }

  // Save the PDF
  const fileName = `${resumeData.contact.fullName || 'Resume'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const exportToDOCX = async (resumeData: ResumeData): Promise<void> => {
  const doc = new Document({
    sections: [
      {
        children: [
          // Header - Name
          new Paragraph({
            text: resumeData.contact.fullName || 'Your Name',
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 }
          }),
          
          // Contact Information
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  resumeData.contact.email,
                  resumeData.contact.phone,
                  resumeData.contact.location
                ].filter(Boolean).join(' | '),
                size: 20
              })
            ],
            spacing: { after: 200 }
          }),
          
          // Social Links
          ...(([
            resumeData.contact.linkedin,
            resumeData.contact.github,
            resumeData.contact.website
          ].filter(Boolean).length > 0) ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: [
                    resumeData.contact.linkedin,
                    resumeData.contact.github,
                    resumeData.contact.website
                  ].filter(Boolean).join(' | '),
                  size: 20
                })
              ],
              spacing: { after: 300 }
            })
          ] : []),
          
          // Professional Summary
          ...(resumeData.summary ? [
            new Paragraph({
              text: 'PROFESSIONAL SUMMARY',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
              text: resumeData.summary,
              spacing: { after: 300 }
            })
          ] : []),
          
          // Work Experience
          ...(resumeData.experience.length > 0 ? [
            new Paragraph({
              text: 'WORK EXPERIENCE',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...resumeData.experience.flatMap((exp) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.position || 'Position'} | ${exp.company || 'Company'}`,
                    bold: true,
                    size: 24
                  })
                ],
                spacing: { after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}${exp.location ? ' | ' + exp.location : ''}`,
                    italics: true,
                    size: 20
                  })
                ],
                spacing: { after: 100 }
              }),
              ...exp.description.filter(desc => desc.trim()).map(desc =>
                new Paragraph({
                  text: `• ${desc}`,
                  spacing: { after: 50 }
                })
              ),
              new Paragraph({ text: '', spacing: { after: 200 } }) // Space between jobs
            ])
          ] : []),
          
          // Education
          ...(resumeData.education.length > 0 ? [
            new Paragraph({
              text: 'EDUCATION',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...resumeData.education.flatMap((edu) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${[edu.degree, edu.field].filter(Boolean).join(' in ')} | ${edu.institution || 'Institution'}`,
                    bold: true,
                    size: 24
                  })
                ],
                spacing: { after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.endDate || 'Graduation Year'}${edu.location ? ' | ' + edu.location : ''}`,
                    italics: true,
                    size: 20
                  })
                ],
                spacing: { after: 100 }
              }),
              ...(edu.gpa ? [
                new Paragraph({
                  text: `GPA: ${edu.gpa}`,
                  spacing: { after: 100 }
                })
              ] : []),
              new Paragraph({ text: '', spacing: { after: 200 } })
            ])
          ] : []),
          
          // Skills
          ...(resumeData.skills.length > 0 ? [
            new Paragraph({
              text: 'SKILLS',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...Object.entries(
              resumeData.skills.reduce((groups, skill) => {
                const category = skill.category;
                if (!groups[category]) groups[category] = [];
                groups[category].push(skill.name);
                return groups;
              }, {} as Record<string, string[]>)
            ).map(([category, skills]) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${category}: `,
                    bold: true
                  }),
                  new TextRun({
                    text: skills.join(', ')
                  })
                ],
                spacing: { after: 100 }
              })
            )
          ] : [])
        ]
      }
    ]
  });

  // Generate and save the document
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resumeData.contact.fullName || 'Resume'}_${new Date().toISOString().split('T')[0]}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};