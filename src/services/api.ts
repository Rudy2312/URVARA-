export type RiskLevel = 'Low' | 'Medium' | 'High'

export type AnimalSpecies = 'Cow' | 'Buffalo' | 'Goat' | 'Pig' | 'Stray Dog' | 'Sheep' | 'Horse'

export interface Detection {
  id: string
  timestamp: Date
  species: AnimalSpecies
  confidence: number
  risk: RiskLevel
  boundary: string
  zone: string
  actionTaken: string
  recommendation: {
    led: boolean
    sound: boolean
    water: boolean
    reasoning: string
  }
  bbX: number
  bbY: number
  bbW: number
  bbH: number
  /** Present when sourced from live YOLO detector */
  distanceM?: number
  etaSec?: number
  source?: 'yolo' | 'simulate'
}

export interface Alert {
  id: string
  timestamp: Date
  species: AnimalSpecies
  confidence: number
  risk: RiskLevel
  boundary: string
  recommendation: string
  read: boolean
}

const ANIMALS: AnimalSpecies[] = ['Cow', 'Buffalo', 'Goat', 'Pig', 'Stray Dog']
const BOUNDARIES = ['North Boundary', 'South Boundary', 'East Boundary', 'West Boundary']
const ZONES = ['Outer Perimeter', 'Mid-field Zone', 'Inner Boundary']

function getRisk(species: AnimalSpecies, zone: string): RiskLevel {
  if (zone === 'Inner Boundary') return 'High'
  if (species === 'Pig' || species === 'Buffalo') return zone === 'Mid-field Zone' ? 'High' : 'Medium'
  if (species === 'Cow') return zone === 'Mid-field Zone' ? 'Medium' : 'Low'
  if (species === 'Goat') return zone === 'Mid-field Zone' ? 'Medium' : 'Low'
  return 'Low'
}

function getRecommendation(risk: RiskLevel, species: AnimalSpecies) {
  const led = risk === 'Medium' || risk === 'High'
  const sound = risk !== 'Low'
  const water = risk === 'High'
  const verb = risk === 'High' ? 'approaching inner boundary' : risk === 'Medium' ? 'detected near mid-field' : 'spotted at outer perimeter'
  return {
    led,
    sound,
    water,
    reasoning: `${species} ${verb}. Risk level ${risk} — ${water ? 'full deterrent protocol' : led ? 'LED + sound deterrent recommended' : 'audio deterrent sufficient'}.`,
  }
}

function getActionTaken(rec: { led: boolean; sound: boolean; water: boolean }) {
  const parts = []
  if (rec.led) parts.push('LED')
  if (rec.sound) parts.push('Sound')
  if (rec.water) parts.push('Water')
  return parts.join('+') || 'None'
}

export function generateDetection(): Detection {
  const species = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const boundary = BOUNDARIES[Math.floor(Math.random() * BOUNDARIES.length)]
  const zone = ZONES[Math.floor(Math.random() * ZONES.length)]
  const confidence = Math.floor(Math.random() * 15) + 83
  const risk = getRisk(species, zone)
  const recommendation = getRecommendation(risk, species)
  return {
    id: Math.random().toString(36).slice(2),
    timestamp: new Date(),
    species,
    confidence,
    risk,
    boundary,
    zone,
    actionTaken: getActionTaken(recommendation),
    recommendation,
    bbX: 15 + Math.random() * 45,
    bbY: 20 + Math.random() * 35,
    bbW: 18 + Math.random() * 22,
    bbH: 16 + Math.random() * 18,
    source: 'simulate',
  }
}

export const SEED_DETECTIONS: Detection[] = [
  {
    id: 'h1',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    species: 'Cow',
    confidence: 97,
    risk: 'High',
    boundary: 'North Boundary',
    zone: 'Inner Boundary',
    actionTaken: 'LED+Sound',
    recommendation: { led: true, sound: true, water: false, reasoning: 'Cow approaching inner boundary.' },
    bbX: 30, bbY: 25, bbW: 28, bbH: 24,
  },
  {
    id: 'h2',
    timestamp: new Date(Date.now() - 1000 * 60 * 73),
    species: 'Goat',
    confidence: 91,
    risk: 'Medium',
    boundary: 'East Boundary',
    zone: 'Mid-field Zone',
    actionTaken: 'Sound',
    recommendation: { led: false, sound: true, water: false, reasoning: 'Goat detected near mid-field.' },
    bbX: 40, bbY: 30, bbW: 20, bbH: 18,
  },
  {
    id: 'h3',
    timestamp: new Date(Date.now() - 1000 * 60 * 150),
    species: 'Pig',
    confidence: 95,
    risk: 'High',
    boundary: 'West Boundary',
    zone: 'Inner Boundary',
    actionTaken: 'LED+Sound+Water',
    recommendation: { led: true, sound: true, water: true, reasoning: 'Pig approaching inner boundary. Full deterrent protocol.' },
    bbX: 25, bbY: 20, bbW: 22, bbH: 20,
  },
  {
    id: 'h4',
    timestamp: new Date(Date.now() - 1000 * 60 * 220),
    species: 'Buffalo',
    confidence: 88,
    risk: 'High',
    boundary: 'South Boundary',
    zone: 'Mid-field Zone',
    actionTaken: 'LED+Sound',
    recommendation: { led: true, sound: true, water: false, reasoning: 'Buffalo detected near mid-field.' },
    bbX: 35, bbY: 28, bbW: 26, bbH: 22,
  },
  {
    id: 'h5',
    timestamp: new Date(Date.now() - 1000 * 60 * 310),
    species: 'Stray Dog',
    confidence: 84,
    risk: 'Low',
    boundary: 'North Boundary',
    zone: 'Outer Perimeter',
    actionTaken: 'Sound',
    recommendation: { led: false, sound: true, water: false, reasoning: 'Stray Dog spotted at outer perimeter.' },
    bbX: 50, bbY: 35, bbW: 16, bbH: 14,
  },
  {
    id: 'h6',
    timestamp: new Date(Date.now() - 1000 * 60 * 400),
    species: 'Cow',
    confidence: 93,
    risk: 'Medium',
    boundary: 'East Boundary',
    zone: 'Mid-field Zone',
    actionTaken: 'LED+Sound',
    recommendation: { led: true, sound: true, water: false, reasoning: 'Cow detected near mid-field.' },
    bbX: 32, bbY: 22, bbW: 25, bbH: 22,
  },
]

export const SEED_ALERTS: Alert[] = SEED_DETECTIONS.map((d) => ({
  id: d.id,
  timestamp: d.timestamp,
  species: d.species,
  confidence: d.confidence,
  risk: d.risk,
  boundary: d.boundary,
  recommendation: d.actionTaken,
  read: d.id !== 'h1',
}))
