const fs = require('fs');

// Accurate Universal Credit Calculator matching the real implementation
class AccurateUniversalCreditCalculator {
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
        capitalUpperLimit: 16000
      }
    };
  }

  // Calculate net earnings exactly like NetEarningsModule
  calculateNetEarnings(grossMonthly) {
    if (grossMonthly <= 0) return { gross: 0, tax: 0, ni: 0, pension: 0, net: 0 };

    // Tax calculation (matches NetEarningsModule)
    const personalAllowanceYear = 12570;
    const basicBandYear = 37700;
    
    const grossYear = grossMonthly * 12;
    const taxableYear = Math.max(0, grossYear - personalAllowanceYear);
    const basicTaxYear = Math.min(taxableYear, basicBandYear) * 0.20;
    const higherTaxYear = Math.max(0, taxableYear - basicBandYear) * 0.40;
    const taxMonthly = (basicTaxYear + higherTaxYear) / 12;

    // National Insurance calculation
    const niMonthlyThreshold = 1048;
    const niRate = 0.08;
    const niMonthly = Math.max(0, grossMonthly - niMonthlyThreshold) * niRate;

    // Pension contribution (3% minimum for employed people)
    const pensionMonthly = grossMonthly * 0.03;

    const netCalculated = Math.max(0, grossMonthly - taxMonthly - niMonthly - pensionMonthly);
    
    return {
      gross: grossMonthly,
      tax: taxMonthly,
      ni: niMonthly,
      pension: pensionMonthly,
      net: netCalculated
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
    
    if (input.children === 1) {
      return rates.childElement.first;
    } else {
      return rates.childElement.first + (rates.childElement.additional * (input.children - 1));
    }
  }

  calculateHousingElement(input) {
    if (input.housingStatus === 'no_housing_costs') return 0;
    
    // Include both rent and service charges
    const rent = input.rent || 0;
    const serviceCharges = input.serviceCharges || 0;
    return rent + serviceCharges;
  }

  calculateWorkAllowance(input, rates, hasHousing) {
    const hasChildren = (input.children || 0) > 0;
    
    // Work allowance only applies if you have children or housing costs
    if (hasChildren || hasHousing) {
      return input.circumstances === 'single' 
        ? (hasHousing ? rates.workAllowance.single.withHousing : rates.workAllowance.single.withoutHousing)
        : (hasHousing ? rates.workAllowance.couple.withHousing : rates.workAllowance.couple.withoutHousing);
    }
    
    return 0;
  }

  calculateCapitalDeduction(savings, rates) {
    if (savings <= rates.capitalLowerLimit) return 0;
    if (savings >= rates.capitalUpperLimit) return 999999; // Effectively disqualifies from UC
    
    const excessCapital = savings - rates.capitalLowerLimit;
    // £4.35 per month for every £250 (or part thereof) over £6,000
    const deductionMonthly = Math.ceil(excessCapital / 250) * 4.35;
    return deductionMonthly;
  }

  calculate(input) {
    const taxYear = input.taxYear || '2025_26';
    const rates = this.rates[taxYear];
    
    if (!rates) {
      throw new Error(`Tax year ${taxYear} not supported`);
    }

    // Calculate components
    const standardAllowance = this.calculateStandardAllowance(input, rates);
    const housingElement = this.calculateHousingElement(input);
    const childElement = this.calculateChildElement(input, rates);
    const childcareElement = Math.min((input.childcareCosts || 0) * (rates.childcareElement.maxPercentage / 100), rates.childcareElement.maxAmount);
    const carerElement = 0; // Simplified - would need carer logic
    const lcwraElement = 0; // Simplified - would need LCWRA logic
    
    const totalElements = standardAllowance + housingElement + childElement + childcareElement + carerElement + lcwraElement;
    
    // Calculate NET earnings for both main and partner
    const mainEarnings = this.calculateNetEarnings(input.monthlyEarnings || 0);
    const partnerEarnings = this.calculateNetEarnings(input.partnerMonthlyEarnings || 0);
    const totalNetEarnings = mainEarnings.net + partnerEarnings.net;
    
    // Calculate work allowance and earnings reduction
    const hasHousing = housingElement > 0;
    const workAllowance = this.calculateWorkAllowance(input, rates, hasHousing);
    
    const earningsAboveAllowance = Math.max(0, totalNetEarnings - workAllowance);
    const earningsReduction = earningsAboveAllowance * rates.taperRate;
    
    // Calculate capital deduction
    const capitalDeduction = this.calculateCapitalDeduction(input.savings || 0, rates);
    
    // Other deductions
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
        // Net earnings details
        mainNetEarnings: mainEarnings.net,
        partnerNetEarnings: partnerEarnings.net,
        totalNetEarnings,
        mainGrossEarnings: input.monthlyEarnings || 0,
        partnerGrossEarnings: input.partnerMonthlyEarnings || 0,
        totalGrossEarnings: (input.monthlyEarnings || 0) + (input.partnerMonthlyEarnings || 0)
      }
    };
  }
}

