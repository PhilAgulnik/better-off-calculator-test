import React from 'react';
import { getCurrentRouteSkinData } from '../utils/skinManager';

function Logo({ route = '/' }) {
  const skinData = getCurrentRouteSkinData(route);
  
  if (!skinData) {
    return null;
  }

  return (
    <div className="logo">
      <span className="logo-symbol">{skinData.logo}</span>
      <span className="logo-text">{skinData.companyName}</span>
    </div>
  );
}

export default Logo;
