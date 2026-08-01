import { NavLink, useNavigate } from 'react-router'

interface SidebarProps {
  unreadAlerts?: number
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: GridIcon, exact: true },
  { path: '/dashboard/live', label: 'Live Monitoring', icon: CameraIcon },
  { path: '/dashboard/mitigation', label: 'Mitigation System', icon: ShieldIcon },
  { path: '/dashboard/history', label: 'Detection History', icon: HistoryIcon },
  { path: '/dashboard/alerts', label: 'Alerts', icon: BellIcon },
  { path: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar({ unreadAlerts = 0 }: SidebarProps) {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('fasalraksha_auth')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-fasal-slate flex flex-col z-40">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#0F5E3C"/>
          <path d="M8 20c0 0 2-8 10-10C18 10 20 8 20 8c0 0-8 2-10 10z" fill="#ffffff" fillOpacity="0.9"/>
          <path d="M8 20 L14 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-xl font-700 tracking-wide uppercase">
          FasalRaksha
        </span>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm font-500 transition-all relative group ${
                isActive
                  ? 'text-white bg-white/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-fasal-emerald'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === 'Alerts' && unreadAlerts > 0 && (
              <span className="ml-auto bg-fasal-danger text-white text-xs font-600 rounded-full w-5 h-5 flex items-center justify-center">
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-1 py-2 text-sm font-500 text-white/40 hover:text-fasal-danger transition-colors"
        >
          <LogoutIcon size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

function GridIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )
}
function CameraIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7 L16 12 23 17V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )
}
function ShieldIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
function HistoryIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
    </svg>
  )
}
function BellIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}
function SettingsIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
function LogoutIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
