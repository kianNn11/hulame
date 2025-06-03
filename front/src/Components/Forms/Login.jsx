import React, { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom'; 
import './Login.css'
import { useAuth } from "../../Context/AuthContext";

const ForgotPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  const handleChange = (e) => {
    setError('');
    setSuccess('');
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, newPassword, confirmPassword } = formData;

    if (!username || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const savedUserData = JSON.parse(localStorage.getItem('userData'));
    if (!savedUserData || savedUserData.username !== username) {
      setError('Username not found.');
      return;
    }

    // Update password in localStorage
    const updatedUserData = { ...savedUserData, password: newPassword };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    setSuccess('Password updated successfully! You can now login.');
    setFormData({ username: '', newPassword: '', confirmPassword: '' });

    // Optionally close modal after some delay
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            autoFocus
          />
              <div className="modal-password-field-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="newPassword"
    placeholder="New Password"
    value={formData.newPassword}
    onChange={handleChange}
    className="modal-password-input"
  />
  <button
    type="button"
    onClick={togglePasswordVisibility}
    className="modal-eye-button"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      <EyeSlashIcon className="modal-eye-icon" />
    ) : (
      <EyeIcon className="modal-eye-icon" />
    )}
  </button>
</div>

<input
  type="password" // Confirm Password field doesn't toggle
  name="confirmPassword"
  placeholder="Confirm New Password"
  value={formData.confirmPassword}
  onChange={handleChange}
  className="modal-password-input"
/>


          {error && <p className="modal-error">{error}</p>}
          {success && <p className="modal-success">{success}</p>}
          <div className="modal-buttons">
            <button type="submit" className="modal-submit-btn">Update Password</button>
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
};

const Login = () => {
  const { login, error: authError, setError: setAuthError } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
    if (authError) setAuthError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/rental-section');
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScreenClick = () => {
      if (localError) setLocalError('');
      if (authError) setAuthError(null);
    };
    document.addEventListener('click', handleScreenClick);
    return () => document.removeEventListener('click', handleScreenClick);
  }, [localError, authError, setAuthError]);

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  return (
    <main className='login-page'>
      <section className="login-left-side">
        <h1 className='login-greetings'>Welcome Back!</h1>
        <p className="login-question">Don't have an account?</p>
        <Link to="/register">
          <button className='login-reg-btn'>Register</button>
        </Link>
      </section>

      <section className="login-logo-container">
        <p className="login-login-title">Login</p>

        <form onSubmit={handleSubmit}>
          <div className="formFields">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className='login-username'
              aria-label="Email"
            />

            <div className='login-password'>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className='login-passwordInput'
                aria-label="Password"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className='login-eyeButton'
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className='login-eyeIcon' />
                ) : (
                  <EyeIcon className='login-eyeIcon' />
                )}
              </button>
            </div>

            {(localError || authError) && (
              <p className='login-errorMessage'>
                {localError || (typeof authError === 'string' ? authError : Object.values(authError)[0])}
              </p>
            )}

            <div className="forgotPasswordContainer">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="login-forgotPasswordLink">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="login-adminButtonContainer">
          <Link to="/admin">
            <button className="login-adminButton" aria-label="Admin access">
              {/* SVG Admin Button */}
              <svg width="128" height="44" viewBox="0 0 128 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="127" height="43" rx="21.5" fill="white" stroke="#E5E7EB" />
                <path fillRule="evenodd" clipRule="evenodd" d="M32 19.6C33.364 19.6 34.6721 19.0943 35.6365 18.1941C36.601 17.2939 37.1429 16.073 37.1429 14.8C37.1429 13.527 36.601 12.3061 35.6365 11.4059C34.6721 10.5057 33.364 10 32 10C30.636 10 29.3279 10.5057 28.3635 11.4059C27.399 12.3061 26.8571 13.527 26.8571 14.8C26.8571 16.073 27.399 17.2939 28.3635 18.1941C29.3279 19.0943 30.636 19.6 32 19.6ZM20 34C20 32.5292 20.3104 31.0728 20.9134 29.7139C21.5165 28.3551 22.4004 27.1204 23.5147 26.0804C24.629 25.0404 25.9519 24.2154 27.4078 23.6525C28.8637 23.0897 30.4241 22.8 32 22.8C33.5759 22.8 35.1363 23.0897 36.5922 23.6525C38.0481 24.2154 39.371 25.0404 40.4853 26.0804C41.5996 27.1204 42.4835 28.3551 43.0866 29.7139C43.6896 31.0728 44 32.5292 44 34H20Z" fill="black" />
                <text fill="black" style={{ whiteSpace: "pre" }} fontFamily="Poppins" fontSize="16" fontWeight="500" letterSpacing="0em">
                  <tspan x="54" y="27.6">Admin</tspan>
                </text>
              </svg>
            </button>
          </Link>
        </div>

      </section>

      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />
      )}
    </main>
  )
}

export default Login;