/**
 * Test file for Child Benefit calculations
 * This can be run in the browser console to test the calculations
 */

import { childBenefitCalculator } from './childBenefitCalculator.js';

// Test data
const testCases = [
  {
    name: "No children",
    formData: { children: 0 },
    expectedWeekly: 0
  },
  {
    name: "One child",
    formData: { children: 1 },
    expectedWeekly: 25.60 // 2024/25 rate
  },
  {
    name: "Two children",
    formData: { children: 2 },
    expectedWeekly: 42.55 // 25.60 + 16.95 (2024/25 rates)
  },
  {
    name: "Three children",
    formData: { children: 3 },
    expectedWeekly: 59.50 // 25.60 + 16.95 + 16.95 (2024/25 rates)
  }
];

// Run tests
export function runChildBenefitTests() {
  console.log("🧪 Running Child Benefit Calculation Tests...");
  
  testCases.forEach(testCase => {
    const result = childBenefitCalculator.calculateChildBenefit(testCase.formData, '2024_25');
    const passed = Math.abs(result.weeklyAmount - testCase.expectedWeekly) < 0.01;
    
    console.log(`${passed ? '✅' : '❌'} ${testCase.name}: Expected £${testCase.expectedWeekly}, Got £${result.weeklyAmount.toFixed(2)}`);
    
    if (!passed) {
      console.error(`   Expected: £${testCase.expectedWeekly}, Actual: £${result.weeklyAmount.toFixed(2)}`);
    }
  });
  
  console.log("🏁 Child Benefit tests completed!");
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runChildBenefitTests = runChildBenefitTests;
}
