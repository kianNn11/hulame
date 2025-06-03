import React, { useState, useEffect, useCallback } from 'react';
import './UserManagement.css';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  NoSymbolIcon, // eslint-disable-line no-unused-vars
  EyeIcon,
  LockClosedIcon, 
  UserMinusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/solid';
import { adminService } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // Use useCallback to memoize fetchUsers function
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.verified = filterStatus === 'verified';
      
      const response = await adminService.getAllUsers(params);
      setUsers(response.data.data || []);
      setPagination({
        currentPage: response.data.current_page || 1,
        totalPages: response.data.last_page || 1,
        total: response.data.total || 0
      });
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterRole, filterStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewDetails = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const openConfirmModal = (user, actionType) => {
    setActionUser(user);
    setConfirmAction(actionType);
  };

  const closeConfirmModal = () => {
    setConfirmAction(null);
    setActionUser(null);
  };

  const handleConfirmAction = async () => {
    if (!actionUser || !confirmAction) return;

    try {
      switch (confirmAction) {
        case 'Verify':
          await adminService.updateUserStatus(actionUser.id, { verified: true });
          break;
        case 'Unverify':
          await adminService.updateUserStatus(actionUser.id, { verified: false });
          break;
        case 'Make Admin':
          await adminService.updateUserStatus(actionUser.id, { role: 'admin' });
          break;
        case 'Remove Admin':
          await adminService.updateUserStatus(actionUser.id, { role: 'user' });
          break;
        case 'Delete':
          await adminService.deleteUser(actionUser.id);
          break;
        default:
          console.log(`${confirmAction} action not implemented yet`);
      }
      
      fetchUsers(); // Refresh the list
      closeConfirmModal();
    } catch (err) {
      console.error(`Error performing ${confirmAction}:`, err);
      alert(`Failed to ${confirmAction.toLowerCase()} user. Please try again.`);
    }
  };

  const renderStatusBadge = (user) => {
    if (user.verified) {
      return (
        <span className="badge verified">
          <CheckCircleIcon className="badge-icon" /> Verified
        </span>
      );
    } else {
      return (
        <span className="badge pending">
          <ClockIcon className="badge-icon" /> Pending
        </span>
      );
    }
  };

  const renderRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="badge admin">
          <UserIcon className="badge-icon" /> Admin
        </span>
      );
    } else {
      return (
        <span className="badge user">
          <UserIcon className="badge-icon" /> User
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActionButtons = (user) => {
    const buttons = [
      <button 
        key="view"
        className="action-btn view-btn" 
        onClick={() => handleViewDetails(user)}
        title="View Details"
      >
        <EyeIcon className="btn-icon" />
        <span className="btn-text">View</span>
      </button>
    ];

    if (user.verified) {
      buttons.push(
        <button 
          key="unverify"
          className="action-btn warning-btn" 
          onClick={() => openConfirmModal(user, 'Unverify')}
          title="Remove Verification"
        >
          <XCircleIcon className="btn-icon" />
          <span className="btn-text">Unverify</span>
        </button>
      );
    } else {
      buttons.push(
        <button 
          key="verify"
          className="action-btn success-btn" 
          onClick={() => openConfirmModal(user, 'Verify')}
          title="Verify User"
        >
          <CheckCircleIcon className="btn-icon" />
          <span className="btn-text">Verify</span>
        </button>
      );
    }

    if (user.role === 'admin') {
      buttons.push(
        <button 
          key="remove-admin"
          className="action-btn warning-btn" 
          onClick={() => openConfirmModal(user, 'Remove Admin')}
          title="Remove Admin Role"
        >
          <UserMinusIcon className="btn-icon" />
          <span className="btn-text">Remove Admin</span>
        </button>
      );
    } else {
      buttons.push(
        <button 
          key="make-admin"
          className="action-btn info-btn" 
          onClick={() => openConfirmModal(user, 'Make Admin')}
          title="Make Admin"
        >
          <LockClosedIcon className="btn-icon" />
          <span className="btn-text">Make Admin</span>
        </button>
      );
    }

    buttons.push(
      <button 
        key="delete"
        className="action-btn danger-btn" 
        onClick={() => openConfirmModal(user, 'Delete')}
        title="Delete User"
      >
        <TrashIcon className="btn-icon" />
        <span className="btn-text">Delete</span>
      </button>
    );

    return buttons;
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management">
        <div className="error-container">
          <ExclamationTriangleIcon className="error-icon" />
          <h3>Error Loading Users</h3>
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage user accounts, verification status, and permissions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls-bar">
        <div className="search-container">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <FunnelIcon className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-container">
        {users.length > 0 ? (
          <>
            <div className="users-table">
              <div className="table-header">
                <div className="header-cell user-col">User</div>
                <div className="header-cell status-col">Status</div>
                <div className="header-cell role-col">Role</div>
                <div className="header-cell date-col">Joined</div>
                <div className="header-cell rentals-col">Rentals</div>
                <div className="header-cell actions-col">Actions</div>
              </div>

              {users.map((user) => (
                <div className="table-row" key={user.id}>
                  <div className="table-cell user-cell">
                    <div className="user-avatar">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="table-cell status-cell">
                    {renderStatusBadge(user)}
                  </div>

                  <div className="table-cell role-cell">
                    {renderRoleBadge(user.role)}
                  </div>

                  <div className="table-cell date-cell">
                    {formatDate(user.created_at)}
                  </div>

                  <div className="table-cell rentals-cell">
                    <span className="rentals-count">{user.rentals_count || 0}</span>
                  </div>

                  <div className="table-cell actions-cell">
                    <div className="action-buttons">
                      {getActionButtons(user)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
                  disabled={pagination.currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                <span className="pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, prev.totalPages) }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <UserIcon className="empty-icon" />
            <h3>No Users Found</h3>
            <p>No users match your current search and filter criteria.</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal user-details-modal">
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2>User Details</h2>
            </div>

            <div className="modal-content">
              <div className="user-profile-section">
                <div className="profile-avatar">
                  {selectedUser.profile_picture ? (
                    <img src={selectedUser.profile_picture} alt={selectedUser.name} />
                  ) : (
                    <div className="avatar-placeholder large">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  <div className="profile-badges">
                    {renderStatusBadge(selectedUser)}
                    {renderRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>

              <div className="user-details-grid">
                <div className="detail-item">
                  <label>User ID:</label>
                  <span>{selectedUser.id}</span>
                </div>
                <div className="detail-item">
                  <label>Joined:</label>
                  <span>{formatDate(selectedUser.created_at)}</span>
                </div>
                <div className="detail-item">
                  <label>Total Rentals:</label>
                  <span>{selectedUser.rentals_count || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Contact:</label>
                  <span>{selectedUser.contact_number || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Course & Year:</label>
                  <span>{selectedUser.course_year || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Location:</label>
                  <span>{selectedUser.location || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <button className="modal-close" onClick={closeConfirmModal}>×</button>
            
            <div className="modal-header">
              <h2>Confirm {confirmAction}</h2>
            </div>

            <div className="modal-content">
              <p>
                Are you sure you want to <strong>{confirmAction.toLowerCase()}</strong> the account of{' '}
                <strong>{actionUser?.name}</strong>?
              </p>
              {confirmAction === 'Delete' && (
                <div className="warning-message">
                  <ExclamationTriangleIcon className="warning-icon" />
                  <span>This action cannot be undone.</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleConfirmAction}>
                Yes, {confirmAction}
              </button>
              <button className="cancel-btn" onClick={closeConfirmModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;