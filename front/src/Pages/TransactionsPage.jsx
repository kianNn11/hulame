import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  BookOpenIcon,
  CalculatorIcon,
  BeakerIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [response, setResponse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filter !== 'all') params.append('status', filter);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      
      const response = await fetch(`http://localhost:8000/api/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, roleFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleApprove = async (transactionId, ownerResponse = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/transactions/${transactionId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: ownerResponse })
      });
      
      if (response.ok) {
        fetchTransactions();
        setShowResponseModal(false);
        setResponse('');
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  };

  const handleReject = async (transactionId, ownerResponse) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/transactions/${transactionId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: ownerResponse })
      });
      
      if (response.ok) {
        fetchTransactions();
        setShowResponseModal(false);
        setResponse('');
      }
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    }
  };

  const handleComplete = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/transactions/${transactionId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        color: 'status-pending', 
        icon: ClockIcon, 
        text: 'Awaiting Response',
        description: 'Request is pending owner approval'
      },
      approved: { 
        color: 'status-approved', 
        icon: CheckCircleIcon, 
        text: 'Approved',
        description: 'Ready for rental period'
      },
      rejected: { 
        color: 'status-rejected', 
        icon: XCircleIcon, 
        text: 'Declined',
        description: 'Request was not approved'
      },
      completed: { 
        color: 'status-completed', 
        icon: AcademicCapIcon, 
        text: 'Completed',
        description: 'Rental successfully finished'
      }
    };
    
    return badges[status] || badges.pending;
  };

  const getEducationalIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('book') || titleLower.includes('textbook')) return BookOpenIcon;
    if (titleLower.includes('calculator') || titleLower.includes('calc')) return CalculatorIcon;
    if (titleLower.includes('lab') || titleLower.includes('equipment')) return BeakerIcon;
    return AcademicCapIcon;
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.rental?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.renter?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRentalDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (loading) {
    return (
      <div className="transactions-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3>Loading Your Transactions</h3>
          <p>Fetching your rental requests and bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        {/* Header Section */}
        <div className="transactions-header">
          <div className="header-content">
            <div className="header-text">
              <h1>My Educational Rentals</h1>
              <p>Manage your study material rental requests and track your learning journey</p>
            </div>
            <div className="header-stats">
              <div className="stat-card">
                <div className="stat-number">{transactions.filter(t => t.status === 'pending').length}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{transactions.filter(t => t.status === 'approved').length}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{transactions.filter(t => t.status === 'completed').length}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="transactions-controls">
          <div className="search-section">
            <div className="search-box">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search by item, student, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <FunnelIcon className="filter-icon" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Active Rentals</option>
                <option value="rejected">Declined</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <UserIcon className="filter-icon" />
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Transactions</option>
                <option value="renter">My Rental Requests</option>
                <option value="owner">Items I'm Renting Out</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <AcademicCapIcon className="empty-icon" />
              <h3>No Transactions Found</h3>
              <p>
                {searchTerm 
                  ? "No transactions match your search criteria." 
                  : "You haven't made any rental requests yet. Start exploring educational materials to rent!"
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => window.location.href = '/rental-section'} 
                  className="cta-button"
                >
                  Browse Study Materials
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="transactions-grid">
            {filteredTransactions.map((transaction) => {
              const badge = getStatusBadge(transaction.status);
              const IconComponent = badge.icon;
              const EducationalIcon = getEducationalIcon(transaction.rental?.title);
              const isOwner = transaction.owner_id === user?.id;
              const duration = getRentalDuration(transaction.start_date, transaction.end_date);
              
              return (
                <div key={transaction.id} className={`transaction-card ${badge.color}`}>
                  <div className="transaction-header">
                    <div className="item-info">
                      <div className="item-icon">
                        <EducationalIcon className="educational-icon" />
                      </div>
                      <div className="item-details">
                        <h3 className="item-title">{transaction.rental?.title}</h3>
                        <div className="item-meta">
                          <span className="item-category">Educational Material</span>
                          <span className="item-separator">•</span>
                          <span className="item-duration">{duration} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="status-indicator">
                      <div className={`status-badge ${badge.color}`}>
                        <IconComponent className="status-icon" />
                        <span className="status-text">{badge.text}</span>
                      </div>
                    </div>
                  </div>

                  <div className="transaction-body">
                    <div className="transaction-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <UserIcon className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">
                              {isOwner ? 'Requested by' : 'Item Owner'}
                            </span>
                            <span className="detail-value">
                              {isOwner ? transaction.renter?.name : transaction.owner?.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="detail-item">
                          <CalendarIcon className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Rental Period</span>
                            <span className="detail-value">
                              {new Date(transaction.start_date).toLocaleDateString()} - {new Date(transaction.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="detail-item">
                          <CurrencyDollarIcon className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Total Cost</span>
                            <span className="detail-value price">₱{parseFloat(transaction.total_amount).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {transaction.renter_message && (
                        <div className="message-section">
                          <div className="message-header">
                            <ChatBubbleLeftRightIcon className="message-icon" />
                            <span className="message-label">Student Message</span>
                          </div>
                          <div className="message-content">
                            "{transaction.renter_message}"
                          </div>
                        </div>
                      )}

                      {transaction.owner_response && (
                        <div className="response-section">
                          <div className="response-header">
                            <UserIcon className="response-icon" />
                            <span className="response-label">Owner Response</span>
                          </div>
                          <div className="response-content">
                            "{transaction.owner_response}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="transaction-actions">
                      {isOwner && transaction.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowResponseModal('approve');
                            }}
                            className="action-btn approve-btn"
                          >
                            <CheckCircleIcon className="btn-icon" />
                            Approve Request
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowResponseModal('reject');
                            }}
                            className="action-btn reject-btn"
                          >
                            <XCircleIcon className="btn-icon" />
                            Decline
                          </button>
                        </div>
                      )}

                      {transaction.status === 'approved' && (
                        <button
                          onClick={() => handleComplete(transaction.id)}
                          className="action-btn complete-btn"
                        >
                          <AcademicCapIcon className="btn-icon" />
                          Mark as Completed
                        </button>
                      )}

                      {transaction.status === 'pending' && !isOwner && (
                        <div className="pending-notice">
                          <ClockIcon className="pending-icon" />
                          <span>Waiting for owner's response...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedTransaction && (
          <div className="modal-overlay">
            <div className="response-modal">
              <div className="modal-header">
                <div className="modal-title">
                  <div className="modal-icon">
                    {showResponseModal === 'approve' ? 
                      <CheckCircleIcon className="icon-approve" /> : 
                      <XCircleIcon className="icon-reject" />
                    }
                  </div>
                  <div>
                    <h3>{showResponseModal === 'approve' ? 'Approve Rental Request' : 'Decline Rental Request'}</h3>
                    <p>Respond to {selectedTransaction.renter?.name}'s request for "{selectedTransaction.rental?.title}"</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-body">
                <div className="request-summary">
                  <div className="summary-item">
                    <span className="summary-label">Rental Period:</span>
                    <span className="summary-value">
                      {new Date(selectedTransaction.start_date).toLocaleDateString()} - {new Date(selectedTransaction.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Amount:</span>
                    <span className="summary-value">₱{parseFloat(selectedTransaction.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                <div className="response-input">
                  <label className="input-label">
                    {showResponseModal === 'approve' ? 'Message to Student (Optional)' : 'Reason for Declining (Required)'}
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder={
                      showResponseModal === 'approve' 
                        ? 'Add any special instructions or pickup details...' 
                        : 'Please explain why you cannot approve this request...'
                    }
                    rows="4"
                    className="response-textarea"
                    required={showResponseModal === 'reject'}
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponse('');
                    setSelectedTransaction(null);
                  }}
                  className="modal-btn cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showResponseModal === 'approve') {
                      handleApprove(selectedTransaction.id, response);
                    } else {
                      if (response.trim()) {
                        handleReject(selectedTransaction.id, response);
                      } else {
                        alert('Please provide a reason for declining this request');
                      }
                    }
                  }}
                  className={`modal-btn ${showResponseModal === 'approve' ? 'approve-btn' : 'reject-btn'}`}
                >
                  {showResponseModal === 'approve' ? 'Approve Request' : 'Decline Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;