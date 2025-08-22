import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

function BetterOffInWorkModule({ 
  formData, 
  onFormChange, 
  currentUCAmount = 0,
  isVisible = false,
  onToggleVisibility 
}) {
  const [workData, setWorkData] = useState({
    employmentType: 'employee',
    hoursPerWeek: 30,
    hourlyWage: 12.21,
    calculationPeriod: 'monthly'
  });

  const [calculation, setCalculation] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleWorkDataChange = (field, value) => {
    setWorkData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateBetterOff = () => {
    const { hoursPerWeek, hourlyWage, calculationPeriod } = workData;
    
    // Calculate gross earnings
    const weeklyGross = hoursPerWeek * hourlyWage;
    const monthlyGross = weeklyGross * 4.33; // Average weeks per month
    
    // Simplified tax calculation (20% basic rate)
    const monthlyNet = monthlyGross * 0.8;
    
    // Calculate UC reduction (55% taper rate on net earnings)
    const workAllowance = 379; // Monthly work allowance with housing
    const excessEarnings = Math.max(0, monthlyNet - workAllowance);
    const ucReduction = excessEarnings * 0.55;
    const newUCAmount = Math.max(0, currentUCAmount - ucReduction);
    
    // Calculate total income in work
    const totalIncomeInWork = monthlyNet + newUCAmount;
    const currentTotalIncome = currentUCAmount;
    const betterOffAmount = totalIncomeInWork - currentTotalIncome;
    
    const result = {
      grossEarnings: {
        current: 0,
        inWork: monthlyGross,
        impact: monthlyGross
      },
      netEarnings: {
        current: 0,
        inWork: monthlyNet,
        impact: monthlyNet
      },
      universalCredit: {
        current: currentUCAmount,
        inWork: newUCAmount,
        impact: newUCAmount - currentUCAmount
      },
      totalIncome: {
        current: currentTotalIncome,
        inWork: totalIncomeInWork,
        impact: betterOffAmount
      },
      betterOffAmount: betterOffAmount,
      calculationPeriod: calculationPeriod
    };
    
    setCalculation(result);
    setShowResults(true);
  };

  const getPeriodText = () => {
    switch (workData.calculationPeriod) {
      case 'weekly': return 'per week';
      case '4weeks': return 'per 4 weeks';
      case 'monthly': return 'per month';
      default: return 'per month';
    }
  };

  const formatAmount = (amount) => {
    return formatCurrency(amount);
  };

  const getImpactColor = (impact) => {
    return impact >= 0 ? 'positive' : 'negative';
  };

  const getImpactSign = (impact) => {
    return impact >= 0 ? '+' : '';
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="better-off-module">
      <div className="card">
        <div className="module-header">
          <h3>How much better off would you be in work?</h3>
          <button 
            type="button" 
            className="btn btn-outline btn-sm"
            onClick={onToggleVisibility}
          >
            Hide detailed information
          </button>
        </div>
        
        <div className="module-description">
          <p>Use the better off calculator by entering details of the job you are thinking about. We will take this information and calculate how much you will earn after tax and if you qualify for in-work benefits.</p>
        </div>

        {/* Data Entry Section */}
        <div className="data-entry-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employmentType">Employee or self-employed?</label>
              <select
                id="employmentType"
                className="form-control"
                value={workData.employmentType}
                onChange={(e) => handleWorkDataChange('employmentType', e.target.value)}
              >
                <option value="employee">Employee</option>
                <option value="self-employed">Self-employed</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hoursPerWeek">Hours worked:</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  id="hoursPerWeek"
                  className="form-control"
                  value={workData.hoursPerWeek}
                  onChange={(e) => handleWorkDataChange('hoursPerWeek', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="168"
                />
                <span className="suffix">per week</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hourlyWage">Wage rate:</label>
              <div className="input-with-prefix-suffix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="hourlyWage"
                  className="form-control"
                  value={workData.hourlyWage}
                  onChange={(e) => handleWorkDataChange('hourlyWage', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
                <span className="suffix">per hour</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Calculation period:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="calculationPeriod"
                    value="weekly"
                    checked={workData.calculationPeriod === 'weekly'}
                    onChange={(e) => handleWorkDataChange('calculationPeriod', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Weekly
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="calculationPeriod"
                    value="4weeks"
                    checked={workData.calculationPeriod === '4weeks'}
                    onChange={(e) => handleWorkDataChange('calculationPeriod', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  4 weeks
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="calculationPeriod"
                    value="monthly"
                    checked={workData.calculationPeriod === 'monthly'}
                    onChange={(e) => handleWorkDataChange('calculationPeriod', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Monthly
                </label>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={calculateBetterOff}
            >
              Calculate
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
            >
              Find a job
            </button>
          </div>
        </div>

        {/* Results Section */}
        {showResults && calculation && (
          <div className="results-section">
            <div className="summary-statement">
              <div className="checkmark-icon">✓</div>
              <div className="summary-text">
                <p>You could be <strong className="highlight">{formatAmount(calculation.betterOffAmount)}</strong> {getPeriodText()} better off in work</p>
                <p className="note">(estimate does not include travel or child care costs)</p>
              </div>
            </div>

            <div className="breakdown-table">
              <table>
                <thead>
                  <tr>
                    <th>YOUR DETAILS</th>
                    <th>CURRENT INCOME</th>
                    <th>INCOME IN WORK</th>
                    <th>IMPACT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Gross Earnings</td>
                    <td>{formatAmount(calculation.grossEarnings.current)}</td>
                    <td>{formatAmount(calculation.grossEarnings.inWork)}</td>
                    <td className={`impact ${getImpactColor(calculation.grossEarnings.impact)}`}>
                      {getImpactSign(calculation.grossEarnings.impact)}{formatAmount(calculation.grossEarnings.impact)}
                    </td>
                  </tr>
                  <tr>
                    <td>Net Earnings</td>
                    <td>{formatAmount(calculation.netEarnings.current)}</td>
                    <td>{formatAmount(calculation.netEarnings.inWork)}</td>
                    <td className={`impact ${getImpactColor(calculation.netEarnings.impact)}`}>
                      {getImpactSign(calculation.netEarnings.impact)}{formatAmount(calculation.netEarnings.impact)}
                    </td>
                  </tr>
                  <tr>
                    <td>Universal Credit</td>
                    <td>{formatAmount(calculation.universalCredit.current)}</td>
                    <td>{formatAmount(calculation.universalCredit.inWork)}</td>
                    <td className={`impact ${getImpactColor(calculation.universalCredit.impact)}`}>
                      {getImpactSign(calculation.universalCredit.impact)}{formatAmount(calculation.universalCredit.impact)}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Benefits</td>
                    <td>{formatAmount(calculation.universalCredit.current)}</td>
                    <td>{formatAmount(calculation.universalCredit.inWork)}</td>
                    <td className={`impact ${getImpactColor(calculation.universalCredit.impact)}`}>
                      {getImpactSign(calculation.universalCredit.impact)}{formatAmount(calculation.universalCredit.impact)}
                    </td>
                  </tr>
                  <tr className="total-row">
                    <td>Total Income</td>
                    <td>{formatAmount(calculation.totalIncome.current)}</td>
                    <td>{formatAmount(calculation.totalIncome.inWork)}</td>
                    <td className={`impact ${getImpactColor(calculation.totalIncome.impact)}`}>
                      {getImpactSign(calculation.totalIncome.impact)}{formatAmount(calculation.totalIncome.impact)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="action-links">
              <button type="button" className="btn btn-outline btn-sm">
                Calculate costs of work
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BetterOffInWorkModule;
