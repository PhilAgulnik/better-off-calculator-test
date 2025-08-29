import React, { useState, useEffect } from 'react';
import CalculatorForm from './CalculatorForm';
import ResultsSection from './ResultsSection';
import SavedScenarios from './SavedScenarios';
import LoadingOverlay from './LoadingOverlay';
import AdminPanel from './AdminPanel';
import { UniversalCreditCalculator } from '../utils/calculator';
import { useTextManager } from '../hooks/useTextManager';
import Logo from './Logo';

function CalculatorPage() {
  const { getTextValue } = useTextManager();
  const [calculator, setCalculator] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Details
    taxYear: '2025_26',
    circumstances: 'single',
    age: 25,
    partnerAge: 25,
    children: 0,
    
    // Children's disability information
    childDisabilities: [], // Array of objects: {childIndex: 0, hasDisability: false, claimsDLA: false, careRate: '', mobilityRate: ''}
    childAges: [], // Array of ages for each child
    childGenders: [], // Array of genders for each child ('male' or 'female')
    hasChildren: false, // Track whether user has children (separate from number)
    
    // Housing
    housingStatus: 'no_housing_costs',
    tenantType: 'private',
    rent: 0,
    serviceCharges: 0,
    bedrooms: 1,
    area: 'default',
    nonDependants: 0,
    
    // Employment and Disability - Main Person
    employmentType: 'not_working',
    monthlyEarnings: 0,
    childcareCosts: 0,
    pensionType: 'amount',     // Changed default to amount
    pensionAmount: 0,          // Default amount is 0
    pensionPercentage: 3,      // Keep percentage default for when user switches
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
    partnerPensionType: 'amount',     // Changed default to amount
    partnerPensionAmount: 0,          // Default amount is 0
    partnerPensionPercentage: 3,      // Keep percentage default for when user switches
    partnerIsDisabled: 'no',
    partnerClaimsDisabilityBenefits: 'no',
    partnerDisabilityBenefitType: '',
    partnerPipDailyLivingRate: 'none',
    partnerPipMobilityRate: 'none',
    partnerDlaCareRate: 'none',
    partnerDlaMobilityRate: 'none',
    partnerAaRate: 'none',
    partnerHasLCWRA: 'no',

    // Self-employed fields
    businessIncomeBank: 0,
    businessIncomeCash: 0,
    businessExpensesRent: 0,
    businessExpensesRates: 0,
    businessExpensesUtilities: 0,
    businessExpensesInsurance: 0,
    businessExpensesTelephone: 0,
    businessExpensesMarketing: 0,
    businessExpensesVehicle: 0,
    businessExpensesEquipment: 0,
    businessExpensesPostage: 0,
    businessExpensesTransport: 0,
    businessExpensesProfessional: 0,
    businessTax: 0,
    businessNIC: 0,
    businessPension: 0,
    businessCarMiles: 0,
    businessHomeHours: 0,
    
    // Carer details
    isCarer: 'no',
    isPartnerCarer: 'no',
    currentlyReceivingCarersAllowance: '',
    partnerCurrentlyReceivingCarersAllowance: '',
    caringHours: '',
    partnerCaringHours: '',
    personReceivesBenefits: '',
    partnerPersonReceivesBenefits: '',
    includeCarersAllowance: 'yes',
    includePartnerCarersAllowance: 'yes',
    includeCarerElement: 'yes',
    includePartnerCarerElement: 'yes',
    
    // Capital and other income
    hasSavingsOver6000: 'no',
    savings: 0,
    otherIncome: 0,
    otherBenefits: 0,
    hasOtherBenefits: 'no',
    otherBenefitsList: [],
    
    // Partner capital and other income
    partnerSavings: 0,
    partnerOtherIncome: 0,
    partnerOtherBenefits: 0
  });

  const [results, setResults] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Initialize calculator
  useEffect(() => {
    const initCalculator = async () => {
      try {
        const calc = new UniversalCreditCalculator();
        await calc.initialize();
        setCalculator(calc);
      } catch (error) {
        console.error('Failed to initialize calculator:', error);
      }
    };
    
    initCalculator();
  }, []);

  // Load saved scenarios on component mount
  useEffect(() => {
    const saved = localStorage.getItem('ucSavedScenarios');
    if (saved) {
      try {
        const parsedScenarios = JSON.parse(saved);
        setSavedScenarios(parsedScenarios);
        // Show saved scenarios section if there are existing scenarios
        if (parsedScenarios.length > 0) {
          setShowSavedScenarios(true);
        }
      } catch (error) {
        console.error('Failed to load saved scenarios:', error);
      }
    }
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    if (!calculator) {
      console.error('Calculator not initialized');
      return;
    }

    setLoading(true);
    try {
      const result = await calculator.calculate(formData);
      setResults(result);
      setShowResults(true);
    } catch (error) {
      console.error('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = () => {
    if (!results) return;
    
    const scenario = {
      id: Date.now(),
      name: `Scenario ${savedScenarios.length + 1}`,
      input: { ...formData },
      calculation: { ...results },
      savedAt: new Date().toISOString()
    };
    
    const updatedScenarios = [...savedScenarios, scenario];
    setSavedScenarios(updatedScenarios);
    localStorage.setItem('ucSavedScenarios', JSON.stringify(updatedScenarios));
    
    // Show the saved scenarios section after saving
    setShowSavedScenarios(true);
  };

  const handleReset = () => {
    setFormData({
      taxYear: '2025_26',
      circumstances: 'single',
      age: 25,
      partnerAge: 25,
      children: 0,
      childDisabilities: [],
      childAges: [],
      childGenders: [],
      hasChildren: false,
      housingStatus: 'no_housing_costs',
      tenantType: 'private',
      rent: 0,
      serviceCharges: 0,
      bedrooms: 1,
      area: 'default',
      nonDependants: 0,
      employmentType: 'not_working',
      monthlyEarnings: 0,
      childcareCosts: 0,
      isDisabled: 'no',
      claimsDisabilityBenefits: 'no',
      disabilityBenefitType: '',
      pipDailyLivingRate: 'none',
      pipMobilityRate: 'none',
      dlaCareRate: 'none',
      dlaMobilityRate: 'none',
      aaRate: 'none',
      hasLCWRA: 'no',
      partnerEmploymentType: 'not_working',
      partnerMonthlyEarnings: 0,
      partnerIsDisabled: 'no',
      partnerClaimsDisabilityBenefits: 'no',
      partnerDisabilityBenefitType: '',
      partnerPipDailyLivingRate: 'none',
      partnerPipMobilityRate: 'none',
      partnerDlaCareRate: 'none',
      partnerDlaMobilityRate: 'none',
      partnerAaRate: 'none',
      partnerHasLCWRA: 'no',
      businessIncomeBank: 0,
      businessIncomeCash: 0,
      businessExpensesRent: 0,
      businessExpensesRates: 0,
      businessExpensesUtilities: 0,
      businessExpensesInsurance: 0,
      businessExpensesTelephone: 0,
      businessExpensesMarketing: 0,
      businessExpensesVehicle: 0,
      businessExpensesEquipment: 0,
      businessExpensesPostage: 0,
      businessExpensesTransport: 0,
      businessExpensesProfessional: 0,
      businessTax: 0,
      businessNIC: 0,
      businessPension: 0,
      businessCarMiles: 0,
      businessHomeHours: 0,
      isCarer: 'no',
      isPartnerCarer: 'no',
      currentlyReceivingCarersAllowance: '',
      partnerCurrentlyReceivingCarersAllowance: '',
      caringHours: '',
      partnerCaringHours: '',
      personReceivesBenefits: '',
      partnerPersonReceivesBenefits: '',
      includeCarersAllowance: 'yes',
      includePartnerCarersAllowance: 'yes',
      includeCarerElement: 'yes',
      includePartnerCarerElement: 'yes',
      savings: 0,
      otherIncome: 0,
      otherBenefits: 0,
      partnerSavings: 0,
      partnerOtherIncome: 0,
      partnerOtherBenefits: 0
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
          <Logo />
          <div className="header-text">
            <h1>{getTextValue('Calculator.Header.Title', 'Universal Credit Calculator')}</h1>
            <p className="subtitle">{getTextValue('Calculator.Header.Subtitle', 'Calculate your Universal Credit entitlement for any tax year')}</p>
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
          />
        </div>

        {showSavedScenarios && (
          <SavedScenarios 
            scenarios={savedScenarios}
            onLoadScenario={(scenario) => {
              setFormData(scenario.input);
              setResults(scenario.calculation);
              setShowResults(true);
            }}
            onDeleteScenario={(id) => {
              const updated = savedScenarios.filter(s => s.id !== id);
              setSavedScenarios(updated);
              localStorage.setItem('ucSavedScenarios', JSON.stringify(updated));
            }}
          />
        )}

        {showResults && results && (
          <ResultsSection 
            results={results}
            formData={formData}
            onPrint={handlePrint}
            onExport={handleExport}
          />
        )}

        {/* Admin Panel */}
        <AdminPanel 
          isVisible={showAdminPanel}
          onToggleVisibility={() => setShowAdminPanel(false)}
        />
      </main>

      <footer className="footer">
        <p>&copy; 2024 Universal Credit Calculator. {getTextValue('Calculator.Footer.Disclaimer', 'This calculator is for guidance only and should not be considered as official advice.')}</p>
        <p>{getTextValue('Calculator.Footer.OfficialLink', 'For official Universal Credit information, visit')} <a href="https://www.gov.uk/universal-credit" target="_blank" rel="noopener noreferrer">gov.uk/universal-credit</a></p>
      </footer>

      {loading && <LoadingOverlay />}
    </div>
  );
}

export default CalculatorPage;
