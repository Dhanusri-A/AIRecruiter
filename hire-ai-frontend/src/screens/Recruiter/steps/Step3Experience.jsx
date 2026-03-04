// src/steps/Step3Experience.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';

export default function Step3Experience({ formData, updateFormData }) {
  const [experiences, setExperiences] = useState(
    formData.experiences.length > 0 
      ? formData.experiences 
      : [{
          id: Date.now(),
          company: '',
          title: '',
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: '',
          current: false,
          location: '',
          description: ''
        }]
  );

  // CRITICAL FIX: Sync local state when formData.experiences changes
  useEffect(() => {
    if (formData.experiences && formData.experiences.length > 0) {
      setExperiences(formData.experiences);
    }
  }, [formData.experiences]);

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      title: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      current: false,
      location: '',
      description: ''
    };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    updateFormData('experiences', updated);
  };

  const removeExperience = (id) => {
    const updated = experiences.filter(exp => exp.id !== id);
    setExperiences(updated);
    updateFormData('experiences', updated);
  };

  const updateExperience = (id, field, value) => {
    const updated = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
    updateFormData('experiences', updated);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Your work experience
        </h2>
        <p className="text-gray-600">Share your professional journey with us</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="border border-gray-200 rounded-xl p-6 relative">
            {experiences.length > 1 && (
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}

            <h3 className="font-semibold text-gray-800 mb-5">Position {index + 1}</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                  placeholder="Your role"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    value={exp.startMonth}
                    onChange={(e) => updateExperience(exp.id, 'startMonth', e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white"
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select 
                    value={exp.startYear}
                    onChange={(e) => updateExperience(exp.id, 'startYear', e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white"
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    value={exp.endMonth}
                    onChange={(e) => updateExperience(exp.id, 'endMonth', e.target.value)}
                    disabled={exp.current}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select 
                    value={exp.endYear}
                    onChange={(e) => updateExperience(exp.id, 'endYear', e.target.value)}
                    disabled={exp.current}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 mt-3 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                  />
                  I currently work here
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Location (Optional)
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={5}
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Describe your responsibilities, achievements, and impact...&#10;Use bullet points to highlight key achievements"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none resize-none transition-all"
              />
              <div className="mt-2 flex justify-end">
                <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1.5 font-medium">
                  <Sparkles size={16} /> AI Suggest
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addExperience}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Another Position
        </button>
      </div>
    </div>
  );
}