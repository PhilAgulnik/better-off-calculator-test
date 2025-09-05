// Housing Reviews Standard Amounts Service
// Based on Housing Reviews Assessing Affordability Guidance
// Note: These are typical affordability standards used in housing reviews

export const housingReviewTypes = {
  'single-person': 'Single Person',
  'couple': 'Couple',
  'family-1-child': 'Family with 1 Child',
  'family-2-children': 'Family with 2 Children',
  'family-3-children': 'Family with 3+ Children',
  'pensioner-single': 'Single Pensioner',
  'pensioner-couple': 'Pensioner Couple'
};

// Housing Reviews Standard Amounts (monthly)
// Based on typical affordability guidance used in housing reviews
export const housingReviewAmounts = {
  'single-person': {
    rent: 0, // To be calculated based on income
    councilTax: 120,
    gasAndElectricity: 80,
    water: 35,
    broadband: 25,
    food: 200,
    transport: 100,
    phone: 30,
    clothing: 50,
    childcare: 0,
    debtPayments: 0,
    otherExpenses: 100
  },
  'couple': {
    rent: 0, // To be calculated based on income
    councilTax: 150,
    gasAndElectricity: 120,
    water: 45,
    broadband: 30,
    food: 350,
    transport: 150,
    phone: 50,
    clothing: 80,
    childcare: 0,
    debtPayments: 0,
    otherExpenses: 150
  },
  'family-1-child': {
    rent: 0, // To be calculated based on income
    councilTax: 180,
    gasAndElectricity: 140,
    water: 50,
    broadband: 35,
    food: 450,
    transport: 200,
    phone: 60,
    clothing: 120,
    childcare: 300,
    debtPayments: 0,
    otherExpenses: 200
  },
  'family-2-children': {
    rent: 0, // To be calculated based on income
    councilTax: 200,
    gasAndElectricity: 160,
    water: 60,
    broadband: 40,
    food: 600,
    transport: 250,
    phone: 70,
    clothing: 180,
    childcare: 500,
    debtPayments: 0,
    otherExpenses: 250
  },
  'family-3-children': {
    rent: 0, // To be calculated based on income
    councilTax: 220,
    gasAndElectricity: 180,
    water: 70,
    broadband: 45,
    food: 750,
    transport: 300,
    phone: 80,
    clothing: 240,
    childcare: 700,
    debtPayments: 0,
    otherExpenses: 300
  },
  'pensioner-single': {
    rent: 0, // To be calculated based on income
    councilTax: 100,
    gasAndElectricity: 70,
    water: 30,
    broadband: 20,
    food: 180,
    transport: 60,
    phone: 25,
    clothing: 40,
    childcare: 0,
    debtPayments: 0,
    otherExpenses: 80
  },
  'pensioner-couple': {
    rent: 0, // To be calculated based on income
    councilTax: 130,
    gasAndElectricity: 100,
    water: 40,
    broadband: 25,
    food: 300,
    transport: 100,
    phone: 40,
    clothing: 70,
    childcare: 0,
    debtPayments: 0,
    otherExpenses: 120
  }
};

// Get housing review amounts for a specific household type
export const getHousingReviewAmounts = (householdType) => {
  return housingReviewAmounts[householdType] || housingReviewAmounts['single-person'];
};

// Get all available household types
export const getHousingReviewTypes = () => {
  return housingReviewTypes;
};

// Get data source information
export const getHousingReviewDataSourceInfo = () => {
  return {
    name: 'Housing Reviews Standard Amounts',
    description: 'Standard amounts based on Housing Reviews Assessing Affordability Guidance',
    source: 'Housing Reviews Guidance',
    lastUpdated: '2024',
    note: 'These are typical affordability standards used in housing reviews. Rent amounts should be calculated based on income and local housing costs.'
  };
};

// Calculate rent affordability (typically 30-35% of income)
export const calculateAffordableRent = (monthlyIncome, percentage = 0.30) => {
  return Math.round(monthlyIncome * percentage);
};

// Apply housing review amounts to budget data
export const applyHousingReviewAmounts = (budgetData, householdType, monthlyIncome = 0) => {
  const amounts = getHousingReviewAmounts(householdType);
  const affordableRent = calculateAffordableRent(monthlyIncome);
  
  return {
    ...budgetData,
    outgoings: {
      ...budgetData.outgoings,
      rent: affordableRent,
      councilTax: amounts.councilTax,
      gasAndElectricity: amounts.gasAndElectricity,
      water: amounts.water,
      broadband: amounts.broadband,
      food: amounts.food,
      transport: amounts.transport,
      phone: amounts.phone,
      clothing: amounts.clothing,
      childcare: amounts.childcare,
      debtPayments: amounts.debtPayments,
      otherExpenses: amounts.otherExpenses
    }
  };
};
