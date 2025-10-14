// ONS Data Service for Budgeting Tool
// Based on Household Costs Indices data from ONS

export const householdTypes = {
  'private-renter': 'Private Renter',
  'social-renter': 'Social and Other Renter',
  'mortgagor': 'Mortgagor and Other Owner Occupier',
  'outright-owner': 'Outright Owner Occupier',
  'low-income-decile-2': 'Low Income (Decile 2)',
  'low-income-decile-3': 'Low Income (Decile 3)',
  'middle-income-decile-5': 'Middle Income (Decile 5)',
  'high-income-decile-8': 'High Income (Decile 8)',
  'high-income-decile-9': 'High Income (Decile 9)',
  'with-children': 'Household with Children',
  'without-children': 'Household without Children',
  'retired': 'Retired Household',
  'non-retired': 'Non-Retired Household'
};

// Water companies in England and Wales
export const waterCompanies = {
  'anglian': 'Anglian Water',
  'dwr-cymru': 'Dŵr Cymru Welsh Water',
  'northumbrian': 'Northumbrian Water',
  'severn-trent': 'Severn Trent Water',
  'south-west': 'South West Water',
  'southern': 'Southern Water',
  'thames': 'Thames Water',
  'united-utilities': 'United Utilities',
  'wessex': 'Wessex Water',
  'yorkshire': 'Yorkshire Water',
  'affinity': 'Affinity Water',
  'bristol': 'Bristol Water',
  'portsmouth': 'Portsmouth Water',
  'south-east': 'South East Water',
  'sutton-east': 'Sutton and East Surrey Water',
  'tendring': 'Tendring Hundred Water',
  'three-valleys': 'Three Valleys Water'
};

// Average monthly water bills by company (2024/25 estimates)
export const averageWaterBills = {
  'anglian': 45,
  'dwr-cymru': 42,
  'northumbrian': 38,
  'severn-trent': 40,
  'south-west': 48,
  'southern': 43,
  'thames': 44,
  'united-utilities': 41,
  'wessex': 46,
  'yorkshire': 39,
  'affinity': 42,
  'bristol': 44,
  'portsmouth': 43,
  'south-east': 45,
  'sutton-east': 44,
  'tendring': 41,
  'three-valleys': 43
};

