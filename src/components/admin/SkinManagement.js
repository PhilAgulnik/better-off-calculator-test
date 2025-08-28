import React, { useState, useEffect } from 'react';
import { getCurrentSkin, setCurrentSkin, getAvailableSkins } from '../../utils/skinManager';
import './SkinManagement.css';

function SkinManagement() {
  const [currentSkin, setCurrentSkinState] = useState('entitledto');
  const [availableSkins, setAvailableSkins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load current skin and available skins
    const current = getCurrentSkin();
    setCurrentSkinState(current);
    setAvailableSkins(getAvailableSkins());
  }, []);

  const handleSkinChange = (skinKey) => {
    setIsLoading(true);
    
    // Set the new skin
    setCurrentSkin(skinKey);
    setCurrentSkinState(skinKey);
    
    // Show success message
    setTimeout(() => {
      setIsLoading(false);
      alert(`Skin changed to ${availableSkins.find(skin => skin.key === skinKey)?.name}`);
    }, 500);
  };

  const getSkinPreviewStyle = (skin) => {
    return {
      backgroundColor: skin.backgroundColor,
      color: skin.textColor,
      border: `2px solid ${skin.borderColor}`,
      borderRadius: '12px',
      padding: '0',
      margin: '10px 0',
      position: 'relative',
      overflow: 'hidden'
    };
  };

  const LogoComponent = ({ skin }) => {
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const handleImageLoad = () => {
      setLogoLoaded(true);
      setLogoError(false);
    };

    const handleImageError = () => {
      setLogoError(true);
      setLogoLoaded(false);
    };

              const getImageLogoStyle = () => {
        return {
          maxHeight: '35px',
          maxWidth: '140px',
          objectFit: 'contain',
          filter: 'none', // No filter - show original colors
          transition: 'all 0.3s ease'
        };
      };

    return (
      <div className="logo-display">
                          <div 
            className="logo-container"
            style={{ 
              backgroundColor: 'transparent',
              padding: '8px 0',
              borderRadius: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              minHeight: '50px'
            }}
          >
                     {skin.key === 'entitledto' ? (
             <>
               <img 
                 src={skin.logo} 
                 alt={`${skin.name} Logo`} 
                 style={getImageLogoStyle()}
                 onLoad={handleImageLoad}
                 onError={handleImageError}
               />
                                                                              {!logoLoaded && !logoError && (
                    <div 
                      className="logo-text"
                      style={{
                        color: skin.primaryColor,
                        fontWeight: '700',
                        fontSize: '20px',
                        textAlign: 'left',
                        fontFamily: 'Arial, sans-serif'
                      }}
                    >
                      {skin.name}
                    </div>
                  )}
             </>
           ) : (
             <div 
               className="logo-text"
               style={{
                 color: '#ffffff',
                 fontWeight: '700',
                 fontSize: '20px',
                 textAlign: 'center',
                 fontFamily: 'Arial, sans-serif'
               }}
             >
               {skin.name}
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="skin-management">
      <div className="admin-section">
        <h3>Choose Skin</h3>
        <p>Select a skin to customize the appearance of the calculator. Each skin includes different colors and branding.</p>
        
        <div className="skin-selector">
          <label htmlFor="skin-select" className="form-label">
            Current Skin:
          </label>
          <select
            id="skin-select"
            className="form-control"
            value={currentSkin}
            onChange={(e) => handleSkinChange(e.target.value)}
            disabled={isLoading}
          >
            {availableSkins.map((skin) => (
              <option key={skin.key} value={skin.key}>
                {skin.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading && (
          <div className="loading-message">
            <p>Applying skin...</p>
          </div>
        )}

        <div className="skin-previews">
          <h4>Available Skins</h4>
          <div className="preview-grid">
            {availableSkins.map((skin) => (
              <div
                key={skin.key}
                className={`skin-preview ${currentSkin === skin.key ? 'active' : ''}`}
                style={getSkinPreviewStyle(skin)}
                onClick={() => handleSkinChange(skin.key)}
              >
                <div 
                  className="skin-header" 
                  style={{ 
                    background: `linear-gradient(135deg, rgba(${skin.primaryColorRgb || '59, 130, 246'}, 0.85) 0%, rgba(${skin.primaryHoverRgb || '37, 99, 235'}, 0.85) 100%)`,
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                >
                  <LogoComponent skin={skin} />
                </div>
                <div className="skin-content" style={{ padding: '20px' }}>
                  <h5 style={{ color: skin.primaryColor, marginBottom: '10px' }}>
                    Universal Credit Calculator
                  </h5>
                  <p style={{ color: skin.textColor, marginBottom: '15px' }}>
                    Calculate your Universal Credit entitlement with our comprehensive calculator.
                  </p>
                  <button 
                    className="preview-button"
                    style={{ 
                      backgroundColor: skin.primaryColor,
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Get Started
                  </button>
                </div>
                {currentSkin === skin.key && (
                  <div 
                    className="active-indicator"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: skin.accentColor,
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    ✓ Active
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="skin-info">
          <h4>Skin Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <strong>EntitledTo:</strong> Default skin with professional blue color scheme
            </div>
            <div className="info-item">
              <strong>Shaw Trust:</strong> Professional blue and green color scheme matching Shaw Trust branding
            </div>
            <div className="info-item">
              <strong>Momentic:</strong> Modern purple and amber color scheme for contemporary appeal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkinManagement;
