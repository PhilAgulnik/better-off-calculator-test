import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setCurrentSkin } from '../utils/skinManager';
import Logo from './Logo';

function AffordabilityMap() {
  useEffect(() => {
    // Apply the rehabilitation skin when this component mounts
    setCurrentSkin('rehabilitation');
    
    // Cleanup: revert to default skin when component unmounts
    return () => {
      setCurrentSkin('entitledto');
    };
  }, []);

  return (
    <div className="affordability-map">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Logo />
          </div>
          <div className="header-text">
            <h1>Housing Affordability Map</h1>
            <p className="subtitle">Explore rent levels and Local Housing Allowance rates across Great Britain</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="map-section">
          <div className="map-container">
            <img 
              src={`${process.env.PUBLIC_URL}/affordability-map.png.png`} 
              alt="Housing Affordability Map of Great Britain showing rent levels and LHA rates by region"
              className="affordability-map-image"
              onLoad={() => console.log('Affordability map image loaded successfully')}
              onError={(e) => {
                console.error('Failed to load affordability map image:', e.target.src);
                console.error('Error details:', e);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="map-placeholder" style={{display: 'none'}}>
              <div className="placeholder-content">
                <h3>Map Image Required</h3>
                <p>Please add the affordability map image as "affordability-map.png" to the public folder.</p>
                <p>The map should show Great Britain with color-coded regions indicating rent levels and LHA rates.</p>
              </div>
            </div>
          </div>
          
          <div className="map-legend">
            <h3>Understanding the Map</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color green"></div>
                <span>Lower rent areas / Higher affordability</span>
              </div>
              <div className="legend-item">
                <div className="legend-color orange"></div>
                <span>Medium rent areas / Moderate affordability</span>
              </div>
              <div className="legend-item">
                <div className="legend-color red"></div>
                <span>Higher rent areas / Lower affordability</span>
              </div>
            </div>
          </div>
        </div>

        <div className="map-info">
          <h2>How to Use This Map</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🏠 Finding Affordable Areas</h3>
              <p>Green areas typically have lower rent costs and higher Local Housing Allowance rates, making them more affordable for Universal Credit claimants.</p>
            </div>
            <div className="info-card">
              <h3>💰 Understanding LHA Rates</h3>
              <p>Each Broad Rental Market Area (BRMA) has different LHA rates. This map helps you compare affordability across different regions.</p>
            </div>
            <div className="info-card">
              <h3>📍 Planning Your Move</h3>
              <p>Use this map to identify areas where your Universal Credit housing element will go further, helping you make informed decisions about where to live.</p>
            </div>
          </div>
        </div>

        <div className="guide-section">
          <h2>Your Guide to Benefits, Housing and Health</h2>
          <p className="guide-intro">Essential information about benefits you can claim when leaving prison, housing support from your council, and how to register with a GP (even if you don't have a fixed address).</p>
          
          <div className="help-areas">
            <div className="help-area">
              <div className="help-area-header">
                <div className="help-area-icon">💰</div>
                <h3>Benefits</h3>
              </div>
              <p>Essential information about benefits you can claim when leaving prison</p>
              <div className="help-topics">
                <ul>
                  <li>Universal Credit application process</li>
                  <li>Housing Benefit and Local Housing Allowance</li>
                  <li>Employment and Support Allowance (ESA)</li>
                  <li>Personal Independence Payment (PIP)</li>
                  <li>Disability Living Allowance (DLA)</li>
                  <li>Jobseeker's Allowance (JSA)</li>
                </ul>
              </div>
              <div className="help-area-actions">
                <Link to="/help-guide/benefits" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="help-area">
              <div className="help-area-header">
                <div className="help-area-icon">🏠</div>
                <h3>Housing Support</h3>
              </div>
              <p>Housing support from your council and accommodation options</p>
              <div className="help-topics">
                <ul>
                  <li>Council housing applications</li>
                  <li>Private rented accommodation</li>
                  <li>Supported housing options</li>
                  <li>Homelessness prevention</li>
                  <li>Deposit schemes and rent guarantees</li>
                  <li>Housing benefit and Universal Credit housing element</li>
                </ul>
              </div>
              <div className="help-area-actions">
                <Link to="/help-guide/housing" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="help-area">
              <div className="help-area-header">
                <div className="help-area-icon">🏥</div>
                <h3>Health Services</h3>
              </div>
              <p>How to register with a GP and access healthcare services</p>
              <div className="help-topics">
                <ul>
                  <li>GP registration without a fixed address</li>
                  <li>Mental health support services</li>
                  <li>Substance misuse support</li>
                  <li>Dental care and prescriptions</li>
                  <li>Hospital treatment and referrals</li>
                  <li>Health insurance and NHS services</li>
                </ul>
              </div>
              <div className="help-area-actions">
                <Link to="/help-guide/health" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="back-to-services">
          <Link to="/rehabilitation-services" className="btn btn-primary">
            ← Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AffordabilityMap;
