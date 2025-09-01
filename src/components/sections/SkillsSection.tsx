import React, { useState } from 'react'
import { Plus, Trash2, Tag } from 'lucide-react'
import { Skill } from '../../types/resume'

interface SkillsSectionProps {
  data: Skill[];
  onChange: (skills: Skill[]) => void;
}

function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const [newSkillName, setNewSkillName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Skill['category']>('Technical')
  const [selectedLevel, setSelectedLevel] = useState<Skill['level']>('Intermediate')

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkillName.trim(),
        level: selectedLevel,
        category: selectedCategory
      }
      onChange([...data, newSkill])
      setNewSkillName('')
    }
  }

  const removeSkill = (id: string) => {
    onChange(data.filter(skill => skill.id !== id))
  }

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    onChange(data.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const groupedSkills = data.reduce((groups, skill) => {
    const category = skill.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(skill)
    return groups
  }, {} as Record<Skill['category'], Skill[]>)

  const getCategoryColor = (category: Skill['category']) => {
    switch (category) {
      case 'Technical': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Soft': return 'bg-green-100 text-green-800 border-green-200'
      case 'Language': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Certification': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Beginner': return 'bg-red-100 text-red-700'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced': return 'bg-blue-100 text-blue-700'
      case 'Expert': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Skill */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Skill</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter skill name..."
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Skill['category'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Technical">Technical</option>
              <option value="Soft">Soft Skill</option>
              <option value="Language">Language</option>
              <option value="Certification">Certification</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as Skill['level'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={addSkill}
          disabled={!newSkillName.trim()}
          className="mt-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      {/* Skills by Category */}
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <h4 className="text-lg font-medium text-gray-900">{category} Skills</h4>
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {skills.length}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getCategoryColor(skill.category)}`}
              >
                <span className="font-medium">{skill.name}</span>
                
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  className={`text-xs px-2 py-1 rounded ${getLevelColor(skill.level)} border-0 focus:ring-1 focus:ring-primary-500`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-red-600 hover:text-red-800 ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No skills added yet</p>
          <p className="text-sm">Add your first skill above to get started</p>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <p className="text-sm text-green-800">
          <strong>ATS Tip:</strong> Include both hard and soft skills relevant to your target job. 
          Use exact keywords from job descriptions. Organize skills by category for better readability.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <p className="text-sm text-yellow-800">
          <strong>Best Practice:</strong> Focus on skills you can demonstrate in interviews. 
          List 15-20 relevant skills rather than everything you've ever touched.
        </p>
      </div>
    </div>
  )
}

export default SkillsSection