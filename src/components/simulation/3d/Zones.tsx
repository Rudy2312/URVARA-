import React from 'react';
import { DoubleSide } from 'three';
import { useSimulation } from '../../../simulation/SimulationProvider';

export const Zones: React.FC = () => {
  const { animal } = useSimulation();

  const isProtectedActive = animal && animal.zone === 'protected' && animal.status !== 'resolved';
  const isWarningActive = animal && animal.zone === 'warning' && animal.status !== 'resolved';
  const isSafeActive = animal && animal.zone === 'safe' && animal.status !== 'resolved';

  return (
    <group>
      {/* 1. Protected Crop Zone (RED boundary at radius = 6) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[5.8, 6.0, 64]} />
        <meshBasicMaterial 
          color="#EF5B5B" 
          side={DoubleSide} 
          transparent 
          opacity={isProtectedActive ? 0.9 : 0.45} 
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[5.8, 64]} />
        <meshBasicMaterial 
          color="#EF5B5B" 
          transparent 
          opacity={isProtectedActive ? 0.22 : 0.04} 
        />
      </mesh>

      {/* 2. Warning Zone (YELLOW boundary at radius = 15) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[14.7, 15.0, 64]} />
        <meshBasicMaterial 
          color="#F4C95D" 
          side={DoubleSide} 
          transparent 
          opacity={isWarningActive ? 0.85 : 0.35} 
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[6.0, 14.7, 64]} />
        <meshBasicMaterial 
          color="#F4C95D" 
          transparent 
          opacity={isWarningActive ? 0.12 : 0.02} 
        />
      </mesh>

      {/* 3. Monitoring Zone Boundary (Outer perimeter ring at radius = 22) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[21.8, 22.0, 64]} />
        <meshBasicMaterial 
          color="#42C77A" 
          side={DoubleSide} 
          transparent 
          opacity={isSafeActive ? 0.75 : 0.25} 
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[15.0, 21.8, 64]} />
        <meshBasicMaterial 
          color="#42C77A" 
          transparent 
          opacity={isSafeActive ? 0.08 : 0.01} 
        />
      </mesh>

      {/* Futuristic Grid boundary ticks */}
      <gridHelper args={[44, 22, '#1a3d24', '#0d1e12']} position={[0, 0.005, 0]} />
    </group>
  );
};

export default Zones;
