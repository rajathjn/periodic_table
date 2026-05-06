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
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AtomBackground from './components/AtomBackground';
import HomePage from './pages/HomePage';
import ElementPage from './pages/ElementPage';
import LicensePage from './pages/LicensePage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AtomBackground />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/elements/:symbol" element={<ElementPage />} />
        <Route path="/license" element={<LicensePage />} />
        <Route path="/about" element={<LicensePage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
