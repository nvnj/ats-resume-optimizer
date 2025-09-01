import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Header from './components/Header'
import ResumeBuilder from './components/ResumeBuilder'
import ATSOptimizer from './components/ATSOptimizer'
import FileUpload from './components/FileUpload'
import { ResumeData, JobDescription, ATSScore } from './types/resume'
import { loadResumeFromStorage, saveResumeToStorage } from './utils/storage'

function App() {
  const [currentTab, setCurrentTab] = useState<'builder' | 'optimizer' | 'upload'>('upload')
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null)
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null)

  useEffect(() => {
    const savedResume = loadResumeFromStorage()
    if (savedResume) {
      setResumeData(savedResume)
      setCurrentTab('builder')
    }
  }, [])

  useEffect(() => {
    if (resumeData) {
      saveResumeToStorage(resumeData)
    }
  }, [resumeData])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentTab={currentTab} 
          onTabChange={setCurrentTab}
          atsScore={atsScore}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentTab === 'upload' && (
            <FileUpload 
              onResumeUploaded={setResumeData}
              onNavigateToBuilder={() => setCurrentTab('builder')}
            />
          )}
          
          {currentTab === 'builder' && resumeData && (
            <ResumeBuilder 
              resumeData={resumeData}
              onResumeChange={setResumeData}
              onNavigateToOptimizer={() => setCurrentTab('optimizer')}
            />
          )}
          
          {currentTab === 'optimizer' && resumeData && (
            <ATSOptimizer 
              resumeData={resumeData}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              onScoreUpdate={setAtsScore}
              onResumeUpdate={setResumeData}
            />
          )}
        </main>
      </div>
    </DndProvider>
  )
}

export default App
