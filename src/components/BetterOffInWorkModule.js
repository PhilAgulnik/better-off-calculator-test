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

  const [costsData, setCostsData] = useState({
    // Additional spending because of work
    childcare: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    schoolMeals: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    prescriptions: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    workClothing: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    workTravel: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    otherWorkCosts: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    
    // Savings because of work
    energySavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    otherSavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 }
  });

  const [calculation, setCalculation] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showCostsSection, setShowCostsSection] = useState(false);

  const handleWorkDataChange = (field, value) => {
    setWorkData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCostsDataChange = (category, period, value) => {
    setCostsData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [period]: parseFloat(value) || 0
      }
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
    
    // Calculate work-related costs (convert to monthly)
    const monthlyWorkCosts = calculateMonthlyCosts();
    const monthlyWorkSavings = calculateMonthlySavings();
    const netWorkCosts = monthlyWorkCosts - monthlyWorkSavings;
    
    const betterOffAmount = totalIncomeInWork - currentTotalIncome - netWorkCosts;
    
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
        impact: totalIncomeInWork - currentTotalIncome
      },
      workCosts: {
        total: monthlyWorkCosts,
        savings: monthlyWorkSavings,
        net: netWorkCosts
      },
      betterOffAmount: betterOffAmount,
      calculationPeriod: calculationPeriod
    };
    
    setCalculation(result);
    setShowResults(true);
  };

  const calculateMonthlyCosts = () => {
    let total = 0;
    Object.values(costsData).forEach(category => {
      if (category.perMonth > 0) {
        total += category.perMonth;
      } else if (category.perWeek > 0) {
        total += category.perWeek * 4.33;
      } else if (category.per4Weeks > 0) {
        total += category.per4Weeks * 12 / 52;
      } else if (category.perYear > 0) {
        total += category.perYear / 12;
      }
    });
    return total;
  };

  const calculateMonthlySavings = () => {
    let total = 0;
    // Only include savings categories
    const savingsCategories = ['energySavings', 'otherSavings'];
    savingsCategories.forEach(category => {
      const cat = costsData[category];
      if (cat.perMonth > 0) {
        total += cat.perMonth;
      } else if (cat.perWeek > 0) {
        total += cat.perWeek * 4.33;
      } else if (cat.per4Weeks > 0) {
        total += cat.per4Weeks * 12 / 52;
      } else if (cat.perYear > 0) {
        total += cat.perYear / 12;
      }
    });
    return total;
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
          </div>
        </div>

        {/* Results Section */}
        {showResults && calculation && (
          <div className="results-section">
            <div className="summary-statement">
              <div className="checkmark-icon">✓</div>
              <div className="summary-text">
                <p>You could be <strong className="highlight">{formatAmount(calculation.betterOffAmount)}</strong> {getPeriodText()} better off in work</p>
                <p className="note">(estimate includes work-related costs and savings)</p>
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
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setShowCostsSection(!showCostsSection)}
              >
                {showCostsSection ? 'Hide' : 'Calculate'} costs of work
              </button>
            </div>

            {/* Costs of Work Section */}
            {showCostsSection && (
              <div className="costs-section">
                <h4>Costs of work</h4>
                
                <div className="costs-intro">
                  <p>Some people have extra costs when they enter work. You can update the better off amount to take these into account by entering any extra costs you expect below. For help with how to use this tool please read our <a href="#" className="help-link">Costs of work help page</a>.</p>
                </div>
                
                {/* Additional spending because of work */}
                <div className="costs-subsection">
                  <h5>Additional spending because of work</h5>
                  
                  <div className="costs-list">
                    <div className="cost-item">
                      <label>Childcare</label>
                      <div className="cost-input-group">
                        <span className="currency-symbol">£</span>
                        <input
                          type="number"
                          className="form-control cost-input"
                          value={costsData.childcare.perWeek}
                          onChange={(e) => handleCostsDataChange('childcare', 'perWeek', e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        <select 
                          className="period-selector"
                          value="perWeek"
                          onChange={(e) => handleCostsDataChange('childcare', e.target.value, costsData.childcare.perWeek)}
                        >
                          <option value="perWeek">per week</option>
                          <option value="perMonth">per month</option>
                          <option value="perYear">per year</option>
                        </select>
                      </div>
                    </div>

                    <div className="cost-item">
                      <label>School meals</label>
                      <div className="cost-input-group">
                        <span className="currency-symbol">£</span>
                        <input
                          type="number"
                          className="form-control cost-input"
                          value={costsData.schoolMeals.perWeek}
                          onChange={(e) => handleCostsDataChange('schoolMeals', 'perWeek', e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        <select 
                          className="period-selector"
                          value="perWeek"
                          onChange={(e) => handleCostsDataChange('schoolMeals', e.target.value, costsData.schoolMeals.perWeek)}
                        >
                          <option value="perWeek">per week</option>
                          <option value="perMonth">per month</option>
                          <option value="perYear">per year</option>
                        </select>
                      </div>
                    </div>

                    <div className="cost-item">
                      <label>Prescriptions</label>
                      <div className="cost-input-group">
                        <span className="currency-symbol">£</span>
                        <input
                          type="number"
                          className="form-control cost-input"
                          value={costsData.prescriptions.perWeek}
                          onChange={(e) => handleCostsDataChange('prescriptions', 'perWeek', e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        <select 
                          className="period-selector"
                          value="perWeek"
                          onChange={(e) => handleCostsDataChange('prescriptions', e.target.value, costsData.prescriptions.perWeek)}
                        >
                          <option value="perWeek">per week</option>
                          <option value="perMonth">per month</option>
                          <option value="perYear">per year</option>
                        </select>
                      </div>
                    </div>

                    <div className="cost-item">
                      <label>Work clothing</label>
                      <div className="cost-input-group">
                        <span className="currency-symbol">£</span>
                        <input
                          type="number"
                          className="form-control cost-input"
                          value={costsData.workClothing.perWeek}
                          onChange={(e) => handleCostsDataChange('workClothing', 'perWeek', e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        <select 
                          className="period-selector"
                          value="perWeek"
                          onChange={(e) => handleCostsDataChange('workClothing', e.target.value, costsData.workClothing.perWeek)}
                        >
                          <option value="perWeek">per week</option>
                          <option value="perMonth">per month</option>
                          <option value="perYear">per year</option>
                        </select>
                      </div>
                    </div>

                    <div className="cost-item">
                      <label>Work related travel</label>
                      <div className="cost-input-group">
                        <span className="currency-symbol">£</span>
                        <input
                          type="number"
                          className="form-control cost-input"
                          value={costsData.workTravel.perWeek}
                          onChange={(e) => handleCostsDataChange('workTravel', 'perWeek', e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        <select 
                          className="period-selector"
                          value="perWeek"
                          onChange={(e) => handleCostsDataChange('workTravel', e.target.value, costsData.workTravel.perWeek)}
                        >
                          <option value="perWeek">per week</option>
                          <option value="perMonth">per month</option>
                          <option value="perYear">per year</option>
                        </select>
                      </div>
                    </div>

                    <div className="cost-item">
                      <label>Other work-related costs</label>
                      <div className="cost-input-group">
                        <span className="currency-symbol">£</span>
                        <input
                          type="number"
                          className="form-control cost-input"
                          value={costsData.otherWorkCosts.perWeek}
                          onChange={(e) => handleCostsDataChange('otherWorkCosts', 'perWeek', e.target.value)}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        <select 
                          className="period-selector"
                          value="perWeek"
                          onChange={(e) => handleCostsDataChange('otherWorkCosts', e.target.value, costsData.otherWorkCosts.perWeek)}
                        >
                          <option value="perWeek">per week</option>
                          <option value="perMonth">per month</option>
                          <option value="perYear">per year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total costs of work */}
                <div className="total-costs">
                  <h5>Total costs of work</h5>
                  <div className="total-amount">
                    £{formatAmount(calculateMonthlyCosts())} / month
                  </div>
                </div>

                <div className="button-group">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={calculateBetterOff}
                  >
                    <span className="calendar-icon">📅</span>
                    Take costs from better off amount
                  </button>
                </div>

                {/* Updated Results with Costs */}
                {calculation && (
                  <div className="updated-results">
                    <h5>Updated Better Off Calculation (including costs)</h5>
                    <div className="costs-summary">
                      <div className="costs-row">
                        <span>Total work-related costs:</span>
                        <span className="costs-amount">£{formatAmount(calculation.workCosts.total)}</span>
                      </div>
                      <div className="costs-row">
                        <span>Total work-related savings:</span>
                        <span className="costs-amount">£{formatAmount(calculation.workCosts.savings)}</span>
                      </div>
                      <div className="costs-row total">
                        <span>Net work-related costs:</span>
                        <span className="costs-amount">£{formatAmount(calculation.workCosts.net)}</span>
                      </div>
                    </div>
                    
                    <div className="final-better-off">
                      <h6>Final Better Off Amount:</h6>
                      <div className="final-amount">
                        £{formatAmount(calculation.betterOffAmount)} {getPeriodText()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BetterOffInWorkModule;
