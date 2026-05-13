/**
 * ElementPage — Detailed view for a single element.
 *
 * Composes focused sub-components for the hero, 3D model viewer,
 * summary, properties, electron config, discovery, and image gallery.
 *
 * Prev/Next navigation links let users browse elements sequentially.
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getElementBySymbol, getAdjacentElements } from '@/utils/elementUtils';
import PropertiesTable from '@/components/PropertiesTable';
import ElementHeroInfo from '@/components/element/ElementHeroInfo';
import ElementModelViewer from '@/components/element/ElementModelViewer';
import ElectronConfigSection from '@/components/element/ElectronConfigSection';
import DiscoverySection from '@/components/element/DiscoverySection';
import ImageGallery from '@/components/element/ImageGallery';
import ElementNav from '@/components/element/ElementNav';

const ElementPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const element = symbol ? getElementBySymbol(symbol) : undefined;

  // Track which 3D model is shown: orbit (Bohr) or orbital.
  // State resets automatically on navigation because App.tsx renders this
  // component with `key={symbol}`, causing a full remount on element change.
  const [modelMode, setModelMode] = useState<'orbit' | 'orbital'>('orbit');

  // Scroll to top whenever the component mounts (i.e. when element changes)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update the browser tab title to reflect the current element.
  // This hook must be called unconditionally (React rules of hooks),
  // so it runs even when `element` is undefined (the guard return is below).
  useEffect(() => {
    if (element) {
      document.title = `${element.name} (${element.symbol}) — Periodic Table`;
    } else {
      document.title = 'Element Not Found — Periodic Table';
    }
  }, [element]);

  // --- Guard: element not found ---
  if (!element) {
    return (
      <div className="element-page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h1>Element Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>
          The element &quot;{symbol}&quot; doesn&apos;t exist in the periodic table.
        </p>
        <Link
          to="/"
          className="discover-link"
          style={{ display: 'inline-flex', marginTop: 24 }}
        >
          ← Back to Periodic Table
        </Link>
      </div>
    );
  }

  const { prev, next } = getAdjacentElements(element.number);

  return (
    <div className="element-page">
      {/* ── Hero Section ── */}
      <div className="element-hero">
        <ElementHeroInfo
          element={element}
          modelMode={modelMode}
          onModelModeChange={setModelMode}
        />
        <ElementModelViewer element={element} modelMode={modelMode} />
      </div>

      {/* ── Summary ── */}
      <section className="element-section">
        <h2>
          <span className="section-icon">📖</span> About {element.name}
        </h2>
        <p className="element-summary">
          {element.summary_extended || element.summary}
        </p>
        {element.summary_extended && (
          <p className="element-summary-source">Source: Simple English Wikipedia</p>
        )}
      </section>

      {/* ── Atomic Properties ── */}
      <section className="element-section">
        <h2>
          <span className="section-icon">⚛️</span> Atomic Properties
        </h2>
        <PropertiesTable element={element} />
      </section>

      {/* ── Electron Configuration ── */}
      <ElectronConfigSection element={element} />

      {/* ── Discovery & History ── */}
      <DiscoverySection element={element} />

      {/* ── Image Gallery ── */}
      <ImageGallery element={element} />

      {/* ── Prev / Next Element Navigation ── */}
      <ElementNav prev={prev} next={next} />
    </div>
  );
};

export default ElementPage;
