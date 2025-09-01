import React, { useState, useEffect } from 'react'
import { Target, FileText, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, BarChart3, Sparkles } from 'lucide-react'
import { ResumeData, JobDescription, ATSScore } from '../types/resume'
import { calculateATSScore, generateOptimizationSuggestions } from '../utils/atsScoring'
import { optimizeResumeWithGemini } from '../utils/geminiAPI'
import { saveJobDescriptionToStorage, loadJobDescriptionFromStorage } from '../utils/storage'

interface ATSOptimizerProps {
  resumeData: ResumeData;
  jobDescription: JobDescription | null;
  onJobDescriptionChange: (jd: JobDescription | null) => void;
  onScoreUpdate: (score: ATSScore) => void;
  onResumeUpdate: (resume: ResumeData) => void;
}

function ATSOptimizer({ 
  resumeData, 
  jobDescription, 
  onJobDescriptionChange, 
  onScoreUpdate, 
  onResumeUpdate 
}: ATSOptimizerProps) {
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [activeTab, setActiveTab] = useState<'analysis' | 'suggestions' | 'ai-suggestions'>('analysis')
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  useEffect(() => {
    const saved = loadJobDescriptionFromStorage()
    if (saved) {
      onJobDescriptionChange(saved)
      setJobTitle(saved.title)
      setCompany(saved.company)
      setDescription(saved.description)
    }
  }, [])

  useEffect(() => {
    if (resumeData) {
      setIsAnalyzing(true)
      // Simulate analysis delay
      const timer = setTimeout(() => {
        const score = calculateATSScore(resumeData, jobDescription || undefined)
        setAtsScore(score)
        onScoreUpdate(score)
        setIsAnalyzing(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [resumeData, jobDescription, onScoreUpdate])

  const handleJobDescriptionSubmit = () => {
    const jd: JobDescription = {
      title: jobTitle,
      company: company,
      description: description,
      requirements: [],
      keywords: []
    }
    
    onJobDescriptionChange(jd)
    saveJobDescriptionToStorage(jd)
  }

  const clearJobDescription = () => {
    setJobTitle('')
    setCompany('')
    setDescription('')
    onJobDescriptionChange(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-100 border-green-200'
    if (score >= 50) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  const suggestions = generateOptimizationSuggestions(resumeData, jobDescription || undefined)

  const getAISuggestions = async () => {
    if (!jobDescription) return
    
    setIsLoadingAI(true)
    try {
      const geminiSuggestions = await optimizeResumeWithGemini(resumeData, jobDescription)
      setAiSuggestions(geminiSuggestions)
      setActiveTab('ai-suggestions')
    } catch (error) {
      console.error('Failed to get AI suggestions:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">ATS Optimizer</h1>
        {atsScore && (
          <div className={`px-4 py-2 rounded-lg border ${getScoreBgColor(atsScore.overall)}`}>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span className="font-medium">ATS Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor(atsScore.overall)}`}>
                {atsScore.overall}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Job Description Input */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
              {jobDescription && (
                <button
                  onClick={clearJobDescription}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Senior Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tech Company Inc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Paste the complete job description here..."
                />
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleJobDescriptionSubmit}
                  disabled={!description.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  Analyze Against This Job
                </button>
                
                {jobDescription && (
                  <button
                    onClick={getAISuggestions}
                    disabled={isLoadingAI}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center"
                  >
                    {isLoadingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                        Getting AI Suggestions...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get AI Suggestions
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {isAnalyzing ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="text-lg text-gray-600">Analyzing your resume...</span>
              </div>
            </div>
          ) : atsScore ? (
            <div className="space-y-6">
              {/* Score Overview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS Score Breakdown</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Overall Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            atsScore.overall >= 75 ? 'bg-green-500' :
                            atsScore.overall >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${atsScore.overall}%` }}
                        />
                      </div>
                      <span className={`font-bold ${getScoreColor(atsScore.overall)}`}>
                        {atsScore.overall}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Keyword Match</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${atsScore.keywordMatch}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900">{atsScore.keywordMatch}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Formatting</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-purple-500"
                          style={{ width: `${atsScore.formatting}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900">{atsScore.formatting}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Structure</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-indigo-500"
                          style={{ width: `${atsScore.structure}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900">{atsScore.structure}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('analysis')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'analysis'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 inline mr-2" />
                      Analysis
                    </button>
                    <button
                      onClick={() => setActiveTab('suggestions')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'suggestions'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4 inline mr-2" />
                      Suggestions ({suggestions.length})
                    </button>
                    {aiSuggestions && (
                      <button
                        onClick={() => setActiveTab('ai-suggestions')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'ai-suggestions'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        AI Suggestions ({aiSuggestions.suggestions?.length || 0})
                      </button>
                    )}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'analysis' && (
                    <div className="space-y-4">
                      {/* Matched Keywords */}
                      {atsScore.details.matchedKeywords.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <h4 className="font-medium text-gray-900">Matched Keywords</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {atsScore.details.matchedKeywords.map((keyword, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Missing Keywords */}
                      {atsScore.details.missingKeywords.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <h4 className="font-medium text-gray-900">Missing Keywords</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {atsScore.details.missingKeywords.slice(0, 10).map((keyword, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-md"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Warnings */}
                      {atsScore.details.warnings.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <h4 className="font-medium text-gray-900">Warnings</h4>
                          </div>
                          <ul className="space-y-1">
                            {atsScore.details.warnings.map((warning, index) => (
                              <li key={index} className="text-sm text-yellow-800 bg-yellow-50 p-2 rounded">
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'suggestions' && (
                    <div className="space-y-4">
                      {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border ${
                              suggestion.severity === 'high' ? 'bg-red-50 border-red-200' :
                              suggestion.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                              'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-1 rounded ${
                                suggestion.severity === 'high' ? 'bg-red-200' :
                                suggestion.severity === 'medium' ? 'bg-yellow-200' :
                                'bg-blue-200'
                              }`}>
                                <Lightbulb className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{suggestion.message}</h5>
                                <p className="text-sm text-gray-700 mt-1">{suggestion.suggestion}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                          <p>Great job! No major issues found.</p>
                          <p className="text-sm">Your resume is well-optimized for ATS systems.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'ai-suggestions' && aiSuggestions && (
                    <div className="space-y-6">
                      {/* AI Score */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Sparkles className="w-6 h-6 text-purple-600" />
                          <div>
                            <h4 className="font-medium text-purple-900">AI-Enhanced Score</h4>
                            <p className="text-sm text-purple-700">
                              Improved score: <span className="font-bold">{aiSuggestions.overallScore}%</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Optimized Headline */}
                      {aiSuggestions.optimizedHeadline && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-medium text-blue-900 mb-2">Suggested Headline</h5>
                          <p className="text-blue-800 font-medium italic">"{aiSuggestions.optimizedHeadline}"</p>
                          <p className="text-sm text-blue-700 mt-2">
                            This headline better matches the job requirements and includes relevant keywords.
                          </p>
                        </div>
                      )}

                      {/* AI Suggestions */}
                      {aiSuggestions.suggestions?.map((suggestion: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 capitalize">{suggestion.type} Improvement</h5>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  suggestion.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                                  suggestion.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {Math.round(suggestion.confidence * 100)}% confident
                                </span>
                              </div>
                              <p className="text-gray-700 mb-2">{suggestion.suggestion}</p>
                              <p className="text-sm text-gray-600">{suggestion.explanation}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Missing Keywords */}
                      {aiSuggestions.missingKeywords?.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h5 className="font-medium text-yellow-900 mb-2">AI-Detected Missing Keywords</h5>
                          <div className="flex flex-wrap gap-2">
                            {aiSuggestions.missingKeywords.map((keyword: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-yellow-200 text-yellow-800 text-sm rounded-md">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          <Sparkles className="w-4 h-4 inline mr-1" />
                          AI suggestions powered by advanced language models
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Optimize</h3>
                <p>Add a job description to get your ATS compatibility score and optimization suggestions.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ATSOptimizer