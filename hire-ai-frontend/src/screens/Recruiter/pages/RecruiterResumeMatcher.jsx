// screens/Recruiter/pages/RecruiterResumeMatcher.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Sparkles,
  X,
  FileText,
  Briefcase,
  Building2,
  MapPin,
  Search,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { getRecruiterJobs, matchResumesToJob } from "../../../api/api";

import { useAuth } from "../../../context/AuthContext";

export function RecruiterResumeMatcher() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedJD, setSelectedJD] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  // Modal states
  const [showJDModal, setShowJDModal] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (showJDModal && allJobs.length === 0 && user?.id) {
      const fetchJobs = async () => {
        setLoadingJobs(true);
        try {
          const data = await getRecruiterJobs(user.id, { skip: 0, limit: 100 });
          setAllJobs(data || []);
        } catch (err) {
          console.error("Failed to load jobs:", err);
        } finally {
          setLoadingJobs(false);
        }
      };
      fetchJobs();
    }
  }, [showJDModal, user?.id]);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return allJobs;
    const q = searchQuery.toLowerCase().trim();
    return allJobs.filter((job) =>
      [
        job.job_title,
        job.company_name,
        job.location,
        job.department,
        job.level,
        job.input_description,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q)),
    );
  }, [allJobs, searchQuery]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        [".pdf", ".doc", ".docx"].some((ext) =>
          file.name.toLowerCase().endsWith(ext),
        ),
      );
      if (files.length + uploadedFiles.length > 10) {
        alert("Maximum 10 resumes allowed");
        return;
      }
      setUploadedFiles((prev) => [...prev, ...files]);
    },
    [uploadedFiles],
  );

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedFiles.length > 10) {
      alert("Maximum 10 resumes allowed");
      return;
    }
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMatch = async () => {
    if (!selectedJD || uploadedFiles.length === 0) {
      alert("Please select a job description and upload at least one resume");
      return;
    }

    setIsMatching(true);

    try {
      const result = await matchResumesToJob(selectedJD.id, uploadedFiles);

      // Navigate to results page with the data
      navigate("/recruiter/resume-match/results", {
        state: {
          matchResults: result,
          selectedJob: selectedJD,
          resumeCount: uploadedFiles.length,
        },
      });
    } catch (error) {
      console.error("Matching failed:", error);
      // alert(error.message || "Failed to match resumes. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-emerald-50/30 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Resume Matching
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Match Resumes to Jobs
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Select a job and upload resumes to find the best matches
          </p>
        </div>

        <div className="space-y-8">
          {/* Job Selection */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              Select Job Description
            </h2>

            {selectedJD ? (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-5 relative">
                <button
                  onClick={() => setSelectedJD(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors"
                  title="Remove selection"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Briefcase className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {selectedJD.job_title || "No title"}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        {selectedJD.company_name || "—"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {selectedJD.location || "—"}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {selectedJD.input_description || "No description"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowJDModal(true)}
                  className="mt-4 text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                >
                  Change Job
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowJDModal(true)}
                className="w-full py-5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 text-base"
              >
                <Briefcase className="w-5 h-5" />
                Select Job Description
              </button>
            )}
          </div>

          {/* Resume Upload */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
              <Upload className="w-6 h-6 text-emerald-600" />
              Upload Resumes (Max 10)
            </h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/70"
                  : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50/40"
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-600 mb-5">PDF, DOC, DOCX • Max 10 files</p>
              <input
                type="file"
                id="resumeUpload"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
              <label
                htmlFor="resumeUpload"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium cursor-pointer shadow-sm hover:shadow transition-all"
              >
                <Upload className="w-5 h-5" />
                Browse Files
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    Uploaded ({uploadedFiles.length}/10)
                  </h3>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Match Button */}
          <button
            onClick={handleMatch}
            disabled={!selectedJD || uploadedFiles.length === 0 || isMatching}
            className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all ${
              selectedJD && uploadedFiles.length > 0 && !isMatching
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg active:scale-95"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isMatching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Matching Resumes...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Match Resumes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Job Selection Modal */}
      {showJDModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-emerald-600 text-white flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2.5">
                <Briefcase className="w-6 h-6" />
                Select Job Description
              </h2>
              <button
                onClick={() => setShowJDModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 bg-white ">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search job title, company, location..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Job List */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
              {loadingJobs ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                  <p className="text-gray-600">Loading jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery ? "No matching jobs" : "No jobs found"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? "Try different keywords"
                      : "Create a job first"}
                  </p>
                  <button
                    onClick={() => {
                      setShowJDModal(false);
                      navigate("/recruiter/generate-jd");
                    }}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium inline-flex items-center gap-2 transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create New Job
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJD(job);
                        setShowJDModal(false);
                        setSearchQuery("");
                      }}
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${
                        selectedJD?.id === job.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {job.job_title || "No title"}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          {job.company_name || "—"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {job.location || "—"}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {job.input_description || "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowJDModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowJDModal(false);
                  navigate("/recruiter/generate-jd");
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                New Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}