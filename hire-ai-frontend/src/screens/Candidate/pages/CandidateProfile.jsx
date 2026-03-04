"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Edit2,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Globe,
  FileText,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const mockProfile = {
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

  skills: [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Tailwind CSS",
    "TypeScript",
    "Git",
    "REST API",
    "AWS Basics",
  ],

  education: [
    {
      degree: "B.Tech Computer Science & Engineering",
      institution: "Anna University",
      year: "2018 - 2022",
      percentage: "8.4 CGPA",
    },
  ],

  experience: [
    {
      role: "Frontend Developer",
      company: "TechBit Solutions",
      duration: "Jan 2023 - Present",
      responsibilities: [
        "Developed and maintained 5+ client-facing React applications",
        "Improved page load time by 40% using code splitting & lazy loading",
        "Implemented modern state management with Zustand & React Query",
      ],
    },
    {
      role: "Web Development Intern",
      company: "StartUp Innovations",
      duration: "Jun 2022 - Dec 2022",
      responsibilities: [
        "Built responsive landing pages with HTML, CSS, JavaScript",
        "Collaborated with backend team to integrate REST APIs",
      ],
    },
  ],

  projects: [
    {
      title: "E-commerce Dashboard",
      year: "2024",
      description:
        "Full-stack admin dashboard with product management, order tracking, analytics. Built with Next.js 14, Tailwind, Prisma & PostgreSQL.",
    },
    {
      title: "TaskFlow - Kanban Board",
      year: "2023",
      description:
        "Drag-and-drop task management app similar to Trello. React + Firebase + Tailwind.",
    },
  ],
};

export default function CandidateProfile() {
  const navigate = useNavigate();
  const [editMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header Card */}
      <div className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] overflow-hidden">
        {/* Cover */}
        <div className="h-32 md:h-40 bg-gradient-to-r from-[#2B7FFF] via-[#1E90FF] to-[#10B981]" />

        {/* Profile Info */}
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-12 md:-mt-16">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#2B7FFF] to-[#1E90FF] flex items-center justify-center text-white text-3xl md:text-4xl font-bold ring-4 ring-[#151B35] shadow-xl">
                {mockProfile.fullName.charAt(0)}
              </div>
              <div className="pb-2 md:pb-4">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {mockProfile.fullName}
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  {mockProfile.title}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigate("/candidate/profile/edit")
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1A2342] text-gray-300 rounded-xl font-medium hover:bg-[#1E2A4A] transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2B7FFF] to-[#1E90FF] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#2B7FFF]/25 transition-all">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Resume</span>
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a
              href={`mailto:${mockProfile.email}`}
              className="flex items-center gap-2 text-gray-300 hover:text-[#2B7FFF] transition-colors"
            >
              <Mail className="w-4 h-4" />
              {mockProfile.email}
            </a>
            <a
              href={`tel:${mockProfile.phone}`}
              className="flex items-center gap-2 text-gray-300 hover:text-[#2B7FFF] transition-colors"
            >
              <Phone className="w-4 h-4" />
              {mockProfile.phone}
            </a>
            <span className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4" />
              {mockProfile.location}
            </span>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex flex-wrap gap-3">
            {mockProfile.linkedin && (
              <a
                href={`https://${mockProfile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#1A2342] rounded-lg text-sm text-gray-300 hover:bg-blue-900/30 hover:text-[#2B7FFF] transition-colors border border-[#2A3A5A]"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {mockProfile.github && (
              <a
                href={`https://${mockProfile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#1A2342] rounded-lg text-sm text-gray-300 hover:bg-[#0A0E27] hover:text-white transition-colors border border-[#2A3A5A]"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          Professional Summary
        </h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {mockProfile.profileSummary}
        </p>
      </div>

      {/* Skills */}
      <div className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-gray-400" />
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {mockProfile.skills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400 rounded-xl text-sm font-medium border border-blue-700/50"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-gray-400" />
          Work Experience
        </h2>
        <div className="space-y-6">
          {mockProfile.experience.map((exp, i) => (
            <div
              key={i}
              className="relative pl-6 border-l-2 border-blue-700/50 last:border-l-transparent"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#2B7FFF] border-4 border-[#151B35] shadow" />
              <div className="pb-6 last:pb-0">
                <h3 className="font-semibold text-white">{exp.role}</h3>
                <p className="text-sm text-[#2B7FFF] font-medium">
                  {exp.company}
                </p>
                <p className="text-sm text-gray-400 mb-3">{exp.duration}</p>
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, ri) => (
                    <li
                      key={ri}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-gray-400" />
          Education
        </h2>
        <div className="space-y-4">
          {mockProfile.education.map((edu, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-[#1A2342] border border-[#2A3A5A] rounded-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{edu.degree}</h3>
                <p className="text-sm text-gray-300">{edu.institution}</p>
                <p className="text-sm text-gray-400">{edu.year}</p>
                {edu.percentage && (
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded-lg border border-emerald-700/50">
                    {edu.percentage}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-[#151B35] rounded-2xl border border-[#1E2A4A] p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-gray-400" />
          Projects
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockProfile.projects.map((proj, i) => (
            <div
              key={i}
              className="p-5 bg-gradient-to-br from-[#1A2342] to-[#151B35] rounded-xl border border-[#2A3A5A] hover:shadow-lg hover:shadow-[#2B7FFF]/10 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{proj.title}</h3>
                <span className="text-xs font-medium text-gray-400 bg-[#1A2342] px-2 py-1 rounded-lg border border-[#2A3A5A]">
                  {proj.year}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}