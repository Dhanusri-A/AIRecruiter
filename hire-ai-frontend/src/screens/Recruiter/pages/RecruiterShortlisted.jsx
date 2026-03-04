"use client";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Clock,
  Trash2,
  Users,
} from "lucide-react";

const mockShortlisted = [
  {
    id: "s1",
    candidate: {
      candidateId: "c1",
      fullName: "Oscar Fernandas",
      title: "Full Stack Developer",
      email: "oscar.kumar.dev@gmail.com",
      phone: "+91 98765 43210",
      location: "Tiruppur, Tamil Nadu",
      experience: "3+ years",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    },
    shortlistedDate: "2025-01-15",
    forJob: "Senior React Developer",
  },
  {
    id: "s2",
    candidate: {
      candidateId: "c2",
      fullName: "Priya Sharma",
      title: "UI/UX Designer",
      email: "priya.sharma@email.com",
      phone: "+91 87654 32109",
      location: "Bengaluru, Karnataka",
      experience: "5+ years",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    },
    shortlistedDate: "2025-01-14",
    forJob: "UI/UX Designer",
  },
];

export default function Shortlisted() {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Shortlisted Candidates
        </h1>
        <p className="text-slate-500">
          Candidates you've marked as potential hires
        </p>
      </div>

      {/* Shortlisted List */}
      {mockShortlisted.length > 0 ? (
        <div className="space-y-4">
          {mockShortlisted.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/20 flex-shrink-0">
                      {item.candidate.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.candidate.fullName}
                      </h3>
                      <p className="text-emerald-600 font-medium">
                        {item.candidate.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.candidate.location}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.candidate.skills?.slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Meta */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="text-sm text-slate-500">
                        Shortlisted {formatDate(item.shortlistedDate)}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                      For: {item.forJob}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${item.candidate.email}`}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={`tel:${item.candidate.phone}`}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm">
                    View Profile
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
            <Star className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No shortlisted candidates
          </h3>
          <p className="text-slate-500">
            Start browsing candidates and shortlist the ones you like
          </p>
        </div>
      )}
    </div>
  );
}
