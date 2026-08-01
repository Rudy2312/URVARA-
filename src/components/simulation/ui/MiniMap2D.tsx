import React from 'react';
import { useSimulation } from '../../../simulation/SimulationProvider';

export const MiniMap2D: React.FC = () => {
  const { animal } = useSimulation();

  // Map 3D coordinates [-25, 25] to [0, 100] SVG coordinates.
  // Center is (0,0) -> SVG (50, 50)
  const mapCoords = (x: number, z: number) => {
    return {
      x: 50 + x * 1.8,
      y: 50 + z * 1.8
    };
  };

  const animalPos = animal && animal.status !== 'resolved'
    ? mapCoords(animal.position.x, animal.position.z)
    : null;

  return (
    <div className="glass-panel p-3 w-40 h-40 flex flex-col items-center justify-between pointer-events-auto bg-white/70">
      <span className="text-[9px] font-black text-[#12372A] uppercase tracking-wider block mb-1">Field 2D Minimap</span>
      
      <div className="w-24 h-24 bg-[#F5F8F7]/65 rounded-full border border-[#174A38]/12 relative overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full select-none">
          {/* Geofence circular rings */}
          {/* Safe boundary (green) */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#3FAF7A" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.5" />
          {/* Warning boundary (yellow) */}
          <circle cx="50" cy="50" r="27" fill="none" stroke="#E9B949" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6" />
          {/* Crop boundary (red) */}
          <circle cx="50" cy="50" r="11" fill="rgba(255, 143, 130, 0.05)" stroke="#FF8F82" strokeWidth="0.85" />

          {/* IoT Nodes coordinates: */}
          {/* Vision camera (6, 6) -> SVG (61, 61) */}
          <circle cx="61" cy="61" r="2.2" fill="#8EDDE2" />
          {/* LED Strobe (-6, 6) -> SVG (39, 61) */}
          <circle cx="39" cy="61" r="2.2" fill="#E9B949" />
          {/* Speaker sound (-6, -6) -> SVG (39, 39) */}
          <circle cx="39" cy="39" r="2.2" fill="#B7A7E8" />
          {/* Water sprinkler (6, -6) -> SVG (61, 39) */}
          <circle cx="61" cy="39" r="2.2" fill="#3B82F6" />

          {/* Center crop field dot */}
          <circle cx="50" cy="50" r="1.5" fill="#78A94B" />

          {/* Active animal marker dot */}
          {animalPos && (
            <g>
              <circle cx={animalPos.x} cy={animalPos.y} r="5" fill="none" stroke="#FF8F82" strokeWidth="0.6" className="animate-ping" />
              <circle cx={animalPos.x} cy={animalPos.y} r="2.8" fill="#FF8F82" />
            </g>
          )}
        </svg>
      </div>
      <span className="text-[7px] text-[#678078] font-bold block text-center uppercase tracking-wide">Scale: 1 Ring = 6m</span>
    </div>
  );
};

export default MiniMap2D;
