// Enhanced Skin Manager for white-labeling the Universal Credit Calculator
export const skins = {
  entitledto: {
    name: 'EntitledTo',
    logo: '/logos/entitledto-logo.png',
    primaryColor: '#3b82f6', // Lighter blue to match logo
    primaryHover: '#2563eb',
    primaryColorRgb: '59, 130, 246',
    primaryHoverRgb: '37, 99, 235',
    secondaryColor: '#64748b',
    accentColor: '#059669', // Green accent
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    headerColor: '#f8fafc',
    borderColor: '#e2e8f0',
    gradientStart: '#3b82f6',
    gradientEnd: '#60a5fa'
  },
  shawTrust: {
    name: 'Shaw Trust',
    logo: '/logos/shawtrust-logo.svg',
    primaryColor: '#1e3a8a', // Deep blue
    primaryHover: '#1e40af',
    primaryColorRgb: '30, 58, 138',
    primaryHoverRgb: '30, 64, 175',
    secondaryColor: '#64748b', // Slate
    accentColor: '#059669', // Green
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    headerColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    gradientStart: '#1e3a8a',
    gradientEnd: '#059669'
  },
  momentic: {
    name: 'Momentic',
    logo: '/logos/momentic-logo.svg',
    primaryColor: '#7c3aed', // Purple
    primaryHover: '#6d28d9',
    primaryColorRgb: '124, 58, 237',
    primaryHoverRgb: '109, 40, 217',
    secondaryColor: '#6b7280', // Gray
    accentColor: '#f59e0b', // Amber
    backgroundColor: '#ffffff',
    textColor: '#374151',
    headerColor: '#f9fafb',
    borderColor: '#d1d5db',
    gradientStart: '#7c3aed',
    gradientEnd: '#f59e0b'
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
  root.style.setProperty('--primary-hover', skin.primaryHover);
  root.style.setProperty('--primary-color-rgb', skin.primaryColorRgb || '59, 130, 246');
  root.style.setProperty('--primary-hover-rgb', skin.primaryHoverRgb || '37, 99, 235');
  root.style.setProperty('--secondary-color', skin.secondaryColor);
  root.style.setProperty('--accent-color', skin.accentColor);
  root.style.setProperty('--background-color', skin.backgroundColor);
  root.style.setProperty('--text-color', skin.textColor);
  root.style.setProperty('--header-color', skin.headerColor);
  root.style.setProperty('--border-color', skin.borderColor);
  root.style.setProperty('--gradient-start', skin.gradientStart);
  root.style.setProperty('--gradient-end', skin.gradientEnd);
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
