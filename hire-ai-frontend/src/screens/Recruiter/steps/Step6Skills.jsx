// src/steps/Step6Skills.jsx
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const popularSkills = [
  "React", "TypeScript", "JavaScript", "Python", "Java", "Node.js", "AWS",
  "Docker", "Kubernetes", "SQL", "MongoDB", "Git", "REST APIs", "GraphQL",
  "CI/CD", "Agile", "Machine Learning", "Data Analysis"
];

export default function Step6Skills({ formData, updateFormData }) {
  const [technicalSkills, setTechnicalSkills] = useState(formData.technicalSkills || []);
  const [currentSkill, setCurrentSkill] = useState('');
  const [softSkills, setSoftSkills] = useState(formData.softSkills || []);

  // CRITICAL FIX: Sync local state when formData changes
  useEffect(() => {
    if (formData.technicalSkills && formData.technicalSkills.length > 0) {
      setTechnicalSkills(formData.technicalSkills);
    }
  }, [formData.technicalSkills]);

  useEffect(() => {
    if (formData.softSkills) {
      setSoftSkills(formData.softSkills);
    }
  }, [formData.softSkills]);

  const addTechnicalSkill = (skill) => {
    if (skill && !technicalSkills.includes(skill)) {
      const updated = [...technicalSkills, skill];
      setTechnicalSkills(updated);
      updateFormData('technicalSkills', updated);
      setCurrentSkill('');
    }
  };

  const removeTechnicalSkill = (skillToRemove) => {
    const updated = technicalSkills.filter(skill => skill !== skillToRemove);
    setTechnicalSkills(updated);
    updateFormData('technicalSkills', updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnicalSkill(currentSkill);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Skills & expertise
        </h2>
        <p className="text-gray-600">Showcase what you're great at</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">
            Technical Skills & Tools
          </label>
          
          {/* Added Skills */}
          {technicalSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-xl">
              {technicalSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeTechnicalSkill(skill)}
                    className="hover:text-emerald-900"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill and press Enter"
              className="flex-1 min-w-[220px] px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
            />
            <button 
              onClick={() => addTechnicalSkill(currentSkill)}
              className="px-5 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Add
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Popular Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => addTechnicalSkill(skill)}
                  disabled={technicalSkills.includes(skill)}
                  className="px-4 py-2 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-700"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">
            Soft Skills & Domains
          </label>
          <input
            type="text"
            value={softSkills}
            onChange={(e) => {
              setSoftSkills(e.target.value);
              updateFormData('softSkills', e.target.value);
            }}
            placeholder="e.g., Leadership, Problem Solving, Cloud Architecture"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
          />
          <p className="mt-3 text-sm text-gray-500">
            💡 Pro tip: Add 8–15 skills total for best results. Focus on skills relevant to your target roles.
          </p>
        </div>

        {technicalSkills.length > 0 && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm font-medium text-emerald-800">
              ✓ You've added {technicalSkills.length} technical skill{technicalSkills.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}