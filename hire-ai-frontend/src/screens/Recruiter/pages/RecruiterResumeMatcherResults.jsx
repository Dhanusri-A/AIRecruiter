"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Sparkles,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Download,
  Filter,
  ChevronRight,
  X,
  AlertCircle,
  Building2,
  MapPin,
} from "lucide-react";

export function RecruiterResumeMatcherResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const { matchResults, selectedJob, resumeCount } = location.state || {};

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sortBy, setSortBy] = useState("score");
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [candidateStatuses, setCandidateStatuses] = useState({});

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCandidate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedCandidate]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelectedCandidate(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!matchResults || !selectedJob) {
    navigate("/recruiter/resume-matcher");
    return null;
  }

  const matches = matchResults.matches || [];

  const rankedMatches = useMemo(() => {
    return matches
      .map((match, index) => ({
        ...match,
        id: `candidate-${index}`,
        status: candidateStatuses[`candidate-${index}`] || null,
      }))
      .sort((a, b) => b.overall_match - a.overall_match)
      .map((match, index) => ({ ...match, rank: index + 1 }));
  }, [matches, candidateStatuses]);

  const filteredSortedCandidates = useMemo(() => {
    let filtered = rankedMatches.filter((c) => c.overall_match >= filterMinScore);
    if (sortBy === "score") filtered.sort((a, b) => b.overall_match - a.overall_match);
    else if (sortBy === "experience") filtered.sort((a, b) => b.years_of_experience - a.years_of_experience);
    return filtered;
  }, [rankedMatches, filterMinScore, sortBy]);

  const shortlistedCount = Object.values(candidateStatuses).filter((s) => s === "shortlist").length;
  const rejectedCount = Object.values(candidateStatuses).filter((s) => s === "rejected").length;

  const handleStatusChange = (candidateId, status) => {
    setCandidateStatuses((prev) => ({
      ...prev,
      [candidateId]: prev[candidateId] === status ? null : status,
    }));
  };

  const handleBulkShortlist = () => {
    const newStatuses = { ...candidateStatuses };
    filteredSortedCandidates.slice(0, 5).forEach((c) => { newStatuses[c.id] = "shortlist"; });
    setCandidateStatuses(newStatuses);
  };

  const handleBulkReject = () => {
    const newStatuses = { ...candidateStatuses };
    filteredSortedCandidates.forEach((c) => {
      if (c.overall_match < 60) newStatuses[c.id] = "rejected";
    });
    setCandidateStatuses(newStatuses);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/recruiter/resume-match")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Match Results: {selectedJob.job_title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {selectedJob.company_name}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {selectedJob.location}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredSortedCandidates.length} candidate
              {filteredSortedCandidates.length > 1 ? "s" : ""} matched •{" "}
              {shortlistedCount} shortlisted • {rejectedCount} rejected
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg font-medium transition-all flex items-center gap-2 ${
                showFilters
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="score">Match Score</option>
                  <option value="experience">Experience</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Min Score:</label>
                <input
                  type="range" min="0" max="100" step="10"
                  value={filterMinScore}
                  onChange={(e) => setFilterMinScore(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-medium text-emerald-600">{filterMinScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Candidate List ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-24">
        <div className="space-y-3">
          {filteredSortedCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onSelect={() => setSelectedCandidate(candidate)}
              onStatusChange={handleStatusChange}
              isSelected={selectedCandidate?.id === candidate.id}
            />
          ))}

          {filteredSortedCandidates.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600">Try adjusting your filters or matching criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal (portal) ───────────────────────────────────────────── */}
      {selectedCandidate &&
        createPortal(
          <CandidateDetailPanel
            candidate={selectedCandidate}
            job={selectedJob}
            onClose={() => setSelectedCandidate(null)}
          />,
          document.body
        )}

      {/* ── Bulk Actions Bar ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{shortlistedCount}</span> shortlisted •{" "}
              <span className="font-semibold">{rejectedCount}</span> rejected
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkShortlist}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors font-medium flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Shortlist Top 5
              </button>
              <button
                onClick={handleBulkReject}
                className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                Reject Below 60%
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Candidate Card ──────────────────────────────────────────────────────────
function CandidateCard({ candidate, onSelect, onStatusChange, isSelected }) {
  const getScoreColor = (score) => {
    if (score >= 85) return { bg: "bg-emerald-500", text: "text-emerald-600", label: "Excellent Fit" };
    if (score >= 70) return { bg: "bg-green-500",   text: "text-green-600",   label: "Good Match"   };
    if (score >= 55) return { bg: "bg-orange-500",  text: "text-orange-600",  label: "Potential"    };
    return              { bg: "bg-red-500",     text: "text-red-600",     label: "Low Match"    };
  };

  const scoreColor = getScoreColor(candidate.overall_match);
  const skillMatches = Object.entries(candidate.skills || {}).map(([skill, status]) => ({ skill, status }));

  return (
    <div
      className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
        isSelected ? "border-emerald-500 shadow-md" : "border-gray-200"
      } ${
        candidate.status === "shortlist"
          ? "bg-emerald-50/30"
          : candidate.status === "rejected"
            ? "bg-red-50/30 opacity-60"
            : ""
      }`}
    >
      <div className="flex items-start gap-6">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          {candidate.rank <= 3 ? (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              candidate.rank === 1 ? "bg-yellow-100" : candidate.rank === 2 ? "bg-gray-100" : "bg-orange-100"
            }`}>
              <Award className={`w-6 h-6 ${
                candidate.rank === 1 ? "text-yellow-600" : candidate.rank === 2 ? "text-gray-600" : "text-orange-600"
              }`} />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-600">#{candidate.rank}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{candidate.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{candidate.role_company || "N/A"}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{candidate.years_of_experience > 0 ? `${candidate.years_of_experience} years exp` : "Fresher"}</span>
                <span>•</span>
                <span className="capitalize">{candidate.work_type?.replace("-", " ") || "Unknown"}</span>
              </div>
            </div>

            {/* Score Gauge */}
            <div className="flex-shrink-0 text-center ml-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                  <circle
                    cx="40" cy="40" r="32"
                    stroke="currentColor" strokeWidth="6" fill="none"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - candidate.overall_match / 100)}`}
                    className={scoreColor.text}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold ${scoreColor.text}`}>{candidate.overall_match}</span>
                </div>
              </div>
              <p className={`text-xs font-semibold mt-1 ${scoreColor.text}`}>{scoreColor.label}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Key Skills</p>
            <div className="flex flex-wrap gap-2">
              {skillMatches.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    skill.status === "matched"  ? "bg-green-100 text-green-700"   :
                    skill.status === "partial"  ? "bg-yellow-100 text-yellow-700" :
                                                  "bg-red-100 text-red-700"
                  }`}
                >
                  {skill.skill}{" "}
                  {skill.status === "matched" ? "✓" : skill.status === "partial" ? "~" : "✗"}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSelect}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => onStatusChange(candidate.id, candidate.status === "shortlist" ? null : "shortlist")}
              className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                candidate.status === "shortlist"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStatusChange(candidate.id, candidate.status === "rejected" ? null : "rejected")}
              className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                candidate.status === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel Modal ──────────────────────────────────────────────────────
function CandidateDetailPanel({ candidate, job, onClose }) {
  const insights = candidate.ai_insight
    ? candidate.ai_insight.split(/\d+\.\s/).filter((s) => s.trim()).map((s) => s.trim())
    : [];

  const skillMatches = Object.entries(candidate.skills || {}).map(([skill, status]) => ({ skill, status }));

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Dimmed backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Gradient header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{candidate.name}</h2>
              <p className="text-emerald-100 text-sm">{candidate.role_company || "N/A"}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-4xl font-bold">{candidate.overall_match}%</div>
              <div className="text-emerald-100 text-sm">Overall Match</div>
            </div>
            <div className="text-sm space-y-0.5">
              <p>{candidate.years_of_experience > 0 ? `${candidate.years_of_experience} years experience` : "Fresher"}</p>
              <p className="capitalize">{candidate.work_type?.replace("-", " ") || "Unknown"}</p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* AI Insights */}
          {insights.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                AI Insights
              </h3>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match Breakdown */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Match Breakdown</h3>
            <div className="space-y-3">
              <ProgressBar label="Skills Match"          value={candidate.match_split?.skills        || 0} />
              <ProgressBar label="Experience Match"      value={candidate.match_split?.experience    || 0} />
              <ProgressBar label="Qualifications Match"  value={candidate.match_split?.qualification || 0} />
            </div>
          </div>

          {/* Skills Detail */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Skills Analysis</h3>
            <div className="space-y-2">
              {skillMatches.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    skill.status === "matched" ? "bg-green-100 text-green-700"   :
                    skill.status === "partial" ? "bg-yellow-100 text-yellow-700" :
                                                 "bg-red-100 text-red-700"
                  }`}>
                    {skill.status === "matched" ? "Matched" : skill.status === "partial" ? "Partial" : "Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer close button */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ label, value }) {
  const getColor = (val) => {
    if (val >= 80) return "bg-emerald-500";
    if (val >= 60) return "bg-green-500";
    if (val >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}