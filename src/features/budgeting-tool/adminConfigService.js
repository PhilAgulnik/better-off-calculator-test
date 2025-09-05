// Admin Configuration Service for Budgeting Tool

// Default configuration
const defaultConfig = {
  standardAmounts: {
    enabled: true,
    source: 'ons', // 'ons', 'housing-reviews', 'bespoke'
    selectedHouseholdType: 'middle-income-decile-5'
  },
  housingReviews: {
    enabled: false,
    selectedHouseholdType: 'single-person'
  },
  compulsoryFields: {
    // Income fields
    wages: false,
    universalCredit: false,
    otherBenefits: false,
    familySupport: false,
    savings: false,
    otherIncome: false,
    // Outgoing fields
    rent: false,
    councilTax: false,
    gasAndElectricity: false,
    water: false,
    broadband: false,
    food: false,
    transport: false,
    phone: false,
    clothing: false,
    childcare: false,
    debtPayments: false,
    otherExpenses: false
  }
};

// Load configuration from localStorage
export const loadAdminConfig = () => {
  try {
    const saved = localStorage.getItem('budgetingToolAdminConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all fields exist
      return {
        ...defaultConfig,
        ...parsed,
        compulsoryFields: {
          ...defaultConfig.compulsoryFields,
          ...parsed.compulsoryFields
        }
      };
    }
  } catch (error) {
    console.error('Error loading admin config:', error);
  }
  return defaultConfig;
};

// Save configuration to localStorage
export const saveAdminConfig = (config) => {
  try {
    localStorage.setItem('budgetingToolAdminConfig', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving admin config:', error);
    return false;
  }
};

// Update specific configuration section
export const updateConfig = (section, key, value) => {
  const config = loadAdminConfig();
  config[section][key] = value;
  return saveAdminConfig(config);
};

// Get standard amounts configuration
export const getStandardAmountsConfig = () => {
  const config = loadAdminConfig();
  return config.standardAmounts;
};

// Get compulsory fields configuration
export const getCompulsoryFieldsConfig = () => {
  const config = loadAdminConfig();
  return config.compulsoryFields;
};

// Get housing reviews configuration
export const getHousingReviewsConfig = () => {
  const config = loadAdminConfig();
  return config.housingReviews;
};

// Check if a field is compulsory
export const isFieldCompulsory = (fieldName) => {
  const config = loadAdminConfig();
  return config.compulsoryFields[fieldName] || false;
};

// Get all compulsory field names
export const getCompulsoryFieldNames = () => {
  const config = loadAdminConfig();
  return Object.keys(config.compulsoryFields).filter(
    field => config.compulsoryFields[field]
  );
};

// Reset configuration to defaults
export const resetConfig = () => {
  return saveAdminConfig(defaultConfig);
};

// Export field definitions for admin interface
export const fieldDefinitions = {
  // Income fields
  wages: { label: 'Wages', category: 'income' },
  universalCredit: { label: 'Universal Credit', category: 'income' },
  otherBenefits: { label: 'Other Benefits', category: 'income' },
  familySupport: { label: 'Family Support', category: 'income' },
  savings: { label: 'Savings', category: 'income' },
  otherIncome: { label: 'Other Income', category: 'income' },
  // Outgoing fields
  rent: { label: 'Rent', category: 'outgoing' },
  councilTax: { label: 'Council Tax', category: 'outgoing' },
  gasAndElectricity: { label: 'Gas and Electricity', category: 'outgoing' },
  water: { label: 'Water', category: 'outgoing' },
  broadband: { label: 'Broadband', category: 'outgoing' },
  food: { label: 'Food', category: 'outgoing' },
  transport: { label: 'Transport', category: 'outgoing' },
  phone: { label: 'Phone', category: 'outgoing' },
  clothing: { label: 'Clothing', category: 'outgoing' },
  childcare: { label: 'Childcare', category: 'outgoing' },
  debtPayments: { label: 'Debt Payments', category: 'outgoing' },
  otherExpenses: { label: 'Other Expenses', category: 'outgoing' }
};
