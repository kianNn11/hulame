import React, { useState, useEffect, useRef } from 'react';
import './UserNavbar.css'; // Use UserNavbar styles for consistency
import logo from '../Assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { HomeIcon, InformationCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';

const GuestNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Rent Now', icon: HomeIcon },
    { path: '/about-us', label: 'About Us', icon: InformationCircleIcon },
    { path: '/contact', label: 'Contact', icon: PhoneIcon },
  ];

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="modern-navbar" ref={menuRef}>
      <div className="navbar-container">
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <XMarkIcon className="menu-icon" /> : <Bars3Icon className="menu-icon" />}
        </button>

        {/* Logo - Centered */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Hulam-e" className="logo-image" />
        </Link>

        {/* Desktop Navigation - Left Side */}
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Login and Register Buttons - Right Side */}
        <div className="navbar-actions">
          <Link to="/register" className="action-button register-btn">
            <span>Register</span>
          </Link>
          <Link to="/login" className="action-button login-btn">
            <span>Login</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <img src={logo} alt="Hulam-e" className="mobile-logo-image" />
              </div>
              <button onClick={() => setMenuOpen(false)} className="mobile-close-btn">
                <XMarkIcon className="close-icon" />
              </button>
            </div>

            <div className="mobile-menu-items">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="mobile-menu-icon" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="mobile-menu-divider"></div>

              <Link
                to="/register"
                className="mobile-menu-item"
                onClick={() => setMenuOpen(false)}
              >
                <span>Register</span>
              </Link>

              <Link
                to="/login"
                className="mobile-menu-item"
                onClick={() => setMenuOpen(false)}
              >
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GuestNavbar;
