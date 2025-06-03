import React, { useState, useEffect } from 'react'
import './About.css'
import heroBg from '../Assets/pic2.jpg';
import aboutImage from '../Assets/pic3.jpg';
import TeamMember from './TeamMember';
import { 
  UserGroupIcon, 
  BookOpenIcon, 
  HandRaisedIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const [stats, setStats] = useState({
    students: 0,
    items: 0,
    transactions: 0,
    satisfaction: 0
  });

  useEffect(() => {
    // Animate counters
    const animateCounters = () => {
      const duration = 2000;
      const targets = { students: 1200, items: 850, transactions: 500, satisfaction: 98 };
      const startTime = Date.now();

      const updateCounters = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setStats({
          students: Math.floor(targets.students * progress),
          items: Math.floor(targets.items * progress),
          transactions: Math.floor(targets.transactions * progress),
          satisfaction: Math.floor(targets.satisfaction * progress)
        });

        if (progress < 1) {
          requestAnimationFrame(updateCounters);
        }
      };

      requestAnimationFrame(updateCounters);
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, []);

  const values = [
    {
      icon: HandRaisedIcon,
      title: "Community First",
      description: "Building connections and fostering a supportive environment where students help each other succeed."
    },
    {
      icon: ShieldCheckIcon,
      title: "Trust & Safety",
      description: "Ensuring secure transactions and verified users for a reliable and trustworthy platform."
    },
    {
      icon: SparklesIcon,
      title: "Innovation",
      description: "Continuously improving our platform with cutting-edge technology and user-driven features."
    },
    {
      icon: HeartIcon,
      title: "Sustainability",
      description: "Promoting eco-friendly practices through sharing economy and reducing educational waste."
    }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <main className='modern-about'>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <img src={heroBg} alt="About Us Hero Background" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <AcademicCapIcon className="badge-icon" />
              About Hulam-e
            </span>
            <h1 className="hero-title">
              Empowering <span className="title-highlight">USTP Students</span>
              <br />Through Smart Solutions
            </h1>
            <p className="hero-description">
              A student-driven platform focused on making educational resources more accessible 
              and affordable for the USTP community through innovative Edu-Rental solutions.
            </p>
            <div className="hero-actions">
              <button onClick={() => handleNavigation('/rental-section')} className="hero-btn primary">
                <SparklesIcon className="btn-icon" />
                Explore Rentals
              </button>
              <button onClick={() => handleNavigation('/contact')} className="hero-btn secondary">
                Contact Us
                <ArrowRightIcon className="btn-icon" />
              </button>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="hero-stats">
            <div className="stat-card">
              <UserGroupIcon className="stat-icon" />
              <div className="stat-number">{stats.students.toLocaleString()}+</div>
              <div className="stat-label">Students Served</div>
            </div>
            <div className="stat-card">
              <BookOpenIcon className="stat-icon" />
              <div className="stat-number">{stats.items.toLocaleString()}+</div>
              <div className="stat-label">Items Available</div>
            </div>
            <div className="stat-card">
              <ChartBarIcon className="stat-icon" />
              <div className="stat-number">{stats.transactions.toLocaleString()}+</div>
              <div className="stat-label">Successful Rentals</div>
            </div>
            <div className="stat-card">
              <HeartIcon className="stat-icon" />
              <div className="stat-number">{stats.satisfaction}%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Mission & Vision</h2>
            <p className="section-subtitle">
              Driving positive change in educational accessibility and community collaboration
            </p>
          </div>
          
          <div className="mission-vision-cards">
            <div className="mission-card">
              <div className="card-icon mission-icon">
                <HandRaisedIcon className="icon" />
              </div>
              <h3>Our Mission</h3>
              <p>
                To create a sustainable and accessible educational ecosystem where USTP students 
                can easily share, rent, and access learning resources, fostering collaboration 
                and reducing educational costs for everyone.
              </p>
            </div>
            
            <div className="vision-card">
              <div className="card-icon vision-icon">
                <SparklesIcon className="icon" />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become the leading platform for educational resource sharing in the Philippines, 
                empowering students nationwide with affordable access to quality learning materials 
                and building stronger academic communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <span className="story-badge">Our Story</span>
              <h2 className="story-title">Building a Smarter Campus Community</h2>
              <p className="story-description">
                HULAM-E was born from a simple observation: students often struggle to afford 
                expensive textbooks and equipment, while others have unused resources sitting idle. 
                We saw an opportunity to bridge this gap and create a win-win solution.
              </p>
              <p className="story-description">
                More than just a rental service, HULAM-E is about building a smarter, more 
                connected campus where students help each other succeed. We believe in the 
                power of community and the impact of sharing knowledge and resources.
              </p>
              
              <div className="story-features">
                <div className="feature-item">
                  <CheckCircleIcon className="feature-icon" />
                  <span>Student-driven platform</span>
                </div>
                <div className="feature-item">
                  <CheckCircleIcon className="feature-icon" />
                  <span>Affordable access to resources</span>
                </div>
                <div className="feature-item">
                  <CheckCircleIcon className="feature-icon" />
                  <span>Sustainable sharing economy</span>
                </div>
                <div className="feature-item">
                  <CheckCircleIcon className="feature-icon" />
                  <span>Community collaboration</span>
                </div>
              </div>
            </div>
            
            <div className="story-image">
              <div className="image-container">
                <img src={aboutImage} alt="HULAM-E Educational Resources" className="story-img" />
                <div className="image-decoration">
                  <div className="decoration-circle circle-1"></div>
                  <div className="decoration-circle circle-2"></div>
                  <div className="decoration-circle circle-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do and every decision we make
            </p>
          </div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="value-icon">
                  <value.icon className="icon" />
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Member Section */}
      <TeamMember />
    </main>
  )
}

export default About