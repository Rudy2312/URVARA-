import React from 'react';
import { DoubleSide } from 'three';

export const FarmEnvironment: React.FC = () => {
  // Generate coordinates for crops inside crop boundary (radius < 5.8)
  const crops: [number, number][] = [];
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const x = col * 1.2;
      const z = row * 1.2;
      if (x * x + z * z < 25) {
        crops.push([x, z]);
      }
    }
  }

  // Generate coordinate lists for trees
  const trees: [number, number, number][] = [
    [-13, 0.02, -10],
    [-16, 0.02, -5],
    [-10, 0.02, -16],
    [11, 0.02, -14],
    [14, 0.02, -7],
    [-12, 0.02, 12],
    [-7, 0.02, 16],
    [15, 0.02, 11]
  ];

  return (
    <group>
      {/* 1. Muted Green Grass Ground Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[65, 65]} />
        <meshStandardMaterial color="#2d4f33" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* 2. Diverse crop varieties field grid */}
      <group>
        {crops.map(([cx, cz], i) => (
          <group key={`crop-${i}`} position={[cx, 0, cz]}>
            {/* Dark rich organic soil patch */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <circleGeometry args={[0.34, 8]} />
              <meshStandardMaterial color="#3d2a25" roughness={1.0} />
            </mesh>

            {/* Stem */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.03, 0.4, 5]} />
              <meshStandardMaterial color="#1e4620" roughness={0.9} />
            </mesh>

            {/* Diverse vegetable crop meshes */}
            {i % 3 === 0 ? (
              // Cabbages: Muted green sphere layers
              <mesh position={[0, 0.35, 0]} castShadow>
                <sphereGeometry args={[0.18, 6, 6]} />
                <meshStandardMaterial color="#40916c" roughness={0.8} />
              </mesh>
            ) : i % 3 === 1 ? (
              // Corn Stalk: Tall cylinder with yellow husk tip
              <group position={[0, 0.4, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.05, 0.05, 0.38, 5]} />
                  <meshStandardMaterial color="#d9a016" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.18, 0]}>
                  <sphereGeometry args={[0.08, 4, 4]} />
                  <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
                </mesh>
              </group>
            ) : (
              // Tomato Bush: Leafy crown with bright red spheres
              <group position={[0, 0.35, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.14, 5, 5]} />
                  <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
                </mesh>
                <mesh position={[0.08, 0.05, 0.08]} castShadow>
                  <sphereGeometry args={[0.06, 4, 4]} />
                  <meshStandardMaterial color="#ef233c" roughness={0.5} />
                </mesh>
                <mesh position={[-0.08, -0.05, -0.08]} castShadow>
                  <sphereGeometry args={[0.05, 4, 4]} />
                  <meshStandardMaterial color="#ef233c" roughness={0.5} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>

      {/* 3. Modern Agricultural Barn House near (-11, 0, -11) */}
      <group position={[-11, 0, -11]} rotation={[0, Math.PI / 4, 0]}>
        {/* Main Walls: Contemporary dark wood composite */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.4, 4.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.15} />
        </mesh>
        
        {/* Roof: Slate metal panels */}
        <mesh position={[0, 2.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[3.0, 1.6, 4]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Barn Door: Cedar Wood Planks */}
        <mesh position={[0, 0.7, 2.21]} castShadow>
          <boxGeometry args={[1.4, 1.4, 0.06]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} />
        </mesh>

        {/* Window: Glowing Warm Interior Light */}
        <mesh position={[1.61, 1.3, 0]}>
          <boxGeometry args={[0.05, 0.7, 1.1]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* 4. Layered Low-Poly Trees (Mix of Pine & Deciduous) */}
      <group>
        {trees.map(([tx, ty, tz], i) => (
          <group key={`tree-${i}`} position={[tx, ty, tz]}>
            {i % 2 === 0 ? (
              // Pine Tree: Layered dark green cones
              <group>
                <mesh position={[0, 0.8, 0]} castShadow>
                  <cylinderGeometry args={[0.11, 0.18, 1.6, 5]} />
                  <meshStandardMaterial color="#4b3525" roughness={0.95} />
                </mesh>
                <mesh position={[0, 2.0, 0]} castShadow>
                  <coneGeometry args={[1.1, 1.5, 5]} />
                  <meshStandardMaterial color="#1e3f24" roughness={0.9} flatShading />
                </mesh>
                <mesh position={[0, 2.8, 0]} castShadow>
                  <coneGeometry args={[0.8, 1.2, 5]} />
                  <meshStandardMaterial color="#2d5e37" roughness={0.85} flatShading />
                </mesh>
              </group>
            ) : (
              // Oak Tree: Overlapping organic spheres
              <group>
                <mesh position={[0, 0.9, 0]} castShadow>
                  <cylinderGeometry args={[0.14, 0.22, 1.8, 5]} />
                  <meshStandardMaterial color="#4b3525" roughness={0.95} />
                </mesh>
                <mesh position={[0, 2.2, 0]} castShadow>
                  <sphereGeometry args={[0.95, 6, 6]} />
                  <meshStandardMaterial color="#1e4620" roughness={0.8} flatShading />
                </mesh>
                <mesh position={[0.4, 2.5, 0.2]} castShadow>
                  <sphereGeometry args={[0.65, 5, 5]} />
                  <meshStandardMaterial color="#2d6a4f" roughness={0.7} flatShading />
                </mesh>
                <mesh position={[-0.4, 2.4, -0.2]} castShadow>
                  <sphereGeometry args={[0.6, 5, 5]} />
                  <meshStandardMaterial color="#2d6a4f" roughness={0.7} flatShading />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>

      {/* 5. Translucent Winding Sand Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.8, 32]} />
        <meshStandardMaterial color="#d7ccc8" opacity={0.18} transparent side={DoubleSide} />
      </mesh>

      {/* 6. Premium Timber Boundary Fences */}
      <group>
        {/* Front Rail (Z = 6) */}
        <mesh position={[0, 0.4, 6]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.8, 6]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>

        {/* Back Rail (Z = -6) */}
        <mesh position={[0, 0.4, -6]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.8, -6]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>

        {/* Left Rail (X = -6) */}
        <mesh position={[-6, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>
        <mesh position={[-6, 0.8, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>

        {/* Right Rail (X = 6) */}
        <mesh position={[6, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>
        <mesh position={[6, 0.8, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[11.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#402e2b" roughness={0.9} />
        </mesh>
      </group>

      {/* 7. Low-Poly Distant Ridge Mountains (Soft atmospheric color backdrop) */}
      <group position={[0, -0.2, -34]}>
        <mesh position={[-18, 3, 0]} castShadow>
          <coneGeometry args={[13, 11, 4]} />
          <meshStandardMaterial color="#1a2d21" roughness={0.95} flatShading />
        </mesh>
        <mesh position={[0, 5, -2]} castShadow>
          <coneGeometry args={[17, 15, 4]} />
          <meshStandardMaterial color="#14241a" roughness={0.95} flatShading />
        </mesh>
        <mesh position={[18, 3.2, 0]} castShadow>
          <coneGeometry args={[12, 10, 4]} />
          <meshStandardMaterial color="#1a2e22" roughness={0.95} flatShading />
        </mesh>
      </group>

      {/* 8. Floating Low-Poly Fluffy Clouds */}
      <group position={[0, 13.5, 0]}>
        <group position={[-14, 0, -8]}>
          <mesh castShadow>
            <sphereGeometry args={[1.5, 6, 6]} />
            <meshStandardMaterial color="#e2f1f7" opacity={0.9} transparent flatShading />
          </mesh>
          <mesh position={[1.1, 0, 0]}>
            <sphereGeometry args={[1.0, 5, 5]} />
            <meshStandardMaterial color="#e2f1f7" opacity={0.9} transparent flatShading />
          </mesh>
          <mesh position={[-0.9, 0.1, 0.2]}>
            <sphereGeometry args={[1.1, 5, 5]} />
            <meshStandardMaterial color="#e2f1f7" opacity={0.9} transparent flatShading />
          </mesh>
        </group>
        <group position={[16, 0.8, 11]}>
          <mesh castShadow>
            <sphereGeometry args={[1.9, 6, 6]} />
            <meshStandardMaterial color="#e2f1f7" opacity={0.9} transparent flatShading />
          </mesh>
          <mesh position={[1.4, -0.2, -0.4]}>
            <sphereGeometry args={[1.15, 5, 5]} />
            <meshStandardMaterial color="#e2f1f7" opacity={0.9} transparent flatShading />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default FarmEnvironment;
