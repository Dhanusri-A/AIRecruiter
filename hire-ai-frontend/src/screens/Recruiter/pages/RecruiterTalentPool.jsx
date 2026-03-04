// screens/Recruiter/pages/RecruiterTalentPool.jsx
'use client';

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Zap, Mail, Tag, Calendar, Download, Archive, X,
  ChevronFirst, ChevronLeft, ChevronRight, ChevronLast,
  Trash2, AlertTriangle, Loader2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getRecruiterCandidates, deleteCandidate } from "../../../api/api";
import toast from "react-hot-toast";

import { RecruiterHeaderActions }           from "../components/RecruiterHeaderActions";
import { RecruiterSearchBar }               from "../components/RecruiterSearchBar";
import { RecruiterAdvancedFilters }         from "../components/RecruiterAdvancedFilters";
import { RecruiterTableView }               from "../components/RecruiterTableView";
import { RecruiterCardView }                from "../components/RecruiterCardView";
import { RecruiterCandidateDetailPanel }    from "../components/RecruiterCandidateDetailPanel";
import { RecruiterCandidateStats }          from "../components/RecruiterCandidateStats";

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["All Status","New","Active","In Pool","Contacted","Interview Scheduled","High Potential"];
const LOCATION_OPTIONS = ["All Locations","Singapore","Bangalore","Dubai","Manila","Kuala Lumpur","Amsterdam","San Francisco"];
const SOURCE_OPTIONS = ["All Sources","LinkedIn","Resume Upload","Database"];
const EXPERIENCE_RANGES = [
  { label: "All Experience", min: 0, max: 100 },
  { label: "0-2 years",      min: 0, max: 2   },
  { label: "3-5 years",      min: 3, max: 5   },
  { label: "6-8 years",      min: 6, max: 8   },
  { label: "9+ years",       min: 9, max: 100 },
];

function getRelativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return diffDays + " days ago";
  if (diffDays < 30) return Math.floor(diffDays / 7) + " weeks ago";
  return Math.floor(diffDays / 30) + " months ago";
}

