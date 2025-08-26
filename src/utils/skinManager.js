// Skin Manager for white-labeling the Universal Credit Calculator
export const skins = {
  entitledto: {
    name: 'EntitledTo',
    logo: '/logos/entitledto-logo.png',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    accentColor: '#28a745',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    headerColor: '#f8f9fa',
    borderColor: '#dee2e6'
  },
  shawTrust: {
    name: 'Shaw Trust',
    logo: '/logos/shawtrust-logo.png',
    primaryColor: '#1e3a8a', // Blue
    secondaryColor: '#64748b', // Slate
    accentColor: '#059669', // Green
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    headerColor: '#f1f5f9',
    borderColor: '#cbd5e1'
  },
  momentic: {
    name: 'Momentic',
    logo: '/logos/momentic-logo.png',
    primaryColor: '#7c3aed', // Purple
    secondaryColor: '#6b7280', // Gray
    accentColor: '#f59e0b', // Amber
    backgroundColor: '#ffffff',
    textColor: '#374151',
    headerColor: '#f9fafb',
    borderColor: '#d1d5db'
  }
};

// Get current skin from localStorage or default to entitledto
export const getCurrentSkin = () => {
  const savedSkin = localStorage.getItem('calculator-skin');
  return savedSkin && skins[savedSkin] ? savedSkin : 'entitledto';
};

// Set current skin
export const setCurrentSkin = (skinName) => {
  if (skins[skinName]) {
    localStorage.setItem('calculator-skin', skinName);
    applySkin(skinName);
  }
};

// Apply skin to the document
export const applySkin = (skinName) => {
  const skin = skins[skinName];
  if (!skin) return;

  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--primary-color', skin.primaryColor);
  root.style.setProperty('--secondary-color', skin.secondaryColor);
  root.style.setProperty('--accent-color', skin.accentColor);
  root.style.setProperty('--background-color', skin.backgroundColor);
  root.style.setProperty('--text-color', skin.textColor);
  root.style.setProperty('--header-color', skin.headerColor);
  root.style.setProperty('--border-color', skin.borderColor);
};

// Initialize skin on app load
export const initializeSkin = () => {
  const currentSkin = getCurrentSkin();
  applySkin(currentSkin);
  return currentSkin;
};

// Get all available skins
export const getAvailableSkins = () => {
  return Object.keys(skins).map(key => ({
    key,
    ...skins[key]
  }));
};
