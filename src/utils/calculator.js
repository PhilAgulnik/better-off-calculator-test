/**
 * Universal Credit Calculator - React Version
 * Simplified calculator that provides basic Universal Credit calculations
 */

export class UniversalCreditCalculator {
  constructor() {
    this.rates = {
      '2025_26': {
        standardAllowance: {
          single: { under25: 311.68, over25: 393.45 },
          couple: { under25: 489.23, over25: 617.60 }
        },
        childElement: {
          first: 315.00,
          additional: 269.58
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmount: 950.92
        },
        workAllowance: {
          single: { withHousing: 379, withoutHousing: 631 },
          couple: { withHousing: 379, withoutHousing: 631 }
        },
        taperRate: 0.55,
        carerElement: 185.86,
        // Capital limits
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04, // £4.35 per £250 over £6,000
        // LHA rates (simplified - would need postcode lookup in full implementation)
        lhaRates: {
          shared: 300,
          oneBed: 400,
          twoBed: 500,
          threeBed: 600,
          fourBed: 700
        }
      },
      '2024_25': {
        standardAllowance: {
          single: { under25: 311.68, over25: 393.45 },
          couple: { under25: 489.23, over25: 617.60 }
        },
        childElement: {
          first: 315.00,
          additional: 269.58
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmount: 950.92
        },
        workAllowance: {
          single: { withHousing: 379, withoutHousing: 631 },
          couple: { withHousing: 379, withoutHousing: 631 }
        },
        taperRate: 0.55,
        carerElement: 185.86,
        // Capital limits
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04,
        // LHA rates (simplified)
        lhaRates: {
          shared: 300,
          oneBed: 400,
          twoBed: 500,
          threeBed: 600,
          fourBed: 700
        }
      },
      '2023_24': {
        standardAllowance: {
          single: { under25: 292.11, over25: 368.74 },
          couple: { under25: 458.51, over25: 578.82 }
        },
        childElement: {
          first: 315.00,
          additional: 269.58
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmount: 950.92
        },
        workAllowance: {
          single: { withHousing: 379, withoutHousing: 631 },
          couple: { withHousing: 379, withoutHousing: 631 }
        },
        taperRate: 0.55,
        carerElement: 185.86,
        // Capital limits
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04,
        // LHA rates (simplified)
        lhaRates: {
          shared: 300,
          oneBed: 400,
          twoBed: 500,
          threeBed: 600,
          fourBed: 700
        }
      }
    };
  }

  async initialize() {
    // In a real implementation, this might load rates from an API
    console.log('Universal Credit Calculator initialized');
    return true;
  }

