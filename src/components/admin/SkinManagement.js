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
      borderRadius: '8px',
      padding: '15px',
      margin: '10px 0',
      position: 'relative'
    };
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
                <div className="skin-header" style={{ backgroundColor: skin.headerColor }}>
                  <div className="logo-placeholder" style={{ backgroundColor: skin.primaryColor }}>
                    {skin.name}
                  </div>
                </div>
                <div className="skin-content">
                  <h5 style={{ color: skin.primaryColor }}>Universal Credit Calculator</h5>
                  <p style={{ color: skin.textColor }}>
                    Calculate your Universal Credit entitlement with our comprehensive calculator.
                  </p>
                  <button 
                    className="preview-button"
                    style={{ 
                      backgroundColor: skin.primaryColor,
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Get Started
                  </button>
                </div>
                {currentSkin === skin.key && (
                  <div className="active-indicator">
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
              <strong>EntitledTo:</strong> Default skin with blue color scheme
            </div>
            <div className="info-item">
              <strong>Shaw Trust:</strong> Professional blue and green color scheme
            </div>
            <div className="info-item">
              <strong>Momentic:</strong> Modern purple and amber color scheme
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkinManagement;
