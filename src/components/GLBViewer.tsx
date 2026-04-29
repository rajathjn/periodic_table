import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';

interface GLBViewerProps {
  url: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
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

// Preload is not strictly necessary for dynamic URLs unless we know them ahead of time,
// but useGLTF caches them automatically once loaded.
