const fs = require('fs');
const path = require('path');

// Import the calculator (simplified version for Node.js testing)
class TestUniversalCreditCalculator {
  constructor() {
    this.rates = {
      '2025_26': {
        standardAllowance: {
          single: { under25: 316.98, over25: 400.14 },
          couple: { under25: 497.55, over25: 628.10 }
        },
        childElement: {
          first: 339.00,  // First child (born before 6 April 2017)
          additional: 292.81  // First/second child (born after 6 April 2017)
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmount: 950.92
        },
        workAllowance: {
          single: { withHousing: 411, withoutHousing: 684 },
          couple: { withHousing: 411, withoutHousing: 684 }
        },
        taperRate: 0.55,
        carerElement: 201.68,
        lcwraElement: 423.27,
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04,
      }
    };
  }

  calculateStandardAllowance(input, rates) {
    if (input.circumstances === 'single') {
      return input.age >= 25 ? rates.standardAllowance.single.over25 : rates.standardAllowance.single.under25;
    } else {
      const mainAge = input.age || 25;
      const partnerAge = input.partnerAge || 25;
      return (mainAge >= 25 || partnerAge >= 25) ? rates.standardAllowance.couple.over25 : rates.standardAllowance.couple.under25;
    }
  }

  calculateChildElement(input, rates) {
    if (!input.children || input.children === 0) return 0;
    
    // First child gets higher rate if born before April 6, 2017
    // For simplicity, assume first child gets first rate, others get additional rate
    if (input.children === 1) {
      return rates.childElement.first;
    } else {
      return rates.childElement.first + (rates.childElement.additional * (input.children - 1));
    }
  }

  calculateHousingElement(input) {
    if (input.housingStatus === 'no_housing_costs') return { amount: 0, lhaDetails: null };
    const rent = input.rent || 0;
    const serviceCharges = input.serviceCharges || 0;
    return { amount: rent + serviceCharges, lhaDetails: null };
  }

  calculateCapitalDeduction(input, rates) {
    const savings = input.savings || 0;
    
    if (savings <= rates.capitalLowerLimit) {
      return 0;
    } else if (savings <= rates.capitalUpperLimit) {
      // Calculate tariff income: for every £250 (or part of £250) over £6,000, £4.35 is treated as monthly income
      const excessOver6000 = savings - rates.capitalLowerLimit;
      const tariffUnits = Math.ceil(excessOver6000 / 250); // Round up to nearest £250
      const tariffIncome = tariffUnits * 4.35;
      return tariffIncome;
    } else {
      // Savings over £16,000 - no UC entitlement
      return 999999; // This would make final amount 0
    }
  }

  // Calculate net earnings exactly like NetEarningsModule
  calculateNetEarnings(grossMonthly) {
    if (grossMonthly <= 0) return 0;

    const personalAllowanceYear = 12570;
    const basicBandYear = 37700;
    
    const grossYear = grossMonthly * 12;
    const taxableYear = Math.max(0, grossYear - personalAllowanceYear);
    const basicTaxYear = Math.min(taxableYear, basicBandYear) * 0.20;
    const higherTaxYear = Math.max(0, taxableYear - basicBandYear) * 0.40;
    const taxMonthly = (basicTaxYear + higherTaxYear) / 12;

    const niMonthlyThreshold = 1048;
    const niRate = 0.08;
    const niMonthly = Math.max(0, grossMonthly - niMonthlyThreshold) * niRate;

    const pensionMonthly = grossMonthly * 0.03; // 3% minimum pension

    const netCalculated = Math.max(0, grossMonthly - taxMonthly - niMonthly - pensionMonthly);
    return netCalculated;
  }

  calculate(input) {
    const taxYear = input.taxYear || '2025_26';
    const rates = this.rates[taxYear];
    
    if (!rates) {
      throw new Error(`Tax year ${taxYear} not supported`);
    }

    // Calculate components
    const standardAllowance = this.calculateStandardAllowance(input, rates);
    const { amount: housingElement } = this.calculateHousingElement(input);
    const childElement = this.calculateChildElement(input, rates);
    const childcareElement = Math.min((input.childcareCosts || 0) * (rates.childcareElement.maxPercentage / 100), rates.childcareElement.maxAmount);
    const carerElement = 0; // Simplified - would need carer logic
    const lcwraElement = 0; // Simplified - would need LCWRA logic
    
    const totalElements = standardAllowance + housingElement + childElement + childcareElement + carerElement + lcwraElement;
    
    // Calculate earnings reduction using net earnings
    const mainNetEarnings = this.calculateNetEarnings(input.monthlyEarnings || 0);
    const partnerNetEarnings = this.calculateNetEarnings(input.partnerMonthlyEarnings || 0);
    const totalNetEarnings = mainNetEarnings + partnerNetEarnings;
    
    const hasHousing = housingElement > 0;
    const workAllowance = input.circumstances === 'single' 
      ? (hasHousing ? rates.workAllowance.single.withHousing : rates.workAllowance.single.withoutHousing)
      : (hasHousing ? rates.workAllowance.couple.withHousing : rates.workAllowance.couple.withoutHousing);
    
    const earningsAboveAllowance = Math.max(0, totalNetEarnings - workAllowance);
    const earningsReduction = earningsAboveAllowance * rates.taperRate;
    
    // Calculate deductions
    const capitalDeduction = this.calculateCapitalDeduction(input, rates);
    const benefitDeduction = 0; // Simplified
    
    const finalAmount = Math.max(0, totalElements - earningsReduction - capitalDeduction - benefitDeduction);
    
    return {
      calculation: {
        standardAllowance,
        housingElement,
        childElement,
        childcareElement,
        carerElement,
        lcwraElement,
        totalElements,
        earningsReduction,
        capitalDeduction,
        benefitDeduction,
        finalAmount,
        workAllowance
      }
    };
  }

