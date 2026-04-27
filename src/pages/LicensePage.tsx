import React, { useEffect } from 'react';

const LicensePage: React.FC = () => {
  useEffect(() => {
    document.title = 'License & Credits — Periodic Table';
  }, []);

  return (
    <div className="license-page animate-fadeInUp">
      <h1 className="gradient-text">License & Credits</h1>

      <h2>Data Sources</h2>
      <ul>
        <li>
          <strong>Bowserinator Periodic Table JSON</strong> — Comprehensive element dataset including summaries, electron configurations,
          and Bohr model images. Free to use with attribution.
          <br />
          <a href="https://github.com/Bowserinator/Periodic-Table-JSON" target="_blank" rel="noopener noreferrer">
            github.com/Bowserinator/Periodic-Table-JSON
          </a>
        </li>
        <li>
          <strong>PubChem Periodic Table</strong> — Authoritative chemical element data from the National Library of Medicine (Public Domain).
          <br />
          <a href="https://pubchem.ncbi.nlm.nih.gov/periodic-table/" target="_blank" rel="noopener noreferrer">
            pubchem.ncbi.nlm.nih.gov/periodic-table
          </a>
        </li>
        <li>
          <strong>NIST Periodic Table</strong> — Critically-evaluated atomic property data from the National Institute of Standards and Technology (Public Domain).
          <br />
          <a href="https://www.nist.gov/pml/periodic-table-elements" target="_blank" rel="noopener noreferrer">
            nist.gov/pml/periodic-table-elements
          </a>
        </li>
        <li>
          <strong>Wikipedia / Simple Wikipedia</strong> — Element descriptions and historical information (CC BY-SA 3.0).
          <br />
          <a href="https://en.wikipedia.org/" target="_blank" rel="noopener noreferrer">
            en.wikipedia.org
          </a>
        </li>
      </ul>

      <h2>Images</h2>
      <p>
        Element sample photographs are sourced from <strong>Wikimedia Commons</strong> and
        <strong> images-of-elements.com</strong>. Individual attributions are displayed alongside each image
        on the element detail pages.
      </p>
      <ul>
        <li>
          <strong>Images of Elements</strong> — High-resolution photographs by Jurii and other contributors (CC BY 3.0).
          <br />
          <a href="https://images-of-elements.com/" target="_blank" rel="noopener noreferrer">
            images-of-elements.com
          </a>
        </li>
        <li>
          <strong>Wikimedia Commons</strong> — Various contributors, licenses noted per image (CC BY-SA 3.0/4.0, Public Domain).
          <br />
          <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer">
            commons.wikimedia.org
          </a>
        </li>
      </ul>

      <h2>Bohr Model Visualizations</h2>
      <p>
        Bohr model images from Google's Arts & Experiments Periodic Table, hosted on Google Cloud Storage.
        3D atom models rendered using Three.js with React Three Fiber.
      </p>

      <h2>Libraries & Frameworks</h2>
      <ul>
        <li><strong>React</strong> — MIT License</li>
        <li><strong>Vite</strong> — MIT License</li>
        <li><strong>Three.js</strong> — MIT License</li>
        <li><strong>React Three Fiber</strong> — MIT License</li>
        <li><strong>Drei</strong> — MIT License</li>
        <li><strong>React Router</strong> — MIT License</li>
        <li><strong>Zustand</strong> — MIT License</li>
        <li><strong>TypeScript</strong> — Apache 2.0 License</li>
      </ul>

      <h2>Fonts</h2>
      <ul>
        <li><strong>Inter</strong> by Rasmus Andersson — SIL Open Font License</li>
        <li><strong>Outfit</strong> by Rodrigo Fuenzalida — SIL Open Font License</li>
        <li><strong>JetBrains Mono</strong> by JetBrains — SIL Open Font License</li>
      </ul>

      <h2>Content License</h2>
      <p>
        Element descriptions on this site are compiled and paraphrased from publicly available sources including
        Wikipedia (CC BY-SA), PubChem (Public Domain), and NIST (Public Domain). Original content on this site
        is available under the <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
          Creative Commons Attribution-ShareAlike 4.0 International License
        </a>.
      </p>
    </div>
  );
};

export default LicensePage;
