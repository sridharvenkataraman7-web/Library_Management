import './Reservations.css'

const MOCK_RESERVATIONS = [
  { id: 1, book: 'Clean Code', author: 'Robert C. Martin', queuePos: 2, total: 4, date: '2026-08-20', status: 'waiting' },
  { id: 2, book: 'Database System Concepts', author: 'Silberschatz', queuePos: 1, total: 3, date: '2026-08-21', status: 'ready' },
]

function Reservations() {
  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <h1>📌 My Reservations</h1>
        <p>Track your reserved books and queue positions</p>
      </div>

      <div className="reservations-list">
        {MOCK_RESERVATIONS.map(r => (
          <div key={r.id} className="card reservation-card">
            <div className="res-info">
              <h3>{r.book}</h3>
              <p>by {r.author}</p>
              <p className="res-date">Reserved on: {r.date}</p>
            </div>
            <div className="res-queue">
              <div className="queue-badge">
                <span className="queue-pos">{r.queuePos}</span>
                <span className="queue-label">/ {r.total} in queue</span>
              </div>
              <span className={`status-badge status-${r.status}`}>
                {r.status === 'ready' ? '🟢 Ready to Pickup' : '🟡 Waiting'}
              </span>
            </div>
            <button className="btn btn-secondary">Cancel Reservation</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reservations
