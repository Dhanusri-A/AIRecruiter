"use client";
import { motion } from "framer-motion";
import CandidateJobCard from "./CandidateJobCard";
import { Bookmark, Search } from "lucide-react";

const mockSaved = [
  {
    id: "s1",
    job: {
      id: "job-002",
      companyName: "GreenWave Energy",
      role: "Solar Project Engineer",
      jobType: "Contract",
      industry: "Renewable Energy",
      postedMethod: "public",
      description: "Design and execution of large-scale solar projects...",
      jobDescription: "Design and execution of large-scale solar projects with focus on optimization and efficiency.",
      salaryRange: [800000, 1200000],
      location: "Coimbatore, Tamil Nadu",
      requirements: ["AutoCAD", "PVsyst", "Project Management"],
    },
  },
  {
    id: "s2",
    job: {
      id: "job-004",
      companyName: "FinSecure India",
      role: "Junior Data Analyst",
      jobType: "Full-time",
      industry: "Financial Services",
      postedMethod: "private",
      description: "Analyze financial datasets and create insightful reports...",
      jobDescription: "Analyze financial datasets and create insightful reports for business decisions.",
      salaryRange: [500000, 900000],
      location: "Chennai, Tamil Nadu",
      requirements: ["SQL", "Excel", "Python", "Data Visualization"],
    },
  },
];

export default function CandidateSavedJobs() {
  if (mockSaved.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <Bookmark className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            No saved jobs yet
          </h2>
          <p className="text-slate-500 mb-6">
            Save jobs you're interested in to review them later
          </p>
          <a
            href="/candidate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-slate-500 mt-1">
            {mockSaved.length} job{mockSaved.length !== 1 ? "s" : ""} saved for later
          </p>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid gap-4 md:gap-6">
        {mockSaved.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <CandidateJobCard job={item.job} index={idx} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
