import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Animal, 
  AnimalSpecies, 
  AnimalZone, 
  AnimalStatus, 
  DeviceState, 
  HistoryRecord, 
  TimelineEvent, 
  Vector3D,
  SimPhase
} from '../types/simulation';
import SCENARIOS from '../data/animals';
import riskEngine from './riskEngine';
import decisionEngine, { DecisionResult } from './decisionEngine';

interface SimulationContextType {
  // Navigation / View
  viewMode: 'farm' | 'architecture';
  setViewMode: (mode: 'farm' | 'architecture') => void;
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  activeModuleId: string | null;
  setActiveModuleId: (id: string | null) => void;
  cameraPreset: 'overview' | 'detection' | 'response';
  setCameraPreset: (preset: 'overview' | 'detection' | 'response') => void;

  // Simulation Status
  simulationState: 'idle' | 'running' | 'paused';
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  selectedScenario: AnimalSpecies;
  loadScenario: (species: AnimalSpecies) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  currentPhase: SimPhase;
  phaseElapsed: number;

  // Active Entities
  animal: Animal | null;
  deviceState: DeviceState;
  decisionResult: DecisionResult | null;

  // Telemetry Logs
  alerts: string[];
  timeline: TimelineEvent[];
  history: HistoryRecord[];
  clearLogs: () => void;

  // Manual Deterrent Overrides
  toggleDeviceManual: (device: keyof DeviceState) => void;
  isManualOverride: boolean;

  // Demo Modes
  demoActive: boolean;
  demoTime: number;
  triggerDemo: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

// Phase durations definition in seconds
const PHASE_DURATIONS: Record<SimPhase, number> = {
  MONITORING: 2.0,
  APPROACHING: 5.0,
  DETECTION: 2.0,
  RISK_ASSESSMENT: 2.0,
  SOUND_RESPONSE: 4.0,
  LIGHT_RESPONSE: 4.0,
  WATER_RESPONSE: 3.0,
  RETREAT: 5.0,
  RESOLVED: 3.0
};

export const SimulationProvider: React.FC<{ children: React.ReactNode; embedded?: boolean }> = ({ children, embedded = false }) => {
  // Navigation & View States
  const [viewMode, setViewMode] = useState<'farm' | 'architecture'>('farm');
  const [showIntro, setShowIntro] = useState<boolean>(!embedded);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'detection' | 'response'>('overview');

  // Simulation Core Controls
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'paused'>('idle');
  const [selectedScenario, setSelectedScenario] = useState<AnimalSpecies>('cow');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [demoTime, setDemoTime] = useState<number>(0);

  // Centralized State Machine Variables
  const [currentPhase, setCurrentPhase] = useState<SimPhase>('MONITORING');
  const [phaseElapsed, setPhaseElapsed] = useState<number>(0);

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [deviceState, setDeviceState] = useState<DeviceState>({
    camera: false,
    light: false,
    sound: false,
    water: false
  });
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);

  // Ticker Logs
  const [alerts, setAlerts] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Ticker Ref
  const tickIntervalRef = useRef<any>(null);