// Test cases with input scenarios
const testScenarios = [
  {
    name: "Single parent, 1 child, employed £2000, childcare £200, private rent £800+£50",
    input: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      children: 1,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 800,
      serviceCharges: 50,
      employmentType: 'employed',
      monthlyEarnings: 2000,
      childcareCosts: 200,
      partnerEmploymentType: 'not_working',
      partnerMonthlyEarnings: 0,
      savings: 5000
    }
  },
  {
    name: "Couple, 2 children, employed £3000+£1500, childcare £400, private rent £1200+£75",
    input: {
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 35,
      partnerAge: 32,
      children: 2,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1200,
      serviceCharges: 75,
      employmentType: 'employed',
      monthlyEarnings: 3000,
      childcareCosts: 400,
      partnerEmploymentType: 'employed',
      partnerMonthlyEarnings: 1500,
      savings: 8000
    }
  },
  {
    name: "Single, no children, employed £100, social rent £200",
    input: {
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
      childcareCosts: 0,
      partnerEmploymentType: 'not_working',
      partnerMonthlyEarnings: 0,
      savings: 0
    }
  },
  {
    name: "Single parent, 1 child, employed £2000, childcare £200, social rent £800+£50",
    input: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      children: 1,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 800,
      serviceCharges: 50,
      employmentType: 'employed',
      monthlyEarnings: 2000,
      childcareCosts: 200,
      partnerEmploymentType: 'not_working',
      partnerMonthlyEarnings: 0,
      savings: 5000
    }
  },
  {
    name: "Couple, 2 children, employed £3000+£1500, childcare £400, social rent £1200+£75",
    input: {
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 35,
      partnerAge: 32,
      children: 2,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 1200,
      serviceCharges: 75,
      employmentType: 'employed',
      monthlyEarnings: 3000,
      childcareCosts: 400,
      partnerEmploymentType: 'employed',
      partnerMonthlyEarnings: 1500,
      savings: 8000
    }
  }
];

