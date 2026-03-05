import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import OTPInput from "../../components/OTPInput";
import { sendOTP, verifyOTP, resetPassword } from "../../api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendsRemaining, setResendsRemaining] = useState(2);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await sendOTP(email, "reset_password");
      toast.success("OTP sent to your email");
      if (response.resends_remaining !== undefined) {
        setResendsRemaining(response.resends_remaining);
      }
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error(err.detail || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue) => {
    setOtp(otpValue);
    setLoading(true);
    try {
      await verifyOTP(email, otpValue, "reset_password");
      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.detail || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/recruiter-signin"), 1500);
    } catch (err) {
      toast.error(err.detail || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <Link
            to="/recruiter-signin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>

          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Reset Password
          </h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            {step === 1 && "Enter your email to receive OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new password"}
          </p>

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-60 shadow-lg transition-all"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-4 block text-center">
                  Enter 6-digit OTP
                </label>
                <OTPInput length={6} onComplete={handleVerifyOTP} disabled={loading} />
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {timer > 0 ? (
                      <span className="font-semibold text-emerald-600">
                        Time remaining: {timer}s
                      </span>
                    ) : (
                      <span className="font-semibold text-red-600">
                        OTP expired
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {resendsRemaining > 0 ? `${resendsRemaining} resend(s) remaining` : "No resends remaining"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSendOTP({ preventDefault: () => {} })}
                disabled={loading || !canResend || resendsRemaining === 0}
                className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {canResend ? "Resend OTP" : `Resend OTP (${timer}s)`}
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Must be at least 8 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-60 shadow-lg transition-all"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
