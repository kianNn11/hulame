import React, { useState, useEffect, useRef } from 'react';
import './UserNavbar.css';
import logo from '../Assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/solid';
import {
  UserCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  HomeIcon,
  PlusIcon,
  InformationCircleIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../Context/AuthContext';

const UserNavbar = () => {
  const { logout } = useAuth(); 

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const navItems = [
    { path: '/rental-section', label: 'Browse', icon: HomeIcon },
    { path: '/post', label: 'List Item', icon: PlusIcon },
    { path: '/transactions', label: 'Transactions', icon: CurrencyDollarIcon },
    { path: '/about-us', label: 'About', icon: InformationCircleIcon },
    { path: '/contact', label: 'Contact', icon: PhoneIcon },
  ];

  const getActiveMenu = () => { // eslint-disable-line no-unused-vars
    switch (location.pathname) {
      case '/rental-section':
        return 'rental';
      case '/about':
        return 'about';
      case '/contact':
        return 'contact';
      case '/profile':
        return 'profile';
      default:
        return '';
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotificationModal((prev) => !prev);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationModal(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      default:
        return ClockIcon;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <nav className={`modern-navbar ${scrolled ? 'scrolled' : ''}`} ref={menuRef}>
      <div className="navbar-container">
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <XMarkIcon className="menu-icon" /> : <Bars3Icon className="menu-icon" />}
        </button>

        {/* Logo */}
        <Link to="/rental-section" className="navbar-logo">
          <img src={logo} alt="Hulam-e" className="logo-image" />
        </Link>

        {/* Desktop Navigation */}
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

        {/* User Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="notification-container" ref={notificationRef}>
            <button 
              className="action-button notification-btn" 
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <BellIcon className="action-icon" />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {/* Notification Modal */}
            {showNotificationModal && (
              <div className="notification-modal">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="mark-all-read-btn">
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <BellIcon className="no-notifications-icon" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      const iconColor = getNotificationColor(notification.type);
                      
                      return (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="notification-icon-wrapper">
                            <IconComponent 
                              className="notification-type-icon" 
                              style={{ color: iconColor }}
                            />
                          </div>
                          <div className="notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <span className="notification-time">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <button 
                            className="clear-notification-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                          >
                            <XMarkIcon className="clear-icon" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <Link to="/profile" className={`action-button ${location.pathname === '/profile' ? 'active' : ''}`} aria-label="Profile">
            <UserCircleIcon className="action-icon" />
          </Link>

          {/* Logout */}
          <button
            className="action-button logout-btn"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Logout"
          >
            <ArrowLeftEndOnRectangleIcon className="action-icon" />
          </button>
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
                to="/profile"
                className={`mobile-menu-item ${location.pathname === '/profile' ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <UserCircleIcon className="mobile-menu-icon" />
                <span>Profile</span>
              </Link>

              <button
                className="mobile-menu-item logout-item"
                onClick={() => {
                  setMenuOpen(false);
                  setShowLogoutModal(true);
                }}
              >
                <ArrowLeftEndOnRectangleIcon className="mobile-menu-icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={cancelLogout}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <ArrowLeftEndOnRectangleIcon className="modal-icon" />
              <h3 className="modal-title">Confirm Logout</h3>
            </div>
            <p className="modal-message">Are you sure you want to log out of your account?</p>
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

export default UserNavbar;
