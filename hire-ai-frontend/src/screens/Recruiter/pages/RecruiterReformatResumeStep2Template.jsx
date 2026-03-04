// src/pages/recruiter/reformat/Step2Template.jsx
// Receives: useLocation().state = { parsedData }
// Passes:   navigate('/recruiter/reformat-resume/process', { state: { parsedData, templateId } })

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileType, Layout, CheckCircle, Star, X } from 'lucide-react';
import RecruiterReformatResumeStep4TemplatePreview from './RecruiterReformatResumeStep4TemplatePreview';

const TEMPLATES = [
  {
    id: 'synpulse',
    name: 'Synpulse Format',
    description: 'Clean, contemporary design with bold section headers and visual hierarchy',
    features: ['Timeline-style experience', 'Skill rating bars', 'Color accents', 'Two-column layout'],
    bestFor: 'Tech, Creative, Startups',
    preview: 'modern',
    badgeClass: 'bg-blue-100 text-blue-700',
    recommended: true,
  },
];

export default function RecruiterReformatResumeStep2Template() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const parsedData = state?.parsedData;
  console.log('Received parsedData in Template step:', JSON.stringify(parsedData, null, 2)); 

  // Guard: no parsedData → back to upload
  useEffect(() => {
    if (!parsedData) navigate('/recruiter/reformat-resume/upload', { replace: true });
  }, []);

  const handleSelect = (templateId) => {
    navigate('/recruiter/reformat-resume/process', { state: { parsedData, templateId } });
  };

  const handleRemoveFile = () => {
    navigate('/recruiter/reformat-resume/upload', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FileType className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reformat Resume</h1>
            <p className="text-gray-600 mt-1">Transform resumes into ATS-optimized, professional formats with AI</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Parsed status bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {parsedData?.resumeData?.personalInfo?.name ?? 'Resume'} — parsed successfully
                </p>
                <p className="text-sm text-gray-600">Ready to apply a template</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layout className="w-6 h-6 text-violet-600" />
            Step 2: Choose a Template
          </h2>
          <p className="text-gray-600 mt-1">
            Select the format that best matches your industry and career level
          </p>
        </div>

        {/* Template grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleSelect(tpl.id)}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-violet-400 transition-all overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl"
            >
              {/* Mock preview */}
              <div className="relative h-48 bg-gray-50 border-b border-gray-200 overflow-hidden p-4">
                <RecruiterReformatResumeStep4TemplatePreview type={tpl.preview} />
                {tpl.recommended && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Recommended
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{tpl.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{tpl.description}</p>

                <div className="space-y-1.5 mb-4">
                  {tpl.features.slice(0, 3).map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${tpl.badgeClass}`}>
                    Best for: {tpl.bestFor}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleSelect(tpl.id); }}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  Select Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}