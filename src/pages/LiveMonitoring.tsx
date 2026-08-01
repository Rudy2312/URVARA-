import { useOutletContext } from 'react-router'
import DetectionCard from '../components/DetectionCard'
import CameraFeed from '../components/CameraFeed'
import DeviceSwitch from '../components/DeviceSwitch'
import type { Detection } from '../services/api'
import { useDeviceState } from '../hooks/useDeviceState'

interface Ctx {
  current: Detection | null
  autoMode: boolean
  setAutoMode: (v: boolean) => void
  triggerDetection: () => void
  applyYoloDetection: (det: Detection) => void
  yoloActive: boolean
  setYoloActive: (v: boolean) => void
}

export default function LiveMonitoring() {
  const {
    current,
    autoMode,
    setAutoMode,
    triggerDetection,
    applyYoloDetection,
    yoloActive,
    setYoloActive,
  } = useOutletContext<Ctx>()
  const { devices, toggle, activateAll, emergencyStop } = useDeviceState(current, autoMode)

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-3xl font-700 text-fasal-slate uppercase tracking-wide">
            Live Monitoring
          </h1>
          <p className="text-sm text-fasal-muted">
            Unified control-room view — Detection · YOLO Detector · Controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          {yoloActive && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-600 bg-fasal-success/10 text-fasal-success border border-fasal-success/30 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-fasal-success animate-pulse" />
              YOLO Live
            </span>
          )}
          <button
            onClick={triggerDetection}
            className="flex items-center gap-2 px-4 py-2 text-sm font-600 bg-fasal-amber/10 text-fasal-amber border border-fasal-amber/30 rounded-lg hover:bg-fasal-amber/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
            Simulate Detection
          </button>
        </div>
      </div>

      {/* Three-column control room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '520px' }}>
        {/* Col 1: Detection */}
        <div>
          <DetectionCard detection={current} autoMode={autoMode} />
        </div>

        {/* Col 2: YOLO Detector (live webcam) */}
        <div className="min-h-96 lg:min-h-0">
          <CameraFeed
            current={current}
            onYoloDetection={applyYoloDetection}
            onYoloActiveChange={setYoloActive}
            yoloEnabled
          />
        </div>

        {/* Col 3: Control Panel */}
        <div className="bg-fasal-slate rounded-xl border border-white/10 p-5 flex flex-col">
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-lg font-700 uppercase tracking-wide mb-4">
            Control Panel
          </h2>

          {/* Protection mode */}
          <div className="mb-5">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Protection Mode</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAutoMode(true)}
                className={`py-2 rounded-lg text-xs font-600 uppercase tracking-wide transition-all ${
                  autoMode ? 'bg-fasal-emerald text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                }`}
              >
                Automatic
              </button>
              <button
                onClick={() => setAutoMode(false)}
                className={`py-2 rounded-lg text-xs font-600 uppercase tracking-wide transition-all ${
                  !autoMode ? 'bg-fasal-amber text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                }`}
              >
                Manual
              </button>
            </div>
            {!autoMode && (
              <p className="text-fasal-amber text-xs mt-2">⚠ Manual mode — tap toggles to confirm actions</p>
            )}
          </div>

          {/* Device toggles */}
          <div className="space-y-3 flex-1">
            <DeviceSwitch
              label="LED Strobes"
              icon="💡"
              active={devices.led}
              recommended={current?.recommendation.led}
              autoMode={autoMode}
              onToggle={() => toggle('led')}
            />
            <DeviceSwitch
              label="High-Frequency Sound"
              icon="🔊"
              active={devices.sound}
              recommended={current?.recommendation.sound}
              autoMode={autoMode}
              onToggle={() => toggle('sound')}
            />
            <DeviceSwitch
              label="Water Sprayer"
              icon="💧"
              active={devices.water}
              recommended={current?.recommendation.water}
              autoMode={autoMode}
              onToggle={() => toggle('water')}
            />
          </div>

          {/* Action buttons */}
          <div className="mt-5 space-y-3">
            <button
              onClick={activateAll}
              className="w-full py-3 bg-fasal-emerald hover:bg-fasal-emerald-dark text-white text-sm font-700 uppercase tracking-wider rounded-xl transition-colors"
            >
              Activate All Deterrents
            </button>

            {/* Emergency stop — always enabled */}
            <button
              onClick={emergencyStop}
              className="w-full py-3 bg-fasal-danger hover:bg-fasal-danger-dark text-white text-sm font-700 uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              aria-label="Emergency Stop — turn off all devices"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Emergency Stop
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-white rounded-xl border border-fasal-border px-5 py-3 flex flex-wrap items-center gap-6 text-xs">
        <StatusItem label="LED" active={devices.led} />
        <StatusItem label="Sound" active={devices.sound} />
        <StatusItem label="Water" active={devices.water} />
        <div className="w-px h-4 bg-fasal-border" />
        <span className="text-fasal-muted">Mode: <strong className="text-fasal-slate">{autoMode ? 'Automatic' : 'Manual'}</strong></span>
        {current && (
          <>
            <div className="w-px h-4 bg-fasal-border" />
            <span className="text-fasal-muted">Last detection: <strong className="text-fasal-slate">{current.species}</strong> @ {current.boundary}</span>
          </>
        )}
      </div>
    </div>
  )
}

function StatusItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-fasal-success animate-pulse' : 'bg-fasal-border'}`} />
      <span className={`font-600 ${active ? 'text-fasal-success' : 'text-fasal-muted'}`}>{label}: {active ? 'ON' : 'OFF'}</span>
    </div>
  )
}
