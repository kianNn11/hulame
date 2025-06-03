import React, { useState, useEffect } from 'react';
import './EarningsSection.css';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../Context/AuthContext';
import { userService } from '../../services/api';

const EarningsSection = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Enhanced earnings data with more details
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    availableBalance: 0,
    transactionCount: 0,
    totalRentals: 0,
    activeRentals: 0,
    transactions: [],
    monthlyBreakdown: [
      { month: 'Jan', amount: 0 },
      { month: 'Feb', amount: 0 },
      { month: 'Mar', amount: 0 },
      { month: 'Apr', amount: 0 },
      { month: 'May', amount: 0 },
      { month: 'Jun', amount: 0 },
      { month: 'Jul', amount: 0 },
      { month: 'Aug', amount: 0 },
      { month: 'Sep', amount: 0 },
      { month: 'Oct', amount: 0 },
      { month: 'Nov', amount: 0 },
      { month: 'Dec', amount: 0 },
    ]
  });
  
  // Filter and sorting states
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [transactionType, setTransactionType] = useState('all');
  
  // Fetch earnings data from API
  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch real earnings data from API
        const response = await userService.getUserEarnings(user.id);
        const data = response.data;
        
        setEarningsData(data);
        
      } catch (err) {
        console.error('Failed to fetch earnings data:', err);
        setError('Failed to load earnings data. Please try again.');
        
        // Initialize with empty data structure if API fails
        setEarningsData({
          totalEarnings: 0,
          pendingPayouts: 0,
          availableBalance: 0,
          transactionCount: 0,
          totalRentals: 0,
          activeRentals: 0,
          transactions: [],
          monthlyBreakdown: [
            { month: 'Jan', amount: 0 },
            { month: 'Feb', amount: 0 },
            { month: 'Mar', amount: 0 },
            { month: 'Apr', amount: 0 },
            { month: 'May', amount: 0 },
            { month: 'Jun', amount: 0 },
            { month: 'Jul', amount: 0 },
            { month: 'Aug', amount: 0 },
            { month: 'Sep', amount: 0 },
            { month: 'Oct', amount: 0 },
            { month: 'Nov', amount: 0 },
            { month: 'Dec', amount: 0 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEarningsData();
  }, [user?.id]);
  
  // Filter transactions based on filters
  const getFilteredTransactions = () => {
    let filtered = [...earningsData.transactions];
    
    // Filter by date range
    if (dateRange !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'week':
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(t => new Date(t.date) >= startDate);
      }
    }
    
    // Filter by transaction type
    if (transactionType !== 'all') {
      filtered = filtered.filter(t => t.type === transactionType);
    }
    
    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        case 'newest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
    
    return filtered;
  };
  
  // Format date in human-readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get transaction status styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      default:
        return '';
    }
  };
  
  // Get transaction type icon
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'rental_payment':
        return <BanknotesIcon className="transaction-icon payment" />;
      case 'payout':
        return <ArrowDownTrayIcon className="transaction-icon payout" />;
      case 'refund':
        return <ArrowTrendingUpIcon className="transaction-icon refund" />;
      default:
        return <CurrencyDollarIcon className="transaction-icon" />;
    }
  };

  if (loading) {
    return <div className="earnings-loading">Loading earnings data...</div>;
  }

  if (error) {
    return <div className="earnings-error">{error}</div>;
  }

  return (
    <main className="earnings-container">
      {/* Statistics Cards */}
      <section className="earnings-stats-grid">
        <div className="earnings-card total-earnings">
          <div className="card-icon">
            <CurrencyDollarIcon />
          </div>
          <div className="card-content">
            <h3>Total Earnings</h3>
            <p className="stat-value">₱{(earningsData.totalEarnings || 0).toLocaleString()}</p>
            <p className="stat-label">Lifetime earnings</p>
          </div>
        </div>
        
        <div className="earnings-card available-balance">
          <div className="card-icon">
            <BanknotesIcon />
          </div>
          <div className="card-content">
            <h3>Available Balance</h3>
            <p className="stat-value">₱{(earningsData.availableBalance || 0).toLocaleString()}</p>
            <p className="stat-label">Ready for withdrawal</p>
          </div>
        </div>
        
        <div className="earnings-card pending-payouts">
          <div className="card-icon">
            <ClockIcon />
          </div>
          <div className="card-content">
            <h3>Pending Payouts</h3>
            <p className="stat-value">₱{(earningsData.pendingPayouts || 0).toLocaleString()}</p>
            <p className="stat-label">In process</p>
          </div>
        </div>
        
        <div className="earnings-card total-rentals">
          <div className="card-icon">
            <ChartBarIcon />
          </div>
          <div className="card-content">
            <h3>Total Rentals</h3>
            <p className="stat-value">{earningsData.totalRentals || 0}</p>
            <p className="stat-label">{earningsData.activeRentals || 0} active</p>
          </div>
        </div>
      </section>
      
      {/* Monthly Earnings Chart */}
      <section className="earnings-section monthly-breakdown">
        <div className="section-header">
          <h2>Monthly Earnings</h2>
          <select className="filter-select" defaultValue="year">
            <option value="year">This Year</option>
            <option value="last-year">Last Year</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
        
        <div className="monthly-chart">
          {(earningsData.monthlyBreakdown || []).map((month, index) => (
            <div key={index} className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ height: `${((month?.amount || 0) / 3000) * 100}%` }}
                data-amount={`₱${(month?.amount || 0).toLocaleString()}`}
              ></div>
              <div className="chart-label">{month?.month || ''}</div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Transaction History */}
      <section className="earnings-section transaction-history">
        <div className="section-header">
          <h2>Transaction History</h2>
          
          <div className="filter-controls">
            <div className="filter-icon-container">
              <FunnelIcon className="filter-icon" />
            </div>
            <select 
              className="filter-select" 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">This Year</option>
            </select>
            
            <select 
              className="filter-select" 
              value={transactionType} 
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="rental_payment">Payments</option>
              <option value="payout">Payouts</option>
              <option value="refund">Refunds</option>
            </select>
            
            <select 
              className="filter-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>
        
        <div className="transaction-list-container">
          {getFilteredTransactions().length === 0 ? (
            <div className="no-transactions">
              <p>No transactions found for the selected filters.</p>
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setDateRange('all');
                  setTransactionType('all');
                  setSortBy('newest');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <ul className="transaction-list">
              {getFilteredTransactions().map(transaction => (
                <li key={transaction.id} className="transaction-item">
                  <div className="transaction-icon-container">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="transaction-details">
                    <div className="transaction-description">
                      <p>{transaction.description || 'No description'}</p>
                      <span className={`transaction-status ${getStatusClass(transaction.status)}`}>
                        {transaction.status === 'completed' && <CheckCircleIcon />}
                        {transaction.status || 'pending'}
                      </span>
                    </div>
                    <div className="transaction-meta">
                      <span className="transaction-date">
                        <CalendarIcon />
                        {transaction.date ? formatDate(transaction.date) : 'No date'}
                      </span>
                      {transaction.rentalId && (
                        <span className="transaction-rental-id">Rental #{transaction.rentalId}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="transaction-amount">
                    <p className={transaction.type === 'payout' || transaction.type === 'refund' ? 'negative' : 'positive'}>
                      {transaction.type === 'payout' || transaction.type === 'refund' ? '-' : '+'}
                      ₱{(transaction.amount || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <button className="transaction-detail-btn">
                    <ChevronRightIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      
      {/* Payout Section */}
      <section className="earnings-section payout-section">
        <div className="section-header">
          <h2>Withdraw Funds</h2>
        </div>
        
        <div className="payout-content">
          <div className="payout-info">
            <h3>Available for withdrawal</h3>
            <p className="payout-amount">₱{(earningsData.availableBalance || 0).toLocaleString()}</p>
            <p className="payout-note">Funds are usually available within 24 hours after a rental is completed</p>
          </div>
          
          <button className="payout-btn" disabled={(earningsData.availableBalance || 0) <= 0}>
            Withdraw to Bank Account
          </button>
        </div>
      </section>
    </main>
  );
};

export default EarningsSection;