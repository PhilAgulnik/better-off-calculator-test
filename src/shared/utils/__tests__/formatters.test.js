/**
 * Jest Tests for Formatting Utilities
 * Tests currency and number formatting functions
 */

import { formatCurrency, formatNumber, formatPercentage } from '../formatters';

describe('Formatters Utility Functions', () => {
  describe('formatCurrency', () => {
    test('should format basic currency amount', () => {
      expect(formatCurrency(1234.56)).toBe('£1,234.56');
    });

    test('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('£0.00');
    });

    test('should format negative amounts', () => {
      expect(formatCurrency(-500.50)).toBe('-£500.50');
    });

    test('should round to 2 decimal places', () => {
      expect(formatCurrency(123.456)).toBe('£123.46');
      expect(formatCurrency(123.454)).toBe('£123.45');
    });

    test('should add thousands separator', () => {
      expect(formatCurrency(1000000)).toBe('£1,000,000.00');
    });

    test('should handle very small amounts', () => {
      expect(formatCurrency(0.01)).toBe('£0.01');
      expect(formatCurrency(0.99)).toBe('£0.99');
    });

    test('should handle undefined as zero', () => {
      expect(formatCurrency(undefined)).toBe('£0.00');
    });

    test('should handle null as zero', () => {
      expect(formatCurrency(null)).toBe('£0.00');
    });

    test('should handle NaN as zero', () => {
      expect(formatCurrency(NaN)).toBe('£0.00');
    });

    test('should handle string numbers', () => {
      expect(formatCurrency('1234.56')).toBe('£1,234.56');
    });

    test('should format typical UC amounts correctly', () => {
      expect(formatCurrency(400.14)).toBe('£400.14');
      expect(formatCurrency(316.98)).toBe('£316.98');
      expect(formatCurrency(628.10)).toBe('£628.10');
      expect(formatCurrency(423.27)).toBe('£423.27');
    });

    test('should handle edge case: exactly 1000', () => {
      expect(formatCurrency(1000)).toBe('£1,000.00');
    });

    test('should handle edge case: 999.99', () => {
      expect(formatCurrency(999.99)).toBe('£999.99');
    });

    test('should format decimal-heavy amounts', () => {
      expect(formatCurrency(34.80)).toBe('£34.80');
      expect(formatCurrency(69.60)).toBe('£69.60');
    });
  });

  describe('formatNumber', () => {
    test('should format basic numbers', () => {
      expect(formatNumber(1234)).toBe('1,234');
    });

    test('should format zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    test('should add thousands separator', () => {
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    test('should handle decimals', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });

    test('should handle negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-1,234');
    });

    test('should handle undefined', () => {
      expect(formatNumber(undefined)).toBe('0');
    });

    test('should handle null', () => {
      expect(formatNumber(null)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    test('should format basic percentage', () => {
      expect(formatPercentage(55)).toBe('55.0%');
    });

    test('should format zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
    });

    test('should format 100%', () => {
      expect(formatPercentage(100)).toBe('100.0%');
    });

    test('should handle decimals', () => {
      expect(formatPercentage(55.5)).toBe('55.5%');
    });

    test('should format taper rate correctly', () => {
      expect(formatPercentage(55)).toBe('55.0%');
    });

    test('should format childcare percentage correctly', () => {
      expect(formatPercentage(85)).toBe('85.0%');
    });

    test('should handle undefined', () => {
      expect(formatPercentage(undefined)).toBe('0%');
    });

    test('should handle null', () => {
      expect(formatPercentage(null)).toBe('0%');
    });

    test('should handle percentages over 100%', () => {
      expect(formatPercentage(150)).toBe('150.0%');
    });

    test('should handle no decimals parameter', () => {
      expect(formatPercentage(55, 0)).toBe('55%');
    });
  });

  describe('Integration - Formatting UC Calculator Values', () => {
    test('should format standard allowances correctly', () => {
      const rates2025 = {
        singleUnder25: 316.98,
        singleOver25: 400.14,
        coupleUnder25: 497.55,
        coupleOver25: 628.10
      };

      expect(formatCurrency(rates2025.singleUnder25)).toBe('£316.98');
      expect(formatCurrency(rates2025.singleOver25)).toBe('£400.14');
      expect(formatCurrency(rates2025.coupleUnder25)).toBe('£497.55');
      expect(formatCurrency(rates2025.coupleOver25)).toBe('£628.10');
    });

    test('should format child elements correctly', () => {
      const childElements = {
        preTwoChildLimit: 339.00,
        postTwoChildLimit: 292.81
      };

      expect(formatCurrency(childElements.preTwoChildLimit)).toBe('£339.00');
      expect(formatCurrency(childElements.postTwoChildLimit)).toBe('£292.81');
    });

    test('should format LCWRA and carer elements correctly', () => {
      const elements = {
        lcwra: 423.27,
        carer: 201.68
      };

      expect(formatCurrency(elements.lcwra)).toBe('£423.27');
      expect(formatCurrency(elements.carer)).toBe('£201.68');
    });

    test('should format work allowances correctly', () => {
      const workAllowances = {
        withHousing: 411,
        withoutHousing: 684
      };

      expect(formatCurrency(workAllowances.withHousing)).toBe('£411.00');
      expect(formatCurrency(workAllowances.withoutHousing)).toBe('£684.00');
    });

    test('should format capital deductions correctly', () => {
      const deductions = [0, 4.35, 8.70, 34.80, 69.60, 174.00];

      deductions.forEach(deduction => {
        const formatted = formatCurrency(deduction);
        expect(formatted).toMatch(/^£\d+\.\d{2}$/);
      });
    });

    test('should format taper rate correctly', () => {
      expect(formatPercentage(55)).toBe('55.0%');
    });

    test('should format childcare max percentage correctly', () => {
      expect(formatPercentage(85)).toBe('85.0%');
    });

    test('should format typical final amounts', () => {
      const finalAmounts = [
        0,
        316.98,
        400.14,
        1064.85,
        1035.74,
        2128.68
      ];

      finalAmounts.forEach(amount => {
        const formatted = formatCurrency(amount);
        expect(formatted).toMatch(/^£[\d,]+\.\d{2}$/);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle Infinity', () => {
      expect(formatCurrency(Infinity)).toBe('£0.00');
    });

    test('should handle -Infinity', () => {
      expect(formatCurrency(-Infinity)).toBe('£0.00');
    });

    test('should handle very large numbers', () => {
      expect(formatCurrency(999999999.99)).toBe('£999,999,999.99');
    });

    test('should handle very small decimals', () => {
      expect(formatCurrency(0.001)).toBe('£0.00');
    });

    test('should handle rounding edge cases', () => {
      expect(formatCurrency(0.005)).toBe('£0.01');
      expect(formatCurrency(0.004)).toBe('£0.00');
    });

    test('should handle scientific notation', () => {
      expect(formatCurrency(1e6)).toBe('£1,000,000.00');
    });
  });

  describe('Performance', () => {
    test('should format many values quickly', () => {
      const start = Date.now();
      for (let i = 0; i < 10000; i++) {
        formatCurrency(Math.random() * 10000);
      }
      const elapsed = Date.now() - start;

      // Should complete 10,000 operations in under 1 second
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
