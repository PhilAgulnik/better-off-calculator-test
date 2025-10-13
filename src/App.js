import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CalculatorPage from './components/CalculatorPage';
import SelfEmploymentHub from './components/SelfEmploymentHub';
import SelfAssessmentTaxForm from './components/SelfAssessmentTaxForm';
import MonthlyProfitTool from './features/monthly-profit/MonthlyProfitTool';
import RehabilitationHub from './components/RehabilitationHub';
import AffordabilityMap from './components/AffordabilityMap';
import PrisonLeaversGuide from './components/PrisonLeaversGuide';
import HelpGuideBenefits from './components/HelpGuideBenefits';
import HelpGuideHousing from './components/HelpGuideHousing';
import HelpGuideHealth from './components/HelpGuideHealth';
import ChildBenefitChargeHelp from './components/ChildBenefitChargeHelp';
import BudgetingTool from './features/budgeting-tool/EnhancedBudgetingTool';
import RehabilitationCalculatorView from './components/RehabilitationCalculatorView';
import BudgetingToolAdmin from './features/budgeting-tool/BudgetingToolAdmin';
import MIFHelpGuide from './components/MIFHelpGuide';
import MIFCalculatorTool from './components/MIFCalculatorTool';
import HousingReviewAmounts from './components/HousingReviewAmounts';
import ONSStandardAmounts from './components/ONSStandardAmounts';
import InvoicesAndReceipts from './components/InvoicesAndReceipts';
import SelfEmploymentIncomeMaximisation from './components/SelfEmploymentIncomeMaximisation';
import PasswordProtection from './components/PasswordProtection';
import { initializeSkin, applySkinForRoute } from './utils/skinManager';

function RouteHandler() {
  const location = useLocation();

  useEffect(() => {
    applySkinForRoute(location.pathname);
  }, [location.pathname]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeSkin();
    const authenticated = sessionStorage.getItem('authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !isAuthenticated) {
    return <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <RouteHandler />
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/self-employment-accounts" element={<SelfEmploymentHub />} />
        <Route path="/self-assessment-tax-form" element={<SelfAssessmentTaxForm />} />
        <Route path="/monthly-profit" element={<MonthlyProfitTool />} />
        <Route path="/rehabilitation-services" element={<RehabilitationHub />} />
        <Route path="/affordability-map" element={<AffordabilityMap />} />
        <Route path="/help-guide" element={<PrisonLeaversGuide />} />
        <Route path="/help-guide/benefits" element={<HelpGuideBenefits />} />
        <Route path="/help-guide/housing" element={<HelpGuideHousing />} />
        <Route path="/help-guide/health" element={<HelpGuideHealth />} />
        <Route path="/help/child-benefit-charge" element={<ChildBenefitChargeHelp />} />
        <Route path="/budgeting-tool" element={<BudgetingTool />} />
        <Route path="/budgeting-tool-admin" element={<BudgetingToolAdmin />} />
        <Route path="/housing-review-amounts" element={<HousingReviewAmounts />} />
        <Route path="/ons-standard-amounts" element={<ONSStandardAmounts />} />
        <Route path="/rehabilitation-calculator" element={<RehabilitationCalculatorView />} />
        <Route path="/mif-help-guide" element={<MIFHelpGuide />} />
        <Route path="/mif-calculator" element={<MIFCalculatorTool />} />
        <Route path="/self-employment-accounts/invoices-receipts" element={<InvoicesAndReceipts />} />
        <Route path="/self-employment-accounts/income-maximisation" element={<SelfEmploymentIncomeMaximisation />} />
      </Routes>
    </Router>
  );
}

export default App;
