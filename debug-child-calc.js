const { UniversalCreditCalculator } = require('./src/utils/calculator.js');

const calculator = new UniversalCreditCalculator();

// Test case: Single, age 30, 1 child age 5
const test1 = {
  taxYear: '2025_26',
  circumstances: 'single',
  age: 30,
  children: 1,
  childAges: [5],
  housingStatus: 'renting',
  tenantType: 'private',
  rent: 800,
  serviceCharges: 50,
  bedrooms: 2,
  brma: 'Central London',
  monthlyEarnings: 2000,
  employmentType: 'employed',
  childcareCosts: 200
};

const result1 = calculator.calculate(test1);
console.log('Test 1 - Child age 5:');
console.log('Child Element:', result1.calculation.childElement);
console.log('Expected: £292.81');
console.log('');

// Test case: Couple, ages 35/32, 2 children ages 8 and 12
const test2 = {
  taxYear: '2025_26',
  circumstances: 'couple',
  age: 35,
  partnerAge: 32,
  children: 2,
  childAges: [8, 12],
  housingStatus: 'renting',
  tenantType: 'private',
  rent: 1200,
  serviceCharges: 75,
  bedrooms: 3,
  brma: 'Central Greater Manchester',
  monthlyEarnings: 3000,
  partnerMonthlyEarnings: 1500,
  employmentType: 'employed',
  partnerEmploymentType: 'employed',
  childcareCosts: 400,
  savings: 8000
};

const result2 = calculator.calculate(test2);
console.log('Test 2 - Children ages 8 and 12:');
console.log('Child Element:', result2.calculation.childElement);
console.log('Expected: Age 8 (born 2017) + Age 12 (born 2013)');
console.log('Age 12 (Oct 2013) = BEFORE Apr 2017 = £339.00');
console.log('Age 8 (Oct 2017) = AFTER Apr 2017 = £292.81');
console.log('Total should be: £631.81');
