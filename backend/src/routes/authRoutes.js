const express = require('express');
const router  = express.Router();
const nodemailer = require('nodemailer');
const jwt     = require('jsonwebtoken');
const fs      = require('fs');
const path    = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// JSON FILE-BASED PERSISTENT USER STORE
// ═══════════════════════════════════════════════════════════════════════════

const USERS_FILE_PATH = path.join(__dirname, '..', 'database', 'users.json');

const initUserStore = () => {
  const defaultUsers = [
    {
      id: 'STU-2024-8842', name: 'Alex Morgan',
      email: 'alex.morgan@campus.edu', role: 'student',
      department: 'Computer Science & AI', joinDate: 'Sept 2023'
    },
    {
      id: 'LIB-2023-0001', name: 'Dr. Sarah Lin',
      email: 'sarah.lin@campus.edu', role: 'librarian',
      department: 'Library Administration', joinDate: 'Jan 2023'
    }
  ];

  const dbDir = path.dirname(USERS_FILE_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE_PATH)) {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(defaultUsers, null, 2), 'utf8');
    return new Map(defaultUsers.map(u => [u.email, u]));
  }

  try {
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    const users = JSON.parse(data);
    return new Map(users.map(u => [u.email, u]));
  } catch (err) {
    console.error('Failed to parse users.json, recreating defaults', err);
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(defaultUsers, null, 2), 'utf8');
    return new Map(defaultUsers.map(u => [u.email, u]));
  }
};

const userStore = initUserStore();

const saveUsersToFile = () => {
  try {
    const usersArray = Array.from(userStore.values());
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(usersArray, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write users to file:', err);
  }
};

// OTP store:      email → { otp, expiry, attempts, role }
const otpStore    = new Map();
// Resend cooldown: email → lastSentMs
const sendCooldown = new Map();

// ─── Constants ──────────────────────────────────────────────────────────────
const OTP_EXPIRY_MS = (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000;
const MAX_ATTEMPTS  = 3;
const COOLDOWN_MS   = 60 * 1000;  // 60 s between resends
const JWT_EXPIRY    = '24h';

// Auto-clean stale data every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of otpStore.entries())    { if (now > v.expiry)          otpStore.delete(k); }
  for (const [k, v] of sendCooldown.entries()) { if (now - v > COOLDOWN_MS * 3) sendCooldown.delete(k); }
}, 15 * 60 * 1000);

// ─── Helpers ────────────────────────────────────────────────────────────────
const generateOTP  = () => Math.floor(100000 + Math.random() * 900000).toString();
const genId        = (role) => `${role === 'librarian' ? 'LIB' : 'STU'}-${Date.now().toString(36).toUpperCase()}`;

const isGmailConfigured = () =>
  process.env.GMAIL_USER &&
  process.env.GMAIL_APP_PASSWORD &&
  process.env.GMAIL_USER !== 'your.email@gmail.com' &&
  process.env.GMAIL_USER.trim() !== '' &&
  process.env.GMAIL_APP_PASSWORD !== 'your_16_char_app_password' &&
  process.env.GMAIL_APP_PASSWORD.trim() !== '';

const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

const buildOtpEmail = (otp, name, role) => `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:20px;background:#0f172a;font-family:'Segoe UI',Roboto,sans-serif;">
<div style="max-width:480px;margin:0 auto;background:#1e293b;border-radius:20px;overflow:hidden;border:1px solid #334155;">
  <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 28px;text-align:center;">
    <div style="font-size:28px;font-weight:900;color:#fff;">Libra<span style="color:#a5b4fc;">X</span></div>
    <div style="font-size:12px;color:#c4b5fd;margin-top:4px;">Campus Login Verification</div>
  </div>
  <div style="padding:32px 28px;">
    <p style="color:#e2e8f0;font-size:15px;margin:0 0 8px;">Hello, <strong>${name}</strong> 👋</p>
    <p style="color:#94a3b8;font-size:13px;margin:0 0 24px;">Your <strong style="color:#818cf8;">${role === 'librarian' ? 'Librarian' : 'Student'} Portal</strong> one-time login code:</p>
    <div style="background:#0f172a;border:2px solid #4f46e5;border-radius:16px;padding:24px;text-align:center;margin-bottom:20px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#6366f1;font-weight:700;margin-bottom:12px;">One-Time Password</div>
      <div style="font-size:52px;font-weight:900;letter-spacing:14px;color:#fff;font-family:'Courier New',monospace;">${otp}</div>
    </div>
    <div style="text-align:center;font-size:13px;color:#64748b;margin-bottom:20px;">⏱ Expires in <strong style="color:#f59e0b;">10 minutes</strong> · Single use only</div>
    <div style="background:#1a0814;border:1px solid #7f1d1d;border-radius:12px;padding:14px;font-size:12px;color:#fca5a5;">
      🔒 <strong>Security:</strong> If you didn't request this, someone may be trying to access your account. Never share this code.
    </div>
  </div>
  <div style="border-top:1px solid #334155;padding:14px;text-align:center;font-size:11px;color:#475569;">
    © 2026 SmartLib Campus · Protected by SSL Encryption
  </div>
</div>
</body></html>`;

