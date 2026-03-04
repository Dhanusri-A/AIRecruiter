import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Layers,
  RefreshCw,
  Copy,
  FileText,
  CheckCircle2,
  Code,
  ListChecks,
  Gift,
} from "lucide-react";

export default function RecruiterJobDetails() {
  const { state: job } = useLocation();
  const navigate = useNavigate();

  if (!job) {
    navigate("/recruiter/jobs");
    return null;
  }

  const {
    job_title,
    company_name,
    location,
    level,
    skills,
    output_description = {},
  } = job;

  const {
    about_the_role,
    key_responsibilities,
    qualities_and_requirements,
    benefits_and_perks,
  } = output_description;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {job_title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building2 size={16} />
                {company_name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Layers size={16} />
                {level}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 size={16} />
                Active JD
              </span>
            </div>
          </div>
        </div>

        {/* Main JD Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* About the Role */}
          <Section
            title="About the Role"
            content={about_the_role}
          />

          {/* Skills */}
          <Section
            title="Skills"
            icon={<Code size={18} />}
            content={skills}
          />

          {/* Key Responsibilities */}
          <ListSection
            title="Key Responsibilities"
            items={key_responsibilities}
          />

          {/* Qualifications & Requirements */}
          <ListSection
            title="Qualifications & Requirements"
            items={qualities_and_requirements}
          />

          {/* Benefits */}
          <ListSection
            title="Benefits & Perks"
            items={benefits_and_perks}
            isLast
          />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Sections ───────────────────────── */

const Section = ({ title, content, icon }) => (
  <div className="p-6 md:p-8 border-b border-gray-200 last:border-b-0">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <ActionIcons />
    </div>

    <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed">
      <p>{content || "No information available."}</p>
    </div>
  </div>
);

const ListSection = ({ title, items = [], isLast }) => (
  <div
    className={`p-6 md:p-8 ${
      isLast ? "" : "border-b border-gray-200"
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {title}
      </h2>
      <ActionIcons />
    </div>

    <ol className="list-decimal pl-6 space-y-3 text-gray-700">
      {items?.length ? (
        items.map((item, idx) => (
          <li key={idx} className="pl-2">
            {item}
          </li>
        ))
      ) : (
        <li>No data provided.</li>
      )}
    </ol>

    {isLast && (
      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
        <FileText size={16} />
        ATS Optimized
      </div>
    )}
  </div>
);

const ActionIcons = () => (
  <div className="flex gap-3">
    <button className="text-gray-500 hover:text-emerald-600 transition">
      <RefreshCw size={18} />
    </button>
    <button className="text-gray-500 hover:text-emerald-600 transition">
      <Copy size={18} />
    </button>
  </div>
);
