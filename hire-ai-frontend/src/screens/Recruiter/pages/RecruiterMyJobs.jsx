// screens/Recruiter/pages/MyJobs.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Building2,
  Layers,
  Clock,
  ChevronRight,
  PlusCircle,
  Search,
  Trash2,
  Pencil,
  Loader2,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { getRecruiterJobs, deleteJobDescription } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const LIMIT = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LEVEL_STYLES = {
  "Entry Level": { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-400" },
  "Mid Level": {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  Senior: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  Lead: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
  Manager: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  Director: {
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    dot: "bg-fuchsia-400",
  },
};
const getLevelStyle = (level = "") =>
  LEVEL_STYLES[level] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };

const DEPT_ICONS = {
  Engineering: "⚙️",
  Design: "🎨",
  Marketing: "📢",
  Sales: "💼",
  Product: "🚀",
  Finance: "📊",
  HR: "🤝",
  Legal: "⚖️",
  Operations: "🔧",
};
const getDeptIcon = (dept = "") =>
  DEPT_ICONS[
    Object.keys(DEPT_ICONS).find((k) =>
      dept.toLowerCase().includes(k.toLowerCase()),
    )
  ] || "🏢";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label, colorClass }) {
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-medium text-sm ${colorClass}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="font-bold">{value}</span>
      <span className="opacity-60 text-xs">{label}</span>
    </div>
  );
}

