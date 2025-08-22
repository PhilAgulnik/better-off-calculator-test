import React, { useState } from 'react';
import TextManagement from './admin/TextManagement';
import './admin/AdminPanel.css';

function AdminPanel({ isVisible = false, onToggleVisibility }) {
  const [activeTab, setActiveTab] = useState('text-management');
  const [editorName, setEditorName] = useState('');

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
      </div>

      <div className="admin-content">
        {activeTab === 'text-management' && (
          <TextManagement editorName={editorName} setEditorName={setEditorName} />
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
      </div>
    </div>
  );
}

export default AdminPanel;
