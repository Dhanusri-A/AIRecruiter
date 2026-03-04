import React, { useState } from "react";
import { Mail, Lock, ChevronRight, ArrowRight, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "../../api/api";           // ← make sure path is correct
import { useAuth } from "../../context/AuthContext"; // ← make sure path is correct

const CandidateSignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      // Store token + user in context + localStorage
      login(data);

      toast.success("Login successful!");

      // Redirect based on role returned from backend
      if (data.user?.role === "candidate") {
        navigate("/candidate", { replace: true });
      } else if (data.user?.role === "recruiter") {
        // Rare case — someone tries candidate login with recruiter account
        toast("This appears to be a recruiter account", { icon: "⚠️" });
        navigate("/recruiter", { replace: true });
      } else {
        toast.error("Unknown account type");
      }
    } catch (err) {
      const errorMessage =
        err?.detail ||
        err?.message ||
        err?.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Toaster position="top-center" />

      {/* Subtle background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-10 relative z-10">
        {/* Logo / Brand */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl"></div>
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-2xl px-8 py-4 rounded-2xl shadow-lg">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6V8.5l6-3.14 6 3.14V14c0 3.31-2.69 6-6 6z"/>
              </svg>
              Profile AI
            </div>
          </div>
        </div>

        {/* Avatar icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-200/50 ring-4 ring-blue-100">
          <User size={36} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Candidate Sign In
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Access your profile and job applications
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail className="text-gray-500" size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'white',
                '& fieldset': { borderColor: '#d1d5db' },
                '&:hover fieldset': { borderColor: '#3b82f6' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
              },
              '& .MuiInputLabel-root': { color: '#6b7280' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="text-gray-500" size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'white',
                '& fieldset': { borderColor: '#d1d5db' },
                '&:hover fieldset': { borderColor: '#3b82f6' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
              },
              '& .MuiInputLabel-root': { color: '#6b7280' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
            }}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.8,
              fontSize: '1.05rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 10px 25px -5px rgba(59,130,246,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              },
            }}
            endIcon={<ChevronRight />}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/candidate-signup"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Sign up
          </Link>
        </div> */}

        <div className="mt-4 text-center">
          <Link
            to="/recruiter-signin"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
          >
            Continue as Recruiter <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateSignIn;