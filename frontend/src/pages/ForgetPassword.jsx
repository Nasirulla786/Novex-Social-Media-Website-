import React, { useState } from "react";
import axios from "axios";
import { ServelURL } from "../App";
import { Mail, Lock, CheckCircle, ArrowLeft, Loader } from "lucide-react"; // Install lucide-react for icons
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Clear errors on input change
  const clearErrors = () => setError("");


  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleStep1 = async () => {
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${ServelURL}/api/auth/sendotp`,
        { email },
        { withCredentials: true }
      );
      setStep(2);
      // console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (!OTP || OTP.length < 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${ServelURL}/api/auth/verifyotp`,
        { email, OTP },
        { withCredentials: true }
      );
      setStep(3);
      // console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    if (!newPassword || !validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${ServelURL}/api/auth/resetpassword`,
        { email, password: newPassword },
        { withCredentials: true }
      );
      setSuccess("Password reset successfully! You can now log in.");
      // console.log(res.data);
      // Optional: Redirect to login after a delay
      setTimeout(() => setStep(1), 3000);
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    setError("");
    setSuccess("");
  };

  const StepIndicator = ({ currentStep }) => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              s <= currentStep ? "bg-yellow-500 text-black" : "bg-black text-yellow-500 border border-yellow-500"
            }`}
          >
            {s}
          </div>
          {s < 3 && <div className={`w-12 h-1 ${s < currentStep ? "bg-yellow-500" : "bg-yellow-500 opacity-50"}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black rounded-lg shadow-lg p-8 border border-yellow-200">
        <StepIndicator currentStep={step} />
        <h1 className="text-center text-2xl font-bold text-yellow-500 mb-6">Forgot Password</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4 flex items-center justify-center"><CheckCircle className="w-5 h-5 mr-2" />{success}</p>}

        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-black text-yellow-500 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                  aria-label="Email"
                />
              </div>
            </div>
            <button
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center"
              onClick={handleStep1}
              disabled={loading}
            >
              {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : null}
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-2">Enter OTP</label>
              <input
                type="text"
                placeholder="4-digit OTP"
                maxLength={4}
                className="w-full px-4 py-3 bg-black text-yellow-500 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                value={OTP}
                onChange={(e) => { setOTP(e.target.value); clearErrors(); }}
                aria-label="OTP"
              />
            </div>
            <button
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center"
              onClick={handleStep2}
              disabled={loading}
            >
              {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : null}
              Verify OTP
            </button>
            <button
              className="w-full mt-4 py-2 text-yellow-500 hover:text-yellow-300 transition"
              onClick={goBack}
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-4 py-3 bg-black text-yellow-500 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); clearErrors(); }}
                  aria-label="New Password"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-3 bg-black text-yellow-500 border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  value={confirmNewPassword}
                  onChange={(e) => { setConfirmNewPassword(e.target.value); clearErrors(); }}
                  aria-label="Confirm Password"
                />
              </div>
            </div>
            <button
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition flex items-center justify-center"
              onClick={handleStep3}
              disabled={loading}
            >
              {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : null}
              Reset Password
            </button>
            <button
              className="w-full mt-4 py-2 text-yellow-500 hover:text-yellow-300 transition"
              onClick={goBack}
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
