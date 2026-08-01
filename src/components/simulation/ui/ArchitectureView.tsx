import React, { useState } from 'react';
import { useSimulation } from '../../../simulation/SimulationProvider';
import { Tv, Cpu, Settings, Binary, Zap, Info } from 'lucide-react';

interface ModuleDetail {
  title: string;
  sub: string;
  desc: string;
  realState: string;
}

const MODULE_DETAILS: Record<string, ModuleDetail> = {
  camera: {
    title: 'IoT Vision Camera Sensor',
    sub: 'Optical Input Node',
    desc: 'Captures high-resolution frames of the field acreage boundary. In the physical implementation, this is connected to a Raspberry Pi Cam or ESP32-CAM module via SPI.',
    realState: 'REAL opt-in streaming on user consent, simulated telemetry tracking.'
  },
  yolo: {
    title: 'YOLO v8 Inference Engine',
    sub: 'AI Object Recognition',
    desc: 'Processes the live capture stream at the edge to recognize target stray and grazing animal species (Cow, Goat, Wild Pig, Buffalo) and outputs confidence bounding boxes.',
    realState: 'SIMULATED AI detection provider. Ready to load real YOLO weights later.'
  },
  risk: {
    title: 'Threat Evaluation Processor',
    sub: 'Risk Vector Classifier',
    desc: 'Computes real-time threat rating scores (0-100) and warning zone indexes based on animal displacement speed, species footprint, and crop proximity coordinates.',
    realState: 'REAL software algorithm logic, running locally inside the dashboard.'
  },
  decision: {
    title: 'AgriTech Decision Rule Engine',
    sub: 'Escalation Controller Logic',
    desc: 'Applies preset mitigation thresholds rules to decide the least invasive deterrent response. Escalates outputs (LED -> Speaker -> Sprinkler) as risk advances.',
    realState: 'REAL rule-based state classifier operating in the simulation provider.'
  },
  gpio: {
    title: 'GPIO Hardware Controller',
    sub: 'Microcontroller Outputs Pin',
    desc: 'Pushes 3.3V high/low signals to output pins (e.g. GPIO 17, 18, 27) based on decision commands. Operates on ESP32 or Raspberry Pi pinouts.',
    realState: 'SIMULATED controller routing commands to software twin nodes.'
  },
  relay: {
    title: 'Relay Actuator Switch Matrix',
    sub: 'High-Voltage Galvanic Switches',
    desc: 'Isolates and switches 12V/220V power lines feeding high-draw deterrent outputs (loudspeakers, strobe matrices, water pumps) safely without feedback damage.',
    realState: 'SIMULATED relay state switches.'
  },
  led: {
    title: 'LED Matrix Strobe Deterrent',
    sub: 'Visual Warning Output',
    desc: 'Activates high-intensity flashing white/yellow strobe matrices to startle and disorient stray animals, causing them to retreat without physical harm.',
    realState: 'SIMULATED hardware output strobe visuals.'
  },
  speaker: {
    title: 'High-Decibel Siren Speaker',
    sub: 'Acoustic Deterrent Output',
    desc: 'Generates specific frequency sweeps and wildlife warning sirens to frighten grazers off. Can emit ultrasound ranges tailored to specific pests.',
    realState: 'REAL browser Audio Context synthesizer active. Simulated physical speaker.'
  },
  pump: {
    title: 'Hydraulic Water Sprinkler Pump',
    sub: 'Escalation Deterrent Output',
    desc: 'Triggers solenoid valves or starter pumps to spray localized water arcs. Deployed as a critical escalation when animals persist inside crop fields.',
    realState: 'SIMULATED hydraulic spray particle grids.'
  }
};

