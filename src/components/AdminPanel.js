import React, { useState, useEffect } from 'react';
import TextManagement from './admin/TextManagement';
import SkinManagement from './admin/SkinManagement';
import TestingModule from './TestingModule';
import { 
  getAvailableSkins, 
  getCurrentSkin, 
  setCurrentSkin, 
  getRouteSkins, 
  setSkinForRoute, 
  resetRouteSkins,
  applySkinForRoute 
} from '../utils/skinManager';
import './admin/AdminPanel.css';

function AdminPanel({ isVisible = false, onToggleVisibility, currentRoute }) {
  const [activeTab, setActiveTab] = useState('text-management');
  const [editorName, setEditorName] = useState('');
  const [testFile, setTestFile] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableSkins, setAvailableSkins] = useState([]);
  const [currentSkin, setCurrentSkinState] = useState('');
  const [routeSkins, setRouteSkinsState] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(currentRoute || '/');
  const [selectedSkinForRoute, setSelectedSkinForRoute] = useState('');

  useEffect(() => {
    // Load available skins and current state
    const skins = getAvailableSkins();
    setAvailableSkins(skins);
    
    const current = getCurrentSkin();
    setCurrentSkinState(current);
    
    const routes = getRouteSkins();
    setRouteSkinsState(routes);
    
    // Set selected skin for current route
    if (routes[currentRoute]) {
      setSelectedSkinForRoute(routes[currentRoute]);
    }
  }, [currentRoute]);

  const handleGlobalSkinChange = (skinName) => {
    if (setCurrentSkin(skinName)) {
      setCurrentSkinState(skinName);
      // Apply the skin immediately
      applySkinForRoute(currentRoute);
    }
  };

  const handleRouteSkinChange = (route, skinName) => {
    if (setSkinForRoute(route, skinName)) {
      // Update local state
      setRouteSkinsState(prev => ({
        ...prev,
        [route]: skinName
      }));
      
      // If this is the current route, apply the skin immediately
      if (route === currentRoute) {
        applySkinForRoute(route);
      }
    }
  };

  const handleResetRouteSkins = () => {
    resetRouteSkins();
    const routes = getRouteSkins();
    setRouteSkinsState(routes);
    
    // Apply current route skin
    applySkinForRoute(currentRoute);
  };

  const availableRoutes = [
    { path: '/', name: 'Main Calculator' },
    { path: '/rehabilitation-calculator', name: 'Rehabilitation Calculator' }
  ];

  if (!isVisible) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Administration</h2>
        <button 
          type="button" 
          className="btn btn-outline btn-sm"
          onClick={onToggleVisibility}
        >
          Close Admin Panel
        </button>
      </div>

      <div className="admin-description">
        <p>Use the administration panel to manage calculator settings and content. You can view and edit text within the calculator, manage calculation parameters, and control how the calculator works.</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'text-management' ? 'active' : ''}`}
          onClick={() => setActiveTab('text-management')}
        >
          Text Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'skin-management' ? 'active' : ''}`}
          onClick={() => setActiveTab('skin-management')}
        >
          Choose Skin
        </button>
        <button 
          className={`tab-button ${activeTab === 'route-skins' ? 'active' : ''}`}
          onClick={() => setActiveTab('route-skins')}
        >
          Route-Specific Skins
        </button>
        <button 
          className={`tab-button ${activeTab === 'calculator-settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator-settings')}
        >
          Calculator Settings
        </button>
        <button 
          className={`tab-button ${activeTab === 'rates-management' ? 'active' : ''}`}
          onClick={() => setActiveTab('rates-management')}
        >
          Rates Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'testing-module' ? 'active' : ''}`}
          onClick={() => setActiveTab('testing-module')}
        >
          Testing Module
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'text-management' && (
          <TextManagement editorName={editorName} setEditorName={setEditorName} />
        )}
        {activeTab === 'skin-management' && (
          <SkinManagement />
        )}
        {activeTab === 'route-skins' && (
          <div className="admin-section">
            <h3>Route-Specific Skin Selection</h3>
            <p>Set different skins for specific pages. These will override the global skin.</p>
            
            <div className="route-skin-controls">
              <div className="route-selector">
                <label htmlFor="routeSelect">Select Route:</label>
                <select 
                  id="routeSelect"
                  value={selectedRoute}
                  onChange={(e) => {
                    setSelectedRoute(e.target.value);
                    setSelectedSkinForRoute(routeSkins[e.target.value] || '');
                  }}
                >
                  {availableRoutes.map(route => (
                    <option key={route.path} value={route.path}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="skin-selector">
                <label htmlFor="skinSelect">Select Skin:</label>
                <select 
                  id="skinSelect"
                  value={selectedSkinForRoute}
                  onChange={(e) => {
                    setSelectedSkinForRoute(e.target.value);
                    handleRouteSkinChange(selectedRoute, e.target.value);
                  }}
                >
                  <option value="">Use Global Skin</option>
                  {availableSkins.map(skin => (
                    <option key={skin.key} value={skin.key}>
                      {skin.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="current-route-skins">
              <h4>Current Route Skin Settings:</h4>
              <div className="route-skin-list">
                {availableRoutes.map(route => (
                  <div key={route.path} className="route-skin-item">
                    <span className="route-name">{route.name}:</span>
                    <span className="route-skin">
                      {routeSkins[route.path] ? (
                        <>
                          <span className="skin-logo">{availableSkins.find(s => s.key === routeSkins[route.path])?.logo}</span>
                          <span>{availableSkins.find(s => s.key === routeSkins[route.path])?.name}</span>
                        </>
                      ) : (
                        <span className="global-skin">Global Skin</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleResetRouteSkins}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
        {activeTab === 'calculator-settings' && (
          <div className="admin-section">
            <h3>Calculator Settings</h3>
            <p>Calculator settings management will be implemented here.</p>
          </div>
        )}
        {activeTab === 'rates-management' && (
          <div className="admin-section">
            <h3>Rates Management</h3>
            <p>Rates management will be implemented here.</p>
          </div>
        )}
        {activeTab === 'testing-module' && (
          <TestingModule 
            isVisible={true}
            onToggleVisibility={() => setActiveTab('text-management')}
            testFile={testFile}
            setTestFile={setTestFile}
            testResults={testResults}
            setTestResults={setTestResults}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
