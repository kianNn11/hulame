import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rentalService } from '../services/api';
import { useAuth } from '../Context/AuthContext';

const RentalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const response = await rentalService.getRental(id);
        setRental(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch rental details:', err);
        setError('Failed to load rental details. Please try again.');
        setLoading(false);
      }
    };

    fetchRental();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this rental listing?')) {
      return;
    }
    
    try {
      setDeleting(true);
      await rentalService.deleteRental(id);
      navigate('/rentals');
    } catch (err) {
      console.error('Failed to delete rental:', err);
      setError(err.response?.data?.message || 'Failed to delete rental. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Link 
          to="/rentals" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Rentals
        </Link>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-lg mb-4">Rental not found</p>
        <Link 
          to="/rentals" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Rentals
        </Link>
      </div>
    );
  }

  const isOwner = user && rental.user_id === user.id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {rental.image ? (
              <img 
                src={rental.image} 
                alt={rental.title} 
                className="w-full h-64 md:h-auto object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-auto bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          
          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-4">{rental.title}</h1>
              <p className="text-2xl font-bold text-blue-600">₱{parseFloat(rental.price).toLocaleString()}</p>
            </div>
            
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Location:</span> {rental.location}
            </p>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{rental.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
              <p className="text-gray-700">
                <span className="font-medium">Posted by:</span> {rental.user?.name || 'Unknown User'}
              </p>
              {rental.user?.profile?.contact_number && (
                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span> {rental.user.profile.contact_number}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Link 
                to="/rentals" 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Listings
              </Link>
              
              {(isOwner || isAdmin) && (
                <>
                  <Link 
                    to={`/rentals/${rental.id}/edit`} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Listing
                  </Link>
                  
                  <button 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete Listing'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Similar Rentals</h2>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
};

export default RentalDetailPage;
