"use client";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Star,
  User,
  LogOut,
  ChevronRight,
  PlusCircle,
  FileText,
} from "lucide-react";

const navItems = [
  {
    name: "Candidates",
    icon: Users,
    path: "/recruiter",
  },
  {
    name: "Post a Job",
    icon: PlusCircle,
    path: "/recruiter/post-job",
  },
  {
    name: "My Jobs",
    icon: Briefcase,
    path: "/recruiter/my-jobs",
  },
  {
    name: "Shortlisted",
    icon: Star,
    path: "/recruiter/shortlisted",
  },
  {
    name: "Applications",
    icon: FileText,
    path: "/recruiter/applications",
  },
  {
    name: "Profile",
    icon: User,
    path: "/recruiter/profile",
  },
];

export default function RecruiterSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/recruiter-signin");
  };

  return (
    <div className="h-dvh flex flex-col bg-slate-900 text-white sticky top-0 shadow-lg">
      {/* Header / Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-white font-semibold text-lg">Recruiter Portal</span>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
              <span>{item.name}</span>

              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
