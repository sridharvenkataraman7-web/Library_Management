import { useState } from 'react'
import './Login.css'

function Login() {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ email: '', password: '' })

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-logo">📚</div>
        <h1>Welcome to SmartLib</h1>
        <p>Sign in to continue</p>

        <div className="role-toggle">
          <button className={`role-btn ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>Student</button>
          <button className={`role-btn ${role === 'librarian' ? 'active' : ''}`} onClick={() => setRole('librarian')}>Librarian</button>
        </div>

        <form className="login-form" onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary login-submit">Login as {role === 'student' ? 'Student' : 'Librarian'}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
