import apiClient from './api';

// Response interceptor for handling common API errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Log the user out when their token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors (access denied)
    if (error.response?.status === 403) {
      console.error('Access denied. You do not have permission to perform this action.');
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      console.error('Resource not found.');
    }

    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      console.error('Validation failed. Please check your input.');
    }

    // Handle 500 and other server errors
    if (error.response?.status >= 500) {
      console.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
