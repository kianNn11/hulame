import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 },
    rentals: { total: 0, thisWeek: 0, thisMonth: 0, active: 0 },
    revenue: { total: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 }
  });
  const [transactions, setTransactions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, transactionsResponse, activitiesResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentTransactions(),
        adminService.getRecentActivity()
      ]);

      setDashboardData(statsResponse.data);
      setTransactions(transactionsResponse.data.data || []);
      setActivities(activitiesResponse.data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Available' },
      rented: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon, text: 'Rented' },
      unavailable: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon, text: 'Unavailable' }
    };

    const config = statusConfig[status] || statusConfig.available;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">
        <ExclamationTriangleIcon className="error-icon" />
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Monitor your platform's performance and manage operations</p>
        </div>
        <button onClick={fetchDashboardData} className="refresh-button">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Revenue Card */}
        <div className="stat-card revenue-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper revenue">
              <CurrencyDollarIcon className="stat-icon" />
            </div>
            <div>
              <h3 className="stat-title">Revenue Overview</h3>
              <p className="stat-subtitle">Platform commission earnings</p>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">{formatCurrency(dashboardData.revenue.total)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Year</span>
              <span className="stat-value">{formatCurrency(dashboardData.revenue.thisYear)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Month</span>
              <span className="stat-value">{formatCurrency(dashboardData.revenue.thisMonth)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Week</span>
              <span className="stat-value">{formatCurrency(dashboardData.revenue.thisWeek)}</span>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="stat-card users-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper users">
              <UserGroupIcon className="stat-icon" />
            </div>
            <div>
              <h3 className="stat-title">User Statistics</h3>
              <p className="stat-subtitle">Platform user growth</p>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{dashboardData.users.total.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Year</span>
              <span className="stat-value">{dashboardData.users.thisYear.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Month</span>
              <span className="stat-value">{dashboardData.users.thisMonth.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Week</span>
              <span className="stat-value">{dashboardData.users.thisWeek.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Rentals Card */}
        <div className="stat-card rentals-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper rentals">
              <ClipboardDocumentListIcon className="stat-icon" />
            </div>
            <div>
              <h3 className="stat-title">Rental Statistics</h3>
              <p className="stat-subtitle">Item listings and activity</p>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Total Listings</span>
              <span className="stat-value">{dashboardData.rentals.total.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Listings</span>
              <span className="stat-value">{dashboardData.rentals.active.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Month</span>
              <span className="stat-value">{dashboardData.rentals.thisMonth.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">This Week</span>
              <span className="stat-value">{dashboardData.rentals.thisWeek.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Transactions */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Recent Transactions</h3>
            <Link to="/admin/transactions" className="view-all-link">
              <EyeIcon className="w-4 h-4" />
              View All
            </Link>
          </div>
          <div className="transactions-list">
            {transactions.length > 0 ? (
              transactions.slice(0, 8).map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-image">
                    {transaction.image ? (
                      <img src={transaction.image} alt={transaction.title} />
                    ) : (
                      <div className="image-placeholder">
                        <ClipboardDocumentListIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="transaction-details">
                    <h4 className="transaction-title">{transaction.title}</h4>
                    <p className="transaction-user">by {transaction.user_name}</p>
                    <span className="transaction-date">{transaction.date}</span>
                  </div>
                  <div className="transaction-amount">
                    <span className="amount-price">{formatCurrency(transaction.price)}</span>
                    <span className="amount-commission">Commission: {formatCurrency(transaction.commission)}</span>
                  </div>
                  <div className="transaction-status">
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <ClipboardDocumentListIcon className="empty-icon" />
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <Link to="/admin/activity" className="view-all-link">
              <EyeIcon className="w-4 h-4" />
              View All
            </Link>
          </div>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.slice(0, 8).map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-avatar">
                    <div className="avatar-placeholder">
                      {activity.user_name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">
                      <strong>{activity.user_name}</strong> {activity.action}: 
                      <em> {activity.item_title}</em>
                    </p>
                    <div className="activity-meta">
                      <span className="activity-date">{activity.date}</span>
                      <span className="activity-time">{activity.time}</span>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <ChartBarIcon className="empty-icon" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;  