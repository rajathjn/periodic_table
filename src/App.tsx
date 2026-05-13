/**
 * App — Root application component.
 *
 * Sets up client-side routing with HashRouter (for GitHub Pages compatibility)
 * and renders the persistent header, floating atom background, and page routes.
 *
 * Routes:
 *   /                   → HomePage  (periodic table grid + "Discover" section)
 *   /elements/:symbol   → ElementPage (detailed element view with 3D model)
 *   /license            → LicensePage (data sources and credits)
 *   /about              → LicensePage (alias for /license)
 */
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import AtomBackground from '@/components/AtomBackground';
import HomePage from '@/pages/HomePage';
import ElementPage from '@/pages/ElementPage';
import LicensePage from '@/pages/LicensePage';

/**
 * Wrapper that reads the :symbol route param and passes it as a `key`.
 * When the key changes React fully remounts ElementPage, which naturally
 * resets all internal state (e.g. the orbit/orbital model toggle) without
 * needing setState-in-effect or ref-during-render workarounds.
 */
const ElementPageWrapper: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  return <ElementPage key={symbol} />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      {/* Accessibility: skip-to-content link */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AtomBackground />
      <Header />
      <div id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/elements/:symbol" element={<ElementPageWrapper />} />
          <Route path="/license" element={<LicensePage />} />
          <Route path="/about" element={<LicensePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;

