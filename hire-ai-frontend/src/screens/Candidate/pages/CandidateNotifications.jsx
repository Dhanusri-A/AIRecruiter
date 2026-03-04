"use client";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Briefcase, Star, User, Settings, Check } from "lucide-react";
import { useState } from "react";

const mockNotifications = [
  {
    id: 1,
    type: "match",
    title: "New Job Match!",
    message: "TechNova Solutions is looking for a Senior React Developer that matches your profile.",
    timestamp: "10 minutes ago",
    read: false,
    icon: Star,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: 2,
    type: "application",
    title: "Application Viewed",
    message: "Your application for Frontend Developer at TechBit Solutions was viewed by the employer.",
    timestamp: "2 hours ago",
    read: false,
    icon: Briefcase,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    type: "status",
    title: "Application Shortlisted",
    message: "Congratulations! You've been shortlisted for Technical Content Writer at EduFuture Academy.",
    timestamp: "1 day ago",
    read: true,
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 4,
    type: "profile",
    title: "Profile Reminder",
    message: "Complete your profile to increase your chances of getting matched with employers.",
    timestamp: "2 days ago",
    read: true,
    icon: User,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No notifications
          </h3>
          <p className="text-slate-500">
            {"We'll"} notify you when something important happens
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start gap-4 p-4 md:p-5 cursor-pointer transition-colors ${
                  !notification.read
                    ? "bg-blue-50/50 hover:bg-blue-50"
                    : "hover:bg-slate-50"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-semibold ${
                        !notification.read ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Settings Link */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <Settings className="w-4 h-4" />
          Notification settings
        </button>
      </div>
    </motion.div>
  );
}
