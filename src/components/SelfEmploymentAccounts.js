import React, { useState } from 'react';
import { useTextManager } from '../hooks/useTextManager';
import Navigation from './Navigation';

function SelfEmploymentAccounts() {
  const { getTextValue } = useTextManager();
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const features = [
    {
      key: 'SelfEmploymentAccounts.Features.TaxSelfAssessment',
      icon: '📊',
      title: 'Self-Assessment Tax Form',
      description: 'Complete your annual tax return with our step-by-step form. Calculate your tax liability and submit directly to HMRC.',
      available: true
    },
    {
      key: 'dashboard',
      icon: '📈',
      title: 'Dashboard',
      description: 'Track your business performance with real-time analytics, profit margins, and key financial metrics all in one place.',
      available: false
    },
    {
      key: 'mif',
      icon: '⚖️',
      title: 'Minimum Income Floor',
      description: 'Automatically calculate and track your Minimum Income Floor requirements for Universal Credit, ensuring compliance.',
      available: true
    },
    {
      key: 'monthly-profit',
      icon: '💰',
      title: 'Manage Monthly Profit',
      description: 'Every month you have to provide Universal Credit with your business income and outgoings. Gather your data, fill in your monthly reporting form and maximise your income using our monthly profit tool',
      available: true
    },
    {
      key: 'receipts-invoices',
      icon: '🧾',
      title: 'Receipts and Invoices',
      description: 'Digitally store and organize all your receipts and invoices, with automatic categorization for tax purposes.',
      available: true
    },
    {
      key: 'learning',
      icon: '📚',
      title: 'Learning Resources',
      description: 'Access guides, tutorials, and best practices for self-employed business management and tax compliance.',
      available: false
    },
    {
      key: 'business-mentor',
      icon: '👥',
      title: 'Your Business Mentor',
      description: 'Find a mentor and communicate with them to get personalized guidance for your business growth and development.',
      available: false
    },
    {
      key: 'business-admin-guide',
      icon: '🛠️',
      title: 'Business Administration Guide',
      description: 'Online tools to learn about marketing, accounting, and other essential business tools for self-employed success.',
      available: false
    }
  ];

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail('');
      // In a real implementation, you would send the email to your backend
      console.log('Email submitted:', email);
    }, 1000);
  };

  return (
    <div className="self-employment-accounts-page">
      <div className="container">
        <div className="card">
          <h1>{getTextValue('SelfEmploymentAccounts.Page.Title', 'Self-Employment Accounts')}</h1>
          
          <p className="description">
            {getTextValue('SelfEmploymentAccounts.Page.Description', 'Our comprehensive self-employment accounts service helps you manage your Universal Credit reporting and tax obligations.')}
          </p>

          <div className="features-section">
            <h2>{getTextValue('SelfEmploymentAccounts.Features.Title', 'Features')}</h2>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  {!feature.available && (
                    <span className="coming-soon">Coming Soon</span>
                  )}
                  {feature.available && feature.key === 'SelfEmploymentAccounts.Features.TaxSelfAssessment' && (
                    <div className="feature-action">
                      <a href="/self-assessment-tax-form" className="btn btn-primary btn-sm">
                        Try Tax Form Now
                      </a>
                    </div>
                  )}
                  {feature.available && feature.key === 'mif' && (
                    <div className="feature-action">
                      <a href="/minimum-income-floor" className="btn btn-primary btn-sm">
                        Learn About MIF
                      </a>
                    </div>
                  )}
                  {feature.available && feature.key === 'monthly-profit' && (
                    <div className="feature-action">
                      <a href="/monthly-profit" className="btn btn-primary btn-sm">
                        Try Monthly Profit Tool
                      </a>
                    </div>
                  )}
                  {feature.available && feature.key === 'receipts-invoices' && (
                    <div className="feature-action">
                      <a href="/self-employment-accounts/invoices-receipts" className="btn btn-primary btn-sm">
                        Manage Invoices & Receipts
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="cta-section">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => window.open('/self-assessment-tax-form', '_blank')}
              style={{ marginRight: '1rem' }}
            >
              Try Self-Assessment Tax Form
            </button>
            
            {!showSignUpForm && !submitted && (
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => setShowSignUpForm(true)}
              >
                Sign Up Now
              </button>
            )}
            
            {showSignUpForm && !submitted && (
              <div className="sign-up-form">
                <form onSubmit={handleSignUp}>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowSignUpForm(false)}
                      style={{ marginLeft: '1rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {submitted && (
              <div className="success-message">
                <p>Thanks for getting in contact. This functionality is not working right now. To find out more please email phil@entitledto.co.uk</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setShowSignUpForm(false);
                  }}
                >
                  Sign Up Another Email
                </button>
              </div>
            )}
            
            <p className="cta-note">
              Get started with our self-employment accounts service today
            </p>
          </div>
        </div>
      </div>
      
      <Navigation showRelatedTools={false} />
    </div>
  );
}

export default SelfEmploymentAccounts;
