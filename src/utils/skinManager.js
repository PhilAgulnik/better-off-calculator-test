// Skin Manager - Handles visual themes and branding
const skins = {
  entitledto: {
    name: 'EntitledTo',
    primaryColor: '#0052CC',
    secondaryColor: '#0747A6',
    backgroundColor: '#F4F5F7',
    textColor: '#172B4D',
    logo: '🏠',
    companyName: 'EntitledTo'
  },
  rehabilitation: {
    name: 'Your logo here',
    primaryColor: '#1e40af',
    secondaryColor: '#1d4ed8',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    logo: '🔄',
    companyName: 'Your logo here'
  },
  shawTrust: {
    name: 'Shaw Trust',
    primaryColor: '#1e3a8a', // Deep blue
    secondaryColor: '#1e40af',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    logo: '🏛️',
    companyName: 'Shaw Trust'
  },
  momentic: {
    name: 'Momentic',
    primaryColor: '#7c3aed', // Purple
    secondaryColor: '#6d28d9',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    logo: '⚡',
    companyName: 'Momentic'
  }
};

// Route-specific skin mappings
let routeSkins = {
  '/': 'entitledto', // Default skin for main calculator
  '/rehabilitation-calculator': 'rehabilitation' // Rehabilitation skin for rehab calculator
};

// Current global skin
let currentSkin = 'entitledto';

// Function to get skin for a specific route
export const getSkinForRoute = (route) => {
  return routeSkins[route] || currentSkin;
};

// Function to set skin for a specific route
export const setSkinForRoute = (route, skinName) => {
  if (skins[skinName]) {
    routeSkins[route] = skinName;
    // Save to localStorage
    localStorage.setItem('routeSkins', JSON.stringify(routeSkins));
    return true;
  }
  return false;
};

// Function to get all available skins
export const getAvailableSkins = () => {
  return Object.keys(skins).map(key => ({
    key,
    ...skins[key]
  }));
};

// Function to get all route skin mappings
export const getRouteSkins = () => {
  return { ...routeSkins };
};

// Function to reset route skins to defaults
export const resetRouteSkins = () => {
  routeSkins = {
    '/': 'entitledto',
    '/rehabilitation-calculator': 'rehabilitation'
  };
  localStorage.setItem('routeSkins', JSON.stringify(routeSkins));
};

// Function to get current global skin
export const getCurrentSkin = () => {
  return currentSkin;
};

// Function to set current global skin
export const setCurrentSkin = (skinName) => {
  if (skins[skinName]) {
    currentSkin = skinName;
    // Save to localStorage
    localStorage.setItem('currentSkin', skinName);
    return true;
  }
  return false;
};

// Function to get skin data by name
export const getSkinData = (skinName) => {
  return skins[skinName] || null;
};

// Function to get current skin data
export const getCurrentSkinData = () => {
  return skins[currentSkin];
};

// Function to get skin data for current route
export const getCurrentRouteSkinData = (route) => {
  const routeSkin = getSkinForRoute(route);
  return skins[routeSkin];
};

// Initialize skins from localStorage
export const initializeSkin = () => {
  try {
    const savedCurrentSkin = localStorage.getItem('currentSkin');
    if (savedCurrentSkin && skins[savedCurrentSkin]) {
      currentSkin = savedCurrentSkin;
    }

    const savedRouteSkins = localStorage.getItem('routeSkins');
    if (savedRouteSkins) {
      const parsed = JSON.parse(savedRouteSkins);
      // Only load valid skin mappings
      Object.keys(parsed).forEach(route => {
        if (skins[parsed[route]]) {
          routeSkins[route] = parsed[route];
        }
      });
    }
  } catch (error) {
    console.warn('Failed to load skins from localStorage:', error);
  }
};

// Apply skin to document
export const applySkin = (skinName) => {
  const skin = skins[skinName];
  if (!skin) return;

  const root = document.documentElement;
  root.style.setProperty('--primary-color', skin.primaryColor);
  root.style.setProperty('--secondary-color', skin.secondaryColor);
  root.style.setProperty('--background-color', skin.backgroundColor);
  root.style.setProperty('--text-color', skin.textColor);
};

// Apply skin for specific route
export const applySkinForRoute = (route) => {
  const routeSkin = getSkinForRoute(route);
  applySkin(routeSkin);
};

// Apply current global skin
export const applyCurrentSkin = () => {
  applySkin(currentSkin);
};
