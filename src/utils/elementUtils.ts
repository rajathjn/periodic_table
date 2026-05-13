/**
 * Element utility functions and constants.
 *
 * Provides lookup helpers for the element dataset, formatting utilities,
 * and shared category label/color mappings used across the UI.
 *
 * Lookups use pre-built Map indices for O(1) access instead of
 * linear scans — important as search/filter features are added.
 */
import elementsData from '@/data/elements.json';
import type { Element } from '@/types/Element';

/** Full array of all 118+ elements, typed from the JSON dataset. */
const elements: Element[] = elementsData as Element[];

/** O(1) lookup by lowercase symbol (e.g. "he" → Helium). */
const bySymbol = new Map<string, Element>(
  elements.map((el) => [el.symbol.toLowerCase(), el]),
);

/** O(1) lookup by atomic number (e.g. 26 → Iron). */
const byNumber = new Map<number, Element>(
  elements.map((el) => [el.number, el]),
);

/** Returns the complete list of all elements. */
export function getAllElements(): Element[] {
  return elements;
}

/**
 * Look up an element by its chemical symbol (case-insensitive).
 * Returns `undefined` if no match is found.
 */
export function getElementBySymbol(symbol: string): Element | undefined {
  return bySymbol.get(symbol.toLowerCase());
}

/** Returns a random element — used by the "Discover an Element" card. */
export function getRandomElement(): Element {
  return elements[Math.floor(Math.random() * elements.length)]!;
}

/**
 * Returns the elements immediately before and after `number` in the periodic table.
 * Used for prev/next navigation on the ElementPage.
 */
export function getAdjacentElements(number: number): {
  prev: Element | undefined;
  next: Element | undefined;
} {
  return {
    prev: byNumber.get(number - 1),
    next: byNumber.get(number + 1),
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

/**
 * Safely formats an element's atomic mass to a given number of decimal places.
 * Handles superheavy elements (Z ≥ 104) whose `atomic_mass` is stored as a
 * bracketed string like `"[267]"` — these are parsed to a number first.
 * If parsing fails the raw value is returned as-is.
 */
export function formatMass(mass: number | string, digits: number): string {
  if (typeof mass === 'number') return mass.toFixed(digits);
  const parsed = Number(mass.replace(/[[\]]/g, ''));
  return Number.isNaN(parsed) ? String(mass) : parsed.toFixed(digits);
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
