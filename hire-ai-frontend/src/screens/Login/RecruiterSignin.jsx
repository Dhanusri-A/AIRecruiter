import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import amzLogo from "../../assets/images/amz-logo.png";
import { loginUser } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const RecruiterSignIn = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.GOOGLE_BASE_URL || "http://localhost:8000/api/v1/auth/google/login";
  };

  const handleMicrosoftLogin = () => {
    window.location.href = import.meta.env.MICROSOFT_BASE_URL || "http://localhost:8000/api/v1/auth/microsoft/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({
        email: email,
        password,
      });

      // Store in AuthContext
      login(data);

      toast.success("Signed in successfully");

      // Redirect based on role
      if (data.user.role === "recruiter") {
        navigate("/recruiter", { replace: true });
      } else {
        navigate("/candidate", { replace: true });
      }
    } catch (err) {
      toast.error(err?.detail || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-50 px-4 py-8">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
          {/* Logo at top */}
          <div className="flex justify-center mb-0">
            <img src={amzLogo} alt="AMZ.AI" className="h-12" />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome back
          </h3>
          <p className="text-sm text-gray-500 text-center mb-8">
            Access AI-assisted profile creation and candidate management
          </p>

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full border-2 border-gray-200 rounded-xl py-3.5 flex items-center gap-3 justify-center text-sm font-medium hover:border-emerald-500 hover:bg-emerald-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleMicrosoftLogin}
              type="button"
              className="w-full border-2 border-gray-200 rounded-xl py-3.5 flex items-center gap-3 justify-center text-sm font-medium hover:border-emerald-500 hover:bg-emerald-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#f25022" d="M0 0h11.5v11.5H0z" />
                <path fill="#00a4ef" d="M12.5 0H24v11.5H12.5z" />
                <path fill="#7fba00" d="M0 12.5h11.5V24H0z" />
                <path fill="#ffb900" d="M12.5 12.5H24V24H12.5z" />
              </svg>
              Continue with Microsoft
            </button>

            <button className="w-full border-2 border-gray-200 rounded-xl py-3.5 flex items-center gap-3 justify-center text-sm font-medium hover:border-emerald-500 hover:bg-emerald-50 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          <div className="flex items-center my-6 gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Or continue with email
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Work Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  className="w-full border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-gray-900"
                  placeholder="you@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  className="w-full border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-12 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-gray-900"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="font-medium">Remember me</span>
              </label>
              <Link
                to="#"
                className="text-emerald-600 font-semibold hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-emerald-500/30 transition-all"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/recruiter-signup"
              className="text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/candidate-signin"
              className="text-sm text-gray-500 hover:text-emerald-600 font-medium inline-flex items-center gap-1"
            >
              Continue as Candidate
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSignIn;