"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import CandidateJobCard from "./CandidateJobCard"; // ← Make sure this is the renamed component

// Mock data: jobs that are mutually matched
const mockMatchedJobs = [
  {
    jobId: "job-101",
    companyName: "TechNova Solutions",
    role: "Senior Full Stack Developer",
    jobType: "Full-time",
    industry: "Information Technology",
    description:
      "Lead development of next-gen SaaS platform using React, Node.js and AWS.",
    salaryRange: [1400000, 2200000],
    location: "Bengaluru, Karnataka",
    postedMethod: "private",
    requirements: ["React", "Node.js", "TypeScript", "AWS", "5+ years exp"],
  },
  {
    jobId: "job-102",
    companyName: "GreenWave Renewables",
    role: "Solar Energy Consultant",
    jobType: "Contract",
    industry: "Renewable Energy",
    description:
      "Advise on large-scale solar farm deployments across South India.",
    salaryRange: [900000, 1500000],
    location: "Coimbatore, Tamil Nadu",
    postedMethod: "public",
    requirements: ["PVsyst", "Solar design", "Project management"],
  },
  {
    jobId: "job-103",
    companyName: "EduSmart Learning",
    role: "Technical Content Lead",
    jobType: "Full-time",
    industry: "EdTech",
    description:
      "Create and manage high-quality programming & tech course content.",
    salaryRange: [800000, 1400000],
    location: "Remote",
    postedMethod: "private",
    requirements: ["Technical writing", "JavaScript/Python", "Video scripting"],
  },
];

export default function CandidateMatchedJobs() {
  const jobs = mockMatchedJobs;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mutually Matched Jobs
      </h1>

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-600 bg-gray-50 rounded-xl border">
          <Star className="inline-block mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg">No mutual matches found yet.</p>
          <p className="mt-2 text-sm">
            Keep applying — mutual matches appear when both you and the employer
            show interest.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <motion.div
              key={job.jobId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <CandidateJobCard job={job} index={index} />

              {/* Mutual match badge */}
              <div className="absolute -top-3 -right-3 bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1.5 z-10">
                <Star size={16} className="fill-white" />
                Mutual Match!
              </div>

              <p className="mt-3 text-center text-sm text-green-700 font-medium">
                You and the employer both selected this position
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}