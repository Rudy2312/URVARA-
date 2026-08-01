import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { useSimulation } from '../../../simulation/SimulationProvider';
import FarmEnvironment from './FarmEnvironment';
import Zones from './Zones';
import SmartPole from './SmartPole';
import Animal3D from './Animal3D';
import CameraController from './CameraController';

// Helper component to bind OrbitControls ref to scene.userData for CameraController access
const SceneSetup: React.FC<{ controlsRef: React.RefObject<any> }> = ({ controlsRef }) => {
  const { scene } = useThree();
  useFrame(() => {
    if (controlsRef.current) {
      scene.userData.controls = controlsRef.current;
    }
  });
  return null;
};

export const FarmScene: React.FC = () => {
  const { animal } = useSimulation();
  const controlsRef = useRef<any>(null);

  return (
    <div className="w-full h-full bg-[#B9DFF2]">
      <Canvas
        camera={{ position: [20, 16, 25], fov: 45 }}
        shadows
      >
        {/* Soft natural golden hour sunrise Fog */}
        <fog attach="fog" args={['#B9DFF2', 25, 65]} />

        {/* Golden Hour Sunrise Skybox */}
        <Sky 
          distance={450000} 
          sunPosition={[18, 4.2, 10]} 
          inclination={0.55} 
          azimuth={0.25} 
        />

        {/* Ambient base lighting: soft sky blue glow */}
        <ambientLight intensity={0.55} color="#B9DFF2" />

        {/* Sunrise sunlight Directional light: Warm Golden hour glare */}
        <directionalLight
          position={[18, 7.5, 10]}
          intensity={1.8}
          color="#F7C873"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        {/* Farm Environment meshes */}
        <FarmEnvironment />

        {/* Dynamic Threat Zones */}
        <Zones />

        {/* Four IoT smart poles positioned around crop perimeter */}
        {/* Pole 1: Vision Camera */}
        <SmartPole id="VISION-01" type="camera" position={[6, 0, 6]} />
        {/* Pole 2: LED Strobe */}
        <SmartPole id="LED-01" type="light" position={[-6, 0, 6]} />
        {/* Pole 3: Acoustic Speaker */}
        <SmartPole id="SOUND-01" type="sound" position={[-6, 0, -6]} />
        {/* Pole 4: Hydraulic Sprinkler */}
        <SmartPole id="WATER-01" type="water" position={[6, 0, -6]} />

        {/* Active Animal model */}
        {animal && animal.status !== 'resolved' && (
          <Animal3D data={animal} />
        )}

        {/* Smooth Camera views presets interpolation */}
        <CameraController />
        
        {/* Bind controls ref for tracking */}
        <SceneSetup controlsRef={controlsRef} />

        {/* Controls limits to prevent clipping underneath ground */}
        <OrbitControls 
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.08}
          minDistance={8} 
          maxDistance={60} 
          minPolarAngle={Math.PI / 12} 
          maxPolarAngle={Math.PI / 2.11} 
          enablePan={true}
          enableZoom={true}
        />
      </Canvas>
    </div>
  );
};

export default FarmScene;
