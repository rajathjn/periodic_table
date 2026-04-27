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
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="6" fill="url(#logo-g)" />
            <ellipse cx="32" cy="32" rx="26" ry="9" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
            <ellipse cx="32" cy="32" rx="26" ry="9" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.7" transform="rotate(60 32 32)" />
            <ellipse cx="32" cy="32" rx="26" ry="9" fill="none" stroke="#818cf8" strokeWidth="1.5" opacity="0.7" transform="rotate(120 32 32)" />
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
