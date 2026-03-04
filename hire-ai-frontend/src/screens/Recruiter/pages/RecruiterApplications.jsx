"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  MapPin,
  Mail,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Filter,
} from "lucide-react";

const mockApplications = [
  {
    id: "app1",
    candidate: {
      fullName: "Rahul Menon",
      title: "Backend Engineer",
      email: "rahul.menon@email.com",
      location: "Chennai, Tamil Nadu",
      experience: "4+ years",
    },
    jobTitle: "Senior React Developer",
    appliedDate: "2025-01-18",
    status: "Under Review",
  },
  {
    id: "app2",
    candidate: {
      fullName: "Ananya Reddy",
      title: "Data Analyst",
      email: "ananya.reddy@email.com",
      location: "Hyderabad, Telangana",
      experience: "2+ years",
    },
    jobTitle: "UI/UX Designer",
    appliedDate: "2025-01-17",
    status: "Shortlisted",
  },
  {
    id: "app3",
    candidate: {
      fullName: "Vikram Patel",
      title: "Full Stack Developer",
      email: "vikram.patel@email.com",
      location: "Mumbai, Maharashtra",
      experience: "5+ years",
    },
    jobTitle: "Senior React Developer",
    appliedDate: "2025-01-16",
    status: "Rejected",
  },
  {
    id: "app4",
    candidate: {
      fullName: "Sneha Gupta",
      title: "Frontend Developer",
      email: "sneha.gupta@email.com",
      location: "Delhi, NCR",
      experience: "3+ years",
    },
    jobTitle: "Senior React Developer",
    appliedDate: "2025-01-15",
    status: "Under Review",
  },
];

export default function Applications() {
  const [statusFilter, setStatusFilter] = useState("");

  const filteredApplications = mockApplications.filter(
    (app) => !statusFilter || app.status === statusFilter
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Under Review":
        return "bg-blue-100 text-blue-700";
      case "Shortlisted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Under Review":
        return <Clock className="w-3.5 h-3.5" />;
      case "Shortlisted":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "Rejected":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-slate-500">
            Review and manage candidate applications
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{mockApplications.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-blue-600">
            {mockApplications.filter((a) => a.status === "Under Review").length}
          </p>
          <p className="text-sm text-slate-500">Under Review</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-green-600">
            {mockApplications.filter((a) => a.status === "Shortlisted").length}
          </p>
          <p className="text-sm text-slate-500">Shortlisted</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-red-600">
            {mockApplications.filter((a) => a.status === "Rejected").length}
          </p>
          <p className="text-sm text-slate-500">Rejected</p>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                      {app.candidate.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {app.candidate.fullName}
                      </h3>
                      <p className="text-slate-600">{app.candidate.title}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {app.candidate.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {app.candidate.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job & Status */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                    <span className="text-sm text-slate-500">
                      For: <span className="font-medium text-slate-700">{app.jobTitle}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      Applied {formatDate(app.appliedDate)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {app.status === "Under Review" && (
                      <>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                          <Star className="w-4 h-4" />
                          Shortlist
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                  <button className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No applications found
          </h3>
          <p className="text-slate-500">
            {statusFilter
              ? `No applications with "${statusFilter}" status`
              : "You haven't received any applications yet"}
          </p>
        </div>
      )}
    </div>
  );
}
