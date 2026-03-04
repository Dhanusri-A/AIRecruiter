import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Typography,
  IconButton,
} from "@mui/material";
import { Mail, Lock, Key, User, ChevronRight, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CandidateSignUp = () => {
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", otp: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) throw new Error("Full name is required");
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      throw new Error("Invalid email address");
    if (formData.password.length < 6)
      throw new Error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword)
      throw new Error("Passwords do not match");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!showOtp) {
        validateForm();
        setIsLoading(true);
        toast.loading("Sending OTP...");
        setTimeout(() => {
          toast.dismiss();
          toast.success("OTP sent (mock)");
          setShowOtp(true);
          setModalOpen(true);
          setIsLoading(false);
        }, 1000);
      } else {
        if (!hasAgreed) {
          setModalOpen(true);
          return;
        }
        if (formData.otp.length !== 6)
          throw new Error("Enter valid 6-digit OTP");

        setIsLoading(true);
        toast.loading("Creating account...");
        setTimeout(() => {
          toast.dismiss();
          toast.success("Account created successfully!");
          navigate("/buildresume", { replace: true });
        }, 1200);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    if (isChecked) {
      setHasAgreed(true);
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Toaster position="top-center" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl w-full max-w-md py-8 px-10 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-2xl px-8 py-4 rounded-2xl shadow-lg">
              Profile AI
            </div>
          </div>
        </div>

        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-200/50 ring-4 ring-blue-100">
          <User size={36} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Candidate Sign Up
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Create your profile and start applying
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            disabled={showOtp}
            InputProps={{
              startAdornment: <InputAdornment position="start"><User className="text-gray-500" size={20} /></InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white', '& fieldset': { borderColor: '#d1d5db' }, '&:hover fieldset': { borderColor: '#3b82f6' }, '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' } },
              '& .MuiInputLabel-root': { color: '#6b7280' }, '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
            }}
          />

          <TextField
            id="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={showOtp}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Mail className="text-gray-500" size={20} /></InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white', '& fieldset': { borderColor: '#d1d5db' }, '&:hover fieldset': { borderColor: '#3b82f6' }, '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' } },
              '& .MuiInputLabel-root': { color: '#6b7280' }, '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
            }}
          />

          <TextField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            disabled={showOtp}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock className="text-gray-500" size={20} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white', '& fieldset': { borderColor: '#d1d5db' }, '&:hover fieldset': { borderColor: '#3b82f6' }, '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' } },
              '& .MuiInputLabel-root': { color: '#6b7280' }, '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
            }}
          />

          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={showOtp}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock className="text-gray-500" size={20} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white', '& fieldset': { borderColor: '#d1d5db' }, '&:hover fieldset': { borderColor: '#3b82f6' }, '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' } },
              '& .MuiInputLabel-root': { color: '#6b7280' }, '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
            }}
          />

          {showOtp && (
            <TextField
              id="otp"
              label="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              placeholder="000000"
              inputProps={{ maxLength: 6 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Key className="text-gray-500" size={20} /></InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white', '& fieldset': { borderColor: '#d1d5db' }, '&:hover fieldset': { borderColor: '#3b82f6' }, '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' } },
                '& .MuiInputLabel-root': { color: '#6b7280' }, '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
              }}
            />
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || (showOtp && !hasAgreed)}
            sx={{
              py: 1.8,
              fontSize: '1.05rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '12px',
              background: showOtp
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: showOtp
                ? '0 10px 25px -5px rgba(16,185,129,0.35)'
                : '0 10px 25px -5px rgba(59,130,246,0.35)',
              '&:hover': {
                background: showOtp
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              },
            }}
            endIcon={showOtp ? <ArrowRight /> : <ChevronRight />}
          >
            {isLoading ? "Processing..." : showOtp ? "Create Account" : "Send OTP"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/candidate-signin" className="text-blue-600 hover:text-blue-800 font-semibold">
            Sign in
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/recruiter-signup"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
          >
            Continue as Recruiter <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Terms Modal */}
      <Dialog
        open={modalOpen}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            bgcolor: 'white',
            border: '1px solid #e5e7eb',
          }
        }}
      >
        <DialogContent sx={{ p: 6 }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Typography variant="h5" fontWeight="bold" color="text.primary" mb={1}>
              Terms & Conditions
            </Typography>
            <Typography color="text.secondary" fontSize="0.875rem">
              Please review and accept our terms to continue
            </Typography>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-6 max-h-48 overflow-y-auto border border-gray-200">
            <Typography color="text.secondary" fontSize="0.875rem" lineHeight={1.6}>
              By registering as a candidate, you agree to:
              <ul className="mt-3 space-y-1.5 list-disc pl-5">
                <li>Provide accurate and truthful information</li>
                <li>Comply with our privacy policy and data usage terms</li>
                <li>Allow us to share your profile with recruiters</li>
                <li>Receive job-related communications</li>
              </ul>
            </Typography>
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 6, pb: 6, flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#2563eb' } }}
              />
            }
            label={<span className="text-gray-700 text-sm">I have read and agree to the terms and conditions</span>}
            sx={{ m: 0, width: '100%' }}
          />
          <Button
            onClick={handleAcceptTerms}
            disabled={!isChecked}
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderRadius: '12px',
              background: isChecked
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'gray',
              '&:hover': { background: '#047857' },
            }}
          >
            I Agree & Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CandidateSignUp;