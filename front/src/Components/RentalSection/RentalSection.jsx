import React, { useState, useEffect } from 'react';
import banner from '../Assets/banner.jpg';
import './RentalSection.css';
import { EyeIcon, HeartIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import ViewDetails from './ViewDetails';
import { rentalService } from '../../services/api';
import { Link } from 'react-router-dom';

const RentalSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const getImageUrl = (imageData) => {
    if (!imageData) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    if (imageData.startsWith('storage/') || imageData.startsWith('/storage/')) {
      return `http://localhost:8000/${imageData.replace(/^\//, '')}`;
    }
    
    return `http://localhost:8000/storage/${imageData}`;
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await rentalService.getAllRentals();
        const rentalData = response.data.data || response.data || [];
        setRentals(rentalData.slice(0, 10));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch rentals:', err);
        setError('Failed to load rentals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const openModal = (rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRental(null);
  };

  const toggleFavorite = (rentalId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(rentalId)) {
        newFavorites.delete(rentalId);
      } else {
        newFavorites.add(rentalId);
      }
      return newFavorites;
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { text: 'Available', class: 'status-available' },
      rented: { text: 'Rented', class: 'status-rented' },
      unavailable: { text: 'Unavailable', class: 'status-unavailable' }
    };
    return statusConfig[status] || statusConfig.available;
  };

  if (loading) {
    return (
      <main className="rental-section-main">
        <section className="rental-hero">
          <div className="rental-hero-overlay"></div>
          <img src={banner} alt="Banner" className="rental-hero-image" />
          <div className="rental-hero-content">
            <h1 className="rental-hero-title">Rental Marketplace</h1>
            <p className="rental-hero-subtitle">
              Discover quality items for rent at affordable prices
            </p>
          </div>
        </section>
        
        <div className="rental-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading amazing rentals...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="rental-section-main">
        <section className="rental-hero">
          <div className="rental-hero-overlay"></div>
          <img src={banner} alt="Banner" className="rental-hero-image" />
          <div className="rental-hero-content">
            <h1 className="rental-hero-title">Rental Marketplace</h1>
            <p className="rental-hero-subtitle">
              Discover quality items for rent at affordable prices
            </p>
          </div>
        </section>
        
        <div className="rental-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Oops! Something went wrong</h3>
            <p className="error-message">{error}</p>
            <button 
              className="error-retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="rental-section-main">
      <section className="rental-hero">
        <div className="rental-hero-overlay"></div>
        <img src={banner} alt="Banner" className="rental-hero-image" />
        <div className="rental-hero-content">
          <h1 className="rental-hero-title">Rental Marketplace</h1>
          <p className="rental-hero-subtitle">
            Discover quality items for rent at affordable prices
          </p>
          <div className="rental-hero-stats">
            <div className="stat-item">
              <span className="stat-number">{rentals.length}</span>
              <span className="stat-label">Items Available</span>
            </div>
          </div>
        </div>
      </section>

      <div className="rental-container">
        {rentals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No rentals available yet</h3>
            <p className="empty-state-description">
              Be the first to share your items and start earning!
            </p>
            <Link to="/post" className="empty-state-cta">
              <span>Post Your First Item</span>
              <svg className="cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="rental-header">
              <div className="rental-header-content">
                <h2 className="rental-section-title">Featured Rentals</h2>
                <p className="rental-section-description">
                  Browse through our collection of quality items available for rent
                </p>
              </div>
              <Link to="/post" className="rental-post-btn">
                <span>List Your Item</span>
              </Link>
            </div>

            <div className="rental-grid">
              {rentals.map((rental, index) => (
                <article 
                  key={rental.id} 
                  className="rental-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="rental-card-image-container">
                    <img 
                      src={getImageUrl(rental.image)} 
                      alt={rental.title} 
                      className="rental-card-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                      }}
                    />
                    <div className="rental-card-overlay">
                      <button 
                        className="favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(rental.id);
                        }}
                      >
                        {favorites.has(rental.id) ? 
                          <HeartSolidIcon className="favorite-icon favorited" /> :
                          <HeartIcon className="favorite-icon" />
                        }
                      </button>
                      <div className={`status-badge ${getStatusBadge(rental.status).class}`}>
                        {getStatusBadge(rental.status).text}
                      </div>
                    </div>
                  </div>

                  <div className="rental-card-content">
                    <div className="rental-card-header">
                      <h3 className="rental-card-title">{rental.title}</h3>
                      <div className="rental-price-tag">
                        <span className="price-amount">₱{parseFloat(rental.price).toFixed(2)}</span>
                        <span className="price-period">/day</span>
                      </div>
                    </div>
                    
                    <div className="rental-card-meta">
                      <div className="meta-item">
                        <MapPinIcon className="meta-icon" />
                        <span className="meta-text">{rental.location}</span>
                      </div>
                      <div className="meta-item">
                        <ClockIcon className="meta-icon" />
                        <span className="meta-text">Posted {new Date(rental.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="rental-card-description">
                      {rental.description.length > 80 
                        ? `${rental.description.substring(0, 80)}...` 
                        : rental.description
                      }
                    </p>

                    <div className="rental-card-footer">
                      <div className="rental-card-owner">
                        <div className="owner-avatar">
                          {rental.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="owner-name">{rental.user?.name || 'Unknown'}</span>
                      </div>
                      
                      <button 
                        className="view-details-btn" 
                        onClick={() => openModal(rental)}
                      >
                        <EyeIcon className="view-icon" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="rental-footer">
              <Link to="/view-all-rentals" className="view-all-btn">
                <span>View All Rentals</span>
                <svg className="view-all-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>

      {isModalOpen && selectedRental && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ViewDetails rental={selectedRental} onClose={closeModal} />
          </div>
        </div>
      )}
    </main>
  );
};

export default RentalSection;
