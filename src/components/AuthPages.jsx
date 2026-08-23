import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  BookOpen, Mail, User, Shield, ArrowRight, Sparkles,
  CheckCircle, RefreshCw, Lock, AlertCircle, ChevronLeft,
  Loader2, UserPlus, Building, LogIn,
} from "lucide-react";

// ─── 6-Box OTP Input ────────────────────────────────────────────────────────
const OtpInput = ({ value, onChange, disabled }) => {
  const refs   = useRef([]);
  const digits = (value + "      ").slice(0, 6).split("");

  const update = (arr) => onChange(arr.join("").trimEnd());

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits]; next[i] = ch;
    update(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i].trim() && i > 0) {
      const next = [...digits]; next[i - 1] = " ";
      update(next); refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(p);
    refs.current[Math.min(p.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`
            w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2
            outline-none transition-all duration-200 bg-slate-900
            ${d.trim()
              ? "border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              : "border-slate-700 text-slate-400"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "focus:border-indigo-400 focus:shadow-indigo-500/25 hover:border-slate-600"}
          `}
        />
      ))}
    </div>
  );
};

// ─── Countdown ───────────────────────────────────────────────────────────────
const Countdown = ({ s }) => {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sc = String(s % 60).padStart(2, "0");
  return <span className="font-mono text-amber-400 font-bold">{m}:{sc}</span>;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export const AuthPages = () => {
  const {
    authView, setAuthView,
    authStep, setAuthStep,
    authLoading, authError, authSuccess, setAuthError, setAuthSuccess,
    pendingEmail, otpCooldown, devOtp,
    registerUser, sendOtp, verifyOtp, resendOtp, quickDemoLogin,
  } = useApp();

  // ── Sign In state
  const [email, setEmail] = useState("");

  // ── Register state
  const [regName,  setRegName]  = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole,  setRegRole]  = useState("student");
  const [regDept,  setRegDept]  = useState("Computer Science & AI");

  // ── OTP state
  const [otp, setOtp] = useState("");

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otp.replace(/\s/g, "").length === 6 && authStep === "otp" && !authLoading) {
      handleVerify();
    }
  }, [otp]);

  const clearMessages = () => { setAuthError(""); setAuthSuccess(""); };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email.trim()) { setAuthError("Please enter your email address."); return; }
    await sendOtp(email);
  };

  const handleVerify = async () => {
    const clean = otp.replace(/\s/g, "");
    if (clean.length < 6) { setAuthError("Enter all 6 digits."); return; }
    const ok = await verifyOtp(clean);
    if (!ok) setOtp("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setAuthError("Name and email are required."); return;
    }
    await registerUser({ name: regName, email: regEmail, role: regRole, department: regDept });
  };

  const switchTo = (view) => { clearMessages(); setOtp(""); setAuthView(view); setAuthStep("email"); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Bg glows */}
      <div className="absolute -top-56 -left-56 w-[520px] h-[520px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-56 -right-56 w-[520px] h-[520px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-5">

        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-2xl tracking-tight">
                Libra<span className="text-indigo-400">X</span>
              </div>
              <p className="text-xs text-slate-400">Smart Digital Library Reservation System</p>
            </div>
          </div>
        </div>

        {/* ── Quick Demo ────────────────────────────────────────────────── */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Quick Demo Login:
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => quickDemoLogin("student")}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-md shadow-indigo-600/30 transition-all"
            >Demo Student →</button>
            <button
              onClick={() => quickDemoLogin("librarian")}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] shadow-md shadow-violet-600/30 transition-all"
            >Demo Librarian →</button>
          </div>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-5">

          {/* Alert */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{authError}
            </div>
          )}
          {authSuccess && !authError && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />{authSuccess}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW: REGISTER
              ══════════════════════════════════════════════════════════════ */}
          {authView === "register" && authStep === "email" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-extrabold text-white">Create Campus Account</h2>
                <p className="text-xs text-slate-400">Register your Gmail to access the library system.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text" required value={regName}
                      onChange={(e) => { setRegName(e.target.value); clearMessages(); }}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">Gmail Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email" required value={regEmail}
                      onChange={(e) => { setRegEmail(e.target.value); clearMessages(); }}
                      placeholder="you@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">Account Type *</label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                    {[{ v: "student", label: "Student", Icon: User, active: "bg-indigo-600 shadow-indigo-600/30" },
                      { v: "librarian", label: "Librarian", Icon: Shield, active: "bg-violet-600 shadow-violet-600/30" }
                    ].map(({ v, label, Icon, active }) => (
                      <button key={v} type="button"
                        onClick={() => setRegRole(v)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${regRole === v ? `${active} text-white shadow-md` : "text-slate-400 hover:text-white"}`}
                      >
                        <Icon className="w-3.5 h-3.5" />{label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                    <Building className="inline w-3.5 h-3.5 mr-1 text-slate-500" />Department
                  </label>
                  <select
                    value={regDept} onChange={(e) => setRegDept(e.target.value)}
                    className="w-full py-3 px-3 rounded-2xl bg-slate-950/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    {["Computer Science & AI","Data Science","Mathematics","Physics",
                      "Management","Literature","Artificial Intelligence","Electronics",
                      "Library Administration"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={authLoading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {authLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Creating Account…</>
                    : <><UserPlus className="w-4 h-4" />Create Account</>}
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                Already have an account?{" "}
                <button onClick={() => switchTo("signin")} className="text-indigo-400 hover:text-indigo-300 font-bold">
                  Sign In →
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW: SIGN IN — Step 1: Enter Email
              ══════════════════════════════════════════════════════════════ */}
          {authView === "signin" && authStep === "email" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3">
                  <LogIn className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-extrabold text-white">Sign In to Campus Portal</h2>
                <p className="text-xs text-slate-400">
                  Enter your registered Gmail — we'll send a secure one-time code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">Registered Gmail</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email" required value={email}
                      onChange={(e) => { setEmail(e.target.value); clearMessages(); }}
                      placeholder="you@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <button type="submit" disabled={authLoading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {authLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Sending OTP…</>
                    : <><span>Send OTP to Gmail</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              {/* Security note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A 6-digit code is sent to your inbox. Only the real Gmail owner can log in — no password needed.
                </p>
              </div>

              <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                New here?{" "}
                <button onClick={() => switchTo("register")} className="text-indigo-400 hover:text-indigo-300 font-bold">
                  Create Student Account →
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW: OTP VERIFICATION — Step 2
              ══════════════════════════════════════════════════════════════ */}
          {authStep === "otp" && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                {/* Envelope icon with checkmark */}
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-white">Check Your Gmail</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We sent a 6-digit code to{" "}
                  <span className="text-indigo-300 font-bold">{pendingEmail}</span>
                </p>

                {/* Dev mode badge */}
                {devOtp && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Dev Mode OTP:&nbsp;
                    <span className="font-mono text-xl tracking-widest text-white">{devOtp}</span>
                  </div>
                )}
              </div>

              {/* OTP boxes */}
              <div className="space-y-3">
                <label className="block text-center text-[11px] text-slate-500 font-semibold uppercase tracking-widest">
                  Enter 6-Digit Code
                </label>
                <OtpInput value={otp} onChange={setOtp} disabled={authLoading} />
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={otp.replace(/\s/g,"").length < 6 || authLoading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {authLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</>
                  : <><CheckCircle className="w-4 h-4" />Verify &amp; Sign In</>}
              </button>

              {/* Resend + Back */}
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => { setAuthStep("email"); clearMessages(); setOtp(""); }}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />Change email
                </button>

                {otpCooldown > 0 ? (
                  <span className="text-slate-500">Resend in <Countdown s={otpCooldown} /></span>
                ) : (
                  <button
                    onClick={() => { setOtp(""); clearMessages(); resendOtp(); }}
                    disabled={authLoading}
                    className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />Resend OTP
                  </button>
                )}
              </div>

              {/* Security note */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                Code expires in{" "}
                <strong className="text-amber-400">10 minutes</strong>
                . Never share this code — LibraX staff will never ask for it.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-600">
          🔒 Protected by Gmail OTP Verification &amp; JWT Session Security
        </p>
      </div>
    </div>
  );
};
