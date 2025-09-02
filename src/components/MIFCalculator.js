import React, { useState } from 'react';

function MIFCalculator() {
  const [mifData, setMifData] = useState({
    age: '',
    hasChildren: false,
    hasPartner: false,
    partnerAge: '',
    hasDisability: false,
    hasLCWRA: false
  });

  // MIF calculation logic based on benefits calculator standards
  const calculateMIF = () => {
    const { age, hasChildren, hasPartner, partnerAge, hasDisability, hasLCWRA } = mifData;
    
    let mifAmount = 0;
    let explanation = [];
    
    // Basic MIF calculation based on age and circumstances
    if (age >= 25) {
      mifAmount = 311.68; // Standard rate for 25+
      explanation.push("Standard rate for claimants aged 25 and over: £311.68");
    } else {
      mifAmount = 246.58; // Standard rate for under 25
      explanation.push("Standard rate for claimants under 25: £246.58");
    }
    
    // Partner additions
    if (hasPartner) {
      if (partnerAge >= 25) {
        mifAmount += 244.11; // Partner rate for 25+
        explanation.push("Partner addition (25+): £244.11");
      } else {
        mifAmount += 193.62; // Partner rate for under 25
        explanation.push("Partner addition (under 25): £193.62");
      }
    }
    
    // Child additions
    if (hasChildren) {
      mifAmount += 315.00; // First child
      explanation.push("First child: £315.00");
      // Additional children would be added here
    }
    
    // Disability additions
    if (hasDisability) {
      mifAmount += 146.31; // Disability element
      explanation.push("Disability element: £146.31");
    }
    
    if (hasLCWRA) {
      mifAmount += 390.06; // LCWRA element
      explanation.push("Limited Capability for Work and Work-Related Activity: £390.06");
    }
    
    return { mifAmount, explanation };
  };

  const handleMIFInputChange = (field, value) => {
    setMifData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const { mifAmount, explanation } = calculateMIF();

  return (
    <div className="mif-calculator-page">
      <div className="container">
        <div className="calculator-header">
          <h1>MIF Calculator</h1>
          <p className="subtitle">Calculate your Minimum Income Floor for Universal Credit</p>
          <a href="/minimum-income-floor" className="back-link">← Back to MIF Information</a>
        </div>

        <div className="calculator-content">
          <div className="calculator-section">
            <h2>Enter Your Details</h2>
            <p>Fill in your information to calculate your Minimum Income Floor.</p>
            
            <div className="mif-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Your Age *</label>
                  <input
                    type="number"
                    id="age"
                    value={mifData.age}
                    onChange={(e) => handleMIFInputChange('age', e.target.value)}
                    className="form-control"
                    placeholder="Enter your age"
                    min="16"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={mifData.hasPartner}
                      onChange={(e) => handleMIFInputChange('hasPartner', e.target.checked)}
                    />
                    Do you have a partner?
                  </label>
                </div>
              </div>
              
              {mifData.hasPartner && (
                <div className="form-group">
                  <label htmlFor="partnerAge">Partner's Age *</label>
                  <input
                    type="number"
                    id="partnerAge"
                    value={mifData.partnerAge}
                    onChange={(e) => handleMIFInputChange('partnerAge', e.target.value)}
                    className="form-control"
                    placeholder="Enter partner's age"
                    min="16"
                    max="100"
                  />
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={mifData.hasChildren}
                      onChange={(e) => handleMIFInputChange('hasChildren', e.target.checked)}
                    />
                    Do you have children?
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={mifData.hasDisability}
                      onChange={(e) => handleMIFInputChange('hasDisability', e.target.checked)}
                    />
                    Do you have a disability?
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={mifData.hasLCWRA}
                      onChange={(e) => handleMIFInputChange('hasLCWRA', e.target.checked)}
                    />
                    Do you have LCWRA (Limited Capability for Work and Work-Related Activity)?
                  </label>
                </div>
              </div>
            </div>

            {mifData.age && (
              <div className="mif-results">
                <h3>Your Minimum Income Floor</h3>
                <div className="mif-amount">
                  <span className="amount-label">Monthly MIF:</span>
                  <span className="amount-value">£{mifAmount.toFixed(2)}</span>
                </div>
                <div className="mif-breakdown">
                  <h4>Breakdown:</h4>
                  <ul>
                    {explanation.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mif-note">
                  <p><strong>Note:</strong> This is an estimate. Your actual MIF may vary based on specific circumstances. 
                  The MIF applies after your 12-month start-up period ends.</p>
                </div>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>What This Means</h3>
            <p>
              Your Minimum Income Floor (MIF) is the amount Universal Credit assumes you earn each month, 
              even if your actual earnings are lower. If you earn less than this amount, your Universal Credit 
              will be calculated using the MIF instead of your actual earnings.
            </p>
            <p>
              <strong>Target:</strong> Aim to earn at least £{mifData.age ? mifAmount.toFixed(2) : '0.00'} per month 
              to avoid MIF penalties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MIFCalculator;
