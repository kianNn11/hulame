import React from 'react';
import './PostContent.css';
import { PhoneIcon, AcademicCapIcon, MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import { Venus, Cake, BookOpen, Star } from "lucide-react";
import { UserCircleIcon, LinkIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';

const PostContent = ({ profileData, successMessage }) => {
  // Extract data from profileData with correct property names
  console.log('PostContent received profileData:', profileData);
  
  // Map from profileData to the expected field names with fallbacks
  const fullName = profileData?.name || '';
  const bio = profileData?.bio || '';
  const courseYear = profileData?.course_year || profileData?.courseYear || '';
  const birthday = profileData?.birthday || '';
  const gender = profileData?.gender || '';
  const socialLink = profileData?.social_link || profileData?.socialLink || '';
  const contactNumber = profileData?.contact_number || profileData?.contactNumber || '';
  const profileImage = profileData?.profile_picture || profileData?.profileImage || null;
  const location = profileData?.location || '';
  const website = profileData?.website || '';
  const education = profileData?.education || '';
  const skills = profileData?.skills || [];
  const rating = profileData?.rating || 0;
  const profileCompletion = profileData?.profile_completion || 0;

  return (
    <main className="postContent">
      <section className="contentSection">
        <div className="contentColumns">

          {/* About Section */}
          <div className="column">
            <div className="aboutContainer">
              <div className="aboutColumns">

                {/* Main About Info */}
                <div className="aboutMainColumn">
                  <div className="aboutContent">
                    <h2 className="sectionTitle">About</h2>
                    
                    {/* Success message display in the About section */}
                    {successMessage && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 animate-pulse">
                        {successMessage}
                      </div>
                    )}

                    {/* Profile Completion Badge */}
                    {profileCompletion > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">Profile Completion</span>
                          <span className="text-sm text-blue-600">{profileCompletion}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${profileCompletion}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Bio Section */}
                    {bio && (
                      <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed">{bio}</p>
                      </div>
                    )}

                    {/* Rating */}
                    {rating > 0 && (
                      <div className="infoItem">
                        <div className="infoRow">
                          <Star className="icon text-yellow-500" />
                          <div>
                            <h3 className="infoLabel">Rating</h3>
                            <p className="infoValue">{rating}/5.0</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="personalInfo">

                      <div className="infoItem">
                        <div className="infoRow">
                          <AcademicCapIcon className="icon" />
                          <div>
                            <h3 className="infoLabel">Course & Year Level</h3>
                            <p className="infoValue">{courseYear || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="infoItem">
                        <div className="infoRow">
                          <Cake className="icon" />
                          <div>
                            <h3 className="infoLabel">Birthday</h3>
                            <p className="infoValue">{birthday || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="infoItem">
                        <div className="infoRow">
                          <Venus className="icon" />
                          <div>
                            <h3 className="infoLabel">Gender</h3>
                            <p className="infoValue">{gender || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {location && (
                        <div className="infoItem">
                          <div className="infoRow">
                            <MapPinIcon className="icon" />
                            <div>
                              <h3 className="infoLabel">Location</h3>
                              <p className="infoValue">{location}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {education && (
                        <div className="infoItem">
                          <div className="infoRow">
                            <BookOpen className="icon" />
                            <div>
                              <h3 className="infoLabel">Education</h3>
                              <p className="infoValue">{education}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="infoItem">
                        <div className="infoRow">
                          <LinkIcon className="icon" />
                          <div>
                            <h3 className="infoLabel">Social Link</h3>
                            {socialLink ? (
                              <a
                                href={socialLink}
                                className="socialLink"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {socialLink}
                              </a>
                            ) : (
                              <p className="infoValue">Not provided</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {website && (
                        <div className="infoItem">
                          <div className="infoRow">
                            <GlobeAltIcon className="icon" />
                            <div>
                              <h3 className="infoLabel">Website</h3>
                              <a
                                href={website}
                                className="socialLink"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {website}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Skills Section */}
                      {skills && skills.length > 0 && (
                        <div className="infoItem">
                          <div className="infoRow">
                            <div className="w-full">
                              <h3 className="infoLabel mb-2">Skills</h3>
                              <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="infoItem">
                        <div className="infoRow">
                          <PhoneIcon className="icon" />
                          <div>
                            <h3 className="infoLabel">Contact Information</h3>
                            <p className="infoValue">{contactNumber || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="postsColumn">
            <div className="postsContainer">
              <h2 className="sectionTitle">Posts</h2>

              <div className="postItem">
                <div className="notificationOutline">
                  <UserCircleIcon className="postIcon" />
                  <p className="postNotification">
                    You posted in <strong>Rental.</strong>{" "}
                    <Link to="/post/1" className="viewPostLink">View Post here.</Link>
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Optional: show profile image and full name on top */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        {profileImage && (
          <img src={profileImage} alt={`${fullName}'s profile`} width={150} style={{ borderRadius: '50%' }} />
        )}
      </div>
    </main>
  );
};

export default PostContent;