import React, { useState } from 'react';

function SelfAssessmentTaxForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalDetails: {
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nino: '',
      utr: '',
      address: {
        line1: '',
        postcode: '',
        country: 'UK'
      },
      isScottishResident: false,
      maritalStatus: 'single'
    },
    selfEmploymentIncome: {
      businessName: '',
      businessDescription: '',
      accountingPeriodStart: '',
      accountingPeriodEnd: '',
      turnover: 0,
      otherBusinessIncome: 0,
      expenses: {
        costOfGoodsSold: 0,
        constructionIndustrySubcontractors: 0,
        wagesAndStaff: 0,
        carVanAndTravel: 0,
        rentRatesAndInsurance: 0,
        repairsAndRenewals: 0,
        phonesFaxStationeryAndOther: 0,
        advertisingAndBusiness: 0,
        interestOnBankAndOther: 0,
        bankCharges: 0,
        irrecoverableDebts: 0,
        professionalFees: 0,
        depreciation: 0,
        other: 0
      },
      capitalAllowances: {
        annualInvestmentAllowance: 0,
        writingDownAllowanceMainRate: 0,
        writingDownAllowanceSpecialRate: 0,
        balancingCharges: 0
      },
      accountingMethod: 'cash',
      useTradingAllowance: false
    }
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedFormData = (section, nestedField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: {
          ...prev[section][nestedField],
          [field]: value
        }
      }
    }));
  };

  const calculateTax = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const { selfEmploymentIncome } = formData;
      
      // Calculate total expenses
      const totalExpenses = Object.values(selfEmploymentIncome.expenses).reduce((sum, expense) => sum + expense, 0);
      
      // Calculate profit
      const profit = selfEmploymentIncome.turnover + selfEmploymentIncome.otherBusinessIncome - totalExpenses;
      
      // Apply trading allowance if applicable
      const tradingAllowance = selfEmploymentIncome.useTradingAllowance ? Math.min(1000, profit) : 0;
      const taxableProfit = Math.max(0, profit - tradingAllowance);
      
      // Basic tax calculation (simplified)
      const personalAllowance = 12570;
      const taxableIncome = Math.max(0, taxableProfit - personalAllowance);
      
      let incomeTax = 0;
      if (taxableIncome > 0) {
        if (taxableIncome <= 37700) {
          incomeTax = taxableIncome * 0.20; // Basic rate
        } else {
          incomeTax = 37700 * 0.20 + (taxableIncome - 37700) * 0.40; // Higher rate
        }
      }
      
      // National Insurance calculations
      let class2NI = 0;
      let class4NI = 0;
      
      if (taxableProfit >= 12570) {
        class2NI = 3.45 * 52; // £3.45 per week
      }
      
      if (taxableProfit > 12570) {
        const class4Profits = taxableProfit - 12570;
        if (class4Profits <= 37700) {
          class4NI = class4Profits * 0.09;
        } else {
          class4NI = 37700 * 0.09 + (class4Profits - 37700) * 0.02;
        }
      }
      
      const totalTaxLiability = incomeTax + class2NI + class4NI;
      
      setCalculationResult({
        totalIncome: selfEmploymentIncome.turnover + selfEmploymentIncome.otherBusinessIncome,
        totalExpenses,
        profit,
        tradingAllowance,
        taxableProfit,
        personalAllowance,
        taxableIncome,
        incomeTax,
        nationalInsuranceClass2: class2NI,
        nationalInsuranceClass4: class4NI,
        totalTaxLiability,
        paymentsOnAccount: {
          firstPayment: totalTaxLiability > 1000 ? totalTaxLiability / 2 : 0,
          secondPayment: totalTaxLiability > 1000 ? totalTaxLiability / 2 : 0,
          finalPayment: 0
        }
      });
      
      setIsCalculating(false);
    }, 1000);
  };

  const renderPersonalDetails = () => (
    <div className="form-section">
      <h3>Personal Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.personalDetails.title}
            onChange={(e) => updateFormData('personalDetails', 'title', e.target.value)}
            placeholder="Mr, Mrs, Ms, etc."
          />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={formData.personalDetails.firstName}
            onChange={(e) => updateFormData('personalDetails', 'firstName', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={formData.personalDetails.lastName}
            onChange={(e) => updateFormData('personalDetails', 'lastName', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={formData.personalDetails.dateOfBirth}
            onChange={(e) => updateFormData('personalDetails', 'dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>National Insurance Number</label>
          <input
            type="text"
            value={formData.personalDetails.nino}
            onChange={(e) => updateFormData('personalDetails', 'nino', e.target.value)}
            placeholder="AB123456C"
            required
          />
          <div className="help-text">
            Your National Insurance number is 9 characters long and includes 2 letters, 6 numbers, and 1 letter (e.g., AB123456C). You can find this on your payslip, P60, or any letter from HMRC.
          </div>
        </div>
        <div className="form-group">
          <label>UTR (Unique Taxpayer Reference)</label>
          <input
            type="text"
            value={formData.personalDetails.utr}
            onChange={(e) => updateFormData('personalDetails', 'utr', e.target.value)}
            placeholder="1234567890"
            required
          />
          <div className="help-text">
            Your UTR is a 10-digit number that identifies you for tax purposes. You can find this on your tax return, statement of account, or any letter from HMRC. If you don't have one, you'll need to register for self-assessment first.
          </div>
        </div>
        <div className="form-group">
          <label>Address Line 1</label>
          <input
            type="text"
            value={formData.personalDetails.address.line1}
            onChange={(e) => updateNestedFormData('personalDetails', 'address', 'line1', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Postcode</label>
          <input
            type="text"
            value={formData.personalDetails.address.postcode}
            onChange={(e) => updateNestedFormData('personalDetails', 'address', 'postcode', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={formData.personalDetails.isScottishResident}
              onChange={(e) => updateFormData('personalDetails', 'isScottishResident', e.target.checked)}
            />
            <label>Scottish Resident</label>
          </div>
          <div className="help-text">
            Check this box if you were a Scottish resident for tax purposes during the tax year. This affects your income tax rates and bands.
          </div>
        </div>
        <div className="form-group">
          <label>Marital Status</label>
          <select
            value={formData.personalDetails.maritalStatus}
            onChange={(e) => updateFormData('personalDetails', 'maritalStatus', e.target.value)}
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="civil_partnership">Civil Partnership</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSelfEmploymentIncome = () => (
    <div className="form-section">
      <h3>Self-Employment Income</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            value={formData.selfEmploymentIncome.businessName}
            onChange={(e) => updateFormData('selfEmploymentIncome', 'businessName', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Business Description</label>
          <textarea
            value={formData.selfEmploymentIncome.businessDescription}
            onChange={(e) => updateFormData('selfEmploymentIncome', 'businessDescription', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Accounting Period Start</label>
          <input
            type="date"
            value={formData.selfEmploymentIncome.accountingPeriodStart}
            onChange={(e) => updateFormData('selfEmploymentIncome', 'accountingPeriodStart', e.target.value)}
            required
          />
          <div className="help-text">
            The date your business accounting period begins. This is usually the first day of your business year.
          </div>
        </div>
        <div className="form-group">
          <label>Accounting Period End</label>
          <input
            type="date"
            value={formData.selfEmploymentIncome.accountingPeriodEnd}
            onChange={(e) => updateFormData('selfEmploymentIncome', 'accountingPeriodEnd', e.target.value)}
            required
          />
          <div className="help-text">
            The date your business accounting period ends. This is usually the last day of your business year.
          </div>
        </div>
        <div className="form-group">
          <label>Turnover</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.turnover}
            onChange={(e) => updateFormData('selfEmploymentIncome', 'turnover', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            required
          />
          <div className="help-text">
            Your total business income before deducting any expenses. This includes all money received from your business activities.
          </div>
        </div>
        <div className="form-group">
          <label>Other Business Income</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.otherBusinessIncome}
            onChange={(e) => updateFormData('selfEmploymentIncome', 'otherBusinessIncome', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Accounting Method</label>
          <select
            value={formData.selfEmploymentIncome.accountingMethod}
            onChange={(e) => updateFormData('selfEmploymentIncome', 'accountingMethod', e.target.value)}
          >
            <option value="cash">Cash Basis</option>
            <option value="accruals">Accruals Basis</option>
          </select>
        </div>
        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={formData.selfEmploymentIncome.useTradingAllowance}
              onChange={(e) => updateFormData('selfEmploymentIncome', 'useTradingAllowance', e.target.checked)}
            />
            <label>Use Trading Allowance (£1,000)</label>
          </div>
          <div className="help-text">
            The trading allowance lets you claim up to £1,000 of tax-free trading income. You can choose to use this instead of claiming actual expenses, but you cannot use both.
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="form-section">
      <h3>Business Expenses</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Cost of Goods Sold</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.costOfGoodsSold}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'costOfGoodsSold', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Construction Industry Subcontractors</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.constructionIndustrySubcontractors}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'constructionIndustrySubcontractors', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Wages and Staff</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.wagesAndStaff}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'wagesAndStaff', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Car, Van and Travel</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.carVanAndTravel}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'carVanAndTravel', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
          <div className="help-text">
            Include fuel, insurance, repairs, and other running costs for vehicles used for business. You can claim a proportion if the vehicle is also used for personal journeys.
          </div>
        </div>
        <div className="form-group">
          <label>Rent, Rates and Insurance</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.rentRatesAndInsurance}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'rentRatesAndInsurance', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
          <div className="help-text">
            Include rent for business premises, business rates, and insurance for your business. You can claim a proportion if you work from home.
          </div>
        </div>
        <div className="form-group">
          <label>Repairs and Renewals</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.repairsAndRenewals}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'repairsAndRenewals', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Phones, Fax, Stationery and Other</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.phonesFaxStationeryAndOther}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'phonesFaxStationeryAndOther', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Advertising and Business</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.advertisingAndBusiness}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'advertisingAndBusiness', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Interest on Bank and Other</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.interestOnBankAndOther}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'interestOnBankAndOther', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Bank Charges</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.bankCharges}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'bankCharges', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Irrecoverable Debts</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.irrecoverableDebts}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'irrecoverableDebts', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Professional Fees</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.professionalFees}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'professionalFees', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
          <div className="help-text">
            Include fees for accountants, solicitors, and other professional services used for your business. This does not include fees for preparing your tax return.
          </div>
        </div>
        <div className="form-group">
          <label>Depreciation</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.depreciation}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'depreciation', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Other Expenses</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.expenses.other}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'expenses', 'other', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );

  const renderCapitalAllowances = () => (
    <div className="form-section">
      <h3>Capital Allowances</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Annual Investment Allowance</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.capitalAllowances.annualInvestmentAllowance}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'capitalAllowances', 'annualInvestmentAllowance', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
          <div className="help-text">
            You can claim up to £1,000,000 of Annual Investment Allowance (AIA) on most plant and machinery (excluding cars). This gives you 100% relief in the year of purchase.
          </div>
        </div>
        <div className="form-group">
          <label>Writing Down Allowance (Main Rate)</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.capitalAllowances.writingDownAllowanceMainRate}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'capitalAllowances', 'writingDownAllowanceMainRate', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Writing Down Allowance (Special Rate)</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.capitalAllowances.writingDownAllowanceSpecialRate}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'capitalAllowances', 'writingDownAllowanceSpecialRate', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Balancing Charges</label>
          <input
            type="number"
            value={formData.selfEmploymentIncome.capitalAllowances.balancingCharges}
            onChange={(e) => updateNestedFormData('selfEmploymentIncome', 'capitalAllowances', 'balancingCharges', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );

  const renderCalculationResults = () => (
    <div className="form-section">
      <h3>Tax Calculation Results</h3>
      {isCalculating ? (
        <div className="loading">Calculating tax...</div>
      ) : calculationResult ? (
        <div className="calculation-results">
          <div className="result-grid">
            <div className="result-item">
              <label>Total Income:</label>
              <span>£{calculationResult.totalIncome.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Total Expenses:</label>
              <span>£{calculationResult.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Profit:</label>
              <span>£{calculationResult.profit.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Trading Allowance:</label>
              <span>£{calculationResult.tradingAllowance.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Taxable Profit:</label>
              <span>£{calculationResult.taxableProfit.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Personal Allowance:</label>
              <span>£{calculationResult.personalAllowance.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Taxable Income:</label>
              <span>£{calculationResult.taxableIncome.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Income Tax:</label>
              <span>£{calculationResult.incomeTax.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Class 2 National Insurance:</label>
              <span>£{calculationResult.nationalInsuranceClass2.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Class 4 National Insurance:</label>
              <span>£{calculationResult.nationalInsuranceClass4.toLocaleString()}</span>
            </div>
            <div className="result-item total">
              <label>Total Tax Liability:</label>
              <span>£{calculationResult.totalTaxLiability.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="payments-on-account">
            <h4>Payments on Account</h4>
            <div className="result-grid">
              <div className="result-item">
                <label>First Payment (31 January):</label>
                <span>£{calculationResult.paymentsOnAccount.firstPayment.toLocaleString()}</span>
              </div>
              <div className="result-item">
                <label>Second Payment (31 July):</label>
                <span>£{calculationResult.paymentsOnAccount.secondPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalDetails();
      case 2:
        return renderSelfEmploymentIncome();
      case 3:
        return renderExpenses();
      case 4:
        return renderCapitalAllowances();
      case 5:
        return renderCalculationResults();
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="self-assessment-tax-form">
      <div className="container">
        <div className="card">
          <h1>Self-Assessment Tax Form</h1>
          <p className="description">
            Complete your self-assessment tax return for the 2024-25 tax year. 
            This form will help you calculate your tax liability and prepare for submission to HMRC.
          </p>
          
          <div className="help-panel">
            <h4>Before you start</h4>
            <p>You'll need the following information to complete this form:</p>
            <ul>
              <li>Your National Insurance number</li>
              <li>Your Unique Taxpayer Reference (UTR)</li>
              <li>Your business income and expenses for the tax year</li>
              <li>Details of any capital allowances you're claiming</li>
              <li>Your personal details including address and marital status</li>
            </ul>
            <p>This form is for self-employed individuals only. If you have other sources of income (employment, pensions, etc.), you'll need to include those separately.</p>
          </div>

          <div className="progress-bar">
            <div className={`progress-step ${currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Personal Details</span>
            </div>
            <div className={`progress-step ${currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Business Income</span>
            </div>
            <div className={`progress-step ${currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Expenses</span>
            </div>
            <div className={`progress-step ${currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : ''}`}>
              <span className="step-number">4</span>
              <span className="step-label">Capital Allowances</span>
            </div>
            <div className={`progress-step ${currentStep === 5 ? 'active' : ''}`}>
              <span className="step-number">5</span>
              <span className="step-label">Calculation</span>
            </div>
          </div>

          <div className="form-content">
            {renderStep()}
          </div>

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn btn-secondary">
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary">
                Next
              </button>
            ) : (
              <button 
                type="button" 
                onClick={calculateTax} 
                className="btn btn-primary"
                disabled={isCalculating}
              >
                {isCalculating ? 'Calculating...' : 'Calculate Tax'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelfAssessmentTaxForm;