function getStatusColor(status) {
  const colors = {
    New: "bg-blue-100 text-blue-700 border-blue-200",
    Active: "bg-green-100 text-green-700 border-green-200",
    "In Pool": "bg-gray-100 text-gray-700 border-gray-200",
    Contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Interview Scheduled": "bg-purple-100 text-purple-700 border-purple-200",
    "High Potential": "bg-emerald-100 text-emerald-700 border-emerald-200",
    sourced:   "bg-gray-100 text-gray-700 border-gray-200",
    matched:   "bg-blue-100 text-blue-700 border-blue-200",
    screening: "bg-yellow-100 text-yellow-700 border-yellow-200",
    interview: "bg-purple-100 text-purple-700 border-purple-200",
    offer:     "bg-orange-100 text-orange-700 border-orange-200",
    hired:     "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
}

function mapCandidate(c) {
  return {
    id: c.id,
    name: ((c.first_name || "") + " " + (c.last_name || "")).trim() || "Unknown Name",
    title: c.title || "Not specified",
    location: c.location || "Not specified",
    experience: parseInt((c.total_years_experience || "0").replace(/\D/g, "")) || 0,
    skills: c.skills ? c.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
    status: c.status,
    lastUpdated: getRelativeTime(c.updated_at),
    source: "Database",
    avatar: (c.first_name?.[0] || "") + (c.last_name?.[0] || ""),
    email: c.email || "No email",
    phone: c.phone || "No phone",
    summary: c.profile_summary || "No summary available",
    image_url: c.image_url,
    notice_period: c.notice_period || "N/A",
    expected_salary: c.expected_salary || "N/A",
    preferred_mode: c.preferred_mode || "N/A",
    profiles: c.profiles || {},
    languages: c.languages || {},
    education_records: c.education_records || [],
    work_experiences: c.work_experiences || [],
  };
}

// Delete Confirmation Modal
function DeleteConfirmModal({ candidates, onConfirm, onCancel, deleting }) {
  const count = candidates.length;
  const isBulk = count > 1;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!deleting ? onCancel : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          {isBulk ? ("Delete " + count + " Candidates?") : "Delete Candidate?"}
        </h3>
        <p className="text-sm text-gray-600 text-center mb-1">
          {isBulk
            ? ("You are about to permanently delete " + count + " candidates.")
            : (<>You are about to permanently delete <span className="font-semibold text-gray-900">{candidates[0].name}</span>.</>)
          }
        </p>
        <p className="text-xs text-red-500 text-center mb-6 font-medium">This action cannot be undone.</p>
        {isBulk && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 max-h-32 overflow-y-auto">
            {candidates.slice(0, 5).map((c) => (
              <p key={c.id} className="text-xs text-red-700 font-medium py-0.5">&bull; {c.name}</p>
            ))}
            {count > 5 && <p className="text-xs text-red-400 mt-1">+{count - 5} more&hellip;</p>}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {deleting
              ? (<><Loader2 className="w-4 h-4 animate-spin" />Deleting&hellip;</>)
              : (<><Trash2 className="w-4 h-4" />Delete</>)
            }
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function RecruiterTalentPool() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [candidates, setCandidates]           = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [searchQuery, setSearchQuery]         = useState("");
  const [viewMode, setViewMode]               = useState("table");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate]   = useState(null);
  const [sortColumn, setSortColumn]           = useState("lastUpdated");
  const [sortDirection, setSortDirection]     = useState("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage]         = useState(1);
  const [deleteTargets, setDeleteTargets]     = useState(null);
  const [deleting, setDeleting]               = useState(false);
  const [statusFilter, setStatusFilter]       = useState("All Status");
  const [locationFilter, setLocationFilter]   = useState("All Locations");
  const [sourceFilter, setSourceFilter]       = useState("All Sources");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");
  const [selectedSkills, setSelectedSkills]   = useState([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  useEffect(() => {
    if (authLoading || !user?.id || user.role !== "recruiter") { setLoading(false); return; }
    const fetchCandidates = async () => {
      setLoading(true); setError(null);
      try {
        const data = await getRecruiterCandidates(user.id, { skip: 0, limit: 500 });
        setCandidates(data.map(mapCandidate));
      } catch (err) {
        setError("Failed to load talent pool. Please try again later.");
      } finally { setLoading(false); }
    };
    fetchCandidates();
  }, [user?.id, authLoading, user?.role]);

  const handleStatusUpdated = (candidateId, newStatus) => {
    setCandidates((prev) => prev.map((c) => c.id === candidateId ? { ...c, status: newStatus } : c));
    setSelectedCandidate((prev) => prev?.id === candidateId ? { ...prev, status: newStatus } : prev);
  };

  const openDeleteSingle   = (candidate) => setDeleteTargets([candidate]);
  const openDeleteSelected = () => {
    const targets = candidates.filter((c) => selectedCandidates.includes(c.id));
    if (targets.length > 0) setDeleteTargets(targets);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargets?.length) return;
    setDeleting(true);
    try {
      await Promise.all(deleteTargets.map((c) => deleteCandidate(c.id)));
      const deletedIds = new Set(deleteTargets.map((c) => c.id));
      setCandidates((prev) => prev.filter((c) => !deletedIds.has(c.id)));
      setSelectedCandidates((prev) => prev.filter((id) => !deletedIds.has(id)));
      if (selectedCandidate && deletedIds.has(selectedCandidate.id)) setSelectedCandidate(null);
      const count = deleteTargets.length;
      toast.success(count === 1
        ? (deleteTargets[0].name + " deleted successfully")
        : (count + " candidates deleted successfully")
      );
      setDeleteTargets(null);
    } catch {
      // toast already fired by api.js handleError
    } finally { setDeleting(false); }
  };

  const allSkills = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) ||
        (c.summary || "").toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selectedSkills.length > 0)
      result = result.filter((c) => selectedSkills.every((sel) => c.skills.some((s) => s.toLowerCase() === sel.toLowerCase())));
    if (statusFilter !== "All Status")       result = result.filter((c) => c.status === statusFilter);
    if (locationFilter !== "All Locations")  result = result.filter((c) => c.location === locationFilter);
    if (sourceFilter !== "All Sources")      result = result.filter((c) => c.source === sourceFilter);
    const expRange = EXPERIENCE_RANGES.find((r) => r.label === experienceFilter);
    if (expRange && experienceFilter !== "All Experience")
      result = result.filter((c) => c.experience >= expRange.min && c.experience <= expRange.max);
    result.sort((a, b) => {
      let aVal = a[sortColumn], bVal = b[sortColumn];
      if (typeof aVal === "string" && typeof bVal === "string")
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [candidates, searchQuery, statusFilter, locationFilter, sourceFilter, experienceFilter, selectedSkills, sortColumn, sortDirection]);

  const totalItems            = filteredCandidates.length;
  const totalPages            = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex            = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const newThisWeek    = candidates.filter((c) => c.lastUpdated.includes("Today") || c.lastUpdated.includes("Yesterday") || c.lastUpdated.includes("day ago")).length;
  const recentActivity = candidates.filter((c) => ["Today","Yesterday","day ago","days ago"].some((t) => c.lastUpdated.includes(t))).length;
  const sourceBreakdown = candidates.reduce((acc, c) => { acc[c.source] = (acc[c.source] || 0) + 1; return acc; }, {});
  const topSource = Object.entries(sourceBreakdown).sort((a, b) => b[1] - a[1])[0];

  const handleSort = (column) => {
    if (sortColumn === column) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else { setSortColumn(column); setSortDirection("desc"); }
    setCurrentPage(1);
  };
  const toggleSelectAll = () =>
    setSelectedCandidates(selectedCandidates.length === currentPageCandidates.length ? [] : currentPageCandidates.map((c) => c.id));
  const toggleSelectCandidate = (id) =>
    setSelectedCandidates((prev) => prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]);
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
    setCurrentPage(1);
  };
  const clearAllFilters = () => {
    setSearchQuery(""); setStatusFilter("All Status"); setLocationFilter("All Locations");
    setSourceFilter("All Sources"); setExperienceFilter("All Experience"); setSelectedSkills([]);
    setCurrentPage(1);
  };
  const hasActiveFilters = searchQuery || statusFilter !== "All Status" || locationFilter !== "All Locations" ||
    sourceFilter !== "All Sources" || experienceFilter !== "All Experience" || selectedSkills.length > 0;
  const filterCount = selectedSkills.length +
    (statusFilter !== "All Status" ? 1 : 0) + (locationFilter !== "All Locations" ? 1 : 0) +
    (sourceFilter !== "All Sources" ? 1 : 0) + (experienceFilter !== "All Experience" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading talent pool...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-red-500 text-5xl mb-4">!</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Talent Pool <span className="text-emerald-600">({totalItems})</span></h1>
              <p className="text-gray-500 mt-1">Your complete candidate database and CRM</p>
            </div>
            <RecruiterHeaderActions onCreateNew={() => navigate("/recruiter/create-profile")} />
          </div>
          <RecruiterCandidateStats totalCandidates={totalItems} newThisWeek={newThisWeek} recentActivity={recentActivity} topSource={topSource} />
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <RecruiterSearchBar
            searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
            viewMode={viewMode} onViewModeChange={setViewMode}
            showAdvancedFilters={showAdvancedFilters} onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            hasActiveFilters={hasActiveFilters} filterCount={filterCount}
          />
          {showAdvancedFilters && (
            <RecruiterAdvancedFilters
              statusFilter={statusFilter} onStatusChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
              locationFilter={locationFilter} onLocationChange={(v) => { setLocationFilter(v); setCurrentPage(1); }}
              sourceFilter={sourceFilter} onSourceChange={(v) => { setSourceFilter(v); setCurrentPage(1); }}
              experienceFilter={experienceFilter} onExperienceChange={(v) => { setExperienceFilter(v); setCurrentPage(1); }}
              selectedSkills={selectedSkills} onToggleSkill={toggleSkill}
              skillSearchQuery={skillSearchQuery} onSkillSearchChange={setSkillSearchQuery}
              showSkillsDropdown={showSkillsDropdown} onShowSkillsDropdown={setShowSkillsDropdown}
              filteredSkillOptions={allSkills.filter((s) => s.toLowerCase().includes(skillSearchQuery.toLowerCase()) && !selectedSkills.includes(s))}
              hasActiveFilters={hasActiveFilters} filteredCount={filteredCandidates.length} totalCount={candidates.length}
              onClearFilters={clearAllFilters} statusOptions={STATUS_OPTIONS} locationOptions={LOCATION_OPTIONS}
              sourceOptions={SOURCE_OPTIONS} experienceRanges={EXPERIENCE_RANGES}
            />
          )}
        </div>
      </div>

      {showSkillsDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowSkillsDropdown(false)} />}

      {selectedCandidates.length > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-900">
              {selectedCandidates.length} candidate{selectedCandidates.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <BulkActionButton icon={Zap}      text="Compare to JD" />
              <BulkActionButton icon={Mail}     text="Email" />
              <BulkActionButton icon={Tag}      text="Tag" />
              <BulkActionButton icon={Calendar} text="Schedule" />
              <BulkActionButton icon={Download} text="Export" />
              <BulkActionButton icon={Archive}  text="Archive" variant="red" />
              <button
                onClick={openDeleteSelected}
                className="px-3 py-1.5 border rounded-lg transition-colors text-sm flex items-center gap-2 bg-white border-red-400 text-red-600 hover:bg-red-50 font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button onClick={() => setSelectedCandidates([])} className="p-1.5 hover:bg-emerald-100 rounded transition-colors">
                <X className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{currentPageCandidates.length}</span>{" "}
            of <span className="font-semibold text-gray-900">{totalItems}</span> candidates
          </p>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>

        {viewMode === "table" ? (
          <RecruiterTableView
            candidates={currentPageCandidates} selectedCandidates={selectedCandidates}
            onSelectAll={toggleSelectAll} onSelectCandidate={toggleSelectCandidate}
            onCandidateClick={setSelectedCandidate} sortColumn={sortColumn} sortDirection={sortDirection}
            onSort={handleSort} getStatusColor={getStatusColor} onClearFilters={clearAllFilters}
            onDeleteCandidate={openDeleteSingle}
          />
        ) : (
          <RecruiterCardView
            candidates={currentPageCandidates} selectedCandidates={selectedCandidates}
            onSelectCandidate={toggleSelectCandidate} onCandidateClick={setSelectedCandidate}
            getStatusColor={getStatusColor} onClearFilters={clearAllFilters}
            onDeleteCandidate={openDeleteSingle}
          />
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {selectedCandidate && (
        <RecruiterCandidateDetailPanel
          candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)}
          getStatusColor={getStatusColor} onStatusUpdated={handleStatusUpdated}
        />
      )}

      {deleteTargets && (
        <DeleteConfirmModal
          candidates={deleteTargets} onConfirm={handleConfirmDelete}
          onCancel={() => !deleting && setDeleteTargets(null)} deleting={deleting}
        />
      )}
    </div>
  );
}

function BulkActionButton({ icon: Icon, text, variant = "default" }) {
  const variants = {
    default: "bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-100",
    red:     "bg-white border-red-300 text-red-700 hover:bg-red-50",
  };
  return (
    <button className={"px-3 py-1.5 border rounded-lg transition-colors text-sm flex items-center gap-2 " + variants[variant]}>
      <Icon className="w-4 h-4" />{text}
    </button>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onPageChange(1)}               disabled={currentPage === 1}          className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronFirst className="w-5 h-5" /></button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}          className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft  className="w-5 h-5" /></button>
      <span className="text-sm text-gray-700 px-3">Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-5 h-5" /></button>
      <button onClick={() => onPageChange(totalPages)}      disabled={currentPage === totalPages} className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLast  className="w-5 h-5" /></button>
    </div>
  );
}