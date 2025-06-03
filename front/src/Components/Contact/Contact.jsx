import React, { useState } from 'react'
import './Contact.css'
import contactBg from '../Assets/contact.jpg';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChatBubbleLeftEllipsisIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: "Email Us",
      details: ["hulame@ustp.edu.ph", "support@hulam-e.com"],
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: PhoneIcon,
      title: "Call Us",
      details: ["+63 912 345 6789", "+63 998 876 5432"],
      description: "Available Monday to Friday, 8AM to 5PM"
    },
    {
      icon: MapPinIcon,
      title: "Visit Us",
      details: ["University of Science and Technology", "of Southern Philippines"],
      description: "Claveria, Misamis Oriental, Philippines"
    },
    {
      icon: ClockIcon,
      title: "Office Hours",
      details: ["Monday - Friday: 8:00 AM - 5:00 PM", "Saturday: 9:00 AM - 3:00 PM"],
      description: "Closed on Sundays and holidays"
    }
  ];

  const faqs = [
    {
      question: "How do I post an item for rent?",
      answer: "Simply create an account, click on 'Post New' in the navigation, and fill out the form with your item details, photos, and rental price. Your listing will be live immediately after submission. Make sure to include clear photos and detailed descriptions to attract more renters."
    },
    {
      question: "How does the payment system work?",
      answer: "Payments are handled securely through our platform. Renters pay when they book an item, and we release funds to the item owner after successful completion of the rental period. We use industry-standard encryption to protect all payment information."
    },
    {
      question: "What if an item gets damaged during rental?",
      answer: "We have a comprehensive protection policy. Both parties are encouraged to document the item's condition before and after rental. Take photos from multiple angles before handing over items. In case of disputes, our support team will mediate based on the evidence provided and our damage protection program may cover eligible claims."
    },
    {
      question: "Can I cancel a rental booking?",
      answer: "Yes, you can cancel a booking up to 24 hours before the rental start time for a full refund. Cancellations within 24 hours may be subject to our cancellation policy which includes a partial refund. Item owners can also cancel, but frequent cancellations may affect their account rating."
    },
    {
      question: "Is there a limit to how many items I can rent or list?",
      answer: "There's no limit to the number of items you can list for rent. For renting, you can book multiple items simultaneously, subject to availability and your account standing. New users may have initial limits that increase over time with positive rental history."
    },
    {
      question: "How are rental prices determined?",
      answer: "Rental prices are set by item owners. We recommend researching similar items to price competitively. You can set daily, weekly, or monthly rates with optional discounts for longer rental periods. Our platform provides pricing suggestions based on similar items in your area."
    },
    {
      question: "How does Hulam-e ensure safety and security?",
      answer: "We verify user identities through a secure verification process. All transactions are protected by our secure payment system, and we have a robust review system to help build trust in the community. We also provide insurance options for high-value items and offer 24/7 customer support."
    },
    {
      question: "What happens if a renter returns an item late?",
      answer: "Late returns are subject to additional fees as specified in the rental agreement. Item owners can set their own late return policies, which are displayed before booking. Our system automatically calculates and charges late fees based on the agreed terms."
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setError('');
    setSuccess('');

    try {
      // Here you would typically send the data to your backend
      // const response = await contactService.sendMessage(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setSuccess('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      setSubmitStatus('error');
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus(null);
        setError('');
        setSuccess('');
      }, 5000);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <main className='modern-contact'>
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background">
          <img src={contactBg} alt="Contact Us Background" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <ChatBubbleLeftEllipsisIcon className="badge-icon" />
              Get in Touch
            </span>
            <h1 className="hero-title">
              We're Here to <span className="title-highlight">Help</span>
            </h1>
            <p className="hero-description">
              Have questions, need support, or want to learn more about our platform? 
              Our team is ready to assist you with anything you need.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="info-icon">
                  <info.icon className="icon" />
                </div>
                <h3 className="info-title">{info.title}</h3>
                <div className="info-details">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="info-detail">{detail}</p>
                  ))}
                </div>
                <p className="info-description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-main-content">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-header">
                <h2 className="form-title">Send us a Message</h2>
                <p className="form-subtitle">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {submitStatus && (
                <div className={`notification ${submitStatus}`}>
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircleIcon className="notification-icon" />
                      <div>
                        <h4>Message Sent Successfully!</h4>
                        <p>{success || 'Thank you for contacting us. We\'ll respond within 24 hours.'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XMarkIcon className="notification-icon" />
                      <div>
                        <h4>Failed to Send Message</h4>
                        <p>{error || 'Please try again or contact us directly via email.'}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="form-input"
                    placeholder="Tell us how we can help you..."
                  />
                  <div className="character-count">
                    {formData.message.length}/1000
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="btn-icon" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <div className="faq-icon-container">
              <QuestionMarkCircleIcon className="section-icon pulse-animation" />
            </div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Find quick answers to common questions about Hulam-e
            </p>
          </div>
          
          <div className="faq-search-container">
            <input 
              type="text" 
              className="faq-search" 
              placeholder="Search questions..." 
              aria-label="Search frequently asked questions"
            />
          </div>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className={`faq-question ${expandedFaq === index ? 'expanded' : ''}`}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={expandedFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDownIcon className="chevron-icon" />
                </button>
                <div 
                  className={`faq-answer ${expandedFaq === index ? 'expanded' : ''}`}
                  id={`faq-answer-${index}`}
                  aria-hidden={expandedFaq !== index}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="faq-more-help">
            <h3>Still need help?</h3>
            <p>If you couldn't find the answer to your question, feel free to contact our support team.</p>
            <button className="contact-support-btn">
              <ChatBubbleLeftEllipsisIcon className="btn-icon" />
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact