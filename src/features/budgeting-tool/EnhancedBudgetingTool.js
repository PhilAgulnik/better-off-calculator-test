import React, { useState, useEffect } from 'react';
import {
  getStandardAmountsConfig,
  getCompulsoryFieldsConfig,
  isFieldCompulsory,
  getCompulsoryFieldNames,
  fieldDefinitions
} from './adminConfigService';
import {
  householdTypes,
  getONSData,
  getDataSourceInfo,
  applyInflationAdjustment,
  waterCompanies,
  getWaterBillByCompany
} from './onsDataService';

function EnhancedBudgetingTool() {
  const [budgetData, setBudgetData] = useState({
    income: {
      wages: '',
      universalCredit: '',
      otherBenefits: '',
      familySupport: '',
      savings: '',
      otherIncome: ''
    },
    outgoings: {
      rent: '',
      councilTax: '',
      gasAndElectricity: '',
      water: '',
      broadband: '',
      food: '',
      transport: '',
      phone: '',
      clothing: '',
      childcare: '',
      debtPayments: '',
      otherExpenses: ''
    }
  });
  const [showAdviserMode, setShowAdviserMode] = useState(false);
  const [showPreFillModal, setShowPreFillModal] = useState(false);
  const [selectedHouseholdType, setSelectedHouseholdType] = useState('middle-income-decile-5');
  const [validationErrors, setValidationErrors] = useState({});
  const [config, setConfig] = useState({
    standardAmounts: getStandardAmountsConfig(),
    compulsoryFields: getCompulsoryFieldsConfig()
  });
  const [selectedWaterCompany, setSelectedWaterCompany] = useState('');

  // Load benefit calculator data from localStorage if available
  useEffect(() => {
    const benefitData = localStorage.getItem('benefitCalculatorData');
    if (benefitData) {
      try {
        const parsedData = JSON.parse(benefitData);
        setBudgetData(prev => ({
          ...prev,
          income: {
            ...prev.income,
            universalCredit: parsedData.results?.ucAmount || 0,
            otherBenefits: parsedData.results?.otherBenefits || 0
          },
          outgoings: {
            ...prev.outgoings,
            childcare: parsedData.formData?.childcareCosts || 0
          }
        }));
      } catch (error) {
        console.error('Error loading benefit calculator data:', error);
      }
    }
  }, []);

  const totalIncome = Object.values(budgetData.income).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const totalOutgoings = Object.values(budgetData.outgoings).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const balance = totalIncome - totalOutgoings;

  const handleInputChange = (section, field, value) => {
    setBudgetData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const compulsoryFields = getCompulsoryFieldNames();
    
    compulsoryFields.forEach(field => {
      const section = Object.keys(budgetData).find(s => budgetData[s][field] !== undefined);
      if (section && (!budgetData[section][field] || budgetData[section][field] === '')) {
        errors[field] = 'This field is compulsory';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreFill = () => {
    const onsData = getONSData(selectedHouseholdType);
    if (onsData) {
      setBudgetData(prev => ({
        income: {
          ...prev.income,
          // Don't pre-fill income fields as they're more personal
        },
        outgoings: {
          ...prev.outgoings,
          ...onsData
        }
      }));
      setShowPreFillModal(false);
    }
  };

  const handleWaterCompanyChange = (companyKey) => {
    setSelectedWaterCompany(companyKey);
    if (companyKey) {
      const waterBill = getWaterBillByCompany(companyKey);
      handleInputChange('outgoings', 'water', waterBill.toString());
    }
  };

  const handleReset = () => {
    setBudgetData({
      income: {
        wages: '',
        universalCredit: '',
        otherBenefits: '',
        familySupport: '',
        savings: '',
        otherIncome: ''
      },
      outgoings: {
        rent: '',
        councilTax: '',
        gasAndElectricity: '',
        water: '',
        broadband: '',
        food: '',
        transport: '',
        phone: '',
        clothing: '',
        childcare: '',
        debtPayments: '',
        otherExpenses: ''
      }
    });
    setValidationErrors({});
    setSelectedWaterCompany('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const dataSourceInfo = getDataSourceInfo();

  return (
    <div className="enhanced-budgeting-tool">
      <div className="container">
        <div className="tool-header">
          <h1>Budgeting Tool</h1>
          <p className="tool-description">Create a realistic budget to help you manage your money when you leave prison.</p>
          <div className="tool-actions">
            {config.standardAmounts.enabled && (
              <button className="btn btn-primary" onClick={() => setShowPreFillModal(true)}>
                Pre-fill with Standard Amounts
              </button>
            )}
            <button className="btn btn-outline" onClick={() => setShowAdviserMode(!showAdviserMode)}>
              {showAdviserMode ? 'Hide' : 'Show'} Adviser Mode
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>Reset Budget</button>
            <a href="/budgeting-tool-admin" className="btn btn-outline">
              Admin Panel
            </a>
          </div>
        </div>

        {showAdviserMode && (
          <div className="adviser-mode-banner">
            <h3>Adviser Mode</h3>
            <p>You are viewing this tool in adviser mode. This allows you to see additional information and guidance.</p>
          </div>
        )}

        <div className="budget-sections">
          {/* Income Section */}
          <div className="budget-section income-section">
            <h2>Income</h2>
            <div className="budget-grid">
              <div className="budget-item">
                <label htmlFor="wages">Wages {isFieldCompulsory('wages') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="wages"
                  value={budgetData.income.wages}
                  onChange={(e) => handleInputChange('income', 'wages', e.target.value)}
                  className={`form-control ${validationErrors.wages ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.wages && <div className="error-message">{validationErrors.wages}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="universalCredit">Universal Credit {isFieldCompulsory('universalCredit') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="universalCredit"
                  value={budgetData.income.universalCredit}
                  onChange={(e) => handleInputChange('income', 'universalCredit', e.target.value)}
                  className={`form-control ${validationErrors.universalCredit ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.universalCredit && <div className="error-message">{validationErrors.universalCredit}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="otherBenefits">Other Benefits {isFieldCompulsory('otherBenefits') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="otherBenefits"
                  value={budgetData.income.otherBenefits}
                  onChange={(e) => handleInputChange('income', 'otherBenefits', e.target.value)}
                  className={`form-control ${validationErrors.otherBenefits ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.otherBenefits && <div className="error-message">{validationErrors.otherBenefits}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="familySupport">Family Support {isFieldCompulsory('familySupport') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="familySupport"
                  value={budgetData.income.familySupport}
                  onChange={(e) => handleInputChange('income', 'familySupport', e.target.value)}
                  className={`form-control ${validationErrors.familySupport ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.familySupport && <div className="error-message">{validationErrors.familySupport}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="savings">Savings {isFieldCompulsory('savings') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="savings"
                  value={budgetData.income.savings}
                  onChange={(e) => handleInputChange('income', 'savings', e.target.value)}
                  className={`form-control ${validationErrors.savings ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.savings && <div className="error-message">{validationErrors.savings}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="otherIncome">Other Income {isFieldCompulsory('otherIncome') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="otherIncome"
                  value={budgetData.income.otherIncome}
                  onChange={(e) => handleInputChange('income', 'otherIncome', e.target.value)}
                  className={`form-control ${validationErrors.otherIncome ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.otherIncome && <div className="error-message">{validationErrors.otherIncome}</div>}
              </div>
            </div>
            <h3>Total Income: {formatCurrency(totalIncome)}</h3>
          </div>

          {/* Outgoings Section */}
          <div className="budget-section outgoings-section">
            <h2>Outgoings</h2>
            <div className="budget-grid">
              <div className="budget-item">
                <label htmlFor="rent">Rent {isFieldCompulsory('rent') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="rent"
                  value={budgetData.outgoings.rent}
                  onChange={(e) => handleInputChange('outgoings', 'rent', e.target.value)}
                  className={`form-control ${validationErrors.rent ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.rent && <div className="error-message">{validationErrors.rent}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="councilTax">Council Tax {isFieldCompulsory('councilTax') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="councilTax"
                  value={budgetData.outgoings.councilTax}
                  onChange={(e) => handleInputChange('outgoings', 'councilTax', e.target.value)}
                  className={`form-control ${validationErrors.councilTax ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.councilTax && <div className="error-message">{validationErrors.councilTax}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="gasAndElectricity">Gas and Electricity {isFieldCompulsory('gasAndElectricity') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="gasAndElectricity"
                  value={budgetData.outgoings.gasAndElectricity}
                  onChange={(e) => handleInputChange('outgoings', 'gasAndElectricity', e.target.value)}
                  className={`form-control ${validationErrors.gasAndElectricity ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.gasAndElectricity && <div className="error-message">{validationErrors.gasAndElectricity}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="water">Water {isFieldCompulsory('water') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="water"
                  value={budgetData.outgoings.water}
                  onChange={(e) => handleInputChange('outgoings', 'water', e.target.value)}
                  className={`form-control ${validationErrors.water ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.water && <div className="error-message">{validationErrors.water}</div>}
                <div className="help-text">
                  <label htmlFor="waterCompany">Calculate by water company:</label>
                  <select
                    id="waterCompany"
                    value={selectedWaterCompany}
                    onChange={(e) => handleWaterCompanyChange(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select water company</option>
                    {Object.entries(waterCompanies).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="budget-item">
                <label htmlFor="broadband">Broadband {isFieldCompulsory('broadband') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="broadband"
                  value={budgetData.outgoings.broadband}
                  onChange={(e) => handleInputChange('outgoings', 'broadband', e.target.value)}
                  className={`form-control ${validationErrors.broadband ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.broadband && <div className="error-message">{validationErrors.broadband}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="food">Food {isFieldCompulsory('food') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="food"
                  value={budgetData.outgoings.food}
                  onChange={(e) => handleInputChange('outgoings', 'food', e.target.value)}
                  className={`form-control ${validationErrors.food ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.food && <div className="error-message">{validationErrors.food}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="transport">Transport {isFieldCompulsory('transport') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="transport"
                  value={budgetData.outgoings.transport}
                  onChange={(e) => handleInputChange('outgoings', 'transport', e.target.value)}
                  className={`form-control ${validationErrors.transport ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.transport && <div className="error-message">{validationErrors.transport}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="phone">Phone {isFieldCompulsory('phone') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="phone"
                  value={budgetData.outgoings.phone}
                  onChange={(e) => handleInputChange('outgoings', 'phone', e.target.value)}
                  className={`form-control ${validationErrors.phone ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.phone && <div className="error-message">{validationErrors.phone}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="clothing">Clothing {isFieldCompulsory('clothing') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="clothing"
                  value={budgetData.outgoings.clothing}
                  onChange={(e) => handleInputChange('outgoings', 'clothing', e.target.value)}
                  className={`form-control ${validationErrors.clothing ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.clothing && <div className="error-message">{validationErrors.clothing}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="childcare">Childcare {isFieldCompulsory('childcare') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="childcare"
                  value={budgetData.outgoings.childcare}
                  onChange={(e) => handleInputChange('outgoings', 'childcare', e.target.value)}
                  className={`form-control ${validationErrors.childcare ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.childcare && <div className="error-message">{validationErrors.childcare}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="debtPayments">Debt Payments {isFieldCompulsory('debtPayments') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="debtPayments"
                  value={budgetData.outgoings.debtPayments}
                  onChange={(e) => handleInputChange('outgoings', 'debtPayments', e.target.value)}
                  className={`form-control ${validationErrors.debtPayments ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.debtPayments && <div className="error-message">{validationErrors.debtPayments}</div>}
              </div>

              <div className="budget-item">
                <label htmlFor="otherExpenses">Other Expenses {isFieldCompulsory('otherExpenses') && <span className="required">*</span>}</label>
                <input
                  type="number"
                  id="otherExpenses"
                  value={budgetData.outgoings.otherExpenses}
                  onChange={(e) => handleInputChange('outgoings', 'otherExpenses', e.target.value)}
                  className={`form-control ${validationErrors.otherExpenses ? 'error' : ''}`}
                  placeholder="0"
                />
                {validationErrors.otherExpenses && <div className="error-message">{validationErrors.otherExpenses}</div>}
              </div>
            </div>
            <h3>Total Outgoings: {formatCurrency(totalOutgoings)}</h3>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="budget-summary">
          <div className="summary-card">
            <h2>Budget Summary</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Income:</span>
                <span className="summary-value income">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Outgoings:</span>
                <span className="summary-value outgoing">{formatCurrency(totalOutgoings)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Balance:</span>
                <span className={`summary-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            {balance < 0 && (
              <div className="warning-message">
                <h3>⚠️ Warning</h3>
                <p>Your outgoings exceed your income by {formatCurrency(Math.abs(balance))}. You may need to reduce your spending or find additional sources of income.</p>
              </div>
            )}

            {balance >= 0 && (
              <div className="positive-message">
                <h3>✅ Good News</h3>
                <p>Your income exceeds your outgoings by {formatCurrency(balance)}. This gives you some flexibility in your budget.</p>
              </div>
            )}

            {showAdviserMode && (
              <div className="adviser-actions">
                <h3>Adviser Notes</h3>
                <div className="action-buttons">
                  <button className="btn btn-outline" onClick={() => window.print()}>
                    Print Budget
                  </button>
                  <button className="btn btn-outline" onClick={() => {
                    const dataStr = JSON.stringify(budgetData, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'budget-data.json';
                    link.click();
                  }}>
                    Export Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pre-fill Modal */}
      {showPreFillModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Pre-fill with Standard Amounts</h3>
            <p>Select your household type to pre-fill the budget with standard amounts based on ONS data.</p>
            <div className="modal-content">
              <label htmlFor="householdType">Household Type:</label>
              <select 
                id="householdType" 
                value={selectedHouseholdType} 
                onChange={(e) => setSelectedHouseholdType(e.target.value)}
                className="form-control"
              >
                {Object.entries(householdTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <div className="data-source-info">
                <p><strong>Data Source:</strong> {dataSourceInfo.source}</p>
                <p><strong>Last Updated:</strong> {dataSourceInfo.lastUpdated}</p>
                <p><strong>Disclaimer:</strong> {dataSourceInfo.disclaimer}</p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handlePreFill}>Pre-fill Budget</button>
                <button className="btn btn-secondary" onClick={() => setShowPreFillModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedBudgetingTool;

