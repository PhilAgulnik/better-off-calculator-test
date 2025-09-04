import React, { useEffect } from 'react';
import { setCurrentSkin } from '../utils/skinManager';
import Logo from './Logo';

function HelpGuideBenefits() {
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
            <h1>Benefits Guide</h1>
            <p className="subtitle">Essential information about benefits you can claim when leaving prison</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="help-content">
          <div className="help-section">
            <h2>Universal Credit</h2>
            <p>Universal Credit is the main benefit for people of working age. It replaces several older benefits including Jobseeker's Allowance, Employment and Support Allowance, and Housing Benefit.</p>
            
            <div className="info-box">
              <h3>Key Points for Prison Leavers:</h3>
              <ul>
                <li>You can apply for Universal Credit up to 35 days before your release date</li>
                <li>You'll need a bank account and email address to apply online</li>
                <li>Your first payment usually takes 5 weeks to arrive</li>
                <li>You may be able to get an advance payment if you're in financial hardship</li>
                <li>You'll need to attend regular appointments at your local Jobcentre Plus</li>
              </ul>
            </div>

            <div className="action-box">
              <h3>What You Need to Apply:</h3>
              <ul>
                <li>National Insurance number</li>
                <li>Bank account details</li>
                <li>Email address and phone number</li>
                <li>Proof of identity (passport, driving licence, or birth certificate)</li>
                <li>Details of any savings or other income</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Housing Benefit and Local Housing Allowance</h2>
            <p>If you're renting privately, your housing costs are covered through the housing element of Universal Credit. This is based on Local Housing Allowance (LHA) rates in your area.</p>
            
            <div className="info-box">
              <h3>Important Information:</h3>
              <ul>
                <li>LHA rates vary by area and bedroom entitlement</li>
                <li>You can check LHA rates for different areas using our affordability map</li>
                <li>If your rent is higher than the LHA rate, you'll need to pay the difference</li>
                <li>Some people may be entitled to Discretionary Housing Payments for extra help</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Employment and Support Allowance (ESA)</h2>
            <p>ESA is for people who can't work due to illness or disability. It's being replaced by Universal Credit, but some people may still be able to claim it.</p>
            
            <div className="info-box">
              <h3>For Prison Leavers:</h3>
              <ul>
                <li>You may be able to claim ESA if you have a health condition that affects your ability to work</li>
                <li>You'll need a medical assessment to determine your eligibility</li>
                <li>ESA can provide extra financial support on top of Universal Credit</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Personal Independence Payment (PIP)</h2>
            <p>PIP helps with extra costs if you have a long-term physical or mental health condition or disability.</p>
            
            <div className="info-box">
              <h3>Key Information:</h3>
              <ul>
                <li>PIP is not means-tested, so it's not affected by your income or savings</li>
                <li>It's paid in addition to other benefits</li>
                <li>You'll need to complete a detailed application form</li>
                <li>You may be asked to attend a face-to-face assessment</li>
              </ul>
            </div>
          </div>

          <div className="help-section">
            <h2>Getting Help and Support</h2>
            <p>Applying for benefits can be complex, especially when you're dealing with other challenges after leaving prison.</p>
            
            <div className="action-box">
              <h3>Where to Get Help:</h3>
              <ul>
                <li><strong>Citizens Advice:</strong> Free, independent advice on benefits and other issues</li>
                <li><strong>Jobcentre Plus:</strong> Help with Universal Credit applications and job searching</li>
                <li><strong>Local charities:</strong> Many areas have charities that help ex-offenders with benefits</li>
                <li><strong>Probation services:</strong> Your probation officer can help with benefit applications</li>
                <li><strong>Our calculator:</strong> Use our benefits calculator to see what you might be entitled to</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="navigation-links">
          <a href="/help-guide" className="btn btn-secondary">← Back to Help Guide</a>
          <a href="/rehabilitation-calculator" className="btn btn-primary">Calculate My Benefits</a>
        </div>
      </div>
    </div>
  );
}

export default HelpGuideBenefits;
