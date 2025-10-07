const fs = require('fs');
const { AccurateUniversalCreditCalculator } = require('./generate-correct-test-cases.js');

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const header = lines[0].split(',');
  const dataLines = lines.slice(1);
  
  return dataLines.filter(line => line.trim()).map((line, index) => {
    const columns = line.split(',').map(col => col.trim());
    
    // Create input object from CSV columns
    const input = {
      taxYear: columns[0] || '2025_26',
      circumstances: columns[1] || 'single',
      age: parseInt(columns[2]) || 25,
      partnerAge: columns[3] ? parseInt(columns[3]) : undefined,
      children: parseInt(columns[4]) || 0,
      housingStatus: columns[8] || 'no_housing_costs',
      rent: parseFloat(columns[10]) || 0,
      serviceCharges: parseFloat(columns[11]) || 0,
      employmentType: columns[15] || 'not_working',
      monthlyEarnings: parseFloat(columns[16]) || 0,
      childcareCosts: parseFloat(columns[17]) || 0,
      partnerEmploymentType: columns[27] || 'not_working',
      partnerMonthlyEarnings: parseFloat(columns[28]) || 0,
      savings: parseFloat(columns[38]) || 0,
    };
    
    // Expected output values from CSV columns (now including net earnings)
    const expectedOutput = {
      standardAllowance: parseFloat(columns[41]) || 0,
      housingElement: parseFloat(columns[42]) || 0,
      childElement: parseFloat(columns[43]) || 0,
      childcareElement: parseFloat(columns[44]) || 0,
      carerElement: parseFloat(columns[45]) || 0,
      lcwraElement: parseFloat(columns[46]) || 0,
      totalElements: parseFloat(columns[47]) || 0,
      workAllowance: parseFloat(columns[48]) || 0,
      mainNetEarnings: parseFloat(columns[49]) || 0,
      partnerNetEarnings: parseFloat(columns[50]) || 0,
      totalNetEarnings: parseFloat(columns[51]) || 0,
      mainGrossEarnings: parseFloat(columns[52]) || 0,
      partnerGrossEarnings: parseFloat(columns[53]) || 0,
      totalGrossEarnings: parseFloat(columns[54]) || 0,
      earningsReduction: parseFloat(columns[55]) || 0,
      capitalDeduction: parseFloat(columns[56]) || 0,
      benefitDeduction: parseFloat(columns[57]) || 0,
      finalAmount: parseFloat(columns[58]) || 0
    };
    
    return {
      testCaseId: index + 1,
      input,
      expectedOutput
    };
  });
}

function compareResults(actual, expected) {
  const tolerance = 0.01; // £0.01 tolerance for floating point differences
  const errors = [];
  let allPassed = true;
  
  const fields = [
    'standardAllowance', 'housingElement', 'childElement', 'childcareElement', 
    'carerElement', 'lcwraElement', 'totalElements', 'workAllowance',
    'mainNetEarnings', 'partnerNetEarnings', 'totalNetEarnings',
    'mainGrossEarnings', 'partnerGrossEarnings', 'totalGrossEarnings',
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

async function testCorrectedCases() {
  try {
    // Read the corrected CSV file
    const csvPath = 'corrected-test-cases-2025-26.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    
    // Parse test cases
    const testCases = parseCSV(csvContent);
    console.log(`Testing ${testCases.length} corrected test cases...\n`);
    
    // Initialize calculator
    const calculator = new AccurateUniversalCreditCalculator();
    
    // Run each test case
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const calculation = calculator.calculate(testCase.input);
        
        const actual = {
          standardAllowance: calculation.calculation.standardAllowance,
          housingElement: calculation.calculation.housingElement,
          childElement: calculation.calculation.childElement,
          childcareElement: calculation.calculation.childcareElement,
          carerElement: calculation.calculation.carerElement,
          lcwraElement: calculation.calculation.lcwraElement,
          totalElements: calculation.calculation.totalElements,
          workAllowance: calculation.calculation.workAllowance,
          mainNetEarnings: calculation.calculation.mainNetEarnings,
          partnerNetEarnings: calculation.calculation.partnerNetEarnings,
          totalNetEarnings: calculation.calculation.totalNetEarnings,
          mainGrossEarnings: calculation.calculation.mainGrossEarnings,
          partnerGrossEarnings: calculation.calculation.partnerGrossEarnings,
          totalGrossEarnings: calculation.calculation.totalGrossEarnings,
          earningsReduction: calculation.calculation.earningsReduction,
          capitalDeduction: calculation.calculation.capitalDeduction,
          benefitDeduction: calculation.calculation.benefitDeduction,
          finalAmount: calculation.calculation.finalAmount
        };
        
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
        console.log(`Test Case ${testCase.testCaseId}: ${comparison.allPassed ? '✅ PASS' : '❌ FAIL'}`);
        if (comparison.allPassed) {
          console.log(`  All fields match within £0.01 tolerance`);
        } else {
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
    
    console.log(`\n=== CORRECTED TEST SUMMARY ===`);
    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(2)}%`);
    
    if (passed === results.length) {
      console.log(`\n🎉 ALL TESTS PASSED! The corrected test cases are accurate.`);
    } else {
      console.log(`\n⚠️  Some tests still failing - may need further corrections.`);
    }
    
    return results;
    
  } catch (error) {
    console.error('Error running corrected tests:', error);
  }
}

// Run the tests
if (require.main === module) {
  testCorrectedCases();
}