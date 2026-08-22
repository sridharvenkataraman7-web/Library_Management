import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle,
  KeyRound,
  Eye,
  EyeOff,
  Check
} from "lucide-react";

export const AuthPages = () => {
  const { login, signup } = useApp();

  // Primary mode starts directly on "signin"!
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup" | "forgot-password"
  const [role, setRole] = useState("student"); // "student" | "librarian"

  // Form inputs
  const [email, setEmail] = useState("alex.morgan@campus.edu");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [department, setDepartment] = useState("Computer Science & AI");

  // Notification banners
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Sign In Handler
  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both campus email and password.");
      setIsSuccess(false);
      return;
    }
    login(email, password, role);
  };

  // Quick Demo Handlers
  const handleQuickStudentFill = () => {
    setRole("student");
    setEmail("alex.morgan@campus.edu");
    setPassword("student123");
    setMessage("");
  };

  const handleQuickLibrarianFill = () => {
    setRole("librarian");
    setEmail("sarah.lin@campus.edu");
    setPassword("admin123");
    setMessage("");
  };

  // Sign Up Handler
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setMessage("Please fill in all required fields.");
      setIsSuccess(false);
      return;
    }

    const res = signup({
      name: fullName,
      email,
      department,
      studentId: studentIdInput || `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`
    });

    if (res && !res.success) {
      setMessage(res.message);
      setIsSuccess(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your registered campus email address.");
      setIsSuccess(false);
      return;
    }
    setIsSuccess(true);
    setMessage(`Password reset instructions sent to ${email}. Please check your inbox!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-4 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Decorative Warm Orange Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6 animate-fadeIn">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/25">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Smart<span className="text-orange-600">Lib</span>
              </span>
              <p className="text-xs text-slate-500 font-medium">Smart Digital Library Reservation System</p>
            </div>
          </div>
        </div>

        {/* Global Alert Message Banner */}
        {message && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              isSuccess
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {isSuccess ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : null}
            <span>{message}</span>
          </div>
        )}

        {/* Auth White Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xl">
          {/* SCREEN 1: SIGN IN (FIRST LANDING PAGE) */}
          {authMode === "signin" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900">Sign In to Campus Portal</h2>
                <p className="text-xs text-slate-500">Enter your credentials to access digital library services.</p>
              </div>

              {/* Role Toggle Selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={handleQuickStudentFill}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === "student"
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Portal</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickLibrarianFill}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === "librarian"
                      ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Librarian Admin</span>
                </button>
              </div>

              {/* Quick Demo Credentials Autofill Banner */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Demo Account:</span>
                <button
                  type="button"
                  onClick={role === "student" ? handleQuickStudentFill : handleQuickLibrarianFill}
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span>Autofill Demo ({role === "student" ? "Alex Morgan" : "Dr. Sarah Lin"})</span>
                </button>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Campus Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-slate-900 text-xs placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMessage("");
                        setAuthMode("forgot-password");
                      }}
                      className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl glass-input text-slate-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In as {role === "librarian" ? "Librarian Admin" : "Student"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Bottom Switch to Sign Up */}
              <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
                New student at college?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setFullName("");
                    setEmail("");
                    setPassword("");
                    setAuthMode("signup");
                  }}
                  className="text-orange-600 hover:text-orange-700 font-bold"
                >
                  Create Student Account
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: SIGN UP PAGE */}
          {authMode === "signup" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900">Create Student Account</h2>
                <p className="text-xs text-slate-500">Register your ID to borrow books, track queues & shelf maps.</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Madhumitha S"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Campus Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="madhumitha@campus.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-orange-500"
                    >
                      <option value="Computer Science & AI">Computer Science & AI</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Student ID (Optional)</label>
                    <input
                      type="text"
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                      placeholder="73152413111"
                      className="w-full py-2.5 px-3 rounded-2xl glass-input text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Create Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Account & Sign In</span>
                  <Check className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
                Already registered?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setAuthMode("signin");
                  }}
                  className="text-orange-600 hover:text-orange-700 font-bold"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: FORGOT PASSWORD PAGE */}
          {authMode === "forgot-password" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Reset Campus Password</h2>
                <p className="text-xs text-slate-500">Enter your registered campus email to receive a reset link.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Campus Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Reset Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
                Remember your password?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setAuthMode("signin");
                  }}
                  className="text-orange-600 hover:text-orange-700 font-bold"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <p className="text-center text-[11px] text-slate-400">
          Protected by Campus Single Sign-On (SSO) & SSL Encryption.
        </p>
      </div>
    </div>
  );
};
