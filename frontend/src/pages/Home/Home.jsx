import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const features = [
    { icon: '🔍', title: 'Search Books', desc: 'Search by title, author, ISBN or category' },
    { icon: '📍', title: 'Find Shelf', desc: 'Get exact rack & shelf location instantly' },
    { icon: '📌', title: 'Reserve Books', desc: 'Reserve unavailable books with one click' },
    { icon: '📊', title: 'Track Queue', desc: 'See your position in the reservation queue' },
    { icon: '🔔', title: 'Notifications', desc: 'Get alerted when your book is available' },
    { icon: '🤖', title: 'Smart Suggestions', desc: 'AI-powered book recommendations for you' },
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">📚 Smart Digital Library</div>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">SmartLib</span>
          </h1>
          <p className="hero-subtitle">
            Search books online, check real-time availability, find exact shelf locations,
            and reserve books — all without visiting the library.
          </p>
          <div className="hero-actions">
            <Link to="/books" className="btn btn-primary">Browse Books</Link>
            <Link to="/reservations" className="btn btn-secondary">My Reservations</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-icon">📖</div>
            <p>15,000+ Books Available</p>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section className="flow-section">
        <h2 className="section-title">How It Works</h2>
        <div className="flow-steps">
          {['Search', 'Find Shelf', 'Reserve', 'Track Queue', 'Notification', 'Recommendation'].map((step, i) => (
            <div key={i} className="flow-step">
              <div className="step-number">{i + 1}</div>
              <span>{step}</span>
              {i < 5 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="card feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
