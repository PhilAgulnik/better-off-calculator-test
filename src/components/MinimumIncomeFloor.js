import React, { useState } from 'react';

function MinimumIncomeFloor() {
  return (
    <div className="mif-page">
      <div className="container">
        <div className="mif-header">
          <h1>Minimum Income Floor (MIF)</h1>
          <p className="subtitle">Understanding how the MIF affects your Universal Credit as a self-employed person</p>
        </div>

        <div className="mif-content">
          {/* MIF Calculator Link Section - Simple and clean */}
          <div className="mif-section calculator-link-section">
            <div className="calculator-intro">
              <h2>Calculate Your Minimum Income Floor</h2>
              <p className="calculator-description">
                Use our dedicated MIF calculator to find out exactly how much you need to earn each month to avoid MIF penalties.
              </p>
              <div className="calculator-action">
                <a href="/mif-calculator" className="btn btn-primary btn-lg">
                  Open MIF Calculator
                </a>
              </div>
            </div>
          </div>
          
          {/* What is MIF Section */}
          <div className="mif-section">
            <h2>What is the Minimum Income Floor?</h2>
            <p>
              The Minimum Income Floor (MIF) is a rule that applies to self-employed Universal Credit claimants. 
              It assumes you earn at least the equivalent of working 35 hours per week at the National Living Wage, 
              even if your actual earnings are lower.
            </p>
            
            <div className="key-points">
              <h3>Key Points:</h3>
              <ul>
                <li><strong>Start-up Period:</strong> The MIF applies after a 12-month "start-up period" for new businesses</li>
                <li><strong>Calculation Basis:</strong> It's calculated based on your age, family circumstances, and any disabilities</li>
                <li><strong>Impact:</strong> If your actual earnings are below the MIF, Universal Credit will be calculated using the MIF amount instead</li>
                <li><strong>Purpose:</strong> This can significantly affect your Universal Credit entitlement</li>
              </ul>
            </div>
            <div className="important-note">
              <p><strong>Important:</strong> The MIF is designed to encourage self-employed people to work sufficient hours 
              and earn enough to support themselves, similar to employed claimants.</p>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mif-section">
            <h2>Real-World Examples</h2>
            
            <div className="example-card">
              <h3>Example 1: Sarah, Age 28, Single, No Children</h3>
              <p>Sarah is a freelance graphic designer who has been self-employed for 18 months (past the start-up period).</p>
              <ul>
                <li><strong>Her MIF:</strong> £311.68 per month (standard rate for 25+)</li>
                <li><strong>Actual earnings:</strong> £200 per month</li>
                <li><strong>Universal Credit calculation:</strong> Uses £311.68 instead of £200</li>
                <li><strong>Result:</strong> Sarah's UC is reduced because the system assumes she earns more than she actually does</li>
              </ul>
            </div>
            <div className="example-card">
              <h3>Example 2: James, Age 35, Partner (32), 2 Children</h3>
              <p>James runs a small gardening business with his partner. They have two children and have been self-employed for 2 years.</p>
              <ul>
                <li><strong>His MIF:</strong> £311.68 (standard rate) + £244.11 (partner) + £315.00 (first child) + £315.00 (second child) = £1,185.79</li>
                <li><strong>Actual earnings:</strong> £800 per month</li>
                <li><strong>Universal Credit calculation:</strong> Uses £1,185.79 instead of £800</li>
                <li><strong>Result:</strong> James's UC is significantly reduced due to the large difference between actual and assumed earnings</li>
              </ul>
            </div>
            <div className="example-card">
              <h3>Example 3: Maria, Age 22, Single, Has Disability</h3>
              <p>Maria is a young artist who has been self-employed for 15 months and has a disability.</p>
              <ul>
                <li><strong>Her MIF:</strong> £246.58 (under 25) + £146.31 (disability) = £392.89</li>
                <li><strong>Actual earnings:</strong> £350 per month</li>
                <li><strong>Universal Credit calculation:</strong> Uses £392.89 instead of £350</li>
                <li><strong>Result:</strong> Maria's UC is slightly reduced, but the disability element helps offset some of the MIF impact</li>
              </ul>
            </div>
          </div>

          {/* How to Avoid MIF Section */}
          <div className="mif-section">
            <h2>How to Avoid or Minimize MIF Impact</h2>
            
            <div className="strategy-grid">
              <div className="strategy-card">
                <h3>📈 Increase Your Earnings</h3>
                <p>Work towards earning at least your MIF amount each month. This could involve:</p>
                <ul>
                  <li>Taking on more clients or projects</li>
                  <li>Raising your prices</li>
                  <li>Diversifying your services</li>
                  <li>Working more hours</li>
                </ul>
              </div>

              <div className="strategy-card">
                <h3>⏰ Extend Your Start-up Period</h3>
                <p>If you're still in your first year of self-employment:</p>
                <ul>
                  <li>Focus on building your business</li>
                  <li>Don't worry about MIF yet</li>
                  <li>Use this time to establish your client base</li>
                  <li>Plan for when MIF will apply</li>
                </ul>
              </div>

              <div className="strategy-card">
                <h3>📊 Track Your Progress</h3>
                <p>Monitor your earnings against your MIF:</p>
                <ul>
                  <li>Keep detailed records of all income</li>
                  <li>Compare monthly earnings to MIF</li>
                  <li>Identify patterns and trends</li>
                  <li>Plan for seasonal variations</li>
                </ul>
              </div>

              <div className="strategy-card">
                <h3>🔄 Consider Employment Options</h3>
                <p>If MIF is consistently problematic:</p>
                <ul>
                  <li>Look for part-time employment</li>
                  <li>Combine self-employment with employed work</li>
                  <li>Consider business partnerships</li>
                  <li>Explore different business models</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mif-section">
            <h2>Additional Resources</h2>
            <div className="resources-grid">
              <div className="resource-card">
                <h3>📚 Official Guidance</h3>
                <p>Read the official DWP guidance on Minimum Income Floor for self-employed claimants.</p>
                <a href="https://www.gov.uk/universal-credit/eligibility" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  View DWP Guidance
                </a>
              </div>
              
              <div className="resource-card">
                <h3>💼 Business Support</h3>
                <p>Get help with your business to increase earnings and avoid MIF penalties.</p>
                <a href="/self-employment-accounts" className="btn btn-outline">
                  Business Support Tools
                </a>
              </div>
              
              <div className="resource-card">
                <h3>📊 Monthly Profit Tool</h3>
                <p>Track your monthly business performance to stay above your MIF threshold.</p>
                <a href="/monthly-profit" className="btn btn-outline">
                  Use Monthly Profit Tool
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinimumIncomeFloor;
