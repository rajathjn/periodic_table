import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="6" fill="#ffffff" />
            <ellipse cx="32" cy="32" rx="26" ry="9" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            <ellipse cx="32" cy="32" rx="26" ry="9" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" transform="rotate(60 32 32)" />
            <ellipse cx="32" cy="32" rx="26" ry="9" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" transform="rotate(120 32 32)" />
          </svg>
          <span className="header-logo-text">Periodic Table</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>
          <Link to="/license" className={isActive('/license') ? 'active' : ''}>License</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
