export type AnimalSpecies = 'cow' | 'goat' | 'pig' | 'buffalo';
export type AnimalZone = 'safe' | 'warning' | 'protected';
export type AnimalStatus = 'approaching' | 'detected' | 'retreating' | 'resolved';
export type SimPhase = 
  | 'MONITORING' 
  | 'APPROACHING' 
  | 'DETECTION' 
  | 'RISK_ASSESSMENT' 
  | 'SOUND_RESPONSE' 
  | 'LIGHT_RESPONSE' 
  | 'WATER_RESPONSE' 
  | 'RETREAT' 
  | 'RESOLVED';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Animal {
  id: string;
  species: AnimalSpecies;
  position: Vector3D;
  speed: number;
  direction: Vector3D;
  confidence: number;
  distance: number;
  riskScore: number;
  zone: AnimalZone;
  status: AnimalStatus;
}

export interface Detection {
  id: string;
  animalId: string;
  species: string;
  confidence: number;
  distance: number;
  timestamp: number;
  position: Vector3D;
}

export interface DeviceState {
  camera: boolean;
  sound: boolean;
  light: boolean;
  water: boolean;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  species: string;
  confidence: number;
  maxRisk: number;
  action: string;
  status: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  message: string;
  type: 'system' | 'detection' | 'risk' | 'decision' | 'response' | 'resolution';
}

export interface ScenarioConfig {
  species: AnimalSpecies;
  name: string;
  speed: number;
  confidence: number;
  initialRisk: number;
  preferredResponse: string;
  description: string;
}
