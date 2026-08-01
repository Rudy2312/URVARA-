import type { RiskLevel } from '../services/api'

export function riskColor(risk: RiskLevel): string {
  if (risk === 'High') return '#B3261E'
  if (risk === 'Medium') return '#B7791F'
  return '#1F9D55'
}

export function riskBgClass(risk: RiskLevel): string {
  if (risk === 'High') return 'bg-fasal-danger text-white'
  if (risk === 'Medium') return 'bg-fasal-amber text-white'
  return 'bg-fasal-success text-white'
}

export function riskIcon(risk: RiskLevel): string {
  if (risk === 'High') return '🔴'
  if (risk === 'Medium') return '🟡'
  return '🟢'
}

export function riskLabel(risk: RiskLevel): string {
  return `${riskIcon(risk)} ${risk} Risk`
}