  // Add timeline helper
  const addTimelineEvent = (message: string, type: TimelineEvent['type']) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent: TimelineEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      time: timeStr,
      message,
      type
    };
    setTimeline(prev => [newEvent, ...prev].slice(0, 45));
  };

  // Add alert toast helper
  const addAlert = (message: string) => {
    setAlerts(prev => [message, ...prev].slice(0, 10));
  };

  // Get deterministic animal state at any phase/time
  const getDeterministicState = (
    phase: SimPhase,
    elapsed: number,
    species: AnimalSpecies
  ) => {
    const config = SCENARIOS[species];
    const initialPos: Vector3D = { x: 18, y: 0, z: 18 };
    const insidePos: Vector3D = { x: 9.5, y: 0, z: 9.5 };
    const closePos: Vector3D = { x: 6.5, y: 0, z: 6.5 };
    const cropPos: Vector3D = { x: 3.8, y: 0, z: 3.8 };
    const retreatEndPos: Vector3D = { x: 16.0, y: 0, z: 16.0 };

    let x = initialPos.x;
    let z = initialPos.z;
    let status: AnimalStatus = 'approaching';
    let zone: AnimalZone = 'safe';
    let riskScore = 0;

    let devices: DeviceState = {
      camera: false,
      light: false,
      sound: false,
      water: false
    };

    switch (phase) {
      case 'MONITORING':
        x = initialPos.x;
        z = initialPos.z;
        status = 'approaching';
        zone = 'safe';
        riskScore = config.initialRisk;
        devices = { camera: false, light: false, sound: false, water: false };
        break;

      case 'APPROACHING':
        {
          const t = Math.min(1.0, elapsed / PHASE_DURATIONS.APPROACHING);
          x = initialPos.x - t * (initialPos.x - insidePos.x);
          z = initialPos.z - t * (initialPos.z - insidePos.z);
          status = 'approaching';
          const d = Math.sqrt(x * x + z * z);
          zone = d < 15.0 ? 'warning' : 'safe';
          riskScore = Math.round(config.initialRisk + t * (32 - config.initialRisk));
          devices = { camera: false, light: false, sound: false, water: false };
        }
        break;

      case 'DETECTION':
        x = insidePos.x;
        z = insidePos.z;
        status = 'detected';
        zone = 'warning';
        riskScore = 36;
        devices = { camera: true, light: false, sound: false, water: false };
        break;

      case 'RISK_ASSESSMENT':
        x = insidePos.x;
        z = insidePos.z;
        status = 'detected';
        zone = 'warning';
        riskScore = 48;
        devices = { camera: true, light: false, sound: false, water: false };
        break;

      case 'SOUND_RESPONSE':
        {
          const t = Math.min(1.0, elapsed / PHASE_DURATIONS.SOUND_RESPONSE);
          x = insidePos.x - t * (insidePos.x - closePos.x);
          z = insidePos.z - t * (insidePos.z - closePos.z);
          status = 'detected';
          zone = 'warning';
          riskScore = Math.round(48 + t * 12);
          
          // Escalation rules check: Goats respond to sound immediately, others continue slowly
          devices = { camera: true, light: false, sound: true, water: false };
        }
        break;

      case 'LIGHT_RESPONSE':
        {
          const t = Math.min(1.0, elapsed / PHASE_DURATIONS.LIGHT_RESPONSE);
          x = closePos.x - t * (closePos.x - cropPos.x);
          z = closePos.z - t * (closePos.z - cropPos.z);
          status = 'detected';
          const d = Math.sqrt(x * x + z * z);
          zone = d < 6.0 ? 'protected' : 'warning';
          riskScore = Math.round(60 + t * 20);
          devices = { camera: true, light: true, sound: true, water: false };
        }
        break;

      case 'WATER_RESPONSE':
        x = cropPos.x;
        z = cropPos.z;
        status = 'detected';
        zone = 'protected';
        riskScore = 95;
        devices = { camera: true, light: true, sound: true, water: true };
        break;

      case 'RETREAT':
        {
          const t = Math.min(1.0, elapsed / PHASE_DURATIONS.RETREAT);
          x = cropPos.x + t * (retreatEndPos.x - cropPos.x);
          z = cropPos.z + t * (retreatEndPos.z - cropPos.z);
          status = 'retreating';
          const d = Math.sqrt(x * x + z * z);
          zone = d < 6.0 ? 'protected' : d < 15.0 ? 'warning' : 'safe';
          riskScore = Math.round(95 - t * 75);

          // Deterrents power down sequentially as range increases
          devices = {
            camera: t < 0.95,
            light: t < 0.55,
            sound: t < 0.75,
            water: t < 0.25
          };
        }
        break;

      case 'RESOLVED':
        x = initialPos.x;
        z = initialPos.z;
        status = 'resolved';
        zone = 'safe';
        riskScore = 0;
        devices = { camera: false, light: false, sound: false, water: false };
        break;
    }

    const distance = Math.sqrt(x * x + z * z);
    
    // Compute direction vector towards 0,0,0
    const dirNorm = Math.sqrt(x * x + z * z);
    const direction: Vector3D = {
      x: -x / dirNorm,
      y: 0,
      z: -z / dirNorm
    };

    const finalAnimal: Animal = {
      id: `${species.toUpperCase()}-01`,
      species,
      position: { x, y: 0, z },
      speed: config.speed,
      direction,
      confidence: config.confidence,
      distance,
      riskScore,
      zone,
      status
    };

    return { finalAnimal, devices };
  };

  // Initialize scenario setting
  const loadScenario = (species: AnimalSpecies) => {
    setSimulationState('idle');
    setDemoActive(false);
    setIsManualOverride(false);
    setCurrentPhase('MONITORING');
    setPhaseElapsed(0);

    const { finalAnimal, devices } = getDeterministicState('MONITORING', 0, species);

    setAnimal(finalAnimal);
    setDeviceState(devices);
    setDecisionResult(null);
    setSelectedScenario(species);
    setCameraPreset('overview');

    addTimelineEvent(`Loaded ${SCENARIOS[species].name} scenario configuration`, 'system');
  };

  // Default Cow load on startup
  useEffect(() => {
    loadScenario('cow');
  }, []);

  // Control Actions
  const startSimulation = () => {
    setSimulationState('running');
    addTimelineEvent('Boundary scanning and threat engine ACTIVE 🟢', 'system');
  };

  const pauseSimulation = () => {
    setSimulationState('paused');
    addTimelineEvent('Simulation monitoring PAUSED 🟡', 'system');
  };

  const resetSimulation = () => {
    loadScenario(selectedScenario);
  };

  const clearLogs = () => {
    setTimeline([]);
    setAlerts([]);
    setHistory([]);
  };

  // Manual device test override
  const toggleDeviceManual = (device: keyof DeviceState) => {
    setIsManualOverride(true);
    setDeviceState(prev => {
      const newState = {
        ...prev,
        [device]: !prev[device]
      };
      
      // If we are turning camera ON manually, let it glow/focus
      addTimelineEvent(`Device Test: Toggled ${device.toUpperCase()} ${!prev[device] ? 'ON 🟢' : 'OFF ⚪'}`, 'response');
      return newState;
    });
  };

  // Trigger full demo loop
  const triggerDemo = () => {
    loadScenario('cow');
    setDemoActive(true);
    setDemoTime(0);
    setSimulationState('running');
    addTimelineEvent('Starting full scripted demo loop scenario...', 'system');
  };

  // Main State Ticker update loop
  useEffect(() => {
    if (simulationState === 'running' && animal) {
      tickIntervalRef.current = setInterval(() => {
        setPhaseElapsed(prevElapsed => {
          const step = 0.1 * simulationSpeed;
          const nextElapsed = prevElapsed + step;
          const duration = PHASE_DURATIONS[currentPhase];

          // Check if phase is complete
          if (nextElapsed >= duration) {
            // Determine next phase in cycle
            let nextPhase: SimPhase = 'MONITORING';
            switch (currentPhase) {
              case 'MONITORING': nextPhase = 'APPROACHING'; break;
              case 'APPROACHING': nextPhase = 'DETECTION'; break;
              case 'DETECTION': nextPhase = 'RISK_ASSESSMENT'; break;
              case 'RISK_ASSESSMENT': nextPhase = 'SOUND_RESPONSE'; break;
              case 'SOUND_RESPONSE':
                // Goat retreats immediately on sound response, bypasses light/water!
                nextPhase = animal.species === 'goat' ? 'RETREAT' : 'LIGHT_RESPONSE';
                break;
              case 'LIGHT_RESPONSE': nextPhase = 'WATER_RESPONSE'; break;
              case 'WATER_RESPONSE': nextPhase = 'RETREAT'; break;
              case 'RETREAT': nextPhase = 'RESOLVED'; break;
              case 'RESOLVED': nextPhase = 'MONITORING'; break;
            }

            // Phase entry side-effects (Timeline logs & alerts)
            setTimeout(() => {
              setCurrentPhase(nextPhase);
              setPhaseElapsed(0);
              
              // Custom entries on transition
              switch (nextPhase) {
                case 'MONITORING':
                  addTimelineEvent('Perimeter scanning active. Scanners idle.', 'system');
                  break;
                case 'APPROACHING':
                  addTimelineEvent(`Animal spotted outside boundary. Approaching protected crop field.`, 'detection');
                  break;
                case 'DETECTION':
                  addTimelineEvent(`Vision Node lock-on: ${animal.id} detected (${animal.confidence}% Confidence)`, 'detection');
                  addAlert('Warning: Intruder approaching crops boundary!');
                  setCameraPreset('detection'); // focus zoom on target
                  break;
                case 'RISK_ASSESSMENT':
                  addTimelineEvent(`Risk Evaluation: Threat classified as warning zone entry.`, 'risk');
                  break;
                case 'SOUND_RESPONSE':
                  addTimelineEvent('Decision Engine: Dispatching command -> [SIREN SPEAKER]', 'decision');
                  addTimelineEvent('Acoustic Siren speaker activated 🔊', 'response');
                  setCameraPreset('response'); // focus response node
                  break;
                case 'LIGHT_RESPONSE':
                  addTimelineEvent('Decision Engine: Dispatching command -> [LED STROBE LIGHT]', 'decision');
                  addTimelineEvent('Visual flashing strobe active 💡', 'response');
                  addAlert('Critical Alert: Crop protection perimeter breached!');
                  break;
                case 'WATER_RESPONSE':
                  addTimelineEvent('Decision Engine: Dispatching command -> [WATER PUMP]', 'decision');
                  addTimelineEvent('Hydraulic sprinkler spray nozzle active 💧', 'response');
                  addAlert('Sprinkler active: Sprayer running!');
                  break;
                case 'RETREAT':
                  addTimelineEvent('Deterrents effective. Target changed direction and retreating 🟢', 'resolution');
                  addAlert('Deterrent effective: Animal retreating!');
                  setCameraPreset('overview'); // return to overview
                  break;
                case 'RESOLVED':
                  addTimelineEvent('Threat resolved. Scanners clear.', 'resolution');
                  
                  // Log Incident in History
                  const activeAction = [
                    deviceState.light ? 'LED' : null,
                    deviceState.sound ? 'Sound' : null,
                    deviceState.water ? 'Sprinkler' : null
                  ].filter(Boolean).join(' + ') || 'None';

                  const newRecord: HistoryRecord = {
                    id: `${animal.id}-${Date.now().toString().slice(-4)}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    species: SCENARIOS[animal.species].name,
                    confidence: animal.confidence,
                    maxRisk: animal.species === 'cow' ? 95 : animal.species === 'goat' ? 58 : 98,
                    action: activeAction,
                    status: 'Resolved (Animal Deterred)'
                  };
                  setHistory(prev => [newRecord, ...prev]);
                  break;
              }
            }, 0);

            return 0;
          }

          // Otherwise continue current phase
          return nextElapsed;
        });

        if (demoActive) {
          setDemoTime(prev => prev + 0.1 * simulationSpeed);
        }

      }, 100);
    }

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, [simulationState, animal?.species, currentPhase, simulationSpeed, demoActive, deviceState]);

  // Synchronize animal position and devices state to deterministic state machine output
  useEffect(() => {
    if (simulationState === 'running' && !isManualOverride) {
      const { finalAnimal, devices } = getDeterministicState(currentPhase, phaseElapsed, selectedScenario);
      setAnimal(finalAnimal);
      setDeviceState(devices);

      // Populate dummy decision recommend texts
      const result: DecisionResult = {
        devices,
        recommendation: 
          currentPhase === 'MONITORING' ? 'No response required. Keep scanning.' :
          currentPhase === 'APPROACHING' ? 'Animal detected at distance. Monitoring approaching vector.' :
          currentPhase === 'DETECTION' ? 'Vision Node Lock-on: target species matched.' :
          currentPhase === 'RISK_ASSESSMENT' ? 'Risk evaluated: warnings escalation threshold reached.' :
          currentPhase === 'SOUND_RESPONSE' ? 'Acoustic siren speaker active. Spooking grazer away.' :
          currentPhase === 'LIGHT_RESPONSE' ? 'LED flashing warning light active. disorienting intruder.' :
          currentPhase === 'WATER_RESPONSE' ? 'Sprinkler water pump running. Forcing crop boundary retreat.' :
          currentPhase === 'RETREAT' ? 'Intruder retreating. Deterrent outputs backing down.' :
          'Threat resolved. Safety status clear.',
        stageStatuses: {
          yolo: currentPhase === 'MONITORING' || currentPhase === 'APPROACHING' ? 'PENDING' : 'COMPLETE',
          risk: currentPhase === 'MONITORING' || currentPhase === 'APPROACHING' ? 'PENDING' : 'COMPLETE',
          decision: currentPhase === 'MONITORING' || currentPhase === 'APPROACHING' ? 'PENDING' : 'COMPLETE',
          action: currentPhase === 'MONITORING' || currentPhase === 'APPROACHING' ? 'PENDING' : 'READY'
        }
      };
      setDecisionResult(result);
    }
  }, [currentPhase, phaseElapsed, simulationState, selectedScenario, isManualOverride]);

  return (
    <SimulationContext.Provider value={{
      viewMode,
      setViewMode,
      showIntro,
      setShowIntro,
      activeModuleId,
      setActiveModuleId,
      simulationState,
      startSimulation,
      pauseSimulation,
      resetSimulation,
      selectedScenario,
      loadScenario,
      animal,
      deviceState,
      decisionResult,
      alerts,
      timeline,
      history,
      clearLogs,
      toggleDeviceManual,
      isManualOverride,
      demoActive,
      demoTime,
      triggerDemo,
      simulationSpeed,
      setSimulationSpeed,
      cameraPreset,
      setCameraPreset,
      currentPhase,
      phaseElapsed
    }}>
      {children}
    </SimulationContext.Provider>
  );
};
export default SimulationProvider;
