import React, { useState, useEffect } from 'react';
import { EyeIcon, HeartIcon, MapPinIcon, ClockIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import ViewDetails from '../Components/RentalSection/ViewDetails';
import { rentalService } from '../services/api';
import '../Components/RentalSection/RentalSection.css';

const ViewAllRentals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fix image URL construction for consistent display
  const getImageUrl = (imageData) => {
    if (!imageData) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    
    // Handle different image URL formats
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    // For relative paths from backend
    if (imageData.startsWith('storage/') || imageData.startsWith('/storage/')) {
      return `http://localhost:8000/${imageData.replace(/^\//, '')}`;
    }
    
    // Default construction
    return `http://localhost:8000/storage/${imageData}`;
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await rentalService.getAllRentals();
        const rentalData = response.data.data || response.data || [];
        setRentals(rentalData);
        setFilteredRentals(rentalData);
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

  useEffect(() => {
    let filtered = [...rentals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(rental =>
        rental.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredRentals(filtered);
  }, [rentals, searchTerm, statusFilter, sortBy]);

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
        <div className="view-all-header">
          <h1>All Rentals</h1>
        </div>
        <div className="rental-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading all rentals...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="rental-section-main">
        <div className="view-all-header">
          <h1>All Rentals</h1>
        </div>
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
      <div className="view-all-header">
        <div className="header-content">
          <h1>All Rentals ({filteredRentals.length})</h1>
          <p>Discover quality items for rent from our community</p>
        </div>
      </div>

      <div className="rental-container">
        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-bar">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search rentals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <FunnelIcon className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {filteredRentals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No rentals found</h3>
            <p className="empty-state-description">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No rentals available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="rental-grid">
            {filteredRentals.map((rental, index) => (
              <article 
                key={rental.id} 
                className="rental-card"
                style={{ animationDelay: `${index * 0.05}s` }}
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

export default ViewAllRentals; 