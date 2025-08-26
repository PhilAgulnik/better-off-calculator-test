import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import BetterOffInWorkModule from './BetterOffInWorkModule';

function ResultsSection({ results, formData, onPrint, onExport }) {
  const { calculation, taxYear } = results;
  const [showBetterOffModule, setShowBetterOffModule] = useState(false);
  const [mifGracePeriod, setMifGracePeriod] = useState('');
  const [mifGainful, setMifGainful] = useState('');
  const [claimantHours, setClaimantHours] = useState(35);

  // Check if MIF panel should be shown
  const shouldShowMIFPanel = () => {
    if (!formData) return false;
    
    // Single person who is self-employed
    if (formData.circumstances === 'single' && formData.employmentType === 'self-employed') {
      return true;
    }
    
    // Couple where one person is self-employed but not both
    if (formData.circumstances === 'couple') {
      const mainSelfEmployed = formData.employmentType === 'self-employed';
      const partnerSelfEmployed = formData.partnerEmploymentType === 'self-employed';
      return (mainSelfEmployed && !partnerSelfEmployed) || (!mainSelfEmployed && partnerSelfEmployed);
    }
    
    return false;
  };

  // Calculate MIF status based on user selections
  const getMifStatus = () => {
    if (!mifGracePeriod || !mifGainful) {
      return 'Select your situation above to see how MIF affects you';
    }
    
    if (mifGracePeriod === 'yes') {
      return 'MIF does not apply - You are in your 12-month grace period. Your actual earnings will be used in the Universal Credit calculation.';
    }
    
    if (mifGainful === 'no') {
      return 'MIF does not apply - Your self-employment is not considered gainful. Your actual earnings will be used in the Universal Credit calculation.';
    }
    
    if (mifGracePeriod === 'no' && mifGainful === 'yes') {
      return 'MIF applies - Your Universal Credit will be calculated using assumed minimum earnings (35 hours per week at National Living Wage), even if you earn less.';
    }
    
    return 'Select your situation above to see how MIF affects you';
  };

  // Calculate MIF amounts
  const calculateMifAmounts = () => {
    // National Living Wage rates (2024/25)
    const nationalLivingWage = 11.44; // per hour
    
    // Calculate MIF based on claimant commitment hours
    const mifWeekly = claimantHours * nationalLivingWage;
    const mifMonthly = mifWeekly * 4.33; // Average weeks per month
    
    // Current earnings from calculation
    const currentEarnings = calculation.earningsReduction / 0.55; // Reverse the 55% taper
    const currentWeeklyEarnings = currentEarnings / 4.33;
    
    return {
      mifWeekly: Math.round(mifWeekly * 100) / 100,
      mifMonthly: Math.round(mifMonthly * 100) / 100,
      currentWeeklyEarnings: Math.round(currentWeeklyEarnings * 100) / 100,
      currentMonthlyEarnings: Math.round(currentEarnings * 100) / 100,
      earningsDifference: Math.round((mifWeekly - currentWeeklyEarnings) * 100) / 100
    };
  };

  // Calculate UC with and without MIF
  const calculateUCComparison = () => {
    const mifAmounts = calculateMifAmounts();
    
    // Without MIF (current calculation)
    const withoutMif = {
      grossEarnings: mifAmounts.currentWeeklyEarnings,
      netEarnings: mifAmounts.currentWeeklyEarnings * 0.8, // Assume 20% deductions
      universalCredit: calculation.finalAmount / 4.33, // Convert monthly to weekly
      totalBenefits: calculation.finalAmount / 4.33,
      totalIncome: (mifAmounts.currentWeeklyEarnings * 0.8) + (calculation.finalAmount / 4.33)
    };
    
    // With MIF
    const withMif = {
      grossEarnings: mifAmounts.mifWeekly,
      netEarnings: mifAmounts.mifWeekly * 0.8, // Assume 20% deductions
      universalCredit: Math.max(0, (calculation.totalElements / 4.33) - (mifAmounts.mifWeekly * 0.8 * 0.55)),
      totalBenefits: Math.max(0, (calculation.totalElements / 4.33) - (mifAmounts.mifWeekly * 0.8 * 0.55)),
      totalIncome: (mifAmounts.mifWeekly * 0.8) + Math.max(0, (calculation.totalElements / 4.33) - (mifAmounts.mifWeekly * 0.8 * 0.55))
    };
    
    // Calculate impacts
    const impact = {
      grossEarnings: withMif.grossEarnings - withoutMif.grossEarnings,
      netEarnings: withMif.netEarnings - withoutMif.netEarnings,
      universalCredit: withMif.universalCredit - withoutMif.universalCredit,
      totalBenefits: withMif.totalBenefits - withoutMif.totalBenefits,
      totalIncome: withMif.totalIncome - withoutMif.totalIncome
    };
    
    return { withoutMif, withMif, impact };
  };

  return (
    <section className="results-section">
      <div className="card">
        <h2>Your Universal Credit Calculation</h2>
        
        <div className="results-container">
          <div className="result-summary">
            <h3>Your Universal Credit Entitlement</h3>
            <div className="final-amount">{formatCurrency(calculation.finalAmount)}</div>
            <p className="result-note">per month</p>
            <p className="tax-year">Tax Year: {taxYear.replace('_', '/')}</p>
          </div>
        </div>

        <div className="detailed-results">
          <h3>Breakdown</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <span className="label">Standard Allowance</span>
              <span className="value">{formatCurrency(calculation.standardAllowance)}</span>
            </div>
            <div className="breakdown-item">
              <span className="label">Housing Element</span>
              <span className="value">{formatCurrency(calculation.housingElement)}</span>
            </div>
            <div className="breakdown-item">
              <span className="label">Child Element</span>
              <span className="value">{formatCurrency(calculation.childElement)}</span>
            </div>
            <div className="breakdown-item">
              <span className="label">Childcare Element</span>
              <span className="value">{formatCurrency(calculation.childcareElement)}</span>
            </div>
            {calculation.carerElement > 0 && (
              <div className="breakdown-item">
                <span className="label">Carer Element</span>
                <span className="value">{formatCurrency(calculation.carerElement)}</span>
              </div>
            )}
            <div className="breakdown-item total">
              <span className="label">Total Elements</span>
              <span className="value">{formatCurrency(calculation.totalElements)}</span>
            </div>
            <div className="breakdown-item deduction">
              <span className="label">Earnings Reduction</span>
              <span className="value">-{formatCurrency(calculation.earningsReduction)}</span>
            </div>
            <div className="breakdown-item deduction">
              <span className="label">Other Deductions</span>
              <span className="value">-{formatCurrency(calculation.capitalDeduction + calculation.benefitDeduction)}</span>
            </div>
            <div className="breakdown-item final">
              <span className="label">Final Universal Credit</span>
              <span className="value">{formatCurrency(calculation.finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Minimum Income Floor Panel */}
        {shouldShowMIFPanel() && (
          <div className="mif-panel">
            <h3>Minimum Income Floor (MIF)</h3>
            <div className="mif-content">
              <p><strong>Add picture of MIF panel and include grace periods and gainful self-employment checks.</strong></p>
              <p>The Minimum Income Floor may affect your Universal Credit calculation if you are self-employed.</p>
              <ul>
                <li>You may have a grace period when you first become self-employed</li>
                <li>The DWP will assess if your self-employment is gainful</li>
                <li>MIF applies after the grace period ends</li>
              </ul>
              
              <div className="mif-details-section">
                <h4>How you might be affected by the Minimum Income Floor</h4>
                <p>The Minimum Income Floor (MIF) is a rule that affects how your Universal Credit is calculated if you are self-employed. It assumes you earn at least the equivalent of working 35 hours per week at the National Living Wage.</p>
                
                <div className="mif-table-container">
                  <table className="mif-table">
                    <thead>
                      <tr>
                        <th>Your Situation</th>
                        <th>How MIF Affects You</th>
                        <th>What This Means</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>New to self-employment</strong></td>
                        <td>12-month grace period</td>
                        <td>Your actual earnings are used for the first 12 months</td>
                      </tr>
                      <tr>
                        <td><strong>Established self-employment</strong></td>
                        <td>MIF may apply</td>
                        <td>DWP assumes minimum earnings even if you earn less</td>
                      </tr>
                      <tr>
                        <td><strong>Gainful self-employment</strong></td>
                        <td>MIF applies</td>
                        <td>Your Universal Credit is calculated using assumed minimum earnings</td>
                      </tr>
                      <tr>
                        <td><strong>Not gainful self-employment</strong></td>
                        <td>MIF does not apply</td>
                        <td>Your actual earnings are used in the calculation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mif-calculator-section">
                  <h5>MIF Calculator</h5>
                  <p>Use this calculator to see how the Minimum Income Floor might affect your Universal Credit:</p>
                  
                  <div className="mif-calculator-form">
                    <div className="form-group">
                      <label>Are you in your first 12 months of self-employment?</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            name="mifGracePeriod" 
                            value="yes" 
                            checked={mifGracePeriod === 'yes'}
                            onChange={(e) => setMifGracePeriod(e.target.value)}
                          />
                          <span className="radio-custom"></span>
                          Yes - I'm in my grace period
                        </label>
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            name="mifGracePeriod" 
                            value="no" 
                            checked={mifGracePeriod === 'no'}
                            onChange={(e) => setMifGracePeriod(e.target.value)}
                          />
                          <span className="radio-custom"></span>
                          No - I've been self-employed for over 12 months
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Is your self-employment gainful?</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            name="mifGainful" 
                            value="yes" 
                            checked={mifGainful === 'yes'}
                            onChange={(e) => setMifGainful(e.target.value)}
                          />
                          <span className="radio-custom"></span>
                          Yes - I work regularly and expect to make a profit
                        </label>
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            name="mifGainful" 
                            value="no" 
                            checked={mifGainful === 'no'}
                            onChange={(e) => setMifGainful(e.target.value)}
                          />
                          <span className="radio-custom"></span>
                          No - I don't work regularly or expect to make a profit
                        </label>
                      </div>
                    </div>
                    
                    <div className="mif-result">
                      <div className="result-box">
                        <h6>MIF Status</h6>
                        <div className="mif-status">{getMifStatus()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mif-info-box">
                  <h5>Important Information</h5>
                  <ul>
                    <li><strong>Grace Period:</strong> You have 12 months from when you first become self-employed before MIF can apply</li>
                    <li><strong>Gainful Self-employment:</strong> The DWP will assess whether your self-employment is regular and expected to make a profit</li>
                    <li><strong>MIF Rates:</strong> The assumed minimum earnings are based on working 35 hours per week at the National Living Wage</li>
                    <li><strong>Appeals:</strong> You can challenge a decision that MIF applies to your case</li>
                  </ul>
                </div>
              </div>
              
              {/* MIF Calculation Panel - Only show if MIF applies */}
              {mifGracePeriod === 'no' && mifGainful === 'yes' && (
                <div className="mif-calculation-panel">
                  <h4>Your Minimum Income Floor Calculation</h4>
                  <p>Based on your claimant commitment of <strong>{claimantHours} hours per week</strong>, we estimate your Minimum Income Floor is <strong>£{calculateMifAmounts().mifWeekly} per week</strong>.</p>
                  
                  <div className="mif-hours-input">
                    <label>How many hours a week must you work according to your claimant commitment?</label>
                    <div className="hours-input-group">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={claimantHours}
                        onChange={(e) => setClaimantHours(parseInt(e.target.value) || 35)}
                        className="hours-input"
                      />
                      <span className="hours-label">hours per week</span>
                    </div>
                  </div>
                  
                  <div className="mif-comparison-table">
                    <h5>How MIF affects your Universal Credit</h5>
                    <div className="table-container">
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>Your Benefits</th>
                            <th>Without MIF</th>
                            <th>With MIF</th>
                            <th>Impact</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Gross Earnings</strong></td>
                            <td>£{calculateUCComparison().withoutMif.grossEarnings.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.grossEarnings.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.grossEarnings >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.grossEarnings >= 0 ? '+' : ''}£{calculateUCComparison().impact.grossEarnings.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Net Earnings</strong></td>
                            <td>£{calculateUCComparison().withoutMif.netEarnings.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.netEarnings.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.netEarnings >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.netEarnings >= 0 ? '+' : ''}£{calculateUCComparison().impact.netEarnings.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Universal Credit</strong></td>
                            <td>£{calculateUCComparison().withoutMif.universalCredit.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.universalCredit.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.universalCredit >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.universalCredit >= 0 ? '+' : ''}£{calculateUCComparison().impact.universalCredit.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Total Benefits</strong></td>
                            <td>£{calculateUCComparison().withoutMif.totalBenefits.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.totalBenefits.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.totalBenefits >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.totalBenefits >= 0 ? '+' : ''}£{calculateUCComparison().impact.totalBenefits.toFixed(2)}
                            </td>
                          </tr>
                          <tr className="total-row">
                            <td><strong>Total Income</strong></td>
                            <td>£{calculateUCComparison().withoutMif.totalIncome.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.totalIncome.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.totalIncome >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.totalIncome >= 0 ? '+' : ''}£{calculateUCComparison().impact.totalIncome.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button type="button" onClick={onPrint} className="btn btn-outline">
            Print Results
          </button>
          <button type="button" onClick={onExport} className="btn btn-outline">
            Export PDF
          </button>
          <button 
            type="button" 
            onClick={() => setShowBetterOffModule(!showBetterOffModule)} 
            className="btn btn-primary"
          >
            {showBetterOffModule ? 'Hide' : 'Show'} Better Off in Work Calculator
          </button>
        </div>
      </div>

      {/* Better Off in Work Module */}
      <BetterOffInWorkModule
        currentUCAmount={calculation.finalAmount}
        isVisible={showBetterOffModule}
        onToggleVisibility={() => setShowBetterOffModule(!showBetterOffModule)}
      />
    </section>
  );
}

export default ResultsSection;
