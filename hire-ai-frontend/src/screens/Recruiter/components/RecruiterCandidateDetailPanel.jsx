// components/RecruiterCandidateDetailPanel.jsx
import {
  X,
  MapPin,
  Briefcase,
  Phone,
  Zap,
  Calendar,
  Mail,
  Edit,
  Star,
  Download,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { updateCandidate } from "../../../api/api";
import toast from "react-hot-toast";

// ─── Pipeline stages ──────────────────────────────────────────────────────────
const STATUS_STAGES = [
  {
    value: "sourced",
    label: "Sourced",
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
  {
    value: "matched",
    label: "Matched",
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  {
    value: "screening",
    label: "Screening",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  {
    value: "interview",
    label: "Interview",
    color: "bg-purple-100 text-purple-700 border-purple-300",
  },
  {
    value: "offer",
    label: "Offer",
    color: "bg-orange-100 text-orange-700 border-orange-300",
  },
  {
    value: "hired",
    label: "Hired",
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
];

function getStageConfig(value) {
  return (
    STATUS_STAGES.find((s) => s.value === (value || "").toLowerCase()) ||
    STATUS_STAGES[0]
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function RecruiterCandidateDetailPanel({
  candidate,
  onClose,
  getStatusColor,
  onStatusUpdated,
}) {
  if (!candidate) return null;

  // Local state for the editable status
  const [selectedStatus, setSelectedStatus] = useState(
    (candidate.status || "sourced").toLowerCase(),
  );
  const [saving, setSaving] = useState(false);
  // Track whether the user has changed the status from what's saved
  const [isDirty, setIsDirty] = useState(false);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setIsDirty(value !== (candidate.status || "sourced").toLowerCase());
  };

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      await updateCandidate(candidate.id, { status: selectedStatus });
      toast.success(
        `Status updated to "${getStageConfig(selectedStatus).label}"`,
      );
      setIsDirty(false);
      // Notify parent so the table/card view refreshes without a full reload
      onStatusUpdated?.(candidate.id, selectedStatus);
    } catch (err) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const currentStageConfig = getStageConfig(selectedStatus);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-end">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto relative animate-in slide-in-from-right duration-300 z-10">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Candidate Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-6">
            {candidate.image_url ? (
              <img
                src={candidate.image_url}
                alt={candidate.name}
                className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {candidate.avatar}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {candidate.name}
              </h3>
              <p className="text-lg text-gray-700 mb-2">{candidate.title}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {candidate.location}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {candidate.experience} years
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {candidate.summary && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Professional Summary
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {candidate.summary}
              </p>
            </div>
          )}

          {/* ── Pipeline Status Editor ─────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">
                Pipeline Status
              </h4>
              {isDirty && (
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>

            {/* Stage pill selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {STATUS_STAGES.map((stage, idx) => {
                const isSelected = selectedStatus === stage.value;
                // A stage is "passed" if its index is before the selected one
                const selectedIdx = STATUS_STAGES.findIndex(
                  (s) => s.value === selectedStatus,
                );
                const isPassed = idx < selectedIdx;

                return (
                  <button
                    key={stage.value}
                    onClick={() => handleStatusChange(stage.value)}
                    className={`
                      relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold
                      transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400
                      ${
                        isSelected
                          ? `${stage.color} ring-2 ring-offset-1 ring-emerald-500 shadow-sm scale-105`
                          : isPassed
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 opacity-70"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }
                    `}
                  >
                    {isPassed && <Check className="w-3 h-3" />}
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                    {stage.label}
                  </button>
                );
              })}
            </div>

            {/* Visual pipeline progress bar */}
            <div className="relative mb-4">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      ((STATUS_STAGES.findIndex(
                        (s) => s.value === selectedStatus,
                      ) +
                        1) /
                        STATUS_STAGES.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400">Sourced</span>
                <span className="text-[10px] text-gray-400">Hired</span>
              </div>
            </div>

            {/* Current status display + Save button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Current:</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStageConfig.color}`}
                >
                  {currentStageConfig.label}
                </span>
              </div>

              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${
                    isDirty && !saving
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Status
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact & Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <DetailCard label="Email" value={candidate.email} />
            <DetailCard label="Phone" value={candidate.phone} />
            <DetailCard label="Source" value={candidate.source} />
            <DetailCard label="Notice Period" value={candidate.notice_period} />
            <DetailCard
              label="Expected Salary"
              value={candidate.expected_salary}
            />
            <DetailCard
              label="Preferred Mode"
              value={candidate.preferred_mode}
            />
            <DetailCard label="Last Updated" value={candidate.lastUpdated} />
          </div>

          {/* Skills */}
          <Section title="Skills & Expertise">
            {candidate.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No skills listed</p>
            )}
          </Section>

          {/* Languages */}
          <Section title="Languages">
            {Object.entries(candidate.languages || {}).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(candidate.languages).map(([lang, info]) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200"
                  >
                    {lang}: {typeof info === "object" ? info.proficiency : info}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No languages specified</p>
            )}
          </Section>

          {/* Profiles */}
          <Section title="Profiles">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(candidate.profiles || {}).length > 0 ? (
                Object.entries(candidate.profiles).map(([platform, value]) => {
                  const url = typeof value === "object" ? value.url : value;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="font-medium capitalize">{platform}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </a>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 col-span-full">
                  No profiles available
                </p>
              )}
            </div>
          </Section>

          {/* Work Experience */}
          <Section title="Work Experience">
            {(candidate.work_experiences || []).length > 0 ? (
              <div className="space-y-5">
                {candidate.work_experiences.map((exp, index) => (
                  <ExperienceItem
                    key={exp.id || index}
                    title={exp.job_title}
                    company={exp.company_name}
                    location={exp.location}
                    startDate={exp.start_date}
                    endDate={exp.end_date}
                    description={exp.description}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No work experience recorded
              </p>
            )}
          </Section>

          {/* Education */}
          <Section title="Education">
            {(candidate.education_records || []).length > 0 ? (
              <div className="space-y-5">
                {candidate.education_records.map((edu, index) => (
                  <EducationItem
                    key={edu.id || index}
                    degree={edu.degree}
                    fieldOfStudy={edu.field_of_study}
                    institution={edu.institution_name}
                    startYear={edu.start_year}
                    endYear={edu.end_year}
                    gpa={edu.gpa}
                    honors={edu.honors}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No education records available
              </p>
            )}
          </Section>

          {/* Action Buttons
          <div className="space-y-3 pt-6">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
              <Zap className="w-5 h-5" />Compare to Job Description
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold">
              <Calendar className="w-5 h-5" />Schedule Interview
            </button>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={Mail}     text="Send Email"       />
              <ActionButton icon={Edit}     text="Edit Profile"     />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={Star}     text="Add to Favorites" />
              <ActionButton icon={Download} text="Download Resume"  />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailCard({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-bold text-gray-900 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function ExperienceItem({
  title,
  company,
  location,
  startDate,
  endDate,
  description,
}) {
  return (
    <div className="border-l-4 border-gray-200 pl-5 py-1">
      <div className="font-semibold text-gray-900">
        {title}
        {company && ` at ${company}`}
      </div>
      <div className="text-sm text-gray-600 mt-0.5">
        {location && `${location} • `}
        {startDate || "N/A"}
        {endDate ? ` – ${endDate}` : " – Present"}
      </div>
      {description && (
        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function EducationItem({
  degree,
  fieldOfStudy,
  institution,
  startYear,
  endYear,
  gpa,
  honors,
}) {
  return (
    <div className="border-l-4 border-gray-200 pl-5 py-1">
      <div className="font-semibold text-gray-900">
        {degree}
        {fieldOfStudy && ` in ${fieldOfStudy}`}
      </div>
      <div className="text-sm text-gray-600 mt-0.5">
        {institution}
        {startYear && ` • ${startYear}`}
        {endYear && ` – ${endYear}`}
      </div>
      {(gpa || honors) && (
        <div className="text-sm text-gray-600 mt-1">
          {gpa && <span>GPA: {gpa} </span>}
          {honors && <span>Honors: {honors}</span>}
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, text }) {
  return (
    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
      <Icon className="w-4 h-4" />
      {text}
    </button>
  );
}
