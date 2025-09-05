import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Navigation({ showRelatedTools = true }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation structure
  const navigationStructure = {
    main: [
      { path: '/', label: 'Universal Credit Calculator', icon: '🏠' },
      { path: '/rehabilitation-services', label: 'Rehabilitation Services', icon: '🔄' },
      { path: '/self-employment-accounts', label: 'Self-Employment Tools', icon: '💼' },
      { path: '/budgeting-tool', label: 'Budgeting Tool', icon: '💰' }
    ],
    rehabilitation: [
      { path: '/', label: 'Income Maximisation', icon: '💵', description: 'Universal Credit Calculator' },
      { path: '/budgeting-tool', label: 'Manage My Finances', icon: '💰', description: 'Budgeting Tool' },
      { path: '/affordability-map', label: 'Finding a Home', icon: '🏠', description: 'Affordability Map' },
      { path: '/help-guide', label: 'Benefits, Housing & Health', icon: '📋', description: 'Guide for Prison Leavers' }
    ],
    selfEmployment: [
      { path: '/monthly-profit', label: 'Monthly Profit Tool', icon: '📊', description: 'Track monthly earnings' },
      { path: '/self-assessment-tax-form', label: 'Self-Assessment Tax', icon: '📝', description: 'Tax form assistance' },
      { path: '/minimum-income-floor', label: 'Minimum Income Floor', icon: '📈', description: 'MIF information' },
      { path: '/mif-calculator', label: 'MIF Calculator', icon: '🧮', description: 'Calculate your MIF' }
    ]
  };

  // Get current section based on path
  const getCurrentSection = () => {
    if (location.pathname.startsWith('/rehabilitation') || 
        location.pathname === '/budgeting-tool' || 
        location.pathname === '/affordability-map' || 
        location.pathname.startsWith('/help-guide')) {
      return 'rehabilitation';
    }
    if (location.pathname.startsWith('/self-employment') || 
        location.pathname === '/monthly-profit' || 
        location.pathname === '/self-assessment-tax-form' || 
        location.pathname.startsWith('/minimum-income-floor') || 
        location.pathname === '/mif-calculator') {
      return 'selfEmployment';
    }
    return 'main';
  };

  // Get breadcrumb path
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/' }];
    
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      switch (firstSegment) {
        case 'rehabilitation-services':
          breadcrumbs.push({ label: 'Rehabilitation Services', path: '/rehabilitation-services' });
          break;
        case 'self-employment-accounts':
          breadcrumbs.push({ label: 'Self-Employment Tools', path: '/self-employment-accounts' });
          break;
        case 'budgeting-tool':
          breadcrumbs.push({ label: 'Rehabilitation Services', path: '/rehabilitation-services' });
          breadcrumbs.push({ label: 'Budgeting Tool', path: '/budgeting-tool' });
          break;
        case 'monthly-profit':
          breadcrumbs.push({ label: 'Self-Employment Tools', path: '/self-employment-accounts' });
          breadcrumbs.push({ label: 'Monthly Profit Tool', path: '/monthly-profit' });
          break;
        case 'minimum-income-floor':
          breadcrumbs.push({ label: 'Self-Employment Tools', path: '/self-employment-accounts' });
          breadcrumbs.push({ label: 'Minimum Income Floor', path: '/minimum-income-floor' });
          break;
        case 'mif-calculator':
          breadcrumbs.push({ label: 'Self-Employment Tools', path: '/self-employment-accounts' });
          breadcrumbs.push({ label: 'MIF Calculator', path: '/mif-calculator' });
          break;
        case 'help-guide':
          breadcrumbs.push({ label: 'Rehabilitation Services', path: '/rehabilitation-services' });
          breadcrumbs.push({ label: 'Benefits, Housing & Health', path: '/help-guide' });
          break;
        case 'affordability-map':
          breadcrumbs.push({ label: 'Rehabilitation Services', path: '/rehabilitation-services' });
          breadcrumbs.push({ label: 'Affordability Map', path: '/affordability-map' });
          break;
      }
    }
    
    return breadcrumbs;
  };

  // Get related tools for current page
  const getRelatedTools = () => {
    const currentPath = location.pathname;
    
    if (currentPath === '/budgeting-tool') {
      return [
        { path: '/', label: 'Universal Credit Calculator', icon: '🏠' },
        { path: '/rehabilitation-services', label: 'Rehabilitation Services', icon: '🔄' },
        { path: '/self-employment-accounts', label: 'Self-Employment Tools', icon: '💼' },
        { path: '/minimum-income-floor', label: 'Minimum Income Floor', icon: '📈' }
      ];
    }
    
    if (currentPath === '/') {
      return [
        { path: '/budgeting-tool', label: 'Budgeting Tool', icon: '💰' },
        { path: '/rehabilitation-services', label: 'Rehabilitation Services', icon: '🔄' },
        { path: '/self-employment-accounts', label: 'Self-Employment Tools', icon: '💼' },
        { path: '/minimum-income-floor', label: 'Minimum Income Floor', icon: '📈' }
      ];
    }
    
    if (currentPath.startsWith('/self-employment') || currentPath === '/monthly-profit' || currentPath === '/minimum-income-floor' || currentPath === '/mif-calculator') {
      return [
        { path: '/', label: 'Universal Credit Calculator', icon: '🏠' },
        { path: '/budgeting-tool', label: 'Budgeting Tool', icon: '💰' },
        { path: '/rehabilitation-services', label: 'Rehabilitation Services', icon: '🔄' },
        { path: '/monthly-profit', label: 'Monthly Profit Tool', icon: '📊' }
      ];
    }
    
    return [];
  };

  const currentSection = getCurrentSection();
  const breadcrumbs = getBreadcrumbs();
  const relatedTools = getRelatedTools();

  return (
    <div className="navigation-system">
      {/* Mobile Menu Toggle */}
      <div className="mobile-menu-toggle">
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={`main-navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-container">
          <div className="nav-section">
            <h3>Main Tools</h3>
            <ul className="nav-list">
              {navigationStructure.main.map((item) => (
                <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                  <a href={item.path} className="nav-item">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Navigation */}
          {currentSection !== 'main' && (
            <div className="nav-section">
              <h3>
                {currentSection === 'rehabilitation' ? 'Rehabilitation Services' : 'Self-Employment Tools'}
              </h3>
              <ul className="nav-list">
                {navigationStructure[currentSection].map((item) => (
                  <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                    <a href={item.path} className="nav-item">
                      <span className="nav-icon">{item.icon}</span>
                      <div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                        {item.description && <span className="nav-description">{item.description}</span>}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="breadcrumbs">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="breadcrumb-item">
                  {index === breadcrumbs.length - 1 ? (
                    <span className="breadcrumb-current">{crumb.label}</span>
                  ) : (
                    <a href={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </a>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="breadcrumb-separator">›</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}

      {/* Related Tools Footer */}
      {showRelatedTools && relatedTools.length > 0 && (
        <div className="related-tools-footer">
          <div className="related-tools-container">
            <h4>Related Tools</h4>
            <div className="related-tools-grid">
              {relatedTools.map((tool) => (
                <a key={tool.path} href={tool.path} className="related-tool-link">
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-label">{tool.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
