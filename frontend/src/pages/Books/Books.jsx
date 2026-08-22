import { useState } from 'react'
import './Books.css'

const MOCK_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Cormen', isbn: '978-0262033848', category: 'CS', available: true, rack: 'A', shelf: 3 },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'CS', available: false, rack: 'B', shelf: 1 },
  { id: 3, title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', category: 'CS', available: true, rack: 'B', shelf: 2 },
  { id: 4, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', isbn: '978-0135957059', category: 'CS', available: true, rack: 'C', shelf: 4 },
  { id: 5, title: 'Database System Concepts', author: 'Silberschatz', isbn: '978-0078022159', category: 'DB', available: false, rack: 'D', shelf: 1 },
  { id: 6, title: 'Operating System Concepts', author: 'Silberschatz', isbn: '978-1119800361', category: 'OS', available: true, rack: 'E', shelf: 2 },
]

function Books() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = MOCK_BOOKS.filter(b =>
    (filter === 'All' || b.category === filter) &&
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
     b.author.toLowerCase().includes(search.toLowerCase()) ||
     b.isbn.includes(search))
  )

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>📚 Book Catalog</h1>
        <p>Search and browse all available books</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍  Search by title, author or ISBN..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="CS">Computer Science</option>
          <option value="DB">Database</option>
          <option value="OS">Operating Systems</option>
        </select>
      </div>

      <div className="books-grid">
        {filtered.map(book => (
          <div key={book.id} className="card book-card">
            <div className="book-status-badge">
              <span className={book.available ? 'badge-available' : 'badge-unavailable'}>
                {book.available ? '✅ Available' : '❌ Borrowed'}
              </span>
            </div>
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>
            <p className="book-isbn">ISBN: {book.isbn}</p>
            <div className="book-location">
              <span>📍 Rack {book.rack} — Shelf {book.shelf}</span>
            </div>
            <button className={`btn ${book.available ? 'btn-secondary' : 'btn-primary'} book-btn`}>
              {book.available ? 'Borrow' : 'Reserve'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Books
