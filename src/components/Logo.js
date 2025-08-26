import React from 'react';
import { getCurrentSkin, skins } from '../utils/skinManager';

function Logo() {
  const currentSkin = getCurrentSkin();
  const skin = skins[currentSkin];

  return (
    <div className="logo-container">
      <div 
        className="logo-placeholder"
        style={{ 
          backgroundColor: skin.primaryColor,
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '18px',
          textAlign: 'center',
          minWidth: '140px'
        }}
      >
        {skin.name}
      </div>
    </div>
  );
}

export default Logo;
