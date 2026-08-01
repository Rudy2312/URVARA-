interface DeviceSwitchProps {
  label: string
  icon: string
  active: boolean
  recommended?: boolean
  autoMode: boolean
  onToggle: () => void
}

export default function DeviceSwitch({ label, icon, active, recommended, autoMode, onToggle }: DeviceSwitchProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
        active
          ? 'bg-fasal-emerald/15 border-fasal-emerald/40'
          : recommended && !autoMode
          ? 'bg-fasal-amber/10 border-fasal-amber/40'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-white text-sm font-500">{label}</p>
          <p className="text-xs font-500 mt-0.5" style={{ color: active ? '#1F9D55' : recommended && !autoMode ? '#B7791F' : 'rgba(255,255,255,0.3)' }}>
            {active ? 'ACTIVE' : recommended && !autoMode ? 'RECOMMENDED' : 'STANDBY'}
          </p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className="relative w-12 h-6 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-fasal-emerald"
        style={{ background: active ? '#0F5E3C' : 'rgba(255,255,255,0.1)' }}
        aria-label={`Toggle ${label}`}
        aria-pressed={active}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: active ? '28px' : '4px' }}
        />
        {recommended && !autoMode && !active && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-fasal-amber animate-pulse" />
        )}
      </button>
    </div>
  )
}
