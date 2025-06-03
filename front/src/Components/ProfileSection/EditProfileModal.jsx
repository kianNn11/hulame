import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const EditProfileModal = ({ isOpen, onClose, onSubmit, profileData, onSave, isLoading = false, error = null }) => {
  const [successMessage, setSuccessMessage] = useState('');
  // Initialize with default values for all fields to avoid controlled/uncontrolled input warnings
  const [formData, setFormData] = useState({
    fullName: profileData?.name || '',
    courseYear: profileData?.course_year || '',
    birthday: profileData?.birthday || '',
    gender: profileData?.gender || '',
    socialLink: profileData?.social_link || '',
    contactNumber: profileData?.contact_number || '',
    profileImage: profileData?.profile_picture || null
  });
  
  // Debug log to check what data we're receiving
  console.log('EditProfileModal received profileData:', profileData);
  // Log specifically the name field
  console.log('Name value in profileData:', profileData?.name);

  useEffect(() => {
    // Update form data when profile data changes, ensuring all fields have default values
    console.log('Setting form data with profile data:', profileData);
    
    setFormData({
      fullName: profileData?.name || '',
      courseYear: profileData?.course_year || '',
      birthday: profileData?.birthday || '',
      gender: profileData?.gender || '',
      socialLink: profileData?.social_link || '',
      contactNumber: profileData?.contact_number || '',
      profileImage: profileData?.profile_picture || null
    });
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(`File ${name} loaded as base64`);
        setFormData((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setSuccessMessage('');
    
    try {
      // Create a complete form data object
      const completeFormData = {
        id: profileData?.id,
        ...formData
      };
      
      // Debug profile image data
      if (completeFormData.profileImage) {
        console.log('Profile image length:', completeFormData.profileImage.length);
        console.log('Profile image starts with:', completeFormData.profileImage.substring(0, 50));
      } else {
        console.log('No profile image selected');
      }
      
      console.log('EditProfileModal sending data:', completeFormData);
      
      // Show immediate feedback to user
      setSuccessMessage('Saving your profile...');
      
      const success = await onSave(completeFormData);
      
      if (success) {
        setSuccessMessage('Profile updated successfully!');
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Edit Profile</h2>
          <div className="tooltipWrapper">
            <button className="modalCloseBtn" onClick={onClose}>
              <XMarkIcon className="closeIcon" />
              <span className="tooltipText">Close</span>
            </button>
          </div>
        </div>

        <form className="editForm" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="success-message" style={{ color: 'green', marginBottom: '15px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
              {successMessage}
            </div>
          )}
          
          <label>
            Full Name
            <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} disabled={isLoading} />
          </label>
          <label>
            Course & Year Level
            <input name="courseYear" type="text" value={formData.courseYear} onChange={handleChange} disabled={isLoading} />
          </label>
          <label>
            Birthday
            <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} disabled={isLoading} />
          </label>
          <label>
            Gender
            <select name="gender" value={formData.gender} onChange={handleChange} disabled={isLoading}>
              <option value="">Select</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Social Link
            <input 
              name="socialLink" 
              type="url" 
              value={formData.socialLink || ''} 
              placeholder="https://example.com/profile"
              onChange={handleChange} 
              disabled={isLoading} 
            />
          </label>
          <label>
            Contact Number
            <input name="contactNumber" type="text" value={formData.contactNumber} onChange={handleChange} disabled={isLoading} />
          </label>
          <label>
            Profile Image
            <div className="file-upload-container" style={{ marginTop: '8px' }}>
              <input 
                name="profileImage" 
                type="file" 
                accept="image/*"
                onChange={handleChange} 
                disabled={isLoading}
                style={{ display: 'none' }}
                id="profileImageInput"
              />
              <label 
                htmlFor="profileImageInput" 
                className="file-upload-button"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333'
                }}
              >
                Choose Image
              </label>
              <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                Max 5MB, JPG/PNG only
              </span>
            </div>
            {formData.profileImage && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  Profile Preview:
                </p>
                <div style={{ 
                  display: 'inline-block',
                  border: '2px solid #ddd',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  width: '80px',
                  height: '80px'
                }}>
                  <img 
                    src={formData.profileImage} 
                    alt="Profile preview" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.error("Error loading preview image");
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, profileImage: null }))}
                  style={{
                    display: 'block',
                    margin: '8px auto 0',
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </label>

          <div className="modalButtons">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button type="button" onClick={onClose} className="cancelBtn" disabled={isLoading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;