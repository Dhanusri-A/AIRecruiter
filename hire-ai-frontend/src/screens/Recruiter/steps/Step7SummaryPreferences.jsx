// src/steps/Step6SummaryPreferences.jsx
import React, { useState } from 'react';
import { Sparkles, Clock, DollarSign, MapPin, Globe, Plus, X } from 'lucide-react';

export default function Step6SummaryPreferences({ formData, updateFormData }) {
  const [workTypes, setWorkTypes] = useState(formData.workType || []);
  const [languages, setLanguages] = useState(formData.languages || []);
  const [showLanguageInput, setShowLanguageInput] = useState(false);
  const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: '' });

  const toggleWorkType = (type) => {
    const updated = workTypes.includes(type)
      ? workTypes.filter(t => t !== type)
      : [...workTypes, type];
    setWorkTypes(updated);
    updateFormData('workType', updated);
  };

  const addLanguage = () => {
    if (newLanguage.language && newLanguage.proficiency) {
      const updated = [...languages, { ...newLanguage, id: Date.now() }];
      setLanguages(updated);
      updateFormData('languages', updated);
      setNewLanguage({ language: '', proficiency: '' });
      setShowLanguageInput(false);
    }
  };

  const removeLanguage = (id) => {
    const updated = languages.filter(lang => lang.id !== id);
    setLanguages(updated);
    updateFormData('languages', updated);
  };

  const generateSummary = () => {
    const { firstName, lastName, headline, experiences, technicalSkills } = formData;
    const yearsExp = formData.yearsOfExperience || '5+';
    const topSkills = technicalSkills.slice(0, 3).join(', ') || 'various technologies';
    
    const generated = `Results-driven ${headline || 'professional'} with ${yearsExp} years of experience. Skilled in ${topSkills}. Passionate about delivering high-quality solutions and driving innovation.`;
    
    updateFormData('summary', generated);
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Additional details
        </h2>
        <p className="text-gray-600">Help employers understand what you're looking for</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-9">
        {/* Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-base font-semibold text-gray-800">
              Professional Summary
            </label>
            <button 
              onClick={generateSummary}
              className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              <Sparkles size={16} /> AI Generate
            </button>
          </div>
          <textarea
            rows={5}
            value={formData.summary}
            onChange={(e) => updateFormData('summary', e.target.value)}
            placeholder="Write 2–4 sentences about your professional background, key strengths, career goals..."
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none resize-none transition-all"
          />
          <p className="mt-1.5 text-xs text-gray-500">2–4 sentences recommended</p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          <div>
            <label className="flex items-center gap-2 font-semibold text-gray-800 mb-2.5">
              <Clock size={17} className="text-emerald-600" />
              Total Years of Experience
            </label>
            <select 
              value={formData.yearsOfExperience}
              onChange={(e) => updateFormData('yearsOfExperience', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 bg-white transition-all"
            >
              <option value="">Select experience</option>
              <option value="0–1 years">0–1 years</option>
              <option value="1–3 years">1–3 years</option>
              <option value="3–5 years">3–5 years</option>
              <option value="5–8 years">5–8 years</option>
              <option value="8+ years">8+ years</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2.5">
              Notice Period / Availability
            </label>
            <select 
              value={formData.noticePeriod}
              onChange={(e) => updateFormData('noticePeriod', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 bg-white transition-all"
            >
              <option value="">Select availability</option>
              <option value="Immediate">Immediate</option>
              <option value="15 days">15 days</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3+ months">3+ months</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold text-gray-800 mb-2.5">
            <DollarSign size={17} className="text-emerald-600" />
            Expected Salary Range (Annual)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={formData.salaryCurrency}
              onChange={(e) => updateFormData('salaryCurrency', e.target.value)}
              className="w-28 px-3 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              value={formData.salaryMin}
              onChange={(e) => updateFormData('salaryMin', e.target.value)}
              placeholder="Min"
              className="flex-1 min-w-[120px] px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
            />
            <span className="text-gray-400 px-1">to</span>
            <input
              type="number"
              value={formData.salaryMax}
              onChange={(e) => updateFormData('salaryMax', e.target.value)}
              placeholder="Max"
              className="flex-1 min-w-[120px] px-4 py-3 border border-gray-200 rounded-xl focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">Annual salary expectations</p>
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <MapPin size={17} className="text-emerald-600" />
            Preferred Work Type
          </label>
          <div className="flex flex-wrap gap-3">
            {['Remote', 'Hybrid', 'On-site'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleWorkType(type)}
                className={`px-6 py-2.5 rounded-xl border-2 font-medium transition-colors ${
                  workTypes.includes(type)
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
            <Globe size={17} className="text-emerald-600" />
            Languages
          </label>

          {languages.length > 0 && (
            <div className="mb-4 space-y-2">
              {languages.map(lang => (
                <div 
                  key={lang.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-gray-500 text-sm ml-2">• {lang.proficiency}</span>
                  </div>
                  <button
                    onClick={() => removeLanguage(lang.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!showLanguageInput ? (
            <button 
              onClick={() => setShowLanguageInput(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Language
            </button>
          ) : (
            <div className="space-y-3 p-4 border border-gray-200 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newLanguage.language}
                  onChange={(e) => setNewLanguage({...newLanguage, language: e.target.value})}
                  placeholder="Language (e.g., English)"
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                />
                <select
                  value={newLanguage.proficiency}
                  onChange={(e) => setNewLanguage({...newLanguage, proficiency: e.target.value})}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-emerald-400 focus:border-emerald-400 outline-none bg-white"
                >
                  <option value="">Proficiency</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addLanguage}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowLanguageInput(false);
                    setNewLanguage({ language: '', proficiency: '' });
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}