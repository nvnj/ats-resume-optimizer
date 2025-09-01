import React, { useCallback, useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { ResumeData } from '../types/resume'
import { parseResumeFile } from '../utils/resumeParser'

interface FileUploadProps {
  onResumeUploaded: (resumeData: ResumeData) => void;
  onNavigateToBuilder: () => void;
}

function FileUpload({ onResumeUploaded, onNavigateToBuilder }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [processedData, setProcessedData] = useState<ResumeData | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }, [])

  const processFile = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a PDF or DOCX file only.')
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB.')
      }

      console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size)
      
      let resumeData;
      try {
        resumeData = await parseResumeFile(file)
        console.log('Resume data parsed successfully:', resumeData)
      } catch (parseError) {
        console.error('Primary parsing failed:', parseError)
        
        // Fallback: Create basic structure and let user fill manually
        resumeData = {
          contact: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
            website: ''
          },
          summary: `Resume uploaded successfully but automatic parsing encountered issues. Please review and edit the information below manually.`,
          experience: [],
          education: [],
          skills: [],
          sections: ['contact', 'summary', 'experience', 'education', 'skills']
        }
        
        console.log('Using fallback resume structure')
      }
      
      onResumeUploaded(resumeData)
      setProcessedData(resumeData)
      setUploadSuccess(true)
      
      // Auto-navigate to builder after 2 seconds
      setTimeout(() => {
        onNavigateToBuilder()
      }, 2000)
      
    } catch (error) {
      console.error('File processing error:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to process the resume file.')
    } finally {
      setIsUploading(false)
    }
  }

  const startFresh = () => {
    // Create empty resume data
    const emptyResume: ResumeData = {
      contact: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      sections: ['contact', 'summary', 'experience', 'education', 'skills']
    }
    
    onResumeUploaded(emptyResume)
    onNavigateToBuilder()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ATS Resume Optimizer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your existing resume or start fresh. Our AI will help you optimize it for 
          Applicant Tracking Systems and increase your chances of getting hired.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Existing Resume */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Upload Existing Resume</h2>
          
          <div
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
              ${isDragging 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Processing your resume...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            ) : uploadSuccess ? (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Resume uploaded successfully!</p>
                <p className="text-sm text-gray-500">
                  {processedData?.contact?.fullName ? 
                    `Processing complete. Taking you to the builder...` :
                    `File accepted. You can now edit your resume in the builder...`
                  }
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop your resume here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF and DOCX files (up to 10MB)
                </p>
                
                <label className="btn-primary cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Upload Error</p>
                <p className="text-sm text-red-700 mb-3">{uploadError}</p>
                <div className="text-sm text-red-600">
                  <p className="font-medium mb-1">Troubleshooting tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Ensure the PDF is not password-protected</li>
                    <li>Try saving the PDF from another source if possible</li>
                    <li>For image-based PDFs (scanned documents), text extraction may not work</li>
                    <li>Consider using "Start Fresh" to manually enter your information</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 space-y-2">
            <p className="font-medium">What we'll extract:</p>
            <ul className="space-y-1 ml-4">
              <li>• Contact information</li>
              <li>• Professional summary</li>
              <li>• Work experience</li>
              <li>• Education details</li>
              <li>• Skills and certifications</li>
            </ul>
          </div>
        </div>

        {/* Start Fresh */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Start Fresh</h2>
          
          <div className="border-2 border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Build from scratch
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Create your resume using our guided builder with ATS-optimized templates
            </p>
            
            <button onClick={startFresh} className="btn-secondary">
              Start Building
            </button>
          </div>

          <div className="text-sm text-gray-500 space-y-2">
            <p className="font-medium">Features included:</p>
            <ul className="space-y-1 ml-4">
              <li>• Drag & drop section reordering</li>
              <li>• Real-time ATS score</li>
              <li>• Multiple resume templates</li>
              <li>• AI-powered suggestions</li>
              <li>• Export to PDF/DOCX</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-xl">
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          🎯 Target ATS Score: 75%+
        </h3>
        <p className="text-blue-800">
          Our optimizer analyzes your resume against job descriptions to ensure it passes 
          through Applicant Tracking Systems and reaches human recruiters.
        </p>
      </div>
    </div>
  )
}

export default FileUpload