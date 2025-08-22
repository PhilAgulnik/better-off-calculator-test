/**
 * Universal Credit Rates for 2023/24 Tax Year
 * Based on official UK government rates effective from April 2023
 * Source: https://www.gov.uk/universal-credit/what-youll-get
 */

class Rates202324 extends RatesBase {
    constructor() {
        super();
        
        this.taxYear = '2023_24';
        this.effectiveFrom = '2023-04-01';
        this.effectiveTo = '2024-03-31';
        
        // Standard Allowance rates (monthly) - 2023/24 rates
        this.standardAllowance = {
            single: {
                under25: 292.11,
                over25: 368.74
            },
            couple: {
                bothUnder25: 458.51,
                oneOver25: 462.51,
                bothOver25: 578.82
            }
        };
        
        // Housing Element rates
        this.housingElement = {
            // Local Housing Allowance rates (simplified examples)
            // In practice, these vary significantly by area
            sharedRoom: 380.00,
            oneBedroom: 570.00,
            twoBedroom: 710.00,
            threeBedroom: 850.00,
            fourBedroom: 1040.00,
            
            // Service charge maximums
            serviceChargeMax: 95.00,
            
            // Non-dependant deductions (monthly)
            nonDependantDeductions: {
                single: 80.40,
                couple: 126.00
            }
        };
        
        // Child Element rates (monthly) - 2023/24 rates
        this.childElement = {
            firstChild: {
                under1: 290.00,
                "1to2": 244.58,
                "3to4": 244.58,
                "5to10": 244.58,
                "11to15": 244.58,
                "16to19": 244.58
            },
            additionalChildren: {
                under1: 244.58,
                "1to2": 244.58,
                "3to4": 244.58,
                "5to10": 244.58,
                "11to15": 244.58,
                "16to19": 244.58
            }
        };
        
        // Childcare Element rates
        this.childcareElement = {
            maxPercentage: 0.85, // 85% of childcare costs
            maxAmount: {
                oneChild: 950.92,      // Monthly maximum for one child
                twoOrMoreChildren: 1630.15 // Monthly maximum for two or more children
            }
        };
        
        // Earnings taper
        this.earningsTaper = {
            workAllowance: {
                single: 344.00,        // Monthly work allowance for single person
                couple: 344.00,        // Monthly work allowance for couple
                withChildren: 573.00   // Monthly work allowance when you have children
            },
            taperRate: 0.55,           // 55% taper rate
            minimumIncomeFloor: 0      // For self-employed (varies by circumstances)
        };
        
        // Capital limits
        this.capitalLimits = {
            lowerLimit: 6000,          // £6,000 lower limit
            upperLimit: 16000,         // £16,000 upper limit
            tariffIncome: 0.00425      // £4.25 per £250 above lower limit
        };
        
        // Other benefit deductions
        this.benefitDeductions = {
            standardDeduction: 1.0     // Pound-for-pound deduction
        };
        
        // Sanctions and reductions
        this.sanctions = {
            standard: 0.4,             // 40% reduction
            higher: 0.6,               // 60% reduction
            maximum: 1.0               // 100% reduction
        };
    }
    
    /**
     * Get housing element amount
     * @param {number} rent - Monthly rent
     * @param {number} serviceCharges - Monthly service charges
     * @param {string} bedroomCount - Number of bedrooms needed
     * @returns {number} Monthly housing element amount
     */
    getHousingElement(rent, serviceCharges, bedroomCount = 'oneBedroom') {
        // In a real implementation, this would use Local Housing Allowance rates
        // which vary by area and are published by the Valuation Office Agency
        const lhaRate = this.housingElement[bedroomCount] || this.housingElement.oneBedroom;
        
        // Housing element is the lower of actual rent or LHA rate
        const eligibleRent = Math.min(rent, lhaRate);
        
        // Add service charges (up to maximum)
        const eligibleServiceCharges = Math.min(serviceCharges, this.housingElement.serviceChargeMax);
        
        return eligibleRent + eligibleServiceCharges;
    }
    
    /**
     * Calculate total Universal Credit entitlement
     * @param {Object} circumstances - Claimant circumstances
     * @returns {Object} Calculation breakdown
     */
    calculateTotal(circumstances) {
        const {
            age,
            partnerAge,
            circumstances: circ,
            children,
            childrenAge,
            rent,
            serviceCharges,
            monthlyEarnings,
            childcareCosts,
            savings,
            otherBenefits,
            housingElement,
            carerElement
        } = circumstances;
        
        // Standard Allowance
        const standardAllowance = this.getStandardAllowance(circ, age, partnerAge);
        
        // Housing Element (use passed value or calculate if not provided)
        const housingElementAmount = housingElement || this.getHousingElement(rent, serviceCharges);
        
        // Child Element
        const childElement = this.getChildElement(children, childrenAge);
        
        // Childcare Element
        const childcareElement = this.getChildcareElement(childcareCosts, children);
        
        // Carer Element (use passed value or 0 if not provided)
        const carerElementAmount = carerElement || 0;
        
        // Total Elements
        const totalElements = standardAllowance + housingElementAmount + childElement + childcareElement + carerElementAmount;
        
        // Work Allowance
        const workAllowance = this.getWorkAllowance(circ, children);
        
        // Earnings Reduction
        const earningsReduction = this.calculateEarningsReduction(monthlyEarnings, workAllowance);
        
        // Capital Deduction
        const capitalDeduction = this.calculateCapitalDeduction(savings);
        
        // Other Benefit Deductions
        const benefitDeduction = otherBenefits * this.benefitDeductions.standardDeduction;
        
        // Total Deductions
        const totalDeductions = earningsReduction + capitalDeduction + benefitDeduction;
        
        // Final Amount
        const finalAmount = Math.max(0, totalElements - totalDeductions);
        
        return {
            standardAllowance,
            housingElement: housingElementAmount,
            childElement,
            childcareElement,
            carerElement: carerElementAmount,
            totalElements,
            workAllowance,
            earningsReduction,
            capitalDeduction,
            benefitDeduction,
            totalDeductions,
            finalAmount
        };
    }
}

// Create and export the rates instance
const rates202324 = new Rates202324();

// Validate the rates
if (!rates202324.validate()) {
    console.error('Invalid rates configuration for 2023/24');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = rates202324;
}
