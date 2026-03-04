// src/components/ProfileCreationFlow.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createCandidateProfile } from "../../../api/api";
import Step1Basics from "../steps/Step1Basics";
import Step2OnlinePresence from "../steps/Step2OnlinePresence";
import Step3Experience from "../steps/Step3Experience";
import Step4Education from "../steps/Step4Education";
import Step5Certifications from "../steps/Step5Certifications.jsx";
import Step6Skills from "../steps/Step6Skills";
import Step7SummaryPreferences from "../steps/Step7SummaryPreferences";
import Step8Review from "../steps/Step8Review";
import toast from "react-hot-toast";

const steps = [
  "Basics",
  "Online",
  "Experience",
  "Education",
  "Certifications",
  "Skills",
  "Summary",
  "Review",
];

// Utility function to map API data to form structure
const mapResumeDataToForm = (apiData) => {
  // Check if data is already mapped (has firstName instead of data.first_name)
  if (apiData.firstName) {
    console.log("✅ Data is already mapped, using directly");

    // Filter out empty arrays/objects
    const filteredData = {
      ...apiData,
      experiences: (apiData.experiences || []).filter(
        (exp) => exp.company?.trim() || exp.title?.trim(),
      ),
      education: (apiData.education || []).filter(
        (edu) => edu.school?.trim() || edu.degree?.trim(),
      ),
      certifications: (apiData.certifications || []).filter((cert) =>
        cert.name?.trim(),
      ),
    };

    console.log("🎯 Filtered data:", filteredData);
    return filteredData;
  }

  // Otherwise, map from raw API format
  if (!apiData || !apiData.data) return null;

  const data = apiData.data;

  console.log("🔍 Raw API education data:", data.education);
  console.log("🔍 Raw API work_experience data:", data.work_experience);
  console.log("🔍 Raw API certifications data:", data.certifications);

  // Map work experiences with unique IDs
  const experiences = (data.work_experience || [])
    .filter((exp) => exp.company_name?.trim() || exp.job_title?.trim())
    .map((exp, index) => ({
      id: Date.now() + index,
      company: exp.company_name || "",
      title: exp.job_title || "",
      startMonth: "",
      startYear: exp.start_date || "",
      endMonth: "",
      endYear: exp.end_date || "",
      current: !exp.end_date,
      location: exp.location || "",
      description: exp.description || "",
    }));

  console.log("✅ Mapped experiences:", experiences);

  // Map education with unique IDs
  const education = (data.education || [])
    .filter((edu) => edu.institution_name?.trim() || edu.degree?.trim())
    .map((edu, index) => ({
      id: Date.now() + index + 1000,
      school: edu.institution_name || "",
      degree: edu.degree || "",
      field: edu.field_of_study || "",
      startYear: edu.start_year || "",
      endYear: edu.end_year || "",
      gpa: edu.gpa || "",
      honors: edu.honors || "",
    }));

  console.log("✅ Mapped education:", education);

  // Map certifications with unique IDs
  const certifications = (data.certifications || [])
    .filter((cert) => cert.certification_name?.trim())
    .map((cert, index) => ({
      id: Date.now() + index + 2000,
      name: cert.certification_name || "",
      issuingOrganization: cert.issuing_body || "",
      issueDate: cert.issue_date ? cert.issue_date.slice(0, 7) : "",
      expiryDate: cert.expiry_date ? cert.expiry_date.slice(0, 7) : "",
      credentialId: cert.credential_id || "",
      description: cert.certification_description || "No description provided",
    }));

  console.log("✅ Mapped certifications:", certifications);

  // Map technical skills
  const technicalSkills = data.skills
    ? data.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  console.log("✅ Mapped technical skills:", technicalSkills);

  // Map languages
  const languages = Object.keys(data.languages || {})
    .filter((lang) => lang && lang.trim())
    .map((lang) => ({
      id: Date.now() + Math.random(),
      language: lang.charAt(0).toUpperCase() + lang.slice(1),
      proficiency: data.languages[lang] || "Intermediate",
    }))
    .filter((lang) => lang.language);

  console.log("✅ Mapped languages:", languages);

  // Extract phone number properly
  let phoneNumber = "";
  let phoneCountryCode = "+91";

  if (data.phone) {
    const phoneMatch = data.phone.match(/^(\+\d+)\s*(.+)$/);
    if (phoneMatch) {
      phoneCountryCode = phoneMatch[1];
      phoneNumber = phoneMatch[2].trim();
    } else {
      phoneNumber = data.phone.replace(/^\+\d+\s*/, "");
    }
  }

  const mappedData = {
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    headline: data.title || "",
    email: data.email || "",
    phone: phoneNumber,
    phoneCountryCode: phoneCountryCode,
    location: data.location || "",
    linkedin: data.profiles?.linkedin || "",
    github: data.profiles?.github || "",
    portfolio: data.profiles?.portfolio || "",
    twitter: data.profiles?.twitter || "",
    experiences: experiences,
    education: education,
    certifications: certifications,
    technicalSkills: technicalSkills,
    summary: data.profile_summary || "",
    yearsOfExperience: data.total_years_experience || "",
    noticePeriod: data.notice_period || "",
    workType: data.preferred_mode
      ? data.preferred_mode
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean)
      : [],
    languages: languages,
  };

  console.log("🎯 Final mapped data:", mappedData);

  return mappedData;
};

