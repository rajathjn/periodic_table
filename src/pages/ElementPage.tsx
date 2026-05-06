/**
 * ElementPage — Detailed view for a single element.
 *
 * Displays a hero section with the element's symbol, name, category badge,
 * and an interactive 3D Bohr model (lazy-loaded). Below the hero: a summary,
 * atomic properties table, electron configuration, discovery history, and
 * an image gallery with sample photos, spectral images, and 2D Bohr models.
 *
 * Prev/Next navigation links let users browse elements sequentially.
 */
import { Suspense, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getElementBySymbol, getAdjacentElements, CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/elementUtils';
import PropertiesTable from '../components/PropertiesTable';

/** Lazy-load the heavy Three.js-based GLB viewer to keep the initial bundle small. */
const GLBViewer = React.lazy(() => import('../components/GLBViewer'));

import React from 'react';

const ElementPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const element = symbol ? getElementBySymbol(symbol) : undefined;

  // Scroll to top whenever the element changes (e.g. via prev/next navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [symbol]);

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
          The element "{symbol}" doesn't exist in the periodic table.
        </p>
        <Link to="/" className="discover-link" style={{ display: 'inline-flex', marginTop: 24 }}>
          ← Back to Periodic Table
        </Link>
      </div>
    );
  }

  const { prev, next } = getAdjacentElements(element.number);
  const categoryColor = CATEGORY_COLORS[element.category_normalized] || CATEGORY_COLORS['unknown'];
  const categoryLabel = CATEGORY_LABELS[element.category_normalized] || element.category;

  return (
    <div className="element-page">
      {/* ── Hero Section ── */}
      <div className="element-hero">
        <div className="element-hero-info">
          <div className="element-number">Element #{element.number}</div>
          <div className="element-symbol-large gradient-text">{element.symbol}</div>
          <h1 className="element-name">{element.name}</h1>
          <span
            className="category-badge"
            style={{
              background: '#d4d0c8',
              color: categoryColor,
              border: 'none',
            }}
          >
            {categoryLabel}
          </span>
          <div className="element-mass" style={{ marginTop: 8 }}>
            {element.atomic_mass.toFixed(4)} u
          </div>
          {element.group_name && (
            <div style={{ color: '#808080', fontSize: '0.85rem', marginTop: 4 }}>
              {element.group_name} · Period {element.period} · Block {element.block?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Interactive 3D Bohr atom model */}
        <div className="bohr-model-container">
          <Suspense fallback={
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#808080', fontSize: '0.9rem'
            }}>
              Loading 3D Model...
            </div>
          }>
            {element.local_bohr_model_3d || element.bohr_model_3d ? (
              <GLBViewer url={element.local_bohr_model_3d || element.bohr_model_3d!} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#808080' }}>
                No 3D Model Available
              </div>
            )}
          </Suspense>
        </div>
      </div>

      {/* ── Summary ── */}
      <section className="element-section">
        <h2><span className="section-icon">📖</span> About {element.name}</h2>
        <p className="element-summary">
          {element.summary_extended || element.summary}
        </p>
        {element.summary_extended && (
          <p style={{ marginTop: 8, fontSize: '0.75rem', color: '#808080', fontStyle: 'italic' }}>
            Source: Simple English Wikipedia
          </p>
        )}
      </section>

      {/* ── Atomic Properties ── */}
      <section className="element-section">
        <h2><span className="section-icon">⚛️</span> Atomic Properties</h2>
        <PropertiesTable element={element} />
      </section>

      {/* ── Electron Configuration ── */}
      <section className="element-section">
        <h2><span className="section-icon">🔬</span> Electron Configuration</h2>
        <div style={{
          padding: 'var(--space-md)',
          background: '#ffffff',
          borderRadius: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          letterSpacing: '0.03em',
          color: '#000080',
          boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff, inset 2px 2px 0 #404040, inset -2px -2px 0 #d4d0c8',
        }}>
          {element.electron_configuration}
        </div>
        {element.electron_configuration_semantic && (
          <div style={{
            marginTop: 8,
            padding: 'var(--space-sm) var(--space-md)',
            color: '#404040',
            fontSize: '0.9rem',
          }}>
            Noble gas notation: <span style={{ fontFamily: 'var(--font-mono)', color: '#000080' }}>
              {element.electron_configuration_semantic}
            </span>
          </div>
        )}
        <div style={{ marginTop: 12, color: '#404040', fontSize: '0.9rem' }}>
          Electron shells: {element.shells.join(', ')}
        </div>
      </section>

      {/* ── Discovery & History ── */}
      {(element.discovered_by || element.named_by) && (
        <section className="element-section">
          <h2><span className="section-icon">🏛️</span> Discovery &amp; History</h2>
          <div style={{ color: '#404040', lineHeight: 1.7 }}>
            {element.discovered_by && (
              <p>
                <strong>Discovered by:</strong> {element.discovered_by}
              </p>
            )}
            {element.named_by && (
              <p style={{ marginTop: 8 }}>
                <strong>Named by:</strong> {element.named_by}
              </p>
            )}
            {element.source && (
              <p style={{ marginTop: 12 }}>
                <a href={element.source} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem' }}>
                  Read more on Wikipedia →
                </a>
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Image Gallery ── */}
      <section className="element-section element-image-section">
        <h2><span className="section-icon">📷</span> Image Gallery</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Sample photograph */}
          {element.image && (element.image.local_url || element.image.url) && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#000000' }}>Sample Image</h3>
              <img
                src={element.image.local_url || element.image.url}
                alt={element.image.title || `${element.name} sample`}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = element.image!.url; }}
                style={{ width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg)' }}
              />
              {element.image.title && (
                <p style={{ fontWeight: 500, marginTop: 8, marginBottom: 4 }}>{element.image.title}</p>
              )}
              <p className="image-attribution">{element.image.attribution}</p>
            </div>
          )}

          {/* Emission / absorption spectrum */}
          {(element.local_spectral_img || element.spectral_img) && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#000000' }}>Spectral Image</h3>
              <img
                src={element.local_spectral_img || element.spectral_img!}
                alt={`${element.name} spectrum`}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = element.spectral_img!; }}
                style={{ width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg)' }}
              />
            </div>
          )}

          {/* 2D Bohr model diagram */}
          {(element.local_bohr_model_image || element.bohr_model_image) && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#000000' }}>Bohr Model (2D)</h3>
              <div style={{ background: '#ffffff', display: 'inline-block', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <img
                  src={element.local_bohr_model_image || element.bohr_model_image!}
                  alt={`${element.name} 2D Bohr model`}
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = element.bohr_model_image!; }}
                  style={{ width: '100%', maxWidth: '300px', mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Prev / Next Element Navigation ── */}
      <nav className="element-nav" aria-label="Element navigation">
        {prev ? (
          <Link to={`/elements/${prev.symbol}`}>
            ← {prev.name} ({prev.symbol})
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/elements/${next.symbol}`}>
            {next.name} ({next.symbol}) →
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
};

export default ElementPage;
