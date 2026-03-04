// src/steps/Step2OnlinePresence.jsx
import React from 'react';

export default function Step2OnlinePresence({ formData, updateFormData }) {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Connect your online presence
        </h2>
        <p className="text-gray-600">
          Connecting profiles helps our AI find better matches for you
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-7">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => updateFormData('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/yourname"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            We'll auto-parse your name, headline, and current company
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => updateFormData('github', e.target.value)}
            placeholder="https://github.com/yourusername"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Portfolio / Personal Website
          </label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={(e) => updateFormData('portfolio', e.target.value)}
            placeholder="https://yourportfolio.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Twitter / X Profile
          </label>
          <input
            type="url"
            value={formData.twitter}
            onChange={(e) => updateFormData('twitter', e.target.value)}
            placeholder="https://twitter.com/yourhandle"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">
            💡 Pro tip: Adding your LinkedIn profile can auto-fill much of your work experience and education information.
          </p>
        </div>
      </div>
    </div>
  );
}