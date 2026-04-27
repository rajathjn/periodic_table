import React, { Suspense, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getElementBySymbol, getAdjacentElements, CATEGORY_COLORS, CATEGORY_LABELS, getElementImagePath } from '../utils/elementUtils';
import PropertiesTable from '../components/PropertiesTable';

const BohrModel3D = React.lazy(() => import('../components/BohrModel3D'));

const ElementPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const element = symbol ? getElementBySymbol(symbol) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [symbol]);

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

  // Set page title
  useEffect(() => {
    document.title = `${element.name} (${element.symbol}) — Periodic Table`;
  }, [element]);

  // Build local image path
  const localImagePath = element.image?.url ? getElementImagePath(element.symbol, element.image.url) : null;

  return (
    <div className="element-page">
      {/* Hero Section */}
      <div className="element-hero">
        <div className="element-hero-info">
          <div className="element-number">Element #{element.number}</div>
          <div className="element-symbol-large gradient-text">{element.symbol}</div>
          <h1 className="element-name">{element.name}</h1>
          <span
            className="category-badge"
            style={{
              background: `${categoryColor}22`,
              color: categoryColor,
              border: `1px solid ${categoryColor}44`,
            }}
          >
            {categoryLabel}
          </span>
          <div className="element-mass" style={{ marginTop: 8 }}>
            {element.atomic_mass.toFixed(4)} u
          </div>
          {element.group_name && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
              {element.group_name} · Period {element.period} · Block {element.block?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="bohr-model-container">
          <Suspense fallback={
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', fontSize: '0.9rem'
            }}>
              Loading 3D Model...
            </div>
          }>
            <BohrModel3D shells={element.shells} atomicNumber={element.number} atomicMass={element.atomic_mass} />
          </Suspense>
        </div>
      </div>

      {/* Summary */}
      <section className="element-section animate-fadeInUp">
        <h2><span className="section-icon">📖</span> About {element.name}</h2>
        <p className="element-summary">
          {element.summary_extended || element.summary}
        </p>
        {element.summary_extended && (
          <p style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Source: Simple English Wikipedia
          </p>
        )}
      </section>

      {/* Properties */}
      <section className="element-section animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h2><span className="section-icon">⚛️</span> Atomic Properties</h2>
        <PropertiesTable element={element} />
      </section>

      {/* Electron Configuration Details */}
      <section className="element-section animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
        <h2><span className="section-icon">🔬</span> Electron Configuration</h2>
        <div style={{
          padding: 'var(--space-md)',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          letterSpacing: '0.03em',
          color: 'var(--text-accent)',
        }}>
          {element.electron_configuration}
        </div>
        {element.electron_configuration_semantic && (
          <div style={{
            marginTop: 8,
            padding: 'var(--space-sm) var(--space-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
          }}>
            Noble gas notation: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-accent)' }}>
              {element.electron_configuration_semantic}
            </span>
          </div>
        )}
        <div style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Electron shells: {element.shells.join(', ')}
        </div>
      </section>

      {/* Discovery */}
      {(element.discovered_by || element.named_by) && (
        <section className="element-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h2><span className="section-icon">🏛️</span> Discovery & History</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
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

      {/* Element Image */}
      {localImagePath && element.image && (
        <section className="element-section element-image-section animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
          <h2><span className="section-icon">📷</span> Image</h2>
          <img
            src={localImagePath}
            alt={element.image.title || `${element.name} sample`}
            loading="lazy"
            onError={(e) => {
              // Fallback to remote URL if local image not found
              (e.target as HTMLImageElement).src = element.image!.url;
            }}
          />
          {element.image.title && (
            <p style={{ fontWeight: 500, marginBottom: 4 }}>{element.image.title}</p>
          )}
          <p className="image-attribution">{element.image.attribution}</p>
        </section>
      )}

      {/* Navigation */}
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
