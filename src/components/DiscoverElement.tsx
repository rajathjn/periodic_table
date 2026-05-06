/**
 * DiscoverElement — "Discover an Element" promotional card.
 *
 * Picks a random element on mount (via `useMemo`) and displays a summary
 * card with its symbol, name, a truncated description, and a "Learn More"
 * link that navigates to the full element detail page.
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getRandomElement, CATEGORY_COLORS } from '../utils/elementUtils';

const DiscoverElement: React.FC = () => {
  /** Select a random element once on mount — stays stable across re-renders. */
  const element = useMemo(() => getRandomElement(), []);
  const color = CATEGORY_COLORS[element.category_normalized] || CATEGORY_COLORS['unknown'];

  return (
    <section className="discover-section">
      <h2 className="minecraft-font">
        ✨ <span className="gradient-text">Discover an Element</span>
      </h2>
      <Link to={`/elements/${element.symbol}`} className="discover-card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="discover-symbol" style={{ color }}>
          {element.symbol}
        </div>
        <div className="discover-info">
          <h3>{element.name}</h3>
          <p>
            {/* Truncate long summaries to keep the card compact */}
            {element.summary.length > 180
              ? element.summary.slice(0, 180) + '...'
              : element.summary}
          </p>
          <span className="discover-link">
            Learn More →
          </span>
        </div>
      </Link>
    </section>
  );
};

export default DiscoverElement;
