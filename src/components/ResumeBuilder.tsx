import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { GripVertical, Plus, Download, Eye, Target } from 'lucide-react'
import { ResumeData, ResumeSectionType } from '../types/resume'
import { exportToPDF, exportToDOCX } from '../utils/exportUtils'
import ContactSection from './sections/ContactSection'
import SummarySection from './sections/SummarySection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection from './sections/EducationSection'
import SkillsSection from './sections/SkillsSection'
import ResumePreview from './ResumePreview'

interface ResumeBuilderProps {
  resumeData: ResumeData;
  onResumeChange: (resumeData: ResumeData) => void;
  onNavigateToOptimizer: () => void;
}

interface DragItem {
  type: string;
  index: number;
}

const ItemTypes = {
  SECTION: 'section'
}

function ResumeBuilder({ resumeData, onResumeChange, onNavigateToOptimizer }: ResumeBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'single' | 'double'>('single')
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const newSections = [...resumeData.sections]
    const [removed] = newSections.splice(dragIndex, 1)
    newSections.splice(hoverIndex, 0, removed)
    
    onResumeChange({
      ...resumeData,
      sections: newSections
    })
  }

  const updateSection = <K extends keyof ResumeData>(
    section: K,
    data: ResumeData[K]
  ) => {
    onResumeChange({
      ...resumeData,
      [section]: data
    })
  }

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true)
    try {
      if (format === 'pdf') {
        await exportToPDF(resumeData, selectedTemplate)
      } else {
        await exportToDOCX(resumeData)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const renderSection = (sectionType: ResumeSectionType, index: number) => {
    switch (sectionType) {
      case 'contact':
        return (
          <ContactSection
            key="contact"
            data={resumeData.contact}
            onChange={(contact) => updateSection('contact', contact)}
          />
        )
      case 'summary':
        return (
          <SummarySection
            key="summary"
            data={resumeData.summary}
            onChange={(summary) => updateSection('summary', summary)}
          />
        )
      case 'experience':
        return (
          <ExperienceSection
            key="experience"
            data={resumeData.experience}
            onChange={(experience) => updateSection('experience', experience)}
          />
        )
      case 'education':
        return (
          <EducationSection
            key="education"
            data={resumeData.education}
            onChange={(education) => updateSection('education', education)}
          />
        )
      case 'skills':
        return (
          <SkillsSection
            key="skills"
            data={resumeData.skills}
            onChange={(skills) => updateSection('skills', skills)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Editor Panel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={onNavigateToOptimizer}
              className="btn-primary flex items-center"
            >
              <Target className="w-4 h-4 mr-2" />
              Optimize for ATS
            </button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Template</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTemplate('single')}
              className={`p-3 border rounded-lg transition-colors ${
                selectedTemplate === 'single'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-12 h-16 bg-gray-200 rounded mb-2"></div>
              <p className="text-sm font-medium">Single Column</p>
            </button>
            <button
              onClick={() => setSelectedTemplate('double')}
              className={`p-3 border rounded-lg transition-colors ${
                selectedTemplate === 'double'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="w-12 h-16 bg-gray-200 rounded mb-2 grid grid-cols-2 gap-1">
                <div className="bg-gray-300 rounded-sm"></div>
                <div className="bg-gray-300 rounded-sm"></div>
              </div>
              <p className="text-sm font-medium">Two Column</p>
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {resumeData.sections.map((sectionType, index) => (
            <DraggableSection
              key={`${sectionType}-${index}`}
              index={index}
              sectionType={sectionType}
              moveSection={moveSection}
            >
              {renderSection(sectionType, index)}
            </DraggableSection>
          ))}
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Export Resume</h3>
          <div className="flex space-x-3">
            <button 
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="btn-secondary flex items-center disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Download PDF'}
            </button>
            <button 
              onClick={() => handleExport('docx')}
              disabled={isExporting}
              className="btn-secondary flex items-center disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Download DOCX'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Export your ATS-optimized resume in PDF or Word format
          </p>
        </div>
      </div>

      {/* Preview Panel */}
      <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
        <div className="sticky top-8">
          <ResumePreview 
            resumeData={resumeData}
            template={selectedTemplate}
          />
        </div>
      </div>
    </div>
  )
}

interface DraggableSectionProps {
  index: number;
  sectionType: ResumeSectionType;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

function DraggableSection({ index, sectionType, moveSection, children }: DraggableSectionProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { type: ItemTypes.SECTION, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.SECTION,
    hover: (item: DragItem) => {
      if (!item) return
      
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      moveSection(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white rounded-lg border border-gray-200 transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center p-4 border-b border-gray-100">
        <GripVertical className="w-5 h-5 text-gray-400 cursor-move mr-3" />
        <h3 className="text-lg font-medium text-gray-900 capitalize">
          {sectionType === 'contact' ? 'Contact Information' :
           sectionType === 'summary' ? 'Professional Summary' :
           sectionType === 'experience' ? 'Work Experience' :
           sectionType === 'education' ? 'Education' :
           'Skills'}
        </h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

export default ResumeBuilder