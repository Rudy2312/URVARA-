import { useState } from 'react'
import { useOutletContext } from 'react-router'
import type { Detection, RiskLevel, AnimalSpecies } from '../services/api'
import { riskColor, riskLabel } from '../utils/riskHelpers'
import { formatDateTime } from '../utils/formatters'

interface Ctx { history: Detection[] }

type SortKey = 'timestamp' | 'risk' | 'confidence'

const RISK_ORDER: Record<RiskLevel, number> = { High: 0, Medium: 1, Low: 2 }

export default function DetectionHistory() {
  const { history } = useOutletContext<Ctx>()
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All')
  const [speciesFilter, setSpeciesFilter] = useState<AnimalSpecies | 'All'>('All')
  const [sort, setSort] = useState<SortKey>('timestamp')
  const [selected, setSelected] = useState<Detection | null>(null)

  const filtered = history
    .filter((d) => riskFilter === 'All' || d.risk === riskFilter)
    .filter((d) => speciesFilter === 'All' || d.species === speciesFilter)
    .sort((a, b) => {
      if (sort === 'timestamp') return b.timestamp.getTime() - a.timestamp.getTime()
      if (sort === 'risk') return RISK_ORDER[a.risk] - RISK_ORDER[b.risk]
      return b.confidence - a.confidence
    })

  const allSpecies: AnimalSpecies[] = ['Cow', 'Buffalo', 'Goat', 'Pig', 'Stray Dog', 'Sheep', 'Horse']

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-3xl font-700 text-fasal-slate uppercase tracking-wide mb-1">
          Detection History
        </h1>
        <p className="text-sm text-fasal-muted">{history.length} events logged · click a row to inspect</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-600 text-fasal-muted uppercase tracking-wider">Risk:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded text-xs font-600 transition-all ${
                riskFilter === r
                  ? r === 'All' ? 'bg-fasal-slate text-white' : 'text-white'
                  : 'bg-fasal-surface border border-fasal-border text-fasal-muted hover:border-fasal-slate'
              }`}
              style={riskFilter === r && r !== 'All' ? { background: riskColor(r as RiskLevel) } : {}}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-600 text-fasal-muted uppercase tracking-wider">Species:</span>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value as AnimalSpecies | 'All')}
            className="text-xs border border-fasal-border rounded px-2 py-1.5 text-fasal-slate bg-white focus:outline-none focus:border-fasal-emerald"
          >
            <option value="All">All Species</option>
            {allSpecies.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-600 text-fasal-muted uppercase tracking-wider">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-xs border border-fasal-border rounded px-2 py-1.5 text-fasal-slate bg-white focus:outline-none focus:border-fasal-emerald"
          >
            <option value="timestamp">Latest First</option>
            <option value="risk">Risk Level</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-fasal-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-fasal-surface border-b border-fasal-border">
                {['Time', 'Animal', 'Risk', 'Confidence', 'Boundary', 'Action Taken'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-700 text-fasal-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-fasal-border">
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className="hover:bg-fasal-surface cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs text-fasal-muted">
                      {formatDateTime(d.timestamp)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-600 text-fasal-slate">{d.species}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-600 text-white"
                      style={{ background: riskColor(d.risk) }}
                    >
                      {riskLabel(d.risk)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-sm font-600 text-fasal-slate">
                      {d.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fasal-muted text-xs">{d.boundary}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-fasal-surface border border-fasal-border text-xs font-600 text-fasal-slate">
                      {d.actionTaken}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-fasal-muted text-sm">
                    No detections match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(30,41,59,0.7)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl border border-fasal-border shadow-xl w-full max-w-md p-6 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <span
                  className="px-2 py-0.5 rounded text-xs font-600 text-white mb-2 inline-block"
                  style={{ background: riskColor(selected.risk) }}
                >
                  {riskLabel(selected.risk)}
                </span>
                <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-2xl font-700 text-fasal-slate uppercase">
                  {selected.species} Detection
                </h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-fasal-muted hover:text-fasal-slate p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: 'Confidence', value: `${selected.confidence}%`, mono: true },
                { label: 'Boundary', value: selected.boundary },
                { label: 'Zone', value: selected.zone },
                { label: 'Action Taken', value: selected.actionTaken },
                { label: 'Timestamp', value: formatDateTime(selected.timestamp), mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p className="text-xs text-fasal-muted uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-600 text-fasal-slate" style={mono ? { fontFamily: 'JetBrains Mono, monospace' } : {}}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-fasal-surface rounded-lg p-4 border border-fasal-border">
              <p className="text-xs font-600 text-fasal-emerald uppercase tracking-wider mb-2">AI Reasoning</p>
              <p className="text-sm text-fasal-muted leading-relaxed">{selected.recommendation.reasoning}</p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full py-2 bg-fasal-slate text-white text-sm font-600 rounded-lg hover:bg-fasal-emerald-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
