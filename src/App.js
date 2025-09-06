import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CalculatorPage from './components/CalculatorPage';
import SelfEmploymentAccounts from './components/SelfEmploymentAccounts';
import SelfAssessmentTaxForm from './components/SelfAssessmentTaxForm';
import MonthlyProfitTool from './features/monthly-profit/MonthlyProfitTool';
import RehabilitationServices from './components/RehabilitationServices';
import AffordabilityMap from './components/AffordabilityMap';
import HelpGuide from './components/HelpGuide';
import HelpGuideBenefits from './components/HelpGuideBenefits';
import HelpGuideHousing from './components/HelpGuideHousing';
import HelpGuideHealth from './components/HelpGuideHealth';
import BudgetingTool from './features/budgeting-tool/EnhancedBudgetingTool'; // Updated to use enhanced version
import RehabilitationCalculator from './components/RehabilitationCalculator';
import BudgetingToolAdmin from './features/budgeting-tool/BudgetingToolAdmin';
import MinimumIncomeFloor from './components/MinimumIncomeFloor';
import MIFCalculator from './components/MIFCalculator';
import HousingReviewAmounts from './components/HousingReviewAmounts';
import ONSStandardAmounts from './components/ONSStandardAmounts';
import InvoicesAndReceipts from './components/InvoicesAndReceipts';
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
        <Route path="/affordability-map" element={<AffordabilityMap />} />
        <Route path="/help-guide" element={<HelpGuide />} />
        <Route path="/help-guide/benefits" element={<HelpGuideBenefits />} />
        <Route path="/help-guide/housing" element={<HelpGuideHousing />} />
        <Route path="/help-guide/health" element={<HelpGuideHealth />} />
        <Route path="/budgeting-tool" element={<BudgetingTool />} /> {/* Now uses enhanced version */}
        <Route path="/budgeting-tool-admin" element={<BudgetingToolAdmin />} />
        <Route path="/housing-review-amounts" element={<HousingReviewAmounts />} />
        <Route path="/ons-standard-amounts" element={<ONSStandardAmounts />} />
        <Route path="/rehabilitation-calculator" element={<RehabilitationCalculator />} />
        <Route path="/minimum-income-floor" element={<MinimumIncomeFloor />} />
        <Route path="/mif-calculator" element={<MIFCalculator />} />
        <Route path="/self-employment-accounts/invoices-receipts" element={<InvoicesAndReceipts />} />
      </Routes>
    </Router>
  );
}

export default App;
