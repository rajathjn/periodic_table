import React, { useState, useCallback } from 'react';
import { getAllElements } from '../utils/elementUtils';
import ElementCell from './ElementCell';
import CategoryLegend from './CategoryLegend';
import type { Element } from '../types/Element';

const PeriodicTable: React.FC = () => {
  const elements = getAllElements();
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleHover = useCallback((el: Element | null) => {
    setHoveredElement(el);
  }, []);

  // Split elements into main table and lanthanides/actinides
  const mainElements = elements.filter(el => {
    // Lanthanides: Z=57-71, Actinides: Z=89-103
    if (el.number >= 57 && el.number <= 71) return false;
    if (el.number >= 89 && el.number <= 103) return false;
    return true;
  });

  const lanthanides = elements.filter(el => el.number >= 57 && el.number <= 71);
  const actinides = elements.filter(el => el.number >= 89 && el.number <= 103);

  const isHighlighted = (el: Element): boolean | undefined => {
    if (!activeCategory) return undefined;
    return el.category_normalized === activeCategory;
  };

  return (
    <div className="periodic-table-wrapper">
      <div className="periodic-table-title">
        <h1>
          <span className="gradient-text">The Periodic Table</span> of Elements
        </h1>
        <p>Explore all 118 elements — click any element to learn more</p>
      </div>

      <CategoryLegend
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />

      {/* Main periodic table grid */}
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

      {/* Lanthanide & Actinide rows */}
      <div style={{ maxWidth: 1300, margin: '8px auto 0', padding: '0 16px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="la-ac-label" style={{ width: 62, flexShrink: 0 }}>Ac</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, minmax(52px, 1fr))', gap: 3, flex: 1 }}>
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

      {/* Hover info tooltip */}
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
              #{hoveredElement.number} · {hoveredElement.atomic_mass.toFixed(3)} u · {hoveredElement.phase} · {hoveredElement.category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodicTable;
