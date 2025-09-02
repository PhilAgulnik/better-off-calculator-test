import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CalculatorForm from './CalculatorForm';
import ResultsSection from './ResultsSection';
import AdminPanel from './AdminPanel';
import { applySkinForRoute } from '../utils/skinManager';
import Logo from './Logo';
import { UniversalCreditCalculator } from '../utils/calculator';

function CalculatorPage({ isRehabilitation = false }) {
  const location = useLocation();
  const [formData, setFormData] = useState({
    // Tax Year and Circumstances
    taxYear: '2024_25',
    circumstances: 'single',
    
    // Housing
    housingStatus: 'no_housing_costs',
    tenantType: 'private',
    rent: 0,
    rentPeriod: 'per_month',
    serviceCharges: 0,
    serviceChargesPeriod: 'per_month',
    bedrooms: 1,
    nonDependants: 0,
    
    // Employment and Disability - Main Person
    employmentType: 'not_working',
    monthlyEarnings: 0,
    monthlyEarningsPeriod: 'per_month',
    pensionAmount: 0,
    pensionAmountPeriod: 'per_month',
    pensionType: 'amount',
    pensionPercentage: 3,
    isDisabled: 'no',
    claimsDisabilityBenefits: 'no',
    disabilityBenefitType: '',
    pipDailyLivingRate: 'none',
    pipMobilityRate: 'none',
    dlaCareRate: 'none',
    dlaMobilityRate: 'none',
    aaRate: 'none',
    hasLCWRA: 'no',
    
    // Employment and Disability - Partner
    partnerEmploymentType: 'not_working',
    partnerMonthlyEarnings: 0,
    partnerMonthlyEarningsPeriod: 'per_month',
    partnerPensionAmount: 0,
    partnerPensionAmountPeriod: 'per_month',
    partnerPensionType: 'amount',
    partnerPensionPercentage: 3,
    partnerIsDisabled: 'no',
    partnerClaimsDisabilityBenefits: 'no',
    partnerDisabilityBenefitType: '',
    partnerPipDailyLivingRate: 'none',
    partnerPipMobilityRate: 'none',
    partnerDlaCareRate: 'none',
    partnerDlaMobilityRate: 'none',
    partnerAaRate: 'none',
    partnerHasLCWRA: 'no',
    
    // Children
    hasChildren: false,
    children: 0,
    childAges: [],
    childDisabilities: [],
    childGenders: [],
    childcareCosts: 0,
    childcareCostsPeriod: 'per_month',
    
    // Carer Status
    isCarer: 'no',
    isPartnerCarer: 'no',
    
    // Other Benefits
    hasOtherBenefits: 'no',
    otherBenefitsList: [],
    
    // Savings
    hasSavings: 'no',
    hasSavingsOver6000: 'no',
    savingsAmount: 0,
    savings: 0,
    savingsPeriod: 'per_month',
    
    // Area
    area: 'england'
  });

  const [results, setResults] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize calculator
  const [calculator] = useState(() => new UniversalCreditCalculator());

  // Apply skin for current route
  useEffect(() => {
    applySkinForRoute(location.pathname);
  }, [location.pathname]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      // Convert period-based amounts to monthly amounts for calculation
      const calculationInput = {
        ...formData,
        // Convert amounts to monthly
        rent: convertToMonthly(formData.rent, formData.rentPeriod),
        serviceCharges: convertToMonthly(formData.serviceCharges, formData.serviceChargesPeriod),
        monthlyEarnings: convertToMonthly(formData.monthlyEarnings, formData.monthlyEarningsPeriod),
        pensionAmount: convertToMonthly(formData.pensionAmount, formData.pensionAmountPeriod),
        partnerMonthlyEarnings: convertToMonthly(formData.partnerMonthlyEarnings, formData.partnerMonthlyEarningsPeriod),
        partnerPensionAmount: convertToMonthly(formData.partnerPensionAmount, formData.partnerPensionAmountPeriod),
        childcareCosts: convertToMonthly(formData.childcareCosts, formData.childcareCostsPeriod),
        savings: convertToMonthly(formData.savings, formData.savingsPeriod),
        // Add missing fields that the calculator expects
        age: formData.age || 25, // Use actual age if provided, otherwise default
        partnerAge: formData.partnerAge || 25, // Use actual partner age if provided, otherwise default
        otherBenefits: formData.hasOtherBenefits === 'yes' ? 
          (formData.otherBenefitsList.reduce((sum, benefit) => sum + (benefit.amount || 0), 0)) : 0,
        otherBenefitsPeriod: 'per_month'
      };

      console.log('Calculation input:', calculationInput);

      // Initialize calculator if needed
      if (!calculator.initialized) {
        await calculator.initialize();
      }

      // Perform actual calculation
      const calculationResult = await calculator.calculate(calculationInput);
      
      console.log('Calculation result:', calculationResult);
      
      if (calculationResult.success) {
        setResults(calculationResult);
        setShowResults(true);
      } else {
        console.error('Calculation failed:', calculationResult.errors);
        // Set error results
        setResults({
          success: false,
          errors: calculationResult.errors,
          calculation: {
            standardAllowance: 0,
            housingElement: 0,
            childElement: 0,
            childcareElement: 0,
            carerElement: 0,
            totalElements: 0,
            earningsReduction: 0,
            capitalDeduction: 0,
            benefitDeduction: 0,
            capitalDeductionDetails: {
              tariffIncome: 0,
              explanation: 'Calculation failed'
            },
            finalAmount: 0
          }
        });
        setShowResults(true);
      }
    } catch (error) {
      console.error('Calculation failed:', error);
      setResults({
        success: false,
        errors: [error.message],
        calculation: {
          standardAllowance: 0,
          childElement: 0,
          childcareElement: 0,
          carerElement: 0,
          totalElements: 0,
          earningsReduction: 0,
          capitalDeduction: 0,
          benefitDeduction: 0,
          capitalDeductionDetails: {
            tariffIncome: 0,
            explanation: 'Calculation error occurred'
          },
          finalAmount: 0
        }
      });
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert amounts to monthly
  const convertToMonthly = (amount, period) => {
    if (!amount || amount === 0) return 0;
    
    switch (period) {
      case 'per_week':
        return amount * 4.33; // 52 weeks / 12 months
      case 'per_month':
        return amount;
      case 'per_year':
        return amount / 12;
      default:
        return amount;
    }
  };

  const handleSaveScenario = () => {
    const scenario = {
      id: Date.now(),
      name: `Scenario ${savedScenarios.length + 1}`,
      input: { ...formData },
      calculation: results,
      timestamp: new Date().toLocaleString()
    };
    setSavedScenarios(prev => [...prev, scenario]);
    setShowSavedScenarios(true);
    
    // Save to localStorage
    const updated = [...savedScenarios, scenario];
    localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
  };

  const handleReset = () => {
    setFormData({
      // Tax Year and Circumstances
      taxYear: '2024_25',
      circumstances: 'single',
      
      // Housing
      housingStatus: 'no_housing_costs',
      tenantType: 'private',
      rent: 0,
      rentPeriod: 'per_month',
      serviceCharges: 0,
      serviceChargesPeriod: 'per_month',
      bedrooms: 1,
      nonDependants: 0,
      
      // Employment and Disability - Main Person
      employmentType: 'not_working',
      monthlyEarnings: 0,
      monthlyEarningsPeriod: 'per_month',
      pensionAmount: 0,
      pensionAmountPeriod: 'per_month',
      pensionType: 'amount',
      pensionPercentage: 3,
      isDisabled: 'no',
      claimsDisabilityBenefits: 'no',
      disabilityBenefitType: '',
      pipDailyLivingRate: 'none',
      pipMobilityRate: 'none',
      dlaCareRate: 'none',
      dlaMobilityRate: 'none',
      aaRate: 'none',
      hasLCWRA: 'no',
      
      // Employment and Disability - Partner
      partnerEmploymentType: 'not_working',
      partnerMonthlyEarnings: 0,
      partnerMonthlyEarningsPeriod: 'per_month',
      partnerPensionAmount: 0,
      partnerPensionAmountPeriod: 'per_month',
      partnerPensionType: 'amount',
      partnerPensionPercentage: 3,
      partnerIsDisabled: 'no',
      partnerClaimsDisabilityBenefits: 'no',
      partnerDisabilityBenefitType: '',
      partnerPipDailyLivingRate: 'none',
      partnerPipMobilityRate: 'none',
      partnerDlaCareRate: 'none',
      partnerDlaMobilityRate: 'none',
      partnerAaRate: 'none',
      partnerHasLCWRA: 'no',
      
      // Children
      hasChildren: false,
      children: 0,
      childAges: [],
      childDisabilities: [],
      childGenders: [],
      childcareCosts: 0,
      childcareCostsPeriod: 'per_month',
      
      // Carer Status
      isCarer: 'no',
      isPartnerCarer: 'no',
      
      // Other Benefits
      hasOtherBenefits: 'no',
      otherBenefitsList: [],
      
      // Savings
      hasSavings: 'no',
      hasSavingsOver6000: 'no',
      savingsAmount: 0,
      savings: 0,
      savingsPeriod: 'per_month',
      
      // Area
      area: 'england'
    });
    setResults(null);
    setShowResults(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!results) return;
    
    const exportData = {
      formData,
      results,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uc-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <Logo route={location.pathname} />
          <div className="header-text">
            <h1>{isRehabilitation ? 'Benefits Calculator' : 'Better Off In Work Calculator'}</h1>
            <p className="subtitle">{isRehabilitation ? 'Use this calculator to maximise your income and see how changes in circumstance might affect you' : 'Use this calculator to check your finances if you move into work, claim all your entitlements and get help with self employment'}</p>
          </div>
          <div className="header-buttons">
            <button 
              type="button" 
              className="btn btn-outline btn-sm admin-toggle"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              {showAdminPanel ? 'Hide Admin' : 'Admin Panel'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="calculator-grid">
          <CalculatorForm 
            formData={formData}
            onFormChange={handleFormChange}
            onCalculate={handleCalculate}
            onSave={handleSaveScenario}
            onReset={handleReset}
            isRehabilitation={isRehabilitation}
          />
        </div>

        {showSavedScenarios && savedScenarios.length > 0 && (
          <div className="saved-scenarios">
            <h3>Saved Scenarios</h3>
            <div className="scenarios-list">
              {savedScenarios.map(scenario => (
                <div key={scenario.id} className="scenario-item">
                  <span>{scenario.name}</span>
                  <div className="scenario-actions">
                    <button onClick={() => {
                      setFormData(scenario.input);
                      setResults(scenario.calculation);
                      setShowResults(true);
                    }}>Load</button>
                    <button onClick={() => {
                      const updated = savedScenarios.filter(s => s.id !== scenario.id);
                      setSavedScenarios(updated);
                      localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showResults && results && (
          <ResultsSection 
            results={results} 
            formData={formData}
            onPrint={handlePrint}
            onExport={handleExport}
          />
        )}
      </main>

      {/* Admin Panel */}
      <AdminPanel 
        isVisible={showAdminPanel}
        onToggleVisibility={() => setShowAdminPanel(false)}
        currentRoute={location.pathname}
        formData={formData}
        results={results}
      />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Calculating...</div>
        </div>
      )}
    </div>
  );
}

export default CalculatorPage;
