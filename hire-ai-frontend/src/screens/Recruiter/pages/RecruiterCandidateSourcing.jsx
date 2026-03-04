// screens/Recruiter/pages/RecruiterCandidateSourcing.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, ExternalLink, Heart, Mail, Loader2, Users,
  Briefcase, Code2, Globe, RefreshCw,
  ChevronFirst, ChevronLeft, ChevronRight, ChevronLast,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { searchCandidates, getRecruiterCandidates } from "../../../api/api";
import toast from "react-hot-toast";

import { RecruiterSearchBar }            from "../components/RecruiterSearchBar";
import { RecruiterAdvancedFilters }      from "../components/RecruiterAdvancedFilters";
import { RecruiterTableView }            from "../components/RecruiterTableView";
import { RecruiterCardView }             from "../components/RecruiterCardView";
import { RecruiterCandidateDetailPanel } from "../components/RecruiterCandidateDetailPanel";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "linkedin", label: "LinkedIn", source: "linkedin",
    color: "text-blue-700", badgeBg: "bg-blue-100 text-blue-700", underline: "bg-blue-600",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
//   {
//     id: "naukri", label: "Naukri", source: "naukri",
//     color: "text-orange-700", badgeBg: "bg-orange-100 text-orange-700", underline: "bg-orange-500",
//     icon: <Briefcase className="w-4 h-4" />,
//   },
//   {
//     id: "indeed", label: "Indeed", source: "indeed",
//     color: "text-indigo-700", badgeBg: "bg-indigo-100 text-indigo-700", underline: "bg-indigo-600",
//     icon: <Globe className="w-4 h-4" />,
//   },
//   {
//     id: "github", label: "GitHub", source: "github",
//     color: "text-gray-800", badgeBg: "bg-gray-200 text-gray-800", underline: "bg-gray-800",
//     icon: (
//       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
//       </svg>
//     ),
//   },
  {
    id: "talent-pool", label: "Talent Pool", source: null,
    color: "text-emerald-700", badgeBg: "bg-emerald-100 text-emerald-700",
    underline: "bg-gradient-to-r from-emerald-600 to-teal-600",
    icon: <Users className="w-4 h-4" />,
  },
];

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["All Status", "New", "Active", "In Pool", "Contacted", "Interview Scheduled", "High Potential"];
const LOCATION_OPTIONS = ["All Locations", "Singapore", "Bangalore", "Dubai", "Manila", "Kuala Lumpur", "Amsterdam", "San Francisco"];
const SOURCE_OPTIONS = ["All Sources", "LinkedIn", "Resume Upload", "Database"];
const EXPERIENCE_RANGES = [
  { label: "All Experience", min: 0, max: 100 },
  { label: "0-2 years", min: 0, max: 2 },
  { label: "3-5 years", min: 3, max: 5 },
  { label: "6-8 years", min: 6, max: 8 },
  { label: "9+ years", min: 9, max: 100 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRelativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const diffDays = Math.floor((new Date() - date) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function getStatusColor(status) {
  const map = {
    New: "bg-blue-100 text-blue-700 border-blue-200",
    Active: "bg-green-100 text-green-700 border-green-200",
    "In Pool": "bg-gray-100 text-gray-700 border-gray-200",
    Contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Interview Scheduled": "bg-purple-100 text-purple-700 border-purple-200",
    "High Potential": "bg-emerald-100 text-emerald-700 border-emerald-200",
    sourced: "bg-gray-100 text-gray-700 border-gray-200",
    matched: "bg-blue-100 text-blue-700 border-blue-200",
    screening: "bg-yellow-100 text-yellow-700 border-yellow-200",
    interview: "bg-purple-100 text-purple-700 border-purple-200",
    offer: "bg-orange-100 text-orange-700 border-orange-200",
    hired: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return map[status] || "bg-gray-100 text-gray-700 border-gray-200";
}

function mapCandidate(c) {
  return {
    id: c.id,
    name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Unknown Name",
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

function parseSearchResult(item) {
  const techKeywords = [
    "React", "Node", "Python", "Java", "Angular", "Vue", "TypeScript", "JavaScript",
    "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Next.js", "HTML", "CSS",
    "Tailwind", "Redux", "GraphQL", "REST", "Git", ".NET", "C#", "PHP", "Laravel",
    "React Native", "Express", "Firebase",
  ];
  const haystack = `${item.job_title || ""} ${item.description || ""}`.toLowerCase();
  const skills = techKeywords.filter((kw) => haystack.includes(kw.toLowerCase()));
  const expMatch = (item.description || "").match(/(\d+)\s*years?/i);
  const experience = expMatch ? `${expMatch[1]} yrs` : "";
  const companyMatch = (item.description || "").match(/Experience:\s*([^·\n]+)/i);
  const company = companyMatch ? companyMatch[1].trim() : "";
  return {
    id: item.source,
    name: item.name || "",
    jobTitle: item.job_title || "",
    location: item.location || "",
    description: item.description || "",
    link: item.source,
    company,
    experience,
    skills: skills.slice(0, 6),
  };
}

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Shared card layout ───────────────────────────────────────────────────────
// Each card uses this structure:
//   [color bar]
//   [header: avatar + name + job title + company + platform badge]
//   [meta: location + experience]
//   [description: fixed 3-line clamp with overflow ellipsis]
//   [skills: wraps naturally]
//   [actions: always pinned at bottom]

function CardShell({ topBar, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden flex flex-col h-full">
      <div className={`h-1.5 ${topBar}`} />
      <div className="p-5 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}

function CardMeta({ location, experience }) {
  if (!location && !experience) return null;
  return (
    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
      {location && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{location}</span>}
      {experience && <span className="flex items-center gap-1 flex-shrink-0"><Briefcase className="w-3 h-3" />{experience}</span>}
    </div>
  );
}

// ── Fixed-height description block — always 3 lines, ellipsis on overflow ──
function CardDescription({ text, mono = false }) {
  return (
    <p
      className={`text-xs text-gray-600 leading-relaxed mb-3 ${mono ? "font-mono bg-gray-50 p-2 rounded border border-gray-100" : ""}`}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        minHeight: "3.6em",   // reserves space even for short text
      }}
    >
      {text || "No description available."}
    </p>
  );
}

function CardSkills({ skills, chipClass }) {
  if (!skills.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {skills.map((s) => (
        <span key={s} className={`px-2 py-0.5 rounded text-xs font-medium border ${chipClass}`}>{s}</span>
      ))}
    </div>
  );
}

function CardActions({ link, saved, onSave, viewBtnClass, iconHoverClass }) {
  return (
    <div className="flex gap-2 mt-auto pt-1">
      <a href={link} target="_blank" rel="noopener noreferrer"
        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${viewBtnClass}`}>
        <ExternalLink className="w-3.5 h-3.5" />View Profile
      </a>
      <button onClick={() => onSave()}
        className={`p-2 rounded-lg border-2 transition-all ${saved ? "border-red-400 bg-red-50 text-red-500" : "border-gray-300 hover:border-red-300 text-gray-500 hover:text-red-500"}`}>
        <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
      </button>
      <button className={`p-2 rounded-lg border-2 border-gray-300 transition-all text-gray-500 ${iconHoverClass}`}>
        <Mail className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── LinkedIn card ────────────────────────────────────────────────────────────
function LinkedInCard({ result, saved, onSave }) {
  return (
    <CardShell topBar="bg-gradient-to-r from-blue-600 to-blue-400">
      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {getInitials(result.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate leading-tight">{result.name}</h3>
          <p className="text-sm text-blue-700 font-medium truncate mt-0.5">{result.jobTitle}</p>
          {result.company && <p className="text-xs text-gray-500 truncate">{result.company}</p>}
        </div>
        <div className="flex-shrink-0 w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </div>
      </div>
      <CardMeta location={result.location} experience={result.experience} />
      <CardDescription text={result.description} />
      <CardSkills skills={result.skills} chipClass="bg-blue-50 text-blue-700 border-blue-200" />
      <CardActions
        link={result.link} saved={saved} onSave={() => onSave(result.id)}
        viewBtnClass="bg-blue-600 hover:bg-blue-700"
        iconHoverClass="hover:border-blue-300 hover:text-blue-600"
      />
    </CardShell>
  );
}

// ─── Naukri card ──────────────────────────────────────────────────────────────
function NaukriCard({ result, saved, onSave }) {
  return (
    <CardShell topBar="bg-gradient-to-r from-orange-500 to-amber-400">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {getInitials(result.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{result.name}</h3>
          <p className="text-sm text-orange-700 font-medium truncate mt-0.5">{result.jobTitle}</p>
          {result.company && <p className="text-xs text-gray-500 truncate">{result.company}</p>}
        </div>
        <div className="flex-shrink-0 w-7 h-7 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-sm">N</div>
      </div>
      <CardMeta location={result.location} experience={result.experience} />
      <CardDescription text={result.description} />
      <CardSkills skills={result.skills} chipClass="bg-orange-50 text-orange-700 border-orange-200" />
      <CardActions
        link={result.link} saved={saved} onSave={() => onSave(result.id)}
        viewBtnClass="bg-orange-500 hover:bg-orange-600"
        iconHoverClass="hover:border-orange-300 hover:text-orange-600"
      />
    </CardShell>
  );
}

// ─── Indeed card ──────────────────────────────────────────────────────────────
function IndeedCard({ result, saved, onSave }) {
  return (
    <CardShell topBar="bg-gradient-to-r from-indigo-500 to-violet-500">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {getInitials(result.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{result.name}</h3>
          <p className="text-sm text-indigo-700 font-medium truncate mt-0.5">{result.jobTitle}</p>
          {result.company && <p className="text-xs text-gray-500 truncate">{result.company}</p>}
        </div>
        <div className="flex-shrink-0 w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">in</div>
      </div>
      <CardMeta location={result.location} experience={result.experience} />
      <CardDescription text={result.description} />
      <CardSkills skills={result.skills} chipClass="bg-indigo-50 text-indigo-700 border-indigo-200" />
      <CardActions
        link={result.link} saved={saved} onSave={() => onSave(result.id)}
        viewBtnClass="bg-indigo-600 hover:bg-indigo-700"
        iconHoverClass="hover:border-indigo-300 hover:text-indigo-600"
      />
    </CardShell>
  );
}

// ─── GitHub card ──────────────────────────────────────────────────────────────
function GitHubCard({ result, saved, onSave }) {
  return (
    <CardShell topBar="bg-gradient-to-r from-gray-700 to-gray-900">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white flex-shrink-0">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{result.name}</h3>
          <p className="text-sm text-gray-500 font-medium truncate mt-0.5 font-mono">{result.jobTitle}</p>
          {result.company && <p className="text-xs text-gray-400 truncate">{result.company}</p>}
        </div>
        <Code2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
      <CardMeta location={result.location} experience={result.experience} />
      <CardDescription text={result.description} mono />
      <CardSkills skills={result.skills} chipClass="bg-gray-100 text-gray-700 border-gray-300 font-mono" />
      <CardActions
        link={result.link} saved={saved} onSave={() => onSave(result.id)}
        viewBtnClass="bg-gray-900 hover:bg-gray-700"
        iconHoverClass="hover:border-gray-600 hover:text-gray-700"
      />
    </CardShell>
  );
}

function ExternalResultCard({ result, tabId, saved, onSave }) {
  if (tabId === "linkedin") return <LinkedInCard result={result} saved={saved} onSave={onSave} />;
//   if (tabId === "naukri")   return <NaukriCard   result={result} saved={saved} onSave={onSave} />;
//   if (tabId === "indeed")   return <IndeedCard   result={result} saved={saved} onSave={onSave} />;
//   if (tabId === "github")   return <GitHubCard   result={result} saved={saved} onSave={onSave} />;
  return null;
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ searched }) {
  return (
    <div className="col-span-full py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {searched ? "No results found" : "Search for candidates"}
      </h3>
      <p className="text-gray-500 text-sm">
        {searched ? "Try different keywords or broaden your location" : "Enter a job title and location above, then click Search"}
      </p>
    </div>
  );
}

// ─── Talent Pool sub-tab ──────────────────────────────────────────────────────
function TalentPoolTab({ jobTitleFilter, locationFilter: locationInput }) {
  const { user } = useAuth();
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
  const [statusFilter, setStatusFilter]       = useState("All Status");
  const [locFilter, setLocFilter]             = useState("All Locations");
  const [sourceFilter, setSourceFilter]       = useState("All Sources");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");
  const [selectedSkills, setSelectedSkills]   = useState([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    getRecruiterCandidates(user.id, { skip: 0, limit: 500 })
      .then((data) => setCandidates(data.map(mapCandidate)))
      .catch(() => setError("Failed to load talent pool"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleStatusUpdated = (candidateId, newStatus) => {
    setCandidates((prev) => prev.map((c) => c.id === candidateId ? { ...c, status: newStatus } : c));
    setSelectedCandidate((prev) => prev?.id === candidateId ? { ...prev, status: newStatus } : prev);
  };

  const allSkills = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];
    if (jobTitleFilter.trim()) {
      const q = jobTitleFilter.toLowerCase();
      result = result.filter((c) =>
        c.title.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) || (c.summary || "").toLowerCase().includes(q));
    }
    if (locationInput.trim()) {
      const q = locationInput.toLowerCase();
      result = result.filter((c) => c.location.toLowerCase().includes(q));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)));
    }
    if (selectedSkills.length > 0) {
      result = result.filter((c) =>
        selectedSkills.every((sel) => c.skills.some((s) => s.toLowerCase() === sel.toLowerCase())));
    }
    if (statusFilter !== "All Status")  result = result.filter((c) => c.status === statusFilter);
    if (locFilter !== "All Locations")  result = result.filter((c) => c.location === locFilter);
    if (sourceFilter !== "All Sources") result = result.filter((c) => c.source === sourceFilter);
    const expRange = EXPERIENCE_RANGES.find((r) => r.label === experienceFilter);
    if (expRange && experienceFilter !== "All Experience") {
      result = result.filter((c) => c.experience >= expRange.min && c.experience <= expRange.max);
    }
    result.sort((a, b) => {
      const aVal = a[sortColumn], bVal = b[sortColumn];
      if (typeof aVal === "string" && typeof bVal === "string")
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [candidates, jobTitleFilter, locationInput, searchQuery, selectedSkills, statusFilter, locFilter, sourceFilter, experienceFilter, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const currentPageCandidates = filteredCandidates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const hasActiveFilters = searchQuery || statusFilter !== "All Status" || locFilter !== "All Locations" ||
    sourceFilter !== "All Sources" || experienceFilter !== "All Experience" || selectedSkills.length > 0;
  const clearAllFilters = () => {
    setSearchQuery(""); setStatusFilter("All Status"); setLocFilter("All Locations");
    setSourceFilter("All Sources"); setExperienceFilter("All Experience"); setSelectedSkills([]); setCurrentPage(1);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto" />
        <p className="mt-3 text-gray-500 text-sm">Loading talent pool…</p>
      </div>
    </div>
  );
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div>
      {(jobTitleFilter || locationInput) && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
          <Search className="w-4 h-4 flex-shrink-0" />
          Filtering talent pool by
          {jobTitleFilter && <strong className="ml-1">"{jobTitleFilter}"</strong>}
          {locationInput && <><span className="mx-1">in</span><strong>"{locationInput}"</strong></>}
        </div>
      )}
      <div className="mb-4">
        <RecruiterSearchBar
          searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
          viewMode={viewMode} onViewModeChange={setViewMode}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
          hasActiveFilters={hasActiveFilters}
          filterCount={selectedSkills.length + (statusFilter !== "All Status" ? 1 : 0) + (locFilter !== "All Locations" ? 1 : 0) + (sourceFilter !== "All Sources" ? 1 : 0) + (experienceFilter !== "All Experience" ? 1 : 0) + (searchQuery ? 1 : 0)}
        />
        {showAdvancedFilters && (
          <RecruiterAdvancedFilters
            statusFilter={statusFilter} onStatusChange={(v) => { setStatusFilter(v); setCurrentPage(1); }} statusOptions={STATUS_OPTIONS}
            locationFilter={locFilter} onLocationChange={(v) => { setLocFilter(v); setCurrentPage(1); }} locationOptions={LOCATION_OPTIONS}
            sourceFilter={sourceFilter} onSourceChange={(v) => { setSourceFilter(v); setCurrentPage(1); }} sourceOptions={SOURCE_OPTIONS}
            experienceFilter={experienceFilter} onExperienceChange={(v) => { setExperienceFilter(v); setCurrentPage(1); }} experienceRanges={EXPERIENCE_RANGES}
            selectedSkills={selectedSkills}
            onToggleSkill={(skill) => { setSelectedSkills((p) => p.includes(skill) ? p.filter((s) => s !== skill) : [...p, skill]); setCurrentPage(1); }}
            skillSearchQuery={skillSearchQuery} onSkillSearchChange={setSkillSearchQuery}
            showSkillsDropdown={showSkillsDropdown} onShowSkillsDropdown={setShowSkillsDropdown}
            filteredSkillOptions={allSkills.filter((s) => s.toLowerCase().includes(skillSearchQuery.toLowerCase()) && !selectedSkills.includes(s))}
            hasActiveFilters={hasActiveFilters} filteredCount={filteredCandidates.length} totalCount={candidates.length} onClearFilters={clearAllFilters}
          />
        )}
      </div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">
          Showing <strong>{currentPageCandidates.length}</strong> of <strong>{filteredCandidates.length}</strong> candidates
        </p>
        {totalPages > 1 && <TalentPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      </div>
      {viewMode === "table" ? (
        <RecruiterTableView
          candidates={currentPageCandidates} selectedCandidates={selectedCandidates}
          onSelectAll={() => setSelectedCandidates(selectedCandidates.length === currentPageCandidates.length ? [] : currentPageCandidates.map((c) => c.id))}
          onSelectCandidate={(id) => setSelectedCandidates((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id])}
          onCandidateClick={setSelectedCandidate}
          sortColumn={sortColumn} sortDirection={sortDirection}
          onSort={(col) => { if (sortColumn === col) setSortDirection(sortDirection === "asc" ? "desc" : "asc"); else { setSortColumn(col); setSortDirection("desc"); } setCurrentPage(1); }}
          getStatusColor={getStatusColor} onClearFilters={clearAllFilters}
        />
      ) : (
        <RecruiterCardView
          candidates={currentPageCandidates} selectedCandidates={selectedCandidates}
          onSelectCandidate={(id) => setSelectedCandidates((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id])}
          onCandidateClick={setSelectedCandidate}
          getStatusColor={getStatusColor} onClearFilters={clearAllFilters}
        />
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <TalentPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
      {selectedCandidate && (
        <RecruiterCandidateDetailPanel
          candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)}
          getStatusColor={getStatusColor} onStatusUpdated={handleStatusUpdated}
        />
      )}
      {showSkillsDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowSkillsDropdown(false)} />}
    </div>
  );
}

function TalentPagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronFirst className="w-4 h-4" /></button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
      <span className="text-sm text-gray-600 px-2">Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronLast className="w-4 h-4" /></button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function RecruiterCandidateSourcing() {
  const [jobTitle, setJobTitle]   = useState("");
  const [location, setLocation]   = useState("");
  const [activeTab, setActiveTab] = useState("linkedin");
  const [results, setResults]     = useState({});
  const [loading, setLoading]     = useState({});
  const [searched, setSearched]   = useState({});
  const [savedIds, setSavedIds]   = useState(new Set());

  const activeTabConfig = TABS.find((t) => t.id === activeTab);
  const currentResults  = results[activeTab] || [];
  const isLoading       = loading[activeTab] || false;
  const hasSearched     = searched[activeTab] || false;

  const doSearch = async (tabId) => {
    if (!jobTitle.trim()) { toast.error("Please enter a job title"); return; }
    const tabCfg = TABS.find((t) => t.id === tabId);
    if (!tabCfg?.source) return;
    setLoading((l) => ({ ...l, [tabId]: true }));
    try {
      const data = await searchCandidates({ job_title: jobTitle, location, source: tabCfg.source });
      const parsed = data
        .filter((item) => item.name && item.name.trim() !== "")
        .map((item) => parseSearchResult(item));
      setResults((r) => ({ ...r, [tabId]: parsed }));
      setSearched((s) => ({ ...s, [tabId]: true }));
    } catch (err) {
      toast.error(err?.message || `Failed to search ${tabCfg.label}`);
    } finally {
      setLoading((l) => ({ ...l, [tabId]: false }));
    }
  };

  const handleSearch = () => {
    if (activeTab !== "talent-pool") doSearch(activeTab);
    else setSearched((s) => ({ ...s, "talent-pool": true }));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== "talent-pool" && jobTitle.trim() && !searched[tabId]) doSearch(tabId);
  };

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Sourcing</h1>
              <p className="text-sm text-gray-500">Search across LinkedIn, Naukri, Indeed, GitHub & your Talent Pool</p>
            </div>
          </div>

          {/* Search inputs */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Job Title / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="e.g. React Developer, Data Scientist..."
                  value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="e.g. Coimbatore, Bangalore, Remote..."
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" />
              </div>
            </div>
            <button onClick={handleSearch} disabled={isLoading || !jobTitle.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-sm">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
            {hasSearched && activeTab !== "talent-pool" && (
              <button onClick={() => doSearch(activeTab)}
                className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = tab.id === "talent-pool" ? null : (results[tab.id]?.length ?? null);
              return (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm whitespace-nowrap relative transition-colors ${isActive ? tab.color : "text-gray-500 hover:text-gray-800"}`}>
                  {tab.icon}
                  {tab.label}
                  {count !== null && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab.badgeBg}`}>{count}</span>}
                  {loading[tab.id] && <Loader2 className="w-3 h-3 animate-spin" />}
                  {isActive && <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.underline}`} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "talent-pool" ? (
          <TalentPoolTab jobTitleFilter={jobTitle} locationFilter={location} />
        ) : (
          <>
            {hasSearched && !isLoading && currentResults.length > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                Found <strong className="text-gray-900">{currentResults.length}</strong> candidates
                {jobTitle && <> for <strong className="text-gray-900">"{jobTitle}"</strong></>}
                {location && <> in <strong className="text-gray-900">"{location}"</strong></>}
                {" "}on <strong>{activeTabConfig?.label}</strong>
              </p>
            )}

            {/* Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-72">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                      <div className="h-3 bg-gray-200 rounded w-4/6" />
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(3)].map((_, j) => <div key={j} className="h-5 w-14 bg-gray-200 rounded" />)}
                    </div>
                    <div className="h-9 bg-gray-200 rounded-lg mt-auto" />
                  </div>
                ))}
              </div>
            )}

            {/* Results — use items-stretch so all cards in a row are equal height */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
                {currentResults.length > 0
                  ? currentResults.map((result) => (
                      <ExternalResultCard
                        key={result.id} result={result} tabId={activeTab}
                        saved={savedIds.has(result.id)} onSave={toggleSave}
                      />
                    ))
                  : <EmptyState searched={hasSearched} />
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}