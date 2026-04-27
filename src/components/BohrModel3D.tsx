import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

interface BohrModel3DProps {
  shells: number[];
  atomicNumber: number;
  atomicMass: number;
}

// Particle colors
const PROTON_COLOR = '#ef4444';   // Red
const NEUTRON_COLOR = '#3b82f6';  // Blue
const ELECTRON_COLOR = '#22c55e'; // Green

// Nucleus: individual protons (red) and neutrons (blue) packed in a sphere
function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const protonRef = useRef<THREE.InstancedMesh>(null);
  const neutronRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const total = protons + neutrons;

  // Scale particle size with nucleon count
  const particleRadius = total <= 1 ? 0.15
    : total <= 4 ? 0.12
    : total <= 20 ? 0.09
    : total <= 80 ? 0.06
    : total <= 200 ? 0.04
    : 0.03;

  // Nucleus radius scales with cube root of total
  const nucleusRadius = total <= 1 ? 0
    : particleRadius * Math.pow(total, 1 / 3) * 1.3;

  // Slowly rotate the nucleus
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Position all nucleons using volume-filling fibonacci sphere
  useEffect(() => {
    if (total === 0) return;

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const dummy = new THREE.Object3D();

    // Build alternating proton/neutron assignment
    let pRem = protons;
    let nRem = neutrons;
    let pIdx = 0;
    let nIdx = 0;

    for (let i = 0; i < total; i++) {
      // Alternating pattern: proton, neutron, proton, neutron...
      // When one type runs out, fill the rest with the other
      let isProton: boolean;
      if (pRem > 0 && nRem > 0) {
        isProton = i % 2 === 0;
        if (isProton) pRem--; else nRem--;
      } else if (pRem > 0) {
        isProton = true; pRem--;
      } else {
        isProton = false; nRem--;
      }

      // Position: single particle at center, otherwise volume-fill a sphere
      if (total === 1) {
        dummy.position.set(0, 0, 0);
      } else {
        const r = nucleusRadius * Math.pow((i + 0.5) / total, 1 / 3);
        const theta = Math.acos(1 - 2 * (i + 0.5) / total);
        const phi = (2 * Math.PI * i) / goldenRatio;
        dummy.position.set(
          r * Math.sin(theta) * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(theta)
        );
      }
      dummy.updateMatrix();

      if (isProton && protonRef.current) {
        protonRef.current.setMatrixAt(pIdx++, dummy.matrix);
      } else if (!isProton && neutronRef.current) {
        neutronRef.current.setMatrixAt(nIdx++, dummy.matrix);
      }
    }

    if (protonRef.current) protonRef.current.instanceMatrix.needsUpdate = true;
    if (neutronRef.current) neutronRef.current.instanceMatrix.needsUpdate = true;
  }, [protons, neutrons, total, nucleusRadius]);

  return (
    <group ref={groupRef}>
      {protons > 0 && (
        <instancedMesh ref={protonRef} args={[undefined, undefined, protons]}>
          <sphereGeometry args={[particleRadius, 12, 12]} />
          <meshStandardMaterial
            color={PROTON_COLOR}
            emissive={PROTON_COLOR}
            emissiveIntensity={1.5}
            roughness={0.2}
            toneMapped={false}
          />
        </instancedMesh>
      )}
      {neutrons > 0 && (
        <instancedMesh ref={neutronRef} args={[undefined, undefined, Math.max(neutrons, 1)]}>
          <sphereGeometry args={[particleRadius, 12, 12]} />
          <meshStandardMaterial
            color={NEUTRON_COLOR}
            emissive={NEUTRON_COLOR}
            emissiveIntensity={1.5}
            roughness={0.2}
            toneMapped={false}
          />
        </instancedMesh>
      )}
    </group>
  );
}

// Electron: orbits in XY plane. Parent group rotation handles the 3D tilt,
// so the electron always stays exactly on its orbital ring path.
function Electron({ radius, speed, startAngle }: {
  radius: number;
  speed: number;
  startAngle: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = useRef(startAngle);

  useFrame((_, delta) => {
    angle.current += speed * delta;
    if (meshRef.current) {
      meshRef.current.position.x = radius * Math.cos(angle.current);
      meshRef.current.position.y = radius * Math.sin(angle.current);
      meshRef.current.position.z = 0;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={ELECTRON_COLOR}
        emissive={ELECTRON_COLOR}
        emissiveIntensity={2.5}
        roughness={0.1}
        toneMapped={false}
      />
    </mesh>
  );
}

// A single orbital shell: ring + electrons, all inside one rotated group.
// Because electrons orbit in XY and the group is tilted, they follow the ring exactly.
function OrbitalShell({ radius, tiltX, tiltZ, electronCount, speed }: {
  radius: number;
  tiltX: number;
  tiltZ: number;
  electronCount: number;
  speed: number;
}) {
  const ringPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
    }
    return pts;
  }, [radius]);

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <Line
        points={ringPoints}
        color="#818cf8"
        transparent
        opacity={0.35}
        lineWidth={1}
      />
      {Array.from({ length: electronCount }).map((_, i) => (
        <Electron
          key={i}
          radius={radius}
          speed={speed}
          startAngle={(i / electronCount) * Math.PI * 2}
        />
      ))}
    </group>
  );
}

// Main scene
function AtomScene({ shells, atomicNumber, atomicMass }: {
  shells: number[];
  atomicNumber: number;
  atomicMass: number;
}) {
  const neutrons = Math.max(0, Math.round(atomicMass) - atomicNumber);

  const shellData = useMemo(() => {
    return shells.map((electronCount, i) => {
      const radius = 1.2 + i * 0.8;
      const tiltX = ((i * 137.508 * Math.PI) / 180) % Math.PI;
      const tiltZ = ((i * 73.0 + 30) * Math.PI) / 180;
      const speed = 0.8 - i * 0.08;
      return { electronCount, radius, tiltX, tiltZ, speed };
    });
  }, [shells]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-3, -3, 2]} intensity={0.5} color="#818cf8" />

      <Nucleus protons={atomicNumber} neutrons={neutrons} />

      {shellData.map((shell, i) => (
        <OrbitalShell
          key={i}
          radius={shell.radius}
          tiltX={shell.tiltX}
          tiltZ={shell.tiltZ}
          electronCount={shell.electronCount}
          speed={shell.speed}
        />
      ))}
    </>
  );
}

const BohrModel3D: React.FC<BohrModel3DProps> = ({ shells, atomicNumber, atomicMass }) => {
  const outerRadius = 1.2 + (shells.length - 1) * 0.8;
  const cameraZ = outerRadius * 2.8 + 1.5;

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#08081a']} />
      <AtomScene shells={shells} atomicNumber={atomicNumber} atomicMass={atomicMass} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default BohrModel3D;
