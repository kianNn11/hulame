import React from 'react'
import logo from '../Assets/logo.png'
import './Footer.css'
import { Link } from 'react-router-dom'
import HomeLink from '../../Context/HomeLink'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-links">
            {/* Brand Section */}
            <div className="footer-section brand-section">
              <div className="footer-brand">
                <img src={logo} alt="Hulam-e" className='footer-logo'/>
              </div>
              <p className="brand-description">
                Making student life easier through community sharing and support. 
                Empowering USTP students with affordable access to quality academic resources.
              </p>
              
              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <EnvelopeIcon className="contact-icon" />
                  <span>support@hulam-e.com</span>
                </div>
                <div className="contact-item">
                  <PhoneIcon className="contact-icon" />
                  <span>+63 912 345 6789</span>
                </div>
                <div className="contact-item">
                  <MapPinIcon className="contact-icon" />
                  <span>Cagayan de Oro, Philippines</span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div className="footer-section">
              <h4>PLATFORM</h4>
              <ul>
                <li><HomeLink /></li>
                <li><Link to="/rental-section">Browse Rentals</Link></li>
                <li><Link to="/post">List Your Item</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-section">
              <h4>COMPANY</h4>
              <ul>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/help">Help Center</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="footer-section">
              <h4>LEGAL & SUPPORT</h4>
              <ul>
                <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                <li><Link to="/privacy-and-security">Privacy & Security</Link></li>
                <li><Link to="/safety">Safety Guidelines</Link></li>
                <li><Link to="/community-guidelines">Community Guidelines</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="footer-social">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-2.509 0-4.541-2.032-4.541-4.541s2.032-4.541 4.541-4.541 4.541 2.032 4.541 4.541-2.032 4.541-4.541 4.541zm7.058 0c-2.509 0-4.541-2.032-4.541-4.541s2.032-4.541 4.541-4.541 4.541 2.032 4.541 4.541-2.032 4.541-4.541 4.541z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>Secure</span>
              </div>
              <div className="badge">
                <span className="badge-icon">✓</span>
                <span>Trusted</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🎓</span>
                <span>Student-Focused</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>© {currentYear} Hulam-e. All rights reserved.</p>
            </div>
            <div className="footer-credits">
              <span>Made with</span>
              <HeartIcon className="heart-icon" />
              <span>for the USTP student community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer