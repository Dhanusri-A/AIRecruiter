// screens/Recruiter/pages/RecruiterLandingPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target, Calendar, Users, FileText, Zap, Activity,
  CheckCircle, ChevronRight, Sparkles, Loader2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getRecruiterCount } from "../../../api/api";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: EASE },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

// ─── Skeleton for stats while loading ────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-gray-100 mb-4" />
      <div className="h-8 w-16 bg-gray-100 rounded mb-2" />
      <div className="h-3 w-20 bg-gray-100 rounded" />
    </div>
  );
}

export default function RecruiterLandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState(null);   // raw API response
  const [statsLoading, setStatsLoading] = useState(true);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch recruiter counts
  useEffect(() => {
    if (!user?.id) return;
    setStatsLoading(true);
    getRecruiterCount(user.id)
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load recruiter stats:", err))
      .finally(() => setStatsLoading(false));
  }, [user?.id]);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const wish =
    hour < 12
      ? "Let's kickstart a productive hiring day."
      : hour < 17
      ? "Hope your recruitment pipeline is flowing smoothly."
      : "Wrap up strong and plan your next great hire.";

  const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ── Derived display values from API ────────────────────────────────────────
  const pipeline = stats?.status ?? {};
  const pipelineSteps = [
    { label: "Sourced",   key: "sourced"   },
    { label: "Matched",   key: "matched"   },
    { label: "Screening", key: "screening" },
    { label: "Interview", key: "interview" },
    { label: "Offer",     key: "offer"     },
    { label: "Hired",     key: "hired"     },
  ];

  const topStatCards = [
    {
      label: "Sourced",
      val: statsLoading ? null : (stats?.status?.sourced ?? 0),
      icon: Target,
      color: "emerald",
    },
    {
      label: "Interviews",
      val: statsLoading ? null : (stats?.interviews ?? 0),
      icon: Calendar,
      color: "blue",
    },
    {
      label: "Active Talent",
      val: statsLoading ? null : (stats?.candidates ?? 0),
      icon: Users,
      color: "purple",
    },
    {
      label: "Offers",
      val: statsLoading ? null : (stats?.status?.offer ?? 0),
      icon: FileText,
      color: "orange",
    },
  ];

  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue:    "bg-blue-50 text-blue-600",
    purple:  "bg-purple-50 text-purple-600",
    orange:  "bg-orange-50 text-orange-600",
  };

  return (
    <div className="space-y-10 pb-10">
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeIn}
        className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm transform-gpu"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Active Recruiter Session
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <motion.h1
                initial="hidden" animate="visible" variants={fadeUp}
                className="text-4xl font-black text-gray-900 tracking-tight leading-tight transform-gpu"
              >
                {greeting},{" "}
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                  className="text-emerald-600 inline-block"
                >
                  {user?.full_name?.split(" ")[0]}
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg mt-1 max-w-xl"
              >
                {wish}
              </motion.p>
            </div>

            {/* Live clock */}
            <motion.div
              variants={fadeIn} initial="hidden" animate="visible"
              className="flex items-center gap-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-4 rounded-2xl shadow-lg"
            >
              <div className="flex flex-col leading-none">
                <span className="text-xs uppercase tracking-widest text-gray-400">Local Time</span>
                <span className="text-2xl font-black tracking-tight">{formattedTime}</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="flex flex-col text-right leading-none">
                <span className="text-xs text-gray-400">
                  {now.toLocaleDateString(undefined, { weekday: "long" })}
                </span>
                <span className="text-xs font-semibold">
                  {now.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI Match banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 shadow-xl shadow-emerald-100 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {statsLoading
                  ? "Loading your pipeline…"
                  : `${stats?.interviews ?? 0} interview${(stats?.interviews ?? 0) !== 1 ? "s" : ""} booked · ${stats?.candidates ?? 0} active candidates`}
              </h3>
              <p className="text-emerald-50 opacity-90">
                Your hiring pipeline is ready for action.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/recruiter/talent-pool")}
            className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Review Pipeline <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.section>

      {/* ── 2. STATS + FOCUS ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading
            ? [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
            : topStatCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 transition-shadow duration-300 hover:shadow-xl cursor-pointer transform-gpu"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorMap[stat.color]}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    {stat.val ?? "—"}
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Focus widget */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">Today's Focus</span>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <h4 className="font-bold text-blue-900 text-xs">
              {statsLoading
                ? "Loading…"
                : stats?.interviews
                ? `${stats.interviews} interview${stats.interviews !== 1 ? "s" : ""} scheduled`
                : "No interviews today"}
            </h4>
            <p className="text-[10px] text-blue-600 mt-0.5">
              {statsLoading ? "" : stats?.status?.screening
                ? `${stats.status.screening} candidate${stats.status.screening !== 1 ? "s" : ""} in screening`
                : "Pipeline up to date"}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. ACTION BUTTONS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={() => navigate("/recruiter/resume-match")}
          className="flex items-center justify-center gap-3 py-6 bg-white border-2 border-gray-100 rounded-3xl font-black text-gray-900 hover:border-emerald-500 hover:bg-emerald-50 transition-colors shadow-sm transform-gpu"
        >
          <Zap className="w-5 h-5 text-emerald-500" /> Match Resumes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={() => navigate("/recruiter/candidate-sourcing")}
          className="flex items-center justify-center gap-3 py-6 bg-white border-2 border-gray-100 rounded-3xl font-black text-gray-900 hover:border-emerald-500 hover:bg-emerald-50 transition-colors shadow-sm transform-gpu"
        >
          <Target className="w-5 h-5 text-emerald-500" /> Source Talent
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={() => navigate("/recruiter/my-jobs")}
          className="flex items-center justify-center gap-3 py-6 bg-white border-2 border-gray-100 rounded-3xl font-black text-gray-900 hover:border-emerald-500 hover:bg-emerald-50 transition-colors shadow-sm transform-gpu"
        >
          <FileText className="w-5 h-5 text-emerald-500" /> My Jobs
        </motion.button>
      </div>

      {/* ── 4. HIRING PIPELINE ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hiring Pipeline</h2>
            <p className="text-gray-400 text-sm font-medium">Real-time status of your recruitment funnel</p>
          </div>
          <button
            onClick={() => navigate("/recruiter/talent-pool")}
            className="text-emerald-600 font-bold text-sm hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
          >
            View All Details
          </button>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center animate-pulse">
                <div className="h-10 w-12 bg-gray-200 rounded mx-auto mb-2" />
                <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pipelineSteps.map((step, i) => {
              const count = pipeline[step.key] ?? 0;
              const isActive = count > 0;
              return (
                <motion.div
                  key={step.key}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  onClick={() => navigate("/recruiter/talent-pool")}
                  className={`rounded-2xl p-6 text-center border cursor-pointer transform-gpu transition-all ${
                    isActive
                      ? "bg-emerald-50 border-emerald-200 hover:shadow-lg hover:bg-white"
                      : "bg-gray-50/50 border-transparent hover:border-emerald-200 hover:bg-white hover:shadow-lg"
                  }`}
                >
                  <div className={`text-4xl font-black mb-2 ${isActive ? "text-emerald-700" : "text-gray-400"}`}>
                    {count}
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? "text-emerald-600" : "text-gray-400"}`}>
                    {step.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex items-center gap-4 p-5 bg-emerald-50 rounded-3xl border border-emerald-100/50">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-emerald-900 font-bold text-sm block">
              {statsLoading ? "Loading pipeline health…" : "Pipeline Health: Active"}
            </span>
            <span className="text-emerald-700 text-xs">
              {statsLoading
                ? ""
                : stats
                ? `${stats.candidates ?? 0} candidates across ${Object.values(stats.status ?? {}).filter((v) => v > 0).length} active stages.`
                : "No data available yet."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}