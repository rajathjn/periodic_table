/**
 * GLBViewer — Interactive 3D Bohr model viewer.
 *
 * Loads a `.glb` file using Three.js (via React Three Fiber + Drei) and
 * renders it inside a `<Canvas>` with orbit controls and auto-rotation.
 *
 * This component is lazy-loaded (`React.lazy`) on the ElementPage to avoid
 * pulling the ~1 MB Three.js bundle into the initial page load.
 */
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Stage } from '@react-three/drei';
import type { Group } from 'three';

interface GLBViewerProps {
  /** URL to the .glb model file (can be local or remote). */
  url: string;
}

/**
 * Internal component that loads and displays the GLB model inside the scene.
 * Automatically plays all baked-in animation clips (orbital tilts, electron motion).
 */
function Model({ url }: { url: string }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play all animation clips embedded in the GLB file
    Object.values(actions).forEach(action => {
      action?.play();
    });
  }, [actions]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

const GLBViewer: React.FC<GLBViewerProps> = ({ url }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Suspense fallback={null}>
        {/* Stage provides automatic centering, scaling, and studio-quality lighting */}
        <Stage preset="rembrandt" intensity={1} environment="city">
          <Model url={url} />
        </Stage>
      </Suspense>
      {/* User can drag to rotate; auto-rotates when idle */}
      <OrbitControls autoRotate autoRotateSpeed={2} makeDefault />
    </Canvas>
  );
};

export default GLBViewer;
