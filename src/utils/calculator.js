import { getLHARate, convertLHAToMonthly, lhaRates2025_26 } from './lhaDataService';
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
        lcwraElement: 390.06,
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
        lcwraElement: 390.06,
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
        lcwraElement: 390.06,
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
      
      console.log('Calculator received input:', input);
      console.log('Calculator using tax year:', taxYear);
      console.log('Calculator rates:', rates);
      
      if (!rates) {
        throw new Error(`Tax year ${taxYear} not supported`);
      }

      // Calculate standard allowance
      const standardAllowance = this.calculateStandardAllowance(input, rates);
      
      // Calculate housing element
      const { amount: housingElement, lhaDetails } = this.calculateHousingElement(input, rates);
      
      // Calculate child element
      const childElement = this.calculateChildElement(input, rates);
      
      // Calculate childcare element
      const childcareElement = this.calculateChildcareElement(input, rates);
      
             // Calculate carer element
       const carerElement = this.calculateCarerElement(input, rates);
      
      // Calculate LCWRA element
      const lcwraElement = this.calculateLCWRAElement(input, rates);
      
      // Calculate total elements
      const totalElements = standardAllowance + housingElement + childElement + childcareElement + carerElement + lcwraElement;
      
      // Calculate earnings reduction
      const earningsReduction = this.calculateEarningsReduction(input, rates, totalElements);
      
      // Calculate other deductions
      const capitalDeductionResult = this.calculateCapitalDeduction(input, totalElements, rates);
      const benefitDeduction = this.calculateBenefitDeduction(input);
      
      // Calculate final amount
      const finalAmount = Math.max(0, totalElements - earningsReduction - capitalDeductionResult.deduction - benefitDeduction);

      return {
        success: true,
        taxYear,
        calculation: {
          standardAllowance,
          housingElement,
          childElement,
          childcareElement,
          carerElement,
          lcwraElement,
          totalElements,
          earningsReduction,
          capitalDeduction: capitalDeductionResult.deduction,
          capitalDeductionDetails: capitalDeductionResult,
          benefitDeduction,
          finalAmount,
          lhaDetails
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
    const { rent = 0, serviceCharges = 0, tenantType, bedrooms, brma, age = 25, partnerAge = 25, circumstances = 'single', children = 0, childAges = [], childGenders = [] } = input;
    
    if (tenantType === 'private') {
      // Calculate bedroom entitlement
      const bedroomEntitlement = this.calculateBedroomEntitlement({ circumstances, children, childAges, childGenders, age, partnerAge });
      
      // Determine LHA weekly rate and convert to monthly if BRMA provided
      let lhaWeekly = null;
      let lhaMonthly = null;
      if (brma) {
        lhaWeekly = getLHARate(brma, bedroomEntitlement);
        lhaMonthly = convertLHAToMonthly(lhaWeekly);
      }
      
      // Fallback to simplified internal rates if BRMA not selected
      if (!lhaMonthly) {
        let fallback = rates.lhaRates.oneBed; // default monthly
        if (bedroomEntitlement === 'shared' || bedroomEntitlement === 0) fallback = rates.lhaRates.shared;
        else if (bedroomEntitlement === 2) fallback = rates.lhaRates.twoBed;
        else if (bedroomEntitlement === 3) fallback = rates.lhaRates.threeBed;
        else if (bedroomEntitlement >= 4) fallback = rates.lhaRates.fourBed;
        lhaMonthly = fallback;
      }
      
      const eligibleRent = Math.min(rent + serviceCharges, lhaMonthly);
      
      // Get all LHA rates for the BRMA
      let allRates = {};
      if (brma) {
        // Try to get rates from the real data first, then fall back to hardcoded rates
        let rates;
        try {
          // eslint-disable-next-line global-require
          const lhaRatesData = require('../data/lhaRates2025_26.json');
          rates = lhaRatesData[brma] || lhaRates2025_26[brma] || lhaRates2025_26['Default'];
        } catch (e) {
          rates = lhaRates2025_26[brma] || lhaRates2025_26['Default'];
        }
        
        allRates = {
          sharedRate: convertLHAToMonthly(rates.shared),
          oneBedRate: convertLHAToMonthly(rates['1bed']),
          twoBedRate: convertLHAToMonthly(rates['2bed']),
          threeBedRate: convertLHAToMonthly(rates['3bed']),
          fourBedRate: convertLHAToMonthly(rates['4bed'])
        };
      } else {
        // Fallback rates
        allRates = {
          sharedRate: rates.lhaRates.shared,
          oneBedRate: rates.lhaRates.oneBed,
          twoBedRate: rates.lhaRates.twoBed,
          threeBedRate: rates.lhaRates.threeBed,
          fourBedRate: rates.lhaRates.fourBed
        };
      }
      
      return {
        amount: eligibleRent,
        lhaDetails: {
          brma: brma || 'Not selected',
          bedroomEntitlement,
          lhaWeekly: lhaWeekly || null,
          lhaMonthly,
          actualRent: rent + serviceCharges,
          eligibleRent,
          shortfall: Math.max(0, (rent + serviceCharges) - lhaMonthly),
          ...allRates
        }
      };
    } else {
      // Social housing - simplified calculation
      return { amount: rent + serviceCharges, lhaDetails: null };
    }
  }

  calculateBedroomEntitlement(input) {
    const { circumstances, children, childAges, childGenders } = input;
    
    // Basic entitlement: 1 bedroom for each adult couple or single person
    let bedrooms = circumstances === 'couple' ? 1 : 1;
    
    if (children === 0) {
      return bedrooms;
    }
    
    // For children, we need to consider gender for bedroom sharing rules
    if (children === 1) {
      // One child gets their own bedroom
      return bedrooms + 1;
    }
    
    // For 2+ children, we need to check if they can share based on gender and age
    const childrenInfo = [];
    for (let i = 0; i < children; i++) {
      childrenInfo.push({
        age: childAges[i] || 0,
        gender: childGenders[i] || 'unknown'
      });
    }
    
    // Sort children by age (youngest first)
    childrenInfo.sort((a, b) => a.age - b.age);
    
    // Group children who can share bedrooms
    const bedroomGroups = [];
    const usedChildren = new Set();
    
    for (let i = 0; i < childrenInfo.length; i++) {
      if (usedChildren.has(i)) continue;
      
      const currentChild = childrenInfo[i];
      const group = [currentChild];
      usedChildren.add(i);
      
      // Look for children who can share with this child
      for (let j = i + 1; j < childrenInfo.length; j++) {
        if (usedChildren.has(j)) continue;
        
        const otherChild = childrenInfo[j];
        
        // Children can share if:
        // 1. They are the same gender, OR
        // 2. They are both under 10 years old
        if (currentChild.gender === otherChild.gender || 
            (currentChild.age < 10 && otherChild.age < 10)) {
          group.push(otherChild);
          usedChildren.add(j);
        }
      }
      
      bedroomGroups.push(group);
    }
    
    return bedrooms + bedroomGroups.length;
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

  calculateLCWRAElement(input, rates) {
    const { hasLCWRA, partnerHasLCWRA, circumstances } = input;
    
    console.log('LCWRA Debug:', { hasLCWRA, partnerHasLCWRA, circumstances, rates: rates.lcwraElement });
    
    let lcwraElement = 0;
    
    // Check if main person has LCWRA
    if (hasLCWRA === 'yes') {
      lcwraElement += rates.lcwraElement;
      console.log('Main person LCWRA added:', rates.lcwraElement);
    }
    
    // Check if partner has LCWRA (for couples)
    if (circumstances === 'couple' && partnerHasLCWRA === 'yes') {
      lcwraElement += rates.lcwraElement;
      console.log('Partner LCWRA added:', rates.lcwraElement);
    }
    
    console.log('Total LCWRA element:', lcwraElement);
    return lcwraElement;
  }



  calculateEarningsReduction(input, rates, totalElements) {
    const { 
      monthlyEarnings, 
      partnerMonthlyEarnings,
      circumstances,
      employmentType,
      partnerEmploymentType,
      pensionType,
      pensionAmount,
      pensionPercentage,
      partnerPensionType,
      partnerPensionAmount,
      partnerPensionPercentage
    } = input;
    
    // Calculate total earnings
    let totalEarnings = 0;
    let totalPensionDeductions = 0;
    
    // Main person earnings and pension
    if (employmentType === 'employed' && monthlyEarnings > 0) {
      totalEarnings += monthlyEarnings;
      
      // Calculate pension deduction for main person
      if (pensionType === 'amount') {
        totalPensionDeductions += pensionAmount;
      } else if (pensionType === 'percentage') {
        totalPensionDeductions += (monthlyEarnings * pensionPercentage) / 100;
      }
    } else if (employmentType === 'self-employed' && monthlyEarnings > 0) {
      totalEarnings += monthlyEarnings;
    }
    
    // Partner earnings and pension
    if (circumstances === 'couple' && partnerEmploymentType === 'employed' && partnerMonthlyEarnings > 0) {
      totalEarnings += partnerMonthlyEarnings;
      
      // Calculate pension deduction for partner
      if (partnerPensionType === 'amount') {
        totalPensionDeductions += partnerPensionAmount;
      } else if (partnerPensionType === 'percentage') {
        totalPensionDeductions += (partnerMonthlyEarnings * partnerPensionPercentage) / 100;
      }
    } else if (circumstances === 'couple' && partnerEmploymentType === 'self-employed' && partnerMonthlyEarnings > 0) {
      totalEarnings += partnerMonthlyEarnings;
    }
    
    // Net earnings after pension deductions
    const netEarnings = totalEarnings - totalPensionDeductions;
    
    const workAllowance = rates.workAllowance[circumstances].withHousing;
    const taperRate = rates.taperRate;
    
    if (netEarnings <= workAllowance) {
      return 0;
    }
    
    const excessEarnings = netEarnings - workAllowance;
    return excessEarnings * taperRate;
  }

  calculateCapitalDeduction(input, totalElements, rates) {
    const { savings } = input;
    
    if (savings <= rates.capitalLowerLimit) {
      return {
        deduction: 0,
        tariffIncome: 0,
        explanation: 'No deduction - savings below £6,000 limit'
      };
    } else if (savings <= rates.capitalUpperLimit) {
      // Calculate tariff income: for every £250 (or part of £250) over £6,000, £4.35 is treated as monthly income
      const excessOver6000 = savings - rates.capitalLowerLimit;
      const tariffUnits = Math.ceil(excessOver6000 / 250); // Round up to nearest £250
      const tariffIncome = tariffUnits * 4.35;
      
                     return {
                 deduction: tariffIncome,
                 tariffIncome: tariffIncome,
                 explanation: `Tariff income: £${excessOver6000.toFixed(2)} over £6,000 limit = ${tariffUnits} units × £4.35 = £${tariffIncome.toFixed(2)} per month (£${(tariffIncome / 4.35).toFixed(2)} per week)`
               };
    } else {
      return {
        deduction: totalElements,
        tariffIncome: 0,
        explanation: 'No Universal Credit entitlement - savings over £16,000 limit'
      };
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
        childGenders: input.childGenders || [],
        
        // Housing
        housingStatus: input.housingStatus,
        tenantType: input.tenantType,
        rent: input.rent,
        serviceCharges: input.serviceCharges,
        bedrooms: input.bedrooms,
        area: input.area,
        nonDependants: input.nonDependants,
        
        // Employment and Disability - Main Person
        employmentType: input.employmentType,
        monthlyEarnings: input.monthlyEarnings,
        childcareCosts: input.childcareCosts,
        isDisabled: input.isDisabled,
        claimsDisabilityBenefits: input.claimsDisabilityBenefits,
        disabilityBenefitType: input.disabilityBenefitType,
        pipDailyLivingRate: input.pipDailyLivingRate,
        pipMobilityRate: input.pipMobilityRate,
        dlaCareRate: input.dlaCareRate,
        dlaMobilityRate: input.dlaMobilityRate,
        aaRate: input.aaRate,
        hasLCWRA: input.hasLCWRA,
        
        // Employment and Disability - Partner
        partnerEmploymentType: input.partnerEmploymentType,
        partnerMonthlyEarnings: input.partnerMonthlyEarnings,
        partnerIsDisabled: input.partnerIsDisabled,
        partnerClaimsDisabilityBenefits: input.partnerClaimsDisabilityBenefits,
        partnerDisabilityBenefitType: input.partnerDisabilityBenefitType,
        partnerPipDailyLivingRate: input.partnerPipDailyLivingRate,
        partnerPipMobilityRate: input.partnerPipMobilityRate,
        partnerDlaCareRate: input.partnerDlaCareRate,
        partnerDlaMobilityRate: input.partnerDlaMobilityRate,
        partnerAaRate: input.partnerAaRate,
        partnerHasLCWRA: input.partnerHasLCWRA,
        
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
        warnings: results.warnings || [],
        lhaDetails: results.calculation.lhaDetails || null
      },
      calculationDetails: {
        workAllowance: results.calculation.workAllowance || 0,
        taperRate: results.calculation.taperRate || 0.55,
        lhaRate: results.calculation.lhaRate || 0
      }
    };
  }
}
