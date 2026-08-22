import './Dashboard.css'

const STATS = [
  { icon: '📚', label: 'Total Books', value: '15,240' },
  { icon: '👥', label: 'Students', value: '1,832' },
  { icon: '📌', label: 'Active Reservations', value: '348' },
  { icon: '📤', label: 'Books Borrowed', value: '926' },
]

const TOP_BOOKS = [
  { title: 'Introduction to Algorithms', borrows: 142 },
  { title: 'Clean Code', borrows: 118 },
  { title: 'Design Patterns', borrows: 97 },
  { title: 'The Pragmatic Programmer', borrows: 85 },
]

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Librarian Dashboard</h1>
        <p>Manage books, reservations, and students</p>
      </div>

      <div className="stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="card stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-panels">
        <div className="card panel">
          <h2>📈 Most Borrowed Books</h2>
          <ul className="top-books-list">
            {TOP_BOOKS.map((b, i) => (
              <li key={i} className="top-book-item">
                <span className="rank">#{i + 1}</span>
                <span className="book-name">{b.title}</span>
                <span className="borrows">{b.borrows} borrows</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card panel">
          <h2>⚡ Quick Actions</h2>
          <div className="quick-actions">
            <button className="btn btn-primary">➕ Add New Book</button>
            <button className="btn btn-secondary">👤 Add Student</button>
            <button className="btn btn-secondary">📋 View All Reservations</button>
            <button className="btn btn-secondary">📢 Send Announcement</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
