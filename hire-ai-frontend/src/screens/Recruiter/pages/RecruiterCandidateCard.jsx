"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Mail,
    Phone,
    ChevronRight,
    Star,
    Clock,
    GraduationCap,
    IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RecruiterCandidateCard({ candidate, index }) {
    const navigate = useNavigate();
    const [showMore, setShowMore] = useState(false);
    const [isShortlisted, setIsShortlisted] = useState(false);

    const formatSalary = (range) => {
        if (!Array.isArray(range) || range.length !== 2) return "Not specified";
        const [min, max] = range;
        return `${(min / 100000).toFixed(1)}L - ${(max / 100000).toFixed(1)}L`;
    };

    const truncate = (text = "", max = 120) =>
        text.length > max ? text.slice(0, max - 3) + "..." : text;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
            <div className="p-5 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 flex-shrink-0">
                            {candidate.fullName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {candidate.fullName}
                            </h3>
                            <p className="text-emerald-600 font-medium">{candidate.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                <MapPin className="w-3.5 h-3.5" />
                                {candidate.location}
                            </div>
                        </div>
                    </div>

                    {/* Shortlist Button */}
                    <button
                        onClick={() => setIsShortlisted(!isShortlisted)}
                        className={`p-2 rounded-xl transition-all ${isShortlisted
                                ? "bg-amber-100 text-amber-600"
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                            }`}
                    >
                        <Star className={`w-5 h-5 ${isShortlisted ? "fill-current" : ""}`} />
                    </button>
                </div>

                {/* Summary */}
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {truncate(candidate.summary, showMore ? 500 : 120)}
                    {candidate.summary.length > 120 && (
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium ml-1"
                        >
                            {showMore ? "Show less" : "Show more"}
                        </button>
                    )}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills?.slice(0, 5).map((skill, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                    {candidate.skills?.length > 5 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm">
                            +{candidate.skills.length - 5} more
                        </span>
                    )}
                </div>

                {/* Info Row */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {candidate.experience}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        {candidate.education}
                    </div>
                    {candidate.expectedSalary && (
                        <div className="flex items-center gap-1.5">
                            <IndianRupee className="w-4 h-4 text-slate-400" />
                            {formatSalary(candidate.expectedSalary)}
                        </div>
                    )}
                </div>

                {/* Availability Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${candidate.availability === "Immediate"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                    >
                        {candidate.availability}
                    </span>

                    {/* Contact & View */}
                    <div className="flex items-center gap-2">
                        <a
                            href={`mailto:${candidate.email}`}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                        <a
                            href={`tel:${candidate.phone}`}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                        </a>
                        <button
                            onClick={() =>
                                navigate("/recruiter/candidate/c1", { state: { candidate:candidate?.id } })
                            }
                            className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm"
                        >
                            View Profile
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
