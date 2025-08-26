import React, { useState, useEffect } from 'react';
import { getCurrentSkin, skins } from '../utils/skinManager';

function Logo() {
  const currentSkin = getCurrentSkin();
  const skin = skins[currentSkin];
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const getLogoStyle = () => {
    return {
      backgroundColor: 'transparent',
      color: skin.primaryColor,
      padding: '8px 0',
      borderRadius: '0',
      fontWeight: '700',
      fontSize: '24px',
      textAlign: 'left',
      minWidth: '160px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      boxShadow: 'none',
      textShadow: 'none',
      letterSpacing: '0.5px',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease'
    };
  };

  const getImageLogoStyle = () => {
    return {
      maxHeight: '40px',
      maxWidth: '180px',
      objectFit: 'contain',
      filter: 'none', // No filter - show original colors
      transition: 'all 0.3s ease'
    };
  };

  const handleImageLoad = () => {
    setLogoLoaded(true);
    setLogoError(false);
  };

  const handleImageError = () => {
    setLogoError(true);
    setLogoLoaded(false);
  };

  const getCompanyLogo = () => {
    switch (currentSkin) {
      case 'entitledto':
        return (
          <div style={getLogoStyle()}>
            <img 
              src={skin.logo} 
              alt="EntitledTo Logo" 
              style={getImageLogoStyle()}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!logoLoaded && !logoError && (
              <span style={{ fontSize: '24px', fontWeight: '700', color: skin.primaryColor }}>EntitledTo</span>
            )}
          </div>
        );
      case 'shawTrust':
        return (
          <div style={getLogoStyle()}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: skin.primaryColor }}>Shaw Trust</span>
          </div>
        );
      case 'momentic':
        return (
          <div style={getLogoStyle()}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: skin.primaryColor }}>Momentic</span>
          </div>
        );
      default:
        return (
          <div style={getLogoStyle()}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: skin.primaryColor }}>EntitledTo</span>
          </div>
        );
    }
  };

  // Reset logo state when skin changes
  useEffect(() => {
    setLogoLoaded(false);
    setLogoError(false);
  }, [currentSkin]);

  return (
    <div className="logo-container">
      {getCompanyLogo()}
    </div>
  );
}

export default Logo;
