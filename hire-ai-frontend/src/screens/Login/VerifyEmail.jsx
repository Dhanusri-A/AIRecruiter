import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid verification link");
      navigate("/recruiter-signin");
      return;
    }

    axios
      .post(`${API_BASE_URL}/auth/verify-email`, { token })
      .then((res) => {
        toast.success(res.data.message || "Email verified successfully");
        navigate("/recruiter-signin");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.detail || "Verification link expired or invalid"
        );
        navigate("/recruiter-signin");
      });
  }, []);

  return null; // no UI, this page exists only to do work
};

export default VerifyEmail;