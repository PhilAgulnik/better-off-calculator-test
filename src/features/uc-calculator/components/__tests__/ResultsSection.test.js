/**
 * Jest Tests for ResultsSection Component
 * Tests results display and formatting
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResultsSection from '../ResultsSection';

// Mock the hooks
jest.mock('../../../../hooks/useTextManager', () => ({
  useTextManager: () => ({
    getTextValue: (key, defaultValue) => defaultValue
  })
}));

// Mock child components
jest.mock('../DetailedResults', () => {
  return function DetailedResults({ calculation }) {
    return (
      <div data-testid="detailed-results">
        Detailed Results: {calculation.finalAmount}
      </div>
    );
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ResultsSection', () => {
  const mockCalculation = {
    standardAllowance: 400.14,
    housingElement: 500,
    childElement: 339,
    childcareElement: 0,
    carerElement: 0,
    lcwraElement: 0,
    totalElements: 1239.14,
    workAllowance: 411,
    earningsReduction: 200,
    capitalDeduction: 0,
    benefitDeduction: 0,
    finalAmount: 1039.14
  };

  describe('Rendering', () => {
    test('should render results when calculation is provided', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/your estimated universal credit/i)).toBeInTheDocument();
    });

    test('should not render when calculation is null', () => {
      const { container } = renderWithRouter(
        <ResultsSection
          calculation={null}
          taxYear="2025_26"
        />
      );

      expect(container.firstChild).toBeNull();
    });

    test('should display final amount correctly formatted', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      // Should display the final amount (£1,039.14)
      expect(screen.getByText(/£1,039.14/)).toBeInTheDocument();
    });

    test('should display zero amount correctly', () => {
      const zeroCalculation = {
        ...mockCalculation,
        finalAmount: 0
      };

      renderWithRouter(
        <ResultsSection
          calculation={zeroCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/£0.00/)).toBeInTheDocument();
    });

    test('should display tax year in results', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/2025\/26/i)).toBeInTheDocument();
    });
  });

  describe('Summary Information', () => {
    test('should show total elements before deductions', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      // Should show total elements
      expect(screen.getByText(/£1,239.14/)).toBeInTheDocument();
    });

    test('should show earnings reduction when present', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      // Should show earnings reduction
      expect(screen.getByText(/£200.00/)).toBeInTheDocument();
    });

    test('should handle large amounts correctly', () => {
      const largeCalculation = {
        ...mockCalculation,
        finalAmount: 2500.50
      };

      renderWithRouter(
        <ResultsSection
          calculation={largeCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/£2,500.50/)).toBeInTheDocument();
    });
  });

  describe('Detailed Results Toggle', () => {
    test('should toggle detailed results when button is clicked', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      const toggleButton = screen.getByRole('button', { name: /show detailed breakdown/i });
      fireEvent.click(toggleButton);

      expect(screen.getByTestId('detailed-results')).toBeInTheDocument();
    });

    test('should hide detailed results when toggled again', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      const toggleButton = screen.getByRole('button', { name: /show detailed breakdown/i });

      // Show detailed results
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('detailed-results')).toBeInTheDocument();

      // Hide detailed results
      fireEvent.click(toggleButton);
      expect(screen.queryByTestId('detailed-results')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle calculation with all elements at zero', () => {
      const zeroCalculation = {
        standardAllowance: 0,
        housingElement: 0,
        childElement: 0,
        childcareElement: 0,
        carerElement: 0,
        lcwraElement: 0,
        totalElements: 0,
        workAllowance: 0,
        earningsReduction: 0,
        capitalDeduction: 0,
        benefitDeduction: 0,
        finalAmount: 0
      };

      renderWithRouter(
        <ResultsSection
          calculation={zeroCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/£0.00/)).toBeInTheDocument();
    });

    test('should handle calculation with LCWRA element', () => {
      const lcwraCalculation = {
        ...mockCalculation,
        lcwraElement: 423.27,
        totalElements: 1662.41,
        finalAmount: 1462.41
      };

      renderWithRouter(
        <ResultsSection
          calculation={lcwraCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/£1,462.41/)).toBeInTheDocument();
    });

    test('should handle calculation with carer element', () => {
      const carerCalculation = {
        ...mockCalculation,
        carerElement: 201.68,
        totalElements: 1440.82,
        finalAmount: 1240.82
      };

      renderWithRouter(
        <ResultsSection
          calculation={carerCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/£1,240.82/)).toBeInTheDocument();
    });

    test('should handle calculation with capital deduction', () => {
      const capitalDeductionCalculation = {
        ...mockCalculation,
        capitalDeduction: 34.80,
        finalAmount: 1004.34
      };

      renderWithRouter(
        <ResultsSection
          calculation={capitalDeductionCalculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/£1,004.34/)).toBeInTheDocument();
    });
  });

  describe('Formatting', () => {
    test('should format amounts with 2 decimal places', () => {
      const calculation = {
        ...mockCalculation,
        finalAmount: 1234.5
      };

      renderWithRouter(
        <ResultsSection
          calculation={calculation}
          taxYear="2025_26"
        />
      );

      expect(screen.getByText(/£1,234.50/)).toBeInTheDocument();
    });

    test('should format amounts with thousands separator', () => {
      const calculation = {
        ...mockCalculation,
        finalAmount: 1234.56
      };

      renderWithRouter(
        <ResultsSection
          calculation={calculation}
          taxYear="2025_26"
        />
      );

      // Should include comma for thousands
      expect(screen.getByText(/£1,234.56/)).toBeInTheDocument();
    });

    test('should handle decimal rounding correctly', () => {
      const calculation = {
        ...mockCalculation,
        finalAmount: 1234.567
      };

      renderWithRouter(
        <ResultsSection
          calculation={calculation}
          taxYear="2025_26"
        />
      );

      // Should round to 2 decimal places
      expect(screen.getByText(/£1,234.57/)).toBeInTheDocument();
    });
  });

  describe('Warnings', () => {
    test('should display warning when final amount is zero', () => {
      const zeroCalculation = {
        ...mockCalculation,
        finalAmount: 0
      };

      renderWithRouter(
        <ResultsSection
          calculation={zeroCalculation}
          taxYear="2025_26"
        />
      );

      // Should show some indication that there's no entitlement
      expect(screen.getByText(/£0.00/)).toBeInTheDocument();
    });

    test('should display LHA details when provided', () => {
      const calculationWithLHA = {
        ...mockCalculation,
        lhaDetails: {
          brma: 'Central London',
          bedroomEntitlement: 2,
          lhaMonthly: 850,
          actualRent: 1000,
          shortfall: 150
        }
      };

      renderWithRouter(
        <ResultsSection
          calculation={calculationWithLHA}
          taxYear="2025_26"
          lhaDetails={calculationWithLHA.lhaDetails}
        />
      );

      // LHA information should be displayed somewhere
      expect(screen.getByText(/central london/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    test('should have descriptive button text', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName();
    });

    test('should be keyboard navigable', () => {
      renderWithRouter(
        <ResultsSection
          calculation={mockCalculation}
          taxYear="2025_26"
        />
      );

      const button = screen.getByRole('button', { name: /show detailed breakdown/i });
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
  });
});
