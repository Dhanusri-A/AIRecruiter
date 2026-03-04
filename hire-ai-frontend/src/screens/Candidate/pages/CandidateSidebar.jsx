'use client';

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Bookmark,
  CheckSquare,
  User,
  Star,
  LogOut,
  X,
  Calendar
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";           // adjust path as needed
import toast from "react-hot-toast";

const navItems = [
  {
    name: "My Interviews",
    icon: Calendar,
    path: "/candidate",
  },
  {
    name: "Jobs",
    icon: Briefcase,
    path: "/candidate/jobs",
  },
  {
    name: "Saved Jobs",
    icon: Bookmark,
    path: "/candidate/saved-jobs",
  },
  {
    name: "Applied Jobs",
    icon: CheckSquare,
    path: "/candidate/applied-jobs",
  },
  {
    name: "Matched Jobs",
    icon: Star,
    path: "/candidate/matched-jobs",
  },
  {
    name: "Profile",
    icon: User,
    path: "/candidate/profile",
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();   // ← get logout from context

  const handleLogout = () => {
    // Clear auth state and localStorage
    authLogout();

    // Optional: show success message
    toast.success("Logged out successfully", {
      position: "top-center",
      duration: 3000,
    });

    // Redirect to candidate sign-in
    navigate("/candidate-signin", { replace: true });

    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-white text-gray-800 border-r border-gray-200 shadow-sm sticky top-0 z-30">
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-md text-white">
            C
          </div>
          <div>
            <h1 className="font-semibold text-xl tracking-tight text-gray-900">
              Candidate Portal
            </h1>
            <p className="text-xs text-gray-500">Find your dream job</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-700 border border-transparent hover:border-gray-200"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                }`}
              />
              <span>{item.name}</span>

              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-transparent hover:border-red-100 group"
        >
          <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}