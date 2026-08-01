import { useEffect, useRef } from 'react'
import { formatTime } from '../utils/formatters'
import { riskColor } from '../utils/riskHelpers'
import { useYoloDetector, type DetectorStatus } from '../hooks/useYoloDetector'
import type { AnalyzedAnimal } from '../services/animalDetector'
import type { Detection } from '../services/api'

interface CameraFeedProps {
  current: Detection | null
  onYoloDetection?: (detection: Detection) => void
  onYoloActiveChange?: (active: boolean) => void
  /** When true, allow starting the live YOLO webcam detector */
  yoloEnabled?: boolean
}

export default function CameraFeed({
  current,
  onYoloDetection,
  onYoloActiveChange,
  yoloEnabled = true,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const detector = useYoloDetector(videoRef, {
    enabled: yoloEnabled,
    onDetection: onYoloDetection,
    reportIntervalMs: 2500,
  })

  useEffect(() => {
    onYoloActiveChange?.(detector.cameraActive && detector.status === 'running')
  }, [detector.cameraActive, detector.status, onYoloActiveChange])

  // Draw YOLO overlays onto canvas
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (video.videoWidth > 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const animal of detector.animals) {
      drawAnimalBox(ctx, animal)
    }

    if (detector.primary) {
      drawHud(ctx, detector.primary)
    }
  }, [detector.animals, detector.primary])

  const live = detector.status === 'running'
  const statusLabel = statusText(detector.status)

  return (
    <div className="bg-black rounded-xl overflow-hidden border border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-fasal-slate border-b border-white/10">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${live ? 'bg-fasal-danger animate-blink' : 'bg-white/30'}`}
          />
          <span
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
            className="text-white text-xs font-500 uppercase tracking-widest"
          >
            {live ? 'LIVE' : 'STANDBY'}
          </span>
          <span className="text-white/40 text-xs ml-2">YOLO Detector · Webcam</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-white/50 text-xs"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {formatTime(new Date())}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-500 ${
              live
                ? 'bg-fasal-success/20 text-fasal-success'
                : detector.status === 'denied' || detector.status === 'error'
                  ? 'bg-fasal-danger/20 text-fasal-danger'
                  : 'bg-white/10 text-white/50'
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="relative flex-1 min-h-0 bg-black" style={{ minHeight: '280px' }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Scan line */}
        {live && (
          <div
            className="absolute left-0 right-0 pointer-events-none animate-scan-line"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(15,94,60,0.6), transparent)',
            }}
          />
        )}

        <CornerBrackets />

        {/* Idle / permission gate */}
        {!detector.cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-fasal-slate to-black/95 z-10">
            <div className="text-center px-6 max-w-sm">
              <div className="w-14 h-14 rounded-full border-2 border-fasal-emerald/40 flex items-center justify-center mx-auto mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(15,94,60,0.9)"
                  strokeWidth="2"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                className="text-white text-xl font-700 uppercase tracking-wide mb-2"
              >
                YOLO Animal Detector
              </p>
              <p className="text-white/50 text-xs leading-relaxed mb-4">
                Enable your laptop camera to run live animal identification — cow, goat, sheep,
                horse, and more — with distance, danger level, and deterrent recommendations.
              </p>
              {detector.error && (
                <p className="text-fasal-danger text-xs mb-3">{detector.error}</p>
              )}
              <button
                type="button"
                onClick={() => void detector.start()}
                disabled={
                  detector.status === 'requesting' || detector.status === 'loading-model'
                }
                className="px-5 py-2.5 bg-fasal-emerald hover:bg-fasal-emerald-dark disabled:opacity-60 text-white text-sm font-700 uppercase tracking-wider rounded-lg transition-colors"
              >
                {detector.status === 'requesting'
                  ? 'Requesting Camera…'
                  : detector.status === 'loading-model'
                    ? 'Loading YOLO Model…'
                    : detector.status === 'denied'
                      ? 'Retry Camera Access'
                      : 'Start YOLO Detector'}
              </button>
            </div>
          </div>
        )}

        {/* Loading model overlay while camera already on */}
        {detector.cameraActive && detector.status === 'loading-model' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <p className="text-white/80 text-sm font-500">Loading YOLO model…</p>
          </div>
        )}

        {/* Scanning empty state */}
        {live && detector.animals.length === 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <p className="text-white/40 text-xs font-500 bg-black/40 px-3 py-1.5 rounded-full">
              Scanning for animals…
            </p>
          </div>
        )}

        {/* Fallback box from last dashboard detection if canvas empty */}
        {live && detector.animals.length === 0 && current && <CssBoundingBox detection={current} />}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-fasal-slate border-t border-white/10 flex items-center gap-4 flex-wrap">
        <Stat label="RES" value={live ? '720p' : '—'} />
        <Stat label="FPS" value={live ? String(detector.fps || '—') : '—'} />
        <Stat label="AI" value="YOLO-11n" />
        <Stat
          label="ANIMALS"
          value={live ? String(detector.animals.length) : '—'}
        />
        {detector.cameraActive && (
          <button
            type="button"
            onClick={detector.stop}
            className="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Stop Camera
          </button>
        )}
        {!detector.cameraActive && current && (
          <div className="ml-auto flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: riskColor(current.risk) }}
            />
            <span
              className="text-xs"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: riskColor(current.risk) }}
            >
              LAST: {current.species.toUpperCase()}
            </span>
          </div>
        )}
        {detector.primary && (
          <div className="ml-auto flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: riskColor(detector.primary.danger) }}
            />
            <span
              className="text-xs"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                color: riskColor(detector.primary.danger),
              }}
            >
              {detector.primary.species.toUpperCase()} · {detector.primary.distance.toFixed(1)}m ·{' '}
              {detector.primary.danger.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function drawAnimalBox(ctx: CanvasRenderingContext2D, animal: AnalyzedAnimal) {
  const color =
    animal.danger === 'High' ? '#B3261E' : animal.danger === 'Medium' ? '#B7791F' : '#1F9D55'

  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.strokeRect(animal.x, animal.y, animal.w, animal.h)

  const label = `${animal.species.toUpperCase()} ${animal.confidence.toFixed(1)}%`
  ctx.font = 'bold 14px JetBrains Mono, monospace'
  const padX = 8
  const padY = 4
  const tw = ctx.measureText(label).width
  const th = 18
  const ly = Math.max(0, animal.y - th - padY * 2)

  ctx.fillStyle = color
  ctx.fillRect(animal.x, ly, tw + padX * 2, th + padY * 2)
  ctx.fillStyle = '#fff'
  ctx.fillText(label, animal.x + padX, ly + th)
}

function drawHud(ctx: CanvasRenderingContext2D, animal: AnalyzedAnimal) {
  const lines = [
    animal.species.toUpperCase(),
    `Confidence: ${animal.confidence.toFixed(1)}%`,
    `Distance: ${animal.distance.toFixed(2)} m`,
    `Danger: ${animal.danger.toUpperCase()}`,
    `ETA: ${animal.eta.toFixed(2)} sec`,
    `Action: ${animal.action}`,
  ]

  ctx.font = '13px JetBrains Mono, monospace'
  const lineH = 22
  const boxW = 280
  const boxH = lines.length * lineH + 16

  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.fillRect(12, 12, boxW, boxH)

  lines.forEach((line, i) => {
    if (i === 0) ctx.fillStyle = '#4ADE80'
    else if (line.startsWith('Danger')) ctx.fillStyle = '#F87171'
    else if (line.startsWith('Action')) ctx.fillStyle = '#67E8F9'
    else ctx.fillStyle = '#FFFFFF'
    ctx.fillText(line, 24, 32 + i * lineH)
  })
}

function CssBoundingBox({ detection }: { detection: Detection }) {
  const color = riskColor(detection.risk)
  return (
    <div
      className="absolute animate-fade-up pointer-events-none"
      style={{
        left: `${detection.bbX}%`,
        top: `${detection.bbY}%`,
        width: `${detection.bbW}%`,
        height: `${detection.bbH}%`,
      }}
    >
      <div
        className="absolute inset-0 rounded"
        style={{ border: `2px solid ${color}`, boxShadow: `0 0 12px ${color}60` }}
      />
      <div
        className="absolute -top-7 left-0 px-2 py-1 rounded text-xs font-600 whitespace-nowrap"
        style={{ background: color, color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}
      >
        {detection.species.toUpperCase()} {detection.confidence}%
      </div>
    </div>
  )
}

function CornerBrackets() {
  return (
    <>
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl pointer-events-none" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br pointer-events-none" />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-white/30 text-xs">{label}</span>
      <span
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
        className="text-white/70 text-xs font-500"
      >
        {value}
      </span>
    </div>
  )
}

function statusText(status: DetectorStatus): string {
  switch (status) {
    case 'running':
      return 'YOLO ON'
    case 'requesting':
      return 'AUTH…'
    case 'loading-model':
      return 'LOADING'
    case 'denied':
      return 'DENIED'
    case 'error':
      return 'ERROR'
    case 'stopped':
      return 'STOPPED'
    default:
      return 'READY'
  }
}
