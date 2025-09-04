import React, { useEffect } from 'react';
import { setCurrentSkin } from '../utils/skinManager';
import Logo from './Logo';

function HelpGuide() {
  useEffect(() => {
    // Apply the rehabilitation skin when this component mounts
    setCurrentSkin('rehabilitation');
    
    // Cleanup: revert to default skin when component unmounts
    return () => {
      setCurrentSkin('entitledto');
    };
  }, []);

  const helpAreas = [
    {
      id: 'benefits',
      title: 'Benefits',
      description: 'Essential information about benefits you can claim when leaving prison',
      icon: '💰',
      link: '/help-guide/benefits',
      topics: [
        'Universal Credit application process',
        'Housing Benefit and Local Housing Allowance',
        'Employment and Support Allowance (ESA)',
        'Personal Independence Payment (PIP)',
        'Disability Living Allowance (DLA)',
        'Jobseeker\'s Allowance (JSA)'
      ]
    },
    {
      id: 'housing',
      title: 'Housing Support',
      description: 'Housing support from your council and accommodation options',
      icon: '🏠',
      link: '/help-guide/housing',
      topics: [
        'Council housing applications',
        'Private rented accommodation',
        'Supported housing options',
        'Homelessness prevention',
        'Deposit schemes and rent guarantees',
        'Housing benefit and Universal Credit housing element'
      ]
    },
    {
      id: 'health',
      title: 'Health Services',
      description: 'How to register with a GP and access healthcare services',
      icon: '🏥',
      link: '/help-guide/health',
      topics: [
        'GP registration without a fixed address',
        'Mental health support services',
        'Substance misuse support',
        'Dental care and prescriptions',
        'Hospital treatment and referrals',
        'Health insurance and NHS services'
      ]
    }
  ];

  return (
    <div className="help-guide">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Logo />
          </div>
          <div className="header-text">
            <h1>Your Guide to Benefits, Housing and Health</h1>
            <p className="subtitle">Essential information and support for life after prison</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="hero-section">
          <h2>Getting the Support You Need</h2>
          <p className="hero-description">
            Leaving prison can be challenging, but you don't have to face it alone. This guide provides 
            essential information about the benefits, housing support, and health services available to help 
            you rebuild your life and move forward with confidence.
          </p>
        </div>

        <div className="help-areas-grid">
          {helpAreas.map((area) => (
            <div key={area.id} className="help-area-card">
              <div className="help-area-icon">{area.icon}</div>
              <h3>{area.title}</h3>
              <p className="help-area-description">{area.description}</p>
              
              <div className="help-topics">
                <h4>Key Topics Covered:</h4>
                <ul>
                  {area.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
              
              <div className="help-area-actions">
                <a href={area.link} className="btn btn-primary">
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-links">
          <h2>Quick Links</h2>
          <div className="quick-links-grid">
            <a href="/rehabilitation-calculator" className="quick-link-card">
              <div className="quick-link-icon">🧮</div>
              <h3>Benefits Calculator</h3>
              <p>Calculate your Universal Credit and other benefits</p>
            </a>
            <a href="/budgeting-tool" className="quick-link-card">
              <div className="quick-link-icon">📊</div>
              <h3>Budgeting Tool</h3>
              <p>Create a budget and manage your finances</p>
            </a>
            <a href="/affordability-map" className="quick-link-card">
              <div className="quick-link-icon">🗺️</div>
              <h3>Affordability Map</h3>
              <p>Find affordable areas to live</p>
            </a>
          </div>
        </div>

        <div className="back-to-services">
          <a href="/rehabilitation-services" className="btn btn-secondary">
            ← Back to Services
          </a>
        </div>
      </div>
    </div>
  );
}

export default HelpGuide;
