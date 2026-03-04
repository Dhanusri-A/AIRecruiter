'use client';

import { useState, useEffect, useRef } from "react";
import { Bell, Calendar, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Adjust path to your AuthContext

export default function Navbar() {
  const { user, loading: authLoading } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Derived from auth context
  // console.log("Auth user:", JSON.stringify(user, null, 2));
  const displayName = user?.username || user?.name || "Candidate";
  const userInitial = displayName.charAt(0).toUpperCase();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Mock notifications (replace with real API call later if needed)
  const notifications = [
    {
      id: 1,
      title: "New job match found",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Your application was viewed",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Profile update reminder",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optional: show loading state or fallback while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-end w-full">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left - Date (hidden on small mobile) */}
      <div className="hidden sm:flex items-center gap-2 text-slate-500">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{currentDate}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 transform origin-top-right transition-all duration-200 scale-95">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
                <h3 className="font-semibold text-slate-900 text-base">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="w-2.5 h-2.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <div className={!notification.read ? "" : "ml-5.5"}>
                        <p className="text-sm font-medium text-slate-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/candidate/notifications"
                className="block px-5 py-4 text-center text-sm font-medium text-blue-600 hover:bg-slate-50 border-t border-slate-100 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* User profile */}
        <Link
          to="/candidate/profile"
          className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-blue-100">
            {userInitial}
          </div>

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
              {displayName}
            </p>
            <p className="text-xs text-slate-500">Candidate</p>
          </div>

          <ChevronDown className="hidden md:block w-4 h-4 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}