"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Edit2,
  Building2,
  Users,
  Briefcase,
  Calendar,
} from "lucide-react";

const mockProfile = {
  fullName: "John Smith",
  title: "Senior HR Manager",
  companyName: "TechNova Solutions Pvt Ltd",
  email: "john.smith@technova.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka",
  linkedin: "linkedin.com/in/johnsmith-hr",
  website: "www.technova.com",
  companyDescription: `TechNova Solutions is a leading software development company specializing in enterprise solutions, 
cloud services, and digital transformation. We have a team of 200+ talented professionals working on cutting-edge technologies.`,
  industry: "Information Technology",
  companySize: "200-500 employees",
  founded: "2015",
  jobsPosted: 12,
  activeJobs: 5,
  totalApplications: 248,
  hiredCandidates: 34,
};

export default function RecruiterProfile() {
  const [editMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500" />

        <div className="p-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar & Info */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                <Building2 className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {mockProfile.fullName}
                </h1>
                <p className="text-emerald-600 font-medium">{mockProfile.title}</p>
                <p className="text-slate-500">{mockProfile.companyName}</p>
              </div>
            </div>

            {/* Actions */}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm">
            <a
              href={`mailto:${mockProfile.email}`}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {mockProfile.email}
            </a>
            <a
              href={`tel:${mockProfile.phone}`}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {mockProfile.phone}
            </a>
            <span className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              {mockProfile.location}
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-4">
            {mockProfile.linkedin && (
              <a
                href={`https://${mockProfile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {mockProfile.website && (
              <a
                href={`https://${mockProfile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockProfile.jobsPosted}</p>
              <p className="text-sm text-slate-500">Jobs Posted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockProfile.activeJobs}</p>
              <p className="text-sm text-slate-500">Active Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockProfile.totalApplications}</p>
              <p className="text-sm text-slate-500">Applications</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockProfile.hiredCandidates}</p>
              <p className="text-sm text-slate-500">Hired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-600" />
          About Company
        </h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">
          {mockProfile.companyDescription}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <Briefcase className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm text-slate-500">Industry</p>
              <p className="font-medium text-slate-900">{mockProfile.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <Users className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm text-slate-500">Company Size</p>
              <p className="font-medium text-slate-900">{mockProfile.companySize}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm text-slate-500">Founded</p>
              <p className="font-medium text-slate-900">{mockProfile.founded}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
