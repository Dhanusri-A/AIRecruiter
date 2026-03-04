import React, { useState } from "react";
import {
  Sparkles,
  Rocket,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Users,
  ListChecks,
  FileText,
  Loader2,
} from "lucide-react";
import { createJobDescription } from "../../../api/api";
import { useNavigate } from "react-router-dom";

const RecruiterGenerateJD = ({
  mode = "create",
  initialData,
  onSubmit,
  jobId,
}) => {
  const navigate = useNavigate();
const [formData, setFormData] = useState(
  initialData || {
    jobTitle: "",
    companyName: "",
    industry: "",
    location: "",
    experienceLevel: "",
    tone: "Professional",
    skills: "",
    responsibilities: "",
    additionalContext: "",
  }
);


  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const toneOptions = [
    "Professional",
    "Engaging",
    "Casual",
    "Inclusive",
    "Dynamic",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToneSelect = (tone) => {
    setFormData((prev) => ({ ...prev, tone }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsGenerating(true);

  const payload = {
    job_title: formData.jobTitle.trim(),
    company_name: formData.companyName,
    department: formData.industry,
    location: formData.location,
    level: formData.experienceLevel,
    tone_style: formData.tone,
    skills: formData.skills,
    responsibilities: formData.responsibilities,
    additional_data: formData.additionalContext,
    input_description: [
      formData.jobTitle,
      formData.responsibilities,
      formData.skills,
      formData.additionalContext,
    ].filter(Boolean).join("\n\n"),
  };

  try {
    if (mode === "edit") {
      await onSubmit(payload);
    } else {
      const response = await createJobDescription(payload);
      navigate("/recruiter/show-jd", {
        state: { generatedJob: response },
      });
    }
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <main className="container mx-auto px-6 py-6 md:py-2 max-w-4xl">
      {/* AI Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-800 rounded-full text-sm font-semibold border border-emerald-200">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Job Description Generator</span>
        </div>
      </div>

      {/* Main Heading */}
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Create Your Perfect Job Description
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          Answer a few questions and let AI craft an optimized, inclusive JD in
          seconds
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                list="jobTitleSuggestions"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <datalist id="jobTitleSuggestions">
              <option value="Software Engineer" />
              <option value="Product Manager" />
              <option value="Data Scientist" />
              <option value="UX Designer" />
              <option value="Sales Manager" />
              <option value="Marketing Specialist" />
              <option value="Frontend Developer" />
              <option value="Backend Developer" />
              <option value="Full Stack Developer" />
              <option value="DevOps Engineer" />
              <option value="Business Analyst" />
              <option value="Project Manager" />
              <option value="Content Writer" />
              <option value="Graphic Designer" />
              <option value="HR Manager" />
              <option value="Financial Analyst" />
              <option value="Customer Success Manager" />
              <option value="QA Engineer" />
            </datalist>
          </div>

          {/* Company & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Industry / Department
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 bg-white"
              >
                <option value="">Select Industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="sales">Sales</option>
                <option value="operations">Operations</option>
                <option value="hr">HR</option>
                <option value="customer_success">Customer Success</option>
              </select>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, New York, Hybrid"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="experienceLevel"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Experience Level
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 bg-white appearance-none"
                >
                  <option value="">Select level</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (5-10 years)</option>
                  <option value="lead">Lead / Principal (10+ years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tone & Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Tone & Style
            </label>
            <div className="flex flex-wrap gap-2.5">
              {toneOptions.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => handleToneSelect(tone)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm border ${
                    formData.tone === tone
                      ? "bg-emerald-50 text-emerald-700 border-emerald-600 shadow-sm"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Key Skills */}
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Key Skills & Technologies
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., React, Python, Leadership, Communication"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Comma-separated or bullet points work great
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <label
              htmlFor="responsibilities"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Key Responsibilities{" "}
              <span className="text-gray-500 font-normal text-sm">
                (Optional)
              </span>
            </label>
            <div className="relative">
              <ListChecks className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                placeholder="Paste existing notes or bullet points about what this person will do..."
                rows={5}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <label
              htmlFor="additionalContext"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Additional Context
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="additionalContext"
                name="additionalContext"
                value={formData.additionalContext}
                onChange={handleInputChange}
                placeholder="Any special requirements? (e.g., Emphasize diversity, Remote-first culture, Include growth opportunities)"
                rows={4}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isGenerating || !formData.jobTitle.trim()}
              className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 
                       text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg transition-all duration-300 
                       flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed 
                       hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  {mode === "edit" ? "Update Job Description" : "Generate Job Description with AI"}
                </>
              )}
            </button>

            {error && <p className="text-red-600 text-center mt-4">{error}</p>}

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <Rocket className="h-4 w-4 text-emerald-600" />
              <span>
                Generation takes ~2-3 seconds • Fully editable after creation
              </span>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RecruiterGenerateJD;
