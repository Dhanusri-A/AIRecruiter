"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecruiterCandidateCard from "../pages/RecruiterCandidateCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

const mockCandidates = [
  {
    candidateId: "c1",
    fullName: "Oscar Fernandas",
    title: "Full Stack Developer",
    email: "oscar.kumar.dev@gmail.com",
    phone: "+91 98765 43210",
    location: "Tiruppur, Tamil Nadu",
    experience: "3+ years",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    education: "B.Tech Computer Science",
    summary: "Passionate full-stack developer with expertise in building scalable web applications using modern technologies.",
    expectedSalary: [1200000, 1800000],
    availability: "Immediate",
  },
  {
    candidateId: "c2",
    fullName: "Priya Sharma",
    title: "UI/UX Designer",
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    location: "Bengaluru, Karnataka",
    experience: "5+ years",
    skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"],
    education: "M.Des Interaction Design",
    summary: "Creative designer focused on building intuitive and accessible user experiences for web and mobile platforms.",
    expectedSalary: [1500000, 2200000],
    availability: "2 weeks notice",
  },
  {
    candidateId: "c3",
    fullName: "Rahul Menon",
    title: "Backend Engineer",
    email: "rahul.menon@email.com",
    phone: "+91 76543 21098",
    location: "Chennai, Tamil Nadu",
    experience: "4+ years",
    skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
    education: "B.E Computer Science",
    summary: "Backend specialist with strong experience in building scalable APIs and microservices architecture.",
    expectedSalary: [1400000, 2000000],
    availability: "1 month notice",
  },
  {
    candidateId: "c4",
    fullName: "Ananya Reddy",
    title: "Data Analyst",
    email: "ananya.reddy@email.com",
    phone: "+91 65432 10987",
    location: "Hyderabad, Telangana",
    experience: "2+ years",
    skills: ["Python", "SQL", "Tableau", "Excel", "Power BI"],
    education: "M.Sc Statistics",
    summary: "Data-driven analyst skilled in extracting insights from complex datasets and creating compelling visualizations.",
    expectedSalary: [800000, 1200000],
    availability: "Immediate",
  },
];

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    experience: "",
    availability: "",
    skill: "",
  });

  const allCandidates = mockCandidates;

  const filteredCandidates = allCandidates.filter((candidate) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      candidate.fullName?.toLowerCase().includes(q) ||
      candidate.title?.toLowerCase().includes(q) ||
      candidate.location?.toLowerCase().includes(q) ||
      candidate.skills?.some((s) => s.toLowerCase().includes(q));

    const matchesExp = !filters.experience || candidate.experience.includes(filters.experience);
    const matchesAvail = !filters.availability || candidate.availability === filters.availability;
    const matchesSkill = !filters.skill || candidate.skills?.some((s) => s.toLowerCase().includes(filters.skill.toLowerCase()));

    return matchesSearch && matchesExp && matchesAvail && matchesSkill;
  });

  const activeFiltersCount = [
    filters.experience,
    filters.availability,
    filters.skill,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ experience: "", availability: "", skill: "" });
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Browse Candidates
        </h1>
        <p className="text-slate-500">
          Find the perfect talent for your organization
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates, skills, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
            filterOpen || activeFiltersCount > 0
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Experience */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Experience
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, experience: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Experience</option>
                    <option value="1+">1+ years</option>
                    <option value="2+">2+ years</option>
                    <option value="3+">3+ years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, availability: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Any Availability</option>
                    <option value="Immediate">Immediate</option>
                    <option value="2 weeks notice">2 weeks notice</option>
                    <option value="1 month notice">1 month notice</option>
                  </select>
                </div>

                {/* Skill */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Skill
                  </label>
                  <input
                    type="text"
                    value={filters.skill}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, skill: e.target.value }))
                    }
                    placeholder="e.g., React, Python"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-900">{filteredCandidates.length}</span> candidates
        </p>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid gap-4 md:gap-6">
        {filteredCandidates.map((candidate, i) => (
          <motion.div
            key={candidate.candidateId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <RecruiterCandidateCard candidate={candidate} index={i} />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-slate-200"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No candidates found
          </h3>
          <p className="text-slate-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
