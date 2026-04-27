import React from 'react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/elementUtils';

interface CategoryLegendProps {
  activeCategory?: string | null;
  onCategoryClick?: (category: string | null) => void;
}

const CATEGORIES = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'nonmetal',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
];

const CategoryLegend: React.FC<CategoryLegendProps> = ({ activeCategory, onCategoryClick }) => {
  return (
    <div className="category-legend">
      {CATEGORIES.map(cat => (
        <div
          key={cat}
          className="legend-item"
          onClick={() => onCategoryClick?.(activeCategory === cat ? null : cat)}
          style={{
            opacity: activeCategory && activeCategory !== cat ? 0.4 : 1,
          }}
        >
          <span
            className="legend-swatch"
            style={{ background: CATEGORY_COLORS[cat] }}
          />
          <span>{CATEGORY_LABELS[cat]}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryLegend;
