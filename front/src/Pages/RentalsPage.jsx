import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalService } from '../services/api';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

// Enhanced RentalCard component with status badges
const RentalCard = ({ rental, onRefresh }) => {
  const imageUrl = rental.image 
    ? `http://localhost:8000/storage/${rental.image}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  const getStatusBadge = (status) => {
    const badges = {
      available: 'bg-green-100 text-green-800 border-green-200',
      rented: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      unavailable: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || badges.available;
  };

  const getStatusText = (status) => {
    const texts = {
      available: '✓ Available',
      rented: '📅 Rented',
      unavailable: '✗ Unavailable'
    };
    return texts[status] || 'Available';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={rental.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(rental.status)}`}>
            {getStatusText(rental.status)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-1">{rental.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">{rental.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">₱{parseFloat(rental.price).toFixed(2)}</span>
          <span className="text-sm text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded">
            📍 {rental.location}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-2">
          <span>Posted by: <span className="font-medium">{rental.user?.name || 'Unknown'}</span></span>
          <span>{new Date(rental.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  useEffect(() => {
    fetchRentals();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = rentals.filter(rental => 
        rental.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRentals(filtered);
    } else {
      setFilteredRentals(rentals);
    }
  }, [searchTerm, rentals]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing rentals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p className="text-xl">{error}</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Rental Marketplace</h1>
          <p className="text-gray-600 mt-1">
            {filteredRentals.length} {filteredRentals.length === 1 ? 'item' : 'items'} available
          </p>
        </div>
        <Link 
          to="/post" 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          Post a Rental
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, location, description, or poster..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            {filteredRentals.length} result(s) for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Content */}
      {filteredRentals.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No matches found' : 'No rentals yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all rentals.' 
                : 'Be the first to post an item for rent in the marketplace!'
              }
            </p>
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                Show All Rentals
              </button>
            ) : (
              <Link 
                to="/post" 
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Post the First Rental
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRentals.map(rental => (
            <RentalCard key={rental.id} rental={rental} onRefresh={handleRefresh} />
          ))}
        </div>
      )}

      {/* Refresh Button */}
      {filteredRentals.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Refresh Listings
          </button>
        </div>
      )}
    </div>
  );
};

export default RentalsPage;
