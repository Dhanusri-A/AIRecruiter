// src/steps/Step5Certifications.jsx
import React, { useEffect } from "react";
import { Plus, Trash2, Award } from "lucide-react";

const EMPTY_CERT = () => ({
  id: Date.now() + Math.random(),
  name: "",
  issuingOrganization: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  description: "",
});

export default function Step5Certifications({ formData, updateFormData }) {
  // Seed one blank row into formData on first mount if nothing is there yet.
  // This ensures the inputs are always controlled and editable.
  useEffect(() => {
    if (!formData.certifications || formData.certifications.length === 0) {
      updateFormData("certifications", [EMPTY_CERT()]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Single source of truth: always read from formData
  const certifications = formData.certifications ?? [];

  const updateCert = (id, field, value) => {
    const updated = certifications.map((cert) =>
      cert.id === id ? { ...cert, [field]: value } : cert,
    );
    updateFormData("certifications", updated);
  };

  const addCert = () => {
    updateFormData("certifications", [...certifications, EMPTY_CERT()]);
  };

  const removeCert = (id) => {
    const updated = certifications.filter((cert) => cert.id !== id);
    // Always keep at least one visible row
    updateFormData("certifications", updated.length > 0 ? updated : [EMPTY_CERT()]);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear + 5 - i);
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Certifications &amp; Credentials
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          List professional certifications, badges, or credentials that
          strengthen your profile.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className="border border-gray-200 rounded-xl p-6 relative bg-gray-50/40"
          >
            {/* Remove button */}
            {certifications.length > 1 && (
              <button
                type="button"
                onClick={() => removeCert(cert.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                title="Remove this certification"
              >
                <Trash2 size={18} />
              </button>
            )}

            {/* Card header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Certification {index + 1}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Certification Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCert(cert.id, "name", e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Issuing Org */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Issuing Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cert.issuingOrganization}
                  onChange={(e) =>
                    updateCert(cert.id, "issuingOrganization", e.target.value)
                  }
                  placeholder="Amazon Web Services / Google / Microsoft"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Issue Date{" "}
                  <span className="text-gray-400 text-xs">(Month &amp; Year)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={cert.issueDate?.slice(5, 7) || ""}
                    onChange={(e) => {
                      const month = e.target.value;
                      // Keep whatever year is already stored (even if empty)
                      const year = cert.issueDate?.slice(0, 4) || "0000";
                      updateCert(cert.id, "issueDate", `${year}-${month}`);
                    }}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm outline-none"
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>

                  <select
                    value={cert.issueDate?.slice(0, 4) || ""}
                    onChange={(e) => {
                      const year = e.target.value;
                      // Keep whatever month is already stored (even if empty)
                      const month = cert.issueDate?.slice(5, 7) || "01";
                      updateCert(cert.id, "issueDate", `${year}-${month}`);
                    }}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm outline-none"
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expiry Date{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={cert.expiryDate?.slice(5, 7) || ""}
                    onChange={(e) => {
                      const month = e.target.value;
                      const year = cert.expiryDate?.slice(0, 4) || "0000";
                      // If month is cleared, clear the whole field
                      updateCert(cert.id, "expiryDate", month ? `${year}-${month}` : "");
                    }}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm outline-none"
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>

                  <select
                    value={cert.expiryDate?.slice(0, 4) || ""}
                    onChange={(e) => {
                      const year = e.target.value;
                      const month = cert.expiryDate?.slice(5, 7) || "01";
                      // If year is cleared, clear the whole field
                      updateCert(cert.id, "expiryDate", year ? `${year}-${month}` : "");
                    }}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm outline-none"
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Credential ID */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Credential ID / Certificate Number
                <span className="text-gray-400 text-xs ml-2">(optional)</span>
              </label>
              <input
                type="text"
                value={cert.credentialId}
                onChange={(e) => updateCert(cert.id, "credentialId", e.target.value)}
                placeholder="e.g. XYZ-987654321"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">
                  (brief summary of what you learned/achieved)
                </span>
              </label>
              <textarea
                value={cert.description}
                onChange={(e) => updateCert(cert.id, "description", e.target.value)}
                placeholder="e.g., Covers designing scalable, highly available, and fault-tolerant systems on AWS..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        ))}

        {/* Add another */}
        <button
          type="button"
          onClick={addCert}
          className="w-full py-5 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add Another Certification
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        Tip: Use certifications to showcase specialized skills — especially ones
        relevant to your target roles.
      </p>
    </div>
  );
}