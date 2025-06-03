import React, { useState, useEffect } from 'react'
import EarningsSection from '../Components/ProfileSection/EarningsSection'
import Profile from '../Components/ProfileSection/Profile'
import { useAuth } from '../Context/AuthContext'
import { userService } from '../services/api'
import Toast from '../Components/Toast/Toast'

const EarningsPage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      console.log('EarningsPage received update data:', updatedData);
      
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
    return <div className="flex justify-center items-center min-h-screen">{toast}Please log in to view your earnings.</div>;
  }

  // Debug the current state before rendering
  console.log('EarningsPage render state:', { 
    hasUser: !!user, 
    hasUserProfile: !!userProfile,
    loading,
    error,
    successMessage
  });

  // Safeguard against incomplete data
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">{toast}Loading earnings...</div>;
  }

  // Don't attempt to render with null user data
  if (!user || !userProfile) {
    return <div className="flex justify-center items-center min-h-screen">{toast}Please log in to view your earnings.</div>;
  }

  // Set active tab to 'earnings' for earnings page
  const activeTab = 'earnings';

  // Log userProfile at render for debugging
  console.log('userProfile at render:', userProfile);

  return (
    <div className="container mx-auto px-4 py-8">
      {toast}
      
      <Profile user={userProfile} onUpdate={handleProfileUpdate} activeTab={activeTab} />
      <EarningsSection />
    </div>
  );
}

export default EarningsPage