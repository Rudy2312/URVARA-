import type { Alert } from '../services/api'
import { riskColor } from '../utils/riskHelpers'
import { timeAgo } from '../utils/formatters'

export default function NotificationCard({ alert }: { alert: Alert | null }) {
  if (!alert) {
    return (
      <div className="rounded-2xl border border-fasal-border p-4 bg-gray-50 max-w-sm mx-auto">
        <div className="text-center py-6 text-fasal-muted text-sm">No recent notifications</div>
      </div>
    )
  }

  const color = riskColor(alert.risk)

  return (
    <div className="max-w-sm mx-auto">
      <p className="text-xs text-fasal-muted mb-2 text-center font-500">Simulated Push Notification</p>
      {/* Phone frame mockup */}
      <div className="relative border-4 border-fasal-slate rounded-3xl overflow-hidden bg-gray-100 p-1">
        <div className="bg-fasal-slate rounded-2xl overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2">
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-white text-xs">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="white" fillOpacity="0.7"><rect x="0" y="6" width="3" height="4" rx="0.5"/><rect x="4" y="4" width="3" height="6" rx="0.5"/><rect x="8" y="2" width="3" height="8" rx="0.5"/><rect x="12" y="0" width="2" height="10" rx="0.5" fillOpacity="0.3"/></svg>
              <svg width="14" height="10" viewBox="0 0 16 12" fill="white" fillOpacity="0.7"><path d="M8 2.4C5.6 2.4 3.4 3.4 1.8 5L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2L14.2 5C12.6 3.4 10.4 2.4 8 2.4z"/><path d="M8 6.8C6.6 6.8 5.4 7.4 4.4 8.4l-1.8-1.8C3.9 5.3 5.8 4.4 8 4.4s4.1.9 5.4 2.2L11.6 8.4C10.6 7.4 9.4 6.8 8 6.8z"/><circle cx="8" cy="11" r="1.5"/></svg>
              <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="white" strokeOpacity="0.5"/><rect x="1" y="1" width="13" height="9" rx="2" fill="white"/><path d="M20 3.5v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Notification */}
          <div className="mx-3 mb-4 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)' }}>
            <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10">
              <div className="w-6 h-6 rounded-md bg-fasal-emerald flex items-center justify-center text-xs">🌿</div>
              <span className="text-xs font-600 text-gray-800">FasalRaksha</span>
              <span className="ml-auto text-xs text-gray-400">{timeAgo(alert.timestamp)}</span>
            </div>
            <div className="px-3 py-3">
              <p className="font-600 text-sm text-gray-900 mb-1">
                ⚠ {alert.species} detected — {alert.risk} Risk
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Location: {alert.boundary} · Confidence: {alert.confidence}%
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Action triggered: {alert.recommendation}
              </p>
              <div
                className="text-xs font-600 text-center py-1.5 rounded-lg text-white"
                style={{ background: color }}
              >
                Open Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
