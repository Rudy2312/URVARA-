import { AnimalZone } from '../types/simulation';

export const riskEngine = {
  calculateRisk(distance: number, species: string, status: string): number {
    let baseRisk = 0;

    // Crop boundaries: protected < 6m, warning 6m to 15m, safe >= 15m
    if (distance < 6) {
      baseRisk = 85 + (6 - distance) * 2; // climbs up to 98
    } else if (distance < 15) {
      // Linear interpolation from 30 to 80
      baseRisk = 30 + ((15 - distance) / (15 - 6)) * 50;
    } else {
      // Linear interpolation from 5 to 30
      baseRisk = Math.max(5, 5 + ((25 - distance) / 10) * 25);
    }

    // Species factors
    if (species === 'pig') baseRisk += 8;
    if (species === 'buffalo') baseRisk += 5;
    if (species === 'goat') baseRisk += 2;

    // Trajectory adjustment
    if (status === 'retreating') {
      baseRisk -= 25; // risk drops as it moves away
    } else if (status === 'detected') {
      baseRisk += 10;
    }

    return Math.max(0, Math.min(100, Math.round(baseRisk)));
  },

  getZone(distance: number): AnimalZone {
    if (distance < 6) return 'protected';
    if (distance < 15) return 'warning';
    return 'safe';
  }
};

export default riskEngine;
