// src/api.js
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Helper — fires toast with the FastAPI `detail` field, then re-throws
// so individual callers can still catch if needed.
function handleError(error, fallbackMessage) {
  const errData = error.response?.data || { message: fallbackMessage };
  const msg = errData?.detail || errData?.message || fallbackMessage;
  toast.error(msg);
  throw errData;
}

// ────────────────────────────────────────────────
// Auth  (NO toast — callers show their own errors)
// ────────────────────────────────────────────────
export const loginUser = async (payload) => {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed. Please try again." };
  }
};

export const signup = async (payload) => {
  try {
    const response = await api.post("/auth/signup", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong." };
  }
};

// ────────────────────────────────────────────────
// Candidates
// ────────────────────────────────────────────────
export const createCandidateProfile = async (candidateData) => {
  try {
    const response = await api.post("/candidates", candidateData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create profile");
  }
};

export const getRecruiterCandidates = async (recruiterId, { skip = 0, limit = 100 } = {}) => {
  if (!recruiterId) throw new Error("Recruiter ID is required to fetch candidates");
  try {
    const response = await api.get(`/candidates/recruiter/${recruiterId}`, {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch candidates");
  }
};

export const updateCandidate = async (candidateId, payload) => {
  try {
    const response = await api.put(`/candidates/${candidateId}`, payload);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update candidate");
  }
};

export const deleteCandidate = async (candidateId) => {
  try {
    await api.delete(`/candidates/${candidateId}`);
    return true;
  } catch (error) {
    handleError(error, "Failed to delete candidate");
  }
};

export const searchCandidates = async ({ job_title, location, source }) => {
  try {
    const response = await api.post("/candidates/search", { job_title, location, source });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to search candidates");
  }
};

export const getRecruiterCount = async (recruiterId) => {
  if (!recruiterId) throw new Error("Recruiter ID is required");
  try {
    const response = await api.get(`/candidates/recruiter/${recruiterId}/count`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch recruiter stats");
  }
};

// ────────────────────────────────────────────────
// Jobs
// ────────────────────────────────────────────────
export const createJobDescription = async (jobData) => {
  try {
    const response = await api.post("/jobs", jobData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to generate job description");
  }
};

export const getRecruiterJobs = async (userId, { skip = 0, limit = 10 } = {}) => {
  try {
    const response = await api.get(`/jobs/users/${userId}`, { params: { skip, limit } });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch jobs");
  }
};

export const getJobById = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch job details");
  }
};

export const updateJobDescription = async (jobId, payload) => {
  try {
    const response = await api.put(`/jobs/${jobId}`, payload);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update job");
  }
};

export const deleteJobDescription = async (jobId) => {
  try {
    await api.delete(`/jobs/${jobId}`);
    return true;
  } catch (error) {
    handleError(error, "Failed to delete job");
  }
};

// ────────────────────────────────────────────────
// Resume
// ────────────────────────────────────────────────
export const parseResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/resume/parse", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to parse resume");
  }
};

export const reformatResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/resume/reformat/parse", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Reformat response data:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    handleError(error, "Failed to reformat resume");
  }
};

export const exportResume = async ({ format, resumeData }) => {
  try {
    const response = await api.post(
      "/resume/reformat/export",
      { format, resumeData },
      { responseType: "blob" },
    );
    return response.data;
  } catch (error) {
    handleError(error, `Failed to export resume as ${format}`);
  }
};

export const matchResumesToJob = async (jobId, resumeFiles) => {
  try {
    const formData = new FormData();
    resumeFiles.forEach((file) => formData.append("resumes", file));
    const response = await api.post(`/resume/match/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to match resumes");
  }
};

export default api;

// ────────────────────────────────────────────────
// Interviews
// ────────────────────────────────────────────────
export const getCandidateInterviews = async (candidateId) => {
  try {
    const response = await api.get(`/interviews/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch interviews");
  }
};

export const getInterviewQuestions = async (interviewId) => {
  try {
    const response = await api.get(`/interviews/${interviewId}/questions`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch interview questions");
  }
};

export const evaluateInterview = async (interviewId, qaData) => {
  try {
    const response = await api.post(`/interviews/${interviewId}/evaluate`, qaData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to evaluate interview");
  }
};

export const createInterview = async (payload) => {
  try {
    const response = await api.post("/interviews", payload);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to create interview");
  }
};

export const getRecruiterInterviews = async (recruiterId) => {
  if (!recruiterId) throw new Error("Recruiter ID is required");
  try {
    const response = await api.get(`/interviews/recruiter/${recruiterId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch recruiter interviews");
  }
};

// ────────────────────────────────────────────────
// Interview Recordings
// ────────────────────────────────────────────────
export const getRecordingPresignedUrl = async (interviewId, questionIndex) => {
  try {
    const response = await api.post(`/interviews/${interviewId}/recording-presigned-url`, {
      content_type: "video/webm",
      question_index: questionIndex,
    });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to get recording upload URL");
  }
};

export const markRecordingComplete = async (interviewId, questionIndex, objectKey) => {
  try {
    const response = await api.post(
      `/interviews/${interviewId}/questions/${questionIndex}/complete`,
      { question_index: questionIndex, object_key: objectKey },
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to mark recording as complete");
  }
};

export const getInterviewRecordings = async (interviewId) => {
  try {
    const response = await api.get(`/interviews/${interviewId}/recordings`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch interview recordings");
  }
};

export const getQuestionVideoUrl = async (interviewId, questionIndex) => {
  try {
    const response = await api.get(
      `/interviews/${interviewId}/questions/${questionIndex}/video`,
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch video URL");
  }
};

// ────────────────────────────────────────────────
// OTP & Password Reset
// ────────────────────────────────────────────────
export const sendOTP = async (email, purpose) => {
  try {
    const response = await api.post("/auth/send-otp", { email, purpose });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send OTP" };
  }
};

export const verifyOTP = async (email, otp, purpose) => {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp, purpose });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Invalid or expired OTP" };
  }
};

export const resetPassword = async (email, otp, new_password) => {
  try {
    const response = await api.post("/auth/reset-password", { email, otp, new_password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reset password" };
  }
};