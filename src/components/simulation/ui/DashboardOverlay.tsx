import React from 'react';
import { useSimulation } from '../../../simulation/SimulationProvider';
import { AnimalSpecies } from '../../../types/simulation';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  ShieldAlert, 
  Volume2, 
  Lightbulb, 
  Droplet, 
  Eye, 
  Cpu, 
  Layers,
  Clock,
  Navigation
} from 'lucide-react';
import SCENARIOS from '../../../data/animals';
import MiniMap2D from './MiniMap2D';

export const DashboardOverlay: React.FC = () => {
  const {
    viewMode,
    setViewMode,
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
    demoActive,
    demoTime,
    triggerDemo,
    simulationSpeed,
    setSimulationSpeed,
    cameraPreset,
    setCameraPreset,
    toggleDeviceManual,
    currentPhase,
    phaseElapsed
  } = useSimulation();

  const activeScenarioConfig = SCENARIOS[selectedScenario];

  // Smooth visual telemetry values interpolation states
  const [lerpedRisk, setLerpedRisk] = React.useState(0);
  const [lerpedDist, setLerpedDist] = React.useState(0);
  const [lerpedConf, setLerpedConf] = React.useState(0);

  React.useEffect(() => {
    if (!animal) {
      setLerpedRisk(0);
      setLerpedDist(0);
      setLerpedConf(0);
      return;
    }
    
    let animFrame: number;
    const step = () => {
      setLerpedRisk(prev => {
        const diff = animal.riskScore - prev;
        if (Math.abs(diff) < 0.15) return animal.riskScore;
        return prev + diff * 0.08; // smooth slide speed
      });
      setLerpedDist(prev => {
        const diff = animal.distance - prev;
        if (Math.abs(diff) < 0.05) return animal.distance;
        return prev + diff * 0.08;
      });
      setLerpedConf(prev => {
        const diff = animal.confidence - prev;
        if (Math.abs(diff) < 0.15) return animal.confidence;
        return prev + diff * 0.08;
      });
      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [animal?.riskScore, animal?.distance, animal?.confidence]);

  // Helper to compute ETA
  const calculateETA = () => {
    if (!animal || animal.status === 'resolved' || animal.status === 'retreating') return 'N/A';
    const speedSec = animal.speed * 1.3; // estimated speed in m/s
    if (speedSec <= 0) return 'Infinite';
    const eta = animal.distance / speedSec;
    return `${eta.toFixed(1)} sec`;
  };

  const getRiskColorClass = (risk: number) => {
    if (risk >= 81) return 'text-[#FF8F82] font-black'; // Coral Red
    if (risk >= 61) return 'text-[#FF8F82] font-black';
    if (risk >= 31) return 'text-[#E9B949] font-bold';  // Amber
    return 'text-[#73E2B0] font-bold';  // Mint green
  };

  const getRiskBgClass = (risk: number) => {
    if (risk >= 81) return 'bg-[#FF8F82]/12 text-[#FF8F82] border-[#FF8F82]/25';
    if (risk >= 61) return 'bg-[#FF8F82]/10 text-[#FF8F82] border-[#FF8F82]/20';
    if (risk >= 31) return 'bg-[#E9B949]/12 text-[#E9B949] border-[#E9B949]/25';
    return 'bg-[#73E2B0]/15 text-[#73E2B0] border-[#73E2B0]/30';
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 overflow-hidden select-none">
      
      {/* ==============================================
          TOP BAR: Branding, Status, Mode Toggles
          ============================================== */}
      <div className="flex justify-between items-start w-full pointer-events-auto">
        {/* Logo Branding */}
        <div className="glass-panel p-4 flex items-center space-x-3">
          <div className="p-2 bg-[#73E2B0]/12 rounded-xl border border-[#73E2B0]/22 text-[#73E2B0] shadow-sm animate-pulse-cyan">
            <Cpu size={20} />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-[#F3FFFA] leading-none">Fasal Raksha</h1>
            <span className="text-[9px] text-[#A8C8BF] font-bold tracking-wider uppercase block mt-1">Smart Protection. Safer Crops.</span>
          </div>
        </div>

        {/* System Online / Toggles */}
        <div className="flex items-center space-x-3">
          {/* Camera View Presets */}
          <div className="glass-panel p-1.5 flex items-center space-x-1 border border-[#174A38]/20 bg-[#12372A]/30">
            {(['overview', 'detection', 'response'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setCameraPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all duration-200 ${
                  cameraPreset === preset
                    ? 'bg-[#73E2B0] text-[#12372A] font-extrabold shadow-md'
                    : 'bg-transparent hover:bg-white/10 text-[#A8C8BF]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'farm' ? 'architecture' : 'farm')}
            className={`glass-panel px-4.5 py-2.5 text-xs font-bold transition-all flex items-center space-x-2 border hover:bg-white/10 duration-200 ${
              viewMode === 'architecture' 
                ? 'border-[#73E2B0] text-[#73E2B0] bg-[#73E2B0]/12 shadow-md' 
                : 'border-slate-700/40 text-[#F3FFFA] bg-[#12372A]/40'
            }`}
          >
            <Layers size={14} />
            <span>{viewMode === 'farm' ? 'VIEW CIRCUIT ARCHITECTURE' : 'VIEW 3D SIMULATOR'}</span>
          </button>

          {/* Online Tag */}
          <div className="glass-panel p-3 flex flex-col items-end justify-center">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#73E2B0] animate-ping"></span>
              <span className="text-xs font-black text-[#F3FFFA] flex items-center space-x-1">
                <span>●</span> <span>SYSTEM ONLINE</span>
              </span>
            </div>
            <span className="text-[8px] text-[#A8C8BF] mt-1 uppercase tracking-wider font-extrabold">
              {simulationState === 'running' ? 'Telemetry Monitoring' : 'Standby Scan'}
            </span>
          </div>
        </div>
      </div>

      {/* ==============================================
          MIDDLE LAYOUT: Side Panels
          ============================================== */}
      <div className="flex-1 my-4 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden items-stretch">
        
        {/* LEFT COLUMN: Controls & Timeline */}
        <div className="lg:col-span-1 flex flex-col space-y-4 overflow-hidden pointer-events-auto">
          {/* Scenario & Controls */}
          <div className="glass-panel p-4 flex flex-col space-y-3.5">
            <span className="text-[10px] font-black text-[#73E2B0] uppercase tracking-widest border-b border-[#174A38]/30 pb-1.5">SIMULATION CONTROL</span>
            
            {/* Scenarios List */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[#A8C8BF] uppercase tracking-wider">Select Intruding Target</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['cow', 'goat', 'pig', 'buffalo'] as AnimalSpecies[]).map(spec => {
                  const isSelected = selectedScenario === spec;
                  return (
                    <button
                      key={spec}
                      onClick={() => loadScenario(spec)}
                      className={`py-2.5 rounded-xl text-[10px] font-black border transition-all duration-200 ${
                        isSelected 
                          ? 'bg-[#73E2B0]/20 border-[#73E2B0]/45 text-[#F3FFFA] shadow-inner' 
                          : 'bg-[#12372A]/30 hover:bg-[#12372A]/60 border-slate-700/40 text-[#A8C8BF]'
                      }`}
                    >
                      {spec === 'cow' ? '🐄 COW' : spec === 'goat' ? '🐐 GOAT' : spec === 'pig' ? '🐖 WILD PIG' : '🐃 BUFFALO'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scenario Description */}
            <div className="bg-[#101e30]/25 p-2.5 rounded-xl border border-slate-700/40 text-[10px] text-[#A8C8BF] leading-normal font-medium">
              <span className="font-extrabold text-[#F3FFFA] block mb-0.5">{activeScenarioConfig.name}</span>
              {activeScenarioConfig.description}
            </div>

            {/* Run controls: Floating control bar style */}
            <div className="grid grid-cols-3 gap-2 border-t border-[#174A38]/30 pt-3 bg-[#12372A]/30 p-1.5 rounded-xl">
              <button 
                onClick={startSimulation}
                disabled={simulationState === 'running'}
                className={`py-2 rounded-lg text-[10px] font-black flex items-center justify-center space-x-1 border transition-all duration-200 ${
                  simulationState === 'running' 
                    ? 'bg-[#73E2B0]/20 border-[#73E2B0]/30 text-[#73E2B0]' 
                    : 'bg-transparent border-transparent text-[#A8C8BF] hover:bg-white/10'
                }`}
              >
                <Play size={11} fill="currentColor" /> <span>Start</span>
              </button>
              <button 
                onClick={pauseSimulation}
                disabled={simulationState !== 'running'}
                className={`py-2 rounded-lg text-[10px] font-black flex items-center justify-center space-x-1 border transition-all duration-200 ${
                  simulationState === 'paused' 
                    ? 'bg-[#E9B949]/20 border-[#E9B949]/30 text-[#E9B949]' 
                    : 'bg-transparent border-transparent text-[#A8C8BF] hover:bg-white/10'
                }`}
              >
                <Pause size={11} fill="currentColor" /> <span>Pause</span>
              </button>
              <button 
                onClick={resetSimulation}
                className="bg-transparent border-transparent hover:bg-white/10 text-[#A8C8BF] py-2 rounded-lg text-[10px] font-black flex items-center justify-center space-x-1 transition-all duration-200"
              >
                <RotateCcw size={11} /> <span>Reset</span>
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center justify-between border-t border-[#174A38]/30 pt-3">
              <span className="text-[9px] font-black text-[#A8C8BF] uppercase">Sim Speed</span>
              <div className="flex space-x-1">
                {([0.5, 1.0, 2.0] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimulationSpeed(spd)}
                    className={`px-2.5 py-1 rounded-lg text-[8px] font-bold border transition-all duration-200 ${
                      simulationSpeed === spd
                        ? 'bg-[#73E2B0] border-[#73E2B0] text-[#12372A] font-extrabold shadow-sm'
                        : 'bg-[#12372A]/30 border-slate-700/40 text-[#A8C8BF] hover:bg-[#12372A]/65'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Device Test Panel */}
            <div className="border-t border-[#174A38]/30 pt-3 space-y-1.5">
              <label className="text-[9px] font-black text-[#A8C8BF] uppercase tracking-wider">Hardware Device Manual Test</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => toggleDeviceManual('camera')}
                  className={`py-1.5 rounded-xl text-[9px] font-black border transition-all duration-200 ${
                    deviceState.camera 
                      ? 'bg-[#8EDDE2]/20 border-[#8EDDE2]/45 text-[#F3FFFA] shadow-sm' 
                      : 'bg-[#12372A]/30 border-slate-700/40 text-[#A8C8BF] hover:bg-[#12372A]/65'
                  }`}
                >
                  TEST CAM
                </button>
                <button
                  onClick={() => toggleDeviceManual('light')}
                  className={`py-1.5 rounded-xl text-[9px] font-black border transition-all duration-200 ${
                    deviceState.light 
                      ? 'bg-[#FF8F82]/20 border-[#FF8F82]/45 text-[#F3FFFA] shadow-sm' 
                      : 'bg-[#12372A]/30 border-slate-700/40 text-[#A8C8BF] hover:bg-[#12372A]/65'
                  }`}
                >
                  TEST LIGHT
                </button>
                <button
                  onClick={() => toggleDeviceManual('sound')}
                  className={`py-1.5 rounded-xl text-[9px] font-black border transition-all duration-200 ${
                    deviceState.sound 
                      ? 'bg-[#B7A7E8]/20 border-[#B7A7E8]/45 text-[#F3FFFA] shadow-sm' 
                      : 'bg-[#12372A]/30 border-slate-700/40 text-[#A8C8BF] hover:bg-[#12372A]/65'
                  }`}
                >
                  TEST SIREN
                </button>
                <button
                  onClick={() => toggleDeviceManual('water')}
                  className={`py-1.5 rounded-xl text-[9px] font-black border transition-all duration-200 ${
                    deviceState.water 
                      ? 'bg-blue-500/20 border-blue-500/45 text-[#F3FFFA] shadow-sm' 
                      : 'bg-[#12372A]/30 border-slate-700/40 text-[#A8C8BF] hover:bg-[#12372A]/65'
                  }`}
                >
                  TEST SPRAY
                </button>
              </div>
            </div>

            {/* Scripted Demo CTA: Premium green gradient button */}
            <button
              onClick={triggerDemo}
              disabled={demoActive}
              className="w-full bg-gradient-to-r from-[#174A38] to-[#3FAF7A] hover:opacity-95 text-white font-extrabold py-2.5 rounded-xl text-[10px] flex items-center justify-center space-x-1.5 transition-all shadow-md active:translate-y-px"
            >
              <span>RUN HACKATHON WALKTHROUGH</span>
            </button>
          </div>

          {/* Timeline Feed Ticker */}
          <div className="glass-panel p-4 flex-1 flex flex-col justify-between overflow-hidden">
            <span className="text-[10px] font-black text-[#73E2B0] uppercase tracking-widest block mb-2 border-b border-[#174A38]/30 pb-1.5">TELEMETRY SIMULATION LOG</span>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[11px]">
              {timeline.length === 0 ? (
                <p className="text-[10px] text-[#718F89] italic text-center py-10">Sensors scanning. Trigger a scenario to monitor feed.</p>
              ) : (
                timeline.map(e => (
                  <div key={e.id} className="border-l-2 border-[#3FAF7A]/25 pl-2.5 py-0.5">
                    <div className="flex items-center justify-between text-[9px] text-[#A8C8BF] font-bold">
                      <span>{e.time}</span>
                      <span className={`uppercase font-black ${
                        e.type === 'risk' ? 'text-[#FF8F82]' :
                        e.type === 'decision' ? 'text-[#8EDDE2]' :
                        e.type === 'response' ? 'text-[#FF8F82]' : 'text-[#73E2B0]'
                      }`}>{e.type}</span>
                    </div>
                    <p className="text-[#F3FFFA] font-semibold mt-0.5">{e.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE CHUNK (Empty for Canvas visuals) */}
        <div className="lg:col-span-2 pointer-events-none"></div>

        {/* RIGHT COLUMN: Active Status Details */}
        <div className="lg:col-span-1 flex flex-col space-y-4 overflow-hidden pointer-events-auto">
          {/* Live status telemetry block */}
          {animal && animal.status !== 'resolved' && (
            <div className="glass-panel p-4 space-y-3.5">
              <div className="flex justify-between items-center border-b border-[#174A38]/30 pb-2">
                <span className="text-[10px] font-black text-[#73E2B0] uppercase tracking-widest">ACTIVE INTRUDER TELEMETRY</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${getRiskBgClass(animal.riskScore)}`}>
                  {animal.zone} zone
                </span>
              </div>

              {/* Data list */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#A8C8BF] font-bold">Intruding Entity</span>
                  <span className="text-[#F3FFFA] font-black capitalize">{animal.species}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A8C8BF] font-bold">AI YOLO Confidence</span>
                  <span className="text-[#F3FFFA] font-black">{lerpedConf.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A8C8BF] font-bold">Radar Range Distance</span>
                  <span className="text-[#F3FFFA] font-black flex items-center">
                    <Navigation size={12} className="mr-1 text-[#8EDDE2]" />
                    {lerpedDist.toFixed(1)} meters
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A8C8BF] font-bold">Field Breach ETA</span>
                  <span className="text-[#F3FFFA] font-black flex items-center">
                    <Clock size={12} className="mr-1 text-[#8EDDE2]" />
                    {calculateETA()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A8C8BF] font-bold">Threat Evaluation</span>
                  <span className={`font-black ${getRiskColorClass(animal.riskScore)}`}>
                    {lerpedRisk.toFixed(0)}/100
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-[#174A38]/30 pt-2">
                  <span className="text-[#A8C8BF] font-bold">State Engine Phase</span>
                  <span className="text-[#F3FFFA] font-black uppercase tracking-wider">{currentPhase}</span>
                </div>
              </div>

              {/* Recommendation message box */}
              {decisionResult && (
                <div className="bg-[#12372A]/40 border border-[#3FAF7A]/20 rounded-xl p-3 text-[10px] text-[#A8C8BF] space-y-1">
                  <span className="text-[9px] text-[#73E2B0] font-black block uppercase">Decision Logic Action</span>
                  <p className="leading-normal font-semibold text-[#F3FFFA]">{decisionResult.recommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Node Status panel */}
          <div className="glass-panel p-4 space-y-3">
            <span className="text-[10px] font-black text-[#73E2B0] uppercase tracking-widest block border-b border-[#174A38]/30 pb-1.5">HARDWARE OUTPUT ACTUATORS</span>
            
            <div className="space-y-2.5">
              {/* Vision Node */}
              <div className={`flex justify-between items-center text-xs p-2 bg-[#12372A]/30 border rounded-xl transition-all duration-200 ${deviceState.camera ? 'border-[#8EDDE2] shadow-sm shadow-[#8EDDE2]/15 animate-pulse-cyan' : 'border-slate-700/40'}`}>
                <span className="flex items-center text-[#F3FFFA] font-bold">
                  <span className="p-1 bg-[#8EDDE2]/15 text-[#8EDDE2] rounded-md mr-2"><Eye size={12} /></span>
                  Camera Scanner
                </span>
                <span className={`text-[9px] font-extrabold uppercase ${deviceState.camera ? 'text-[#8EDDE2] font-black' : 'text-slate-500'}`}>
                  {deviceState.camera ? '🟢 SCANNING' : '⚪ STANDBY'}
                </span>
              </div>
              
              {/* LED Node */}
              <div className={`flex justify-between items-center text-xs p-2 bg-[#12372A]/30 border rounded-xl transition-all duration-200 ${deviceState.light ? 'border-[#FF8F82] shadow-sm shadow-[#FF8F82]/15' : 'border-slate-700/40'}`}>
                <span className="flex items-center text-[#F3FFFA] font-bold">
                  <span className="p-1 bg-[#FF8F82]/12 text-[#FF8F82] rounded-md mr-2"><Lightbulb size={12} /></span>
                  Strobe LED Matrix
                </span>
                <span className={`text-[9px] font-extrabold uppercase ${deviceState.light ? 'text-[#FF8F82] font-black' : 'text-slate-500'}`}>
                  {deviceState.light ? '⚡ STROBING' : '⚪ STANDBY'}
                </span>
              </div>

              {/* Sound Node */}
              <div className={`flex justify-between items-center text-xs p-2 bg-[#12372A]/30 border rounded-xl transition-all duration-200 ${deviceState.sound ? 'border-[#B7A7E8] shadow-sm shadow-[#B7A7E8]/15' : 'border-slate-700/40'}`}>
                <span className="flex items-center text-[#F3FFFA] font-bold">
                  <span className="p-1 bg-[#B7A7E8]/12 text-[#B7A7E8] rounded-md mr-2"><Volume2 size={12} /></span>
                  Ultrasound Siren
                </span>
                <span className={`text-[9px] font-extrabold uppercase ${deviceState.sound ? 'text-[#B7A7E8] font-black' : 'text-slate-500'}`}>
                  {deviceState.sound ? '🔊 SIREN ACTIVE' : '⚪ STANDBY'}
                </span>
              </div>

              {/* Water Node */}
              <div className={`flex justify-between items-center text-xs p-2 bg-[#12372A]/30 border rounded-xl transition-all duration-200 ${deviceState.water ? 'border-blue-500/40 shadow-sm shadow-blue-500/15' : 'border-slate-700/40'}`}>
                <span className="flex items-center text-[#F3FFFA] font-bold">
                  <span className="p-1 bg-blue-500/10 text-blue-500 rounded-md mr-2"><Droplet size={12} /></span>
                  Sprinkler Spray
                </span>
                <span className={`text-[9px] font-extrabold uppercase ${deviceState.water ? 'text-blue-600 font-black' : 'text-slate-500'}`}>
                  {deviceState.water ? '💧 SPRAYING' : '⚪ STANDBY'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ==============================================
          BOTTOM PANEL: History & Alerts
          ============================================== */}
      <div className="w-full flex justify-between items-end gap-6 pointer-events-auto">
        
        {/* Incident History Log */}
        <div className="glass-panel p-4 w-full md:max-w-xl h-44 overflow-hidden flex flex-col justify-between">
          <span className="text-[10px] font-black text-[#73E2B0] uppercase tracking-widest block mb-2 border-b border-[#174A38]/30 pb-1.5">INCIDENT ARCHIVE HISTORY LOG</span>
          
          <div className="flex-1 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-[10px] text-[#718F89] italic text-center py-6">Incident archive empty. Detections write history records.</p>
            ) : (
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="text-[#A8C8BF] border-b border-slate-700 uppercase font-black">
                    <th className="py-1">Timestamp</th>
                    <th className="py-1">Target species</th>
                    <th className="py-1">AI Conf.</th>
                    <th className="py-1">Peak Threat</th>
                    <th className="py-1">Active Output</th>
                    <th className="py-1 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[#F3FFFA] font-semibold">
                  {history.map((record, index) => (
                    <tr key={index} className="hover:bg-[#12372A]/40">
                      <td className="py-2 text-[#A8C8BF]">{record.timestamp}</td>
                      <td className="py-2 font-black text-[#F3FFFA]">{record.species}</td>
                      <td className="py-2">{record.confidence}%</td>
                      <td className="py-2 text-[#FF8F82] font-black">{record.maxRisk}%</td>
                      <td className="py-2">{record.action || 'None'}</td>
                      <td className="py-2 text-right font-black text-[#3FAF7A]">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 2D Minimap panel component */}
        <MiniMap2D />

        {/* Alert Logs Ticker */}
        <div className="glass-panel p-4 w-72 h-44 overflow-hidden flex flex-col justify-between">
          <span className="text-[10px] font-black text-[#73E2B0] uppercase tracking-widest block mb-2 border-b border-[#174A38]/30 pb-1.5">ALERT INCIDENT STREAM</span>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-[#3FAF7A]">
                <Bell size={18} className="mb-1" />
                <span className="text-[9px] font-black uppercase text-center">No threats active</span>
              </div>
            ) : (
              alerts.map((alert, i) => {
                const isCritical = alert.toLowerCase().includes('critical') || alert.toLowerCase().includes('breach');
                const isWarning = alert.toLowerCase().includes('warning') || alert.toLowerCase().includes('approach');
                const isSafe = alert.toLowerCase().includes('effective') || alert.toLowerCase().includes('resolved') || alert.toLowerCase().includes('clear');
                const isWater = alert.toLowerCase().includes('sprinkler') || alert.toLowerCase().includes('spray');
                
                const barClass = 
                  isCritical ? 'bg-[#FF8F82]/12 border-[#FF8F82]/25 text-[#FF8F82] animate-pulse-red' :
                  isWarning ? 'bg-[#E9B949]/12 border-[#E9B949]/25 text-[#E9B949]' :
                  isSafe ? 'bg-[#3FAF7A]/15 border-[#3FAF7A]/30 text-[#73E2B0] font-black' :
                  isWater ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-[#12372A]/40 border-slate-700/40 text-[#F3FFFA]';

                const iconColor = 
                  isCritical ? 'text-[#FF8F82]' :
                  isWarning ? 'text-amber-500' :
                  isSafe ? 'text-[#73E2B0]' :
                  isWater ? 'text-blue-400' :
                  'text-[#A8C8BF]';

                return (
                  <div key={i} className={`flex items-start space-x-2 p-2.5 rounded-xl border text-[10px] font-bold leading-normal transition-all ${barClass}`}>
                    <ShieldAlert size={14} className={`${iconColor} flex-shrink-0 mt-0.5`} />
                    <span>{alert}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverlay;
