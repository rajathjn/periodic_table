/**
 * ElectronConfigSection — Displays electron configuration details.
 *
 * Shows full configuration, noble gas notation, and shell distribution.
 */
import React from 'react';
import type { Element } from '@/types/Element';

interface ElectronConfigSectionProps {
  element: Element;
}

const ElectronConfigSection: React.FC<ElectronConfigSectionProps> = ({ element }) => {
  return (
    <section className="element-section">
      <h2>
        <span className="section-icon">🔬</span> Electron Configuration
      </h2>
      <div className="electron-config-box">{element.electron_configuration}</div>
      {element.electron_configuration_semantic && (
        <div className="electron-config-notation">
          Noble gas notation:{' '}
          <span className="electron-config-value">
            {element.electron_configuration_semantic}
          </span>
        </div>
      )}
      <div className="electron-config-shells">
        Electron shells: {element.shells.join(', ')}
      </div>
    </section>
  );
};

export default React.memo(ElectronConfigSection);
