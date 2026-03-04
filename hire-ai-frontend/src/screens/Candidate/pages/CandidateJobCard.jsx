"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  IndianRupee,
  MapPin,
  ChevronRight,
  Building2,
  Clock,
  Bookmark,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CandidateJobCard({ job, index }) {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatSalary = (range) => {
    if (!Array.isArray(range) || range.length !== 2) return "Not specified";
    const [min, max] = range;
    return `${(min / 100000).toFixed(1)}L - ${(max / 100000).toFixed(1)}L`;
  };

  const truncate = (text = "", max = 140) =>
    text.length > max ? text.slice(0, max - 3) + "..." : text;

  const jobTypeColors = {
    "Full-time": "bg-emerald-900/30 text-emerald-400 border-emerald-700/50",
    "Part-time": "bg-amber-900/30 text-amber-400 border-amber-700/50",
    Contract: "bg-blue-900/30 text-blue-400 border-blue-700/50",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] p-5 md:p-6 hover:shadow-lg hover:shadow-[#2B7FFF]/10 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          {/* Company Logo Placeholder */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#1A2342] to-[#2A3A5A] flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 md:w-7 md:h-7 text-gray-400" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-400 mb-1">
              {job.postedMethod === "public" ? "Open Position" : job.companyName}
            </p>
            <h3 className="text-lg md:text-xl font-semibold text-white leading-tight">
              {job.role}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${jobTypeColors[job.jobType] || "bg-slate-700/30 text-slate-300 border-slate-600/50"
                  }`}
              >
                <Clock className="w-3 h-3 mr-1" />
                {job.jobType}
              </span>
              {job.industry && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1A2342] text-gray-300 border border-[#2A3A5A]">
                  {job.industry}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2.5 rounded-xl transition-all ${isSaved
              ? "bg-blue-900/30 text-[#2B7FFF]"
              : "bg-[#1A2342] text-gray-400 hover:bg-[#1E2A4A] hover:text-gray-300"
            }`}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          {truncate(
            job.description || job.jobDescription || "No description provided",
            showMore ? 1000 : 140
          )}
        </p>
        {(job.description || job.jobDescription || "").length > 140 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-[#2B7FFF] hover:text-[#10B981] text-sm font-medium mt-1 transition-colors"
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        {job.salaryRange && (
          <div className="flex items-center gap-1.5 text-gray-300">
            <IndianRupee className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{formatSalary(job.salaryRange)}</span>
          </div>
        )}
        {(job.location || job.addressCity) && (
          <div className="flex items-center gap-1.5 text-gray-300">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{job.location || `${job.addressCity}, ${job.addressState}`}</span>
          </div>
        )}
      </div>

      {/* Requirements Preview */}
      {job.requirements?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements.slice(0, 4).map((req, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-[#1A2342] text-gray-300 rounded-lg text-xs font-medium border border-[#2A3A5A]"
            >
              {req}
            </span>
          ))}
          {job.requirements.length > 4 && (
            <span className="px-3 py-1 bg-[#1A2342] text-gray-400 rounded-lg text-xs font-medium border border-[#2A3A5A]">
              +{job.requirements.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E2A4A]">
        <span className="text-xs text-gray-400">
          {job.requirements?.length || 0} requirement
          {job.requirements?.length !== 1 ? "s" : ""}
        </span>

        <button
          onClick={() =>
            navigate(`/candidate/job-details/${job.id || job.jobId}`, {
              state: { job },
            })
          }
          className="inline-flex items-center gap-1.5 text-[#2B7FFF] hover:text-[#10B981] font-semibold text-sm group transition-colors"
        >
          View Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}