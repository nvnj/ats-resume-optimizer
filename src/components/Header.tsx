import React, { useState } from 'react'
import { Upload, FileText, Target, BarChart } from 'lucide-react'
import { ATSScore } from '../types/resume'

interface HeaderProps {
  currentTab: 'upload' | 'builder' | 'optimizer';
  onTabChange: (tab: 'upload' | 'builder' | 'optimizer') => void;
  atsScore: ATSScore | null;
}

function Header({ currentTab, onTabChange, atsScore }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-600">ATS Resume Optimizer</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => onTabChange('upload')}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                currentTab === 'upload'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </button>
            <button
              onClick={() => onTabChange('builder')}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                currentTab === 'builder'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Resume Builder
            </button>
            <button
              onClick={() => onTabChange('optimizer')}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                currentTab === 'optimizer'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              <Target className="w-4 h-4 mr-2" />
              ATS Optimizer
            </button>
          </nav>

          {/* ATS Score Display */}
          {atsScore && (
            <div className="hidden md:flex items-center space-x-2">
              <BarChart className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">ATS Score:</span>
              <span className={`font-bold ${getScoreColor(atsScore.overall)}`}>
                {atsScore.overall}%
              </span>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 border-t border-gray-200">
              <button
                onClick={() => {
                  onTabChange('upload')
                  setIsMenuOpen(false)
                }}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-lg ${
                  currentTab === 'upload'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </button>
              <button
                onClick={() => {
                  onTabChange('builder')
                  setIsMenuOpen(false)
                }}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-lg ${
                  currentTab === 'builder'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Resume Builder
              </button>
              <button
                onClick={() => {
                  onTabChange('optimizer')
                  setIsMenuOpen(false)
                }}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-lg ${
                  currentTab === 'optimizer'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <Target className="w-4 h-4 mr-2" />
                ATS Optimizer
              </button>
              
              {atsScore && (
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">ATS Score:</span>
                  <span className={`font-bold ${getScoreColor(atsScore.overall)}`}>
                    {atsScore.overall}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
