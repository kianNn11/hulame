import React, { useState } from 'react';
import './UserNavbar.css'; // Use UserNavbar styles for consistency
import logo from '../Assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

const AdminNavbar = () => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Logo - Centered */}
        <Link to="/dashboard" className="navbar-logo">
          <img src={logo} alt="Hulam-e" className="logo-image" />
        </Link>

        {/* Navigation Menu - Left Side */}
        <ul className="navbar-menu">
          <li>
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/account-confirmation"
              className={`nav-link ${location.pathname === '/account-confirmation' ? 'active' : ''}`}
            >
              <span>Account Confirmation</span>
            </Link>
          </li>
          <li>
            <Link
              to="/user-management"
              className={`nav-link ${location.pathname === '/user-management' ? 'active' : ''}`}
            >
              <span>User Management</span>
            </Link>
          </li>
        </ul>

        {/* User Actions - Right Side */}
        <div className="navbar-actions">
          <button
            className="action-button logout-btn"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
          >
            <ArrowLeftEndOnRectangleIcon className="action-icon" />
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={cancelLogout}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <ArrowLeftEndOnRectangleIcon className="modal-icon" />
              <h3 className="modal-title">Confirm Logout</h3>
            </div>
            <p className="modal-message">Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button onClick={cancelLogout} className="modal-btn secondary">
                Cancel
              </button>
              <button onClick={confirmLogout} className="modal-btn primary">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;