import React from 'react';
import { useAuth } from '../Context/AuthContext';
import Post from '../Components/PostSection/Post';
import './PostPage.css';

const PostPage = () => {
  const { user } = useAuth();

  const QuickTips = () => (
    <div className="quick-tips">
      <h3>📝 Listing Guidelines</h3>
      <ul className="tips-list">
        <li>
          <span className="tip-icon">📸</span>
          Upload clear, high-quality photos
        </li>
        <li>
          <span className="tip-icon">💰</span>
          Set competitive and fair pricing
        </li>
        <li>
          <span className="tip-icon">📍</span>
          Provide accurate location details
        </li>
        <li>
          <span className="tip-icon">📝</span>
          Include complete item descriptions
        </li>
        <li>
          <span className="tip-icon">⚠️</span>
          Be honest about item condition
        </li>
      </ul>
    </div>
  );

  return (
    <div className="post-page-container">
      {/* Header Section */}
      <div className="post-page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Create Rental Listing</h1>
            <p>List your items for rent and connect with potential renters in your community</p>
          </div>
        </div>
      </div>

      <div className="post-page-content">
        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Post Form Section */}
          <div className="post-form-section">
            <Post />
          </div>

          {/* Sidebar */}
          <div className="post-sidebar">
            <QuickTips />
            
            {/* Terms and Policies */}
            <div className="terms-notice">
              <h3>📋 Terms & Guidelines</h3>
              <div className="terms-content">
                <p>By creating a listing, you agree to:</p>
                <ul>
                  <li>Provide accurate item information</li>
                  <li>Maintain item in described condition</li>
                  <li>Respond promptly to rental inquiries</li>
                  <li>Follow platform safety guidelines</li>
                </ul>
                <p className="terms-link">
                  <a href="/terms" target="_blank">View full terms and conditions</a>
                </p>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="popular-categories">
              <h3>📂 Popular Categories</h3>
              <div className="category-tags">
                <span className="category-tag">Electronics</span>
                <span className="category-tag">Tools & Equipment</span>
                <span className="category-tag">Cameras</span>
                <span className="category-tag">Sports & Outdoor</span>
                <span className="category-tag">Furniture</span>
                <span className="category-tag">Musical Instruments</span>
                <span className="category-tag">Appliances</span>
                <span className="category-tag">Automotive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;