  calculate(input) {
    try {
      const taxYear = input.taxYear || '2025_26';
      const rates = this.rates[taxYear];
      
      if (!rates) {
        throw new Error(`Tax year ${taxYear} not supported`);
      }

      // Calculate standard allowance
      const standardAllowance = this.calculateStandardAllowance(input, rates);
      
             // Calculate housing element
       const housingElement = this.calculateHousingElement(input, rates);
      
      // Calculate child element
      const childElement = this.calculateChildElement(input, rates);
      
      // Calculate childcare element
      const childcareElement = this.calculateChildcareElement(input, rates);
      
             // Calculate carer element
       const carerElement = this.calculateCarerElement(input, rates);
      
      // Calculate total elements
      const totalElements = standardAllowance + housingElement + childElement + childcareElement + carerElement;
      
      // Calculate earnings reduction
      const earningsReduction = this.calculateEarningsReduction(input, rates, totalElements);
      
             // Calculate other deductions
       const capitalDeduction = this.calculateCapitalDeduction(input, totalElements, rates);
       const benefitDeduction = this.calculateBenefitDeduction(input);
      
      // Calculate final amount
      const finalAmount = Math.max(0, totalElements - earningsReduction - capitalDeduction - benefitDeduction);

      return {
        success: true,
        taxYear,
        calculation: {
          standardAllowance,
          housingElement,
          childElement,
          childcareElement,
          carerElement,
          totalElements,
          earningsReduction,
          capitalDeduction,
          benefitDeduction,
          finalAmount
        },
        warnings: this.generateWarnings(input),
        calculatedAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message],
        calculatedAt: new Date().toISOString()
      };
    }
  }

  calculateStandardAllowance(input, rates) {
    const { circumstances, age, partnerAge } = input;
    const standardRates = rates.standardAllowance;
    
    if (circumstances === 'single') {
      return age < 25 ? standardRates.single.under25 : standardRates.single.over25;
    } else {
      const maxAge = Math.max(age, partnerAge);
      return maxAge < 25 ? standardRates.couple.under25 : standardRates.couple.over25;
    }
  }

  calculateHousingElement(input, rates) {
    const { rent, serviceCharges, tenantType, bedrooms } = input;
    
    if (tenantType === 'private') {
      // Use LHA rates based on number of bedrooms
      let lhaRate = rates.lhaRates.oneBed; // Default
      if (bedrooms === 0) lhaRate = rates.lhaRates.shared;
      else if (bedrooms === 2) lhaRate = rates.lhaRates.twoBed;
      else if (bedrooms === 3) lhaRate = rates.lhaRates.threeBed;
      else if (bedrooms >= 4) lhaRate = rates.lhaRates.fourBed;
      
      return Math.min(rent + serviceCharges, lhaRate);
    } else {
      // Social housing - simplified calculation
      return rent + serviceCharges;
    }
  }

  calculateChildElement(input, rates) {
    const { children } = input;
    if (children === 0) return 0;
    
    const firstChild = rates.childElement.first;
    const additionalChildren = (children - 1) * rates.childElement.additional;
    
    return firstChild + additionalChildren;
  }

  calculateChildcareElement(input, rates) {
    const { childcareCosts, children } = input;
    if (children === 0 || childcareCosts === 0) return 0;
    
    const maxAmount = rates.childcareElement.maxAmount;
    const percentage = rates.childcareElement.maxPercentage / 100;
    
    return Math.min(childcareCosts * percentage, maxAmount);
  }

  calculateCarerElement(input, rates) {
    const { 
      isCarer, 
      isPartnerCarer, 
      circumstances,
      includeCarerElement,
      partnerIncludeCarerElement
    } = input;
    
    let carerElement = 0;
    
    // Check if client is a carer and wants carer element included
    if (isCarer === 'yes' && includeCarerElement === 'yes') {
      carerElement += rates.carerElement;
    }
    
    // Check if partner is a carer and wants carer element included
    if (circumstances === 'couple' && isPartnerCarer === 'yes' && partnerIncludeCarerElement === 'yes') {
      carerElement += rates.carerElement;
    }
    
    return carerElement;
  }

  calculateEarningsReduction(input, rates, totalElements) {
    const { monthlyEarnings, circumstances } = input;
    const workAllowance = rates.workAllowance[circumstances].withHousing;
    const taperRate = rates.taperRate;
    
    if (monthlyEarnings <= workAllowance) {
      return 0;
    }
    
    const excessEarnings = monthlyEarnings - workAllowance;
    return excessEarnings * taperRate;
  }

  calculateCapitalDeduction(input, totalElements, rates) {
    const { savings } = input;
    
    if (savings <= rates.capitalLowerLimit) {
      return 0;
    } else if (savings <= rates.capitalUpperLimit) {
      return (savings - rates.capitalLowerLimit) * rates.capitalDeductionRate;
    } else {
      return totalElements; // No UC if savings over upper limit
    }
  }

  calculateBenefitDeduction(input) {
    const { otherBenefits, otherBenefitsPeriod } = input;
    
    // Convert to monthly if needed
    let monthlyBenefits = otherBenefits;
    switch (otherBenefitsPeriod) {
      case 'weekly':
        monthlyBenefits = otherBenefits * 4.33;
        break;
      case 'fortnightly':
        monthlyBenefits = otherBenefits * 2.17;
        break;
      case 'yearly':
        monthlyBenefits = otherBenefits / 12;
        break;
      default:
        monthlyBenefits = otherBenefits;
    }
    
    return monthlyBenefits;
  }

  generateWarnings(input) {
    const warnings = [];
    
    if (input.monthlyEarnings > 5000) {
      warnings.push('High earnings may result in no Universal Credit entitlement');
    }
    
    if (input.savings > 15000) {
      warnings.push('High savings may affect Universal Credit entitlement');
    }
    
    if (input.rent > 2000) {
      warnings.push('High rent amount - verify this is correct');
    }
    
    return warnings;
  }

  exportCalculation() {
    return {
      calculator: 'Universal Credit Calculator React',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      rates: this.rates
    };
  }

  // New method for testing comparison
  exportCalculationForTesting(input, results) {
    return {
      metadata: {
        calculator: 'Universal Credit Calculator React',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        taxYear: input.taxYear
      },
      input: {
        // Personal Details
        taxYear: input.taxYear,
        circumstances: input.circumstances,
        age: input.age,
        partnerAge: input.partnerAge,
        children: input.children,
        childAges: input.childAges || [],
        childDisabilities: input.childDisabilities || [],
        
        // Housing
        housingStatus: input.housingStatus,
        tenantType: input.tenantType,
        rent: input.rent,
        serviceCharges: input.serviceCharges,
        bedrooms: input.bedrooms,
        area: input.area,
        nonDependants: input.nonDependants,
        
        // Employment
        employmentType: input.employmentType,
        monthlyEarnings: input.monthlyEarnings,
        childcareCosts: input.childcareCosts,
        
        // Self-employed fields
        businessIncomeBank: input.businessIncomeBank,
        businessIncomeCash: input.businessIncomeCash,
        businessExpensesRent: input.businessExpensesRent,
        businessExpensesRates: input.businessExpensesRates,
        businessExpensesUtilities: input.businessExpensesUtilities,
        businessExpensesInsurance: input.businessExpensesInsurance,
        businessExpensesTelephone: input.businessExpensesTelephone,
        businessExpensesMarketing: input.businessExpensesMarketing,
        businessExpensesVehicle: input.businessExpensesVehicle,
        businessExpensesEquipment: input.businessExpensesEquipment,
        businessExpensesPostage: input.businessExpensesPostage,
        businessExpensesTransport: input.businessExpensesTransport,
        businessExpensesProfessional: input.businessExpensesProfessional,
        businessTax: input.businessTax,
        businessNIC: input.businessNIC,
        businessPension: input.businessPension,
        businessCarMiles: input.businessCarMiles,
        businessHomeHours: input.businessHomeHours,
        
        // Carer details
        isCarer: input.isCarer,
        isPartnerCarer: input.isPartnerCarer,
        currentlyReceivingCarersAllowance: input.currentlyReceivingCarersAllowance,
        partnerCurrentlyReceivingCarersAllowance: input.partnerCurrentlyReceivingCarersAllowance,
        caringHours: input.caringHours,
        partnerCaringHours: input.partnerCaringHours,
        personReceivesBenefits: input.personReceivesBenefits,
        partnerPersonReceivesBenefits: input.partnerPersonReceivesBenefits,
        includeCarersAllowance: input.includeCarersAllowance,
        partnerIncludeCarersAllowance: input.partnerIncludeCarersAllowance,
        includeCarerElement: input.includeCarerElement,
        partnerIncludeCarerElement: input.partnerIncludeCarerElement,
        
        // Other
        savings: input.savings,
        otherBenefits: input.otherBenefits,
        otherBenefitsPeriod: input.otherBenefitsPeriod
      },
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
        finalAmount: results.calculation.finalAmount,
        warnings: results.warnings || []
      },
      calculationDetails: {
        workAllowance: results.calculation.workAllowance || 0,
        taperRate: results.calculation.taperRate || 0.55,
        lhaRate: results.calculation.lhaRate || 0
      }
    };
  }
}
