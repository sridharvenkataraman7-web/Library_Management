const express = require('express')
const router = express.Router()

// GET all reservations for a student
router.get('/student/:studentId', (req, res) => {
  res.json({ message: `Get reservations for student ${req.params.studentId}` })
})

// POST create a reservation
router.post('/', (req, res) => {
  const { studentId, bookId } = req.body
  // TODO: Check availability, add to queue, set queue position
  res.status(201).json({ message: 'Reservation created', queuePosition: 2 })
})

// PUT cancel reservation
router.put('/:id/cancel', (req, res) => {
  res.json({ message: `Reservation ${req.params.id} cancelled` })
})

// GET queue position for a reservation
router.get('/:id/queue', (req, res) => {
  res.json({ reservationId: req.params.id, queuePosition: 1, totalInQueue: 3 })
})

module.exports = router
