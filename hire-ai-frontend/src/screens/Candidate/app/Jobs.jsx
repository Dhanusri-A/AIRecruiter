'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CandidateJobCard from "../pages/CandidateJobCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

const mockJobs = [ /* your mock data remains the same */ ];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobType: "",
    industry: "",
    postedMethod: "",
  });

  const allJobs = mockJobs;

  const filteredJobs = allJobs.filter((job) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.companyName?.toLowerCase().includes(q) ||
      job.role?.toLowerCase().includes(q) ||
      job.jobDescription?.toLowerCase().includes(q) ||
      job.addressCity?.toLowerCase().includes(q);

    const matchesType = !filters.jobType || job.jobType === filters.jobType;
    const matchesInd = !filters.industry || job.industry === filters.industry;
    const matchesMethod = !filters.postedMethod || job.postedMethod === filters.postedMethod;

    return matchesSearch && matchesType && matchesInd && matchesMethod;
  });

  const industries = [...new Set(allJobs.map((j) => j.industry).filter(Boolean))];

  const activeFiltersCount = [
    filters.jobType,
    filters.industry,
    filters.postedMethod,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ jobType: "", industry: "", postedMethod: "" });
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Find Your Next Opportunity
        </h1>
        <p className="text-gray-600">
          Discover jobs that match your skills and goals
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm ${
            filterOpen || activeFiltersCount > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Job Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters((prev) => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">All Industries</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Source */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Job Source</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          postedMethod: prev.postedMethod === "public" ? "" : "public",
                        }))
                      }
                      className={`flex-1 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                        filters.postedMethod === "public"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Open Jobs
                    </button>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          postedMethod: prev.postedMethod === "private" ? "" : "private",
                        }))
                      }
                      className={`flex-1 px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                        filters.postedMethod === "private"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Company Jobs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
        </p>
      </div>

      {/* Job Cards */}
      <div className="grid gap-5 md:gap-6">
        {filteredJobs.map((job, i) => (
          <motion.div
            key={job.jobId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <CandidateJobCard job={job} index={i} />
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No jobs found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filter options
          </p>
          <button
            onClick={clearFilters}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}