  exportCalculationForTesting(input, results) {
    return {
      output: {
        standardAllowance: results.calculation.standardAllowance,
        housingElement: results.calculation.housingElement,
        childElement: results.calculation.childElement,
        childcareElement: results.calculation.childcareElement,
        carerElement: results.calculation.carerElement,
        totalElements: results.calculation.totalElements,
        earningsReduction: results.calculation.earningsReduction,
        capitalDeduction: results.calculation.capitalDeduction,
        benefitDeduction: results.calculation.benefitDeduction,
        finalAmount: results.calculation.finalAmount
      }
    };
  }
}

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1);
  
  return dataLines.filter(line => line.trim()).map((line, index) => {
    const columns = line.split(',').map(col => col.trim());
    
    return {
      testCaseId: index + 1,
      input: {
        taxYear: columns[0] || '2025_26',
        circumstances: columns[1] || 'single',
        age: parseInt(columns[2]) || 25,
        partnerAge: parseInt(columns[3]) || 25,
        children: parseInt(columns[4]) || 0,
        childAges: columns[5] ? columns[5].split('|').map(age => parseInt(age) || 0) : [],
        housingStatus: columns[8] || 'no_housing_costs',
        rent: parseFloat(columns[10]) || 0,
        serviceCharges: parseFloat(columns[11]) || 0,
        employmentType: columns[15] || 'not_working',
        monthlyEarnings: parseFloat(columns[16]) || 0,
        childcareCosts: parseFloat(columns[17]) || 0,
        partnerEmploymentType: columns[27] || 'not_working',
        partnerMonthlyEarnings: parseFloat(columns[28]) || 0,
        savings: parseFloat(columns[38]) || 0,
      },
      expectedOutput: {
        standardAllowance: parseFloat(columns[41]) || 0,
        housingElement: parseFloat(columns[42]) || 0,
        childElement: parseFloat(columns[43]) || 0,
        childcareElement: parseFloat(columns[44]) || 0,
        carerElement: parseFloat(columns[45]) || 0,
        totalElements: parseFloat(columns[47]) || 0,
        earningsReduction: parseFloat(columns[55]) || 0,
        capitalDeduction: parseFloat(columns[56]) || 0,
        benefitDeduction: parseFloat(columns[57]) || 0,
        finalAmount: parseFloat(columns[58]) || 0,
      }
    };
  });
}

async function runTests() {
  try {
    // Read the CSV file  
    const csvPath = path.join(__dirname, 'calculator-test-template.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse test cases
    const testCases = parseCSV(csvContent);
    console.log(`Running ${testCases.length} test cases...\n`);
    
    // Initialize calculator
    const calculator = new TestUniversalCreditCalculator();
    
    // Run each test case
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const calculation = calculator.calculate(testCase.input);
        const jsonOutput = calculator.exportCalculationForTesting(testCase.input, calculation);
        
        const actual = jsonOutput.output;
        const expected = testCase.expectedOutput;
        
        // Compare results
        const comparison = compareResults(actual, expected);
        
        results.push({
          testCaseId: testCase.testCaseId,
          passed: comparison.allPassed,
          differences: comparison.errors,
          actual: actual,
          expected: expected
        });
        
        // Log results
        console.log(`Test Case ${testCase.testCaseId}: ${comparison.allPassed ? 'PASS' : 'FAIL'}`);
        if (!comparison.allPassed) {
          comparison.errors.forEach(error => {
            console.log(`  ${error.field}: Expected £${error.expected}, Got £${error.actual} (Diff: £${error.difference})`);
          });
        }
        console.log('');
        
      } catch (error) {
        console.log(`Test Case ${testCase.testCaseId}: ERROR - ${error.message}\n`);
        results.push({
          testCaseId: testCase.testCaseId,
          passed: false,
          error: error.message
        });
      }
    }
    
    // Summary
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(`\n=== TEST SUMMARY ===`);
    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(2)}%`);
    
    return results;
    
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

function compareResults(actual, expected) {
  const tolerance = 0.01;
  const errors = [];
  let allPassed = true;
  
  const fields = [
    'standardAllowance', 'housingElement', 'childElement', 
    'childcareElement', 'carerElement', 'totalElements',
    'earningsReduction', 'capitalDeduction', 'benefitDeduction', 'finalAmount'
  ];
  
  fields.forEach(field => {
    const actualValue = actual[field] || 0;
    const expectedValue = expected[field] || 0;
    const difference = Math.abs(actualValue - expectedValue);
    
    if (difference > tolerance) {
      errors.push({
        field,
        expected: expectedValue,
        actual: actualValue,
        difference: difference.toFixed(2)
      });
      allPassed = false;
    }
  });
  
  return { allPassed, errors };
}

// Run the tests
runTests();