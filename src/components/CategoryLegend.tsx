/**
 * CategoryLegend — Interactive color legend for element categories.
 *
 * Displays a row of colored swatches with labels. Clicking a category
 * toggles it as the active filter — all non-matching element cells are
 * dimmed on the main grid. Clicking the same category again clears the filter.
 */
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/utils/elementUtils';

interface CategoryLegendProps {
  /** Currently selected category slug, or `null` if no filter is active. */
  activeCategory?: string | null;
  /** Callback fired when the user clicks a category (or `null` to clear). */
  onCategoryClick?: (category: string | null) => void;
}

/** Ordered list of all category slugs shown in the legend. */
const CATEGORIES = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
];

const CategoryLegend: React.FC<CategoryLegendProps> = ({ activeCategory, onCategoryClick }) => {
  return (
    <div className="category-legend" role="group" aria-label="Element category filter">
      {CATEGORIES.map(cat => (
        <div
          key={cat}
          className="legend-item"
          role="button"
          tabIndex={0}
          onClick={() => onCategoryClick?.(activeCategory === cat ? null : cat)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCategoryClick?.(activeCategory === cat ? null : cat);
            }
          }}
          style={{
            opacity: activeCategory && activeCategory !== cat ? 0.4 : 1,
          }}
          aria-pressed={activeCategory === cat}
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
