/**
 * Jest Unit Tests for Universal Credit Calculator
 * Tests core calculation functions with 2025-26 rates
 */

import { UniversalCreditCalculator } from '../calculator';

describe('UniversalCreditCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new UniversalCreditCalculator();
  });

  describe('calculateStandardAllowance', () => {
    const rates = {
      standardAllowance: {
        single: { under25: 316.98, over25: 400.14 },
        couple: { under25: 497.55, over25: 628.10 }
      }
    };

    test('should return correct rate for single person under 25', () => {
      const input = { circumstances: 'single', age: 22 };
      const result = calculator.calculateStandardAllowance(input, rates);
      expect(result).toBe(316.98);
    });

    test('should return correct rate for single person exactly 25', () => {
      const input = { circumstances: 'single', age: 25 };
      const result = calculator.calculateStandardAllowance(input, rates);
      expect(result).toBe(400.14);
    });

    test('should return correct rate for single person over 25', () => {
      const input = { circumstances: 'single', age: 30 };
      const result = calculator.calculateStandardAllowance(input, rates);
      expect(result).toBe(400.14);
    });

    test('should return correct rate for couple both under 25', () => {
      const input = { circumstances: 'couple', age: 22, partnerAge: 23 };
      const result = calculator.calculateStandardAllowance(input, rates);
      expect(result).toBe(497.55);
    });

    test('should return correct rate for couple with one person 25 or over', () => {
      const input = { circumstances: 'couple', age: 30, partnerAge: 24 };
      const result = calculator.calculateStandardAllowance(input, rates);
      expect(result).toBe(628.10);
    });

    test('should return correct rate for couple both over 25', () => {
      const input = { circumstances: 'couple', age: 35, partnerAge: 32 };
      const result = calculator.calculateStandardAllowance(input, rates);
      expect(result).toBe(628.10);
    });

    test('should handle edge case age 24 (boundary)', () => {
      const input = { circumstances: 'single', age: 24 };
      const result = calculator.calculateStandardAllowance(input, rates);
      expect(result).toBe(316.98);
    });
  });

  describe('calculateChildElement', () => {
    const rates2025 = {
      childElement: {
        preTwoChildLimit: 339.00,
        postTwoChildLimit: 292.81
      }
    };

    test('should return 0 for no children', () => {
      const input = { children: 0 };
      const result = calculator.calculateChildElement(input, rates2025);
      expect(result).toBe(0);
    });

    test('should calculate correctly for 1 child (assumes pre-2017)', () => {
      const input = {
        children: 1,
        childAges: [10]
      };
      const result = calculator.calculateChildElement(input, rates2025);
      expect(result).toBe(339.00);
    });

    test('should calculate correctly for 2 children (pre + post 2017)', () => {
      const input = {
        children: 2,
        childAges: [15, 5] // Born ~2010 and ~2020
      };
      const result = calculator.calculateChildElement(input, rates2025);
      // First child: 339, second child: 292.81
      expect(result).toBeCloseTo(631.81, 2);
    });

    test('should calculate correctly for 3 children (applying two-child limit)', () => {
      const input = {
        children: 3,
        childAges: [15, 10, 6]
      };
      const result = calculator.calculateChildElement(input, rates2025);
      // First: 339, second: 292.81, third: 292.81
      expect(result).toBeCloseTo(924.62, 2);
    });

    test('should handle single child edge case', () => {
      const input = {
        children: 1,
        childAges: [3]
      };
      const result = calculator.calculateChildElement(input, rates2025);
      expect(result).toBe(339.00);
    });
  });

  describe('calculateCapitalDeduction', () => {
    const rates = {
      capitalLowerLimit: 6000,
      capitalUpperLimit: 16000,
      capitalDeductionRate: 0.04
    };

    test('should return no deduction for savings under £6,000', () => {
      const input = { savings: 5000 };
      const result = calculator.calculateCapitalDeduction(input, 1000, rates);
      expect(result.deduction).toBe(0);
    });

    test('should return no deduction for savings exactly £6,000', () => {
      const input = { savings: 6000 };
      const result = calculator.calculateCapitalDeduction(input, 1000, rates);
      expect(result.deduction).toBe(0);
    });

    test('should calculate tariff income for £8,000 savings', () => {
      const input = { savings: 8000 };
      const result = calculator.calculateCapitalDeduction(input, 1000, rates);
      // £2000 excess / £250 = 8 units × £4.35 = £34.80
      expect(result.deduction).toBeCloseTo(34.80, 2);
    });

    test('should calculate tariff income for £10,000 savings', () => {
      const input = { savings: 10000 };
      const result = calculator.calculateCapitalDeduction(input, 1000, rates);
      // £4000 excess / £250 = 16 units × £4.35 = £69.60
      expect(result.deduction).toBeCloseTo(69.60, 2);
    });

    test('should calculate tariff income for savings at £16,000 limit', () => {
      const input = { savings: 16000 };
      const result = calculator.calculateCapitalDeduction(input, 1000, rates);
      // £10000 excess / £250 = 40 units × £4.35 = £174.00
      expect(result.deduction).toBeCloseTo(174.00, 2);
    });

    test('should return full deduction for savings over £16,000', () => {
      const input = { savings: 16001 };
      const totalElements = 1000;
      const result = calculator.calculateCapitalDeduction(input, totalElements, rates);
      expect(result.deduction).toBe(totalElements);
    });

    test('should handle savings with partial £250 unit', () => {
      const input = { savings: 6100 };
      const result = calculator.calculateCapitalDeduction(input, 1000, rates);
      // £100 excess rounds up to 1 unit × £4.35 = £4.35
      expect(result.deduction).toBeCloseTo(4.35, 2);
    });

    test('should return 0 for undefined savings', () => {
      const input = {};
      const result = calculator.calculateCapitalDeduction(input, 1000, rates);
      expect(result.deduction).toBe(0);
    });
  });

  describe('calculateWorkAllowance', () => {
    const rates = {
      workAllowance: {
        single: { withHousing: 411, withoutHousing: 684 },
        couple: { withHousing: 411, withoutHousing: 684 }
      }
    };

    test('should return withHousing rate for single with housing element', () => {
      const input = {
        circumstances: 'single',
        children: 1,
        housingStatus: 'renting',
        rent: 500
      };
      const result = calculator.calculateWorkAllowance(input, rates);
      expect(result).toBe(411);
    });

    test('should return withoutHousing rate for single with children but no housing', () => {
      const input = {
        circumstances: 'single',
        children: 1,
        housingStatus: 'no_housing_costs'
      };
      const result = calculator.calculateWorkAllowance(input, rates);
      expect(result).toBe(684);
    });

    test('should return 0 for single with no children and no housing', () => {
      const input = {
        circumstances: 'single',
        children: 0,
        housingStatus: 'no_housing_costs'
      };
      const result = calculator.calculateWorkAllowance(input, rates);
      expect(result).toBe(0);
    });

    test('should return withHousing rate for couple with housing element', () => {
      const input = {
        circumstances: 'couple',
        children: 2,
        housingStatus: 'renting',
        rent: 800
      };
      const result = calculator.calculateWorkAllowance(input, rates);
      expect(result).toBe(411);
    });

    test('should return withoutHousing rate for couple with children but no housing', () => {
      const input = {
        circumstances: 'couple',
        children: 2,
        housingStatus: 'no_housing_costs'
      };
      const result = calculator.calculateWorkAllowance(input, rates);
      expect(result).toBe(684);
    });
  });

  describe('calculateChildcareElement', () => {
    const rates = {
      childcareElement: {
        maxPercentage: 85,
        maxAmountOneChild: 1031.88,
        maxAmountTwoOrMore: 1768.94
      }
    };

    test('should return 0 for no childcare costs', () => {
      const input = { children: 1, childcareCosts: 0 };
      const result = calculator.calculateChildcareElement(input, rates);
      expect(result).toBe(0);
    });

    test('should calculate 85% of costs for one child under max', () => {
      const input = { children: 1, childcareCosts: 500 };
      const result = calculator.calculateChildcareElement(input, rates);
      expect(result).toBeCloseTo(425, 2); // 500 × 0.85
    });

    test('should cap at max amount for one child', () => {
      const input = { children: 1, childcareCosts: 2000 };
      const result = calculator.calculateChildcareElement(input, rates);
      expect(result).toBeCloseTo(1031.88, 2);
    });

    test('should calculate 85% of costs for two+ children under max', () => {
      const input = { children: 2, childcareCosts: 1000 };
      const result = calculator.calculateChildcareElement(input, rates);
      expect(result).toBeCloseTo(850, 2); // 1000 × 0.85
    });

    test('should cap at max amount for two or more children', () => {
      const input = { children: 2, childcareCosts: 3000 };
      const result = calculator.calculateChildcareElement(input, rates);
      expect(result).toBeCloseTo(1768.94, 2);
    });

    test('should handle exactly max amount for one child', () => {
      const input = { children: 1, childcareCosts: 1031.88 / 0.85 };
      const result = calculator.calculateChildcareElement(input, rates);
      expect(result).toBeCloseTo(1031.88, 2);
    });
  });

  describe('Full calculation integration tests', () => {
    test('should calculate correctly for single person under 25, no children, not working', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 22,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'not_working',
        monthlyEarnings: 0,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.standardAllowance).toBe(316.98);
      expect(result.calculation.housingElement).toBe(0);
      expect(result.calculation.childElement).toBe(0);
      expect(result.calculation.finalAmount).toBe(316.98);
    });

    test('should calculate correctly for single person 25+, no children, not working', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 25,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'not_working',
        monthlyEarnings: 0,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.standardAllowance).toBe(400.14);
      expect(result.calculation.finalAmount).toBe(400.14);
    });

    test('should calculate correctly for couple both under 25', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'couple',
        age: 22,
        partnerAge: 23,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'not_working',
        monthlyEarnings: 0,
        partnerEmploymentType: 'not_working',
        partnerMonthlyEarnings: 0,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.standardAllowance).toBe(497.55);
      expect(result.calculation.finalAmount).toBe(497.55);
    });

    test('should calculate correctly for couple with one person 25+', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'couple',
        age: 30,
        partnerAge: 24,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'not_working',
        monthlyEarnings: 0,
        partnerEmploymentType: 'not_working',
        partnerMonthlyEarnings: 0,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.standardAllowance).toBe(628.10);
      expect(result.calculation.finalAmount).toBe(628.10);
    });

    test('should apply capital deduction for savings over £6,000', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 30,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'not_working',
        monthlyEarnings: 0,
        savings: 8000
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.standardAllowance).toBe(400.14);
      expect(result.calculation.capitalDeduction).toBeCloseTo(34.80, 2);
      expect(result.calculation.finalAmount).toBeCloseTo(365.34, 2);
    });

    test('should apply work allowance correctly for single with child and no housing', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 30,
        children: 1,
        childAges: [5],
        housingStatus: 'no_housing_costs',
        employmentType: 'employed',
        monthlyEarnings: 684,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.workAllowance).toBe(684);
      expect(result.calculation.earningsReduction).toBe(0);
    });

    test('should handle social housing rent correctly', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 30,
        children: 0,
        housingStatus: 'renting',
        tenantType: 'social',
        rent: 200,
        serviceCharges: 0,
        employmentType: 'employed',
        monthlyEarnings: 100,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.standardAllowance).toBe(400.14);
      expect(result.calculation.housingElement).toBe(200);
      expect(result.calculation.totalElements).toBeCloseTo(600.14, 2);
      expect(result.calculation.finalAmount).toBeCloseTo(600.14, 2);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle missing tax year by defaulting to 2025_26', () => {
      const input = {
        circumstances: 'single',
        age: 30,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'not_working',
        monthlyEarnings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.taxYear).toBe('2025_26');
    });

    test('should handle negative earnings as 0', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 30,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'employed',
        monthlyEarnings: -500,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.earningsReduction).toBe(0);
    });

    test('should never return negative final amount', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 30,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'employed',
        monthlyEarnings: 5000,
        savings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.finalAmount).toBeGreaterThanOrEqual(0);
    });

    test('should handle undefined partner age for single person', () => {
      const input = {
        taxYear: '2025_26',
        circumstances: 'single',
        age: 30,
        children: 0,
        housingStatus: 'no_housing_costs',
        employmentType: 'not_working',
        monthlyEarnings: 0
      };

      const result = calculator.calculate(input);

      expect(result.success).toBe(true);
      expect(result.calculation.standardAllowance).toBe(400.14);
    });
  });
});
