/**
 * GLBViewer — Interactive 3D Bohr model viewer.
 *
 * Loads a `.glb` file using Three.js (via React Three Fiber + Drei) and
 * renders it inside a `<Canvas>` with orbit controls and auto-rotation.
 *
 * This component is lazy-loaded (`React.lazy`) on the ElementPage to avoid
 * pulling the ~1 MB Three.js bundle into the initial page load.
 *
 * Animation reliability:
 * - `frameloop="always"` keeps the render loop ticking so `OrbitControls`
 *   auto-rotation and the GLB animation clips never freeze after the user
 *   interacts.
 * - We drive the `AnimationMixer` ourselves in a `useFrame` and explicitly
 *   set every action to `LoopRepeat` with infinite repetitions. Some Bohr
 *   GLBs ship clips with `LoopOnce` which would silently stop after one
 *   cycle; the previous version relied on whatever loop mode the file
 *   declared which produced inconsistent behaviour across elements.
 * - Each viewer instance gets its own mixer (no shared state with cached
 *   scenes), so re-visiting the same element doesn't inherit a paused mixer.
 *
 * Performance:
 * - Geometry/material disposal on unmount keeps GPU memory bounded.
 * - Lighting is kept lightweight (no HDR environment).
 */
import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { AnimationMixer, LoopRepeat, type Group, type Mesh, type Material } from 'three';

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

  // Own the mixer per-mount so cached scenes can't carry paused state across remounts.
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);

  // Configure and start every clip; force infinite looping so a one-shot clip
  // can't silently stop after the user touches the canvas.
  useEffect(() => {
    const actions = animations.map((clip) => {
      const action = mixer.clipAction(clip);
      action.setLoop(LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      action.reset().play();
      return action;
    });
    return () => {
      actions.forEach((action) => action.stop());
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [animations, mixer, scene]);

  // Drive the mixer every frame ourselves — this guarantees the clips keep
  // advancing whether or not drei's internal subscribers are active.
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  // Dispose geometry and materials when the component unmounts.
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
      frameloop="always"
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* Stage provides automatic centering, scaling, and studio-quality lighting */}
        <Stage preset="rembrandt" intensity={1} environment="city">
          <Model url={url} />
        </Stage>
      </Suspense>
      {/* User can drag to rotate; auto-rotates when idle. */}
      <OrbitControls autoRotate autoRotateSpeed={2} enableDamping makeDefault />
    </Canvas>
  );
};

export default GLBViewer;
