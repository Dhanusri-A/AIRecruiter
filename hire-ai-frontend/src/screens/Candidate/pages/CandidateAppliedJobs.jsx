"use client";
import { motion } from "framer-motion";
import CandidateJobCard from "./CandidateJobCard";
import { CheckSquare, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const mockApplied = [
  {
    id: "a1",
    job: {
      id: "job-001",
      companyName: "TechNova Solutions",
      role: "Senior React Developer",
      jobType: "Full-time",
      industry: "Information Technology",
      postedMethod: "private",
      description: "Looking for experienced React developer...",
      jobDescription: "Looking for experienced React developer to join our team and build scalable applications.",
      salaryRange: [1200000, 1800000],
      location: "Bengaluru, Karnataka",
      requirements: ["React", "TypeScript", "Redux", "5+ years experience"],
    },
    appliedDate: "2025-11-15",
    status: "Under Review",
  },
  {
    id: "a2",
    job: {
      id: "job-003",
      companyName: "EduFuture Academy",
      role: "Technical Content Writer",
      jobType: "Part-time",
      industry: "Education Technology",
      postedMethod: "private",
      description: "Create high-quality programming tutorials...",
      jobDescription: "Create high-quality programming tutorials and educational content for learners worldwide.",
      salaryRange: [400000, 700000],
      location: "Remote",
      requirements: ["Technical writing", "Programming", "SEO"],
    },
    appliedDate: "2025-12-02",
    status: "Shortlisted",
  },
];

const statusConfig = {
  "Under Review": {
    icon: Clock,
    color: "bg-amber-900/30 text-amber-400 border-amber-700/50",
    iconColor: "text-amber-400",
  },
  Shortlisted: {
    icon: CheckCircle,
    color: "bg-emerald-900/30 text-emerald-400 border-emerald-700/50",
    iconColor: "text-emerald-400",
  },
  Rejected: {
    icon: XCircle,
    color: "bg-red-900/30 text-red-400 border-red-700/50",
    iconColor: "text-red-400",
  },
  Pending: {
    icon: AlertCircle,
    color: "bg-slate-700/30 text-slate-300 border-slate-600/50",
    iconColor: "text-slate-400",
  },
};

export default function CandidateAppliedJobs() {
  if (mockApplied.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#1A2342] rounded-full flex items-center justify-center">
            <CheckSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            No applications yet
          </h2>
          <p className="text-gray-400 mb-6">
            Start applying to jobs to track your progress here
          </p>
          <a
            href="/candidate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2B7FFF] to-[#1E90FF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#2B7FFF]/25 transition-all"
          >
            <Search className="w-4 h-4" />
            Browse Jobs
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
            Applied Jobs
          </h1>
          <p className="text-gray-400 mt-1">
            Track status of your {mockApplied.length} application
            {mockApplied.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#151B35] rounded-xl border border-[#1E2A4A] p-4">
          <p className="text-2xl font-bold text-white">{mockApplied.length}</p>
          <p className="text-sm text-gray-400">Total Applied</p>
        </div>
        <div className="bg-[#151B35] rounded-xl border border-[#1E2A4A] p-4">
          <p className="text-2xl font-bold text-amber-400">
            {mockApplied.filter((a) => a.status === "Under Review").length}
          </p>
          <p className="text-sm text-gray-400">Under Review</p>
        </div>
        <div className="bg-[#151B35] rounded-xl border border-[#1E2A4A] p-4">
          <p className="text-2xl font-bold text-emerald-400">
            {mockApplied.filter((a) => a.status === "Shortlisted").length}
          </p>
          <p className="text-sm text-gray-400">Shortlisted</p>
        </div>
        <div className="bg-[#151B35] rounded-xl border border-[#1E2A4A] p-4">
          <p className="text-2xl font-bold text-red-400">
            {mockApplied.filter((a) => a.status === "Rejected").length}
          </p>
          <p className="text-sm text-gray-400">Rejected</p>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid gap-4 md:gap-6">
        {mockApplied.map((item, idx) => {
          const status = statusConfig[item.status] || statusConfig.Pending;
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              <CandidateJobCard job={item.job} index={idx} />

              {/* Status Badge Overlay */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border backdrop-blur-sm ${status.color}`}
                >
                  <StatusIcon className={`w-4 h-4 ${status.iconColor}`} />
                  {item.status}
                </div>
              </div>

              {/* Applied Date */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                <p className="text-xs text-gray-400">
                  Applied on{" "}
                  <span className="font-medium text-gray-300">
                    {new Date(item.appliedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}