import React, { useEffect } from 'react';
import { setCurrentSkin } from '../utils/skinManager';
import Logo from './Logo';

function HelpGuideHousing() {
  useEffect(() => {
    setCurrentSkin('rehabilitation');
    return () => {
      setCurrentSkin('entitledto');
    };
  }, []);

  return (
    <div className="help-guide-page">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Logo />
          </div>
          <div className="header-text">
            <h1>Housing Support Guide</h1>
            <p className="subtitle">Housing support from your council and accommodation options</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="help-content">
          <div className="help-section">
            <h2>Council Housing Applications</h2>
            <p>Your local council can help you find suitable accommodation. Most councils have housing waiting lists, but some people may be given priority.</p>
            
            <div className="info-box">
              <h3>Priority for Prison Leavers:</h3>
              <ul>
                <li>You may be considered a priority if you're homeless or at risk of homelessness</li>
                <li>Some councils give priority to people leaving prison</li>
                <li>You'll need to complete a housing application form</li>
                <li>Be prepared to provide references and proof of your circumstances</li>
                <li>Waiting times vary significantly between areas</li>
              </ul>
            </div>

            <div className="action-box">
              <h3>How to Apply:</h3>
              <ul>
                <li>Contact your local council's housing department</li>
                <li>Ask about their housing allocation policy for ex-offenders</li>
                <li>Complete the application form with as much detail as possible</li>
                <li>Keep copies of all documents and correspondence</li>
                <li>Follow up regularly on your application</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Private Rented Accommodation</h2>
            <p>Private renting can be more flexible than council housing, but you may face challenges as an ex-offender.</p>
            
            <div className="info-box">
              <h3>Challenges and Solutions:</h3>
              <ul>
                <li><strong>References:</strong> Some landlords may be reluctant to rent to ex-offenders</li>
                <li><strong>Deposits:</strong> You may need help with deposit schemes</li>
                <li><strong>Rent guarantees:</strong> Some councils offer rent guarantee schemes</li>
                <li><strong>Supporting landlords:</strong> Some charities help match ex-offenders with understanding landlords</li>
              </ul>
            </div>

            <div className="action-box">
              <h3>Tips for Private Renting:</h3>
              <ul>
                <li>Be honest about your background when asked</li>
                <li>Look for landlords who are part of ex-offender support schemes</li>
                <li>Consider shared accommodation as a stepping stone</li>
                <li>Use our affordability map to find areas with lower rents</li>
                <li>Get help from housing support services</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Supported Housing Options</h2>
            <p>Supported housing provides accommodation with additional support services, which can be particularly helpful when leaving prison.</p>
            
            <div className="info-box">
              <h3>Types of Supported Housing:</h3>
              <ul>
                <li><strong>Hostels:</strong> Short-term accommodation with basic support</li>
                <li><strong>Supported lodgings:</strong> Living with a family who provides support</li>
                <li><strong>Specialist accommodation:</strong> For people with specific needs (mental health, substance misuse)</li>
                <li><strong>Move-on accommodation:</strong> Stepping stone between supported housing and independent living</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Homelessness Prevention</h2>
            <p>If you're at risk of becoming homeless, your council has a duty to help prevent this.</p>
            
            <div className="info-box">
              <h3>Council Duties:</h3>
              <ul>
                <li>Assess your housing needs and circumstances</li>
                <li>Provide advice and assistance to prevent homelessness</li>
                <li>Help you find alternative accommodation</li>
                <li>Provide temporary accommodation if you become homeless</li>
                <li>Help with deposits, rent in advance, or other financial assistance</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Deposit Schemes and Rent Guarantees</h2>
            <p>Many councils and charities offer schemes to help with the upfront costs of renting.</p>
            
            <div className="action-box">
              <h3>Available Schemes:</h3>
              <ul>
                <li><strong>Deposit guarantee schemes:</strong> Council guarantees your deposit to the landlord</li>
                <li><strong>Rent in advance schemes:</strong> Help with first month's rent</li>
                <li><strong>Rent guarantee schemes:</strong> Council guarantees rent payments if you fall behind</li>
                <li><strong>Bond schemes:</strong> Charities provide deposit bonds</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Getting Help and Support</h2>
            <p>Don't try to navigate housing issues alone. There are many organisations that can help.</p>
            
            <div className="action-box">
              <h3>Where to Get Help:</h3>
              <ul>
                <li><strong>Your local council:</strong> Housing department and homelessness prevention team</li>
                <li><strong>Probation services:</strong> Your probation officer can help with housing applications</li>
                <li><strong>Shelter:</strong> Free housing advice and support</li>
                <li><strong>Citizens Advice:</strong> Help with housing problems and applications</li>
                <li><strong>Local charities:</strong> Many areas have charities that help ex-offenders with housing</li>
                <li><strong>Our affordability map:</strong> Find areas with affordable housing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="navigation-links">
          <a href="/help-guide" className="btn btn-secondary">← Back to Help Guide</a>
          <a href="/affordability-map" className="btn btn-primary">View Affordability Map</a>
        </div>
      </div>
    </div>
  );
}

export default HelpGuideHousing;
