/**
 * Jest Tests for CalculatorForm Component
 * Tests form rendering and user interactions
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CalculatorForm from '../CalculatorForm';

// Mock the hooks and components
jest.mock('../../../../hooks/useTextManager', () => ({
  useTextManager: () => ({
    getTextValue: (key, defaultValue) => defaultValue
  })
}));

// Mock child components
jest.mock('../NetEarningsModule', () => {
  return function NetEarningsModule() {
    return <div data-testid="net-earnings-module">Net Earnings Module</div>;
  };
});

jest.mock('../CarerModule', () => {
  return function CarerModule() {
    return <div data-testid="carer-module">Carer Module</div>;
  };
});

jest.mock('../../../shared/components/AmountInputWithPeriod', () => {
  return function AmountInputWithPeriod({ label, value, onChange }) {
    return (
      <div data-testid="amount-input">
        <label>{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    );
  };
});

jest.mock('../../utils/lhaDataService', () => ({
  getGroupedBRMAs: () => ({
    England: [
      { value: 'Central London', label: 'Central London' },
      { value: 'Central Greater Manchester', label: 'Central Greater Manchester' }
    ],
    Scotland: [
      { value: 'Edinburgh', label: 'Edinburgh' }
    ],
    Wales: [
      { value: 'Cardiff', label: 'Cardiff' }
    ]
  })
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CalculatorForm', () => {
  const defaultFormData = {
    taxYear: '2025_26',
    circumstances: 'single',
    age: 30,
    partnerAge: null,
    children: 0,
    childAges: [],
    housingStatus: 'no_housing_costs',
    tenantType: 'social',
    rent: 0,
    serviceCharges: 0,
    bedrooms: 1,
    brma: '',
    employmentType: 'not_working',
    monthlyEarnings: 0,
    partnerEmploymentType: 'not_working',
    partnerMonthlyEarnings: 0,
    childcareCosts: 0,
    savings: 0,
    hasLCWRA: 'no',
    isCarer: 'no',
    partnerIsCarer: 'no'
  };

  const mockOnFormChange = jest.fn();
  const mockOnCalculate = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render the form with all main sections', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      expect(screen.getByText('Your Details')).toBeInTheDocument();
      expect(screen.getByText('Tax Year')).toBeInTheDocument();
    });

    test('should render tax year radio buttons with 2025/26 selected by default', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      const taxYear2025 = screen.getByLabelText(/2025\/26/i);
      expect(taxYear2025).toBeChecked();
    });

    test('should show partner age field when circumstances is couple', () => {
      const coupleFormData = { ...defaultFormData, circumstances: 'couple' };

      renderWithRouter(
        <CalculatorForm
          formData={coupleFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      // Partner age field should be visible for couples
      const ageInputs = screen.getAllByRole('spinbutton');
      expect(ageInputs.length).toBeGreaterThan(1);
    });

    test('should not show BRMA dropdown when tenant type is not private', () => {
      const socialTenantFormData = {
        ...defaultFormData,
        housingStatus: 'renting',
        tenantType: 'social'
      };

      renderWithRouter(
        <CalculatorForm
          formData={socialTenantFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      // BRMA select should not be present for social tenants
      const brmaSelects = screen.queryAllByRole('combobox', { name: /brma/i });
      expect(brmaSelects.length).toBe(0);
    });
  });

  describe('Form Interactions', () => {
    test('should call onFormChange when tax year is changed', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      const taxYear2024 = screen.getByLabelText(/2024\/25/i);
      fireEvent.click(taxYear2024);

      expect(mockOnFormChange).toHaveBeenCalledWith('taxYear', '2024_25');
    });

    test('should call onFormChange when circumstances is changed', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      // Find circumstances radio buttons
      const coupleRadio = screen.getByLabelText(/couple/i);
      fireEvent.click(coupleRadio);

      expect(mockOnFormChange).toHaveBeenCalledWith('circumstances', 'couple');
    });

    test('should call onFormChange when age is changed', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      const ageInput = screen.getAllByRole('spinbutton')[0];
      fireEvent.change(ageInput, { target: { value: '25' } });

      expect(mockOnFormChange).toHaveBeenCalled();
    });

    test('should call onCalculate when calculate button is clicked', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      expect(mockOnCalculate).toHaveBeenCalledTimes(1);
    });

    test('should call onReset when reset button is clicked', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset/i });
      fireEvent.click(resetButton);

      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation', () => {
    test('should display validation error for missing BRMA when required', () => {
      const privateTenantFormData = {
        ...defaultFormData,
        housingStatus: 'renting',
        tenantType: 'private',
        brma: ''
      };

      const validationErrors = {
        brma: 'Please select a BRMA for private tenants'
      };

      renderWithRouter(
        <CalculatorForm
          formData={privateTenantFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
          validationErrors={validationErrors}
        />
      );

      expect(screen.getByText(/please select a brma/i)).toBeInTheDocument();
    });

    test('should display validation error for invalid age', () => {
      const validationErrors = {
        age: 'Age must be between 18 and 100'
      };

      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
          validationErrors={validationErrors}
        />
      );

      expect(screen.getByText(/age must be between/i)).toBeInTheDocument();
    });
  });

  describe('Conditional Fields', () => {
    test('should show rent and service charges when housing status is renting', () => {
      const rentingFormData = {
        ...defaultFormData,
        housingStatus: 'renting'
      };

      renderWithRouter(
        <CalculatorForm
          formData={rentingFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      // Should show rent-related fields
      expect(screen.getByText(/rent/i)).toBeInTheDocument();
    });

    test('should show employment fields when employment type is employed', () => {
      const employedFormData = {
        ...defaultFormData,
        employmentType: 'employed'
      };

      renderWithRouter(
        <CalculatorForm
          formData={employedFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      // Should show earnings module
      expect(screen.getByTestId('net-earnings-module')).toBeInTheDocument();
    });

    test('should show childcare costs when children > 0', () => {
      const formDataWithChildren = {
        ...defaultFormData,
        children: 2,
        childAges: [5, 8]
      };

      renderWithRouter(
        <CalculatorForm
          formData={formDataWithChildren}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      // Should show childcare-related fields
      expect(screen.getByText(/childcare/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper labels for all form inputs', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      // Check that major fields have labels
      expect(screen.getByText(/tax year/i)).toBeInTheDocument();
      expect(screen.getByText(/circumstances/i)).toBeInTheDocument();
    });

    test('should have buttons with proper roles', () => {
      renderWithRouter(
        <CalculatorForm
          formData={defaultFormData}
          onFormChange={mockOnFormChange}
          onCalculate={mockOnCalculate}
          onReset={mockOnReset}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      const resetButton = screen.getByRole('button', { name: /reset/i });

      expect(calculateButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });
  });
});
