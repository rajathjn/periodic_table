/**
 * ElementHero — Hero section for the element detail page.
 *
 * Shows the element's atomic number, symbol, name, category badge,
 * atomic mass, group info, fun fact, and orbit/orbital model toggle.
 */
import React from 'react';
import type { Element } from '@/types/Element';
import { CATEGORY_COLORS, CATEGORY_LABELS, formatMass } from '@/utils/elementUtils';

interface ElementHeroInfoProps {
  element: Element;
  modelMode: 'orbit' | 'orbital';
  onModelModeChange: (mode: 'orbit' | 'orbital') => void;
}

const ElementHeroInfo: React.FC<ElementHeroInfoProps> = ({
  element,
  modelMode,
  onModelModeChange,
}) => {
  const categoryColor = CATEGORY_COLORS[element.category_normalized] || CATEGORY_COLORS['nonmetal'];
  const categoryLabel = CATEGORY_LABELS[element.category_normalized] || element.category;

  return (
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
      <div className="element-mass">{formatMass(element.atomic_mass, 4)} u</div>

      {element.group_name && (
        <div className="element-group-info">
          {element.group_name} · Period {element.period} · Block{' '}
          {element.block?.toUpperCase()}
        </div>
      )}

      {element.fun_fact && (
        <div className="element-fun-fact">
          <span role="img" aria-label="fun fact">
            💡
          </span>{' '}
          {element.fun_fact}
        </div>
      )}

      {/* Orbit / Orbital model toggle buttons */}
      <div className="model-toggle-group">
        <button
          id="btn-orbit-model"
          className={`model-toggle-btn${modelMode === 'orbit' ? ' active' : ''}`}
          onClick={() => onModelModeChange('orbit')}
        >
          🪐 Orbit Model
        </button>
        <button
          id="btn-orbital-model"
          className={`model-toggle-btn${modelMode === 'orbital' ? ' active' : ''}`}
          onClick={() => onModelModeChange('orbital')}
        >
          ☁️ Orbital Model
        </button>
      </div>
    </div>
  );
};

export default React.memo(ElementHeroInfo);
