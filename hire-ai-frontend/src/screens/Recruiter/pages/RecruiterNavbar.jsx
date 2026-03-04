"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Calendar, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecruiterNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [username, setUsername] = useState("Recruiter");
  const [userInitial, setUserInitial] = useState("R");
  const notificationRef = useRef(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const notifications = [
    {
      id: 1,
      title: "New application received",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "5 candidates matched your job post",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Job post approved",
      time: "3 hours ago",
      read: true,
    },
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setUserInitial(storedUsername.charAt(0).toUpperCase());
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side - Date */}
      <div className="hidden sm:flex items-center gap-2 text-slate-600">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{currentDate}</span>
      </div>

      {/* Right side - Notifications & Profile */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-emerald-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className={!notification.read ? "" : "ml-5"}>
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
                to="/recruiter/notifications"
                className="block p-3 text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:bg-slate-50 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <Link
          to="/recruiter/profile"
          className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">
            {userInitial}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {username}
            </p>
            <p className="text-xs text-slate-500">Recruiter</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
        </Link>
      </div>
    </div>
  );
}
