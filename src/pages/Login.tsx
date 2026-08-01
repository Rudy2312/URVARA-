import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import Navbar from '../components/Navbar'

export default function Login() {
  const [email, setEmail] = useState('demo@fasalraksha.ai')
  const [password, setPassword] = useState('fasalraksha123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (email === 'demo@fasalraksha.ai' && password === 'fasalraksha123') {
        sessionStorage.setItem('fasalraksha_auth', '1')
        navigate('/dashboard')
      } else {
        setError('Invalid credentials. Use demo@fasalraksha.ai / fasalraksha123')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-fasal-surface flex flex-col">
      <Navbar variant="minimal" />
      <div className="flex-1 flex items-center justify-center px-6 pt-14">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-fasal-border shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-fasal-slate flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M8 20c0 0 2-8 10-10C18 10 20 8 20 8c0 0-8 2-10 10z" fill="#0F5E3C"/>
                  <path d="M8 20 L14 14" stroke="#0F5E3C" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-2xl font-700 text-fasal-slate uppercase tracking-wide mb-1">
                Dashboard Login
              </h1>
              <p className="text-fasal-muted text-sm">FasalRaksha · Farm Monitor</p>
            </div>

            <div className="bg-fasal-surface rounded-lg px-4 py-3 mb-6 border border-fasal-border">
              <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs text-fasal-muted mb-1">Demo credentials</p>
              <p className="text-xs text-fasal-slate">
                <span className="text-fasal-muted">Email:</span> demo@fasalraksha.ai
              </p>
              <p className="text-xs text-fasal-slate">
                <span className="text-fasal-muted">Password:</span> fasalraksha123
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-600 text-fasal-muted uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-fasal-border text-sm text-fasal-slate focus:outline-none focus:border-fasal-emerald focus:ring-2 focus:ring-fasal-emerald/20 transition-all"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-600 text-fasal-muted uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-fasal-border text-sm text-fasal-slate focus:outline-none focus:border-fasal-emerald focus:ring-2 focus:ring-fasal-emerald/20 transition-all"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-fasal-danger text-xs font-500 bg-fasal-danger/5 border border-fasal-danger/20 rounded px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-fasal-emerald hover:bg-fasal-emerald-dark disabled:opacity-60 text-white font-600 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-fasal-muted mt-6">
              <Link to="/" className="text-fasal-emerald hover:underline">← Back to Landing Page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
