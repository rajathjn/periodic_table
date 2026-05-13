/**
 * GLBViewer — Interactive 3D Bohr model viewer.
 *
 * Loads a `.glb` file using Three.js (via React Three Fiber + Drei) and
 * renders it inside a `<Canvas>` with orbit controls and auto-rotation.
 *
 * This component is lazy-loaded (`React.lazy`) on the ElementPage to avoid
 * pulling the ~1 MB Three.js bundle into the initial page load.
 *
 * Performance:
 * - `frameloop="demand"` stops the render loop when the user isn't interacting
 * - Geometry and materials are disposed on unmount to prevent memory leaks
 * - Simple lighting instead of heavy HDR environment maps
 */
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Stage } from '@react-three/drei';
import type { Group, Mesh, Material } from 'three';

interface GLBViewerProps {
  /** URL to the .glb model file (can be local or remote). */
  url: string;
}

/**
 * Internal component that loads and displays the GLB model inside the scene.
 * Automatically plays all baked-in animation clips (orbital tilts, electron motion).
 * Disposes geometry and materials on unmount to prevent GPU memory leaks.
 */
function Model({ url }: { url: string }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play all animation clips embedded in the GLB file
    Object.values(actions).forEach((action) => {
      action?.play();
    });
  }, [actions]);

  // Dispose geometry and materials on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        const mesh = child as Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m: Material) => m.dispose());
          } else if (mesh.material) {
            (mesh.material as Material).dispose();
          }
        }
      });
    };
  }, [scene]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

const GLBViewer: React.FC<GLBViewerProps> = ({ url }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      frameloop="demand"
    >
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