// ─── Context menu ─────────────────────────────────────────────────────────────
function ContextMenu({ onView, onEdit, onDelete, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: -6 }}
        transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-9 z-20 w-44 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden py-1"
      >
        {[
          {
            icon: Eye,
            label: "View Details",
            handler: onView,
            cls: "text-slate-700 hover:bg-slate-50",
          },
          {
            icon: Pencil,
            label: "Edit Job",
            handler: onEdit,
            cls: "text-slate-700 hover:bg-slate-50",
          },
        ].map(({ icon: Icon, label, handler, cls }) => (
          <button
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              handler();
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors ${cls}`}
          >
            <Icon className="w-3.5 h-3.5 text-slate-400" />
            {label}
          </button>
        ))}
        <div className="h-px bg-slate-100 mx-3 my-1" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            onDelete();
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </motion.div>
    </>
  );
}

// ─── List-view card ───────────────────────────────────────────────────────────
function JobCardList({ job, index, onView, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const levelStyle = getLevelStyle(job.level);
  const skills = job.skills
    ? job.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{
        delay: Math.min(index * 0.04, 0.3),
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300/80 hover:shadow-[0_4px_24px_rgba(16,185,129,0.09)] transition-all duration-300 overflow-hidden"
    >
      {/* Hover accent stripe */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />

      <div
        className="flex items-start gap-4 p-5 pl-6 cursor-pointer"
        onClick={onView}
      >
        {/* Dept emoji bubble */}
        <div className="flex-shrink-0 w-11 h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300 select-none">
          {getDeptIcon(job.department)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-900 text-[15px] leading-snug group-hover:text-emerald-700 transition-colors truncate">
              {job.job_title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {job.created_at && (
                <span className="hidden sm:block text-xs text-slate-400 font-medium">
                  {timeAgo(job.created_at)}
                </span>
              )}
              {/* 3-dot menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-all"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <ContextMenu
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onClose={() => setMenuOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sub-meta */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mb-2">
            {job.company_name && (
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Building2 className="w-3 h-3" />
                {job.company_name}
              </span>
            )}
            {job.location && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
            )}
            {job.department && (
              <span className="text-xs text-slate-400">{job.department}</span>
            )}
          </div>

          {/* Description */}
          {job.input_description && (
            <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-1">
              {job.input_description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {job.level && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${levelStyle.bg} ${levelStyle.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${levelStyle.dot}`}
                  />
                  {job.level}
                </span>
              )}
              {skills.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
                >
                  {s}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="text-xs text-slate-400">
                  +{skills.length - 4}
                </span>
              )}
            </div>
            {/* Quick action buttons — only on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Grid-view card ───────────────────────────────────────────────────────────
function JobCardGrid({ job, index, onView, onEdit, onDelete }) {
  const levelStyle = getLevelStyle(job.level);
  const skills = job.skills
    ? job.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: Math.min(index * 0.04, 0.3),
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onView}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300/80 hover:shadow-[0_8px_32px_rgba(16,185,129,0.11)] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    >
      <div className="h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col flex-1">
        {/* Top row: emoji + level */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-lg group-hover:scale-105 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300 select-none">
            {getDeptIcon(job.department)}
          </div>
          {job.level && (
            <span
              className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${levelStyle.bg} ${levelStyle.text}`}
            >
              {job.level}
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {job.job_title}
        </h3>

        <div className="space-y-0.5 mb-3">
          {job.company_name && (
            <p className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate">
              <Building2 className="w-3 h-3 flex-shrink-0" />
              {job.company_name}
            </p>
          )}
          {job.location && (
            <p className="flex items-center gap-1 text-xs text-slate-400 truncate">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {job.location}
            </p>
          )}
        </div>

        {job.input_description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
            {job.input_description}
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {skills.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium"
              >
                {s}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs text-slate-400 self-center">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {timeAgo(job.created_at)}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Delete modal ─────────────────────────────────────────────────────────────
function DeleteModal({ job, onCancel, onConfirm, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl shadow-black/20"
      >
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          Delete this job?
        </h3>
        <p className="text-sm text-slate-500 mb-1">
          <span className="font-semibold text-slate-700">
            "{job.job_title}"
          </span>{" "}
          will be permanently removed.
        </p>
        <p className="text-xs text-slate-400 mb-7">This cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete Job"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 bg-slate-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-slate-200 rounded-lg w-3/5" />
          <div className="h-3 bg-slate-100 rounded w-2/5" />
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-16 bg-slate-100 rounded-lg" />
            <div className="h-5 w-12 bg-slate-100 rounded-md" />
            <div className="h-5 w-14 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasFilter, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-5 text-3xl">
        {hasFilter ? "🔍" : "📋"}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {hasFilter ? "No matching jobs" : "No job listings yet"}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
        {hasFilter
          ? "Try adjusting your search or filters."
          : "Post your first job to start finding great candidates."}
      </p>
      {hasFilter ? (
        <button
          onClick={onClear}
          className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Clear filters
        </button>
      ) : (
        <Link
          to="/recruiter/generate-jd"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Post First Job
        </Link>
      )}
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MyJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("newest");
  const [filterLevel, setFilterLevel] = useState("All");
  const [deleteJob, setDeleteJob] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getRecruiterJobs(user.id, { skip: 0, limit: LIMIT })
      .then(setJobs)
      .catch((err) => toast.error(err.message || "Failed to fetch jobs"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const uniqueDepts = useMemo(
    () => [...new Set(jobs.map((j) => j.department).filter(Boolean))],
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((j) =>
        [
          j.job_title,
          j.company_name,
          j.location,
          j.department,
          j.level,
          j.skills,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (filterLevel !== "All")
      result = result.filter((j) => j.level === filterLevel);
    if (sortBy === "newest")
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "oldest")
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "alpha")
      result.sort((a, b) =>
        (a.job_title || "").localeCompare(b.job_title || ""),
      );
    return result;
  }, [jobs, search, filterLevel, sortBy]);

  const handleDelete = async () => {
    if (!deleteJob) return;
    setDeleting(true);
    try {
      await deleteJobDescription(deleteJob.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteJob.id));
      setDeleteJob(null);
      toast.success("Job removed");
    } catch (err) {
      toast.error(err.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  const hasFilter = !!(search || filterLevel !== "All");
  const clearAll = () => {
    setSearch("");
    setFilterLevel("All");
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="py-8 space-y-5">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-7 shadow-xl">
          {/* Decorative glows */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500 rounded-full opacity-[0.07] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400 rounded-full opacity-[0.06] blur-2xl pointer-events-none" />
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  Recruiter Dashboard
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-1 leading-none">
                My Job Listings
              </h1>
              <p className="text-slate-500 text-sm mt-1.5">
                {loading
                  ? "Loading your jobs…"
                  : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} across ${uniqueDepts.length} department${uniqueDepts.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <Link
              to="/recruiter/generate-jd"
              className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all duration-200 active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Post New Job
            </Link>
          </div>

          {/* Stats */}
          {!loading && jobs.length > 0 && (
            <div className="relative mt-5 flex flex-wrap gap-2">
              <StatPill
                icon={Briefcase}
                value={jobs.length}
                label="Total"
                colorClass="bg-white/10 text-black border-white/20"
              />
              <StatPill
                icon={Layers}
                value={
                  [...new Set(jobs.map((j) => j.level).filter(Boolean))].length
                }
                label="Levels"
                colorClass="bg-white/10 text-black border-white/20"
              />
              <StatPill
                icon={Building2}
                value={uniqueDepts.length}
                label="Depts"
                colorClass="bg-white/10 text-black border-white/20"
              />
            </div>
          )}
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company, skills, location…"
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-transparent transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Level filter */}
          <div className="relative">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 shadow-sm cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="junior">Junior (1-3 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (5-10 years)</option>
              <option value="lead">Lead / Principal (10+ years)</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 shadow-sm cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="alpha">A → Z</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {[
              { id: "list", Icon: List },
              { id: "grid", Icon: LayoutGrid },
            ].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={`px-3 py-2.5 transition-colors ${viewMode === id ? "bg-emerald-50 text-emerald-700" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Active filter bar */}
        <AnimatePresence>
          {hasFilter && !loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-sm overflow-hidden"
            >
              <span className="text-slate-400">Showing</span>
              <span className="font-bold text-emerald-700">
                {filteredJobs.length}
              </span>
              <span className="text-slate-400">of {jobs.length} jobs</span>
              <button
                onClick={clearAll}
                className="ml-1 text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState hasFilter={hasFilter} onClear={clearAll} />
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                {filteredJobs.map((job, i) => (
                  <JobCardList
                    key={job.id}
                    job={job}
                    index={i}
                    onView={() =>
                      navigate(`/recruiter/my-jobs/${job.id}`, { state: job })
                    }
                    onEdit={() =>
                      navigate(`/recruiter/my-jobs/edit/${job.id}`, {
                        state: job,
                      })
                    }
                    onDelete={() => setDeleteJob(job)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredJobs.map((job, i) => (
                  <JobCardGrid
                    key={job.id}
                    job={job}
                    index={i}
                    onView={() =>
                      navigate(`/recruiter/my-jobs/${job.id}`, { state: job })
                    }
                    onEdit={() =>
                      navigate(`/recruiter/my-jobs/edit/${job.id}`, {
                        state: job,
                      })
                    }
                    onDelete={() => setDeleteJob(job)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ── Delete modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteJob && (
          <DeleteModal
            job={deleteJob}
            loading={deleting}
            onCancel={() => setDeleteJob(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
