/**
 * PeriodicTable — The main 18-column periodic table grid.
 *
 * Renders all 118 elements in their standard positions. Lanthanides (Z 57–71)
 * and Actinides (Z 89–103) are displayed in separate rows beneath the main grid,
 * matching the conventional "pulled-out" layout.
 *
 * Features:
 * - Category legend with click-to-filter (dims non-matching elements)
 * - Hover tooltip showing element name, number, mass, phase, and category
 */
import { useState, useCallback } from 'react';
import { getAllElements, formatMass } from '../utils/elementUtils';
import ElementCell from './ElementCell';
import CategoryLegend from './CategoryLegend';
import type { Element } from '../types/Element';

const PeriodicTable: React.FC = () => {
  const elements = getAllElements();
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /** Memoized hover handler to avoid re-creating on every render. */
  const handleHover = useCallback((el: Element | null) => {
    setHoveredElement(el);
  }, []);

  // Split elements into main table vs. the two f-block rows
  const mainElements = elements.filter(el => {
    if (el.number >= 57 && el.number <= 71) return false; // Lanthanides
    if (el.number >= 89 && el.number <= 103) return false; // Actinides
    return true;
  });

  const lanthanides = elements.filter(el => el.number >= 57 && el.number <= 71);
  const actinides = elements.filter(el => el.number >= 89 && el.number <= 103);

  /**
   * Determines if an element should be visually highlighted.
   * Returns `undefined` when no filter is active (all elements shown normally),
   * `true` if the element matches the active category, or `false` to dim it.
   */
  const isHighlighted = (el: Element): boolean | undefined => {
    if (!activeCategory) return undefined;
    return el.category_normalized === activeCategory;
  };

  return (
    <div className="periodic-table-wrapper">
      {/* Title */}
      <div className="periodic-table-title">
        <h1 className="minecraft-font">
          <span className="gradient-text">THE PERIODIC TABLE OF ELEMENTS</span> 
        </h1>
        <p>Explore all 118 elements — click any element to learn more</p>
      </div>

      {/* Category filter legend */}
      <CategoryLegend
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />

      {/* Main 18-column grid (excludes lanthanides & actinides) */}
      <div className="periodic-table" role="grid" aria-label="Periodic Table of Elements">
        {mainElements.map(el => (
          <ElementCell
            key={el.number}
            element={el}
            onHover={handleHover}
            highlighted={isHighlighted(el)}
          />
        ))}
      </div>

      {/* Lanthanide & Actinide rows (displayed below the main grid) */}
      <div style={{ maxWidth: 1300, margin: '8px auto 0', padding: '0 16px' }}>
        {/* Lanthanides row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, marginTop: 8 }}>
          <span className="la-ac-label" style={{ width: 62, flexShrink: 0 }}>La</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(52px, 1fr))', gap: 2, flex: 1 }}>
            {lanthanides.map(el => (
              <ElementCell
                key={el.number}
                element={{ ...el, xpos: el.number - 56 } as Element}
                onHover={handleHover}
                highlighted={isHighlighted(el)}
              />
            ))}
          </div>
        </div>
        {/* Actinides row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="la-ac-label" style={{ width: 62, flexShrink: 0 }}>Ac</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(52px, 1fr))', gap: 2, flex: 1 }}>
            {actinides.map(el => (
              <ElementCell
                key={el.number}
                element={{ ...el, xpos: el.number - 88 } as Element}
                onHover={handleHover}
                highlighted={isHighlighted(el)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Win98-style tooltip — shown fixed at the bottom center on hover */}
      {hoveredElement && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffe1',
            border: '1px solid #000000',
            borderRadius: 0,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 50,
            boxShadow: '2px 2px 0 #808080',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
          }}>
            {hoveredElement.symbol}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}>{hoveredElement.name}</div>
            <div style={{ color: '#404040', fontSize: '0.8rem' }}>
              #{hoveredElement.number} · {formatMass(hoveredElement.atomic_mass, 3)} u · {hoveredElement.phase} · {hoveredElement.category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;
