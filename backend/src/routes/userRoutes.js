const express = require('express')
const router = express.Router()

// POST register student
router.post('/register', (req, res) => {
  const { name, email, password, studentId } = req.body
  // TODO: Hash password, insert into DB
  res.status(201).json({ message: 'Student registered', data: { name, email, studentId } })
})

// POST login (student or librarian)
router.post('/login', (req, res) => {
  const { email, password, role } = req.body
  // TODO: Validate credentials, return JWT token
  res.json({ message: 'Login successful', token: 'jwt_token_here', role })
})

// GET student profile
router.get('/profile/:id', (req, res) => {
  res.json({ message: `Get profile for user ${req.params.id}` })
})

module.exports = router
