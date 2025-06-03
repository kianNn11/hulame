import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import './ViewDetails.css';
import {
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ViewDetails = ({ rental, onClose }) => {
  const { user } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [calculatedCost, setCalculatedCost] = useState(0);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showContactModal) {
      setSenderName(user?.name || '');
      setSenderEmail(user?.email || '');
      setContactMessage('Hi, I\'m interested in renting your item. Please let me know about availability.');
      setStartDate('');
      setEndDate('');
      setCalculatedCost(0);
      setSubmitStatus(null);
    }
  }, [showContactModal, user]);

  // Calculate total cost when dates change
  useEffect(() => {
    if (startDate && endDate && rental?.price) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      if (daysDiff > 0) {
        setCalculatedCost(rental.price * daysDiff);
      } else {
        setCalculatedCost(0);
      }
    } else {
      setCalculatedCost(0);
    }
  }, [startDate, endDate, rental?.price]);

  if (!rental) {
    return (
      <div className="view-details-modal">
        <div className="empty-state">
          <p>No rental details available.</p>
        </div>
      </div>
    );
  }

  // Fix image URL construction for consistent display
  const getImageUrl = (imageData) => {
    if (!imageData) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
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

  const imageUrl = getImageUrl(rental.image);

  const handleContactRenter = () => {
    if (user && rental.user_id === user.id) {
      alert('You cannot contact yourself for your own rental.');
      return;
    }
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setContactMessage('');
    setSenderName('');
    setSenderEmail('');
    setStartDate('');
    setEndDate('');
    setCalculatedCost(0);
    setSubmitStatus(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate user is logged in
      if (!user) {
        alert('Please log in to send rental requests');
        setIsSubmitting(false);
        return;
      }

      // Use the backend API for rental requests
      const response = await fetch('http://localhost:8000/api/contact-rental', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          rental_id: rental.id,
          sender_name: senderName,
          sender_email: senderEmail,
          message: contactMessage,
          rental_title: rental.title,
          start_date: startDate,
          end_date: endDate,
          renter_id: user.id
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          handleCloseContactModal();
        }, 2000);
      } else {
        setSubmitStatus('error');
        console.error('Rental request failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending rental request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="view-details-modal">
      <div className="modal-header">
        <h2>Rental Details</h2>
        <button className="close-btn" onClick={onClose}>
          <XMarkIcon className="close-icon" />
        </button>
      </div>

      <div className="modal-body">
        <div className="rental-image">
          <img 
            src={imageUrl} 
            alt={rental.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>

        <div className="rental-info">
          <div className="rental-header">
            <h3>{rental.title}</h3>
            <div className="price-tag">
              <CurrencyDollarIcon className="price-icon" />
              <span>₱{parseFloat(rental.price).toFixed(2)}/day</span>
            </div>
          </div>

          <div className="owner-info">
            <UserIcon className="owner-icon" />
            <span>Owner: {rental.user?.name || 'Unknown'}</span>
          </div>

          <div className="info-section">
            <div className="info-item">
              <MapPinIcon className="info-icon" />
              <span>{rental.location}</span>
            </div>
            <div className="info-item">
              <CalendarIcon className="info-icon" />
              <span>Posted {new Date(rental.created_at).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <TagIcon className="info-icon" />
              <span className={`status-badge ${rental.status}`}>
                {rental.status === 'available' ? 'Available' :
                 rental.status === 'rented' ? 'Rented' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div className="description">
            <h4>Description</h4>
            <p>{rental.description}</p>
          </div>

          <div className="modal-actions">
            {rental.status === 'available' && user && rental.user_id !== user.id ? (
              <button className="contact-btn" onClick={handleContactRenter}>
                <ChatBubbleLeftRightIcon className="contact-icon" />
                Contact Owner
              </button>
            ) : rental.status !== 'available' ? (
              <button className="contact-btn disabled" disabled>
                Not Available
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Professional Contact Modal */}
      {showContactModal && (
        <div className="contact-modal-overlay">
          <div className="contact-modal">
            <div className="contact-header">
              <h3>Contact Owner</h3>
              <button className="close-contact-btn" onClick={handleCloseContactModal}>
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            
            <div className="contact-body">
              <div className="rental-reference">
                <strong>Item:</strong> {rental.title}
              </div>
              
              {submitStatus === 'success' && (
                <div className="status-message success">
                  Message sent successfully!
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="status-message error">
                  Failed to send message. Please try again.
                </div>
              )}

              <form onSubmit={handleSendMessage} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email *</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {calculatedCost > 0 && (
                  <div className="cost-summary">
                    <div className="cost-breakdown">
                      <span>Daily Rate: ₱{parseFloat(rental.price).toFixed(2)}</span>
                      <span>Duration: {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)) + 1} days</span>
                      <strong>Total Cost: ₱{calculatedCost.toFixed(2)}</strong>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    rows="3"
                    placeholder="Write your message here..."
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={handleCloseContactModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-send"
                    disabled={isSubmitting || !startDate || !endDate}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Rental Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
