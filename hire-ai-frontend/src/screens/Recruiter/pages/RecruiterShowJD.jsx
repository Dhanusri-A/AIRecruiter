// src/pages/ShowJd.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Copy,
  RefreshCw,
  Download,
  Save,
  Plus,
  FileText,
  CheckCircle2,
} from "lucide-react";

const RecruiterShowJd = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Get the data passed via navigation state
  const jobData = state?.generatedJob;

  // If no data was passed → redirect back to generator
  if (!jobData) {
    navigate("/show-jd");
    return null;
  }

  const {
    job_title,
    company_name,
    output_description = {},
    ats_score = 94,           // fallback if not present
    inclusivity_score = 93,   // fallback if not present
  } = jobData;

  const { about_the_role, key_responsibilities, qualities_and_requirements } =
    output_description;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job_title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
              <span className="text-gray-600">~250 words</span>
              <span className="text-gray-600">Readability: 97%</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 size={16} /> ATS Score: {ats_score}%
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 size={16} /> Inclusive: {inclusivity_score}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={()=>{navigate('/recruiter/generate-jd')
            }}
            >
              <Plus size={18} /> New JD
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={18} /> Export
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
            onClick={()=>{
              navigate('/recruiter/my-jobs')
            }}
            >
              <Save size={18} /> Save JD
            </button>
          </div>
        </div>

        {/* Main JD Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* About the Role */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">About the Role</h2>
              <div className="flex gap-3">
                <button className="text-gray-500 hover:text-emerald-600">
                  <RefreshCw size={18} />
                </button>
                <button className="text-gray-500 hover:text-emerald-600">
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed">
              <p>{about_the_role || "No description available."}</p>
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Key Responsibilities
              </h2>
              <div className="flex gap-3">
                <button className="text-gray-500 hover:text-emerald-600">
                  <RefreshCw size={18} />
                </button>
                <button className="text-gray-500 hover:text-emerald-600">
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              {key_responsibilities?.length ? (
                key_responsibilities.map((item, idx) => (
                  <li key={idx} className="pl-2">
                    {item}
                  </li>
                ))
              ) : (
                <li>No responsibilities provided.</li>
              )}
            </ol>
          </div>

          {/* Qualifications & Requirements */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Qualifications & Requirements
              </h2>
              <div className="flex gap-3">
                <button className="text-gray-500 hover:text-emerald-600">
                  <RefreshCw size={18} />
                </button>
                <button className="text-gray-500 hover:text-emerald-600">
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              {qualities_and_requirements?.length ? (
                qualities_and_requirements.map((item, idx) => (
                  <li key={idx} className="pl-2">
                    {item}
                  </li>
                ))
              ) : (
                <li>No qualifications listed.</li>
              )}
            </ol>

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
              <FileText size={16} />
              ATS Optimized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterShowJd;