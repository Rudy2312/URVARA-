import type { Detection } from '../services/api'
import { riskBgClass, riskLabel } from '../utils/riskHelpers'
import { formatTime, formatConfidence } from '../utils/formatters'

interface DetectionCardProps {
  detection: Detection | null
  autoMode: boolean
}

export default function DetectionCard({ detection, autoMode }: DetectionCardProps) {
  if (!detection) {
    return (
      <div className="bg-fasal-slate rounded-xl border border-white/10 p-6 h-full flex flex-col">
        <SectionHeader title="Current Detection" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
            </div>
            <p className="text-white/30 text-sm">No active detection</p>
            <p className="text-white/20 text-xs mt-1">Perimeter scan in progress</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-fasal-slate rounded-xl border border-white/10 p-5 h-full flex flex-col animate-slide-in">
      <SectionHeader title="Current Detection" live source={detection.source} />

      <div className="flex-1 space-y-4 mt-4">
        {/* Species + confidence */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Species</p>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-3xl font-700 leading-none">
              {detection.species.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Confidence</p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-fasal-success text-2xl font-600">
              {formatConfidence(detection.confidence)}
            </p>
          </div>
        </div>

        {/* Risk */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-600 ${riskBgClass(detection.risk)}`}>
            {riskLabel(detection.risk)}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Boundary" value={detection.boundary} />
          <Field label="Zone" value={detection.zone} />
          <Field label="Time" value={formatTime(detection.timestamp)} mono />
          {detection.distanceM != null && (
            <Field label="Distance" value={`${detection.distanceM.toFixed(2)} m`} mono />
          )}
          {detection.etaSec != null && (
            <Field label="ETA" value={`${detection.etaSec.toFixed(2)} sec`} mono />
          )}
        </div>

        {/* AI Recommendation */}
        <div className="border border-fasal-emerald/20 rounded-lg p-3 bg-fasal-emerald/5">
          <p className="text-fasal-success text-xs font-600 uppercase tracking-wider mb-2">AI Recommendation</p>
          <p className="text-white/60 text-xs leading-relaxed mb-3">{detection.recommendation.reasoning}</p>
          <div className="space-y-1.5">
            <RecommendationItem label="Flash LED Strobes" active={detection.recommendation.led} />
            <RecommendationItem label="Directional Sound" active={detection.recommendation.sound} />
            <RecommendationItem label="Water Sprayer" active={detection.recommendation.water} />
          </div>
        </div>

        {!autoMode && (
          <div className="px-3 py-2 rounded bg-fasal-amber/10 border border-fasal-amber/20">
            <p className="text-fasal-amber text-xs font-500">⚠ Manual mode — confirm actions in Control Panel</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({
  title,
  live,
  source,
}: {
  title: string
  live?: boolean
  source?: 'yolo' | 'simulate'
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-lg font-700 uppercase tracking-wide">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {source === 'yolo' && (
          <span
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
            className="text-fasal-success text-xs font-500 uppercase"
          >
            YOLO
          </span>
        )}
        {live && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fasal-danger animate-blink"/>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-fasal-danger text-xs font-500 uppercase">ALERT</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">{label}</p>
      <p
        className={`text-white/80 text-sm font-500 ${mono ? 'font-mono' : ''}`}
        style={mono ? { fontFamily: 'JetBrains Mono, monospace' } : {}}
      >
        {value}
      </p>
    </div>
  )
}

function RecommendationItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${active ? 'text-fasal-success' : 'text-white/20'}`}>
        {active ? '✓' : '✕'}
      </span>
      <span className={`text-xs font-500 ${active ? 'text-white/70' : 'text-white/25 line-through'}`}>{label}</span>
    </div>
  )
}
