const express = require('express')
const router = express.Router()

// GET all books (with search & filter)
router.get('/', (req, res) => {
  const { search, category, available } = req.query
  // TODO: Query database
  res.json({ message: 'Get all books', search, category, available })
})

// GET single book by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get book ${req.params.id}` })
})

// POST create new book (librarian only)
router.post('/', (req, res) => {
  const { title, author, isbn, category, rack, shelf, copies } = req.body
  // TODO: Insert into database
  res.status(201).json({ message: 'Book created', data: req.body })
})

// PUT update book (librarian only)
router.put('/:id', (req, res) => {
  res.json({ message: `Update book ${req.params.id}`, data: req.body })
})

// DELETE book (librarian only)
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete book ${req.params.id}` })
})

module.exports = router
