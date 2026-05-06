/**
 * Element utility functions and constants.
 *
 * Provides lookup helpers for the element dataset, formatting utilities,
 * and shared category label/color mappings used across the UI.
 */
import elementsData from '../data/elements.json';
import type { Element } from '../types/Element';

/** Full array of all 118 elements, typed from the JSON dataset. */
const elements: Element[] = elementsData as Element[];

/** Returns the complete list of all elements. */
export function getAllElements(): Element[] {
  return elements;
}

/**
 * Look up an element by its chemical symbol (case-insensitive).
 * Returns `undefined` if no match is found.
 */
export function getElementBySymbol(symbol: string): Element | undefined {
  return elements.find(el => el.symbol.toLowerCase() === symbol.toLowerCase());
}

/** Returns a random element — used by the "Discover an Element" card. */
export function getRandomElement(): Element {
  return elements[Math.floor(Math.random() * elements.length)];
}

/**
 * Returns the elements immediately before and after `number` in the periodic table.
 * Used for prev/next navigation on the ElementPage.
 */
export function getAdjacentElements(number: number): { prev: Element | undefined; next: Element | undefined } {
  return {
    prev: elements.find(el => el.number === number - 1),
    next: elements.find(el => el.number === number + 1),
  };
}

/**
 * Formats a numeric value for display, with an optional unit suffix.
 * Returns an em-dash "—" for null/undefined values.
 *
 * Numbers are trimmed of trailing zeroes (e.g. 1.2000 → "1.2").
 */
export function formatValue(value: number | null | undefined, unit?: string): string {
  if (value === null || value === undefined) return '—';
  const formatted = typeof value === 'number'
    ? Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/\.?0+$/, '')
    : String(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

/** Human-readable display names for each normalized category slug. */
export const CATEGORY_LABELS: Record<string, string> = {
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth-metal': 'Alkaline Earth Metal',
  'transition-metal': 'Transition Metal',
  'post-transition-metal': 'Post-Transition Metal',
  'metalloid': 'Metalloid',
  'nonmetal': 'Nonmetal',
  'noble-gas': 'Noble Gas',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
  'unknown': 'Unknown',
};

/** CSS `var()` references for each category's accent color. */
export const CATEGORY_COLORS: Record<string, string> = {
  'alkali-metal': 'var(--cat-alkali-metal)',
  'alkaline-earth-metal': 'var(--cat-alkaline-earth-metal)',
  'transition-metal': 'var(--cat-transition-metal)',
  'post-transition-metal': 'var(--cat-post-transition-metal)',
  'metalloid': 'var(--cat-metalloid)',
  'nonmetal': 'var(--cat-nonmetal)',
  'noble-gas': 'var(--cat-noble-gas)',
  'lanthanide': 'var(--cat-lanthanide)',
  'actinide': 'var(--cat-actinide)',
  'unknown': 'var(--cat-unknown)',
};
