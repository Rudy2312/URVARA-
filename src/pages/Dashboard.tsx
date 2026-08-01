import { Outlet, useNavigate, useLocation } from 'react-router'
import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useDetectionFeed } from '../hooks/useDetectionFeed'
import { useAlerts } from '../hooks/useAlerts'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!sessionStorage.getItem('fasalraksha_auth')) {
      navigate('/login')
    }
  }, [navigate])

  const {
    current,
    history,
    autoMode,
    setAutoMode,
    triggerDetection,
    applyYoloDetection,
    yoloActive,
    setYoloActive,
  } = useDetectionFeed()
  const { alerts, markRead, markAllRead, unreadCount } = useAlerts(current)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  })()

  const farmOnline = true

  return (
    <div className="min-h-screen bg-fasal-surface flex">
      <Sidebar unreadAlerts={unreadCount} />

      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-fasal-border flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <p className="text-sm font-600 text-fasal-slate">{greeting}, Demo Farmer</p>
            <p className="text-xs text-fasal-muted">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={triggerDetection}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-600 bg-fasal-amber/10 text-fasal-amber border border-fasal-amber/30 rounded-lg hover:bg-fasal-amber/20 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
              Simulate Detection
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-600" style={{
              background: farmOnline ? 'rgba(31,157,85,0.1)' : 'rgba(91,107,99,0.1)',
              borderColor: farmOnline ? 'rgba(31,157,85,0.3)' : 'rgba(91,107,99,0.3)',
              color: farmOnline ? '#1F9D55' : '#5B6B63',
            }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: farmOnline ? '#1F9D55' : '#5B6B63' }} />
              Farm {farmOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet
            context={{
              current,
              history,
              autoMode,
              setAutoMode,
              triggerDetection,
              applyYoloDetection,
              yoloActive,
              setYoloActive,
              alerts,
              markRead,
              markAllRead,
              unreadCount,
            }}
          />
        </main>
      </div>
    </div>
  )
}
