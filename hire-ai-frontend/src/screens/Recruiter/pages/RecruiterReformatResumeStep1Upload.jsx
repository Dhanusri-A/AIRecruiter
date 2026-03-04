// src/pages/recruiter/reformat/Step1Upload.jsx
// Parses the resume on "Continue" and passes parsedData (not the File) to Step 2.
// navigate('/recruiter/reformat-resume/template', { state: { parsedData } })

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileText, AlertCircle, FileType,
  Target, Sparkles, Zap, Award, RefreshCw,
} from 'lucide-react';
import { reformatResume } from '../../../api/api';

export default function RecruiterReformatResumeStep1Upload() {
  const navigate  = useNavigate();
  const inputRef  = useRef(null);
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleFile = (f) => { if (f) { setFile(f); setError(''); } };

  const handleContinue = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const parsedData = await reformatResume(file);
      navigate('/recruiter/reformat-resume/template', { state: { parsedData } });
    } catch (err) {
      setError(err.message || 'Failed to parse resume. Please try again.');
    } finally {
      setLoading(false);
    }
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

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Upload className="w-6 h-6 text-violet-600" />
            Step 1: Upload Resume
          </h2>
          <p className="text-gray-600 mb-6">Upload the resume you want to reformat</p>

          {/* Drop zone */}
          {!file ? (
            <label className="block cursor-pointer">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-all"
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-semibold text-lg mb-2">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOCX, DOC, PPT, PPTX • Max 10MB
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          ) : (
            <div className="border-2 border-violet-200 bg-violet-50 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                  <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  onClick={() => { setFile(null); setError(''); }}
                  disabled={loading}
                  className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="mt-3 text-sm text-violet-600 underline underline-offset-2 disabled:opacity-40"
              >
                Choose a different file
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          {/* Benefits */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {[
              { icon: Target,   text: 'ATS-optimized formatting', bg: 'bg-emerald-100', color: 'text-emerald-600' },
              { icon: Sparkles, text: 'Professional templates',   bg: 'bg-blue-100',    color: 'text-blue-600'    },
              { icon: Zap,      text: 'Instant AI processing',    bg: 'bg-purple-100',  color: 'text-purple-600'  },
              { icon: Award,    text: 'Industry best practices',  bg: 'bg-orange-100',  color: 'text-orange-600'  },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 ${b.bg} rounded-lg flex items-center justify-center`}>
                  <b.icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <span className="text-gray-700 font-medium">{b.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          {file && (
            <button
              onClick={handleContinue}
              disabled={loading}
              className="mt-8 w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? <><RefreshCw className="w-5 h-5 animate-spin" /> Parsing Resume…</>
                : <><Sparkles className="w-5 h-5" /> Continue to Choose Template</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}