function generateCorrectTestCases() {
  const calculator = new AccurateUniversalCreditCalculator();
  
  console.log('Generating corrected test cases with proper net earnings calculations...\n');
  
  // CSV Header with net earnings fields added
  const csvHeader = [
    'taxYear', 'circumstances', 'age', 'partnerAge', 'children', 'childAges', 'childDisabilities', 'childGenders',
    'housingStatus', 'tenantType', 'rent', 'serviceCharges', 'bedrooms', 'area', 'nonDependants',
    'employmentType', 'monthlyEarnings', 'childcareCosts', 'isDisabled', 'claimsDisabilityBenefits',
    'disabilityBenefitType', 'pipDailyLivingRate', 'pipMobilityRate', 'dlaCareRate', 'dlaMobilityRate',
    'aaRate', 'hasLCWRA', 'partnerEmploymentType', 'partnerMonthlyEarnings', 'partnerIsDisabled',
    'partnerClaimsDisabilityBenefits', 'partnerDisabilityBenefitType', 'partnerPipDailyLivingRate',
    'partnerPipMobilityRate', 'partnerDlaCareRate', 'partnerDlaMobilityRate', 'partnerAaRate',
    'partnerHasLCWRA', 'savings', 'otherBenefits', 'otherBenefitsPeriod',
    // Output fields with net earnings added
    'standardAllowance', 'housingElement', 'childElement', 'childcareElement', 'carerElement', 'lcwraElement',
    'totalElements', 'workAllowance', 'mainNetEarnings', 'partnerNetEarnings', 'totalNetEarnings', 
    'mainGrossEarnings', 'partnerGrossEarnings', 'totalGrossEarnings', 'earningsReduction',
    'capitalDeduction', 'benefitDeduction', 'finalAmount'
  ];
  
  const csvRows = [csvHeader.join(',')];
  
  testScenarios.forEach((scenario, index) => {
    try {
      const result = calculator.calculate(scenario.input);
      const calc = result.calculation;
      
      console.log(`Test Case ${index + 1}: ${scenario.name}`);
      console.log(`  Gross Earnings: £${calc.mainGrossEarnings} + £${calc.partnerGrossEarnings} = £${calc.totalGrossEarnings}`);
      console.log(`  Net Earnings: £${calc.mainNetEarnings.toFixed(2)} + £${calc.partnerNetEarnings.toFixed(2)} = £${calc.totalNetEarnings.toFixed(2)}`);
      console.log(`  Work Allowance: £${calc.workAllowance}`);
      console.log(`  Earnings Reduction: £${calc.earningsReduction.toFixed(2)}`);
      console.log(`  Final Amount: £${calc.finalAmount.toFixed(2)}`);
      console.log('');
      
      // Build CSV row with all input and calculated output values
      const csvRow = [
        scenario.input.taxYear,
        scenario.input.circumstances,
        scenario.input.age,
        scenario.input.partnerAge || '',
        scenario.input.children,
        '', // childAges - simplified
        '', // childDisabilities - simplified
        '', // childGenders - simplified
        scenario.input.housingStatus,
        scenario.input.tenantType,
        scenario.input.rent,
        scenario.input.serviceCharges,
        2, // bedrooms - simplified
        'London', // area - simplified
        0, // nonDependants - simplified
        scenario.input.employmentType,
        scenario.input.monthlyEarnings,
        scenario.input.childcareCosts,
        'no', // isDisabled - simplified
        'no', // claimsDisabilityBenefits - simplified
        '', // disabilityBenefitType
        'none', // pipDailyLivingRate
        'none', // pipMobilityRate
        'none', // dlaCareRate
        'none', // dlaMobilityRate
        'none', // aaRate
        'no', // hasLCWRA
        scenario.input.partnerEmploymentType,
        scenario.input.partnerMonthlyEarnings,
        'no', // partnerIsDisabled - simplified
        'no', // partnerClaimsDisabilityBenefits - simplified
        '', // partnerDisabilityBenefitType
        'none', // partnerPipDailyLivingRate
        'none', // partnerPipMobilityRate
        'none', // partnerDlaCareRate
        'none', // partnerDlaMobilityRate
        'none', // partnerAaRate
        'no', // partnerHasLCWRA
        scenario.input.savings,
        0, // otherBenefits - simplified
        'monthly', // otherBenefitsPeriod
        // Expected output values (now calculated correctly)
        calc.standardAllowance.toFixed(2),
        calc.housingElement.toFixed(2),
        calc.childElement.toFixed(2),
        calc.childcareElement.toFixed(2),
        calc.carerElement.toFixed(2),
        calc.lcwraElement.toFixed(2),
        calc.totalElements.toFixed(2),
        calc.workAllowance.toFixed(2),
        calc.mainNetEarnings.toFixed(2),
        calc.partnerNetEarnings.toFixed(2),
        calc.totalNetEarnings.toFixed(2),
        calc.mainGrossEarnings.toFixed(2),
        calc.partnerGrossEarnings.toFixed(2),
        calc.totalGrossEarnings.toFixed(2),
        calc.earningsReduction.toFixed(2),
        calc.capitalDeduction.toFixed(2),
        calc.benefitDeduction.toFixed(2),
        calc.finalAmount.toFixed(2)
      ];
      
      csvRows.push(csvRow.join(','));
      
    } catch (error) {
      console.error(`Error calculating test case ${index + 1}:`, error);
    }
  });
  
  // Write to file
  const csvContent = csvRows.join('\n');
  fs.writeFileSync('corrected-test-cases-2025-26.csv', csvContent);
  
  console.log('✅ Generated corrected-test-cases-2025-26.csv with proper net earnings calculations');
  console.log('✅ Added net earnings fields to output columns for better testing');
  
  return csvRows;
}

if (require.main === module) {
  generateCorrectTestCases();
}

module.exports = { AccurateUniversalCreditCalculator, generateCorrectTestCases };