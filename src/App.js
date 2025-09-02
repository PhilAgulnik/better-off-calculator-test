import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CalculatorPage from './components/CalculatorPage';
import SelfEmploymentAccounts from './components/SelfEmploymentAccounts';
import SelfAssessmentTaxForm from './components/SelfAssessmentTaxForm';
import MonthlyProfitTool from './features/monthly-profit/MonthlyProfitTool';
import RehabilitationServices from './components/RehabilitationServices';
import BudgetingTool from './features/budgeting-tool/EnhancedBudgetingTool'; // Updated to use enhanced version
import RehabilitationCalculator from './components/RehabilitationCalculator';
import BudgetingToolAdmin from './features/budgeting-tool/BudgetingToolAdmin';
import MinimumIncomeFloor from './components/MinimumIncomeFloor';
import MIFCalculator from './components/MIFCalculator';
import { initializeSkin, applySkinForRoute } from './utils/skinManager';

// Component to handle route changes and apply skins
function RouteHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // Apply skin for the current route
    applySkinForRoute(location.pathname);
  }, [location.pathname]);
  
  return null;
}

function App() {
  useEffect(() => {
    initializeSkin();
  }, []);

  return (
    <Router>
      <RouteHandler />
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/self-employment-accounts" element={<SelfEmploymentAccounts />} />
        <Route path="/self-assessment-tax-form" element={<SelfAssessmentTaxForm />} />
        <Route path="/monthly-profit" element={<MonthlyProfitTool />} />
        <Route path="/rehabilitation-services" element={<RehabilitationServices />} />
        <Route path="/budgeting-tool" element={<BudgetingTool />} /> {/* Now uses enhanced version */}
        <Route path="/budgeting-tool-admin" element={<BudgetingToolAdmin />} />
        <Route path="/rehabilitation-calculator" element={<RehabilitationCalculator />} />
        <Route path="/minimum-income-floor" element={<MinimumIncomeFloor />} />
        <Route path="/mif-calculator" element={<MIFCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
