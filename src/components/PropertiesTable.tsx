import React from 'react';
import type { Element } from '../types/Element';
import { formatValue } from '../utils/elementUtils';

interface PropertiesTableProps {
  element: Element;
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({ element }) => {
  const properties = [
    { label: 'Atomic Number', value: String(element.number) },
    { label: 'Atomic Mass', value: formatValue(element.atomic_mass, 'u') },
    { label: 'Phase (STP)', value: element.phase || '—' },
    { label: 'Density', value: formatValue(element.density, element.phase === 'Gas' ? 'g/L' : 'g/cm³') },
    { label: 'Melting Point', value: formatValue(element.melt, 'K') },
    { label: 'Boiling Point', value: formatValue(element.boil, 'K') },
    { label: 'Molar Heat', value: formatValue(element.molar_heat, 'J/(mol·K)') },
    { label: 'Electronegativity', value: formatValue(element.electronegativity_pauling, '(Pauling)') },
    { label: 'Electron Affinity', value: formatValue(element.electron_affinity, 'kJ/mol') },
    { label: 'Ionization Energy', value: element.ionization_energies?.[0] ? `${element.ionization_energies[0]} kJ/mol` : '—' },
    { label: 'Electron Configuration', value: element.electron_configuration_semantic || element.electron_configuration },
    { label: 'Oxidation States', value: element.oxidation_states || '—' },
    { label: 'Block', value: element.block?.toUpperCase() || '—' },
    { label: 'Group', value: element.group ? String(element.group) : '—' },
    { label: 'Period', value: String(element.period) },
    { label: 'Appearance', value: element.appearance || '—' },
  ];

  return (
    <div className="properties-grid">
      {properties.map(prop => (
        <div className="property-row" key={prop.label}>
          <span className="property-label">{prop.label}</span>
          <span className="property-value">{prop.value}</span>
        </div>
      ))}
    </div>
  );
};

export default PropertiesTable;
