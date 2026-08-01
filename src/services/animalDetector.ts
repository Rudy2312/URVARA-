import type { AnimalSpecies, Detection, RiskLevel } from './api'

/** Camera calibration — matches test_model.py */
export const FOCAL_LENGTH = 800

/** Known animal profiles from test_model.py */
export const ANIMAL_INFO: Record<
  string,
  { width: number; speed: number; deterrent: string; species: AnimalSpecies }
> = {
  cow: {
    width: 1.8,
    speed: 2.0,
    deterrent: 'Speaker + Flashing LED',
    species: 'Cow',
  },
  goat: {
    width: 0.6,
    speed: 1.5,
    deterrent: 'Speaker',
    species: 'Goat',
  },
  sheep: {
    width: 0.7,
    speed: 1.5,
    deterrent: 'Speaker',
    species: 'Sheep',
  },
  horse: {
    width: 2.0,
    speed: 2.5,
    deterrent: 'Speaker + Flashing LED',
    species: 'Horse',
  },
  dog: {
    width: 0.5,
    speed: 3.0,
    deterrent: 'Speaker',
    species: 'Stray Dog',
  },
  cat: {
    width: 0.3,
    speed: 2.0,
    deterrent: 'Speaker',
    species: 'Stray Dog',
  },
  pig: {
    width: 0.9,
    speed: 1.8,
    deterrent: 'Speaker + Flashing LED',
    species: 'Pig',
  },
  buffalo: {
    width: 2.2,
    speed: 1.8,
    deterrent: 'Speaker + Flashing LED',
    species: 'Buffalo',
  },
}

/** COCO / YOLO class names we treat as farm-relevant animals */
export const DETECTABLE_CLASSES = new Set(Object.keys(ANIMAL_INFO))

export type RawBox = {
  class: string
  score: number
  /** [x, y, width, height] in source pixels */
  bbox: [number, number, number, number]
}

export type AnalyzedAnimal = {
  animalKey: string
  species: AnimalSpecies
  confidence: number
  distance: number
  danger: RiskLevel
  eta: number
  action: string
  /** Bounding box as % of frame (for UI overlay) */
  bbX: number
  bbY: number
  bbW: number
  bbH: number
  /** Pixel box for canvas drawing */
  x: number
  y: number
  w: number
  h: number
}

export function dangerFromDistance(distance: number): RiskLevel {
  if (distance < 5) return 'High'
  if (distance < 10) return 'Medium'
  return 'Low'
}

export function analyzeAnimal(
  box: RawBox,
  frameWidth: number,
  frameHeight: number,
): AnalyzedAnimal | null {
  const key = box.class.toLowerCase()
  const info = ANIMAL_INFO[key]
  if (!info) return null

  const [x, y, w, h] = box.bbox
  if (w <= 0 || frameWidth <= 0 || frameHeight <= 0) return null

  const distance = (info.width * FOCAL_LENGTH) / w
  const danger = dangerFromDistance(distance)
  const eta = distance / info.speed

  return {
    animalKey: key,
    species: info.species,
    confidence: Math.round(box.score * 1000) / 10,
    distance,
    danger,
    eta,
    action: info.deterrent,
    bbX: (x / frameWidth) * 100,
    bbY: (y / frameHeight) * 100,
    bbW: (w / frameWidth) * 100,
    bbH: (h / frameHeight) * 100,
    x,
    y,
    w,
    h,
  }
}

function recommendationFromAction(action: string, danger: RiskLevel, species: AnimalSpecies) {
  const led = action.includes('LED') || danger === 'High'
  const sound = action.includes('Speaker') || danger !== 'Low'
  const water = danger === 'High'
  return {
    led,
    sound,
    water,
    reasoning: `${species} detected at ~${danger === 'High' ? 'close' : danger === 'Medium' ? 'medium' : 'far'} range. Recommended: ${action}${water ? ' + Water Sprayer' : ''}.`,
  }
}

function actionTakenFromRec(rec: { led: boolean; sound: boolean; water: boolean }) {
  const parts: string[] = []
  if (rec.led) parts.push('LED')
  if (rec.sound) parts.push('Sound')
  if (rec.water) parts.push('Water')
  return parts.join('+') || 'None'
}

/** Convert the strongest analyzed animal into a dashboard Detection */
export function toDetection(analyzed: AnalyzedAnimal): Detection {
  const recommendation = recommendationFromAction(analyzed.action, analyzed.danger, analyzed.species)
  const zone =
    analyzed.danger === 'High'
      ? 'Inner Boundary'
      : analyzed.danger === 'Medium'
        ? 'Mid-field Zone'
        : 'Outer Perimeter'

  return {
    id: `yolo-${Date.now()}-${analyzed.animalKey}`,
    timestamp: new Date(),
    species: analyzed.species,
    confidence: Math.min(99, Math.round(analyzed.confidence)),
    risk: analyzed.danger,
    boundary: 'Live Camera · North Field',
    zone,
    actionTaken: actionTakenFromRec(recommendation),
    recommendation,
    bbX: analyzed.bbX,
    bbY: analyzed.bbY,
    bbW: analyzed.bbW,
    bbH: analyzed.bbH,
    distanceM: Math.round(analyzed.distance * 100) / 100,
    etaSec: Math.round(analyzed.eta * 100) / 100,
    source: 'yolo',
  }
}

export function pickPrimary(animals: AnalyzedAnimal[]): AnalyzedAnimal | null {
  if (animals.length === 0) return null
  return animals.reduce((best, a) => (a.confidence > best.confidence ? a : best))
}
