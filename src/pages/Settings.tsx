import { useState } from 'react'

export default function Settings() {
  const [farmName, setFarmName] = useState('Demo Farm — Gujarat')
  const [notifications, setNotifications] = useState({ dashboard: true, push: false, sms: false })
  const [toast, setToast] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      {toast && (
        <div className="fixed top-6 right-6 bg-fasal-success text-white px-5 py-3 rounded-xl shadow-lg text-sm font-600 flex items-center gap-2 animate-slide-in z-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Settings saved
        </div>
      )}

      <div className="mb-6">
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-3xl font-700 text-fasal-slate uppercase tracking-wide mb-1">
          Settings
        </h1>
        <p className="text-sm text-fasal-muted">Farm configuration and system parameters</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Farm Info */}
        <Section title="Farm Configuration">
          <Field label="Farm Name">
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-fasal-border text-sm text-fasal-slate focus:outline-none focus:border-fasal-emerald focus:ring-2 focus:ring-fasal-emerald/20 transition-all bg-white"
            />
          </Field>
          <Field label="Camera Status">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-fasal-surface rounded-lg border border-fasal-border">
              <span className="w-2 h-2 rounded-full bg-fasal-success"/>
              <span className="text-sm text-fasal-slate font-500">CAM-01 Online · 1080p · 24 FPS</span>
            </div>
          </Field>
        </Section>

        {/* AI Model */}
        <Section title="AI Model">
          <Field label="Model">
            <div className="px-3 py-2.5 bg-fasal-surface rounded-lg border border-fasal-border">
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-fasal-slate">YOLOv8-nano · Animal-Detection-v2.1</span>
            </div>
          </Field>
          <Field label="System Version">
            <div className="px-3 py-2.5 bg-fasal-surface rounded-lg border border-fasal-border">
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-fasal-slate">FasalRaksha v1.0.0 · Build 2025.07.01</span>
            </div>
          </Field>
          <Field label="Inference Latency">
            <div className="px-3 py-2.5 bg-fasal-surface rounded-lg border border-fasal-border">
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm text-fasal-success">38ms avg · Edge processor</span>
            </div>
          </Field>
        </Section>

        {/* Notifications */}
        <Section title="Notification Settings">
          <div className="space-y-3">
            <ToggleRow
              label="Dashboard Alerts"
              desc="Show alert cards in the Alerts page"
              active={notifications.dashboard}
              onToggle={() => setNotifications((n) => ({ ...n, dashboard: !n.dashboard }))}
            />
            <ToggleRow
              label="Push Notifications"
              desc="Mobile push (simulated — not wired in demo)"
              active={notifications.push}
              onToggle={() => setNotifications((n) => ({ ...n, push: !n.push }))}
            />
            <ToggleRow
              label="SMS Alerts"
              desc="SMS to registered farmer number (future)"
              active={notifications.sms}
              onToggle={() => setNotifications((n) => ({ ...n, sms: !n.sms }))}
            />
          </div>
        </Section>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-fasal-emerald hover:bg-fasal-emerald-dark text-white text-sm font-600 rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-fasal-border p-5">
      <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-base font-700 text-fasal-slate uppercase tracking-wide mb-4 border-b border-fasal-border pb-3">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-600 text-fasal-muted uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, active, onToggle }: { label: string; desc: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-600 text-fasal-slate">{label}</p>
        <p className="text-xs text-fasal-muted mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="relative w-11 h-6 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-fasal-emerald flex-shrink-0"
        style={{ background: active ? '#0F5E3C' : '#D1DDD9' }}
        aria-pressed={active}
        aria-label={label}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: active ? '24px' : '4px' }}
        />
      </button>
    </div>
  )
}
