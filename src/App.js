import React, { useState, useEffect } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsSection from './components/ResultsSection';
import SavedScenarios from './components/SavedScenarios';
import LoadingOverlay from './components/LoadingOverlay';
import AdminPanel from './components/AdminPanel';
import TestingModule from './components/TestingModule';
import { UniversalCreditCalculator } from './utils/calculator';
import { useTextManager } from './hooks/useTextManager';
import { initializeSkin } from './utils/skinManager';
import Logo from './components/Logo';
// import { formatCurrency } from './utils/formatters';

function App() {
  const { getTextValue } = useTextManager();
  const [calculator, setCalculator] = useState(null);
  
  // Initialize skin system
  useEffect(() => {
    initializeSkin();
  }, []);
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
    isCarer: '',
    isPartnerCarer: '',
    currentlyReceivingCarersAllowance: '',
    partnerCurrentlyReceivingCarersAllowance: '',
    caringHours: '',
    partnerCaringHours: '',
    personReceivesBenefits: '',
    partnerPersonReceivesBenefits: '',
    includeCarersAllowance: 'yes',
    partnerIncludeCarersAllowance: 'yes',
    includeCarerElement: 'yes',
    partnerIncludeCarerElement: 'yes',
    
    // Other
    savings: 0,
    otherBenefits: 0,
    otherBenefitsPeriod: 'monthly'
  });
  
  const [results, setResults] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showTestingModule, setShowTestingModule] = useState(false);

  useEffect(() => {
    // Initialize calculator
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
    
    // Load saved scenarios from localStorage
    const saved = localStorage.getItem('ucSavedScenarios');
    if (saved) {
      try {
        setSavedScenarios(JSON.parse(saved));
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
    if (!calculator) return;
    
    setLoading(true);
    try {
      const result = await calculator.calculate(formData);
      setResults(result);
      setShowResults(true);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('An error occurred during calculation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = () => {
    if (!results) return;
    
    const scenarioName = prompt('Enter a name for this scenario:');
    if (!scenarioName) return;
    
    const scenario = {
      id: Date.now(),
      name: scenarioName,
      input: formData,
      calculation: results,
      taxYear: results.taxYear,
      savedAt: new Date().toISOString()
    };
    
    const updatedScenarios = [...savedScenarios, scenario];
    setSavedScenarios(updatedScenarios);
    localStorage.setItem('ucSavedScenarios', JSON.stringify(updatedScenarios));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
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
        isCarer: '',
        isPartnerCarer: '',
        currentlyReceivingCarersAllowance: '',
        partnerCurrentlyReceivingCarersAllowance: '',
        caringHours: '',
        partnerCaringHours: '',
        personReceivesBenefits: '',
        partnerPersonReceivesBenefits: '',
        includeCarersAllowance: 'yes',
        partnerIncludeCarersAllowance: 'yes',
        includeCarerElement: 'yes',
        partnerIncludeCarerElement: 'yes',
        savings: 0,
        otherBenefits: 0,
        otherBenefitsPeriod: 'monthly'
      });
      setResults(null);
      setShowResults(false);
    }
  };

  const handlePrint = () => {
    if (!results) return;
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
            <button 
              type="button" 
              className="btn btn-outline btn-sm testing-toggle"
              onClick={() => setShowTestingModule(!showTestingModule)}
            >
              {showTestingModule ? 'Hide Testing' : 'Testing Module'}
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

        {showResults && results && (
          <ResultsSection 
            results={results}
            onPrint={handlePrint}
            onExport={handleExport}
          />
        )}

        {/* Admin Panel */}
        <AdminPanel 
          isVisible={showAdminPanel}
          onToggleVisibility={() => setShowAdminPanel(false)}
        />

        {/* Testing Module */}
        <TestingModule 
          isVisible={showTestingModule}
          onToggleVisibility={() => setShowTestingModule(false)}
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

export default App;
