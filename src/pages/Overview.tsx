import { useOutletContext } from 'react-router'
import { KpiCard } from '../components/DashboardCards'
import type { Detection } from '../services/api'
import { riskColor } from '../utils/riskHelpers'
import { formatDateTime } from '../utils/formatters'

interface Ctx {
  current: Detection | null
  history: Detection[]
  autoMode: boolean
}

export default function Overview() {
  const { history, autoMode } = useOutletContext<Ctx>()

  const today = history.filter((d) => {
    const ago = Date.now() - d.timestamp.getTime()
    return ago < 1000 * 60 * 60 * 24
  })

  const highRisk = today.filter((d) => d.risk === 'High').length
  const alertsSent = today.length
  const totalToday = today.length

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-3xl font-700 text-fasal-slate uppercase tracking-wide mb-1">
          Overview
        </h1>
        <p className="text-sm text-fasal-muted">Daily summary — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon="🐄"
          label="Animals Detected Today"
          value={totalToday}
          to="/dashboard/history"
          color="#0F5E3C"
        />
        <KpiCard
          icon="🔴"
          label="High Risk Events"
          value={highRisk}
          to="/dashboard/history"
          color="#B3261E"
        />
        <KpiCard
          icon="📱"
          label="Alerts Sent"
          value={alertsSent}
          to="/dashboard/alerts"
          color="#B7791F"
        />
        <KpiCard
          icon="🛡️"
          label="Protection Status"
          value="ACTIVE"
          sub={autoMode ? "Automatic Mode" : "Manual Override"}
          color="#1F9D55"
          to="/dashboard/mitigation"
        />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-fasal-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-fasal-border">
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-base font-700 text-fasal-slate uppercase tracking-wide">
            Recent Detections
          </h2>
          <a href="/dashboard/history" className="text-xs font-500 text-fasal-emerald hover:underline">View all →</a>
        </div>
        <div className="divide-y divide-fasal-border">
          {history.slice(0, 6).map((d) => (
            <div key={d.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-fasal-surface transition-colors">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: riskColor(d.risk) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-600 text-fasal-slate">{d.species}</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-600 text-white"
                    style={{ background: riskColor(d.risk) }}
                  >
                    {d.risk}
                  </span>
                </div>
                <p className="text-xs text-fasal-muted mt-0.5">{d.boundary} · {d.actionTaken}</p>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs text-fasal-muted flex-shrink-0">
                {formatDateTime(d.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <NavCard to="/dashboard/live" icon="🎥" title="Live Monitoring" desc="Open the real-time control room" />
        <NavCard to="/dashboard/mitigation" icon="🛡️" title="Mitigation System" desc="Control speakers, strobes & sprays" />
        <NavCard to="/dashboard/alerts" icon="🔔" title="Alerts" desc="Review all notifications" />
        <NavCard to="/dashboard/settings" icon="⚙️" title="Settings" desc="Configure farm parameters" />
      </div>
    </div>
  )
}

function NavCard({ to, icon, title, desc }: { to: string; icon: string; title: string; desc: string }) {
  return (
    <a
      href={to}
      className="bg-white rounded-xl border border-fasal-border p-5 hover:shadow-md hover:border-fasal-emerald/30 transition-all group flex items-center gap-4"
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <p style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-base font-700 text-fasal-slate uppercase tracking-wide group-hover:text-fasal-emerald transition-colors">{title}</p>
        <p className="text-xs text-fasal-muted">{desc}</p>
      </div>
      <svg className="ml-auto text-fasal-muted group-hover:text-fasal-emerald transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
      </svg>
    </a>
  )
}
