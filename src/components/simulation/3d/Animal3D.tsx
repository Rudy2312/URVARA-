import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Animal as AnimalType } from '../../../types/simulation';
import { useSimulation } from '../../../simulation/SimulationProvider';
import { Vector3 } from 'three';

interface Animal3DProps {
  data: AnimalType;
}

export const Animal3D: React.FC<Animal3DProps> = ({ data }) => {
  const { simulationState, simulationSpeed } = useSimulation();
  
  const animalRef = useRef<any>(null);
  const headRef = useRef<any>(null);
  const tailRef = useRef<any>(null);
  const legLRef = useRef<any>(null);
  const legRRef = useRef<any>(null);
  
  // Keep ref of rotation angle for smooth turn interpolation
  const targetAngle = Math.atan2(data.direction.x, data.direction.z);
  const currentAngleRef = useRef<number>(targetAngle);

  // Proportions and styling settings per species
  const getSpeciesSettings = (species: string) => {
    switch (species) {
      case 'goat':
        return {
          bodyColor: '#d6d3d1', // stone/greyish white fur
          bodySize: [0.45, 0.55, 0.95] as [number, number, number],
          headSize: [0.28, 0.28, 0.35] as [number, number, number],
          height: 0.45,
          legLength: 0.45
        };
      case 'pig':
        return {
          bodyColor: '#5c4d3c', // dark muddy wild pig brown
          bodySize: [0.65, 0.65, 1.1] as [number, number, number],
          headSize: [0.38, 0.38, 0.4] as [number, number, number],
          height: 0.5,
          legLength: 0.3
        };
      case 'buffalo':
        return {
          bodyColor: '#334155', // heavy dark slate gray
          bodySize: [1.0, 1.0, 1.7] as [number, number, number],
          headSize: [0.55, 0.55, 0.65] as [number, number, number],
          height: 0.9,
          legLength: 0.62
        };
      case 'cow':
      default:
        return {
          bodyColor: '#854d0e', // cedar brown base
          bodySize: [0.85, 0.85, 1.5] as [number, number, number],
          headSize: [0.48, 0.48, 0.55] as [number, number, number],
          height: 0.8,
          legLength: 0.6
        };
    }
  };

  const { bodyColor, bodySize, headSize, height, legLength } = getSpeciesSettings(data.species);

  // Process ticks using R3F useFrame
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const speedMult = simulationSpeed || 1;

    // 1. Smooth rotation interpolation (lerping the rotation angle to avoid instant flips)
    let diff = targetAngle - currentAngleRef.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // normalize diff to [-PI, PI]
    currentAngleRef.current += diff * 0.08 * speedMult;

    if (animalRef.current) {
      animalRef.current.rotation.y = currentAngleRef.current + Math.PI;
      
      // 2. Procedural walking body bounce & bobbing
      if (simulationState === 'running' && data.status !== 'resolved') {
        const bounceSpeed = 12 * data.speed * speedMult;
        
        // alternate leg rotations swing
        const swing = Math.sin(elapsed * bounceSpeed) * 0.45;
        if (legLRef.current) legLRef.current.rotation.x = swing;
        if (legRRef.current) legRRef.current.rotation.x = -swing;

        // subtle body height bounce
        const bounce = Math.abs(Math.sin(elapsed * bounceSpeed)) * 0.05;
        animalRef.current.position.y = bounce;

        // subtle head bobbing
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(elapsed * bounceSpeed) * 0.04;
        }

        // subtle tail wagging
        if (tailRef.current) {
          tailRef.current.rotation.z = Math.sin(elapsed * bounceSpeed * 1.3) * 0.25;
        }
      } else {
        // Standby / paused neutral position reset
        if (legLRef.current) legLRef.current.rotation.x = 0;
        if (legRRef.current) legRRef.current.rotation.x = 0;
        animalRef.current.position.y = 0;
        if (headRef.current) headRef.current.rotation.x = 0.05;
        if (tailRef.current) tailRef.current.rotation.z = 0;
      }
    }
  });

  const getStatusLabelText = () => {
    if (data.status === 'resolved') return '🟢 SAFE';
    if (data.status === 'retreating') return '🟢 RETREATING';
    if (data.status === 'detected') {
      if (data.riskScore >= 75) return '🔴 HIGH RISK';
      return `🟡 DETECTED (${data.confidence}%)`;
    }
    return '⚪ MONITORING';
  };

  return (
    <group position={[data.position.x, 0, data.position.z]}>
      {/* Root reference group for smoother procedural rotations */}
      <group ref={animalRef}>
        
        {/* 1. Interactive HUD HTML Label directly on the animal */}
        <Html distanceFactor={14} position={[0, height + legLength + 0.8, 0]} center>
          <div className="glass-panel p-2.5 rounded-xl text-[10px] whitespace-nowrap space-y-1.5 shadow-xl select-none">
            <div className="flex justify-between items-center space-x-4 border-b border-farm-darkgreen/15 pb-1">
              <span className="font-black text-farm-darkgreen text-[11px] uppercase tracking-wider">
                {data.species === 'cow' ? '🐄 COW-01' : data.species === 'goat' ? '🐐 GOAT-01' : data.species === 'pig' ? '🐖 WILD PIG' : '🐃 BUFFALO-01'}
              </span>
              <span className="text-[9px] font-black">{getStatusLabelText()}</span>
            </div>
            <div className="flex justify-between space-x-4 text-[9px]">
              <span className="text-[#4F8A3D] font-bold">Threat Risk:</span>
              <span className={`font-black ${data.riskScore >= 75 ? 'text-farm-critical' : data.riskScore >= 45 ? 'text-[#E9B949]' : 'text-farm-safe'}`}>
                {data.riskScore}/100
              </span>
            </div>
            <div className="flex justify-between space-x-4 text-[9px]">
              <span className="text-[#4F8A3D] font-bold">Radar Dist:</span>
              <span className="font-extrabold text-farm-darkgreen">{data.distance.toFixed(1)}m</span>
            </div>
          </div>
        </Html>

        {/* ==============================================
            YOLO Bounding Box (cyan/red scanning wireframes)
            ============================================== */}
        {(data.status === 'detected' || data.zone === 'warning' || data.zone === 'protected') && (
          <mesh position={[0, height / 2 + legLength, 0]}>
            <boxGeometry args={[bodySize[0] * 1.4, bodySize[1] * 1.6, bodySize[2] * 1.3]} />
            <meshBasicMaterial 
              color={data.zone === 'protected' ? '#D95C4A' : '#62C6C9'} 
              wireframe 
              transparent 
              opacity={0.65} 
            />
          </mesh>
        )}

        {/* ==============================================
            Low Poly Realistic Animal Body construction
            ============================================== */}
        <group position={[0, legLength, 0]}>
          
          {/* Torso body */}
          <mesh position={[0, height / 2, 0]} castShadow>
            <boxGeometry args={bodySize} />
            <meshStandardMaterial color={bodyColor} roughness={0.8} metalness={0.05} />
          </mesh>

          {/* Cow spots detail layers */}
          {data.species === 'cow' && (
            <group position={[0, height / 2, 0]}>
              <mesh position={[bodySize[0] / 2 + 0.015, 0.1, 0.2]}>
                <boxGeometry args={[0.01, 0.35, 0.4]} />
                <meshStandardMaterial color="#f4f4f5" roughness={0.8} />
              </mesh>
              <mesh position={[-bodySize[0] / 2 - 0.015, -0.05, -0.3]}>
                <boxGeometry args={[0.01, 0.3, 0.35]} />
                <meshStandardMaterial color="#f4f4f5" roughness={0.8} />
              </mesh>
            </group>
          )}

          {/* Head & Neck connector */}
          <group ref={headRef} position={[0, height * 0.9, bodySize[2] / 2 - 0.08]}>
            <mesh castShadow>
              <boxGeometry args={headSize} />
              <meshStandardMaterial color={bodyColor} roughness={0.8} />
            </mesh>

            {/* Snout with details */}
            <mesh position={[0, -0.1, headSize[2] / 2 + 0.1]} castShadow>
              <boxGeometry args={[headSize[0] * 0.72, headSize[1] * 0.58, 0.24]} />
              <meshStandardMaterial color={data.species === 'pig' ? '#fda4af' : '#27272a'} />
            </mesh>

            {/* Ears */}
            <mesh position={[-headSize[0] / 2 - 0.06, 0.1, -0.08]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.06, 0.12, 0.08]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[headSize[0] / 2 + 0.06, 0.1, -0.08]} rotation={[0, 0, Math.PI / 6]}>
              <boxGeometry args={[0.06, 0.12, 0.08]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>

            {/* Horns for Cow / Buffalo */}
            {data.species === 'cow' && (
              <group position={[0, headSize[1] / 2 + 0.08, -0.1]}>
                <mesh position={[-headSize[0] / 3, 0.1, 0]} rotation={[0, 0, -Math.PI / 5]}>
                  <cylinderGeometry args={[0.018, 0.038, 0.32, 5]} />
                  <meshStandardMaterial color="#f4f4f5" />
                </mesh>
                <mesh position={[headSize[0] / 3, 0.1, 0]} rotation={[0, 0, Math.PI / 5]}>
                  <cylinderGeometry args={[0.018, 0.038, 0.32, 5]} />
                  <meshStandardMaterial color="#f4f4f5" />
                </mesh>
              </group>
            )}

            {/* Buffalo Curved Horns */}
            {data.species === 'buffalo' && (
              <group position={[0, headSize[1] / 2 + 0.08, -0.1]}>
                <mesh position={[-headSize[0] / 2.5, 0.15, -0.05]} rotation={[0, -Math.PI / 6, -Math.PI / 3]}>
                  <cylinderGeometry args={[0.03, 0.06, 0.52, 6]} />
                  <meshStandardMaterial color="#18181b" />
                </mesh>
                <mesh position={[headSize[0] / 2.5, 0.15, -0.05]} rotation={[0, Math.PI / 6, Math.PI / 3]}>
                  <cylinderGeometry args={[0.03, 0.06, 0.52, 6]} />
                  <meshStandardMaterial color="#18181b" />
                </mesh>
              </group>
            )}

            {/* Goat Horns & Beard */}
            {data.species === 'goat' && (
              <group>
                <group position={[0, headSize[1] / 2 + 0.06, -0.08]}>
                  <mesh position={[-headSize[0] / 4, 0.1, 0]} rotation={[Math.PI / 8, 0, -Math.PI / 10]}>
                    <coneGeometry args={[0.025, 0.22, 5]} />
                    <meshStandardMaterial color="#27272a" />
                  </mesh>
                  <mesh position={[headSize[0] / 4, 0.1, 0]} rotation={[Math.PI / 8, 0, Math.PI / 10]}>
                    <coneGeometry args={[0.025, 0.22, 5]} />
                    <meshStandardMaterial color="#27272a" />
                  </mesh>
                </group>
                {/* Beard */}
                <mesh position={[0, -headSize[1] / 2 - 0.06, 0.04]}>
                  <boxGeometry args={[0.08, 0.14, 0.04]} />
                  <meshStandardMaterial color="#f4f4f5" />
                </mesh>
              </group>
            )}

            {/* Wild Pig Tusks */}
            {data.species === 'pig' && (
              <group position={[0, -0.08, headSize[2] / 2 + 0.06]}>
                <mesh position={[-headSize[0] / 2.2, 0, 0]} rotation={[0.2, 0, -0.3]}>
                  <boxGeometry args={[0.04, 0.08, 0.04]} />
                  <meshStandardMaterial color="#f4f4f5" />
                </mesh>
                <mesh position={[headSize[0] / 2.2, 0, 0]} rotation={[0.2, 0, 0.3]}>
                  <boxGeometry args={[0.04, 0.08, 0.04]} />
                  <meshStandardMaterial color="#f4f4f5" />
                </mesh>
              </group>
            )}
          </group>

          {/* Tail */}
          <mesh ref={tailRef} position={[0, height - 0.1, -bodySize[2] / 2 + 0.04]} rotation={[-Math.PI / 8, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, height * 0.8, 4]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>

          {/* Alternate leg groups */}
          <group ref={legLRef}>
            {/* Front Left */}
            <mesh position={[-bodySize[0] / 3.4, -legLength / 2, bodySize[2] / 3.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, legLength, 5]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            {/* Back Right */}
            <mesh position={[bodySize[0] / 3.4, -legLength / 2, -bodySize[2] / 3.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, legLength, 5]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
          </group>

          <group ref={legRRef}>
            {/* Front Right */}
            <mesh position={[bodySize[0] / 3.4, -legLength / 2, bodySize[2] / 3.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, legLength, 5]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            {/* Back Left */}
            <mesh position={[-bodySize[0] / 3.4, -legLength / 2, -bodySize[2] / 3.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, legLength, 5]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
          </group>

        </group>
      </group>
    </group>
  );
};

export default Animal3D;
