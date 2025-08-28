import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalculatorPage from './components/CalculatorPage';
import SelfEmploymentAccounts from './components/SelfEmploymentAccounts';
import SelfAssessmentTaxForm from './components/SelfAssessmentTaxForm';
import MonthlyProfitTool from './features/monthly-profit/MonthlyProfitTool';
import { initializeSkin } from './utils/skinManager';

function App() {
  // Initialize skin system
  useEffect(() => {
    initializeSkin();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/self-employment-accounts" element={<SelfEmploymentAccounts />} />
        <Route path="/self-assessment-tax-form" element={<SelfAssessmentTaxForm />} />
        <Route path="/monthly-profit" element={<MonthlyProfitTool />} />
      </Routes>
    </Router>
  );
}

export default App;
