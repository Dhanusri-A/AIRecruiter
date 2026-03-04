// screens/Recruiter/RecruiterRootLayout.jsx
"use client";

import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Briefcase,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import amzLogo from "../../../assets/images/amz-logo.png";


export default function RecruiterRootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Navigation structure
  const navSections = [
    {
      title: "Jobs",
      links: [
        { label: "Generate Job Description", to: "/recruiter/generate-jd" },
        { label: "My Listings", to: "/recruiter/my-jobs" },
      ],
    },
    {
      title: "Sourcing",
      links: [
        { label: "Candidate Sourcing", to: "/recruiter/candidate-sourcing" },
        { label: "Talent Pool", to: "/recruiter/talent-pool" },
      ],
    },
    {
      title: "Candidates",
      links: [
        // { label: "Search Talent", to: "/recruiter" },
        { label: "Create Profile", to: "/recruiter/create-profile" },
        { label: "Upload Resume", to: "/recruiter/upload-resume" },
        { label: "Reformat Resume", to: "/recruiter/reformat-resume/upload" },
        { label: "Resume Matcher", to: "/recruiter/resume-match" },
      ],
    },
    {
      title: "Screening",
      links: [
        { label: "Schedule Interview", to: "/recruiter/schedule-interview" },
      ],
    },
    // {
    //   title: "Company",
    //   links: [
    //     { label: "Profile", to: "/recruiter/profile" },
    //     { label: "Help Center", to: "/recruiter/contact" },
    //   ],
    // },
  ];

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-[60] bg-white border-b border-gray-200 h-16 px-0 md:px-0">
        <div className="max-w-7xl px-6 mx-auto h-full flex items-center justify-between">
          {/* Left: Mobile Toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-150 active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <Link
              to="/recruiter"
              className="flex items-center gap-2 transition-transform duration-150 active:scale-95"
            >
              <div className="w-auto h-auto rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-150">
                <img src={amzLogo} alt="AMZ.AI"  className=" w-40 h-10 object-contain" />
              </div>
              {/* <span className="text-lg font-bold text-gray-900 hidden sm:block">
                Hire AI
              </span> */}
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 h-full">
            {navSections.map((section) => (
              <div
                key={section.title}
                className="relative group flex items-center h-full cursor-pointer"
              >
                <div className="flex items-center gap-1 text-gray-600 group-hover:text-emerald-600 font-semibold transition-colors">
                  <span>{section.title}</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </div>

                {/* Desktop Dropdown */}
                <div className="absolute top-full left-0 min-w-[220px] bg-white border border-gray-100 shadow-xl rounded-b-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2 z-50">
                  {section.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-150 hover:pl-5"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Right: User Profile Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-3 cursor-pointer select-none">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-tight transition-colors duration-150 group-hover:text-emerald-600">
                  {user?.full_name || user?.username || "Recruiter"}
                </p>
                <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold">
                  Premium
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-emerald-100 shadow-sm transition-all duration-150 group-hover:shadow-md group-hover:scale-105">
                {getInitials(user?.full_name || user?.username || "R")}
              </div>
            </div>

            {/* Desktop User Dropdown */}
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              {/* <button
                onClick={() => navigate("/recruiter/profile")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-all duration-150 hover:pl-5"
              >
                <UserIcon size={16} />
                View Profile
              </button> */}

              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 rounded-b-xl hover:pl-5"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Header */}
          <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Briefcase className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Hire AI</p>
                <p className="text-xs text-emerald-100">Navigation Menu</p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-150 active:scale-90"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* User Info Card */}
          <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold shadow-sm">
                {getInitials(user?.full_name || user?.username || "R")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold mt-0.5">
                  Premium Plan
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {navSections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className={`transform transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${sectionIndex * 50}ms` }}
              >
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.links.map((link, linkIndex) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        style={{
                          transitionDelay: isMobileMenuOpen
                            ? `${(sectionIndex * section.links.length + linkIndex) * 30}ms`
                            : "0ms",
                        }}
                      >
                        <span>{link.label}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isActive
                              ? "translate-x-0"
                              : "-translate-x-1 opacity-0"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
            <button
              onClick={() => {
                navigate("/recruiter/profile");
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:shadow-md transition-all duration-150 active:scale-95"
            >
              <UserIcon size={16} />
              View Profile
            </button>

            <button
              onClick={() => {
                setShowLogoutDialog(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 hover:shadow-md transition-all duration-150 active:scale-95"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>
      </div>
      {/* PAGE CONTENT */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* LOGOUT CONFIRMATION DIALOG */}
      <div
        className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-200 ${
          showLogoutDialog ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
            showLogoutDialog ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowLogoutDialog(false)}
        />

        {/* Dialog Box */}
        <div
          className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-200 ${
            showLogoutDialog ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to log out of your account?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all duration-150 active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                logout();
                setShowLogoutDialog(false);
                navigate("/recruiter-signin", { replace: true });
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-150 shadow-sm hover:shadow-md active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
