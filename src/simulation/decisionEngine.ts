import { DeviceState, AnimalZone } from '../types/simulation';

export interface DecisionResult {
  devices: DeviceState;
  recommendation: string;
  stageStatuses: {
    yolo: 'PENDING' | 'COMPLETE';
    risk: 'PENDING' | 'PROCESSING' | 'COMPLETE';
    decision: 'PENDING' | 'PROCESSING' | 'COMPLETE';
    action: 'PENDING' | 'READY';
  };
}

export const decisionEngine = {
  evaluateResponse(
    zone: AnimalZone, 
    riskScore: number, 
    species: string, 
    distance: number
  ): DecisionResult {
    const result: DecisionResult = {
      devices: { camera: false, light: false, sound: false, water: false },
      recommendation: 'No response required. Keep scanning.',
      stageStatuses: {
        yolo: 'COMPLETE',
        risk: 'COMPLETE',
        decision: 'COMPLETE',
        action: 'READY'
      }
    };

    // Camera Node is always monitoring if within vision range (e.g. distance < 20)
    if (distance < 20) {
      result.devices.camera = true;
    }

    if (zone === 'safe') {
      result.recommendation = 'Monitor safe zone. Deterrents standby.';
    } else if (zone === 'warning') {
      // Escalation check: Goats are scared by sound immediately. 
      // Pigs and buffalo require LED and sound, and might escalate.
      if (species === 'goat') {
        result.devices.sound = true;
        result.recommendation = 'Acoustic Sound activated. Goat is sensitive to ultrasound.';
      } else {
        result.devices.light = true;
        result.devices.sound = true;
        result.recommendation = `Lights + Audio warning active for ${species}.`;
      }
    } else if (zone === 'protected') {
      // Critical Breach
      result.devices.light = true;
      result.devices.sound = true;
      
      // Stubborn intruders require water spray
      if (species === 'cow' || species === 'pig' || species === 'buffalo') {
        result.devices.water = true;
        result.recommendation = `CRITICAL: Activating Water Sprinkler spray to deter stubborn ${species}.`;
      } else {
        // Goats retreat without water, but spray is turned on as a failsafe
        result.devices.water = true;
        result.recommendation = 'Emergency Sprinkler active. Failsafe activated.';
      }
    }

    return result;
  }
};

export default decisionEngine;
