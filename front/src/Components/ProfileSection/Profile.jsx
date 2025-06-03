import React, { useState, useEffect } from 'react';
import './Profile.css';
import { PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';
import StudentVerificationModal from './StudentVerificationModal';
import PostContent from './PostContent'; // ✅ Import PostContent
// eslint-disable-next-line no-unused-vars
import { userService } from '../../services/api'; // Import userService for verification
import Spinner from '../Spinner/Spinner'; // Import Spinner for loading state

const Profile = ({ user, onUpdate, activeTab = 'post' }) => {
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationClicked, setIsVerificationClicked] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [localProfileData, setLocalProfileData] = useState(null);
  
  // Debug log current props and state
  console.log('Profile component - user:', user);
  
  // Display success message if available
  const showSuccessMessage = successMessage && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
      {successMessage}
    </div>
  );

  // Effect to update local profile data when user prop changes
  useEffect(() => {
    if (user) {
      const newProfileData = {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        verified: user.verified || false,
        bio: user.bio || '',
        profile_picture: user.profile_picture || null,
        course_year: user.course_year || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
        social_link: user.social_link || '',
        contact_number: user.contact_number || '',
        profileImage: user.profile_picture || null,
      };
      setLocalProfileData(newProfileData);
    }
  }, [user]);
  
  // Use localProfileData with immediate updates, fallback to user prop
  const profileData = localProfileData || (user ? {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    verified: user.verified || false,
    bio: user.bio || '',
    profile_picture: user.profile_picture || null,
    course_year: user.course_year || '',
    birthday: user.birthday || '',
    gender: user.gender || '',
    social_link: user.social_link || '',
    contact_number: user.contact_number || '',
    profileImage: user.profile_picture || null,
  } : null);
  
  // Log the profile data for debugging
  console.log('Profile data being passed to modal:', profileData);

  const handleSave = async (data) => {
    setIsUpdating(true);
    setUpdateError(null);
    setSuccessMessage('');
    
    try {
      console.log('Profile: Saving profile data:', data);
      
      // Update local state immediately for instant UI feedback
      if (profileData) {
        const updatedProfileData = {
          ...profileData,
          name: data.fullName || profileData.name,
          course_year: data.courseYear || profileData.course_year,
          birthday: data.birthday || profileData.birthday,
          gender: data.gender || profileData.gender,
          social_link: data.socialLink || profileData.social_link,
          contact_number: data.contactNumber || profileData.contact_number,
          profile_picture: data.profileImage || profileData.profile_picture,
          profileImage: data.profileImage || profileData.profile_picture
        };
        setLocalProfileData(updatedProfileData);
      }
      
      // Call the parent component's update function
      const success = await onUpdate(data);
      
      if (success) {
        setSuccessMessage('Profile updated successfully!');
        setIsModalOpen(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setUpdateError('Failed to update profile');
        // Revert local state if update failed
        if (user) {
          setLocalProfileData(null);
        }
      }
    } catch (error) {
      console.error('Profile: Error updating profile:', error);
      setUpdateError('An unexpected error occurred');
      // Revert local state if error occurred
      if (user) {
        setLocalProfileData(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseVerificationModal = () => {
    setIsVerificationClicked(false);
    setIsVerificationModalOpen(false);
  };

  const handleUpload = async (file) => {
    try {
      // Create FormData to handle actual file upload
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('document', file);
      
      // Also send verification data as JSON
      const verificationData = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date().toISOString()
      };
      formData.append('verificationData', JSON.stringify(verificationData));
      
      // Call the verification endpoint with FormData
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/users/verify-student`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message || 'Verification document submitted successfully!');
        setIsVerificationModalOpen(false);
        setIsVerificationClicked(false);
        
        // Optionally refresh user data to update verification status
        if (onUpdate) {
          await onUpdate({}); // Trigger a refresh
        }
      } else {
        throw new Error(result.error || result.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert(`Failed to submit verification: ${error.message}`);
    }
  };

  // Use the activeTab prop from parent if provided, otherwise determine from URL
  const currentTab = activeTab || (() => {
    switch (location.pathname) {
      case '/profile': return 'post';
      case '/earnings': return 'earnings';
      default: return 'post';
    }
  })();

  // Early return if no profileData is available to prevent null reference errors
  if (!profileData) {
    return (
      <div className="profilePage h-full w-full flex flex-col bg-white rounded-md overflow-hidden border">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profilePage h-full w-full flex flex-col bg-white rounded-md overflow-hidden border">
      {/* Display success message at the top of profile if exists */}
      {showSuccessMessage && <div className="mx-4 mt-4">{showSuccessMessage}</div>}
      
      {/* Display spinner if we're still loading */}
      {isUpdating && <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"><Spinner /></div>}
      
      <main className="profile">
        <section className="profile-section">
          <div className="profile-background">
            <div className="profile-header" />

            <div className="profile-name-container">
              <button
                onClick={() => setIsModalOpen(true)}
                className="profile-edit-profile-button"
              >
                <PencilSquareIcon className='profile-editIcon' />
              </button>

              <div className="icon-and-name-wrapper">
                {(profileData?.profileImage || profileData?.profile_picture) ? (
                  <img
                    src={profileData.profileImage || profileData.profile_picture}
                    alt="Profile"
                    className="profile-userImage"
                  />
                ) : (
                  <UserCircleIcon className="profile-userIcon" />
                )}

                <div className="name-verification-row">
                  <h1 className="profile-name">{profileData.name || "Your Name"}</h1>
                  <p
                    className={`profile-verificationStatus ${isVerificationClicked ? 'clicked' : ''} ${profileData.verified ? 'verified' : ''}`}
                    onClick={() => {
                      if (!profileData.verified) {
                        setIsVerificationClicked(true);
                        setIsVerificationModalOpen(true);
                      }
                    }}
                  >
                    {profileData.verified ? 'Verified' : '*Unverified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="profile-profileNavigation">
            <ul className="profile-nav-items">
              <li>
                <Link to="/profile" className={`profile-navItem ${currentTab === 'post' ? 'active' : ''}`}>
                  Post
                </Link>
              </li>
              <li>
                <Link to="/earnings" className={`profile-navItem ${currentTab === 'earnings' ? 'active' : ''}`}>
                  Earnings
                </Link>
              </li>
            </ul>
          </nav>
        </section>
        
        {/* Always render PostContent if we have profileData */}
        {profileData && <PostContent profileData={profileData} successMessage={successMessage} />}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <EditProfileModal
          profileData={profileData} // Pass the complete profileData object directly
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          isLoading={isUpdating}
          error={updateError}
        />
      )}

      {isVerificationModalOpen && (
        <StudentVerificationModal
          onClose={handleCloseVerificationModal}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default Profile;