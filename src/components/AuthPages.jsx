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
  Building,
  IdCard,
  Check
} from "lucide-react";

export const AuthPages = () => {
  const { login, signup, switchPersona } = useApp();

  const [authView, setAuthView] = useState("signin"); // "signin" | "signup" | "forgot-password"
  const [role, setRole] = useState("student"); // "student" | "librarian"

  // Form states
  const [email, setEmail] = useState("alex.morgan@campus.edu");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [department, setDepartment] = useState("Computer Science & AI");

  // Success / error message
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setIsSuccess(false);
      return;
    }

    login(email, password, role);
  };

  const handleQuickDemoStudent = () => {
    setEmail("alex.morgan@campus.edu");
    setPassword("student123");
    setRole("student");
    login("alex.morgan@campus.edu", "student123", "student");
  };

  const handleQuickDemoLibrarian = () => {
    setEmail("sarah.lin@campus.edu");
    setPassword("admin123");
    setRole("librarian");
    login("sarah.lin@campus.edu", "admin123", "librarian");
  };

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


  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your registered campus email address.");
      setIsSuccess(false);
      return;
    }

    setIsSuccess(true);
    setMessage(`Password reset link sent to ${email}. Check your campus inbox!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glow Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-6 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Libra<span className="text-indigo-400">X</span>
              </span>
              <p className="text-xs text-slate-400 font-medium">Smart Digital Library Reservation System</p>
            </div>
          </div>
        </div>

        {/* Demo Quick Sign-in Banner Bar */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">Quick Demo Login:</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleQuickDemoStudent}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-md shadow-indigo-600/30 transition-all"
            >
              Demo Student ➔
            </button>
            <button
              onClick={handleQuickDemoLibrarian}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] shadow-md shadow-violet-600/30 transition-all"
            >
              Demo Librarian ➔
            </button>
          </div>
        </div>

        {/* Auth Glass Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border-slate-800 space-y-6 shadow-2xl">
          {/* Status Message Alert */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                isSuccess
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                  : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
              }`}
            >
              {isSuccess ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : null}
              <span>{message}</span>
            </div>
          )}

          {/* VIEW 1: SIGN IN PAGE */}
          {authView === "signin" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-white">Sign In to Campus Portal</h2>
                <p className="text-xs text-slate-400">Access digital library queue, shelf locator & reservations.</p>
              </div>

              {/* Role Toggle Selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setRole("student");
                    setEmail("alex.morgan@campus.edu");
                    setPassword("student123");
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === "student"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Persona</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("librarian");
                    setEmail("sarah.lin@campus.edu");
                    setPassword("admin123");
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === "librarian"
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Librarian Persona</span>
                </button>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campus Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-white text-xs placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold">Password</label>
                    <button
                      type="button"
                      onClick={() => setAuthView("forgot-password")}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl glass-input text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to LibraX</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Bottom Switch to Sign Up */}
              <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-400">
                New student at college?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setAuthView("signup");
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  Create Student Account
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: SIGN UP PAGE */}
          {authView === "signup" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-extrabold text-white">Create Campus Account</h2>
                <p className="text-xs text-slate-400">Register to borrow books, reserve queues & track shelves.</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campus Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.morgan@campus.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                    >
                      <option value="Computer Science & AI">Computer Science & AI</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Student ID (Optional)</label>
                    <input
                      type="text"
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                      placeholder="STU-2026-8842"
                      className="w-full py-2.5 px-3 rounded-2xl glass-input text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Create Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Complete Registration</span>
                  <Check className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-400">
                Already registered?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setAuthView("signin");
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  Sign In instead
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: FORGOT PASSWORD PAGE */}
          {authView === "forgot-password" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white">Reset Campus Password</h2>
                <p className="text-xs text-slate-400">Enter your registered campus email to receive a password reset link.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campus Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Reset Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-400">
                Remember your password?{" "}
                <button
                  onClick={() => {
                    setMessage("");
                    setAuthView("signin");
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <p className="text-center text-[11px] text-slate-500">
          Protected by Campus Single Sign-On (SSO) & SSL Encryption.
        </p>
      </div>
    </div>
  );
};
