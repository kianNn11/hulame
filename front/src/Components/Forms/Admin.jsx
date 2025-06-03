import React, { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../Context/AuthContext";
import './Admin.css';

function Admin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Use the existing auth context login method
      const response = await login(formData.email, formData.password);
      
      // Check if user is admin
      if (response.user && response.user.role === 'admin') {
        navigate("/dashboard");
      } else {
        setError("Access denied. Admin privileges required.");
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || "Invalid credentials or insufficient privileges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScreenClick = (event) => {
      if (error) {
        setError("");
      }
    };
  
    document.addEventListener("click", handleScreenClick);
  
    return () => {
      document.removeEventListener("click", handleScreenClick);
    };
  }, [error]);

  return (
    <main className="admin-page">
      {/* Left section - Welcome */}
      <section className="admin-left">
        <h1 className="admin-heading">Admin Portal</h1>
        <p className="admin-subtitle">Secure access for administrators</p>
        <button className="admin-back-btn" onClick={() => window.history.back()}>
          Back to Site
        </button>
      </section>

      {/* Right section - Login form */}
      <section className="admin-right">
        <div className="admin-form-container">
          <h2 className="admin-title">Administrator Login</h2>
          <p className="admin-description">Please enter your admin credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="admin-formFields">
              {/* Email input */}
              <div className="admin-input-group">
                <label htmlFor="email" className="admin-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@hulame.com"
                  className="admin-email"
                  aria-label="Email Address"
                  required
                />
              </div>

              {/* Password input with toggleable visibility */}
              <div className="admin-input-group">
                <label htmlFor="password" className="admin-label">Password</label>
                <div className="admin-pass">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="admin-passwordInput"
                    aria-label="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="admin-eyeButton"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="admin-eyeIcon" />
                    ) : (
                      <EyeIcon className="admin-eyeIcon" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="admin-errorMessage">
                  <span className="admin-errorIcon">⚠️</span>
                  {error}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="admin-footer">
            <p className="admin-footer-text">
              For security purposes, all admin activities are logged and monitored.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Admin;