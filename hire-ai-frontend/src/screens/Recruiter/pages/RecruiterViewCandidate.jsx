"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  FileText,
  Star,
  BookmarkPlus,
  MessageSquare,
  Calendar,
  Award,
  User,
  Download,
  CheckCircle,
} from "lucide-react";

export default function RecruiterViewCandidate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const candidate = state?.candidate;

  // Mock candidate data if none provided
  const mockCandidate = {
    id: "c1",
    fullName: "Oscar Fernandas",
    title: "Full Stack Developer | React & Node.js",
    email: "oscar.kumar.dev@gmail.com",
    phone: "+91 98765 43210",
    location: "Tiruppur, Tamil Nadu",
    linkedin: "linkedin.com/in/oscar-kumar-dev",
    github: "github.com/oscarkdev",
    profileSummary: `Passionate full-stack developer with 3+ years of experience building scalable web applications.
Specialized in React, Next.js, Node.js, Express, MongoDB and modern UI libraries.
Always eager to learn new technologies and deliver clean, maintainable code.`,
    skills: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "TypeScript", "Git", "REST API", "AWS Basics"],
    languages: ["English", "Hindi", "Tamil"],
    education: [
      {
        degree: "B.Tech Computer Science & Engineering",
        institution: "Anna University",
        year: "2018 - 2022",
        percentage: "8.4 CGPA"
      }
    ],
    experience: [
      {
        role: "Frontend Developer",
        company: "TechBit Solutions",
        duration: "Jan 2023 - Present",
        responsibilities: [
          "Developed and maintained 5+ client-facing React applications",
          "Improved page load time by 40% using code splitting & lazy loading",
          "Implemented modern state management with Zustand & React Query"
        ]
      },
      {
        role: "Web Development Intern",
        company: "StartUp Innovations",
        duration: "Jun 2022 - Dec 2022",
        responsibilities: [
          "Built responsive landing pages with HTML, CSS, JavaScript",
          "Collaborated with backend team to integrate REST APIs"
        ]
      }
    ],
    projects: [
      {
        title: "E-commerce Dashboard",
        year: "2024",
        role: "Lead Developer",
        description: "Full-stack admin dashboard with product management, order tracking, analytics. Built with Next.js 14, Tailwind, Prisma & PostgreSQL."
      },
      {
        title: "TaskFlow - Kanban Board",
        year: "2023",
        role: "Solo Developer",
        description: "Drag-and-drop task management app similar to Trello. React + Firebase + Tailwind."
      }
    ],
    matchScore: 92,
    appliedDate: "2025-01-20",
    status: "Shortlisted"
  };

  const profile = candidate || mockCandidate;

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <User className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          No Candidate Selected
        </h2>
        <p className="text-slate-500 mb-6">
          Please go back and select a candidate to view their profile.
        </p>
        <button
          onClick={() => navigate("/recruiter")}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Candidates
      </button>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6"
      >
        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600" />
        
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar and basic info */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl font-bold text-emerald-600 border-4 border-white">
                {profile.fullName?.charAt(0) || "U"}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-800">{profile.fullName}</h1>
                <p className="text-emerald-600 font-medium">{profile.title}</p>
              </div>
            </div>

            {/* Match Score Badge */}
            {profile.matchScore && (
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                <Star className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                <span className="text-emerald-700 font-semibold">{profile.matchScore}% Match</span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <Mail className="w-4 h-4" />
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <Phone className="w-4 h-4" />
                {profile.phone}
              </a>
            )}
            {profile.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-4 flex gap-3">
            {profile.linkedin && (
              <a
                href={`https://${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {profile.github && (
              <a
                href={`https://${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
              <MessageSquare className="w-4 h-4" />
              Contact Candidate
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              <BookmarkPlus className="w-4 h-4" />
              Shortlist
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium">
              <Download className="w-4 h-4" />
              Download Resume
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <FileText className="w-5 h-5 text-emerald-600" />
              Professional Summary
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.profileSummary || profile.profile || "No summary provided."}
            </p>
          </motion.div>

          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              Work Experience
            </h2>
            <div className="space-y-6">
              {(profile.experience || profile.workExperience || []).map((exp, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-emerald-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-500" />
                  <h3 className="font-semibold text-slate-800">{exp.role}</h3>
                  <p className="text-emerald-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {exp.duration}
                  </p>
                  {exp.responsibilities && (
                    <ul className="mt-3 space-y-2">
                      {exp.responsibilities.map((resp, ri) => (
                        <li key={ri} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {(!profile.experience && !profile.workExperience) || (profile.experience || profile.workExperience || []).length === 0 ? (
                <p className="text-slate-500 italic">No work experience listed.</p>
              ) : null}
            </div>
          </motion.div>

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <Code className="w-5 h-5 text-emerald-600" />
                Projects
              </h2>
              <div className="space-y-4">
                {profile.projects.map((proj, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-slate-800">{proj.title}</h3>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        {proj.year}
                      </span>
                    </div>
                    {proj.role && (
                      <p className="text-sm text-emerald-600 font-medium mt-1">{proj.role}</p>
                    )}
                    <p className="text-sm text-slate-600 mt-2">{proj.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <Code className="w-5 h-5 text-emerald-600" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
              {(!profile.skills || profile.skills.length === 0) && (
                <p className="text-slate-500 italic text-sm">No skills listed.</p>
              )}
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <Globe className="w-5 h-5 text-emerald-600" />
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {(profile.languages || []).map((lang, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {lang}
                </span>
              ))}
              {(!profile.languages || profile.languages.length === 0) && (
                <p className="text-slate-500 italic text-sm">No languages listed.</p>
              )}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              Education
            </h2>
            <div className="space-y-4">
              {(profile.education || []).map((edu, i) => (
                <div key={i} className="border-l-2 border-emerald-200 pl-4">
                  <h3 className="font-medium text-slate-800">{edu.degree}</h3>
                  <p className="text-sm text-emerald-600">{edu.institution}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {edu.year || edu.years}
                    {edu.percentage && ` | ${edu.percentage}`}
                  </p>
                </div>
              ))}
              {(!profile.education || profile.education.length === 0) && (
                <p className="text-slate-500 italic text-sm">No education listed.</p>
              )}
            </div>
          </motion.div>

          {/* Application Status */}
          {(profile.appliedDate || profile.status) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <Award className="w-5 h-5 text-emerald-600" />
                Application Info
              </h2>
              {profile.appliedDate && (
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-medium">Applied:</span> {profile.appliedDate}
                </p>
              )}
              {profile.status && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  profile.status === "Shortlisted" 
                    ? "bg-emerald-100 text-emerald-700"
                    : profile.status === "Under Review"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-700"
                }`}>
                  <CheckCircle className="w-4 h-4" />
                  {profile.status}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
