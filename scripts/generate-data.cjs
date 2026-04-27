// Script to fetch Bowserinator JSON and enhance it with additional data
const fs = require('fs');
const path = require('path');

const BOWSER_URL = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json';

// Category color mapping for consistent UI
const CATEGORY_COLORS = {
  'alkali metal': '#F44336',
  'alkaline earth metal': '#FF9800',
  'transition metal': '#FFEB3B',
  'post-transition metal': '#4CAF50',
  'metalloid': '#00BCD4',
  'diatomic nonmetal': '#2196F3',
  'polyatomic nonmetal': '#2196F3',
  'noble gas': '#9C27B0',
  'lanthanide': '#FF5722',
  'actinide': '#E91E63',
  'unknown, probably transition metal': '#607D8B',
  'unknown, probably post-transition metal': '#607D8B',
  'unknown, probably metalloid': '#607D8B',
  'unknown, predicted to be noble gas': '#607D8B',
};

// Normalize category names
function normalizeCategory(cat) {
  if (!cat) return 'unknown';
  const c = cat.toLowerCase();
  if (c.includes('alkali') && !c.includes('alkaline')) return 'alkali-metal';
  if (c.includes('alkaline')) return 'alkaline-earth-metal';
  if (c.includes('transition') && !c.includes('post')) return 'transition-metal';
  if (c.includes('post-transition')) return 'post-transition-metal';
  if (c.includes('metalloid')) return 'metalloid';
  if (c.includes('nonmetal') || c.includes('reactive nonmetal')) return 'nonmetal';
  if (c.includes('noble')) return 'noble-gas';
  if (c.includes('lanthanide')) return 'lanthanide';
  if (c.includes('actinide')) return 'actinide';
  return 'unknown';
}

function getGroupName(group, category) {
  if (!group) return null;
  const names = {
    1: 'Alkali Metals (Group 1)',
    2: 'Alkaline Earth Metals (Group 2)',
    3: 'Group 3', 4: 'Group 4', 5: 'Group 5', 6: 'Group 6',
    7: 'Group 7', 8: 'Group 8', 9: 'Group 9', 10: 'Group 10',
    11: 'Coinage Metals (Group 11)', 12: 'Group 12',
    13: 'Boron Group (Group 13)', 14: 'Carbon Group (Group 14)',
    15: 'Pnictogens (Group 15)', 16: 'Chalcogens (Group 16)',
    17: 'Halogens (Group 17)', 18: 'Noble Gases (Group 18)',
  };
  return names[group] || `Group ${group}`;
}

// Common oxidation states for elements (by atomic number)
const OXIDATION_STATES = {
  1: '+1, -1', 2: '0', 3: '+1', 4: '+2', 5: '+3', 6: '-4, -3, -2, -1, +1, +2, +3, +4',
  7: '-3, -2, -1, +1, +2, +3, +4, +5', 8: '-2, -1, +1, +2', 9: '-1', 10: '0',
  11: '+1', 12: '+2', 13: '+3', 14: '-4, +2, +4', 15: '-3, +3, +5',
  16: '-2, +2, +4, +6', 17: '-1, +1, +3, +5, +7', 18: '0',
  19: '+1', 20: '+2', 21: '+3', 22: '+2, +3, +4', 23: '+2, +3, +4, +5',
  24: '+2, +3, +6', 25: '+2, +3, +4, +6, +7', 26: '+2, +3', 27: '+2, +3',
  28: '+2, +3', 29: '+1, +2', 30: '+2', 31: '+3', 32: '-4, +2, +4',
  33: '-3, +3, +5', 34: '-2, +2, +4, +6', 35: '-1, +1, +3, +5, +7', 36: '0, +2',
  37: '+1', 38: '+2', 39: '+3', 40: '+4', 41: '+3, +5', 42: '+4, +6',
  43: '+4, +7', 44: '+3, +4', 45: '+3', 46: '+2, +4', 47: '+1', 48: '+2',
  49: '+3', 50: '-4, +2, +4', 51: '-3, +3, +5', 52: '-2, +2, +4, +6',
  53: '-1, +1, +3, +5, +7', 54: '0, +2, +4, +6', 55: '+1', 56: '+2',
  57: '+3', 58: '+3, +4', 59: '+3', 60: '+3', 61: '+3', 62: '+2, +3',
  63: '+2, +3', 64: '+3', 65: '+3', 66: '+3', 67: '+3', 68: '+3',
  69: '+3', 70: '+2, +3', 71: '+3', 72: '+4', 73: '+5', 74: '+4, +6',
  75: '+4, +7', 76: '+4', 77: '+3, +4', 78: '+2, +4', 79: '+1, +3',
  80: '+1, +2', 81: '+1, +3', 82: '+2, +4', 83: '+3, +5', 84: '+2, +4',
  85: '-1, +1, +3, +5', 86: '0, +2', 87: '+1', 88: '+2', 89: '+3',
  90: '+4', 91: '+4, +5', 92: '+3, +4, +5, +6', 93: '+3, +4, +5, +6',
  94: '+3, +4, +5, +6', 95: '+3, +4', 96: '+3', 97: '+3, +4', 98: '+3',
  99: '+3', 100: '+3', 101: '+2, +3', 102: '+2, +3', 103: '+3',
  104: '+4', 105: '+5', 106: '+6', 107: '+7', 108: '+8',
  109: '+3', 110: '+2', 111: '+1', 112: '+2', 113: '+1', 114: '+2',
  115: '+1, +3', 116: '+2, +4', 117: '-1, +1, +3, +5', 118: '0',
};

async function main() {
  console.log('Fetching Bowserinator JSON...');
  const res = await fetch(BOWSER_URL);
  const data = await res.json();

  const elements = data.elements.map(el => ({
    number: el.number,
    symbol: el.symbol,
    name: el.name,
    atomic_mass: el.atomic_mass,
    category: el.category,
    category_normalized: normalizeCategory(el.category),
    appearance: el.appearance,
    phase: el.phase,
    density: el.density,
    melt: el.melt,
    boil: el.boil,
    molar_heat: el.molar_heat,
    period: el.period,
    group: el.group,
    block: el.block,
    electron_configuration: el.electron_configuration,
    electron_configuration_semantic: el.electron_configuration_semantic,
    shells: el.shells,
    electronegativity_pauling: el.electronegativity_pauling,
    electron_affinity: el.electron_affinity,
    ionization_energies: el.ionization_energies,
    discovered_by: el.discovered_by,
    named_by: el.named_by,
    summary: el.summary,
    source: el.source,
    xpos: el.xpos,
    ypos: el.ypos,
    cpk_hex: el['cpk-hex'],
    spectral_img: el.spectral_img,
    image: el.image,
    bohr_model_image: el.bohr_model_image,
    bohr_model_3d: el.bohr_model_3d,
    oxidation_states: OXIDATION_STATES[el.number] || 'N/A',
    group_name: getGroupName(el.group, el.category),
  }));

  const outPath = path.join(__dirname, '..', 'src', 'data', 'elements.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(elements, null, 2));
  console.log(`Wrote ${elements.length} elements to ${outPath}`);
}

main().catch(console.error);
