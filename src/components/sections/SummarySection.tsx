import React, { useState } from 'react'
import { Lightbulb } from 'lucide-react'

interface SummarySectionProps {
  data: string;
  onChange: (summary: string) => void;
}

function SummarySection({ data, onChange }: SummarySectionProps) {
  const [showTips, setShowTips] = useState(false)
  
  const wordCount = data.trim().split(/\s+/).filter(word => word.length > 0).length
  const isOptimalLength = wordCount >= 50 && wordCount <= 150

  const summaryTips = [
    "Start with your job title and years of experience",
    "Include 2-3 key achievements with numbers",
    "Mention relevant skills that match the job description",
    "Keep it between 50-150 words for optimal ATS scanning",
    "Use keywords from your target job descriptions"
  ]

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary *
          </label>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${
              isOptimalLength ? 'text-green-600' : 'text-gray-500'
            }`}>
              {wordCount} words
            </span>
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="text-primary-600 hover:text-primary-700"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <textarea
          value={data}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Write a compelling professional summary that highlights your experience, skills, and career achievements. Focus on what makes you unique and valuable to employers..."
        />
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            Recommended: 50-150 words
          </span>
          <span className={`text-xs ${
            isOptimalLength 
              ? 'text-green-600' 
              : wordCount < 50 
                ? 'text-yellow-600' 
                : 'text-red-600'
          }`}>
            {wordCount < 50 && 'Too short'}
            {wordCount >= 50 && wordCount <= 150 && 'Perfect length'}
            {wordCount > 150 && 'Too long'}
          </span>
        </div>
      </div>

      {showTips && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Tips for Writing an ATS-Friendly Summary:
          </h4>
          <ul className="space-y-1">
            {summaryTips.map((tip, index) => (
              <li key={index} className="text-sm text-blue-800 flex">
                <span className="text-blue-600 mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <p className="text-sm text-green-800">
          <strong>ATS Tip:</strong> Use standard fonts and avoid tables or text boxes. 
          Include industry keywords that match job descriptions you're targeting.
        </p>
      </div>
    </div>
  )
}

export default SummarySection