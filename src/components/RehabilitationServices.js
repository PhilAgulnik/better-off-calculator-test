import React, { useEffect } from 'react';
import { setCurrentSkin } from '../utils/skinManager';
import Logo from './Logo';

function RehabilitationServices() {
  useEffect(() => {
    // Apply the rehabilitation skin when this component mounts
    setCurrentSkin('rehabilitation');
    
    // Cleanup: revert to default skin when component unmounts
    return () => {
      setCurrentSkin('entitledto');
    };
  }, []);
  const services = [
    {
      id: 'income-maximisation',
      title: 'Income Maximisation',
      description: 'Get help to claim all the benefits and financial support you\'re entitled to.',
      icon: '💰',
      link: '/rehabilitation-calculator',
      comingSoon: false
    },
    {
      id: 'manage-finances',
      title: 'Manage My Finances',
      description: 'Create a budget and learn how to manage your money effectively.',
      icon: '📊',
      link: '/budgeting-tool',
      comingSoon: false
    },
    {
      id: 'finding-home',
      title: 'Finding a Home',
      description: 'Find out about rent levels and benefits using our affordability map',
      icon: '🏠',
      link: '/affordability-map',
      comingSoon: false
    },
    {
      id: 'employment-support',
      title: 'Employment Support',
      description: 'Find work opportunities and get help with job applications and interviews.',
      icon: '💼',
      link: '/rehabilitation-services/employment',
      comingSoon: true
    },
    {
      id: 'guide-benefits',
      title: 'Your Guide to Benefits, Housing and Health',
      description: 'Essential information about benefits you can claim when leaving prison, housing support from your council, and how to register with a GP (even if you don\'t have a fixed abode).',
      icon: '📋',
      link: '/rehabilitation-calculator',
      comingSoon: false
    },
    {
      id: 'education-training',
      title: 'Education & Training',
      description: 'Improve your skills and qualifications for better opportunities.',
      icon: '🎓',
      link: '/rehabilitation-services/education',
      comingSoon: true
    }
  ];

  return (
    <div className="rehabilitation-services">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Logo />
          </div>
          <div className="header-text">
            <h1>Supporting Your Journey</h1>
            <p className="subtitle">Practical tools and guidance for life after prison</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="hero-section">
          <h2>Welcome to Our Services</h2>
          <p className="hero-description">
            Welcome to our rehabilitation support services. We're here to help you prepare for life after prison 
            with practical tools and guidance for managing your finances, finding work, and accessing support.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              
              {service.comingSoon ? (
                <div className="service-actions">
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
              ) : (
                <div className="service-actions">
                  <a href={service.link} className="btn btn-primary">
                    Get Started
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="adviser-section">
          <div className="adviser-card">
            <h3>For Advisers</h3>
            <p>
              Supporting someone through rehabilitation? We have special tools and resources to help you 
              provide the best support possible.
            </p>
            <div className="adviser-actions">
              <button className="btn btn-secondary">Adviser Dashboard</button>
              <button className="btn btn-outline">Training Resources</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RehabilitationServices;
