import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';
import BetterOffInWorkModule from './BetterOffInWorkModule';
import { useTextManager } from '../hooks/useTextManager';
import { saveBenefitCalculatorData } from '../utils/benefitDataService';
import { childBenefitCalculator } from '../utils/childBenefitCalculator';

function ResultsSection({ results, formData, onPrint, onExport }) {
  const { getTextValue } = useTextManager();
  const { calculation, taxYear } = results;
  const [showBetterOffModule, setShowBetterOffModule] = useState(false);
  const [mifGracePeriod, setMifGracePeriod] = useState('');
  const [mifGainful, setMifGainful] = useState('');
  const [claimantHours, setClaimantHours] = useState(35);
  const [showLhaPanel, setShowLhaPanel] = useState(false);
  const [showChildBenefitWeekly, setShowChildBenefitWeekly] = useState(false);

  // Calculate Child Benefit
  const childBenefitResults = childBenefitCalculator.calculateChildBenefit(formData, taxYear);

  // Save benefit calculator data for budgeting tool
  useEffect(() => {
    if (results && results.calculation) {
      const benefitResults = {
        ucAmount: results.calculation.finalAmount,
        otherBenefits: childBenefitResults.monthlyAmount,
        totalIncome: results.calculation.totalElements,
        totalDeductions: results.calculation.earningsReduction,
        netIncome: results.calculation.finalAmount + childBenefitResults.monthlyAmount
      };
      
      saveBenefitCalculatorData(formData, benefitResults);
    }
  }, [results, formData, childBenefitResults.monthlyAmount]);

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
      return getTextValue('MIF.Status.SelectSituation', 'Select your situation above to see how MIF affects you');
    }
    
    if (mifGracePeriod === 'yes') {
      return getTextValue('MIF.Status.GracePeriod', 'MIF does not apply - You are in your 12-month grace period. Your actual earnings will be used in the Universal Credit calculation.');
    }
    
    if (mifGainful === 'no') {
      return getTextValue('MIF.Status.NotGainful', 'MIF does not apply - Your self-employment is not considered gainful. Your actual earnings will be used in the Universal Credit calculation.');
    }
    
    if (mifGracePeriod === 'no' && mifGainful === 'yes') {
      return getTextValue('MIF.Status.Applies', 'MIF applies - Your Universal Credit will be calculated using assumed minimum earnings (35 hours per week at National Living Wage), even if you earn less.');
    }
    
    return getTextValue('MIF.Status.SelectSituation', 'Select your situation above to see how MIF affects you');
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
            {calculation.lcwraElement > 0 && (
              <div className="breakdown-item">
                <span className="label">LCWRA Element</span>
                <span className="value">{formatCurrency(calculation.lcwraElement)}</span>
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
            
            {/* Show tariff income details if applicable */}
            {calculation.capitalDeductionDetails && calculation.capitalDeductionDetails.tariffIncome > 0 && (
              <div className="breakdown-item info">
                <span className="label">Tariff Income from Savings</span>
                <span className="value">-{formatCurrency(calculation.capitalDeductionDetails.tariffIncome)}</span>
                <div className="explanation">
                  <small>{calculation.capitalDeductionDetails.explanation}</small>
                </div>
              </div>
            )}
            <div className="breakdown-item final">
              <span className="label">Final Universal Credit</span>
              <span className="value">{formatCurrency(calculation.finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Child Benefit Section */}
        {formData && formData.children > 0 && (
          <div className="child-benefit-section">
            <div className="child-benefit-header">
              <h3>Child Benefit</h3>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setShowChildBenefitWeekly(!showChildBenefitWeekly)}
              >
                {showChildBenefitWeekly ? 'Hide' : 'See'} weekly amount
              </button>
            </div>
            <div className="breakdown-list">
              <div className="breakdown-item">
                <span className="label">Child Benefit (Monthly)</span>
                <span className="value">{formatCurrency(childBenefitResults.monthlyAmount)}</span>
              </div>
              {showChildBenefitWeekly && (
                <>
                  <div className="breakdown-item">
                    <span className="label">Child Benefit (Weekly)</span>
                    <span className="value">{formatCurrency(childBenefitResults.weeklyAmount)}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="label">Child Benefit (Yearly)</span>
                    <span className="value">{formatCurrency(childBenefitResults.yearlyAmount)}</span>
                  </div>
                  {childBenefitResults.breakdown && childBenefitResults.breakdown.length > 0 && (
                    <>
                      {childBenefitResults.breakdown.map((child, index) => (
                        <div key={index} className="breakdown-item child-breakdown">
                          <span className="label">{child.description}</span>
                          <span className="value">{formatCurrency(child.rate)} per week</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="child-benefit-info">
              <p><strong>Note:</strong> Child Benefit is not means-tested but may be subject to the High Income Child Benefit Charge if you or your partner earn over £60,000 per year.</p>
              <p>Rates based on official government rates from <a href="https://www.gov.uk/government/publications/rates-and-allowances-tax-credits-child-benefit-and-guardians-allowance/tax-credits-child-benefit-and-guardians-allowance" target="_blank" rel="noopener noreferrer">GOV.UK</a></p>
            </div>
          </div>
        )}

        {/* Local Housing Allowance Panel for Private Tenants */}
        {formData && formData.tenantType === 'private' && calculation.lhaDetails && (
          <div className="lha-panel">
            <div className="lha-header" onClick={() => setShowLhaPanel(!showLhaPanel)}>
              <h3>Local Housing Allowance</h3>
              <button className="lha-toggle-btn" type="button">
                {showLhaPanel ? '−' : '+'}
              </button>
            </div>
            {showLhaPanel && (
              <div className="lha-details">
                <div className="lha-row">
                  <span className="lha-label">Broad Rental Market Area:</span>
                  <span className="lha-value">{calculation.lhaDetails.brma}</span>
                </div>
                <div className={`lha-row ${calculation.lhaDetails.bedroomEntitlement === 'shared' ? 'highlighted' : ''}`}>
                  <span className="lha-label">Shared room LHA rate:</span>
                  <span className="lha-value">{formatCurrency(calculation.lhaDetails.sharedRate || 0)}</span>
                </div>
                <div className={`lha-row ${calculation.lhaDetails.bedroomEntitlement === 1 ? 'highlighted' : ''}`}>
                  <span className="lha-label">1 bedroom LHA rate:</span>
                  <span className="lha-value">{formatCurrency(calculation.lhaDetails.oneBedRate || 0)}</span>
                </div>
                <div className={`lha-row ${calculation.lhaDetails.bedroomEntitlement === 2 ? 'highlighted' : ''}`}>
                  <span className="lha-label">2 bedroom LHA rate:</span>
                  <span className="lha-value">{formatCurrency(calculation.lhaDetails.twoBedRate || 0)}</span>
                </div>
                <div className={`lha-row ${calculation.lhaDetails.bedroomEntitlement === 3 ? 'highlighted' : ''}`}>
                  <span className="lha-label">3 bedroom LHA rate:</span>
                  <span className="lha-value">{formatCurrency(calculation.lhaDetails.threeBedRate || 0)}</span>
                </div>
                <div className={`lha-row ${calculation.lhaDetails.bedroomEntitlement === 4 ? 'highlighted' : ''}`}>
                  <span className="lha-label">4 bedroom LHA rate:</span>
                  <span className="lha-value">{formatCurrency(calculation.lhaDetails.fourBedRate || 0)}</span>
                </div>
                <div className="lha-row">
                  <span className="lha-label">Your bedroom entitlement:</span>
                  <span className="lha-value">{calculation.lhaDetails.bedroomEntitlement}</span>
                </div>
                <div className="lha-row">
                  <span className="lha-label">Relevant LHA rate:</span>
                  <span className="lha-value">{formatCurrency(calculation.lhaDetails.lhaMonthly)}</span>
                </div>
                <div className="lha-row">
                  <span className="lha-label">Current rent amount:</span>
                  <span className="lha-value">{formatCurrency(calculation.lhaDetails.actualRent)} / Monthly</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Earnings Breakdown with Pension Contributions */}
        {(formData.employmentType === 'employed' || (formData.circumstances === 'couple' && formData.partnerEmploymentType === 'employed')) && (
          <div className="detailed-results">
            <h3>Earnings Breakdown</h3>
            <div className="breakdown-list">
              {/* Main person earnings */}
              {formData.employmentType === 'employed' && formData.monthlyEarnings > 0 && (
                <>
                  <div className="breakdown-item">
                    <span className="label">Your Gross Earnings</span>
                    <span className="value">{formatCurrency(formData.monthlyEarnings)}</span>
                  </div>
                  {formData.pensionType === 'amount' && formData.pensionAmount > 0 && (
                    <div className="breakdown-item">
                      <span className="label">Your Pension Contribution (Fixed)</span>
                      <span className="value">-{formatCurrency(formData.pensionAmount)}</span>
                    </div>
                  )}
                  {formData.pensionType === 'percentage' && formData.pensionPercentage > 0 && (
                    <div className="breakdown-item">
                      <span className="label">Your Pension Contribution ({formData.pensionPercentage}%)</span>
                      <span className="value">-{formatCurrency((formData.monthlyEarnings * formData.pensionPercentage) / 100)}</span>
                    </div>
                  )}
                  <div className="breakdown-item">
                    <span className="label">Your Net Earnings</span>
                    <span className="value">{formatCurrency(
                      formData.monthlyEarnings - 
                      (formData.pensionType === 'amount' ? formData.pensionAmount : 
                       formData.pensionType === 'percentage' ? (formData.monthlyEarnings * formData.pensionPercentage) / 100 : 0)
                    )}</span>
                  </div>
                </>
              )}

              {/* Partner earnings */}
              {formData.circumstances === 'couple' && formData.partnerEmploymentType === 'employed' && formData.partnerMonthlyEarnings > 0 && (
                <>
                  <div className="breakdown-item">
                    <span className="label">Partner's Gross Earnings</span>
                    <span className="value">{formatCurrency(formData.partnerMonthlyEarnings)}</span>
                  </div>
                  {formData.partnerPensionType === 'amount' && formData.partnerPensionAmount > 0 && (
                    <div className="breakdown-item">
                      <span className="label">Partner's Pension Contribution (Fixed)</span>
                      <span className="value">-{formatCurrency(formData.partnerPensionAmount)}</span>
                    </div>
                  )}
                  {formData.partnerPensionType === 'percentage' && formData.partnerPensionPercentage > 0 && (
                    <div className="breakdown-item">
                      <span className="label">Partner's Pension Contribution ({formData.partnerPensionPercentage}%)</span>
                      <span className="value">-{formatCurrency((formData.partnerMonthlyEarnings * formData.partnerPensionPercentage) / 100)}</span>
                    </div>
                  )}
                  <div className="breakdown-item">
                    <span className="label">Partner's Net Earnings</span>
                    <span className="value">{formatCurrency(
                      formData.partnerMonthlyEarnings - 
                      (formData.partnerPensionType === 'amount' ? formData.partnerPensionAmount : 
                       formData.partnerPensionType === 'percentage' ? (formData.partnerMonthlyEarnings * formData.partnerPensionPercentage) / 100 : 0)
                    )}</span>
                  </div>
                </>
              )}

              {/* Total household earnings */}
              {((formData.employmentType === 'employed' && formData.monthlyEarnings > 0) || 
                (formData.circumstances === 'couple' && formData.partnerEmploymentType === 'employed' && formData.partnerMonthlyEarnings > 0)) && (
                <div className="breakdown-item total">
                  <span className="label">Total Net Earnings (after pension)</span>
                  <span className="value">{formatCurrency(
                    (formData.employmentType === 'employed' ? 
                      formData.monthlyEarnings - 
                      (formData.pensionType === 'amount' ? formData.pensionAmount : 
                       formData.pensionType === 'percentage' ? (formData.monthlyEarnings * formData.pensionPercentage) / 100 : 0) : 0) +
                    (formData.circumstances === 'couple' && formData.partnerEmploymentType === 'employed' ? 
                      formData.partnerMonthlyEarnings - 
                      (formData.partnerPensionType === 'amount' ? formData.partnerPensionAmount : 
                       formData.partnerPensionType === 'percentage' ? (formData.partnerMonthlyEarnings * formData.partnerPensionPercentage) / 100 : 0) : 0)
                  )}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Minimum Income Floor Panel */}
        {shouldShowMIFPanel() && (
          <div className="mif-panel">
            <h3>Minimum Income Floor (MIF)</h3>
            <div className="mif-content">
              <p>{getTextValue('MIF.Description', 'The Minimum Income Floor may affect your Universal Credit calculation if you are self-employed.')}</p>
              <ul>
                <li>{getTextValue('MIF.GracePeriod.Bullet1', 'You may have a grace period when you first become self-employed')}</li>
                <li>{getTextValue('MIF.GainfulAssessment.Bullet2', 'The DWP will assess if your self-employment is gainful')}</li>
                <li>{getTextValue('MIF.AppliesAfterGrace.Bullet3', 'MIF applies after the grace period ends')}</li>
              </ul>
              
              <div className="mif-details-section">
                <h4>{getTextValue('MIF.DetailsSection.Title', 'How you might be affected by the Minimum Income Floor')}</h4>
                <p>{getTextValue('MIF.DetailsSection.Description', 'The Minimum Income Floor (MIF) is a rule that affects how your Universal Credit is calculated if you are self-employed. It assumes you earn at least the equivalent of working 35 hours per week at the National Living Wage.')}</p>
                
                <div className="mif-table-container">
                  <table className="mif-table">
                    <thead>
                      <tr>
                        <th>{getTextValue('MIF.Table.YourSituation', 'Your Situation')}</th>
                        <th>{getTextValue('MIF.Table.HowMIFAffectsYou', 'How MIF Affects You')}</th>
                        <th>{getTextValue('MIF.Table.WhatThisMeans', 'What This Means')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>{getTextValue('MIF.Table.NewSelfEmployed.Situation', 'New to self-employment')}</strong></td>
                        <td>{getTextValue('MIF.Table.NewSelfEmployed.Affect', '12-month grace period')}</td>
                        <td>{getTextValue('MIF.Table.NewSelfEmployed.Means', 'Your actual earnings are used for the first 12 months')}</td>
                      </tr>
                      <tr>
                        <td><strong>{getTextValue('MIF.Table.EstablishedSelfEmployed.Situation', 'Established self-employment')}</strong></td>
                        <td>{getTextValue('MIF.Table.EstablishedSelfEmployed.Affect', 'MIF may apply')}</td>
                        <td>{getTextValue('MIF.Table.EstablishedSelfEmployed.Means', 'DWP assumes minimum earnings even if you earn less')}</td>
                      </tr>
                      <tr>
                        <td><strong>{getTextValue('MIF.Table.GainfulSelfEmployed.Situation', 'Gainful self-employment')}</strong></td>
                        <td>{getTextValue('MIF.Table.GainfulSelfEmployed.Affect', 'MIF applies')}</td>
                        <td>{getTextValue('MIF.Table.GainfulSelfEmployed.Means', 'Your Universal Credit is calculated using assumed minimum earnings')}</td>
                      </tr>
                      <tr>
                        <td><strong>{getTextValue('MIF.Table.NotGainfulSelfEmployed.Situation', 'Not gainful self-employment')}</strong></td>
                        <td>{getTextValue('MIF.Table.NotGainfulSelfEmployed.Affect', 'MIF does not apply')}</td>
                        <td>{getTextValue('MIF.Table.NotGainfulSelfEmployed.Means', 'Your actual earnings are used in the calculation')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mif-calculator-section">
                  <h5>{getTextValue('MIF.CalculatorSection.Title', 'MIF Calculator')}</h5>
                  <p>{getTextValue('MIF.CalculatorSection.Description', 'Use this calculator to see how the Minimum Income Floor might affect your Universal Credit:')}</p>
                  
                  <div className="mif-calculator-form">
                    <div className="form-group">
                      <label>{getTextValue('MIF.GracePeriodQuestion.Label', 'Are you in your first 12 months of self-employment?')}</label>
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
                          {getTextValue('MIF.GracePeriodQuestion.Yes', 'Yes - I\'m in my grace period')}
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
                          {getTextValue('MIF.GracePeriodQuestion.No', 'No - I\'ve been self-employed for over 12 months')}
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>{getTextValue('MIF.GainfulQuestion.Label', 'Is your self-employment gainful?')}</label>
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
                          {getTextValue('MIF.GainfulQuestion.Yes', 'Yes - I work regularly and expect to make a profit')}
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
                          {getTextValue('MIF.GainfulQuestion.No', 'No - I don\'t work regularly or expect to make a profit')}
                        </label>
                      </div>
                    </div>
                    
                    <div className="mif-result">
                      <div className="result-box">
                        <h6>{getTextValue('MIF.ResultBox.Title', 'MIF Status')}</h6>
                        <div className="mif-status">{getMifStatus()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mif-info-box">
                  <h5>{getTextValue('MIF.InfoBox.Title', 'Important Information')}</h5>
                  <ul>
                    <li><strong>{getTextValue('MIF.InfoBox.GracePeriod', 'Grace Period: You have 12 months from when you first become self-employed before MIF can apply')}</strong></li>
                    <li><strong>{getTextValue('MIF.InfoBox.GainfulSelfEmployment', 'Gainful Self-employment: The DWP will assess whether your self-employment is regular and expected to make a profit')}</strong></li>
                    <li><strong>{getTextValue('MIF.InfoBox.MIFRates', 'MIF Rates: The assumed minimum earnings are based on working 35 hours per week at the National Living Wage')}</strong></li>
                    <li><strong>{getTextValue('MIF.InfoBox.Appeals', 'Appeals: You can challenge a decision that MIF applies to your case')}</strong></li>
                  </ul>
                </div>
              </div>
              
              {/* MIF Calculation Panel - Only show if MIF applies */}
              {mifGracePeriod === 'no' && mifGainful === 'yes' && (
                <div className="mif-calculation-panel">
                  <h4>{getTextValue('MIF.CalculationPanel.Title', 'Your Minimum Income Floor Calculation')}</h4>
                  <p>{getTextValue('MIF.CalculationPanel.Description', 'Based on your claimant commitment of {claimantHours} hours per week, we estimate your Minimum Income Floor is £{mifWeekly} per week.').replace('{claimantHours}', claimantHours).replace('{mifWeekly}', calculateMifAmounts().mifWeekly)}</p>
                  
                  <div className="mif-hours-input">
                    <label>{getTextValue('MIF.HoursInput.Label', 'How many hours a week must you work according to your claimant commitment?')}</label>
                    <div className="hours-input-group">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={claimantHours}
                        onChange={(e) => setClaimantHours(parseInt(e.target.value) || 35)}
                        className="hours-input"
                      />
                      <span className="hours-label">{getTextValue('MIF.HoursInput.Label2', 'hours per week')}</span>
                    </div>
                  </div>
                  
                  <div className="mif-comparison-table">
                    <h5>{getTextValue('MIF.ComparisonTable.Title', 'How MIF affects your Universal Credit')}</h5>
                    <div className="table-container">
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>{getTextValue('MIF.ComparisonTable.YourBenefits', 'Your Benefits')}</th>
                            <th>{getTextValue('MIF.ComparisonTable.WithoutMIF', 'Without MIF')}</th>
                            <th>{getTextValue('MIF.ComparisonTable.WithMIF', 'With MIF')}</th>
                            <th>{getTextValue('MIF.ComparisonTable.Impact', 'Impact')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>{getTextValue('MIF.ComparisonTable.GrossEarnings', 'Gross Earnings')}</strong></td>
                            <td>£{calculateUCComparison().withoutMif.grossEarnings.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.grossEarnings.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.grossEarnings >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.grossEarnings >= 0 ? '+' : ''}£{calculateUCComparison().impact.grossEarnings.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>{getTextValue('MIF.ComparisonTable.NetEarnings', 'Net Earnings')}</strong></td>
                            <td>£{calculateUCComparison().withoutMif.netEarnings.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.netEarnings.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.netEarnings >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.netEarnings >= 0 ? '+' : ''}£{calculateUCComparison().impact.netEarnings.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>{getTextValue('MIF.ComparisonTable.UniversalCredit', 'Universal Credit')}</strong></td>
                            <td>£{calculateUCComparison().withoutMif.universalCredit.toFixed(2)}</td>
                            <td>£{calculateUCComparison().withMif.universalCredit.toFixed(2)}</td>
                            <td className={calculateUCComparison().impact.universalCredit >= 0 ? 'positive' : 'negative'}>
                              {calculateUCComparison().impact.universalCredit >= 0 ? '+' : ''}£{calculateUCComparison().impact.universalCredit.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>{getTextValue('MIF.ComparisonTable.TotalBenefits', 'Total Benefits')}</strong></td>
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
