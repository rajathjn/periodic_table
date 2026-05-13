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
 *
 * Performance:
 * - Element arrays are memoized to avoid re-filtering on every render
 * - Lanthanide/Actinide objects with adjusted xpos are pre-computed once
 * - ElementCell is React.memo'd so unchanged cells skip re-rendering
 */
import { useState, useCallback, useMemo } from 'react';
import { getAllElements } from '@/utils/elementUtils';
import ElementCell from './ElementCell';
import CategoryLegend from './CategoryLegend';
import ElementTooltip from './ElementTooltip';
import type { Element } from '@/types/Element';

const PeriodicTable: React.FC = () => {
  const elements = getAllElements();
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /** Memoized hover handler to avoid re-creating on every render. */
  const handleHover = useCallback((el: Element | null) => {
    setHoveredElement(el);
  }, []);

  // Split elements into main table vs. the two f-block rows — memoized
  const mainElements = useMemo(
    () =>
      elements.filter((el) => {
        if (el.number >= 57 && el.number <= 71) return false; // Lanthanides
        if (el.number >= 89 && el.number <= 103) return false; // Actinides
        return true;
      }),
    [elements],
  );

  // Pre-compute lanthanide/actinide objects with adjusted xpos ONCE
  // so we don't defeat React.memo by spreading new objects every render
  const lanthanides = useMemo(
    () =>
      elements
        .filter((el) => el.number >= 57 && el.number <= 71)
        .map((el) => ({ ...el, xpos: el.number - 56 }) as Element),
    [elements],
  );

  const actinides = useMemo(
    () =>
      elements
        .filter((el) => el.number >= 89 && el.number <= 103)
        .map((el) => ({ ...el, xpos: el.number - 88 }) as Element),
    [elements],
  );

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
      <CategoryLegend activeCategory={activeCategory} onCategoryClick={setActiveCategory} />

      {/* Main 18-column grid (excludes lanthanides & actinides) */}
      <div className="periodic-table" role="grid" aria-label="Periodic Table of Elements">
        {mainElements.map((el) => (
          <ElementCell
            key={el.number}
            element={el}
            onHover={handleHover}
            highlighted={isHighlighted(el)}
          />
        ))}
      </div>

      {/* Lanthanide & Actinide rows (displayed below the main grid) */}
      <div className="la-ac-rows">
        {/* Lanthanides row */}
        <div className="la-ac-row">
          <span className="la-ac-label">La</span>
          <div className="la-ac-grid">
            {lanthanides.map((el) => (
              <ElementCell
                key={el.number}
                element={el}
                onHover={handleHover}
                highlighted={isHighlighted(el)}
              />
            ))}
          </div>
        </div>
        {/* Actinides row */}
        <div className="la-ac-row la-ac-row--actinides">
          <span className="la-ac-label">Ac</span>
          <div className="la-ac-grid">
            {actinides.map((el) => (
              <ElementCell
                key={el.number}
                element={el}
                onHover={handleHover}
                highlighted={isHighlighted(el)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Win98-style tooltip — shown fixed at the bottom center on hover */}
      <ElementTooltip element={hoveredElement} />
    </div>
  );
};

export default PeriodicTable;
