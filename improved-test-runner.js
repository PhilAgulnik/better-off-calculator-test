const fs = require('fs');
const path = require('path');

// Enhanced Universal Credit Calculator for testing
class EnhancedTestCalculator {
  constructor() {
    this.rates = {
      '2024_25': {
        standardAllowance: {
          single: { under25: 311.68, over25: 393.45 },
          couple: { under25: 489.23, over25: 617.60 }
        },
        childElement: {
          first: 333.33,  // First child (born before 6 April 2017)
          additional: 287.92  // Additional children (born after 6 April 2017)
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmount: 935.74
        },
        workAllowance: {
          single: { withHousing: 404, withoutHousing: 673 },
          couple: { withHousing: 404, withoutHousing: 673 }
        },
        taperRate: 0.55,
        carerElement: 198.31,
        lcwraElement: 416.19,
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04,
      },
      '2025_26': {
        standardAllowance: {
          single: { under25: 316.98, over25: 400.14 },
          couple: { under25: 497.55, over25: 628.10 }
        },
        childElement: {
          first: 339.00,  // First child (born before 6 April 2017)
          additional: 292.81  // Additional children (born after 6 April 2017)
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
    // Handle different housing statuses properly
    if (input.housingStatus === 'no_housing_costs' || input.housingStatus === '') return 0;
    if (input.housingStatus === 'homeowner') return 0; // Simplification

    // For renters (private/social), include rent and service charges
    const rent = parseFloat(input.rent) || 0;
    const serviceCharges = parseFloat(input.serviceCharges) || 0;
    return rent + serviceCharges;
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
      throw new Error(`Tax year ${taxYear} not supported. Supported years: ${Object.keys(this.rates).join(', ')}`);
    }

    // Calculate components
    const standardAllowance = this.calculateStandardAllowance(input, rates);
    const housingElement = this.calculateHousingElement(input);
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
        workAllowance,
        mainNetEarnings,
        partnerNetEarnings,
        totalNetEarnings
      }
    };
  }
}

// Enhanced CSV parser that handles different column structures
function parseCSVFlexible(csvContent) {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const dataLines = lines.slice(1).filter(line => line.trim());

  return dataLines.map((line, index) => {
    const columns = line.split(',').map(col => col.trim());

    // Create mapping from headers to values
    const dataMap = {};
    headers.forEach((header, i) => {
      dataMap[header] = columns[i] || '';
    });

    return {
      testCaseId: index + 1,
      input: {
        taxYear: dataMap.taxYear || '2025_26',
        circumstances: dataMap.circumstances || 'single',
        age: parseInt(dataMap.age) || 25,
        partnerAge: dataMap.partnerAge ? parseInt(dataMap.partnerAge) : undefined,
        children: parseInt(dataMap.children) || 0,
        childAges: dataMap.childAges ? dataMap.childAges.split('|').map(age => parseInt(age) || 0) : [],
        housingStatus: dataMap.housingStatus || 'no_housing_costs',
        rent: parseFloat(dataMap.rent) || 0,
        serviceCharges: parseFloat(dataMap.serviceCharges) || 0,
        employmentType: dataMap.employmentType || 'not_working',
        monthlyEarnings: parseFloat(dataMap.monthlyEarnings) || 0,
        childcareCosts: parseFloat(dataMap.childcareCosts) || 0,
        partnerEmploymentType: dataMap.partnerEmploymentType || 'not_working',
        partnerMonthlyEarnings: parseFloat(dataMap.partnerMonthlyEarnings) || 0,
        savings: parseFloat(dataMap.savings) || 0,
      },
      expectedOutput: {
        standardAllowance: parseFloat(dataMap.standardAllowance) || 0,
        housingElement: parseFloat(dataMap.housingElement) || 0,
        childElement: parseFloat(dataMap.childElement) || 0,
        childcareElement: parseFloat(dataMap.childcareElement) || 0,
        carerElement: parseFloat(dataMap.carerElement) || 0,
        lcwraElement: parseFloat(dataMap.lcwraElement) || 0,
        totalElements: parseFloat(dataMap.totalElements) || 0,
        earningsReduction: parseFloat(dataMap.earningsReduction) || 0,
        capitalDeduction: parseFloat(dataMap.capitalDeduction) || 0,
        benefitDeduction: parseFloat(dataMap.benefitDeduction) || 0,
        finalAmount: parseFloat(dataMap.finalAmount) || 0,
      },
      rawData: dataMap // Keep original data for debugging
    };
  });
}

