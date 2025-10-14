import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CalculatorPage from '../../uc-calculator/components/CalculatorPage';
import { applySkinForRoute } from '../../../shared/utils/skinManager';

function RehabilitationCalculatorView() {
  const location = useLocation();
  
  // Apply the rehabilitation skin for this route
  useEffect(() => {
    applySkinForRoute(location.pathname);
  }, [location.pathname]);

  return (
    <CalculatorPage isRehabilitation={true} />
  );
}

export default RehabilitationCalculatorView;
