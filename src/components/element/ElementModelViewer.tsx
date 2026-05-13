/**
 * ElementModelViewer — 3D model viewer with orbit/orbital switching.
 *
 * Wraps the lazy-loaded GLBViewer in a Suspense boundary and handles
 * the model URL resolution for orbit vs. orbital mode.
 */
import React, { Suspense } from 'react';
import type { Element } from '@/types/Element';

/** Lazy-load the heavy Three.js-based GLB viewer to keep the initial bundle small. */
const GLBViewer = React.lazy(() => import('@/components/GLBViewer'));

interface ElementModelViewerProps {
  element: Element;
  modelMode: 'orbit' | 'orbital';
}

const ElementModelViewer: React.FC<ElementModelViewerProps> = ({ element, modelMode }) => {
  const modelUrl =
    modelMode === 'orbital'
      ? element.local_orbital_model_3d
      : element.local_bohr_model_3d || element.bohr_model_3d;

  return (
    <div className="bohr-model-container">
      <Suspense
        fallback={
          <div className="model-loading-fallback">Loading 3D Model...</div>
        }
      >
        {modelUrl ? (
          <GLBViewer key={`${element.symbol}-${modelMode}`} url={modelUrl} />
        ) : (
          <div className="model-loading-fallback">No 3D Model Available</div>
        )}
      </Suspense>
    </div>
  );
};

export default React.memo(ElementModelViewer);
