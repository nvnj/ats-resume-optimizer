import React from 'react'
import { ResumeData } from '../types/resume'
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react'

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: 'single' | 'double';
}

function ResumePreview({ resumeData, template }: ResumePreviewProps) {
  const { contact, summary, experience, education, skills } = resumeData

  if (template === 'double') {
    return <TwoColumnTemplate resumeData={resumeData} />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {contact.fullName || 'Your Name'}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {contact.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {contact.email}
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                {contact.phone}
              </div>
            )}
            {contact.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {contact.location}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
            {contact.linkedin && (
              <div className="flex items-center">
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
              </div>
            )}
            {contact.github && (
              <div className="flex items-center">
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </div>
            )}
            {contact.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                Portfolio
              </div>
            )}
          </div>
        </div>

        {summary && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position || 'Position Title'}</h3>
                      <p className="text-gray-700 font-medium">{exp.company || 'Company Name'}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description.filter(desc => desc.trim()).length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      {exp.description.filter(desc => desc.trim()).map((desc, index) => (
                        <li key={index} className="leading-relaxed">{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-700">{edu.institution || 'Institution Name'}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{edu.endDate || 'Graduation Year'}</p>
                    {edu.location && <p>{edu.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              Skills
            </h2>
            <div className="space-y-3">
              {Object.entries(
                skills.reduce((groups, skill) => {
                  const category = skill.category
                  if (!groups[category]) groups[category] = []
                  groups[category].push(skill)
                  return groups
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-medium text-gray-900 mb-1">{category}:</h3>
                  <p className="text-gray-700">
                    {categorySkills.map(skill => skill.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TwoColumnTemplate({ resumeData }: { resumeData: ResumeData }) {
  const { contact, summary, experience, education, skills } = resumeData

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-3 min-h-[800px]">
        {/* Left Column */}
        <div className="bg-gray-50 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {contact.fullName || 'Your Name'}
            </h1>
            <div className="space-y-2 text-sm text-gray-600">
              {contact.email && (
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                  {contact.phone}
                </div>
              )}
              {contact.location && (
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                  {contact.location}
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center">
                  <Linkedin className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </div>
              )}
              {contact.github && (
                <div className="flex items-center">
                  <Github className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">GitHub</span>
                </div>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Skills
              </h2>
              <div className="space-y-3">
                {Object.entries(
                  skills.reduce((groups, skill) => {
                    const category = skill.category
                    if (!groups[category]) groups[category] = []
                    groups[category].push(skill)
                    return groups
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{category}</h3>
                    <div className="space-y-1">
                      {categorySkills.map(skill => (
                        <div key={skill.id} className="text-xs text-gray-700">
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {edu.degree || 'Degree'}
                    </h3>
                    <p className="text-xs text-gray-700">{edu.institution || 'Institution'}</p>
                    <p className="text-xs text-gray-600">{edu.endDate}</p>
                    {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 p-6 space-y-6">
          {summary && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position || 'Position'}</h3>
                        <p className="text-gray-700 font-medium">{exp.company || 'Company'}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      </div>
                    </div>
                    {exp.description.filter(desc => desc.trim()).length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                        {exp.description.filter(desc => desc.trim()).map((desc, index) => (
                          <li key={index} className="leading-relaxed">{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumePreview