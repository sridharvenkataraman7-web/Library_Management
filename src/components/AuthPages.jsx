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
  Check,
  ArrowLeft
} from "lucide-react";

export const AuthPages = () => {
  const { login, signup } = useApp();

  // Mode: "select-portal" | "student-signin" | "student-signup" | "librarian-signin" | "forgot-password"
  const [portalMode, setPortalMode] = useState("select-portal");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [department, setDepartment] = useState("Computer Science & AI");

  // Messages
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Handlers
  const handleStudentSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setIsSuccess(false);
      return;
    }
    login(email, password, "student");
  };

  const handleLibrarianSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setIsSuccess(false);
      return;
    }
    login(email, password, "librarian");
  };

  const handleStudentSignUp = (e) => {
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
      setMessage("Please enter your registered email address.");
      setIsSuccess(false);
      return;
    }
    setIsSuccess(true);
    setMessage(`Password reset instructions sent to ${email}. Please check your inbox!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-6 animate-fadeIn">
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

        {/* Global Error/Success Alert Message */}
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

        {/* PORTAL SCREEN 1: PORTAL SELECTION SCREEN */}
        {portalMode === "select-portal" && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-slate-800 space-y-6 shadow-2xl">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-extrabold text-white">Select Your Campus Portal</h2>
              <p className="text-xs text-slate-400">Choose your account type to proceed to the login portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Student Portal Entry */}
              <div
                onClick={() => {
                  setMessage("");
                  setEmail("alex.morgan@campus.edu");
                  setPassword("student123");
                  setPortalMode("student-signin");
                }}
                className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/30 hover:border-indigo-500/80 cursor-pointer transition-all group hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Student Portal
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Search 10,000+ books, check real-time availability, track queue position & locate 2D shelf maps.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>Sign In as Student</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Librarian / Admin Portal Entry */}
              <div
                onClick={() => {
                  setMessage("");
                  setEmail("sarah.lin@campus.edu");
                  setPassword("admin123");
                  setPortalMode("librarian-signin");
                }}
                className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-violet-950/40 border border-violet-500/30 hover:border-violet-500/80 cursor-pointer transition-all group hover:-translate-y-1 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                      Librarian & Admin Portal
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Manage catalogue inventory, process student queue holds, issue/return books & view reports.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-violet-400 group-hover:text-violet-300">
                  <span>Sign In as Librarian</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PORTAL SCREEN 2: DEDICATED STUDENT SIGN IN */}
        {portalMode === "student-signin" && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-indigo-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Student Portal Sign In</h2>
                  <p className="text-xs text-slate-400">Access campus book discovery & queues</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMessage("");
                  setPortalMode("select-portal");
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            <form onSubmit={handleStudentSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Student Campus Email</label>
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setPortalMode("forgot-password");
                    }}
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

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("alex.morgan@campus.edu");
                    setPassword("student123");
                  }}
                  className="px-3 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold hover:bg-indigo-500/20"
                >
                  ⚡ Fill Demo Credentials
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In as Student</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-400">
              New student at college?{" "}
              <button
                onClick={() => {
                  setMessage("");
                  setEmail("");
                  setPassword("");
                  setPortalMode("student-signup");
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold"
              >
                Create Student Account
              </button>
            </div>
          </div>
        )}

        {/* PORTAL SCREEN 3: DEDICATED STUDENT SIGN UP */}
        {portalMode === "student-signup" && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-indigo-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Create Student Account</h2>
                  <p className="text-xs text-slate-400">Register to borrow books & track queues</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMessage("");
                  setPortalMode("student-signin");
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>

            <form onSubmit={handleStudentSignUp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Madhumitha S"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campus Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="madhumitha@campus.edu"
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
                    placeholder="73152413111"
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
                <span>Complete Student Registration</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* PORTAL SCREEN 4: DEDICATED LIBRARIAN / ADMIN SIGN IN */}
        {portalMode === "librarian-signin" && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-violet-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Librarian & Admin Command Portal</h2>
                  <p className="text-xs text-slate-400">Authorized Campus Staff Sign In</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMessage("");
                  setPortalMode("select-portal");
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            <form onSubmit={handleLibrarianSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Librarian Staff Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.lin@campus.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
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

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("sarah.lin@campus.edu");
                    setPassword("admin123");
                  }}
                  className="px-3 py-2 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold hover:bg-violet-500/20"
                >
                  ⚡ Fill Demo Credentials
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to Admin Portal</span>
                  <Shield className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-center font-mono">
              🛡️ Secure Staff Portal. Unauthorized access is logged.
            </div>
          </div>
        )}

        {/* PORTAL SCREEN 5: FORGOT PASSWORD */}
        {portalMode === "forgot-password" && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-slate-800 space-y-6 shadow-2xl">
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
                    placeholder="user@campus.edu"
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
              <button
                onClick={() => {
                  setMessage("");
                  setPortalMode("select-portal");
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold"
              >
                Back to Portal Selection
              </button>
            </div>
          </div>
        )}

        {/* Security Footer */}
        <p className="text-center text-[11px] text-slate-500">
          Protected by Campus Single Sign-On (SSO) & SSL Encryption.
        </p>
      </div>
    </div>
  );
};
