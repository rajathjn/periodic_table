/**
 * DiscoverySection — Discovery & history information for an element.
 *
 * Shows who discovered and named the element, plus a Wikipedia link.
 */
import React from 'react';
import type { Element } from '@/types/Element';

interface DiscoverySectionProps {
  element: Element;
}

const DiscoverySection: React.FC<DiscoverySectionProps> = ({ element }) => {
  if (!element.discovered_by && !element.named_by) return null;

  return (
    <section className="element-section">
      <h2>
        <span className="section-icon">🏛️</span> Discovery &amp; History
      </h2>
      <div className="discovery-content">
        {element.discovered_by && (
          <p>
            <strong>Discovered by:</strong> {element.discovered_by}
          </p>
        )}
        {element.named_by && (
          <p className="discovery-named-by">
            <strong>Named by:</strong> {element.named_by}
          </p>
        )}
        {element.source && (
          <p className="discovery-source">
            <a href={element.source} target="_blank" rel="noopener noreferrer">
              Read more on Wikipedia →
            </a>
          </p>
        )}
      </div>
    </section>
  );
};

export default React.memo(DiscoverySection);
