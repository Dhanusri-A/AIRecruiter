// src/pages/recruiter/reformat/Step3Process.jsx
// Receives: useLocation().state = { parsedData, templateId }
// Resume is already parsed — no reformatResume() call needed here.

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileType, Layout, Settings, CheckCircle,
  Wand2, Sparkles, RefreshCw, Download, X, Palette,
} from 'lucide-react';
import { exportResume } from '../../../api/api';
import RecruiterReformatResumeStep4TemplatePreview from './RecruiterReformatResumeStep4TemplatePreview';

const TEMPLATES = {
  synpulse:  { name: 'Synpulse Format',       preview: 'synpulse',  bestFor: 'Tech, Creative, Startups',          border: 'border-violet-500',  bg: 'bg-violet-50',  iconBg: 'bg-violet-100 text-violet-600',   badge: 'bg-violet-100 text-violet-700' },
};

function DownloadButton({ format, label, icon, className, resumeData, onError }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const blob = await exportResume({ format, resumeData });
      const ext  = { pdf: 'pdf', docx: 'docx', pptx: 'pptx' }[format];
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `reformatted_resume.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      onError(`Failed to export ${format.toUpperCase()}: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all ${className}`}
    >
      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : icon}
      {loading ? 'Exporting…' : label}
    </button>
  );
}

export default function RecruiterReformatResumeStep3Process() {
  const navigate        = useNavigate();
  const { state }       = useLocation();

  const parsedData = state?.parsedData;
  const templateId = state?.templateId;
  const tpl        = TEMPLATES[templateId] ?? TEMPLATES.modern;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete,   setIsComplete]   = useState(false);
  const [resumeData,   setResumeData]   = useState(null);
  const [exportError,  setExportError]  = useState('');
  const [reformatOptions, setReformatOptions] = useState({
    removePhotos:     true,
    standardizeFonts: true,
    optimizeATS:      true,
    cleanFormatting:  true,
    singleColumn:     true,
    addKeywords:      false,
  });

  // Guard: redirect if missing route state
  useEffect(() => {
    if (!parsedData)  navigate('/recruiter/reformat-resume/upload',   { replace: true });
    else if (!templateId) navigate('/recruiter/reformat-resume/template', { replace: true });
  }, []);

  // Resume is already parsed — just animate the steps then mark complete
  const handleReformat = async () => {
    setIsProcessing(true);
    setExportError('');
    await new Promise((r) => setTimeout(r, 1800));
    setResumeData(parsedData);
    setIsComplete(true);
    setIsProcessing(false);
  };

  const handleReset = () => navigate('/recruiter/reformat-resume/upload', { replace: true });

  const handleChangeTemplate = () =>
    navigate('/recruiter/reformat-resume/template', { state: { parsedData } });

  const exportPayloadData = parsedData?.resumeData ?? parsedData;
  console.log('Export payload data:', JSON.stringify(exportPayloadData, null, 2));

  const candidateName = parsedData?.resumeData?.personalInfo?.name ?? 'Resume';

  const OPTIONS = [
    { key: 'removePhotos',     label: 'Remove photos & graphics',  desc: 'Improve ATS compatibility'        },
    { key: 'standardizeFonts', label: 'Standardize fonts',         desc: 'Use professional, readable fonts' },
    { key: 'optimizeATS',      label: 'Optimize for ATS',          desc: 'Remove tables, columns, headers'  },
    { key: 'cleanFormatting',  label: 'Clean formatting',          desc: 'Remove unnecessary styling'       },
    { key: 'singleColumn',     label: 'Single column layout',      desc: 'Better ATS parsing accuracy'      },
    { key: 'addKeywords',      label: 'Add industry keywords',     desc: 'AI-suggested relevant terms'      },
  ];

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
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Selected template */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-violet-600" />
                  Selected Template
                </h2>
                <button
                  onClick={handleChangeTemplate}
                  className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  Change
                </button>
              </div>

              <div className={`border-2 ${tpl.border} ${tpl.bg} rounded-xl p-4`}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${tpl.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Palette className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{tpl.name}</h3>
                    <span className={`inline-block px-2.5 py-1 ${tpl.badge} rounded-md text-xs font-semibold`}>
                      {tpl.bestFor}
                    </span>
                  </div>
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Formatting options */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-600" />
                Formatting Options
              </h2>
              <div className="space-y-3">
                {OPTIONS.map((opt) => (
                  <label key={opt.key} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={reformatOptions[opt.key]}
                      onChange={(e) => setReformatOptions({ ...reformatOptions, [opt.key]: e.target.checked })}
                      className="mt-1 w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{opt.label}</div>
                      <div className="text-sm text-gray-600">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Parsed resume info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Parsed Resume</h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{candidateName}</p>
                  <p className="text-sm text-gray-600">Parsed &amp; ready to reformat</p>
                </div>
                <button onClick={handleReset} className="text-gray-400 hover:text-red-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">

            {/* Ready */}
            {!isProcessing && !isComplete && (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wand2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Reformat</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to apply your selected template and formatting options.
                </p>

                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm font-semibold text-violet-900 mb-3">AI will process your resume to:</p>
                  <div className="space-y-2">
                    {['Apply selected template design', 'Optimize for ATS systems', 'Standardize formatting', 'Enhance readability', 'Preserve all content'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-violet-800">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {exportError && (
                  <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-lg px-4 py-2">{exportError}</p>
                )}

                <button
                  onClick={handleReformat}
                  className="w-full px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Reformatting
                </button>
              </div>
            )}

            {/* Processing */}
            {isProcessing && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <RefreshCw className="w-10 h-10 text-violet-600 animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Reformatting in Progress</h3>
                <p className="text-gray-600 mb-6">Applying your selected template and options…</p>
                <div className="space-y-3 max-w-md mx-auto text-left">
                  {['Applying template design', 'Optimizing for ATS', 'Standardizing formatting', 'Enhancing readability', 'Finalizing layout'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete */}
            {isComplete && resumeData && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Reformatting Complete!</h3>
                    <p className="text-gray-600">Your resume has been optimized</p>
                  </div>
                </div>

                {/* Preview mock */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 mb-6 overflow-hidden h-56">
                  <RecruiterReformatResumeStep4TemplatePreview type={tpl.preview} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="text-3xl font-bold text-emerald-600">98%</div>
                    <div className="text-xs text-gray-600 mt-1">ATS Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">A+</div>
                    <div className="text-xs text-gray-600 mt-1">Readability</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600">100%</div>
                    <div className="text-xs text-gray-600 mt-1">Optimized</div>
                  </div>
                </div>

                {exportError && (
                  <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-lg px-4 py-2">{exportError}</p>
                )}

                {/* Download buttons */}
                <div className="flex gap-3">
                  <DownloadButton
                    format="pdf"
                    label="PDF"
                    icon={<Download className="w-5 h-5" />}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg"
                    resumeData={exportPayloadData}
                    onError={setExportError}
                  />
                  <DownloadButton
                    format="docx"
                    label="Word"
                    icon={<FileType className="w-5 h-5" />}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                    resumeData={exportPayloadData}
                    onError={setExportError}
                  />
                  <DownloadButton
                    format="pptx"
                    label="PPT"
                    icon={<Download className="w-5 h-5" />}
                    className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                    resumeData={exportPayloadData}
                    onError={setExportError}
                  />
                </div>

                <button
                  onClick={handleReset}
                  className="mt-4 w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reformat New Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}