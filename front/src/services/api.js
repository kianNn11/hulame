import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
});

// Add a request interceptor to include the token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If the data is FormData, remove Content-Type header to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API auth services
export const authService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/user'),
};

// User services
export const userService = {
  getCurrentUser: () => apiClient.get('/user'),
  updateProfile: (userData) => {
    console.log('API service sending update request with data:', userData);
    return apiClient.put('/users/profile', userData)
      .then(response => {
        console.log('Update profile API response:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Update profile API error:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 401) {
            return { 
              success: false, 
              message: 'Authentication failed. Please log in again.', 
              error: data,
              needsLogin: true 
            };
          } else if (status === 422) {
            return { 
              success: false, 
              message: 'Validation failed. Please check your input.', 
              error: data,
              validationErrors: data.errors 
            };
          } else {
            return { 
              success: false, 
              message: data.message || `Server error (${status})`, 
              error: data 
            };
          }
        } else if (error.request) {
          // Request was made but no response received
          return { 
            success: false, 
            message: 'Could not connect to server. Please check your internet connection.', 
            error: 'Network error' 
          };
        } else {
          // Something else happened
          return { 
            success: false, 
            message: 'An unexpected error occurred.', 
            error: error.message 
          };
        }
      });
  },
  getAllUsers: () => apiClient.get('/users'),
  getUser: (userId) => apiClient.get(`/users/${userId}`),
  verifyUser: (userId) => apiClient.put(`/users/${userId}/verify`),
  verifyStudent: (userId, verificationData) => apiClient.post('/users/verify-student', { userId, verificationData }),
  getUserRentals: (userId) => {
    if (userId) {
      return apiClient.get(`/users/${userId}/rentals`);
    } else {
      return apiClient.get(`/user/rentals`);
    }
  },
  getUserEarnings: (userId) => {
    if (userId) {
      return apiClient.get(`/users/${userId}/earnings`);
    } else {
      return apiClient.get(`/user/earnings`);
    }
  },
};

// Rental services
export const rentalService = {
  getAllRentals: () => apiClient.get('/rentals'),
  getUserRentals: (userId) => {
    if (userId) {
      return apiClient.get(`/users/${userId}/rentals`);
    } else {
      return apiClient.get(`/user/rentals`);
    }
  },
  getRental: (rentalId) => apiClient.get(`/rentals/${rentalId}`),
  createRental: (rentalData) => {
    return apiClient.post('/rentals', rentalData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateRental: (rentalId, rentalData) => {
    return apiClient.put(`/rentals/${rentalId}`, rentalData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteRental: (rentalId) => apiClient.delete(`/rentals/${rentalId}`),
};

// Admin services
export const adminService = {
  // Dashboard
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  getRecentTransactions: () => apiClient.get('/admin/dashboard/transactions'),
  getRecentActivity: () => apiClient.get('/admin/dashboard/activity'),
  
  // User Management
  getAllUsers: (params = {}) => apiClient.get('/admin/users', { params }),
  getPendingUsers: () => apiClient.get('/admin/users/pending'),
  updateUserStatus: (userId, statusData) => apiClient.put(`/admin/users/${userId}/status`, statusData),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  
  // Account Verification
  getPendingVerifications: () => apiClient.get('/admin/verification/pending'),
  approveVerification: (userId) => apiClient.post(`/admin/verification/${userId}/approve`),
  denyVerification: (userId) => apiClient.post(`/admin/verification/${userId}/deny`),
  
  // Analytics
  getUserGrowthStats: () => apiClient.get('/admin/analytics/user-growth'),
  getRevenueStats: () => apiClient.get('/admin/analytics/revenue'),
  getRentalStats: () => apiClient.get('/admin/analytics/rentals'),
};

export default apiClient;
