"use client";

import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../pages/CandidateNavbar";
import Sidebar from "../pages/CandidateSidebar";
import { Menu } from "lucide-react";

// Routes where we want a completely bare full-screen layout (no nav/sidebar/footer)
const FULLSCREEN_ROUTES = ["/candidate/ai-interview"];

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if current route should be fullscreen (no chrome)
  const isFullscreen = FULLSCREEN_ROUTES.some((r) =>
    location.pathname.startsWith(r)
  );

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bare fullscreen layout — just the page, nothing else
  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white border-r border-gray-200 shadow-sm
        `}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 px-4 py-3 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50/70">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-gray-500 text-center md:text-left">
                © {new Date().getFullYear()} Candidate Profile AI. All rights
                reserved.
              </p>
              <nav className="flex flex-wrap justify-center md:justify-end gap-5 md:gap-7 text-sm">
                <Link to="/privacy" className="text-gray-600 hover:text-blue-700 transition-colors">Privacy</Link>
                <Link to="/terms" className="text-gray-600 hover:text-blue-700 transition-colors">Terms</Link>
                <Link to="/refund" className="text-gray-600 hover:text-blue-700 transition-colors">Refund Policy</Link>
                <Link to="/contact" className="text-gray-600 hover:text-blue-700 transition-colors">Contact</Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}