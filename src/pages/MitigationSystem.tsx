import { useState, useEffect, useRef, useMemo } from 'react'
import { useOutletContext } from 'react-router'
import type { Detection } from '../services/api'

interface Ctx {
  current: Detection | null
  autoMode: boolean
  setAutoMode: (v: boolean) => void
  triggerDetection: () => void
}

type Sector = 'North' | 'South' | 'East' | 'West'

interface DeviceState {
  speakers: Record<Sector, boolean>
  strobes: Record<Sector, boolean>
  sprays: Record<Sector, boolean>
}

interface LogEntry {
  timestamp: string
  source: string
  message: string
  type: 'info' | 'warning' | 'success' | 'danger'
}

export default function MitigationSystem() {
  const { current, autoMode, setAutoMode, triggerDetection } = useOutletContext<Ctx>()

  // Device Active States per Sector
  const [devices, setDevices] = useState<DeviceState>({
    speakers: { North: false, South: false, East: false, West: false },
    strobes: { North: false, South: false, East: false, West: false },
    sprays: { North: false, South: false, East: false, West: false },
  })

  // Selected Sector for fine-grained configuration inspect
  const [selectedSector, setSelectedSector] = useState<Sector>('North')

  // Configurations
  const [speakerProfile, setSpeakerProfile] = useState<'Ultrasonic' | 'Predator' | 'Human Shout' | 'Siren'>('Ultrasonic')
  const [speakerVolume, setSpeakerVolume] = useState<number>(75)

  const [strobePattern, setStrobePattern] = useState<'Triple Flash' | 'Rapid Sweep' | 'Chaos Blinker' | 'Steady Pulse'>('Triple Flash')
  const [strobeIntensity, setStrobeIntensity] = useState<number>(80)

  const [sprayPressure, setSprayPressure] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [sprayDuration, setSprayDuration] = useState<number>(30) // seconds, 0 = manual/continuous
  const [sprayTimer, setSprayTimer] = useState<Record<Sector, number>>({ North: 0, South: 0, East: 0, West: 0 })

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: formatTime(new Date(Date.now() - 50000)), source: 'SYSTEM', message: 'Mitigation System Initialized.', type: 'info' },
    { timestamp: formatTime(new Date(Date.now() - 40000)), source: 'DEVICES', message: 'Field Speakers status: ONLINE, Strobes status: ONLINE, Sprays status: ONLINE.', type: 'success' },
    { timestamp: formatTime(new Date(Date.now() - 30000)), source: 'PRESSURE', message: 'Water feed system pressure nominal at 3.8 bar.', type: 'info' },
  ])

  const [activeTab, setActiveTab] = useState<'audio' | 'strobe' | 'water'>('audio')
  const logEndRef = useRef<HTMLDivElement>(null)

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const addLog = (source: string, message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      timestamp: formatTime(new Date()),
      source,
      message,
      type,
    }
    setLogs((prev) => [...prev, entry].slice(-50)) // Limit to 50 logs
  }

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Sync with Detection Feed in Auto Mode
  useEffect(() => {
    if (autoMode && current) {
      const targetBoundary = current.boundary.split(' ')[0] as Sector // "North Boundary" -> "North"
      if (['North', 'South', 'East', 'West'].includes(targetBoundary)) {
        addLog('AUTO-MODE', `Animal detection event: ${current.species} at ${current.boundary}. Triggering recommended mitigations...`, 'warning')

        const recommendSpeakers = current.recommendation.sound
        const recommendStrobes = current.recommendation.led
        const recommendSprays = current.recommendation.water

        setDevices((prev) => {
          const next = { ...prev }
          next.speakers[targetBoundary] = recommendSpeakers
          next.strobes[targetBoundary] = recommendStrobes
          next.sprays[targetBoundary] = recommendSprays
          return next
        })

        let actions = []
        if (recommendSpeakers) actions.push(`Audio [${speakerProfile} at ${speakerVolume}dB]`)
        if (recommendStrobes) actions.push(`Strobes [${strobePattern} at ${strobeIntensity}%]`)
        if (recommendSprays) actions.push(`Water Sprays [${sprayPressure} pressure]`)

        addLog('MITIGATION', `Activated in Sector ${targetBoundary}: ${actions.join(', ') || 'None'}.`, 'success')

        // Start water spray duration countdown if auto-spray is activated
        if (recommendSprays && sprayDuration > 0) {
          setSprayTimer((prev) => ({ ...prev, [targetBoundary]: sprayDuration }))
        }
      }
    }
  }, [current, autoMode])

  // Countdown timers for water sprays
  useEffect(() => {
    const interval = setInterval(() => {
      setSprayTimer((prev) => {
        const next = { ...prev }
        let changed = false
        ;(Object.keys(next) as Sector[]).forEach((sector) => {
          if (next[sector] > 0) {
            next[sector] -= 1
            changed = true
            if (next[sector] === 0) {
              setDevices((prevDev) => {
                const updated = { ...prevDev }
                updated.sprays[sector] = false
                return updated
              })
              addLog('WATER-GRID', `Sector ${sector} spray grid auto-off timer expired. Solenoid valves closed.`, 'info')
            }
          }
        })
        return changed ? next : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Toggle specific device in a sector
  const toggleDevice = (type: keyof DeviceState, sector: Sector) => {
    if (autoMode) {
      addLog('SYSTEM', 'Override rejected. Cannot manually toggle devices while in Automatic Protection Mode.', 'warning')
      return
    }

    setDevices((prev) => {
      const isCurrentlyActive = prev[type][sector]
      const updated = {
        ...prev,
        [type]: {
          ...prev[type],
          [sector]: !isCurrentlyActive,
        },
      }

      const deviceLabel = type === 'speakers' ? 'Field Speaker' : type === 'strobes' ? 'Strobe Matrix' : 'Water Spray'
      const statusLabel = !isCurrentlyActive ? 'ACTIVATED' : 'DEACTIVATED'
      const typeStyle = !isCurrentlyActive ? 'success' : 'warning'

      addLog('MANUAL-CTRL', `${deviceLabel} in Sector ${sector} manually ${statusLabel}.`, typeStyle as LogEntry['type'])

      if (type === 'sprays') {
        if (!isCurrentlyActive && sprayDuration > 0) {
          setSprayTimer((t) => ({ ...t, [sector]: sprayDuration }))
        } else {
          setSprayTimer((t) => ({ ...t, [sector]: 0 }))
        }
      }

      return updated
    })
  }

  // Global Actions
  const handleEmergencyStop = () => {
    setDevices({
      speakers: { North: false, South: false, East: false, West: false },
      strobes: { North: false, South: false, East: false, West: false },
      sprays: { North: false, South: false, East: false, West: false },
    })
    setSprayTimer({ North: 0, South: 0, East: 0, West: 0 })
    addLog('GLOBAL-CTRL', 'EMERGENCY STOP DEPLOYED. Shutting down all field devices instantly.', 'danger')
  }

  const handleTestAll = () => {
    if (autoMode) {
      addLog('SYSTEM', 'Override rejected. Switch to Manual mode to perform system testing.', 'warning')
      return
    }
    addLog('GLOBAL-CTRL', 'Initiating full deterrent sweep (All sectors active).', 'info')
    setDevices({
      speakers: { North: true, South: true, East: true, West: true },
      strobes: { North: true, South: true, East: true, West: true },
      sprays: { North: true, South: true, East: true, West: true },
    })

    if (sprayDuration > 0) {
      setSprayTimer({ North: sprayDuration, South: sprayDuration, East: sprayDuration, West: sprayDuration })
    }
  }

  const handleSilenceAll = () => {
    if (autoMode) {
      addLog('SYSTEM', 'Override rejected. Switch to Manual mode to silence devices.', 'warning')
      return
    }
    setDevices({
      speakers: { North: false, South: false, East: false, West: false },
      strobes: { North: false, South: false, East: false, West: false },
      sprays: { North: false, South: false, East: false, West: false },
    })
    setSprayTimer({ North: 0, South: 0, East: 0, West: 0 })
    addLog('GLOBAL-CTRL', 'All deterrent devices silenced/placed in STANDBY.', 'info')
  }

  // Quick stats calculations
  const totalActiveSpeakers = Object.values(devices.speakers).filter(Boolean).length
  const totalActiveStrobes = Object.values(devices.strobes).filter(Boolean).length
  const totalActiveSprays = Object.values(devices.sprays).filter(Boolean).length

  // Simulated live water flow rate (L/min)
  const simulatedFlowRate = useMemo(() => {
    if (totalActiveSprays === 0) return 0
    const factor = sprayPressure === 'High' ? 18 : sprayPressure === 'Medium' ? 12 : 7
    return totalActiveSprays * factor
  }, [totalActiveSprays, sprayPressure])

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-3xl font-700 text-fasal-slate uppercase tracking-wide">
            Mitigation System
          </h1>
          <p className="text-sm text-fasal-muted">Response Center — Control field deterrent arrays & grids</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-fasal-border bg-white text-xs font-600">
            <span className="text-fasal-muted">System Health:</span>
            <span className="text-fasal-success">99.8%</span>
          </div>
          <button
            onClick={triggerDetection}
            className="flex items-center gap-2 px-4 py-2 text-sm font-600 bg-fasal-amber/10 text-fasal-amber border border-fasal-amber/30 rounded-lg hover:bg-fasal-amber/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
            Simulate Alert
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-fasal-border flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${totalActiveSpeakers > 0 ? 'bg-fasal-emerald/10 text-fasal-emerald' : 'bg-fasal-slate/5 text-fasal-muted'}`}>
            🔊
          </div>
          <div>
            <p className="text-xs text-fasal-muted font-500 uppercase tracking-wider">Speakers Active</p>
            <h3 className="text-2xl font-700 text-fasal-slate">{totalActiveSpeakers} / 4</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-fasal-border flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${totalActiveStrobes > 0 ? 'bg-fasal-amber/10 text-fasal-amber' : 'bg-fasal-slate/5 text-fasal-muted'}`}>
            💡
          </div>
          <div>
            <p className="text-xs text-fasal-muted font-500 uppercase tracking-wider">Strobes Active</p>
            <h3 className="text-2xl font-700 text-fasal-slate">{totalActiveStrobes} / 4</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-fasal-border flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${totalActiveSprays > 0 ? 'bg-blue-500/10 text-blue-600' : 'bg-fasal-slate/5 text-fasal-muted'}`}>
            💧
          </div>
          <div>
            <p className="text-xs text-fasal-muted font-500 uppercase tracking-wider">Water Sprays</p>
            <h3 className="text-2xl font-700 text-fasal-slate">{totalActiveSprays} / 4</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-fasal-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
            📈
          </div>
          <div>
            <p className="text-xs text-fasal-muted font-500 uppercase tracking-wider">Est. Water Flow</p>
            <h3 className="text-2xl font-700 text-fasal-slate">{simulatedFlowRate} L/min</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side Map & logs, Right side control panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Interactive SVG Map & Telemetry Console */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          {/* Map Card */}
          <div className="bg-white rounded-xl border border-fasal-border p-5 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-base font-700 text-fasal-slate uppercase tracking-wide">
                Farm Grid Coverage Map
              </h2>
              <div className="flex gap-4 text-xs font-500 text-fasal-muted">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-fasal-emerald opacity-60"></span> Speaker</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-fasal-amber opacity-60"></span> Strobe</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500 opacity-60"></span> Spray</span>
              </div>
            </div>

            {/* Farm Grid Interactive SVG */}
            <div className="relative border border-fasal-border/50 rounded-xl bg-fasal-surface flex items-center justify-center p-4 overflow-hidden" style={{ minHeight: '290px' }}>
              <svg width="100%" height="260" viewBox="0 0 400 260" className="max-w-md">
                {/* Outer Field Boundary */}
                <rect x="10" y="10" width="380" height="240" rx="10" fill="none" stroke="#D1DDD9" strokeWidth="2" strokeDasharray="4 4" />

                {/* Grid Divider Lines */}
                <line x1="200" y1="10" x2="200" y2="250" stroke="#D1DDD9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="130" x2="390" y2="130" stroke="#D1DDD9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Central Crop Protection Area (Inner Zone) */}
                <rect x="120" y="80" width="160" height="100" rx="8" fill="#0F5E3C" fillOpacity="0.08" stroke="#0F5E3C" strokeWidth="2" />
                <text x="200" y="134" textAnchor="middle" style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="fill-fasal-emerald font-700 text-xs tracking-wider uppercase opacity-80">
                  Inner Crop Zone
                </text>

                {/* SECTORS */}
                {/* Sector North */}
                <g className="cursor-pointer" onClick={() => setSelectedSector('North')}>
                  <path
                    d="M 120 80 L 10 10 L 390 10 L 280 80 Z"
                    fill={selectedSector === 'North' ? 'rgba(15, 94, 60, 0.05)' : 'transparent'}
                    stroke={selectedSector === 'North' ? '#0F5E3C' : 'transparent'}
                    strokeWidth="1.5"
                    className="transition-all duration-300 hover:fill-fasal-emerald/5"
                  />
                  <text x="200" y="40" textAnchor="middle" className={`text-[10px] font-700 tracking-wider uppercase ${selectedSector === 'North' ? 'fill-fasal-emerald' : 'fill-fasal-muted'}`}>
                    North Sector
                  </text>
                  {/* North Sector Indicator Rings (Visualizing sound wave) */}
                  {devices.speakers.North && (
                    <g className="text-fasal-emerald">
                      <circle cx="200" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="200" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-70 animate-pulse" />
                    </g>
                  )}
                  {/* North Sector Strobe representation */}
                  {devices.strobes.North && (
                    <circle cx="160" cy="20" r="5" fill="#B7791F" className="animate-blink" />
                  )}
                  {/* North Sector Water Spray representation */}
                  {devices.sprays.North && (
                    <g className="text-blue-400">
                      <path d="M 180,25 Q 190,45 200,25 Q 210,45 220,25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                    </g>
                  )}
                </g>

                {/* Sector South */}
                <g className="cursor-pointer" onClick={() => setSelectedSector('South')}>
                  <path
                    d="M 120 180 L 10 250 L 390 250 L 280 180 Z"
                    fill={selectedSector === 'South' ? 'rgba(15, 94, 60, 0.05)' : 'transparent'}
                    stroke={selectedSector === 'South' ? '#0F5E3C' : 'transparent'}
                    strokeWidth="1.5"
                    className="transition-all duration-300 hover:fill-fasal-emerald/5"
                  />
                  <text x="200" y="225" textAnchor="middle" className={`text-[10px] font-700 tracking-wider uppercase ${selectedSector === 'South' ? 'fill-fasal-emerald' : 'fill-fasal-muted'}`}>
                    South Sector
                  </text>
                  {/* South Sound */}
                  {devices.speakers.South && (
                    <g className="text-fasal-emerald">
                      <circle cx="200" cy="240" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="200" cy="240" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-70 animate-pulse" />
                    </g>
                  )}
                  {/* South Strobe */}
                  {devices.strobes.South && (
                    <circle cx="240" cy="240" r="5" fill="#B7791F" className="animate-blink" />
                  )}
                  {/* South Spray */}
                  {devices.sprays.South && (
                    <g className="text-blue-400">
                      <path d="M 180,235 Q 190,215 200,235 Q 210,215 220,235" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                    </g>
                  )}
                </g>

                {/* Sector West */}
                <g className="cursor-pointer" onClick={() => setSelectedSector('West')}>
                  <path
                    d="M 120 80 L 10 10 L 10 250 L 120 180 Z"
                    fill={selectedSector === 'West' ? 'rgba(15, 94, 60, 0.05)' : 'transparent'}
                    stroke={selectedSector === 'West' ? '#0F5E3C' : 'transparent'}
                    strokeWidth="1.5"
                    className="transition-all duration-300 hover:fill-fasal-emerald/5"
                  />
                  <text x="50" y="134" textAnchor="middle" className={`text-[10px] font-700 tracking-wider uppercase ${selectedSector === 'West' ? 'fill-fasal-emerald' : 'fill-fasal-muted'}`}>
                    West Sector
                  </text>
                  {/* West Sound */}
                  {devices.speakers.West && (
                    <g className="text-fasal-emerald">
                      <circle cx="20" cy="130" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="20" cy="130" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-70 animate-pulse" />
                    </g>
                  )}
                  {/* West Strobe */}
                  {devices.strobes.West && (
                    <circle cx="20" cy="100" r="5" fill="#B7791F" className="animate-blink" />
                  )}
                  {/* West Spray */}
                  {devices.sprays.West && (
                    <g className="text-blue-400">
                      <path d="M 25,110 Q 45,120 25,130 Q 45,140 25,150" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                    </g>
                  )}
                </g>

                {/* Sector East */}
                <g className="cursor-pointer" onClick={() => setSelectedSector('East')}>
                  <path
                    d="M 280 80 L 390 10 L 390 250 L 280 180 Z"
                    fill={selectedSector === 'East' ? 'rgba(15, 94, 60, 0.05)' : 'transparent'}
                    stroke={selectedSector === 'East' ? '#0F5E3C' : 'transparent'}
                    strokeWidth="1.5"
                    className="transition-all duration-300 hover:fill-fasal-emerald/5"
                  />
                  <text x="340" y="134" textAnchor="middle" className={`text-[10px] font-700 tracking-wider uppercase ${selectedSector === 'East' ? 'fill-fasal-emerald' : 'fill-fasal-muted'}`}>
                    East Sector
                  </text>
                  {/* East Sound */}
                  {devices.speakers.East && (
                    <g className="text-fasal-emerald">
                      <circle cx="380" cy="130" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="380" cy="130" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-70 animate-pulse" />
                    </g>
                  )}
                  {/* East Strobe */}
                  {devices.strobes.East && (
                    <circle cx="380" cy="160" r="5" fill="#B7791F" className="animate-blink" />
                  )}
                  {/* East Spray */}
                  {devices.sprays.East && (
                    <g className="text-blue-400">
                      <path d="M 375,110 Q 355,120 375,130 Q 355,140 375,150" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                    </g>
                  )}
                </g>
              </svg>
            </div>
            <div className="mt-3 flex justify-between items-center flex-wrap gap-2">
              <p className="text-xs text-fasal-muted">
                ℹ️ Click a sector on the map above. Inspecting: <strong className="text-fasal-slate">{selectedSector} Sector</strong>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (autoMode) {
                      addLog('SYSTEM', 'Override rejected. Cannot toggle devices in Auto Mode.', 'warning')
                      return
                    }
                    toggleDevice('speakers', selectedSector)
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-600 uppercase border transition-colors ${
                    devices.speakers[selectedSector]
                      ? 'bg-fasal-emerald/10 border-fasal-emerald/30 text-fasal-emerald'
                      : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                  }`}
                >
                  🔊 Spk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (autoMode) {
                      addLog('SYSTEM', 'Override rejected. Cannot toggle devices in Auto Mode.', 'warning')
                      return
                    }
                    toggleDevice('strobes', selectedSector)
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-600 uppercase border transition-colors ${
                    devices.strobes[selectedSector]
                      ? 'bg-fasal-amber/10 border-fasal-amber/30 text-fasal-amber'
                      : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                  }`}
                >
                  💡 Str
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (autoMode) {
                      addLog('SYSTEM', 'Override rejected. Cannot toggle devices in Auto Mode.', 'warning')
                      return
                    }
                    toggleDevice('sprays', selectedSector)
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-600 uppercase border transition-colors ${
                    devices.sprays[selectedSector]
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-600'
                      : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                  }`}
                >
                  💧 Spr
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostics Console Card */}
          <div className="bg-fasal-slate rounded-xl border border-white/10 p-5 flex flex-col h-60">
            <div className="flex justify-between items-center mb-3">
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-base font-700 uppercase tracking-wide">
                Live System Diagnostics & Logs
              </h2>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-[10px] font-600 text-white/50 hover:text-white uppercase tracking-wider"
              >
                Clear Console
              </button>
            </div>

            {/* Console output */}
            <div
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              className="flex-1 overflow-y-auto bg-black/40 rounded-lg p-3 text-[11px] leading-relaxed border border-white/5 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10"
            >
              {logs.length === 0 ? (
                <div className="text-white/20 italic">No diagnostic events logged. Tweak controls or trigger simulation.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-white/30 flex-shrink-0">[{log.timestamp}]</span>
                    <span className={`font-700 flex-shrink-0 w-24 ${
                      log.type === 'success' ? 'text-fasal-success' :
                      log.type === 'warning' ? 'text-fasal-amber' :
                      log.type === 'danger' ? 'text-fasal-danger' :
                      'text-sky-400'
                    }`}>
                      {log.source}:
                    </span>
                    <span className={
                      log.type === 'success' ? 'text-white/90' :
                      log.type === 'warning' ? 'text-fasal-amber/90' :
                      log.type === 'danger' ? 'text-white bg-fasal-danger/30 px-1 rounded' :
                      'text-white/70'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Right Side: Operational Control Panels */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Control Hub */}
          <div className="bg-white rounded-xl border border-fasal-border p-5 flex flex-col flex-1">
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-base font-700 text-fasal-slate uppercase tracking-wide mb-4">
              Device Management Dashboard
            </h2>

            {/* Mode selector section */}
            <div className="mb-6 p-4 rounded-xl bg-fasal-surface border border-fasal-border/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-fasal-muted font-600 uppercase tracking-wide">Operational Mode</span>
                <span className={`text-[10px] font-700 px-2 py-0.5 rounded ${autoMode ? 'bg-fasal-success/10 text-fasal-success' : 'bg-fasal-amber/10 text-fasal-amber'}`}>
                  {autoMode ? 'AUTO-PILOT ACTIVE' : 'MANUAL OVERRIDE'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAutoMode(true)
                    addLog('SYSTEM', 'Automatic Protection Mode enabled. Systems responding to AI alerts.', 'info')
                  }}
                  className={`py-2 rounded-lg text-xs font-700 uppercase tracking-wide transition-all ${
                    autoMode
                      ? 'bg-fasal-emerald text-white shadow-sm'
                      : 'bg-white text-fasal-muted border border-fasal-border hover:bg-fasal-surface'
                  }`}
                >
                  🤖 Automatic
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAutoMode(false)
                    addLog('SYSTEM', 'Manual Override initiated. Local operator takes full controls.', 'warning')
                  }}
                  className={`py-2 rounded-lg text-xs font-700 uppercase tracking-wide transition-all ${
                    !autoMode
                      ? 'bg-fasal-amber text-white shadow-sm'
                      : 'bg-white text-fasal-muted border border-fasal-border hover:bg-fasal-surface'
                  }`}
                >
                  👤 Manual
                </button>
              </div>
              {!autoMode && (
                <p className="text-[11px] text-fasal-amber font-500 mt-2">
                  ⚠️ Caution: You are directly triggering solenoid valves and speaker matrices.
                </p>
              )}
            </div>

            {/* Sub-system Tabs */}
            <div className="flex border-b border-fasal-border mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('audio')}
                className={`flex-1 pb-3 text-xs font-700 uppercase tracking-wider text-center border-b-2 transition-all ${
                  activeTab === 'audio'
                    ? 'border-fasal-emerald text-fasal-emerald'
                    : 'border-transparent text-fasal-muted hover:text-fasal-slate'
                }`}
              >
                🔊 Speakers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('strobe')}
                className={`flex-1 pb-3 text-xs font-700 uppercase tracking-wider text-center border-b-2 transition-all ${
                  activeTab === 'strobe'
                    ? 'border-fasal-emerald text-fasal-emerald'
                    : 'border-transparent text-fasal-muted hover:text-fasal-slate'
                }`}
              >
                💡 Strobes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('water')}
                className={`flex-1 pb-3 text-xs font-700 uppercase tracking-wider text-center border-b-2 transition-all ${
                  activeTab === 'water'
                    ? 'border-fasal-emerald text-fasal-emerald'
                    : 'border-transparent text-fasal-muted hover:text-fasal-slate'
                }`}
              >
                💧 Sprays
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 space-y-4 min-h-[300px]">
              {/* Tab 1: Speakers */}
              {activeTab === 'audio' && (
                <div className="space-y-4 animate-fade-up">
                  <div>
                    <label className="text-xs font-600 text-fasal-slate uppercase tracking-wider block mb-2">
                      Sound Broadcast Profile
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Ultrasonic', 'Predator', 'Human Shout', 'Siren'] as const).map((profile) => (
                        <button
                          key={profile}
                          type="button"
                          onClick={() => {
                            setSpeakerProfile(profile)
                            addLog('SPEAKERS', `Audio broadcast preset switched to: ${profile}.`, 'info')
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-500 border text-left transition-all ${
                            speakerProfile === profile
                              ? 'bg-fasal-emerald/10 border-fasal-emerald/40 text-fasal-emerald font-600'
                              : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                          }`}
                        >
                          {profile === 'Ultrasonic' && '🌐 Sweep ' + profile}
                          {profile === 'Predator' && '🦁 Predator Growl'}
                          {profile === 'Human Shout' && '🗣️ Human Vocals'}
                          {profile === 'Siren' && '🚨 Distress Siren'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-600 text-fasal-slate uppercase tracking-wider mb-1">
                      <span>Broadcast Volume</span>
                      <span className={speakerVolume > 85 ? 'text-fasal-danger font-700' : 'text-fasal-emerald'}>
                        {speakerVolume} dB
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={speakerVolume}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        setSpeakerVolume(val)
                        if (val > 100 && speakerVolume <= 100) {
                          addLog('SPEAKERS', `WARNING: High-decibel audio broadcast (${val} dB) may disturb neighboring areas.`, 'warning')
                        }
                      }}
                      className="w-full h-1.5 bg-fasal-border rounded-lg appearance-none cursor-pointer accent-fasal-emerald"
                    />
                    <div className="flex justify-between text-[9px] text-fasal-muted mt-1">
                      <span>20 dB (Whisper)</span>
                      <span>80 dB (Normal)</span>
                      <span>120 dB (Critical-Deterrent)</span>
                    </div>
                  </div>

                  {/* Sector speaker toggles */}
                  <div>
                    <label className="text-xs font-600 text-fasal-slate uppercase tracking-wider block mb-2">
                      Active Speaker Arrays
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['North', 'South', 'East', 'West'] as Sector[]).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => toggleDevice('speakers', sec)}
                          className={`py-2 px-3 rounded-lg text-xs font-600 flex items-center justify-between border transition-all ${
                            devices.speakers[sec]
                              ? 'bg-fasal-emerald text-white border-fasal-emerald'
                              : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                          }`}
                        >
                          <span>{sec} Array</span>
                          <span className={`w-2 h-2 rounded-full ${devices.speakers[sec] ? 'bg-white animate-pulse' : 'bg-fasal-border'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Wave Visualizer Simulation */}
                  <div className="p-3 bg-fasal-surface rounded-xl border border-fasal-border flex flex-col items-center">
                    <p className="text-[10px] text-fasal-muted uppercase tracking-wider font-600 mb-2">
                      Active Transducer Waveform Visualizer
                    </p>
                    <div className="flex items-end gap-1 h-12 w-full max-w-xs justify-center px-4">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const isGlobalActive = totalActiveSpeakers > 0
                        return (
                          <div
                            key={i}
                            className="w-2.5 rounded-t bg-fasal-emerald transition-all duration-300"
                            style={{
                              height: isGlobalActive
                                ? `${Math.floor(Math.random() * 85) + 15}%`
                                : '4px',
                              opacity: isGlobalActive ? 0.8 : 0.2,
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Strobes */}
              {activeTab === 'strobe' && (
                <div className="space-y-4 animate-fade-up">
                  <div>
                    <label className="text-xs font-600 text-fasal-slate uppercase tracking-wider block mb-2">
                      Warning Flash Pattern
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Triple Flash', 'Rapid Sweep', 'Chaos Blinker', 'Steady Pulse'] as const).map((pat) => (
                        <button
                          key={pat}
                          type="button"
                          onClick={() => {
                            setStrobePattern(pat)
                            addLog('STROBES', `Warning strobe matrix sequence set to: ${pat}.`, 'info')
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-500 border text-left transition-all ${
                            strobePattern === pat
                              ? 'bg-fasal-amber/10 border-fasal-amber/40 text-fasal-amber font-600'
                              : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                          }`}
                        >
                          {pat === 'Triple Flash' && '⚡ Triple Pulse'}
                          {pat === 'Rapid Sweep' && '🧭 Sweep Matrix'}
                          {pat === 'Chaos Blinker' && '💥 Chaos Strobing'}
                          {pat === 'Steady Pulse' && '💡 Steady Beacon'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brightness slider */}
                  <div>
                    <div className="flex justify-between text-xs font-600 text-fasal-slate uppercase tracking-wider mb-1">
                      <span>Luminous Intensity</span>
                      <span className="text-fasal-amber font-700">{strobeIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={strobeIntensity}
                      onChange={(e) => setStrobeIntensity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-fasal-border rounded-lg appearance-none cursor-pointer accent-fasal-amber"
                    />
                    <div className="flex justify-between text-[9px] text-fasal-muted mt-1">
                      <span>10% (Eco/Standby)</span>
                      <span>50% (Dusk Mode)</span>
                      <span>100% (Full Blast)</span>
                    </div>
                  </div>

                  {/* Sector strobe toggles */}
                  <div>
                    <label className="text-xs font-600 text-fasal-slate uppercase tracking-wider block mb-2">
                      Active Strobe Banks
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['North', 'South', 'East', 'West'] as Sector[]).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => toggleDevice('strobes', sec)}
                          className={`py-2 px-3 rounded-lg text-xs font-600 flex items-center justify-between border transition-all ${
                            devices.strobes[sec]
                              ? 'bg-fasal-amber text-white border-fasal-amber'
                              : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                          }`}
                        >
                          <span>{sec} Matrix</span>
                          <span className={`w-2 h-2 rounded-full ${devices.strobes[sec] ? 'bg-white animate-pulse' : 'bg-fasal-border'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flash Simulator visual block */}
                  <div className="p-4 bg-fasal-slate rounded-xl border border-white/10 flex flex-col items-center justify-center">
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-600 mb-2">
                      Visual Matrix Pulse Monitor
                    </p>
                    <div
                      className={`w-full max-w-xs h-10 rounded-lg flex items-center justify-center font-700 text-xs tracking-wider transition-all duration-150 ${
                        totalActiveStrobes > 0
                          ? 'bg-fasal-amber/90 text-white shadow-[0_0_15px_rgba(183,121,31,0.5)] animate-blink'
                          : 'bg-white/5 text-white/20 border border-white/5'
                      }`}
                    >
                      {totalActiveStrobes > 0 ? `FLASHING (${strobePattern.toUpperCase()})` : 'SYSTEM STANDBY'}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Water */}
              {activeTab === 'water' && (
                <div className="space-y-4 animate-fade-up">
                  {/* Pressure Grid */}
                  <div>
                    <label className="text-xs font-600 text-fasal-slate uppercase tracking-wider block mb-2">
                      Grid Valve Pressure
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Low', 'Medium', 'High'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setSprayPressure(p)
                            addLog('WATER-GRID', `Water pump pressure level configured to: ${p} (${p === 'High' ? '6.0 bar' : p === 'Medium' ? '4.0 bar' : '2.2 bar'}).`, 'info')
                          }}
                          className={`py-2 rounded-lg text-xs font-600 border text-center transition-all ${
                            sprayPressure === p
                              ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 font-700'
                              : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                          }`}
                        >
                          {p === 'Low' && '💧 Low (2.2b)'}
                          {p === 'Medium' && '💦 Med (4.0b)'}
                          {p === 'High' && '🌊 High (6.0b)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spray Timer Selector */}
                  <div>
                    <label className="text-xs font-600 text-fasal-slate uppercase tracking-wider block mb-2">
                      Automatic Valve Shut-off Timer
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {([10, 30, 60, 0] as const).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => {
                            setSprayDuration(sec)
                            addLog('WATER-GRID', `Valve shutdown countdown timer configured to ${sec === 0 ? 'Manual/Continuous' : sec + 's'}.`, 'info')
                          }}
                          className={`py-2 rounded-lg text-xs font-500 border text-center transition-all ${
                            sprayDuration === sec
                              ? 'bg-blue-500/10 border-blue-500/40 text-blue-600 font-700'
                              : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                          }`}
                        >
                          {sec === 0 ? 'Continuous' : sec + ' sec'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sector water toggles */}
                  <div>
                    <label className="text-xs font-600 text-fasal-slate uppercase tracking-wider block mb-2">
                      Active Irrigation Sectors
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['North', 'South', 'East', 'West'] as Sector[]).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => toggleDevice('sprays', sec)}
                          className={`py-2 px-3 rounded-lg text-xs font-600 flex items-center justify-between border transition-all ${
                            devices.sprays[sec]
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white border-fasal-border text-fasal-muted hover:bg-fasal-surface'
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <span>{sec} Grid</span>
                            {sprayTimer[sec] > 0 && (
                              <span className="text-[9px] opacity-85 mt-0.5">Shut-off: {sprayTimer[sec]}s</span>
                            )}
                          </div>
                          <span className={`w-2 h-2 rounded-full ${devices.sprays[sec] ? 'bg-white animate-ping' : 'bg-fasal-border'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pressure Telemetry readout */}
                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/15 text-[11px] text-blue-700 flex justify-between items-center">
                    <span className="font-600">Solenoid Valves Feed Check:</span>
                    <span className="font-mono bg-blue-500/10 px-2 py-0.5 rounded font-700">
                      {totalActiveSprays > 0 ? `FLOW STABLE (P: ${sprayPressure === 'High' ? '5.9' : sprayPressure === 'Medium' ? '4.1' : '2.1'} bar)` : 'SOLENOIDS CLOSED'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Footer Panel */}
            <div className="border-t border-fasal-border pt-4 mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleTestAll}
                  className="py-2.5 bg-fasal-slate hover:bg-fasal-slate-light text-white text-xs font-700 uppercase tracking-wider rounded-xl transition-all"
                >
                  ⚡ All-System Test
                </button>
                <button
                  type="button"
                  onClick={handleSilenceAll}
                  className="py-2.5 bg-white border border-fasal-border hover:bg-fasal-surface text-fasal-slate text-xs font-700 uppercase tracking-wider rounded-xl transition-all"
                >
                  🔕 Silence All
                </button>
              </div>

              <button
                type="button"
                onClick={handleEmergencyStop}
                className="w-full py-3 bg-fasal-danger hover:bg-fasal-danger-dark text-white text-sm font-700 uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Emergency Shutoff (All Standby)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
