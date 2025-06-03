import React, { useState, useEffect } from 'react'
import { useAuth } from '../Context/AuthContext'
import { userService, rentalService } from '../services/api'
import Profile from '../Components/ProfileSection/Profile'
import Toast from '../Components/Toast/Toast'
import './ProfilePage.css'
// Icons kept for future rental section implementation
import { 
  CurrencyDollarIcon, // eslint-disable-line no-unused-vars
  MapPinIcon, // eslint-disable-line no-unused-vars
  EyeIcon, // eslint-disable-line no-unused-vars
  PencilSquareIcon, // eslint-disable-line no-unused-vars
  TrashIcon, // eslint-disable-line no-unused-vars
  PlusIcon, // eslint-disable-line no-unused-vars
  ClockIcon, // eslint-disable-line no-unused-vars
  CheckCircleIcon, // eslint-disable-line no-unused-vars
  XCircleIcon, // eslint-disable-line no-unused-vars
  FunnelIcon, // eslint-disable-line no-unused-vars
  MagnifyingGlassIcon, // eslint-disable-line no-unused-vars
  ChartBarIcon, // eslint-disable-line no-unused-vars
  CalendarDaysIcon, // eslint-disable-line no-unused-vars
  HeartIcon, // eslint-disable-line no-unused-vars
  ShareIcon, // eslint-disable-line no-unused-vars
  PhotoIcon // eslint-disable-line no-unused-vars
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom' // eslint-disable-line no-unused-vars

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [rentals, setRentals] = useState([]);
  // State variables kept for future rental section implementation
  const [filteredRentals, setFilteredRentals] = useState([]); // eslint-disable-line no-unused-vars
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // eslint-disable-line no-unused-vars
  const [statusFilter, setStatusFilter] = useState('all'); // eslint-disable-line no-unused-vars
  const [sortBy, setSortBy] = useState('newest'); // eslint-disable-line no-unused-vars

  // For debugging, uncomment when needed
  // const logState = () => {
  //   console.log('ProfilePage state:', { 
  //     user, 
  //     loading, 
  //     error, 
  //     userProfile,
  //     successMessage 
  //   });
  // };

  useEffect(() => {
    // Update user's last seen activity
    const updateLastSeen = async () => {
      if (user?.id) {
        try {
          await userService.updateProfile({ 
            last_seen: new Date().toISOString() 
          });
        } catch (err) {
          console.log('Failed to update activity:', err);
        }
      }
    };

    updateLastSeen();
    
    // Set up interval to update activity every 5 minutes
    const activityInterval = setInterval(updateLastSeen, 5 * 60 * 1000);
    
    return () => clearInterval(activityInterval);
  }, [user?.id]);

  useEffect(() => {
    // Fetch the current user's profile when component mounts
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getCurrentUser();
        console.log('User profile response:', response.data);
        
        const userData = response.data.user || response.data;
        setUserProfile(userData);
        
        // Also fetch user's rentals if applicable
        try {
          const rentalsResponse = await userService.getUserRentals(userData.id);
          const rentalsData = rentalsResponse.data.data || rentalsResponse.data || [];
          console.log('Rentals response:', rentalsData);
          setRentals(rentalsData);
        } catch (rentalsErr) {
          console.error('Failed to fetch rentals:', rentalsErr);
          setRentals([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Filter and sort rentals based on search and filter criteria
    let filtered = [...rentals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(rental => 
        rental.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'price-high':
          return parseFloat(b.price || 0) - parseFloat(a.price || 0);
        case 'price-low':
          return parseFloat(a.price || 0) - parseFloat(b.price || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    setFilteredRentals(filtered);
  }, [rentals, searchTerm, statusFilter, sortBy]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      console.log('ProfilePage received update data:', updatedData);
      
      // Map form fields to database fields
      const updatePayload = {
        name: updatedData.fullName,
        course_year: updatedData.courseYear,
        birthday: updatedData.birthday,
        gender: updatedData.gender,
        social_link: updatedData.socialLink,
        contact_number: updatedData.contactNumber
      };
      
      // Only include profile_picture if it's not empty
      if (updatedData.profileImage && updatedData.profileImage.trim() !== '') {
        updatePayload.profile_picture = updatedData.profileImage;
      }
      
      console.log('Sending to API:', updatePayload);
      
      // Update local state immediately for instant feedback
      const optimisticUpdate = {
        ...userProfile,
        name: updatePayload.name,
        course_year: updatePayload.course_year,
        birthday: updatePayload.birthday,
        gender: updatePayload.gender,
        social_link: updatePayload.social_link,
        contact_number: updatePayload.contact_number,
        profile_picture: updatePayload.profile_picture,
        // Also update camelCase versions
        courseYear: updatePayload.course_year,
        socialLink: updatePayload.social_link,
        contactNumber: updatePayload.contact_number,
        profileImage: updatePayload.profile_picture
      };
      
      setUserProfile(optimisticUpdate);
      if (typeof setUser === 'function') {
        setUser(prevUser => ({ ...prevUser, ...optimisticUpdate }));
      }
      
      const response = await userService.updateProfile(updatePayload);
      console.log('Update profile response:', response);
      
      // Check for API error response
      if (response && response.success === false) {
        console.error('API returned error:', response.message || response.error);
        
        // Handle authentication errors
        if (response.needsLogin) {
          setError('Your session has expired. Please log in again.');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          setLoading(false);
          return false;
        }
        
        // Handle validation errors
        if (response.validationErrors) {
          const errorMessages = Object.values(response.validationErrors).flat();
          setError(`Validation failed: ${errorMessages.join(', ')}`);
        } else {
          setError(response.message || 'Failed to update profile');
        }
        
        // Revert optimistic update on error
        setUserProfile(userProfile);
        if (typeof setUser === 'function') {
          setUser(user);
        }
        setLoading(false);
        return false;
      }
      
      // Handle successful response
      const updatedUser = response.user || response.data?.user || response;
      
      if (updatedUser && updatedUser.id) {
        // Create final merged user object
        const finalUser = {
          ...optimisticUpdate,
          ...updatedUser,
          // Ensure image is properly updated
          profile_picture: updatedUser.profile_picture || updatePayload.profile_picture,
          profileImage: updatedUser.profile_picture || updatePayload.profile_picture
        };
        
        setUserProfile(finalUser);
        if (typeof setUser === 'function') {
          setUser(prevUser => ({ ...prevUser, ...finalUser }));
        }
      }
      
      setLoading(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return true;
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
      // Revert optimistic update on error
      if (userProfile) {
        setUserProfile(userProfile);
      }
      if (typeof setUser === 'function' && user) {
        setUser(user);
      }
      setLoading(false);
      return false;
    }
  }

  // Always show toast if present
  const toast = successMessage && (
    <Toast 
      message={successMessage} 
      type="success" 
      onClose={() => setSuccessMessage('')}
    />
  );

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{toast}{error}</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">{toast}Please log in to view your profile.</div>;
  }

  // Debug the current state before rendering
  console.log('ProfilePage render state:', { 
    hasUser: !!user, 
    hasUserProfile: !!userProfile,
    loading,
    error,
    successMessage
  });

  // Safeguard against incomplete data
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">{toast}Loading profile...</div>;
  }

  // Don't attempt to render with null user data
  if (!user || !userProfile) {
    return <div className="flex justify-center items-center min-h-screen">{toast}Please log in to view your profile.</div>;
  }

  // Determine active tab based on current path
  const activeTab = 'post'; // Default to 'post' for profile page

  // Log userProfile at render for debugging
  console.log('userProfile at render:', userProfile);

  return (
    <div className="container mx-auto px-4 py-8">
      {toast}
      
      <Profile user={userProfile} onUpdate={handleProfileUpdate} activeTab={activeTab} />
    </div>
  );
}

export default ProfilePage