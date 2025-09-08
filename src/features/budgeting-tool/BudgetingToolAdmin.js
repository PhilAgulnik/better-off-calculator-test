import React, { useState, useEffect } from 'react';
import { 
  loadAdminConfig, 
  saveAdminConfig, 
  // eslint-disable-next-line no-unused-vars
  updateConfig, 
  resetConfig,
  fieldDefinitions 
} from './adminConfigService';
import { householdTypes, getONSData, getDataSourceInfo } from './onsDataService';
import { housingReviewTypes, getHousingReviewAmounts, getHousingReviewDataSourceInfo } from './housingReviewsDataService';

function BudgetingToolAdmin() {
  const [activeTab, setActiveTab] = useState('standard-amounts');
  const [config, setConfig] = useState(loadAdminConfig());
  const [selectedHouseholdType, setSelectedHouseholdType] = useState(config.standardAmounts.selectedHouseholdType);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setConfig(loadAdminConfig());
  }, []);

  const handleConfigChange = (section, key, value) => {
    const newConfig = { ...config };
    newConfig[section][key] = value;
    setConfig(newConfig);
    saveAdminConfig(newConfig);
  };

  const handleStandardAmountsToggle = (enabled) => {
    handleConfigChange('standardAmounts', 'enabled', enabled);
  };

  const handleSourceChange = (source) => {
    handleConfigChange('standardAmounts', 'source', source);
  };

  const handleHouseholdTypeChange = (householdType) => {
    setSelectedHouseholdType(householdType);
    handleConfigChange('standardAmounts', 'selectedHouseholdType', householdType);
  };

  const handleCompulsoryFieldToggle = (fieldName, value) => {
    handleConfigChange('compulsoryFields', fieldName, value);
  };

  const handleReset = () => {
    resetConfig();
    setConfig(loadAdminConfig());
    setShowResetConfirm(false);
  };

  const getONSDataPreview = () => {
    if (config.standardAmounts.source === 'ons') {
      return getONSData(selectedHouseholdType);
    }
    return null;
  };

  const getHousingReviewDataPreview = () => {
    if (config.standardAmounts.source === 'housing-reviews') {
      return getHousingReviewAmounts(selectedHouseholdType);
    }
    return null;
  };

  const dataSourceInfo = getDataSourceInfo();
  const housingReviewDataSourceInfo = getHousingReviewDataSourceInfo();

  return (
    <div className="budgeting-tool-admin">
      <div className="admin-header">
        <h1>Budgeting Tool Admin Panel</h1>
        <p>Configure the budgeting tool settings and pre-fill options</p>
        
        <div className="admin-navigation">
          <a href="/budgeting-tool" className="nav-link">
            ← Back to Budgeting Tool
          </a>
          <a href="/ons-standard-amounts" className="nav-link" target="_blank" rel="noopener noreferrer">
            View ONS Standard Amounts
          </a>
          <a href="/housing-review-amounts" className="nav-link" target="_blank" rel="noopener noreferrer">
            View Housing Review Amounts
          </a>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'standard-amounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('standard-amounts')}
        >
          Standard Amounts
        </button>
        <button 
          className={`tab-button ${activeTab === 'compulsory-fields' ? 'active' : ''}`}
          onClick={() => setActiveTab('compulsory-fields')}
        >
          Compulsory Fields
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'standard-amounts' && (
          <div className="standard-amounts-tab">
            <div className="config-section">
              <h2>Standard Amounts Configuration</h2>
              
              <div className="config-item">
                <label className="config-label">
                  <input
                    type="checkbox"
                    checked={config.standardAmounts.enabled}
                    onChange={(e) => handleStandardAmountsToggle(e.target.checked)}
                  />
                  Enable Standard Amounts Pre-fill
                </label>
                <p className="config-description">
                  When enabled, users can pre-fill their budget with standard amounts based on their household type.
                </p>
              </div>

              {config.standardAmounts.enabled && (
                <>
                  <div className="config-item">
                    <label className="config-label">Data Source:</label>
                    <div className="radio-group-with-links">
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name="source"
                            value="ons"
                            checked={config.standardAmounts.source === 'ons'}
                            onChange={(e) => handleSourceChange(e.target.value)}
                          />
                          ONS Standard Amounts
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="source"
                            value="housing-reviews"
                            checked={config.standardAmounts.source === 'housing-reviews'}
                            onChange={(e) => handleSourceChange(e.target.value)}
                          />
                          Housing Reviews Standard Amounts
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="source"
                            value="bespoke"
                            checked={config.standardAmounts.source === 'bespoke'}
                            onChange={(e) => handleSourceChange(e.target.value)}
                          />
                          Bespoke Standard Amounts
                        </label>
                      </div>
                      {config.standardAmounts.enabled && (
                        <div className="source-links">
                          <a href="/ons-standard-amounts" className="source-link" target="_blank" rel="noopener noreferrer">
                            See all ONS standard amounts
                          </a>
                          <a href="/housing-review-amounts" className="source-link" target="_blank" rel="noopener noreferrer">
                            See all Housing Review standard amounts
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {(config.standardAmounts.source === 'ons' || config.standardAmounts.source === 'housing-reviews') && (
                    <div className="config-item">
                      <label className="config-label">Default Household Type:</label>
                      <select
                        value={selectedHouseholdType}
                        onChange={(e) => handleHouseholdTypeChange(e.target.value)}
                        className="form-control"
                      >
                        {config.standardAmounts.source === 'ons' 
                          ? Object.entries(householdTypes).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))
                          : Object.entries(housingReviewTypes).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))
                        }
                      </select>
                    </div>
                  )}

                  {config.standardAmounts.source === 'housing-reviews' && (
                    <div className="data-preview">
                      <h3>Housing Reviews Data Preview</h3>
                      <div className="data-source-info">
                        <p><strong>Source:</strong> {housingReviewDataSourceInfo.name}</p>
                        <p><strong>Description:</strong> {housingReviewDataSourceInfo.description}</p>
                        <p><strong>Based on:</strong> {housingReviewDataSourceInfo.source}</p>
                        <p><strong>Last Updated:</strong> {housingReviewDataSourceInfo.lastUpdated}</p>
                        <p><strong>Note:</strong> {housingReviewDataSourceInfo.note}</p>
                      </div>
                      
                      <div className="amounts-preview">
                        <h4>Standard Amounts for {housingReviewTypes[selectedHouseholdType]}</h4>
                        <div className="amounts-grid">
                          {getHousingReviewDataPreview() && Object.entries(getHousingReviewDataPreview()).map(([category, amount]) => (
                            <div key={category} className="amount-item">
                              <span className="amount-label">{fieldDefinitions[category]?.label || category}:</span>
                              <span className="amount-value">
                                {category === 'rent' ? '30% of monthly income' : `£${amount}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {config.standardAmounts.source === 'bespoke' && (
                    <div className="info-box">
                      <h3>Bespoke Standard Amounts</h3>
                      <p>Functionality coming soon. This will allow administrators to set custom standard amounts.</p>
                    </div>
                  )}

                  {config.standardAmounts.source === 'ons' && (
                    <div className="data-preview">
                      <h3>ONS Data Preview</h3>
                      <div className="data-source-info">
                        <p><strong>Source:</strong> {dataSourceInfo.source}</p>
                        <p><strong>Publication:</strong> {dataSourceInfo.publication}</p>
                        <p><strong>Last Updated:</strong> {dataSourceInfo.lastUpdated}</p>
                        <p><strong>Disclaimer:</strong> {dataSourceInfo.disclaimer}</p>
                      </div>
                      
                      <div className="amounts-preview">
                        <h4>Standard Amounts for {householdTypes[selectedHouseholdType]}</h4>
                        <div className="amounts-grid">
                          {getONSDataPreview() && Object.entries(getONSDataPreview()).map(([category, amount]) => (
                            <div key={category} className="amount-item">
                              <span className="amount-label">{fieldDefinitions[category]?.label || category}:</span>
                              <span className="amount-value">£{amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'compulsory-fields' && (
          <div className="compulsory-fields-tab">
            <div className="config-section">
              <h2>Compulsory Fields Configuration</h2>
              <p>Select which fields should be compulsory for users. Compulsory fields will be marked with an asterisk (*) and show an error message if left empty.</p>

              <div className="fields-section">
                <h3>Income Fields</h3>
                <div className="fields-grid">
                  {Object.entries(fieldDefinitions)
                    .filter(([key, def]) => def.category === 'income')
                    .map(([fieldName, fieldDef]) => (
                      <div key={fieldName} className="field-item">
                        <label className="field-label">
                          <input
                            type="checkbox"
                            checked={config.compulsoryFields[fieldName]}
                            onChange={(e) => handleCompulsoryFieldToggle(fieldName, e.target.checked)}
                          />
                          {fieldDef.label}
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              <div className="fields-section">
                <h3>Outgoing Fields</h3>
                <div className="fields-grid">
                  {Object.entries(fieldDefinitions)
                    .filter(([key, def]) => def.category === 'outgoing')
                    .map(([fieldName, fieldDef]) => (
                      <div key={fieldName} className="field-item">
                        <label className="field-label">
                          <input
                            type="checkbox"
                            checked={config.compulsoryFields[fieldName]}
                            onChange={(e) => handleCompulsoryFieldToggle(fieldName, e.target.checked)}
                          />
                          {fieldDef.label}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-actions">
        <button 
          className="btn btn-primary"
          onClick={() => {
            // Force save current config
            saveAdminConfig(config);
            alert('Configuration saved successfully!');
          }}
        >
          Save Configuration
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowResetConfirm(true)}
        >
          Reset to Defaults
        </button>
      </div>

      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reset Configuration</h3>
            <p>Are you sure you want to reset all configuration to default values? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-danger"
                onClick={handleReset}
              >
                Reset
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetingToolAdmin;
