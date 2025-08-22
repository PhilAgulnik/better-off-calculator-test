import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import BetterOffInWorkModule from './BetterOffInWorkModule';

function ResultsSection({ results, onPrint, onExport }) {
  const { calculation, taxYear } = results;
  const [showBetterOffModule, setShowBetterOffModule] = useState(false);

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
