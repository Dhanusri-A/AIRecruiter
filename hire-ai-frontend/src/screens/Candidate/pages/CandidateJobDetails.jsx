"use client";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  IndianRupee,
  MapPin,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  Building2,
  Clock,
  Bookmark,
  Share2,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CandidateJobDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const job = state?.job;
  const [isSaved, setIsSaved] = useState(false);

  if (!job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-[#1A2342] rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            No Job Selected
          </h2>
          <p className="text-gray-400 mb-6">
            Please go back and select a job to view its details.
          </p>
          <button
            onClick={() => navigate("/candidate")}
            className="px-6 py-3 bg-gradient-to-r from-[#2B7FFF] to-[#1E90FF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2B7FFF]/25 transition-all"
          >
            Back to Jobs
          </button>
        </motion.div>
      </div>
    );
  }

  const formatSalary = (range) => {
    if (!Array.isArray(range) || range.length !== 2 || !range[0] || !range[1]) {
      return "Not specified";
    }
    const [min, max] = range;
    return `${(min / 100000).toFixed(1)}L - ${(max / 100000).toFixed(1)}L per annum`;
  };

  const jobTypeColors = {
    "Full-time": "bg-emerald-900/30 text-emerald-400 border-emerald-700/50",
    "Part-time": "bg-amber-900/30 text-amber-400 border-amber-700/50",
    Contract: "bg-blue-900/30 text-blue-400 border-blue-700/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium mb-6 group transition-colors"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Jobs
      </button>

      {/* Main Card */}
      <div className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A0E27] to-[#151B35] px-6 py-8 md:px-8 md:py-10 border-b border-[#1E2A4A]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#1A2342] to-[#2A3A5A] backdrop-blur flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <div>
                <p className="text-[#10B981] font-medium mb-1">
                  {job.postedMethod === "public" ? "Open Position" : job.companyName}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {job.role}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${
                      jobTypeColors[job.jobType] || "bg-slate-700/30 text-slate-300 border-slate-600/50"
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-1.5" />
                    {job.jobType || "Not specified"}
                  </span>
                  {job.industry && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-[#1A2342] text-gray-300 border border-[#2A3A5A]">
                      {job.industry}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-xl transition-all ${
                  isSaved
                    ? "bg-gradient-to-r from-[#2B7FFF] to-[#1E90FF] text-white"
                    : "bg-[#1A2342] text-gray-300 hover:bg-[#1E2A4A]"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
              <button className="p-3 rounded-xl bg-[#1A2342] text-gray-300 hover:bg-[#1E2A4A] transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {job.salaryRange && (
              <div className="flex items-center gap-4 p-4 bg-[#1A2342] border border-[#2A3A5A] rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-900/30 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Salary Range</p>
                  <p className="font-semibold text-white">
                    {formatSalary(job.salaryRange)}
                  </p>
                </div>
              </div>
            )}

            {(job.location || job.addressCity) && (
              <div className="flex items-center gap-4 p-4 bg-[#1A2342] border border-[#2A3A5A] rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-semibold text-white">
                    {job.location || `${job.addressCity}, ${job.addressState}`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 bg-[#1A2342] border border-[#2A3A5A] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Job Type</p>
                <p className="font-semibold text-white">
                  {job.jobType || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-400" />
              Job Description
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {job.description ||
                job.jobDescription ||
                "No detailed description available."}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Key Requirements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.requirements.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-[#1A2342] border border-[#2A3A5A] rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(job.email || job.phone || job.website) && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                {job.email && (
                  <a
                    href={`mailto:${job.email}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-[#2B7FFF] transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    {job.email}
                  </a>
                )}
                {job.phone && (
                  <a
                    href={`tel:${job.phone}`}
                    className="flex items-center gap-3 text-gray-300 hover:text-[#2B7FFF] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {job.phone}
                  </a>
                )}
                {job.website && (
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 hover:text-[#2B7FFF] transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    {job.website}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-4 border-t border-[#1E2A4A]">
            <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#2B7FFF] to-[#1E90FF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2B7FFF]/25 transition-all">
              Apply for this position
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}