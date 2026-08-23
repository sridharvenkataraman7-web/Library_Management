const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const bookRoutes        = require('./routes/bookRoutes')
const userRoutes        = require('./routes/userRoutes')
const reservationRoutes = require('./routes/reservationRoutes')
const authRoutes        = require('./routes/authRoutes')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Global Middleware ─────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
}))
app.use(express.json())

// ─── Rate Limiting for Auth Endpoints ─────────────────────────────────────
// Max 10 OTP requests per IP per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth requests from this IP. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/reservations', reservationRoutes)

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SmartLib API is running 🚀',
    timestamp: new Date(),
    gmailConfigured: !!(
      process.env.GMAIL_USER &&
      process.env.GMAIL_APP_PASSWORD &&
      process.env.GMAIL_USER !== 'your.email@gmail.com'
    ),
  })
})

// ─── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ SmartLib server running on http://localhost:${PORT}`)
  const gmailOk = process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your.email@gmail.com'
  if (gmailOk) {
    console.log(`📧 Gmail OTP: Configured (${process.env.GMAIL_USER})`)
  } else {
    console.warn(`⚠️  Gmail OTP: NOT configured — running in DEV mode (OTP returned in API response)`)
    console.warn(`   → Edit backend/.env and set GMAIL_USER + GMAIL_APP_PASSWORD to enable real email`)
  }
})
