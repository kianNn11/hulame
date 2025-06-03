import { CloudArrowUpIcon, PhotoIcon, CheckCircleIcon, XMarkIcon, CurrencyDollarIcon, MapPinIcon, DocumentTextIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import './Post.css'
import React, { useState, useRef } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { rentalService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Post = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: null
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: DocumentTextIcon },
    { id: 2, title: 'Photo & Price', icon: PhotoIcon },
    { id: 3, title: 'Review', icon: CheckCircleIcon }
  ];

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'title':
        if (!value || value.length < 3) {
          errors.title = 'Title must be at least 3 characters long';
        } else if (value.length > 100) {
          errors.title = 'Title must be less than 100 characters';
        } else {
          delete errors.title;
        }
        break;
      case 'price':
        if (!value || parseFloat(value) <= 0) {
          errors.price = 'Price must be greater than 0';
        } else if (parseFloat(value) > 100000) {
          errors.price = 'Price seems too high. Please check.';
        } else {
          delete errors.price;
        }
        break;
      case 'location':
        if (!value || value.length < 2) {
          errors.location = 'Location must be at least 2 characters long';
        } else {
          delete errors.location;
        }
        break;
      case 'description':
        if (!value || value.length < 10) {
          errors.description = 'Description must be at least 10 characters long';
        } else if (value.length > 1000) {
          errors.description = 'Description must be less than 1000 characters';
        } else {
          delete errors.description;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && !validationErrors.title && !validationErrors.description;
      case 2:
        return formData.price && formData.location && formData.image && !validationErrors.price && !validationErrors.location;
      case 3:
        return isFormValid();
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to create a rental post.');
      return;
    }

    if (!isFormValid()) {
      setError('Please complete all required fields correctly.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const rentalData = new FormData();
      rentalData.append('title', formData.title);
      rentalData.append('description', formData.description);
      rentalData.append('price', formData.price);
      rentalData.append('location', formData.location);
      
      if (formData.image) {
        rentalData.append('image', formData.image);
      }

      await rentalService.createRental(rentalData);
      
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        image: null
      });
      setImagePreview(null);
      setValidationErrors({});
      setCurrentStep(1);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => {
        navigate('/rental-section');
      }, 2000);
      
    } catch (err) {
      console.error('Failed to create rental:', err);
      setError(err.response?.data?.message || 'Failed to create rental. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
    setError(null);
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB.');
      return;
    }
    
    setFormData({
      ...formData,
      image: file
    });

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setError(null);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isFormValid = () => {
    return formData.title && 
           formData.description && 
           formData.price && 
           formData.location && 
           formData.image &&
           Object.keys(validationErrors).length === 0;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <DocumentTextIcon className="step-icon" />
              <div>
                <h3>Item Information</h3>
                <p>Provide detailed information about your rental item</p>
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Item Title <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.title ? 'error' : ''} ${formData.title && !validationErrors.title ? 'valid' : ''}`}
                    placeholder="Enter a clear, descriptive title (e.g., Canon EOS R5 Camera)"
                    maxLength="100"
                  />
                  <div className="input-meta">
                    <span className={`character-count ${formData.title.length > 80 ? 'warning' : ''}`}>
                      {formData.title.length}/100
                    </span>
                    {formData.title && !validationErrors.title && (
                      <CheckCircleIcon className="validation-icon success" />
                    )}
                  </div>
                  {validationErrors.title && (
                    <span className="field-error">{validationErrors.title}</span>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description" className="form-label">
                  Item Description <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.description ? 'error' : ''} ${formData.description && !validationErrors.description ? 'valid' : ''}`}
                    placeholder="Provide a detailed description including item condition, features, rental terms, and any special requirements..."
                    rows="4"
                    maxLength="1000"
                  />
                  <div className="input-meta">
                    <span className={`character-count ${formData.description.length > 800 ? 'warning' : ''}`}>
                      {formData.description.length}/1000
                    </span>
                    {formData.description && !validationErrors.description && (
                      <CheckCircleIcon className="validation-icon success" />
                    )}
                  </div>
                  {validationErrors.description && (
                    <span className="field-error">{validationErrors.description}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <PhotoIcon className="step-icon" />
              <div>
                <h3>Photo & Pricing Details</h3>
                <p>Upload clear photos and set competitive pricing for your rental</p>
              </div>
            </div>
            
            <div className="form-grid two-column">
              <div className="image-upload-section">
                <h4>Item Photograph <span className="required">*</span></h4>
                <div className="image-upload-container">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" className="preview-image"/>
                      <div className="image-overlay">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="remove-image-btn"
                          title="Remove image"
                        >
                          <XMarkIcon className="remove-icon" />
                        </button>
                      </div>
                      <div className="upload-success-badge">
                        <CheckCircleIcon className="success-icon" />
                        <span>Image uploaded successfully</span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`upload-area ${isDragging ? 'dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="upload-content">
                        <CloudArrowUpIcon className="upload-icon" />
                        <h4>Upload Item Photo</h4>
                        <p>Drag and drop image file or click to browse</p>
                        <span className="upload-specs">Supported formats: PNG, JPG (Maximum size: 5MB)</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                    aria-label="Upload image"
                  />
                </div>
              </div>

              <div className="pricing-location-section">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    <CurrencyDollarIcon className="label-icon" />
                    Daily Rental Rate (PHP) <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <div className="currency-input">
                      <span className="currency-symbol">₱</span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`form-input ${validationErrors.price ? 'error' : ''} ${formData.price && !validationErrors.price ? 'valid' : ''}`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        max="100000"
                      />
                      {formData.price && !validationErrors.price && (
                        <CheckCircleIcon className="validation-icon success" />
                      )}
                    </div>
                    {validationErrors.price && (
                      <span className="field-error">{validationErrors.price}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    <MapPinIcon className="label-icon" />
                    Pickup Location <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.location ? 'error' : ''} ${formData.location && !validationErrors.location ? 'valid' : ''}`}
                      placeholder="Enter specific location (e.g., Makati City, Metro Manila)"
                    />
                    {formData.location && !validationErrors.location && (
                      <CheckCircleIcon className="validation-icon success" />
                    )}
                    {validationErrors.location && (
                      <span className="field-error">{validationErrors.location}</span>
                    )}
                  </div>
                </div>

                <div className="pricing-preview">
                  <h5>Pricing Overview</h5>
                  <div className="pricing-breakdown">
                    <div className="pricing-row">
                      <span>Daily rate</span>
                      <span>₱{formData.price || '0.00'}</span>
                    </div>
                    <div className="pricing-row">
                      <span>Weekly rate (7 days)</span>
                      <span>₱{formData.price ? (parseFloat(formData.price) * 7 * 0.9).toFixed(2) : '0.00'}</span>
                      <small>10% discount applied</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content review-step">
            <div className="step-header">
              <CheckCircleIcon className="step-icon" />
              <div>
                <h3>📋 Review & Confirm Listing</h3>
                <p>Please review all information carefully before publishing your rental listing</p>
              </div>
            </div>
            
            <div className="review-content">
              <div className="review-preview-card">
                <div className="review-card-header">
                  <h4>📝 Listing Preview</h4>
                  <p>This is how your listing will appear to potential renters</p>
                </div>
                
                <div className="review-card">
                  <div className="review-image">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Item preview" />
                    ) : (
                      <div className="no-image-placeholder">
                        <PhotoIcon className="placeholder-icon" />
                        <span>No image uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="review-details">
                    <h4 className="review-title">{formData.title}</h4>
                    <p className="review-location">
                      <MapPinIcon className="location-icon" />
                      {formData.location}
                    </p>
                    <p className="review-price">₱{formData.price}/day</p>
                    <p className="review-description">{formData.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="review-summary">
                <h4>📋 Listing Summary</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Title:</span>
                    <span className="summary-value">{formData.title}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Daily Rate:</span>
                    <span className="summary-value">₱{formData.price}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Location:</span>
                    <span className="summary-value">{formData.location}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Photo:</span>
                    <span className="summary-value">{imagePreview ? '✅ Uploaded' : '❌ Missing'}</span>
                  </div>
                </div>
              </div>
              
              <div className="review-checklist">
                <h4>✅ Pre-Publication Checklist</h4>
                <div className="checklist-items">
                  <div className="checklist-item">
                    <CheckCircleIcon className="check-icon" />
                    <span>Photo clearly shows item condition and features</span>
                  </div>
                  <div className="checklist-item">
                    <CheckCircleIcon className="check-icon" />
                    <span>Title is descriptive and search-friendly</span>
                  </div>
                  <div className="checklist-item">
                    <CheckCircleIcon className="check-icon" />
                    <span>Pricing is competitive and fair for market value</span>
                  </div>
                  <div className="checklist-item">
                    <CheckCircleIcon className="check-icon" />
                    <span>Location details are accurate for pickup/delivery</span>
                  </div>
                  <div className="checklist-item">
                    <CheckCircleIcon className="check-icon" />
                    <span>Description includes all relevant details and terms</span>
                  </div>
                </div>
              </div>

              <div className="publish-notice">
                <div className="notice-icon">🚀</div>
                <div className="notice-content">
                  <h5>Ready to Publish Your Listing?</h5>
                  <p>Once published, your listing will be immediately visible to all users. You can edit, pause, or remove your listing anytime from your account dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <section className="modern-post-container">
        <div className="post-hero">
          <div className="post-hero-content">
            <div className="post-icon-wrapper">
              <div className="post-hero-icon">
                <PlusIcon className="hero-icon" />
              </div>
            </div>
            <h1 className="post-hero-title">Create Rental Listing</h1>
            <p className="post-hero-subtitle">Authentication required to create listings</p>
          </div>
        </div>
        <div className="auth-required">
          <div className="auth-required-content">
            <div className="auth-icon">🔒</div>
            <h2>Sign In Required</h2>
            <p>Please sign in to your account to create rental listings.</p>
            <button onClick={() => navigate('/login')} className="auth-btn">
              Sign In to Continue
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="modern-post-container">
      <div className="post-hero">
        <div className="post-hero-content">
          <div className="post-icon-wrapper">
            <div className="post-hero-icon">
              <PlusIcon className="hero-icon" />
            </div>
          </div>
          <h1 className="post-hero-title">Create Rental Listing</h1>
          <p className="post-hero-subtitle">Complete the form below to list your item for rent</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-steps">
          <div className={`progress-line`}>
            <div className={`progress-line-fill step-${currentStep}`}></div>
          </div>
          {steps.map((step) => (
            <div key={step.id} className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
              <div className={`step-circle ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                <step.icon className="step-icon" />
              </div>
              <span className="step-text">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="notification error">
          <XMarkIcon className="notification-icon" />
          <div>
            <h4>Error</h4>
            <p>{error}</p>
          </div>
          <button onClick={() => setError(null)} className="dismiss-btn">
            <XMarkIcon className="dismiss-icon" />
          </button>
        </div>
      )}

      {success && (
        <div className="notification success enhanced">
          <div className="success-content">
            <CheckCircleIcon className="notification-icon" />
            <div className="success-details">
              <h4>🎉 Listing Created Successfully!</h4>
              <p>Your item "<strong>{formData.title}</strong>" is now live and available for rent.</p>
              <div className="success-stats">
                <div className="stat">
                  <span className="stat-label">Price:</span>
                  <span className="stat-value">₱{formData.price}/day</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Location:</span>
                  <span className="stat-value">{formData.location}</span>
                </div>
              </div>
              <p className="redirect-message">Redirecting to rental marketplace in 2 seconds...</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className='modern-post-form'>
          {renderStepContent()}
          
          {/* Navigation Controls */}
          <div className="form-navigation">
            <div className="nav-left">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="nav-btn secondary"
                >
                  <ArrowLeftIcon className="nav-icon" />
                  Previous
                </button>
              )}
            </div>
            
            <div className="step-indicator">
              Step {currentStep} of {steps.length}
            </div>
            
            <div className="nav-right">
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className={`nav-btn primary ${!validateCurrentStep() ? 'disabled' : ''}`}
                  disabled={!validateCurrentStep()}
                >
                  {currentStep === 2 ? 'Review Listing' : 'Next'}
                  <ArrowRightIcon className="nav-icon" />
                </button>
              ) : (
                <div className="submit-section">
                  <div className="submit-info">
                    <div className="submit-icon">🚀</div>
                    <div className="submit-text">
                      <span className="submit-title">Ready to publish?</span>
                      <span className="submit-subtitle">Your listing will be live immediately</span>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className={`submit-btn final-submit ${!isFormValid() || loading ? 'disabled' : ''}`}
                    disabled={!isFormValid() || loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="btn-icon" />
                        Submit & Publish
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Post