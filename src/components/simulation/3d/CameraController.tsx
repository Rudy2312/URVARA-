import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSimulation } from '../../../simulation/SimulationProvider';
import { Vector3 } from 'three';

export const CameraController: React.FC = () => {
  const { cameraPreset, animal } = useSimulation();
  const { camera } = useThree();

  const targetPos = new Vector3(20, 16, 25);
  const targetLookAt = new Vector3(0, 0, 0);

  useFrame((state) => {
    // Determine camera and lookAt target vector points
    if (cameraPreset === 'detection') {
      if (animal && animal.status !== 'resolved') {
        // Target focus close to the moving animal
        targetPos.set(animal.position.x + 5.5, 4.0, animal.position.z + 5.5);
        targetLookAt.set(animal.position.x, 0.5, animal.position.z);
      } else {
        // Fallback target looking close to the Camera Node Pole at (6, 0, 6)
        targetPos.set(11, 4.5, 11);
        targetLookAt.set(6, 2.3, 6);
      }
    } else if (cameraPreset === 'response') {
      // Focus on active sprinkler pump pole at (6, 0, -6)
      targetPos.set(11, 5.0, -11);
      targetLookAt.set(6, 2.3, -6);
    } else {
      // Default full farm Overview coordinates
      targetPos.set(20, 16, 25);
      targetLookAt.set(0, 0, 0);
    }

    // Lerp camera position
    camera.position.lerp(targetPos, 0.05);

    // Lerp OrbitControls target if mapped in userData
    const controls = state.scene.userData.controls;
    if (controls && controls.target) {
      controls.target.lerp(targetLookAt, 0.05);
      controls.update(); // force update of camera vectors
    } else {
      camera.lookAt(targetLookAt);
    }
  });

  return null;
};

export default CameraController;
