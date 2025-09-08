import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { benefitCalculator } from '../utils/benefitCalculator.js';
function ComprehensiveResultsSection({ formData, onPrint, onExport }) {
  const [calculationResults, setCalculationResults] = useState(null);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  useEffect(() => {
    if (formData) {
      const results = benefitCalculator.getCalculationBreakdown(formData);
      setCalculationResults(results);
    }
  }, [formData]);

  if (!calculationResults) {
    return (
      <section className="results-section">
        <div className="card">
          <p>Please fill in the form to see your benefit calculations.</p>
        </div>
      </section>
    );
  }

  const { benefits, totals, summary, taxYear } = calculationResults;

  return (
    <section className="results-section">
      <div className="card">
        <h2>Your Benefit Calculations</h2>
        <p className="tax-year">Tax Year: {taxYear.replace('_', '/')}</p>
        
        <div className="benefits-overview">
          {benefits.map((benefit, index) => {
            // Don't show Child Benefit if there are no children
            if (benefit.name === 'Child Benefit' && !summary.hasChildren) {
              return null;
            }

            return (
              <div key={index} className={`benefit-card ${benefit.type}`}>
                <div className="benefit-header">
                  <h3>{benefit.name}</h3>
                  <div className="benefit-amount">
                    {formatCurrency(benefit.monthly)}
                    <span className="period">per month</span>
                  </div>
                </div>
                
                <div className="benefit-details">
                  <div className="amount-breakdown">
                    <div className="amount-item">
                      <span className="label">Weekly:</span>
                      <span className="value">{formatCurrency(benefit.weekly)}</span>
                    </div>
                    <div className="amount-item">
                      <span className="label">Monthly:</span>
                      <span className="value">{formatCurrency(benefit.monthly)}</span>
                    </div>
                    <div className="amount-item">
                      <span className="label">Yearly:</span>
                      <span className="value">{formatCurrency(benefit.yearly)}</span>
                    </div>
                  </div>

                  {benefit.breakdown && benefit.breakdown.length > 0 && (
                    <div className="breakdown-section">
                      <h4>Breakdown:</h4>
                      <div className="breakdown-list">
                        {benefit.breakdown.map((item, idx) => (
                          <div key={idx} className="breakdown-item">
                            <span className="label">{item.label || item.description}</span>
                            <span className="value">{formatCurrency(item.amount || item.rate)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* High Income Charge Message for Child Benefit */}
                  {benefit.name === 'Child Benefit' && benefit.highIncomeChargeMessage && (
                    <div className="high-income-charge-message">
                      <div className={`charge-alert ${benefit.highIncomeChargeMessage.type}`}>
                        <div className="alert-icon">
                          {benefit.highIncomeChargeMessage.type === 'partial_charge' ? '⚠️' : '🔴'}
                        </div>
                        <div className="alert-content">
                          <h4>High Income Child Benefit Charge</h4>
                          <p>
                            {benefit.highIncomeChargeMessage.message.split('{Child Benefit charge}').map((part, index, array) => (
                              <React.Fragment key={index}>
                                {part}
                                {index < array.length - 1 && (
                                  <Link to="/help/child-benefit-charge" className="help-link">
                                    Child Benefit charge
                                  </Link>
                                )}
                              </React.Fragment>
                            ))}
                          </p>
                          <div className="earnings-range">
                            <strong>Your earnings range:</strong> {benefit.highIncomeChargeMessage.earningsRange}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Benefits Summary */}
        <div className="total-benefits-card">
          <div className="total-header">
            <h3>Total Benefits</h3>
            <div className="total-amount">
              {formatCurrency(totals.monthly)}
              <span className="period">per month</span>
            </div>
          </div>
          
          <div className="total-breakdown">
            <div className="total-item">
              <span className="label">Weekly Total:</span>
              <span className="value">{formatCurrency(totals.weekly)}</span>
            </div>
            <div className="total-item">
              <span className="label">Monthly Total:</span>
              <span className="value">{formatCurrency(totals.monthly)}</span>
            </div>
            <div className="total-item">
              <span className="label">Yearly Total:</span>
              <span className="value">{formatCurrency(totals.yearly)}</span>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="important-info">
          <h4>Important Information</h4>
          <ul>
            <li><strong>Universal Credit</strong> is means-tested and may be reduced based on your income and savings.</li>
            {summary.hasChildren && (
              <li><strong>Child Benefit</strong> is not means-tested but may be subject to the High Income Child Benefit Charge if you or your partner earn over £60,000 per year. See the specific message above for details about your situation.</li>
            )}
            <li>These calculations are for guidance only and should not be considered as official advice.</li>
            <li>Child Benefit rates are based on official government rates from <a href="https://www.gov.uk/government/publications/rates-and-allowances-tax-credits-child-benefit-and-guardians-allowance/tax-credits-child-benefit-and-guardians-allowance" target="_blank" rel="noopener noreferrer">GOV.UK</a></li>
            <li>For official benefit information, visit <a href="https://www.gov.uk/universal-credit" target="_blank" rel="noopener noreferrer">gov.uk/universal-credit</a></li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          >
            {showDetailedBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
          </button>
          <button type="button" className="btn btn-outline" onClick={onPrint}>
            Print Results
          </button>
          <button type="button" className="btn btn-outline" onClick={onExport}>
            Export PDF
          </button>
        </div>

        {/* Detailed Breakdown (Collapsible) */}
        {showDetailedBreakdown && (
          <div className="detailed-breakdown">
            <h4>Detailed Calculation Breakdown</h4>
            {benefits.map((benefit, index) => (
              <div key={index} className="detailed-benefit">
                <h5>{benefit.name}</h5>
                {benefit.breakdown && benefit.breakdown.length > 0 ? (
                  <div className="breakdown-list">
                    {benefit.breakdown.map((item, idx) => (
                      <div key={idx} className="breakdown-item">
                        <span className="label">{item.label || item.description}</span>
                        <span className="value">{formatCurrency(item.amount || item.rate)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No detailed breakdown available for this benefit.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ComprehensiveResultsSection;
