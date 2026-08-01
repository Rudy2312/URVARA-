import type { Alert } from '../services/api'
import { riskColor, riskLabel } from '../utils/riskHelpers'
import { timeAgo, formatDateTime } from '../utils/formatters'

interface AlertCardProps {
  alert: Alert
  onMarkRead: (id: string) => void
}

export default function AlertCard({ alert, onMarkRead }: AlertCardProps) {
  const color = riskColor(alert.risk)

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        !alert.read ? 'bg-white border-fasal-border shadow-sm' : 'bg-fasal-surface border-fasal-border/50 opacity-70'
      }`}
    >
      {/* Left accent bar for unread */}
      {!alert.read && (
        <div
          className="absolute left-0 top-3 bottom-3 w-1 rounded-r"
          style={{ background: color }}
        />
      )}

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-base">🚨</span>
            <span className="font-600 text-fasal-slate text-sm">{alert.species} Detected</span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-600 text-white"
              style={{ background: color }}
            >
              {riskLabel(alert.risk)}
            </span>
            {!alert.read && (
              <span className="px-2 py-0.5 rounded-full text-xs font-600 bg-fasal-emerald/10 text-fasal-emerald">NEW</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-fasal-muted mb-2">
            <span>Confidence: <strong className="text-fasal-slate">{alert.confidence}%</strong></span>
            <span>Location: <strong className="text-fasal-slate">{alert.boundary}</strong></span>
            <span>Action: <strong className="text-fasal-slate">{alert.recommendation}</strong></span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-fasal-muted">{formatDateTime(alert.timestamp)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xs text-fasal-muted whitespace-nowrap">{timeAgo(alert.timestamp)}</span>
          {!alert.read && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="text-xs font-500 text-fasal-emerald hover:text-fasal-emerald-dark transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
