import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CalculatorPage from '../../uc-calculator/components/CalculatorPage';
import { applySkinForRoute } from '../../../shared/utils/skinManager';

function SelfEmploymentIncomeMaximisation() {
  const location = useLocation();
  
  // Apply the self-employment skin for this route
  useEffect(() => {
    applySkinForRoute(location.pathname);
  }, [location.pathname]);

  return (
    <CalculatorPage isSelfEmployment={true} />
  );
}

export default SelfEmploymentIncomeMaximisation;