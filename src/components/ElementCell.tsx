/**
 * ElementCell — A single element tile in the periodic table grid.
 *
 * Renders as a clickable `<Link>` styled as a Win98 raised button. Shows
 * the atomic number, symbol (colored by category), name, and atomic mass.
 *
 * Wrapped in `React.memo` to prevent unnecessary re-renders when sibling
 * cells change — the periodic table has 118 of these on-screen at once.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import type { Element } from '../types/Element';
import { CATEGORY_COLORS } from '../utils/elementUtils';

interface ElementCellProps {
  element: Element;
  /** Called on mouseenter/leave to update the parent's hover tooltip. */
  onHover?: (element: Element | null) => void;
  /**
   * `undefined` → normal display (no filter active)
   * `true`      → highlighted (matches the active category)
   * `false`     → dimmed (does not match the active category)
   */
  highlighted?: boolean;
}

const ElementCell: React.FC<ElementCellProps> = ({ element, onHover, highlighted }) => {
  const categoryColor = CATEGORY_COLORS[element.category_normalized] || CATEGORY_COLORS['unknown'];

  return (
    <Link
      to={`/elements/${element.symbol}`}
      className={`element-cell ${highlighted === false ? 'dimmed' : ''}`}
      data-category={element.category_normalized}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos <= 7 ? element.ypos : undefined,
      }}
      onMouseEnter={() => onHover?.(element)}
      onMouseLeave={() => onHover?.(null)}
      title={`${element.name} (${element.symbol}) — ${element.category}`}
      id={`element-${element.symbol}`}
    >
      <span className="atomic-number">{element.number}</span>
      <span className="symbol" style={{ color: categoryColor }}>{element.symbol}</span>
      <span className="name">{element.name}</span>
      <span className="mass">{element.atomic_mass.toFixed(2)}</span>
    </Link>
  );
};

export default React.memo(ElementCell);
