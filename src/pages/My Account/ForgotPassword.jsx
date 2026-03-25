import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import "./ForgotPassword.css"; // Import CSS

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address ❌");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email 📩");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP ❌");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified ✅");
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", { email, newPassword });
      toast.success("Password reset successful! 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Failed to reset password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <Toaster richColors position="top-right" />
      <div className="forgot-password-container">
        <h2 className="forgot-password-title">
          {step === 1
            ? "Forgot Password?"
            : step === 2
            ? "Enter OTP"
            : "Reset Password"}
        </h2>
        <p className="forgot-password-subtext">
          {step === 1
            ? "Enter your email to receive an OTP."
            : step === 2
            ? "Check your email for the OTP."
            : "Enter your new password."}
        </p>

        {step === 1 && (
          <div className="forgot-password-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="forgot-password-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className={`forgot-password-btn ${loading ? "disabled" : ""}`}
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="forgot-password-form">
            <input
              type="text"
              placeholder="Enter OTP"
              className="forgot-password-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              className={`forgot-password-btn ${loading ? "disabled" : ""}`}
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="forgot-password-form">
            <input
              type="password"
              placeholder="New Password"
              className="forgot-password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              className={`forgot-password-btn reset-btn ${
                loading ? "disabled" : ""
              }`}
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
