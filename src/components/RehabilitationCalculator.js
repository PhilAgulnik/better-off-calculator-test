import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CalculatorPage from './CalculatorPage';
import { applySkinForRoute } from '../utils/skinManager';

function RehabilitationCalculator() {
  const location = useLocation();
  
  // Apply the rehabilitation skin for this route
  useEffect(() => {
    applySkinForRoute(location.pathname);
  }, [location.pathname]);

  return (
    <CalculatorPage isRehabilitation={true} />
  );
}

export default RehabilitationCalculator;
