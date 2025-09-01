import React, { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Experience } from '../../types/resume'
import { useDrag, useDrop } from 'react-dnd'

interface ExperienceSectionProps {
  data: Experience[];
  onChange: (experience: Experience[]) => void;
}

const ItemTypes = {
  EXPERIENCE: 'experience'
}

function ExperienceSection({ data, onChange }: ExperienceSectionProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    }
    onChange([...data, newExperience])
  }

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id))
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const moveExperience = (dragIndex: number, hoverIndex: number) => {
    const newData = [...data]
    const [removed] = newData.splice(dragIndex, 1)
    newData.splice(hoverIndex, 0, removed)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      {data.map((experience, index) => (
        <DraggableExperience
          key={experience.id}
          index={index}
          experience={experience}
          onUpdate={updateExperience}
          onRemove={removeExperience}
          moveExperience={moveExperience}
        />
      ))}

      <button
        onClick={addExperience}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Work Experience
      </button>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <p className="text-sm text-yellow-800">
          <strong>ATS Tip:</strong> List experience in reverse chronological order. 
          Use bullet points and include quantifiable achievements with numbers and percentages.
        </p>
      </div>
    </div>
  )
}

interface DraggableExperienceProps {
  index: number;
  experience: Experience;
  onUpdate: (id: string, field: keyof Experience, value: any) => void;
  onRemove: (id: string) => void;
  moveExperience: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableExperience({ 
  index, 
  experience, 
  onUpdate, 
  onRemove, 
  moveExperience 
}: DraggableExperienceProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EXPERIENCE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemTypes.EXPERIENCE,
    hover: (item: { index: number }) => {
      if (!item) return
      
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      moveExperience(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const addBulletPoint = () => {
    const newDescription = [...experience.description, '']
    onUpdate(experience.id, 'description', newDescription)
  }

  const updateBulletPoint = (bulletIndex: number, value: string) => {
    const newDescription = experience.description.map((bullet, index) =>
      index === bulletIndex ? value : bullet
    )
    onUpdate(experience.id, 'description', newDescription)
  }

  const removeBulletPoint = (bulletIndex: number) => {
    if (experience.description.length > 1) {
      const newDescription = experience.description.filter((_, index) => index !== bulletIndex)
      onUpdate(experience.id, 'description', newDescription)
    }
  }

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-gray-50 border border-gray-200 rounded-lg p-4 transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
        <button
          onClick={() => onRemove(experience.id)}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            value={experience.company}
            onChange={(e) => onUpdate(experience.id, 'company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Apple Inc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            value={experience.position}
            onChange={(e) => onUpdate(experience.id, 'position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Senior Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={experience.location}
            onChange={(e) => onUpdate(experience.id, 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="text"
              value={experience.startDate}
              onChange={(e) => onUpdate(experience.id, 'startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Jan 2020"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="text"
              value={experience.current ? 'Present' : experience.endDate}
              onChange={(e) => onUpdate(experience.id, 'endDate', e.target.value)}
              disabled={experience.current}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              placeholder="Dec 2022"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={experience.current}
              onChange={(e) => {
                onUpdate(experience.id, 'current', e.target.checked)
                if (e.target.checked) {
                  onUpdate(experience.id, 'endDate', '')
                }
              }}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">I currently work here</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description & Achievements
        </label>
        
        <div className="space-y-2">
          {experience.description.map((bullet, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-gray-400 mt-3">•</span>
              <textarea
                value={bullet}
                onChange={(e) => updateBulletPoint(index, e.target.value)}
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe your responsibilities and achievements with quantifiable results..."
              />
              {experience.description.length > 1 && (
                <button
                  onClick={() => removeBulletPoint(index)}
                  className="text-red-600 hover:text-red-800 mt-2 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addBulletPoint}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add bullet point
        </button>
      </div>
    </div>
  )
}

export default ExperienceSection