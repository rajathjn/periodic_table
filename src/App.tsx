import React from 'react';
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