export default function RecruiterCandidateProfileCreation() {
  const location = useLocation();
  const parsedResumeData = location.state?.parsedResumeData;
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const totalSteps = steps.length;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const defaultFormValues = {
    firstName: "",
    lastName: "",
    headline: "",
    email: "",
    phone: "",
    phoneCountryCode: "+91",
    location: "",
    profilePhoto: null,
    linkedin: "",
    github: "",
    portfolio: "",
    twitter: "",
    experiences: [],
    education: [],
    certifications: [],
    technicalSkills: [],
    softSkills: [],
    summary: "",
    yearsOfExperience: "",
    noticePeriod: "",
    salaryCurrency: "USD",
    salaryMin: "",
    salaryMax: "",
    workType: [],
    languages: [],
  };

  const [formData, setFormData] = useState(defaultFormValues);

  // Handle resume data autofill
  useEffect(() => {
    if (parsedResumeData) {
      console.log(
        "📄 Parsed resume data received:",
        JSON.stringify(parsedResumeData, null, 2),
      );

      const mappedData = mapResumeDataToForm(parsedResumeData);

      if (mappedData) {
        console.log("🚀 Setting form data with mapped data...");
        console.log("📊 Form data before update:", formData);

        // Merge with default values, letting mapped data override
        setFormData((current) => {
          const updated = {
            ...current,
            ...mappedData,
          };
          console.log("📊 Form data after update:", updated);
          return updated;
        });

        toast.success("Profile pre-filled from your resume!", {
          duration: 4000,
          icon: "📄",
        });
      } else {
        console.warn("⚠️ Mapping returned null");
      }
    }
  }, [parsedResumeData]);

  // Debug: Log formData changes
  useEffect(() => {
    console.log("💾 Current formData state:", formData);
  }, [formData]);

  const validateStep = (step) => {
    switch (step) {
      case 1: // Basics
        return (
          formData.firstName?.trim() &&
          formData.lastName?.trim() &&
          formData.headline?.trim() &&
          formData.email?.trim() &&
          formData.phone?.trim() &&
          formData.location?.trim() &&
          /\S+@\S+\.\S+/.test(formData.email.trim())
        );

      case 2: // Online Presence — all optional
        return true;

      case 3: // Experience
        return formData.experiences?.length > 0
          ? formData.experiences.every(
              (exp) => exp.company?.trim() && exp.title?.trim(),
            )
          : true;

      case 4: // Education
        return formData.education?.length > 0
          ? formData.education.every(
              (edu) => edu.school?.trim() && edu.degree?.trim(),
            )
          : true;

      case 5: // Certifications — all optional, always valid
        return true;

      case 6: // Skills
        return formData.technicalSkills?.length >= 3;

      case 7: // Summary & Preferences
        return (
          formData.summary?.trim()?.length >= 20 &&
          formData.yearsOfExperience?.trim() &&
          formData.noticePeriod?.trim() &&
          formData.workType?.length > 0
        );

      case 8: // Review
        return true;

      default:
        return true;
    }
  };

  const isFormValid = () => {
    const required = [
      formData.firstName?.trim(),
      formData.lastName?.trim(),
      formData.headline?.trim(),
      formData.email?.trim(),
      formData.phone?.trim(),
      formData.location?.trim(),
      formData.summary?.trim(),
      formData.yearsOfExperience?.trim(),
    ];

    const basicsFilled = required.every(Boolean);
    const hasContent =
      formData.experiences?.length > 0 ||
      formData.education?.length > 0 ||
      formData.technicalSkills?.length >= 3;

    return basicsFilled && hasContent;
  };

  const updateFormData = (field, value) => {
    console.log(`📝 Updating formData.${field}:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => {
    const isValid = validateStep(currentStep);

    if (!isValid) {
      toast.error(
        `Please complete all required fields in the "${steps[currentStep - 1]}" step`,
        {
          duration: 5000,
          style: {
            border: "1px solid #ef4444",
            padding: "16px",
            color: "#fff",
            background: "#991b1b",
          },
          iconTheme: { primary: "#fff", secondary: "#991b1b" },
        },
      );
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderCurrentStep = () => {
    const commonProps = { goNext, goBack, formData, updateFormData };

    switch (currentStep) {
      case 1:
        return <Step1Basics {...commonProps} />;
      case 2:
        return <Step2OnlinePresence {...commonProps} />;
      case 3:
        return <Step3Experience {...commonProps} />;
      case 4:
        return <Step4Education {...commonProps} />;
      case 5:
        return <Step5Certifications {...commonProps} />;
      case 6:
        return <Step6Skills {...commonProps} />;
      case 7:
        return <Step7SummaryPreferences {...commonProps} />;
      case 8:
        return <Step8Review {...commonProps} />;
      default:
        return null;
    }
  };

  const handleCreateProfile = async () => {
    if (!isAuthenticated) {
      alert("Please login first");
      navigate("/recruiter-signin");
      return;
    }

    setLoading(true);
    setError(null);

    const educationRecords = formData.education.map((edu) => ({
      institution_name: edu.school?.trim() || "",
      degree: edu.degree || "",
      field_of_study: edu.field?.trim() || "",
      start_year: edu.startYear ? Number(edu.startYear) : null,
      end_year: edu.endYear ? Number(edu.endYear) : null,
    }));

    const workExperiences = formData.experiences.map((exp) => ({
      company_name: exp.company?.trim() || "",
      job_title: exp.title?.trim() || "",
      location: exp.location?.trim() || "",
      description: exp.description?.trim() || "",
    }));

    const certificationRecords = (formData.certifications || [])
      .filter((cert) => cert.name?.trim() && cert.description?.trim())
      .map((cert) => ({
        certification_name: cert.name.trim(),
        issuing_body: cert.issuingOrganization?.trim() || null,
        credential_id: cert.credentialId?.trim() || null,
        issue_date: cert.issueDate
          ? new Date(`${cert.issueDate}-01`).toISOString()
          : null,
        expiry_date: cert.expiryDate
          ? new Date(`${cert.expiryDate}-01`).toISOString()
          : null,
        certification_description:
          cert.description.trim() || "No description provided",
      }));

    const payload = {
      email: formData.email?.trim() || "",
      first_name: formData.firstName?.trim() || "",
      last_name: formData.lastName?.trim() || "",
      title: formData.headline?.trim() || "",
      image_url: "www.google.com",
      phone: formData.phone?.trim()
        ? `${formData.phoneCountryCode || "+91"}${formData.phone}`
        : "",
      location: formData.location?.trim() || "",
      skills: formData.technicalSkills?.join(", ") || "",
      profile_summary: formData.summary?.trim() || "",
      total_years_experience: formData.yearsOfExperience || "",
      notice_period: formData.noticePeriod || "",
      expected_salary:
        formData.salaryMin && formData.salaryMax
          ? `${formData.salaryCurrency || "USD"} ${formData.salaryMin} - ${formData.salaryMax}`
          : "",
      preferred_mode: formData.workType?.join(", ") || "",
      languages: formData.languages?.reduce((acc, lang) => {
        if (lang.language && lang.proficiency) {
          acc[lang.language] = { proficiency: lang.proficiency };
        }
        return acc;
      }, {}),
      profiles: {
        linkedin: formData.linkedin || "",
        github: formData.github || "",
        portfolio: formData.portfolio || "",
        twitter: formData.twitter || "",
      },
      education: educationRecords,
      work_experiences: workExperiences,
      certifications: certificationRecords,
    };
    console.log("🚀 Final payload for API:", payload);

    try {

      const response = await createCandidateProfile(payload);
      console.log("Profile created successfully:", response);

      toast.success("Profile created successfully!", {
        duration: 5000,
        icon: "🎉",
      });

      navigate("/recruiter/talent-pool");
    } catch (err) {
      console.error("Profile creation error:", err);

      let errorMessage = "Failed to create profile. Please try again.";
      if (err.detail && Array.isArray(err.detail)) {
        errorMessage = err.detail[0]?.msg || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        duration: 6000,
        style: {
          border: "1px solid #ef4444",
          padding: "16px",
          color: "#fff",
          background: "#991b1b",
        },
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 font-sans antialiased pb-2">
      {/* Progress bar + step circles */}
      <div className="sticky top-0 z-40 bg-white shadow-sm rounded-b-2xl border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-5">
            Create your Profile
          </h1>

          <div className="mb-5">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="font-semibold text-emerald-700">
                {progress}% Complete
              </span>
            </div>
          </div>

          {/* Step circles */}
          <div className="flex items-center justify-between gap-1 md:gap-2">
            {steps.map((label, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === currentStep;
              const isDone = stepNum < currentStep;

              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold border-2 transition-all ${
                        isDone
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : isActive
                            ? "bg-white border-emerald-600 text-emerald-600 ring-4 ring-emerald-100/70"
                            : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        stepNum
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1.5 hidden md:block font-medium truncate max-w-[72px] text-center ${
                        isActive ? "text-emerald-700" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 ${isDone ? "bg-emerald-600" : "bg-gray-200"}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <main className="pt-10 pb-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">{renderCurrentStep()}</div>
      </main>

      {/* Navigation buttons */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-8 flex items-center justify-between gap-4">
        <button
          onClick={goBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {currentStep < totalSteps ? (
          <button
            onClick={goNext}
            className={`flex items-center gap-2 px-7 py-3 font-semibold rounded-xl shadow-md transition-all ${
              validateStep(currentStep)
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleCreateProfile}
            disabled={loading || !validateStep(totalSteps) || !isFormValid()}
            className={`flex items-center gap-2 px-8 py-3.5 text-white font-bold rounded-xl shadow-lg transition-all ${
              loading || !validateStep(totalSteps) || !isFormValid()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-xl hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Profile <Sparkles size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
