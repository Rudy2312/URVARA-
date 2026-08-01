import { useNavigate } from 'react-router'

interface KpiCardProps {
  icon: string
  label: string
  value: string | number
  sub?: string
  color?: string
  to?: string
}

export function KpiCard({ icon, label, value, sub, color = '#0F5E3C', to }: KpiCardProps) {
  const navigate = useNavigate()

  return (
    <button
      className="bg-white rounded-xl border border-fasal-border p-5 text-left hover:shadow-md hover:border-opacity-60 transition-all group w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-fasal-emerald"
      onClick={() => to && navigate(to)}
      style={{ cursor: to ? 'pointer' : 'default' }}
      aria-label={`${label}: ${value}${sub ? ' — ' + sub : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${color}18` }}>
          {icon}
        </div>
        {to && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" className="group-hover:stroke-fasal-emerald transition-colors">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        )}
      </div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', color }} className="text-4xl font-700 leading-none mb-1">
        {value}
      </div>
      <p className="text-fasal-muted text-sm font-500">{label}</p>
      {sub && <p className="text-xs text-fasal-muted/70 mt-0.5">{sub}</p>}
    </button>
  )
}
