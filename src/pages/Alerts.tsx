import { useOutletContext } from 'react-router'
import AlertCard from '../components/AlertCard'
import NotificationCard from '../components/NotificationCard'
import type { Alert } from '../services/api'

interface Ctx {
  alerts: Alert[]
  markRead: (id: string) => void
  markAllRead: () => void
  unreadCount: number
}

export default function Alerts() {
  const { alerts, markRead, markAllRead, unreadCount } = useOutletContext<Ctx>()
  const latest = alerts.find((a) => !a.read) ?? alerts[0] ?? null

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-3xl font-700 text-fasal-slate uppercase tracking-wide mb-1">
            Alerts
          </h1>
          <p className="text-sm text-fasal-muted">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All alerts read'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 text-sm font-600 text-fasal-emerald border border-fasal-emerald/30 rounded-lg hover:bg-fasal-emerald/5 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert feed */}
        <div className="lg:col-span-2 space-y-3">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onMarkRead={markRead} />
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-16 text-fasal-muted text-sm">
              No alerts yet. Trigger a simulated detection to see one.
            </div>
          )}
        </div>

        {/* Simulated phone notification */}
        <div>
          <div className="bg-fasal-surface rounded-xl border border-fasal-border p-5">
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-base font-700 text-fasal-slate uppercase tracking-wide mb-1">
              Push Preview
            </h2>
            <p className="text-xs text-fasal-muted mb-5">Simulated mobile notification</p>
            <NotificationCard alert={latest} />
            <p className="text-center text-xs text-fasal-muted mt-4 italic">
              * Simulated — real push notifications not wired for hackathon build
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
