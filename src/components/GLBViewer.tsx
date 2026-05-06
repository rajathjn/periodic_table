import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Stage } from '@react-three/drei';
import type { Group } from 'three';

interface GLBViewerProps {
  url: string;
}

function Model({ url }: { url: string }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play all baked-in animation clips (orbital tilts + electron motion)
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
        {/* Stage automatically centers and scales the model, and provides good lighting */}
        <Stage preset="rembrandt" intensity={1} environment="city">
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls autoRotate autoRotateSpeed={2} makeDefault />
    </Canvas>
  );
};

export default GLBViewer;