// ONS data based on Household Costs Indices and Living Costs and Food Survey
// These are estimated monthly averages for different household types
export const onsStandardAmounts = {
  'private-renter': {
    rent: 850,
    councilTax: 95,
    gasAndElectricity: 80,
    water: 42,
    broadband: 25,
    food: 200,
    transport: 80,
    phone: 25,
    clothing: 40,
    childcare: 0,
    debtPayments: 50,
    otherExpenses: 60
  },
  'social-renter': {
    rent: 450,
    councilTax: 85,
    gasAndElectricity: 70,
    water: 38,
    broadband: 22,
    food: 180,
    transport: 60,
    phone: 20,
    clothing: 35,
    childcare: 0,
    debtPayments: 40,
    otherExpenses: 50
  },
  'mortgagor': {
    rent: 0,
    councilTax: 110,
    gasAndElectricity: 85,
    water: 45,
    broadband: 28,
    food: 220,
    transport: 90,
    phone: 28,
    clothing: 45,
    childcare: 0,
    debtPayments: 60,
    otherExpenses: 70
  },
  'outright-owner': {
    rent: 0,
    councilTax: 120,
    gasAndElectricity: 90,
    water: 48,
    broadband: 30,
    food: 240,
    transport: 100,
    phone: 30,
    clothing: 50,
    childcare: 0,
    debtPayments: 70,
    otherExpenses: 80
  },
  'low-income-decile-2': {
    rent: 400,
    councilTax: 70,
    gasAndElectricity: 60,
    water: 35,
    broadband: 20,
    food: 150,
    transport: 45,
    phone: 18,
    clothing: 30,
    childcare: 0,
    debtPayments: 30,
    otherExpenses: 40
  },
  'low-income-decile-3': {
    rent: 500,
    councilTax: 80,
    gasAndElectricity: 65,
    water: 37,
    broadband: 22,
    food: 165,
    transport: 55,
    phone: 20,
    clothing: 32,
    childcare: 0,
    debtPayments: 35,
    otherExpenses: 45
  },
  'middle-income-decile-5': {
    rent: 650,
    councilTax: 95,
    gasAndElectricity: 75,
    water: 40,
    broadband: 25,
    food: 190,
    transport: 75,
    phone: 25,
    clothing: 38,
    childcare: 0,
    debtPayments: 45,
    otherExpenses: 55
  },
  'high-income-decile-8': {
    rent: 900,
    councilTax: 130,
    gasAndElectricity: 95,
    water: 50,
    broadband: 32,
    food: 260,
    transport: 110,
    phone: 35,
    clothing: 55,
    childcare: 0,
    debtPayments: 80,
    otherExpenses: 90
  },
  'high-income-decile-9': {
    rent: 1200,
    councilTax: 150,
    gasAndElectricity: 110,
    water: 55,
    broadband: 35,
    food: 300,
    transport: 130,
    phone: 40,
    clothing: 65,
    childcare: 0,
    debtPayments: 100,
    otherExpenses: 110
  },
  'with-children': {
    rent: 700,
    councilTax: 100,
    gasAndElectricity: 80,
    water: 42,
    broadband: 26,
    food: 250,
    transport: 85,
    phone: 28,
    clothing: 60,
    childcare: 200,
    debtPayments: 55,
    otherExpenses: 65
  },
  'without-children': {
    rent: 650,
    councilTax: 95,
    gasAndElectricity: 75,
    water: 40,
    broadband: 25,
    food: 180,
    transport: 70,
    phone: 25,
    clothing: 35,
    childcare: 0,
    debtPayments: 45,
    otherExpenses: 55
  },
  'retired': {
    rent: 500,
    councilTax: 85,
    gasAndElectricity: 70,
    water: 38,
    broadband: 22,
    food: 160,
    transport: 50,
    phone: 20,
    clothing: 30,
    childcare: 0,
    debtPayments: 35,
    otherExpenses: 45
  },
  'non-retired': {
    rent: 700,
    councilTax: 100,
    gasAndElectricity: 80,
    water: 42,
    broadband: 26,
    food: 200,
    transport: 80,
    phone: 28,
    clothing: 40,
    childcare: 50,
    debtPayments: 55,
    otherExpenses: 60
  }
};

// Inflation rates from ONS Household Costs Indices (June 2025)
export const inflationRates = {
  'private-renter': 4.5,
  'social-renter': 4.2,
  'mortgagor': 4.8,
  'outright-owner': 4.9,
  'low-income-decile-2': 4.1,
  'low-income-decile-3': 4.2,
  'middle-income-decile-5': 4.4,
  'high-income-decile-8': 4.7,
  'high-income-decile-9': 4.8,
  'with-children': 4.6,
  'without-children': 4.3,
  'retired': 4.0,
  'non-retired': 4.5
};

export const getONSData = (householdType) => {
  return onsStandardAmounts[householdType] || null;
};

export const getInflationRate = (householdType) => {
  return inflationRates[householdType] || 3.9; // Default to all households rate
};

export const applyInflationAdjustment = (amount, householdType, monthsSinceJune2025 = 0) => {
  const inflationRate = getInflationRate(householdType);
  const monthlyInflation = inflationRate / 12 / 100;
  return amount * Math.pow(1 + monthlyInflation, monthsSinceJune2025);
};

export const getWaterBillByCompany = (companyKey) => {
  return averageWaterBills[companyKey] || 42; // Default average
};

export const getDataSourceInfo = () => {
  return {
    source: 'Office for National Statistics',
    publication: 'Household Costs Indices for UK household groups: April to June 2025',
    url: 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/householdcostsindicesforukhouseholdgroups/apriltojune2025',
    lastUpdated: 'June 2025',
    disclaimer: 'These are estimated averages based on ONS data. Individual circumstances may vary significantly.'
  };
};
