/**
 * Unit tests for element utility functions.
 *
 * These cover the core data lookup, formatting, and category mapping
 * functions that the entire UI depends on.
 */
import { describe, it, expect } from 'vitest';
import {
  getAllElements,
  getElementBySymbol,
  getRandomElement,
  getAdjacentElements,
  formatValue,
  formatMass,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/utils/elementUtils';

describe('getAllElements', () => {
  it('returns an array with 118+ elements', () => {
    const elements = getAllElements();
    expect(elements.length).toBeGreaterThanOrEqual(118);
  });

  it('first element is Hydrogen', () => {
    const elements = getAllElements();
    expect(elements[0]?.symbol).toBe('H');
    expect(elements[0]?.name).toBe('Hydrogen');
    expect(elements[0]?.number).toBe(1);
  });
});

describe('getElementBySymbol', () => {
  it('returns Hydrogen for "H"', () => {
    const el = getElementBySymbol('H');
    expect(el).toBeDefined();
    expect(el?.name).toBe('Hydrogen');
    expect(el?.number).toBe(1);
  });

  it('is case-insensitive', () => {
    const lower = getElementBySymbol('fe');
    const upper = getElementBySymbol('Fe');
    expect(lower).toBeDefined();
    expect(lower).toBe(upper);
    expect(lower?.name).toBe('Iron');
  });

  it('returns undefined for non-existent symbol', () => {
    expect(getElementBySymbol('Xx')).toBeUndefined();
    expect(getElementBySymbol('')).toBeUndefined();
  });
});

describe('getRandomElement', () => {
  it('returns a valid element', () => {
    const el = getRandomElement();
    expect(el).toBeDefined();
    expect(el.number).toBeGreaterThanOrEqual(1);
    expect(el.symbol).toBeTruthy();
  });
});

describe('getAdjacentElements', () => {
  it('returns prev and next for a middle element', () => {
    const { prev, next } = getAdjacentElements(26); // Iron
    expect(prev?.symbol).toBe('Mn'); // Manganese (25)
    expect(next?.symbol).toBe('Co'); // Cobalt (27)
  });

  it('returns undefined prev for Hydrogen', () => {
    const { prev, next } = getAdjacentElements(1);
    expect(prev).toBeUndefined();
    expect(next?.symbol).toBe('He');
  });

  it('returns undefined next for last element', () => {
    const elements = getAllElements();
    const lastNumber = elements[elements.length - 1]!.number;
    const { next } = getAdjacentElements(lastNumber);
    expect(next).toBeUndefined();
  });
});

describe('formatValue', () => {
  it('returns em-dash for null/undefined', () => {
    expect(formatValue(null)).toBe('—');
    expect(formatValue(undefined)).toBe('—');
  });

  it('formats integers without trailing zeros', () => {
    expect(formatValue(42)).toBe('42');
  });

  it('formats decimals and trims trailing zeros', () => {
    expect(formatValue(1.2)).toBe('1.2');
    expect(formatValue(3.14159)).toBe('3.1416');
  });

  it('appends unit when provided', () => {
    expect(formatValue(100, 'K')).toBe('100 K');
    expect(formatValue(null, 'K')).toBe('—');
  });
});

describe('formatMass', () => {
  it('formats numeric mass to given decimal places', () => {
    expect(formatMass(1.008, 3)).toBe('1.008');
    expect(formatMass(55.845, 2)).toBe('55.84'); // JS toFixed uses banker's rounding
    expect(formatMass(12.011, 4)).toBe('12.0110');
  });

  it('handles bracketed string mass (superheavy elements)', () => {
    expect(formatMass('[267]', 0)).toBe('267');
    expect(formatMass('[294]', 2)).toBe('294.00');
  });

  it('returns raw string if parsing fails', () => {
    expect(formatMass('unknown', 2)).toBe('unknown');
  });
});

describe('CATEGORY_LABELS', () => {
  it('has labels for all 10 categories', () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(10);
    expect(CATEGORY_LABELS['noble-gas']).toBe('Noble Gas');
    expect(CATEGORY_LABELS['unknown']).toBe('Unknown');
  });
});

describe('CATEGORY_COLORS', () => {
  it('uses CSS custom properties for all categories', () => {
    Object.values(CATEGORY_COLORS).forEach((color) => {
      expect(color).toMatch(/^var\(--cat-/);
    });
  });
});