export const ArchitectureView: React.FC = () => {
  const { deviceState, animal, setViewMode } = useSimulation();
  const [selectedModule, setSelectedModule] = useState<string>('camera');

  const activeDetails = MODULE_DETAILS[selectedModule];

  // Helper flags matching currently active pipeline stages
  const isCameraActive = animal !== null && animal.status !== 'resolved';
  const isYoloActive = animal !== null && animal.status !== 'resolved' && animal.status !== 'approaching';
  const isRiskActive = isYoloActive;
  const isDecisionActive = isRiskActive;
  const isGPIOActive = deviceState.light || deviceState.sound || deviceState.water;
  const isRelayActive = isGPIOActive;

  const getModuleSVGStyles = (active: boolean) => {
    return {
      fill: active ? "rgba(168, 230, 207, 0.35)" : "rgba(255, 255, 255, 0.72)",
      stroke: active ? "#3FAF7A" : "rgba(23, 74, 56, 0.12)",
      strokeWidth: active ? 2.5 : 1.5,
      rx: 12,
      style: {
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: active ? 'drop-shadow(0 4px 10px rgba(63, 175, 122, 0.15))' : 'none'
      }
    };
  };

  const getConnectorClass = (active: boolean) => {
    return active ? 'stroke-[#3FAF7A] animate-signal-flow' : 'stroke-slate-200';
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#F7FCFA] via-[#EDF8F5] to-[#F5FAFB] rounded-3xl border border-slate-200/80 shadow-2xl overflow-y-auto select-none">
      
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-black text-[#678078] tracking-widest uppercase">Physical Implementation Diagram</span>
          <h3 className="text-lg font-black text-[#12372A] tracking-wide mt-0.5">Circuit & IoT Signals Architecture</h3>
        </div>
        <button
          onClick={() => setViewMode('farm')}
          className="bg-white/60 hover:bg-white/95 text-[#17352B] border border-slate-200 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm duration-200"
        >
          ← Return to 3D Twin
        </button>
      </div>

      {/* Main Flow SVG Layout */}
      <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
        <svg viewBox="0 0 800 350" className="w-full max-w-4xl h-auto">
          {/* Signal paths definitions */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3FAF7A" />
            </marker>
          </defs>

          {/* Connectors lines */}
          {/* Camera -> YOLO */}
          <path d="M 125 100 L 195 100" fill="none" className={getConnectorClass(isCameraActive)} strokeWidth="2.5" markerEnd="url(#arrow)" />
          {/* YOLO -> Risk */}
          <path d="M 315 100 L 385 100" fill="none" className={getConnectorClass(isYoloActive)} strokeWidth="2.5" markerEnd="url(#arrow)" />
          {/* Risk -> Decision */}
          <path d="M 505 100 L 575 100" fill="none" className={getConnectorClass(isRiskActive)} strokeWidth="2.5" markerEnd="url(#arrow)" />
          
          {/* Decision -> GPIO (vertical step down) */}
          <path d="M 640 135 L 640 205" fill="none" className={getConnectorClass(isDecisionActive)} strokeWidth="2.5" markerEnd="url(#arrow)" />
          
          {/* GPIO -> Relay */}
          <path d="M 585 240 L 515 240" fill="none" className={getConnectorClass(isGPIOActive)} strokeWidth="2.5" markerEnd="url(#arrow)" />
          
          {/* Relay -> deterrents splits */}
          <path d="M 395 240 L 315 170" fill="none" className={getConnectorClass(deviceState.light)} strokeWidth="2.5" markerEnd="url(#arrow)" />
          <path d="M 395 240 L 315 240" fill="none" className={getConnectorClass(deviceState.sound)} strokeWidth="2.5" markerEnd="url(#arrow)" />
          <path d="M 395 240 L 315 310" fill="none" className={getConnectorClass(deviceState.water)} strokeWidth="2.5" markerEnd="url(#arrow)" />

          {/* Module Nodes groups */}
          {/* 1. Camera Node */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('camera')}>
            <rect x="15" y="65" width="110" height="70" {...getModuleSVGStyles(isCameraActive)} />
            <text x="70" y="103" fill="#12372A" fontSize="9.5" fontWeight="900" textAnchor="middle">CAMERA</text>
            <text x="70" y="118" fill={isCameraActive ? "#3FAF7A" : "#678078"} fontSize="8" fontWeight="700" textAnchor="middle">Optical Sensor</text>
          </g>

          {/* 2. YOLO Node */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('yolo')}>
            <rect x="205" y="65" width="110" height="70" {...getModuleSVGStyles(isYoloActive)} />
            <text x="260" y="103" fill="#12372A" fontSize="9.5" fontWeight="900" textAnchor="middle">AI / YOLO v8</text>
            <text x="260" y="118" fill={isYoloActive ? "#3FAF7A" : "#678078"} fontSize="8" fontWeight="700" textAnchor="middle">Object Inference</text>
          </g>

          {/* 3. Risk Engine Node */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('risk')}>
            <rect x="395" y="65" width="110" height="70" {...getModuleSVGStyles(isRiskActive)} />
            <text x="450" y="103" fill="#12372A" fontSize="9.5" fontWeight="900" textAnchor="middle">RISK ENGINE</text>
            <text x="450" y="118" fill={isRiskActive ? "#3FAF7A" : "#678078"} fontSize="8" fontWeight="700" textAnchor="middle">Threat Calculation</text>
          </g>

          {/* 4. Decision Engine Node */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('decision')}>
            <rect x="585" y="65" width="110" height="70" {...getModuleSVGStyles(isDecisionActive)} />
            <text x="640" y="103" fill="#12372A" fontSize="9.5" fontWeight="900" textAnchor="middle">DECISION RULES</text>
            <text x="640" y="118" fill={isDecisionActive ? "#3FAF7A" : "#678078"} fontSize="8" fontWeight="700" textAnchor="middle">Response Escalate</text>
          </g>

          {/* 5. GPIO Node */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('gpio')}>
            <rect x="585" y="205" width="110" height="70" {...getModuleSVGStyles(isGPIOActive)} />
            <text x="640" y="243" fill="#12372A" fontSize="9.5" fontWeight="900" textAnchor="middle">GPIO CONTROLLER</text>
            <text x="640" y="258" fill={isGPIOActive ? "#3FAF7A" : "#678078"} fontSize="8" fontWeight="700" textAnchor="middle">Digital Output Pins</text>
          </g>

          {/* 6. Relay Node */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('relay')}>
            <rect x="395" y="205" width="110" height="70" {...getModuleSVGStyles(isRelayActive)} />
            <text x="450" y="243" fill="#12372A" fontSize="9.5" fontWeight="900" textAnchor="middle">RELAY SWITCH</text>
            <text x="450" y="258" fill={isRelayActive ? "#3FAF7A" : "#678078"} fontSize="8" fontWeight="700" textAnchor="middle">12V/220V Actuator</text>
          </g>

          {/* 7. LED Output */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('led')}>
            <rect x="205" y="135" width="110" height="50" {...getModuleSVGStyles(deviceState.light)} />
            <text x="260" y="163" fill="#12372A" fontSize="9" fontWeight="900" textAnchor="middle">LED LIGHT</text>
          </g>

          {/* 8. Speaker Output */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('speaker')}>
            <rect x="205" y="215" width="110" height="50" {...getModuleSVGStyles(deviceState.sound)} />
            <text x="260" y="243" fill="#12372A" fontSize="9" fontWeight="900" textAnchor="middle">SIREN SPEAKER</text>
          </g>

          {/* 9. Pump/Water Output */}
          <g className="cursor-pointer" onClick={() => setSelectedModule('pump')}>
            <rect x="205" y="295" width="110" height="50" {...getModuleSVGStyles(deviceState.water)} />
            <text x="260" y="323" fill="#12372A" fontSize="9" fontWeight="900" textAnchor="middle">WATER PUMP</text>
          </g>
        </svg>
      </div>

      {/* Selected Module Detail Panel: Clean glass card style */}
      <div className="glass-panel p-4.5 flex flex-col md:flex-row gap-4 items-start border border-[#174A38]/12 bg-white/70 shadow-lg">
        <div className="p-3 bg-[#A8E6CF]/20 rounded-2xl text-[#12372A] border border-[#3FAF7A]/20 flex-shrink-0">
          <Info size={22} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#12372A] text-sm">{activeDetails.title}</span>
            <span className="text-[9px] text-[#678078] uppercase font-bold">({activeDetails.sub})</span>
          </div>
          <p className="text-xs text-[#17352B] leading-normal font-semibold">{activeDetails.desc}</p>
          <div className="text-[10px] text-[#3FAF7A] font-bold pt-1">
            💻 CURRENT HARDWARE INTEGRATION: <span className="italic font-extrabold text-[#12372A]">{activeDetails.realState}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ArchitectureView;
