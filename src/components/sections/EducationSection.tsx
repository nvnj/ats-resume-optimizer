import React from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Education } from '../../types/resume'
import { useDrag, useDrop } from 'react-dnd'

interface EducationSectionProps {
  data: Education[];
  onChange: (education: Education[]) => void;
}

const ItemTypes = {
  EDUCATION: 'education'
}

function EducationSection({ data, onChange }: EducationSectionProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }
    onChange([...data, newEducation])
  }

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const moveEducation = (dragIndex: number, hoverIndex: number) => {
    const newData = [...data]
    const [removed] = newData.splice(dragIndex, 1)
    newData.splice(hoverIndex, 0, removed)
    onChange(newData)
  }

  return (
    <div className="space-y-6">
      {data.map((education, index) => (
        <DraggableEducation
          key={education.id}
          index={index}
          education={education}
          onUpdate={updateEducation}
          onRemove={removeEducation}
          moveEducation={moveEducation}
        />
      ))}

      <button
        onClick={addEducation}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Education
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800">
          <strong>ATS Tip:</strong> Include your degree, institution, and graduation date. 
          Only include GPA if it's 3.5 or higher. List education after experience unless you're a recent graduate.
        </p>
      </div>
    </div>
  )
}

interface DraggableEducationProps {
  index: number;
  education: Education;
  onUpdate: (id: string, field: keyof Education, value: string) => void;
  onRemove: (id: string) => void;
  moveEducation: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableEducation({ 
  index, 
  education, 
  onUpdate, 
  onRemove, 
  moveEducation 
}: DraggableEducationProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EDUCATION,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ItemTypes.EDUCATION,
    hover: (item: { index: number }) => {
      if (!item) return
      
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      moveEducation(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

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
          onClick={() => onRemove(education.id)}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Name *
          </label>
          <input
            type="text"
            value={education.institution}
            onChange={(e) => onUpdate(education.id, 'institution', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Stanford University"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree Type *
          </label>
          <select
            value={education.degree}
            onChange={(e) => onUpdate(education.id, 'degree', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select Degree</option>
            <option value="High School Diploma">High School Diploma</option>
            <option value="Associate Degree">Associate Degree</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Doctorate">Doctorate</option>
            <option value="Certificate">Certificate</option>
            <option value="Professional Certificate">Professional Certificate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study *
          </label>
          <input
            type="text"
            value={education.field}
            onChange={(e) => onUpdate(education.id, 'field', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Computer Science"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={education.location}
            onChange={(e) => onUpdate(education.id, 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Stanford, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="text"
            value={education.startDate}
            onChange={(e) => onUpdate(education.id, 'startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="2018"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Graduation Date *
          </label>
          <input
            type="text"
            value={education.endDate}
            onChange={(e) => onUpdate(education.id, 'endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="2022"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GPA (Optional - only if 3.5+)
          </label>
          <input
            type="text"
            value={education.gpa || ''}
            onChange={(e) => onUpdate(education.id, 'gpa', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="3.8/4.0"
          />
        </div>
      </div>
    </div>
  )
}

export default EducationSection