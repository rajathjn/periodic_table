/**
 * ElementModelViewer — 3D model viewer with orbit/orbital switching.
 *
 * Wraps the lazy-loaded GLBViewer in a Suspense boundary and handles
 * the model URL resolution for orbit vs. orbital mode.
 */
import React, { Suspense } from 'react';
import type { Element } from '@/types/Element';
import ErrorBoundary from '@/ui/ErrorBoundary';

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
      <ErrorBoundary
        label="3D model"
        fallback={(error, reset) => (
          <div className="model-loading-fallback" role="status">
            <p>Could not load the 3D model.</p>
            <p style={{ opacity: 0.7, fontSize: '0.85em' }}>{error.message}</p>
            <button type="button" className="win98-button" onClick={reset}>
              Retry
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div className="model-loading-fallback" role="status" aria-live="polite">
              Loading 3D Model...
            </div>
          }
        >
          {modelUrl ? (
            <GLBViewer key={`${element.symbol}-${modelMode}`} url={modelUrl} />
          ) : (
            <div className="model-loading-fallback" role="status">
              No 3D Model Available
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default React.memo(ElementModelViewer);
