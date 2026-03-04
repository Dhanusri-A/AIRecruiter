import { useState } from "react";
import { X, ChevronRight, Check, Sparkles } from "lucide-react";

const INTERVIEW_TYPES = [
  "Screening",
  "Technical",
  "Online",
  "Onsite",
  "Phone",
  "Panel",
  "Final",
];
const MEETING_LOCATIONS = [
  "Zoom",
  "Google Meet",
  "Microsoft Teams",
  "Phone",
  "Onsite",
];
const DURATIONS = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "90 minutes",
  "120 minutes",
];

export default function RecruiterScheduleInterviewModal({
  onClose,
  onSchedule,
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidate_name: "",
    candidate_email: "",
    job_title: "",
    interview_type: "Online",
    date: "",
    time: "",
    duration: "45 minutes",
    meeting_location: "Zoom",
    notes: "",
  });

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSchedule = async () => {
    setLoading(true);
    try {
      // Step 1: Combine date + time into local Date object
      const localDateTimeStr = `${formData.date}T${formData.time}:00`;
      const localDate = new Date(localDateTimeStr);

      // Step 2: Convert to UTC ISO string
      const utcDateTime = localDate.toISOString(); // e.g. "2026-03-10T09:30:00.000Z"

      // Step 3: Split into date and time (backend likely expects separate fields)
      const utcDate = utcDateTime.split("T")[0]; // "2026-03-10"
      const utcTime = utcDateTime.split("T")[1].slice(0, 8); // "09:30:00"

      const payload = {
        candidate_name: formData.candidate_name,
        candidate_email: formData.candidate_email,
        job_title: formData.job_title,
        interview_type: formData.interview_type,
        date: utcDate, // ← UTC date
        time: utcTime, // ← UTC time (HH:MM:SS)
        duration: formData.duration,
        meeting_location: formData.meeting_location,
        notes: formData.notes,
      };

      await onSchedule(payload);
      toast.success("Interview scheduled successfully!");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  const step1Valid =
    formData.candidate_name && formData.candidate_email && formData.job_title;
  const step2Valid = formData.date && formData.time;

  return (
    <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4">
      {" "}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Schedule New Interview</h2>
            <p className="text-emerald-100 text-sm">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center px-6 pt-4 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <div
                className={`text-xs font-medium ${step >= s ? "text-emerald-600" : "text-gray-400"}`}
              >
                {s === 1
                  ? "Candidate Info"
                  : s === 2
                    ? "Date & Time"
                    : "Location & Notes"}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 ${step > s ? "bg-emerald-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Candidate & Job Details
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Candidate Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.candidate_name}
                  onChange={(e) => update("candidate_name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter candidate name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Candidate Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.candidate_email}
                  onChange={(e) => update("candidate_email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="candidate@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => update("job_title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Interview Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {INTERVIEW_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => update("interview_type", type)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all text-sm ${formData.interview_type === type ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-300 hover:border-emerald-300 text-gray-700"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Date, Time & Duration
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => update("time", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <strong>Timezone note:</strong> You are scheduling in your
                  local time zone (
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}).
                  <br />
                  The candidate will see this in <strong>their</strong> local
                  time.
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => update("duration", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-900">
                  <strong>Tip:</strong> Ensure the candidate has been notified
                  before scheduling. A calendar invite will be generated on
                  confirmation.
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Location & Notes
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meeting Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {MEETING_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => update("meeting_location", loc)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all text-sm ${formData.meeting_location === loc ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-300 hover:border-emerald-300 text-gray-700"}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Notes / Instructions
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={4}
                  placeholder="Add any special instructions, topics to cover, or preparation notes..."
                />
              </div>

              {/* Summary Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  Interview Summary
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-gray-500">Candidate:</span>
                  <span className="font-medium text-gray-900">
                    {formData.candidate_name}
                  </span>
                  <span className="text-gray-500">Job:</span>
                  <span className="font-medium text-gray-900">
                    {formData.job_title}
                  </span>
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900">
                    {formData.interview_type}
                  </span>
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-gray-900">
                    {formData.date || "—"}
                  </span>
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium text-gray-900">
                    {formData.time || "—"}
                  </span>
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {formData.duration}
                  </span>
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-900">
                    {formData.meeting_location}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
          >
            {step > 1 ? "Back" : "Cancel"}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !step1Valid : !step2Valid}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSchedule}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Scheduling...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Schedule Interview
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
