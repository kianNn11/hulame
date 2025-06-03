import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, XCircleIcon as XCircleSolid } from '@heroicons/react/24/solid';
import { adminService } from '../../services/api';
import './AccountConfirmation.css';

const AccountConfirmation = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getPendingVerifications();
      console.log('API Response:', response.data);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      setError('Failed to load pending verifications. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'unset'; // Restore scroll
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 5000);
  };

  const handleApprove = async (userId) => {
    try {
      setProcessing(true);
      await adminService.approveVerification(userId);
      
      // Remove user from list immediately
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      
      showNotification('Account verification approved successfully!', 'success');
      closeModal();
      
    } catch (error) {
      console.error('Error approving verification:', error);
      showNotification('Failed to approve verification. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeny = async (userId) => {
    try {
      setProcessing(true);
      await adminService.denyVerification(userId);
      
      // Remove user from list immediately
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      
      showNotification('Account verification denied.', 'warning');
      closeModal();
      
    } catch (error) {
      console.error('Error denying verification:', error);
      showNotification('Failed to deny verification. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div className="account-confirmation-admin">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Loading Pending Verifications</h3>
            <p>Please wait while we fetch the verification requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-confirmation-admin">
        <div className="container">
          <div className="error-state">
            <ExclamationTriangleIcon className="error-icon" />
            <h3>Error Loading Verifications</h3>
            <p>{error}</p>
            <button onClick={fetchPendingVerifications} className="retry-button">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-confirmation-admin">
      <div className="container">
        {/* Notification */}
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            <div className="notification-content">
              {notification.type === 'success' && <CheckCircleSolid className="notification-icon" />}
              {notification.type === 'warning' && <ExclamationTriangleIcon className="notification-icon" />}
              {notification.type === 'error' && <XCircleSolid className="notification-icon" />}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <DocumentTextIcon className="title-icon" />
              Account Verification
            </h1>
            <p className="page-subtitle">Review and approve user verification documents</p>
          </div>
          <button onClick={fetchPendingVerifications} className="refresh-button" disabled={loading}>
            <svg className="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Content */}
        {users.length === 0 ? (
          <div className="empty-state">
            <CheckCircleIcon className="empty-icon" />
            <h3>No Pending Verifications</h3>
            <p>All user verification requests have been processed.</p>
            <button onClick={fetchPendingVerifications} className="refresh-button">
              Check for New Requests
            </button>
          </div>
        ) : (
          <div className="verification-grid">
            {users.map((user) => (
              <div className="verification-card" key={user.id}>
                <div className="card-header">
                  <div className="user-avatar">
                    {user.profilePic && user.profilePic !== 'https://via.placeholder.com/50' ? (
                      <img 
                        src={user.profilePic} 
                        alt={user.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="avatar-fallback" style={{display: user.profilePic && user.profilePic !== 'https://via.placeholder.com/50' ? 'none' : 'flex'}}>
                      {getInitials(user.name)}
                    </div>
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-id">ID: #{user.id}</p>
                  </div>
                  <div className="verification-badge">
                    <span className="badge-pending">Pending</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <EnvelopeIcon className="info-icon" />
                      <span>{user.email}</span>
                    </div>
                    {user.course_year && (
                      <div className="info-item">
                        <AcademicCapIcon className="info-icon" />
                        <span>{user.course_year}</span>
                      </div>
                    )}
                    {user.contact_number && (
                      <div className="info-item">
                        <PhoneIcon className="info-icon" />
                        <span>{user.contact_number}</span>
                      </div>
                    )}
                    <div className="info-item">
                      <CalendarIcon className="info-icon" />
                      <span>Submitted: {formatDate(user.date)}</span>
                    </div>
                  </div>

                  <div className="document-info">
                    <DocumentTextIcon className="document-icon" />
                    <span className="document-type">{user.documentType || 'Verification Document'}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="review-button"
                    onClick={() => openModal(user)}
                  >
                    <EyeIcon className="button-icon" />
                    Review Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Modal */}
        {isModalOpen && selectedUser && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <DocumentTextIcon className="modal-title-icon" />
                  <div>
                    <h2>Verification Review</h2>
                    <p>Review verification document for {selectedUser.name}</p>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>
                  <XCircleIcon className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                {/* User Information */}
                <div className="user-section">
                  <h3 className="section-title">
                    <UserIcon className="section-icon" />
                    User Information
                  </h3>
                  <div className="user-details-grid">
                    <div className="detail-row">
                      <label>Full Name:</label>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div className="detail-row">
                      <label>Email Address:</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="detail-row">
                      <label>User ID:</label>
                      <span>#{selectedUser.id}</span>
                    </div>
                    {selectedUser.course_year && (
                      <div className="detail-row">
                        <label>Course/Year:</label>
                        <span>{selectedUser.course_year}</span>
                      </div>
                    )}
                    {selectedUser.contact_number && (
                      <div className="detail-row">
                        <label>Contact Number:</label>
                        <span>{selectedUser.contact_number}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <label>Document Type:</label>
                      <span className="document-type-badge">{selectedUser.documentType}</span>
                    </div>
                    <div className="detail-row">
                      <label>Submitted:</label>
                      <span>{formatDate(selectedUser.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="document-section">
                  <h3 className="section-title">
                    <DocumentTextIcon className="section-icon" />
                    Verification Document
                  </h3>
                  <div className="document-container">
                    {selectedUser.proof ? (
                      <div className="document-preview">
                        <img 
                          src={selectedUser.proof} 
                          alt="Verification Document" 
                          className="document-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="document-error" style={{display: 'none'}}>
                          <ExclamationTriangleIcon className="error-icon" />
                          <p>Unable to load document image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="no-document">
                        <DocumentTextIcon className="no-doc-icon" />
                        <p>No verification document available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div className="action-buttons">
                  <button 
                    className="approve-btn" 
                    onClick={() => handleApprove(selectedUser.id)}
                    disabled={processing}
                  >
                    <CheckCircleSolid className="btn-icon" />
                    {processing ? 'Approving...' : 'Approve'}
                  </button>
                  <button 
                    className="deny-btn" 
                    onClick={() => handleDeny(selectedUser.id)}
                    disabled={processing}
                  >
                    <XCircleSolid className="btn-icon" />
                    {processing ? 'Denying...' : 'Deny'}
                  </button>
                  <button 
                    className="cancel-btn" 
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountConfirmation;