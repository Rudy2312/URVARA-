import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSimulation } from '../../../simulation/SimulationProvider';
import { Vector3, DoubleSide } from 'three';

interface SmartPoleProps {
  id: string;
  type: 'camera' | 'light' | 'sound' | 'water';
  position: [number, number, number];
}

export const SmartPole: React.FC<SmartPoleProps> = ({ id, type, position }) => {
  const { deviceState, animal, simulationSpeed } = useSimulation();

  const cameraHeadRef = useRef<any>(null);
  const speakerMeshRef = useRef<any>(null);
  const soundWave1Ref = useRef<any>(null);
  const soundWave2Ref = useRef<any>(null);
  const soundWave3Ref = useRef<any>(null);
  const waterParticlesRef = useRef<any>(null);

  // Smooth visual state transition reference
  const lerpActiveRef = useRef<number>(0);

  // Check if this device is active from unified state
  const isActive = 
    (type === 'camera' && deviceState.camera) ||
    (type === 'light' && deviceState.light) ||
    (type === 'sound' && deviceState.sound) ||
    (type === 'water' && deviceState.water);

  // Dynamic light flashing rates based on risk score
  const getLightPulseRate = () => {
    if (!animal) return 8;
    if (animal.riskScore >= 81) return 25; // Rapid flash
    if (animal.riskScore >= 61) return 15; // Moderate flash
    return 8; // Slow pulse
  };

  // Animation ticks using R3F useFrame loop
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const speedMultiplier = simulationSpeed || 1;

    // Smoothly lerp device active progress
    const targetVal = isActive ? 1.0 : 0.0;
    lerpActiveRef.current += (targetVal - lerpActiveRef.current) * 0.12 * speedMultiplier;
    const currentLerp = Math.max(0, Math.min(1, lerpActiveRef.current));

    // 1. Camera Node scanning & targeting rotation
    if (type === 'camera' && cameraHeadRef.current) {
      if (currentLerp > 0.01 && animal && animal.status !== 'resolved') {
        // Point camera directly towards animal coordinates
        const animalVec = new Vector3(animal.position.x, 0.5, animal.position.z);
        const poleVec = new Vector3(position[0], 2.4, position[2]);
        const lookDir = new Vector3().subVectors(animalVec, poleVec).normalize();
        
        // Compute lookAt rotation target
        const targetAngle = Math.atan2(lookDir.x, lookDir.z);
        
        // Smoothly rotate head towards target
        let diff = targetAngle - cameraHeadRef.current.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        cameraHeadRef.current.rotation.y += diff * 0.1 * speedMultiplier;
        cameraHeadRef.current.rotation.x += (0.25 - cameraHeadRef.current.rotation.x) * 0.1 * speedMultiplier;
      } else {
        // Standby scan sweep between -30 and +30 degrees
        cameraHeadRef.current.rotation.y = Math.sin(elapsed * 0.5 * speedMultiplier) * 0.6;
        cameraHeadRef.current.rotation.x += (-0.1 - cameraHeadRef.current.rotation.x) * 0.1 * speedMultiplier;
      }
    }

    // 2. Speaker Node megaphone scale pulse when sounding
    if (type === 'sound' && speakerMeshRef.current) {
      const pulse = 1.0 + currentLerp * Math.sin(elapsed * 25 * speedMultiplier) * 0.12;
      speakerMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    // 3. Sound rings concentric waves expansion
    if (type === 'sound' && (isActive || currentLerp > 0.01)) {
      const rate = 2.2 * speedMultiplier;
      if (soundWave1Ref.current) {
        const scale1 = (elapsed * rate) % 4.5;
        soundWave1Ref.current.scale.set(scale1, scale1, scale1);
        soundWave1Ref.current.material.opacity = currentLerp * Math.max(0, 1 - scale1 / 4.5) * 0.6;
      }
      if (soundWave2Ref.current) {
        const scale2 = ((elapsed * rate) + 1.5) % 4.5;
        soundWave2Ref.current.scale.set(scale2, scale2, scale2);
        soundWave2Ref.current.material.opacity = currentLerp * Math.max(0, 1 - scale2 / 4.5) * 0.6;
      }
      if (soundWave3Ref.current) {
        const scale3 = ((elapsed * rate) + 3.0) % 4.5;
        soundWave3Ref.current.scale.set(scale3, scale3, scale3);
        soundWave3Ref.current.material.opacity = currentLerp * Math.max(0, 1 - scale3 / 4.5) * 0.6;
      }
    }

    // 4. Sprinkler spray arcs parabolic trajectories simulation
    if (type === 'water' && (isActive || currentLerp > 0.01) && waterParticlesRef.current) {
      const children = waterParticlesRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        
        // Staggered particle paths
        const progress = (elapsed * 3.5 * speedMultiplier + i * 0.12) % 1.0;
        
        // Spread angle outwards from nozzle pointing towards crops center
        const baseAngle = 3 * Math.PI / 4;
        const angle = baseAngle - Math.PI / 5 + (i / children.length) * (2 * Math.PI / 5);
        
        const horizDist = progress * 4.8;
        child.position.x = Math.sin(angle) * horizDist;
        // Parabolic rise and fall
        child.position.y = 2.4 + progress * 0.8 - progress * progress * 2.3;
        child.position.z = Math.cos(angle) * horizDist;
        
        // scale and fade particle down as it nears the ground and based on lerped activation
        child.scale.setScalar(currentLerp * Math.max(0.01, 0.15 * (1.0 - progress)));
        if (child.material) {
          child.material.opacity = currentLerp * 0.65;
        }
      }
    }
  });

  // Calculate dynamic LED spot flashing value
  const [elapsedVal, setElapsedVal] = React.useState(0);
  useFrame((state) => {
    setElapsedVal(state.clock.getElapsedTime());
  });
  
  const pulseRate = getLightPulseRate();
  const speedMult = simulationSpeed || 1;
  
  // Smoothly scale flash intensity with our lerped active value
  const currentLerpedActive = lerpActiveRef.current;
  const flashIntensity = (isActive || currentLerpedActive > 0.01) ? ((0.35 + Math.sin(elapsedVal * pulseRate * speedMult) * 0.65) * currentLerpedActive) : 0;

  return (
    <group position={position}>
      {/* 1. Pole structure */}
      {/* Foundation Base mount bracket */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.1, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Support bolts */}
      <mesh position={[0.15, 0.12, 0.15]}>
        <boxGeometry args={[0.04, 0.08, 0.04]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} />
      </mesh>
      <mesh position={[-0.15, 0.12, -0.15]}>
        <boxGeometry args={[0.04, 0.08, 0.04]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} />
      </mesh>

      {/* Main vertical cylinder pole */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 2.4, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* IoT Device Box Housing mounted at top */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[0.42, 0.38, 0.42]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mounting bracket collar */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.08, 8]} />
        <meshStandardMaterial color="#111827" metalness={0.8} />
      </mesh>

      {/* Floating Status indicator LED (Blinking Cyan on standby, Blinking Red when active) */}
      <mesh position={[0, 2.61, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={isActive ? '#EF5B5B' : '#65D9E8'} />
      </mesh>

      {/* Drei HTML floating HUD badge directly above the device */}
      {isActive && (
        <Html position={[0, 3.2, 0]} distanceFactor={14} center>
          <div className={`px-2.5 py-1 rounded-xl text-[8px] font-black text-white whitespace-nowrap shadow-2xl flex items-center space-x-1.5 border backdrop-blur-sm animate-bounce ${
            type === 'camera' ? 'bg-[#8EDDE2]/20 border-[#8EDDE2] text-[#8EDDE2]' :
            type === 'light' ? 'bg-[#FF8F82]/20 border-[#FF8F82] text-[#FF8F82]' :
            type === 'sound' ? 'bg-[#B7A7E8]/20 border-[#B7A7E8] text-[#B7A7E8]' :
            'bg-blue-500/20 border-blue-400 text-blue-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
              type === 'camera' ? 'bg-[#8EDDE2]' :
              type === 'light' ? 'bg-[#FF8F82]' :
              type === 'sound' ? 'bg-[#B7A7E8]' :
              'bg-blue-400'
            }`}></span>
            <span>{type === 'camera' ? '📷 VISION SCANNING' : type === 'light' ? '💡 LED STROBE ACTIVE' : type === 'sound' ? '🔊 SIREN SOUND ACTIVE' : '💧 WATER SPRAY ACTIVE'}</span>
          </div>
        </Html>
      )}

      {/* ==============================================
          1. CAMERA NODE (VISION): Rotating surveillance head
          ============================================== */}
      {type === 'camera' && (
        <group>
          {/* U-shape mounting bracket */}
          <mesh position={[0, 2.4, 0.23]}>
            <boxGeometry args={[0.15, 0.12, 0.1]} />
            <meshStandardMaterial color="#374151" />
          </mesh>

          {/* Rotating camera assembly */}
          <group ref={cameraHeadRef} position={[0, 2.4, 0.25]}>
            {/* Main camera capsule housing */}
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.32, 10]} />
              <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Front optic lens frame */}
            <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
              <meshStandardMaterial color="#374151" metalness={0.9} />
            </mesh>
            
            {/* Glowing lens dot */}
            <mesh position={[0, 0, 0.185]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 16]} />
              <meshBasicMaterial color={isActive ? '#EF5B5B' : '#65D9E8'} />
            </mesh>

            {/* Glowing Scan beam light cone (Smoothly scaling and fading in/out) */}
            <mesh position={[0, 0, 2.6]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.8 + currentLerpedActive * (animal ? 1.0 : 0.0), 5.0, 16, 1, true]} />
              <meshBasicMaterial 
                color={isActive && animal ? '#EF5B5B' : '#65D9E8'} 
                transparent 
                opacity={0.05 + currentLerpedActive * 0.17} 
                side={DoubleSide} 
                depthWrite={false} 
              />
            </mesh>
          </group>
        </group>
      )}

      {/* ==============================================
          2. LIGHT NODE: Real ground illuminating spotlights
          ============================================== */}
      {type === 'light' && (
        <group>
          {/* LED Strobe Array box mount */}
          <mesh position={[0, 2.4, 0.23]} rotation={[Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[0.34, 0.18, 0.1]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          
          {/* Reflective silver plate */}
          <mesh position={[0, 2.38, 0.26]} rotation={[Math.PI / 6, 0, 0]}>
            <planeGeometry args={[0.3, 0.14]} />
            <meshStandardMaterial color="#e5e7eb" metalness={1.0} roughness={0.1} />
          </mesh>

          {/* Strobe bulb bulbs */}
          <mesh position={[-0.08, 2.36, 0.28]} rotation={[Math.PI / 6, 0, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={isActive ? (flashIntensity > 0.5 ? '#ffffff' : '#4a3f10') : '#374151'} />
          </mesh>
          <mesh position={[0.08, 2.36, 0.28]} rotation={[Math.PI / 6, 0, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={isActive ? (flashIntensity > 0.5 ? '#ffffff' : '#4a3f10') : '#374151'} />
          </mesh>

          {/* Dynamic 3D lighting + spotlight visual cone */}
          {(isActive || currentLerpedActive > 0.01) && (
            <group>
              {/* PointLight that physically reflects on the 3D meshes */}
              <pointLight
                position={[0, 2.2, 0.35]}
                intensity={flashIntensity * 7.5}
                distance={20}
                color="#FFD27A"
                castShadow
              />
              
              {/* Spotlight translucent cone */}
              <mesh position={[0, 1.1, 1.2]} rotation={[Math.PI / 3, 0, 0]}>
                <coneGeometry args={[1.8, 3.4, 16, 1, true]} />
                <meshBasicMaterial 
                  color="#FFD27A" 
                  transparent 
                  opacity={flashIntensity * 0.2} 
                  side={DoubleSide} 
                  depthWrite={false} 
                />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* ==============================================
          3. SOUND NODE: Megaphone speaker and concentric waves
          ============================================== */}
      {type === 'sound' && (
        <group>
          {/* Swiveling mounting joint */}
          <mesh position={[0, 2.4, 0.21]}>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
            <meshStandardMaterial color="#4b5563" />
          </mesh>

          {/* Megaphone speaker horn shape */}
          <group ref={speakerMeshRef} position={[0, 2.4, 0.28]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.08, 0.32, 12]} />
              <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Inner red speaker driver ring */}
            <mesh position={[0, 0, 0.145]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 12]} />
              <meshStandardMaterial color="#EF5B5B" roughness={0.6} />
            </mesh>
            
            {/* Visual waveform symbol inside the horn */}
            {isActive && (
              <Html position={[0, 0, 0.25]} center distanceFactor={14}>
                <div className="text-farm-critical text-[10px] font-black tracking-widest animate-pulse whitespace-nowrap">
                  ))) 🔊 (((
                </div>
              </Html>
            )}
          </group>

          {/* Expanding translucent sound-wave rings */}
          {(isActive || currentLerpedActive > 0.01) && (
            <group position={[0, 2.4, 0.45]}>
              <mesh ref={soundWave1Ref} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 32]} />
                <meshBasicMaterial color="#EF5B5B" side={DoubleSide} transparent opacity={0.6 * currentLerpedActive} depthWrite={false} />
              </mesh>
              <mesh ref={soundWave2Ref} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 32]} />
                <meshBasicMaterial color="#EF5B5B" side={DoubleSide} transparent opacity={0.6 * currentLerpedActive} depthWrite={false} />
              </mesh>
              <mesh ref={soundWave3Ref} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.15, 32]} />
                <meshBasicMaterial color="#EF5B5B" side={DoubleSide} transparent opacity={0.6 * currentLerpedActive} depthWrite={false} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* ==============================================
          4. WATER NODE: Sprinkler nozzle and curved droplet paths
          ============================================== */}
      {type === 'water' && (
        <group>
          {/* Hydraulic piping tube */}
          <mesh position={[0, 2.38, 0.22]}>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
            <meshStandardMaterial color="#4b5563" metalness={0.8} />
          </mesh>
          
          {/* Spray nozzle block */}
          <mesh position={[0, 2.47, 0.24]} rotation={[Math.PI / 6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.03, 0.14, 8]} />
            <meshStandardMaterial color="#111827" metalness={0.9} />
          </mesh>

          {/* Multiple physical water spray particles */}
          {(isActive || currentLerpedActive > 0.01) && (
            <group ref={waterParticlesRef} position={[0, 2.5, 0.28]}>
              {Array.from({ length: 18 }).map((_, i) => (
                <mesh key={i}>
                  <sphereGeometry args={[0.06, 6, 6]} />
                  <meshBasicMaterial color="#65D9E8" transparent opacity={0.65 * currentLerpedActive} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}
    </group>
  );
};

export default SmartPole;
