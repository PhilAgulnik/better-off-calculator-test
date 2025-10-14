import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CalculatorPage from './features/uc-calculator/components/CalculatorPage';
import SelfEmploymentHub from './features/self-employment/components/SelfEmploymentHub';
import SelfAssessmentTaxForm from './features/self-employment/components/SelfAssessmentTaxForm';
import MonthlyProfitTool from './features/self-employment/monthly-profit/MonthlyProfitTool';
import RehabilitationHub from './features/rehabilitation/components/RehabilitationHub';
import AffordabilityMap from './features/uc-calculator/components/AffordabilityMap';
import PrisonLeaversGuide from './features/rehabilitation/components/PrisonLeaversGuide';
import HelpGuideBenefits from './features/help-guides/components/HelpGuideBenefits';
import HelpGuideHousing from './features/help-guides/components/HelpGuideHousing';
import HelpGuideHealth from './features/help-guides/components/HelpGuideHealth';
import ChildBenefitChargeHelp from './features/help-guides/components/ChildBenefitChargeHelp';
import BudgetingTool from './features/budgeting-tool/components/EnhancedBudgetingTool';
import RehabilitationCalculatorView from './features/rehabilitation/components/RehabilitationCalculatorView';
import BudgetingToolAdmin from './features/budgeting-tool/components/BudgetingToolAdmin';
import MIFHelpGuide from './features/self-employment/components/MIFHelpGuide';
import MIFCalculatorTool from './features/self-employment/components/MIFCalculatorTool';
import HousingReviewAmounts from './features/budgeting-tool/components/HousingReviewAmounts';
import ONSStandardAmounts from './features/budgeting-tool/components/ONSStandardAmounts';
import InvoicesAndReceipts from './features/self-employment/components/InvoicesAndReceipts';
import SelfEmploymentIncomeMaximisation from './features/self-employment/components/SelfEmploymentIncomeMaximisation';
import PasswordProtection from './shared/components/PasswordProtection';
import { initializeSkin, applySkinForRoute } from './shared/utils/skinManager';

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
