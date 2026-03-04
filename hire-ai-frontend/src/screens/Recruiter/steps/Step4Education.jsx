// src/steps/Step4Education.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function Step4Education({ formData, updateFormData }) {
  const [education, setEducation] = useState(
    formData.education.length > 0 
      ? formData.education 
      : [{
          id: Date.now(),
          school: '',
          degree: '',
          field: '',
          startYear: '',
          endYear: '',
          gpa: '',
          honors: ''
        }]
  );

  // CRITICAL FIX: Sync local state when formData.education changes
  useEffect(() => {
    if (formData.education && formData.education.length > 0) {
      setEducation(formData.education);
    }
  }, [formData.education]);

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      school: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      gpa: '',
      honors: ''
    };
    const updated = [...education, newEdu];
    setEducation(updated);
    updateFormData('education', updated);
  };

  const removeEducation = (id) => {
    const updated = education.filter(edu => edu.id !== id);
    setEducation(updated);
    updateFormData('education', updated);
  };

  const updateEducation = (id, field, value) => {
    const updated = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
    updateFormData('education', updated);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Education background
        </h2>
        <p className="text-gray-600">Tell us about your academic journey</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
        {education.map((edu, index) => (
          <div key={edu.id} className="border border-gray-200 rounded-xl p-6 relative">
            {education.length > 1 && (
              <button 
                onClick={() => removeEducation(edu.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}

            <h3 className="font-semibold text-gray-800 mb-5">Education {index + 1}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                School / University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                placeholder="e.g., Stanford University"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Degree <span className="text-red-500">*</span>
                </label>
                <select 
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white"
                >
                  <option value="">Select degree</option>
                  <option value="High School">High School</option>
                  <option value="Associate's">Associate's</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Year <span className="text-red-500">*</span>
                </label>
                <select 
                  value={edu.startYear}
                  onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white"
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Year <span className="text-red-500">*</span>
                </label>
                <select 
                  value={edu.endYear}
                  onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white"
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="e.g., 3.8/4.0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Honors (Optional)
                </label>
                <input
                  type="text"
                  value={edu.honors}
                  onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                  placeholder="e.g., Summa Cum Laude"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addEducation}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Another Education
        </button>
      </div>
    </div>
  );
}