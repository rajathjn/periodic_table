/**
 * ElementTooltip — Win98-style hover tooltip for element cells.
 *
 * Shown fixed at the bottom center of the viewport when hovering
 * over an element in the periodic table grid.
 *
 * Uses `aria-live="polite"` so screen readers announce element changes.
 */
import React from 'react';
import type { Element } from '@/types/Element';
import { formatMass } from '@/utils/elementUtils';

interface ElementTooltipProps {
  element: Element | null;
}

const ElementTooltip: React.FC<ElementTooltipProps> = ({ element }) => {
  if (!element) return null;

  return (
    <div className="element-tooltip" role="status" aria-live="polite">
      <span className="element-tooltip-symbol">{element.symbol}</span>
      <div>
        <div className="element-tooltip-name">{element.name}</div>
        <div className="element-tooltip-detail">
          #{element.number} · {formatMass(element.atomic_mass, 3)} u ·{' '}
          {element.phase} · {element.category}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ElementTooltip);
