const express = require('express')
const cors = require('cors')
require('dotenv').config()

const bookRoutes = require('./routes/bookRoutes')
const userRoutes = require('./routes/userRoutes')
const reservationRoutes = require('./routes/reservationRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/reservations', reservationRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartLib API is running 🚀', timestamp: new Date() })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ SmartLib server running on http://localhost:${PORT}`)
})
