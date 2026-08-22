import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/books', label: 'Books' },
    { path: '/reservations', label: 'Reservations' },
    { path: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">📚</span>
        <span className="brand-name">SmartLib</span>
      </div>
      <ul className="navbar-links">
        {links.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="navbar-actions">
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar
