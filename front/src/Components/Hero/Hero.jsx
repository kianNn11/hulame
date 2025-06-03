import React, { useState, useEffect } from 'react'
import heroImage from '../Assets/landing.png'
import './Hero.css'
import { Link } from 'react-router-dom'
import { AcademicCapIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline'

const Hero = () => {
  const [stats, setStats] = useState({ users: 0, items: 0, satisfaction: 0 });

  useEffect(() => {
    // Animate counters
    const animateCounters = () => {
      const duration = 2000;
      const targets = { users: 1200, items: 850, satisfaction: 98 };
      const startTime = Date.now();

      const updateCounters = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setStats({
          users: Math.floor(targets.users * progress),
          items: Math.floor(targets.items * progress),
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

  return (
    <section className='hero-simple'>
      <div className='hero-container-simple'>
        <div className='hero-content-simple'>          
          <h1 className='hero-title-simple'>
            Academic Resource <span className='hero-highlight-simple'>Rental Platform</span>
          </h1>
          
          <p className='hero-subtitle-simple'>
            Access quality academic resources including textbooks, laboratory equipment, and 
            technology devices at affordable rental rates. Supporting students in their educational journey.
          </p>

          <div className='hero-cta-simple'>
            <Link to="/register" className='hero-btn-primary-simple'>
              Get Started
            </Link>
            <Link to="/login" className='hero-btn-secondary-simple'>
              Sign In
            </Link>
          </div>

          <div className='hero-features-simple'>
            <div className='feature-item-simple'>
              <ShieldCheckIcon className='feature-icon-simple' />
              <div className='feature-text-simple'>
                <h3>Verified Items</h3>
                <p>Quality assured resources</p>
              </div>
            </div>
            <div className='feature-item-simple'>
              <ClockIcon className='feature-icon-simple' />
              <div className='feature-text-simple'>
                <h3>Flexible Rental</h3>
                <p>Daily, weekly, or monthly options</p>
              </div>
            </div>
            <div className='feature-item-simple'>
              <AcademicCapIcon className='feature-icon-simple' />
              <div className='feature-text-simple'>
                <h3>Academic Focus</h3>
                <p>Designed for student needs</p>
              </div>
            </div>
          </div>

          <div className='hero-stats-simple'>
            <div className='stat-item-simple'>
              <div className='stat-number-simple'>{stats.users.toLocaleString()}+</div>
              <div className='stat-label-simple'>Students Served</div>
            </div>
            <div className='stat-item-simple'>
              <div className='stat-number-simple'>{stats.items.toLocaleString()}+</div>
              <div className='stat-label-simple'>Items Available</div>
            </div>
            <div className='stat-item-simple'>
              <div className='stat-number-simple'>{stats.satisfaction}%</div>
              <div className='stat-label-simple'>Satisfaction Rate</div>
            </div>
          </div>
        </div>

        <div className="hero-visual-simple">
          <div className='hero-image-container-simple'>
            <img src={heroImage} alt="Academic Resources Platform" className='hero-image-simple'/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero