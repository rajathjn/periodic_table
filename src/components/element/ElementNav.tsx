/**
 * ElementNav — Prev/Next element navigation bar.
 *
 * Renders links to the previous and next elements by atomic number,
 * appearing at the bottom of the element detail page.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import type { Element } from '@/types/Element';

interface ElementNavProps {
  prev: Element | undefined;
  next: Element | undefined;
}

const ElementNav: React.FC<ElementNavProps> = ({ prev, next }) => {
  return (
    <nav className="element-nav" aria-label="Element navigation">
      {prev ? (
        <Link to={`/elements/${prev.symbol}`}>
          ← {prev.name} ({prev.symbol})
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/elements/${next.symbol}`}>
          {next.name} ({next.symbol}) →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};

export default React.memo(ElementNav);
