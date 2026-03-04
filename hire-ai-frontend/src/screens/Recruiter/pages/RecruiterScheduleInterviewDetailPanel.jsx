// screens/Recruiter/pages/RecruiterScheduleInterviewDetailPanel.jsx
import {
  Calendar, Clock, Video, X, Mail, ExternalLink, Award,
  ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle,
  PlayCircle, Loader, VideoOff, RefreshCw,
} from "lucide-react";
import { StatusBadge, TypeBadge, deriveStatus, parseInterviewDate } from "./RecruiterScheduleInterview";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getQuestionVideoUrl } from "../../../api/api";

// ─────────────────────────────────────────────────────────────────────────────
// ScoreRing
// ─────────────────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const pct = Math.min(100, Math.max(0, score ?? 0));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fontSize="20" fontWeight="bold" fill={color}>{pct}</text>
      </svg>
      <span className="text-sm text-gray-600 mt-1">Score / 100</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QuestionVideoPlayer
// ─────────────────────────────────────────────────────────────────────────────
function QuestionVideoPlayer({ interviewId, questionIndex }) {
  const [status, setStatus]     = useState("idle");
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef(null);

  const loadVideo = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await getQuestionVideoUrl(interviewId, questionIndex);
      setVideoUrl(data.video_url);
      setStatus("ready");
    } catch (err) {
      setErrorMsg(err?.message || "Failed to load video");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "ready" && videoRef.current && videoUrl) {
      videoRef.current.load();
    }
  }, [status, videoUrl]);

  if (status === "idle") {
    return (
      <button
        onClick={loadVideo}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors text-gray-700 font-medium text-sm"
      >
        <PlayCircle className="w-5 h-5 text-emerald-600" />
        Watch Recording
      </button>
    );
  }

  if (status === "loading") {
    return (
      <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
        <Loader className="w-4 h-4 animate-spin" />
        Loading video…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 py-2 px-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-2">
          <VideoOff className="w-4 h-4 flex-shrink-0" />
          {errorMsg || "Recording unavailable"}
        </div>
        <button
          onClick={loadVideo}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 bg-black shadow-sm">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        controlsList="nodownload"
        playsInline
        className="w-full max-h-64 object-contain"
        style={{ background: "#000" }}
      >
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QAAccordion
// ─────────────────────────────────────────────────────────────────────────────
function QAAccordion({ qa, questionWiseSummary, interviewId, hasRecordings }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {qa.map((item, idx) => {
        const summary = questionWiseSummary?.find((s) => s.question === item.question);
        const isOpen  = openIndex === idx;

        return (
          <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-start justify-between p-4 hover:bg-gray-50 transition-colors text-left gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-gray-900">{item.question}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                {hasRecordings && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <Video className="w-3 h-3" />
                    Video
                  </span>
                )}
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-gray-100">
                {hasRecordings && (
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />Answer Recording
                    </p>
                    <QuestionVideoPlayer interviewId={interviewId} questionIndex={idx} />
                  </div>
                )}

                <div className="p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Candidate's Answer</span>
                  </div>
                  <p className="text-sm text-gray-800">{item.answer}</p>
                </div>

                {summary && (
                  <div className="p-4 bg-amber-50 border-t border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">AI Analysis</span>
                    </div>
                    <p className="text-sm text-gray-800">{summary.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main panel — rendered via portal so it sits above the navbar
// ─────────────────────────────────────────────────────────────────────────────
export default function RecruiterScheduleInterviewDetailPanel({ interview, onClose }) {
  const status      = deriveStatus(interview);
  const date        = parseInterviewDate(interview);
  const isCompleted = status === "completed";
  const hasRecordings = isCompleted;

  // Lock body scroll while panel is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const panel = (
    // z-[9999] ensures this sits above the navbar regardless of its z-index
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Full-screen backdrop — covers navbar too */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold mb-1">{interview.candidate_name}</h2>
              <p className="text-emerald-100">{interview.job_title}</p>
              <p className="text-emerald-200 text-sm">{interview.candidate_email}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <TypeBadge type={interview.interview_type} />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Date & Time */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Date & Time</h3>
            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="font-medium text-gray-900 text-sm">
                    {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Time & Duration</div>
                  <div className="font-medium text-gray-900 text-sm">
                    {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {interview.duration}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Location */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Meeting Location</h3>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-gray-900">{interview.meeting_location}</span>
              </div>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />Join
              </button>
            </div>
          </div>

          {/* Notes */}
          {interview.notes && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm">{interview.notes}</p>
              </div>
            </div>
          )}

          {/* ── Completed interview section ── */}
          {isCompleted && (
            <>
              {/* Score */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />Interview Score
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-emerald-50 border border-emerald-100 rounded-xl p-6 flex items-center justify-between">
                  <ScoreRing score={interview.scores} />
                  <div className="flex-1 ml-6">
                    <div className={`text-xl font-bold mb-1 ${interview.scores >= 70 ? "text-emerald-600" : interview.scores >= 40 ? "text-amber-600" : "text-red-600"}`}>
                      {interview.scores >= 70 ? "Strong Candidate" : interview.scores >= 40 ? "Average Performance" : "Below Expectations"}
                    </div>
                    <p className="text-sm text-gray-600">
                      {interview.scores >= 70
                        ? "Candidate performed well. Consider moving to the next stage."
                        : interview.scores >= 40
                        ? "Candidate showed some potential but has knowledge gaps."
                        : "Candidate needs significant improvement in key areas."}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      {interview.scores >= 70
                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : interview.scores >= 40
                        ? <AlertTriangle className="w-4 h-4 text-amber-500" />
                        : <XCircle className="w-4 h-4 text-red-500" />}
                      <span className="text-xs text-gray-600">Score based on AI evaluation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Summary */}
              {interview.ai_summary?.overall_summary && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Overall Summary</h3>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-sm text-indigo-900 leading-relaxed">{interview.ai_summary.overall_summary}</p>
                  </div>
                </div>
              )}

              {/* Q&A + Video Breakdown */}
              {interview.qa && interview.qa.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    Question & Answer Breakdown
                    {hasRecordings && (
                      <span className="text-xs font-normal text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" />Videos available
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Click a question to expand the answer, recording, and AI analysis.</p>
                  <QAAccordion
                    qa={interview.qa}
                    questionWiseSummary={interview.ai_summary?.question_wise || []}
                    interviewId={interview.id}
                    hasRecordings={hasRecordings}
                  />
                </div>
              )}
            </>
          )}

          {/* Pending hint */}
          {!isCompleted && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-yellow-800 text-sm">Interview Pending</div>
                <p className="text-yellow-700 text-xs mt-1">
                  The AI evaluation, score, and answer recordings will appear here once the interview is completed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center gap-3 flex-shrink-0">
          <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 flex items-center justify-center gap-2 text-sm">
            <Mail className="w-4 h-4" />Send Reminder
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 flex items-center justify-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />Reschedule
          </button>
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Portal renders into document.body, bypassing any stacking context
  // created by the navbar or page layout wrappers
  return createPortal(panel, document.body);
}