function compareResults(actual, expected) {
  const tolerance = 0.01; // £0.01 tolerance for floating point differences
  const errors = [];
  let allPassed = true;

  const fields = [
    'standardAllowance', 'housingElement', 'childElement', 'childcareElement',
    'carerElement', 'lcwraElement', 'totalElements',
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

async function runImprovedTests(csvFileName) {
  try {
    console.log(`\\n🧪 IMPROVED UNIVERSAL CREDIT CALCULATOR TESTS`);
    console.log(`📋 Testing file: ${csvFileName}`);
    console.log(`${'='.repeat(60)}`);

    // Read the CSV file
    const csvPath = path.join(__dirname, csvFileName);
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found: ${csvPath}`);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');

    // Parse test cases
    const testCases = parseCSVFlexible(csvContent);
    console.log(`\\n📊 Loaded ${testCases.length} test cases\\n`);

    // Initialize calculator
    const calculator = new EnhancedTestCalculator();

    // Run each test case
    const results = [];
    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
      try {
        const calculation = calculator.calculate(testCase.input);
        const actual = calculation.calculation;
        const expected = testCase.expectedOutput;

        // Compare results
        const comparison = compareResults(actual, expected);

        const result = {
          testCaseId: testCase.testCaseId,
          passed: comparison.allPassed,
          differences: comparison.errors,
          actual: actual,
          expected: expected,
          input: testCase.input
        };

        results.push(result);

        // Log results
        if (comparison.allPassed) {
          console.log(`✅ Test ${testCase.testCaseId}: PASS`);
          passed++;
        } else {
          console.log(`❌ Test ${testCase.testCaseId}: FAIL`);
          console.log(`   Input: ${testCase.input.circumstances}, Age: ${testCase.input.age}, Children: ${testCase.input.children}, Earnings: £${testCase.input.monthlyEarnings}`);
          comparison.errors.forEach(error => {
            console.log(`   ${error.field}: Expected £${error.expected}, Got £${error.actual} (Diff: £${error.difference})`);
          });
          failed++;
        }

      } catch (error) {
        console.log(`💥 Test ${testCase.testCaseId}: ERROR - ${error.message}`);
        results.push({
          testCaseId: testCase.testCaseId,
          passed: false,
          error: error.message,
          input: testCase.input
        });
        failed++;
      }
    }

    // Summary
    console.log(`\\n${'='.repeat(60)}`);
    console.log(`📈 TEST SUMMARY`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total Tests: ${results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Success Rate: ${((passed / results.length) * 100).toFixed(2)}%`);

    if (passed === results.length) {
      console.log(`\\n🎉 ALL TESTS PASSED! The calculator is working correctly.`);
    } else {
      console.log(`\\n⚠️  ${failed} tests failed. Check the logic or expected values.`);

      // Group errors by type for analysis
      const errorsByField = {};
      results.filter(r => !r.passed && r.differences).forEach(result => {
        result.differences.forEach(diff => {
          if (!errorsByField[diff.field]) errorsByField[diff.field] = 0;
          errorsByField[diff.field]++;
        });
      });

      if (Object.keys(errorsByField).length > 0) {
        console.log(`\\n🔍 ERROR ANALYSIS:`);
        Object.entries(errorsByField).forEach(([field, count]) => {
          console.log(`   ${field}: ${count} failures`);
        });
      }
    }

    return results;

  } catch (error) {
    console.error('💥 Error running improved tests:', error.message);
    return [];
  }
}

// Export for use in other modules
module.exports = { runImprovedTests, EnhancedTestCalculator };

// Run tests if called directly
if (require.main === module) {
  const csvFile = process.argv[2] || 'calculator-test-template.csv';
  runImprovedTests(csvFile);
}