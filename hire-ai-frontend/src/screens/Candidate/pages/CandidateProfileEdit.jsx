"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

import { FormStepper } from "../forms/FormStepper";
import { BasicDetailsForm } from "../forms/BasicDetailsForm";
import { EducationForm } from "../forms/EducationForm";
import { SkillsForm } from "../forms/SkillsForm";
import { ProfileForm } from "../forms/ProfileForm";
import { WorkExperienceForm } from "../forms/WorkExperienceForm";

const primaryColor = "#3b82f6";

const initialState = {
  title: "",
  contact: {
    phone: "",
    email: "",
    location: "",
    pincode: "",
    github: "",
    linkedin: "",
  },
  education: [
    {
      years: "",
      institution: "",
      degree: "",
      percentage: "",
    },
  ],
  skills: [],
  languages: [],
  profile: "",
  workExperience: [
    {
      company: "",
      duration: "",
      role: "",
      responsibilities: [""],
    },
  ],
  projects: [],
};

export default function CandidateProfileEdit({ initialData = null, onComplete, fromSignup = true }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialData || initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username") || "User";
    setUserName(storedName);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateStep = (step) => {
    const errorMap = {};
    
    switch (step) {
      case 0: // Basic Details
        if (!formData.title?.trim()) errorMap["title"] = "Professional title is required";
        if (!formData.contact?.phone?.trim()) errorMap["contact.phone"] = "Phone number is required";
        if (!formData.contact?.email?.trim()) errorMap["contact.email"] = "Email is required";
        if (!formData.contact?.location?.trim()) errorMap["contact.location"] = "Location is required";
        if (!formData.contact?.pincode?.trim()) errorMap["contact.pincode"] = "Pincode is required";
        break;
      case 1: // Education
        if (formData.education.length === 0) {
          errorMap["education"] = "At least one education entry is required";
        } else {
          formData.education.forEach((edu, index) => {
            if (!edu.years?.trim()) errorMap[`education[${index}].years`] = "Years required";
            if (!edu.institution?.trim()) errorMap[`education[${index}].institution`] = "Institution required";
            if (!edu.degree?.trim()) errorMap[`education[${index}].degree`] = "Degree required";
          });
        }
        break;
      case 2: // Skills
        if (formData.skills.length === 0) errorMap["skills"] = "At least one skill is required";
        if (formData.languages.length === 0) errorMap["languages"] = "At least one language is required";
        break;
      case 3: // Profile
        if (!formData.profile?.trim()) errorMap["profile"] = "Professional summary is required";
        if (formData.profile?.trim().length < 10) errorMap["profile"] = "Summary must be at least 10 characters";
        break;
      case 4: // Work Experience - optional validation
        break;
    }
    
    return errorMap;
  };

  const handleNext = () => {
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length === 0) {
      setErrors({});
      setActiveStep((prev) => prev + 1);
    } else {
      setErrors(stepErrors);
      toast.error("Please fix the errors before proceeding");
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      toast.success("Profile saved successfully!");
      localStorage.setItem("candidateProfile", JSON.stringify(formData));
      localStorage.setItem("isProfileComplete", "true");
      
      if (fromSignup) {
        navigate("/candidate");
      } else if (onComplete) {
        onComplete();
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e, section, index = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (index !== null) {
        const updatedSection = [...prev[section]];
        updatedSection[index] = { ...updatedSection[index], [name]: value };
        return { ...prev, [section]: updatedSection };
      }
      if (section.includes(".")) {
        const [parent, child] = section.split(".");
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [section]: value };
    });
  };

  const handleSkillChange = (skillType, skill) => {
    setFormData((prevData) => ({
      ...prevData,
      [skillType]: [...prevData[skillType], skill],
    }));
  };

  const handleRemoveSkill = (skillType, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [skillType]: prevData[skillType].filter((_, i) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        { years: "", institution: "", degree: "", percentage: "" },
      ],
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((_, i) => i !== index),
    }));
  };

  const handleAddWorkExperience = () => {
    setFormData((prevData) => ({
      ...prevData,
      workExperience: [
        ...prevData.workExperience,
        { company: "", duration: "", role: "", responsibilities: [""] },
      ],
    }));
  };

  const handleRemoveWorkExperience = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      workExperience: prevData.workExperience.filter((_, i) => i !== index),
    }));
  };

  const handleAddProject = () => {
    setFormData((prevData) => ({
      ...prevData,
      projects: [
        ...prevData.projects,
        { title: "", role: "", year: "", description: "" },
      ],
    }));
  };

  const handleRemoveProject = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      projects: prevData.projects.filter((_, i) => i !== index),
    }));
  };

  function renderStepContent(step) {
    switch (step) {
      case 0:
        return (
          <BasicDetailsForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <EducationForm
            formData={formData}
            handleChange={handleChange}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
            primaryColor={primaryColor}
            errors={errors}
          />
        );
      case 2:
        return (
          <SkillsForm
            formData={formData}
            handleSkillChange={handleSkillChange}
            handleRemoveSkill={handleRemoveSkill}
            primaryColor={primaryColor}
            errors={errors}
          />
        );
      case 3:
        return (
          <ProfileForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <WorkExperienceForm
            formData={formData}
            handleChange={handleChange}
            handleAddWorkExperience={handleAddWorkExperience}
            handleRemoveWorkExperience={handleRemoveWorkExperience}
            handleAddProject={handleAddProject}
            handleRemoveProject={handleRemoveProject}
            primaryColor={primaryColor}
            setFormData={setFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  }

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {fromSignup ? "Complete Your Profile" : "Edit Your Profile"}
          </h1>
          <p className="text-slate-600 mt-2">
            {fromSignup
              ? `Welcome ${userName}! Let's build your professional profile.`
              : "Update your information to keep your profile current."}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Stepper */}
          <FormStepper activeStep={activeStep} primaryColor={primaryColor} />

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeStep === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {activeStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium text-white transition-all hover:shadow-lg disabled:opacity-70"
                style={{ backgroundColor: "#10b981" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Profile
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Step {activeStep + 1} of {totalSteps}
        </div>
      </div>
    </div>
  );
}
