import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import BetterOffInWorkModule from './BetterOffInWorkModule';

function ResultsSection({ results, formData, onPrint, onExport }) {
  const { calculation, taxYear } = results;
  const [showBetterOffModule, setShowBetterOffModule] = useState(false);

  // Check if MIF panel should be shown (one person self-employed but not both)
  const shouldShowMIFPanel = () => {
    if (!formData) return false;
    
    if (formData.circumstances === 'single') {
      return formData.employmentType === 'self-employed';
    } else if (formData.circumstances === 'couple') {
      const mainSelfEmployed = formData.employmentType === 'self-employed';
      const partnerSelfEmployed = formData.partnerEmploymentType === 'self-employed';
      return (mainSelfEmployed && !partnerSelfEmployed) || (!mainSelfEmployed && partnerSelfEmployed);
    }
    return false;
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
            <div className="card">
              <h3>Minimum Income Floor Information</h3>
              <div className="mif-content">
                <div className="mif-placeholder">
                  <p><strong>Add picture of MIF panel and include grace periods and gainful self-employment checks.</strong></p>
                  <p>This section will contain detailed information about the Minimum Income Floor, including:</p>
                  <ul>
                    <li>What the Minimum Income Floor is</li>
                    <li>Grace periods for new self-employed claimants</li>
                    <li>Gainful self-employment criteria</li>
                    <li>How it affects your Universal Credit calculation</li>
                  </ul>
                </div>
              </div>
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
