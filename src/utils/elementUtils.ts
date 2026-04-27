import elementsData from '../data/elements.json';
import type { Element } from '../types/Element';

const elements: Element[] = elementsData as Element[];

export function getAllElements(): Element[] {
  return elements;
}

export function getElementById(number: number): Element | undefined {
  return elements.find(el => el.number === number);
}

export function getElementBySymbol(symbol: string): Element | undefined {
  return elements.find(el => el.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getElementByName(name: string): Element | undefined {
  return elements.find(el => el.name.toLowerCase() === name.toLowerCase());
}

export function getRandomElement(): Element {
  return elements[Math.floor(Math.random() * elements.length)];
}

export function getAdjacentElements(number: number): { prev: Element | undefined; next: Element | undefined } {
  return {
    prev: elements.find(el => el.number === number - 1),
    next: elements.find(el => el.number === number + 1),
  };
}

export function getElementImagePath(symbol: string, imageUrl?: string): string {
  if (!imageUrl) return '';
  // Determine the extension from the original URL
  try {
    const url = new URL(imageUrl);
    const ext = url.pathname.split('.').pop()?.split('?')[0] || 'jpg';
    return `${import.meta.env.BASE_URL}images/elements/${symbol.toLowerCase()}.${ext}`;
  } catch {
    return `${import.meta.env.BASE_URL}images/elements/${symbol.toLowerCase()}.jpg`;
  }
}

export function formatValue(value: number | null | undefined, unit?: string): string {
  if (value === null || value === undefined) return '—';
  const formatted = typeof value === 'number'
    ? Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/\.?0+$/, '')
    : String(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

// Category display names
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

// Category CSS color variable names
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