const buildWelcomeEmail = (name, email, role) => `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:20px;background:#0f172a;font-family:'Segoe UI',Roboto,sans-serif;">
<div style="max-width:480px;margin:0 auto;background:#1e293b;border-radius:20px;overflow:hidden;border:1px solid #334155;">
  <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px 28px;text-align:center;">
    <div style="font-size:28px;font-weight:900;color:#fff;">Libra<span style="color:#a7f3d0;">X</span></div>
    <div style="font-size:12px;color:#d1fae5;margin-top:4px;">Welcome to Campus Library</div>
  </div>
  <div style="padding:32px 28px;">
    <div style="font-size:36px;text-align:center;margin-bottom:16px;">🎉</div>
    <h2 style="color:#fff;text-align:center;margin:0 0 8px;">Account Created!</h2>
    <p style="color:#94a3b8;text-align:center;font-size:13px;margin:0 0 24px;">Welcome to LibraX, ${name}!</p>
    <div style="background:#0f172a;border-radius:12px;padding:16px;margin-bottom:20px;">
      <div style="font-size:12px;color:#64748b;margin-bottom:4px;">Registered Email</div>
      <div style="color:#818cf8;font-weight:700;">${email}</div>
      <div style="font-size:12px;color:#64748b;margin-top:8px;margin-bottom:4px;">Account Type</div>
      <div style="color:#34d399;font-weight:700;text-transform:capitalize;">${role}</div>
    </div>
    <p style="color:#94a3b8;font-size:13px;text-align:center;">You can now sign in using your email. An OTP will be sent to verify your identity each time.</p>
  </div>
  <div style="border-top:1px solid #334155;padding:14px;text-align:center;font-size:11px;color:#475569;">
    © 2026 SmartLib Campus · Protected by SSL Encryption
  </div>
</div>
</body></html>`;

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, role, department }
// Creates a new user account. Returns success + sends welcome email if Gmail configured.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, role, department } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email and role are required.' });
  }

  const emailLower = email.trim().toLowerCase();

  // Enforce student domain check
  if (!emailLower.endsWith('cse24_27@ksrce.ac.in')) {
    if (emailLower.endsWith('ksrei.com')) {
      return res.status(400).json({
        success: false,
        message: 'Librarians with @ksrei.com emails do not need to register. Please sign in directly.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Registration is restricted to college student emails ending with cse24_27@ksrce.ac.in'
    });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  // Validate role
  if (!['student', 'librarian'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role must be "student" or "librarian".' });
  }

  // Check if already registered
  if (userStore.has(emailLower)) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists. Please sign in instead.',
      alreadyExists: true,
    });
  }

  // Create user
  const newUser = {
    id: genId(role),
    name: name.trim(),
    email: emailLower,
    role,
    department: department || (role === 'librarian' ? 'Library Administration' : 'Computer Science & AI'),
    joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };
  userStore.set(emailLower, newUser);
  saveUsersToFile();

  console.log(`[Auth] New user registered: ${emailLower} (${role})`);

  // Send welcome email if Gmail configured
  if (isGmailConfigured()) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"LibraX Campus Portal" <${process.env.GMAIL_USER}>`,
        to: email.trim(),
        subject: '🎉 Welcome to LibraX – Account Created!',
        html: buildWelcomeEmail(newUser.name, emailLower, role),
      });
    } catch (err) {
      console.warn('[Auth] Welcome email failed (non-critical):', err.message);
    }
  }

  return res.status(201).json({
    success: true,
    message: `Account created! You can now sign in with ${emailLower}.`,
    user: { name: newUser.name, email: emailLower, role, id: newUser.id },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/send-otp
// Body: { email, role }
// Checks user exists, generates & sends OTP via Gmail (or DEV mode).
// ─────────────────────────────────────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const emailLower = email.trim().toLowerCase();

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const isLibrarianEmail = emailLower.endsWith('ksrei.com');
  const isStudentEmail = emailLower.endsWith('cse24_27@ksrce.ac.in');

  if (!isLibrarianEmail && !isStudentEmail) {
    return res.status(400).json({
      success: false,
      message: 'Access restricted. Please use @ksrei.com (Librarians) or cse24_27@ksrce.ac.in (Students) emails.'
    });
  }

  // Check user is registered
  let user = userStore.get(emailLower);
  if (!user) {
    if (isLibrarianEmail) {
      // Create librarian dynamically on-the-fly
      const prefix = emailLower.split('@')[0];
      const nameParts = prefix.split(/[\._-]/).map(p => p.charAt(0).toUpperCase() + p.slice(1));
      const formattedName = nameParts.join(' ') || 'Librarian';

      user = {
        id: genId('librarian'),
        name: formattedName,
        email: emailLower,
        role: 'librarian',
        department: 'Library Administration',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
      userStore.set(emailLower, user);
      saveUsersToFile();
      console.log(`[Auth] Librarian dynamically created for login: ${emailLower}`);
    } else {
      return res.status(404).json({
        success: false,
        message: 'No account found for this email. Please create an account first.',
        notRegistered: true,
      });
    }
  }

  // Rate limiting — 60 seconds cooldown between sends
  const lastSent = sendCooldown.get(emailLower);
  if (lastSent && Date.now() - lastSent < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastSent)) / 1000);
    return res.status(429).json({
      success: false,
      message: `Please wait ${remaining}s before requesting another OTP.`,
      cooldownRemaining: remaining,
    });
  }

  // Generate & store OTP
  const otp    = generateOTP();
  const expiry = Date.now() + OTP_EXPIRY_MS;
  otpStore.set(emailLower, { otp, expiry, attempts: 0, role: user.role, name: user.name });
  sendCooldown.set(emailLower, Date.now());

  // DEV MODE — Gmail not configured
  if (!isGmailConfigured()) {
    console.warn(`[DEV MODE] OTP for ${emailLower}: ${otp}`);
    return res.json({
      success: true,
      devMode: true,
      devOtp: otp,
      userName: user.name,
      userRole: user.role,
      message: `[Dev Mode] Gmail not configured. OTP: ${otp}`,
      expiresIn: OTP_EXPIRY_MS / 1000,
    });
  }

  // Send real email
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"LibraX Campus Portal" <${process.env.GMAIL_USER}>`,
      to: email.trim(),
      subject: `🔐 LibraX Login Code: ${otp}`,
      html: buildOtpEmail(otp, user.name, user.role),
    });

    return res.json({
      success: true,
      devMode: false,
      userName: user.name,
      userRole: user.role,
      message: `OTP sent to ${emailLower}. Check your Gmail inbox.`,
      expiresIn: OTP_EXPIRY_MS / 1000,
    });
  } catch (err) {
    console.error('[Auth] Email send error:', err.message);
    otpStore.delete(emailLower);
    sendCooldown.delete(emailLower);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Check GMAIL_USER and GMAIL_APP_PASSWORD in backend/.env',
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Body: { email, otp }
// Verifies OTP → issues JWT on success.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const emailLower = email.trim().toLowerCase();
  const record     = otpStore.get(emailLower);

  if (!record) {
    return res.status(400).json({
      success: false,
      message: 'No OTP found for this email. Please request a new one.',
    });
  }

  // Check expiry
  if (Date.now() > record.expiry) {
    otpStore.delete(emailLower);
    return res.status(400).json({
      success: false, expired: true,
      message: 'OTP has expired (10 min limit). Please request a new one.',
    });
  }

  // Increment attempt counter
  record.attempts += 1;

  // Lock after max attempts
  if (record.attempts > MAX_ATTEMPTS) {
    otpStore.delete(emailLower);
    return res.status(429).json({
      success: false, locked: true,
      message: 'Too many incorrect attempts. Please request a new OTP.',
    });
  }

  // Wrong OTP
  if (record.otp !== otp.toString().trim()) {
    const left = MAX_ATTEMPTS - record.attempts;
    return res.status(401).json({
      success: false,
      message: `Incorrect OTP. ${left} attempt${left !== 1 ? 's' : ''} remaining.`,
      attemptsLeft: left,
    });
  }

  // ✅ Correct — clear OTP, fetch user, issue JWT
  const { role, name } = record;
  otpStore.delete(emailLower);
  sendCooldown.delete(emailLower);

  const user = userStore.get(emailLower);
  const userPayload = {
    email: emailLower,
    role,
    name: user?.name || name,
    id: user?.id || genId(role),
    department: user?.department || '',
    loginAt: new Date().toISOString(),
  };

  const token = jwt.sign(userPayload, process.env.JWT_SECRET || 'smartlib_secret', {
    expiresIn: JWT_EXPIRY,
  });

  return res.json({
    success: true,
    message: 'Login successful! Welcome to LibraX.',
    token,
    user: userPayload,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/resend-otp   (body: { email })
// ─────────────────────────────────────────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
  return router.handle(
    Object.assign(req, { url: '/send-otp', method: 'POST' }),
    res,
    () => {}
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out.' });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/check-email?email=...
// Returns whether an email is already registered (for real-time validation)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/check-email', (req, res) => {
  const email = (req.query.email || '').trim().toLowerCase();
  const isLibrarianEmail = email.endsWith('ksrei.com');
  res.json({ registered: userStore.has(email) || isLibrarianEmail });
});

module.exports = router;
