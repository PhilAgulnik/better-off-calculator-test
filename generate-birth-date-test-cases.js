const fs = require('fs');

// Updated calculator with birth date logic for testing
class BirthDateTestCalculator {
  constructor() {
    this.rates = {
      '2025_26': {
        standardAllowance: {
          single: { under25: 316.98, over25: 400.14 },
          couple: { under25: 497.55, over25: 628.10 }
        },
        childElement: {
          preTwoChildLimit: 339.00,     // For children born before 6 April 2017
          postTwoChildLimit: 292.81     // For children born on/after 6 April 2017
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

  // Updated child element calculation with birth date logic
  calculateChildElement(input, rates) {
    const { children, childAges } = input;
    if (children === 0) return 0;
    
    // Two-child limit cutoff date: 6 April 2017
    const twoChildLimitDate = new Date('2017-04-06');
    
    let totalChildElement = 0;
    
    // If we have specific child ages, use them
    if (childAges && childAges.length > 0) {
      for (let i = 0; i < Math.min(children, childAges.length); i++) {
        const childAge = childAges[i];
        
        // Calculate approximate birth date from age
        const today = new Date();
        const approximateBirthDate = new Date(today.getFullYear() - childAge, today.getMonth(), today.getDate());
        
        // Children born before 6 April 2017 get the higher rate
        if (approximateBirthDate < twoChildLimitDate) {
          totalChildElement += rates.childElement.preTwoChildLimit;
        } else {
          totalChildElement += rates.childElement.postTwoChildLimit;
        }
      }
    } else {
      // Fallback for backward compatibility
      if (children === 1) {
        totalChildElement = rates.childElement.preTwoChildLimit;
      } else {
        totalChildElement = rates.childElement.preTwoChildLimit; // First child
        totalChildElement += (children - 1) * rates.childElement.postTwoChildLimit; // Additional children
      }
    }
    
    return totalChildElement;
  }

  calculateHousingElement(input) {
    if (input.housingStatus === 'no_housing_costs') return 0;
    const rent = input.rent || 0;
    const serviceCharges = input.serviceCharges || 0;
    return rent + serviceCharges;
  }

  calculateWorkAllowance(input, rates, hasHousing) {
    const hasChildren = (input.children || 0) > 0;
    
    if (hasChildren || hasHousing) {
      return input.circumstances === 'single' 
        ? (hasHousing ? rates.workAllowance.single.withHousing : rates.workAllowance.single.withoutHousing)
        : (hasHousing ? rates.workAllowance.couple.withHousing : rates.workAllowance.couple.withoutHousing);
    }
    
    return 0;
  }

  calculateCapitalDeduction(savings, rates) {
    if (savings <= rates.capitalLowerLimit) return 0;
    if (savings >= rates.capitalUpperLimit) return 999999;
    
    const excessCapital = savings - rates.capitalLowerLimit;
    const deductionMonthly = Math.ceil(excessCapital / 250) * 4.35;
    return deductionMonthly;
  }

  calculate(input) {
    const taxYear = input.taxYear || '2025_26';
    const rates = this.rates[taxYear];
    
    if (!rates) {
      throw new Error(`Tax year ${taxYear} not supported`);
    }

    const standardAllowance = this.calculateStandardAllowance(input, rates);
    const housingElement = this.calculateHousingElement(input);
    const childElement = this.calculateChildElement(input, rates);
    const childcareElement = Math.min((input.childcareCosts || 0) * (rates.childcareElement.maxPercentage / 100), rates.childcareElement.maxAmount);
    const carerElement = 0;
    const lcwraElement = 0;
    
    const totalElements = standardAllowance + housingElement + childElement + childcareElement + carerElement + lcwraElement;
    
    const mainEarnings = this.calculateNetEarnings(input.monthlyEarnings || 0);
    const partnerEarnings = this.calculateNetEarnings(input.partnerMonthlyEarnings || 0);
    const totalNetEarnings = mainEarnings.net + partnerEarnings.net;
    
    const hasHousing = housingElement > 0;
    const workAllowance = this.calculateWorkAllowance(input, rates, hasHousing);
    
    const earningsAboveAllowance = Math.max(0, totalNetEarnings - workAllowance);
    const earningsReduction = earningsAboveAllowance * rates.taperRate;
    
    const capitalDeduction = this.calculateCapitalDeduction(input.savings || 0, rates);
    const benefitDeduction = 0;
    
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

// Test scenarios demonstrating birth date logic
const birthDateTestScenarios = [
  {
    name: "Single parent, 1 child age 10 (born 2014 - PRE April 2017)",
    input: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      children: 1,
      childAges: [10], // Born ~2014, before April 2017
      housingStatus: 'renting',
      rent: 800,
      serviceCharges: 50,
      employmentType: 'employed',
      monthlyEarnings: 2000,
      childcareCosts: 200,
      savings: 5000
    }
  },
  {
    name: "Single parent, 1 child age 5 (born 2019 - POST April 2017)",
    input: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      children: 1,
      childAges: [5], // Born ~2019, after April 2017
      housingStatus: 'renting',
      rent: 800,
      serviceCharges: 50,
      employmentType: 'employed',
      monthlyEarnings: 2000,
      childcareCosts: 200,
      savings: 5000
    }
  },
  {
    name: "Single parent, 2 children ages 12,8 (both PRE April 2017)",
    input: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 35,
      children: 2,
      childAges: [12, 8], // Born ~2012 and ~2016, both before April 2017
      housingStatus: 'renting',
      rent: 800,
      serviceCharges: 50,
      employmentType: 'employed',
      monthlyEarnings: 2000,
      childcareCosts: 300,
      savings: 5000
    }
  },
  {
    name: "Single parent, 2 children ages 10,3 (mixed: PRE and POST April 2017)",
    input: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 35,
      children: 2,
      childAges: [10, 3], // Born ~2014 (pre) and ~2021 (post) April 2017
      housingStatus: 'renting',
      rent: 800,
      serviceCharges: 50,
      employmentType: 'employed',
      monthlyEarnings: 2000,
      childcareCosts: 300,
      savings: 5000
    }
  },
  {
    name: "Single parent, 2 children ages 4,2 (both POST April 2017)",
    input: {
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      children: 2,
      childAges: [4, 2], // Born ~2020 and ~2022, both after April 2017
      housingStatus: 'renting',
      rent: 800,
      serviceCharges: 50,
      employmentType: 'employed',
      monthlyEarnings: 2000,
      childcareCosts: 300,
      savings: 5000
    }
  }
];

function generateBirthDateTestCases() {
  const calculator = new BirthDateTestCalculator();
  
  console.log('🎯 Testing Child Element Birth Date Logic (6 April 2017 cutoff)\n');
  console.log('PRE-2017 Rate: £339.00 | POST-2017 Rate: £292.81\n');
  
  // CSV Header
  const csvHeader = [
    'testScenario', 'taxYear', 'circumstances', 'age', 'partnerAge', 'children', 'childAges', 
    'housingStatus', 'tenantType', 'rent', 'serviceCharges', 'employmentType', 'monthlyEarnings', 
    'childcareCosts', 'savings', 'standardAllowance', 'housingElement', 'childElement', 
    'childcareElement', 'carerElement', 'lcwraElement', 'totalElements', 'workAllowance', 
    'mainNetEarnings', 'partnerNetEarnings', 'totalNetEarnings', 'mainGrossEarnings', 
    'partnerGrossEarnings', 'totalGrossEarnings', 'earningsReduction', 'capitalDeduction', 
    'benefitDeduction', 'finalAmount'
  ];
  
  const csvRows = [csvHeader.join(',')];
  
  birthDateTestScenarios.forEach((scenario, index) => {
    try {
      const result = calculator.calculate(scenario.input);
      const calc = result.calculation;
      
      console.log(`${index + 1}. ${scenario.name}`);
      console.log(`   Child Ages: [${scenario.input.childAges.join(', ')}]`);
      console.log(`   Child Element: £${calc.childElement.toFixed(2)}`);
      
      // Calculate expected breakdown
      let expectedBreakdown = '';
      if (scenario.input.childAges) {
        const breakdown = scenario.input.childAges.map(age => {
          const birthYear = new Date().getFullYear() - age;
          const isPreLimit = birthYear < 2017 || (birthYear === 2017 && new Date().getMonth() < 3); // Approximate
          return `Age ${age} (${birthYear}): £${isPreLimit ? '339.00' : '292.81'}`;
        });
        expectedBreakdown = breakdown.join(' + ');
      }
      console.log(`   Breakdown: ${expectedBreakdown}`);
      console.log(`   Final Amount: £${calc.finalAmount.toFixed(2)}`);
      console.log('');
      
      // Build CSV row
      const csvRow = [
        `"${scenario.name}"`,
        scenario.input.taxYear,
        scenario.input.circumstances,
        scenario.input.age,
        scenario.input.partnerAge || '',
        scenario.input.children,
        `"[${scenario.input.childAges.join(',')}]"`,
        scenario.input.housingStatus,
        'private',
        scenario.input.rent,
        scenario.input.serviceCharges,
        scenario.input.employmentType,
        scenario.input.monthlyEarnings,
        scenario.input.childcareCosts,
        scenario.input.savings,
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
  fs.writeFileSync('birth-date-test-cases-2025-26.csv', csvContent);
  
  console.log('✅ Generated birth-date-test-cases-2025-26.csv');
  console.log('✅ Demonstrates correct application of 6 April 2017 birth date rule');
  
  return csvRows;
}

if (require.main === module) {
  generateBirthDateTestCases();
}

module.exports = { BirthDateTestCalculator };