/**
 * Base Rates Structure for Universal Credit Calculator
 * This file defines the interface and structure that all rate files must follow
 */

class RatesBase {
    constructor() {
        this.taxYear = '';
        this.effectiveFrom = '';
        this.effectiveTo = '';
        
        // Standard Allowance rates
        this.standardAllowance = {
            single: {
                under25: 0,
                over25: 0
            },
            couple: {
                bothUnder25: 0,
                oneOver25: 0,
                bothOver25: 0
            }
        };
        
        // Housing Element rates
        this.housingElement = {
            // Local Housing Allowance rates (simplified)
            // In practice, these vary by area and bedroom count
            sharedRoom: 0,
            oneBedroom: 0,
            twoBedroom: 0,
            threeBedroom: 0,
            fourBedroom: 0,
            
            // Service charge maximums
            serviceChargeMax: 0,
            
            // Non-dependant deductions
            nonDependantDeductions: {
                single: 0,
                couple: 0
            }
        };
        
        // Child Element rates
        this.childElement = {
            firstChild: {
                under1: 0,
                oneToTwo: 0,
                threeToFour: 0,
                fiveToTen: 0,
                elevenToFifteen: 0,
                sixteenToNineteen: 0
            },
            additionalChildren: {
                under1: 0,
                oneToTwo: 0,
                threeToFour: 0,
                fiveToTen: 0,
                elevenToFifteen: 0,
                sixteenToNineteen: 0
            }
        };
        
        // Childcare Element rates
        this.childcareElement = {
            maxPercentage: 0.85, // 85% of childcare costs
            maxAmount: {
                oneChild: 0,
                twoOrMoreChildren: 0
            }
        };
        
        // Earnings taper
        this.earningsTaper = {
            workAllowance: {
                single: 0,
                couple: 0,
                withChildren: 0
            },
            taperRate: 0.55, // 55% taper rate
            minimumIncomeFloor: 0 // For self-employed
        };
        
        // Capital limits
        this.capitalLimits = {
            lowerLimit: 6000,
            upperLimit: 16000,
            tariffIncome: 0.00425 // £4.25 per £250 above lower limit
        };
        
        // Other benefit deductions
        this.benefitDeductions = {
            // Standard deductions for other benefits
            // These are typically pound-for-pound
            standardDeduction: 1.0
        };
        
        // Sanctions and reductions
        this.sanctions = {
            // Standard sanction rates
            standard: 0.4, // 40% reduction
            higher: 0.6,   // 60% reduction
            maximum: 1.0   // 100% reduction
        };
    }
    
    /**
     * Get standard allowance based on circumstances
     * @param {string} circumstances - 'single' or 'couple'
     * @param {number} age - Age of claimant
     * @param {number} partnerAge - Age of partner (if applicable)
     * @returns {number} Monthly standard allowance
     */
    getStandardAllowance(circumstances, age, partnerAge = null) {
        if (circumstances === 'single') {
            return age < 25 ? this.standardAllowance.single.under25 : this.standardAllowance.single.over25;
        } else if (circumstances === 'couple') {
            if (partnerAge === null) {
                throw new Error('Partner age required for couple calculation');
            }
            
            if (age < 25 && partnerAge < 25) {
                return this.standardAllowance.couple.bothUnder25;
            } else if (age >= 25 && partnerAge >= 25) {
                return this.standardAllowance.couple.bothOver25;
            } else {
                return this.standardAllowance.couple.oneOver25;
            }
        }
        
        throw new Error('Invalid circumstances specified');
    }
    
    /**
     * Get child element amount
     * @param {number} childCount - Number of children
     * @param {string} youngestChildAge - Age category of youngest child
     * @returns {number} Monthly child element amount
     */
    getChildElement(childCount, youngestChildAge) {
        if (childCount === 0) return 0;
        
        let total = 0;
        
        // First child gets higher rate
        total += this.childElement.firstChild[youngestChildAge] || 0;
        
        // Additional children get lower rate
        if (childCount > 1) {
            const additionalChildren = childCount - 1;
            total += additionalChildren * (this.childElement.additionalChildren[youngestChildAge] || 0);
        }
        
        return total;
    }
    
    /**
     * Get childcare element amount
     * @param {number} childcareCosts - Monthly childcare costs
     * @param {number} childCount - Number of children
     * @returns {number} Monthly childcare element amount
     */
    getChildcareElement(childcareCosts, childCount) {
        if (childcareCosts <= 0 || childCount === 0) return 0;
        
        const maxAmount = childCount === 1 ? 
            this.childcareElement.maxAmount.oneChild : 
            this.childcareElement.maxAmount.twoOrMoreChildren;
        
        const eligibleAmount = Math.min(childcareCosts, maxAmount);
        return eligibleAmount * this.childcareElement.maxPercentage;
    }
    
    /**
     * Get work allowance based on circumstances
     * @param {string} circumstances - 'single' or 'couple'
     * @param {number} childCount - Number of children
     * @returns {number} Monthly work allowance
     */
    getWorkAllowance(circumstances, childCount) {
        if (childCount > 0) {
            return this.earningsTaper.workAllowance.withChildren;
        } else {
            return circumstances === 'single' ? 
                this.earningsTaper.workAllowance.single : 
                this.earningsTaper.workAllowance.couple;
        }
    }
    
    /**
     * Calculate earnings reduction
     * @param {number} earnings - Monthly earnings
     * @param {number} workAllowance - Work allowance amount
     * @returns {number} Monthly earnings reduction
     */
    calculateEarningsReduction(earnings, workAllowance) {
        const excessEarnings = Math.max(0, earnings - workAllowance);
        return excessEarnings * this.earningsTaper.taperRate;
    }
    
    /**
     * Calculate capital deduction
     * @param {number} capital - Total capital/savings
     * @returns {number} Monthly capital deduction
     */
    calculateCapitalDeduction(capital) {
        if (capital <= this.capitalLimits.lowerLimit) {
            return 0;
        }
        
        if (capital >= this.capitalLimits.upperLimit) {
            return Infinity; // No Universal Credit entitlement
        }
        
        const excessCapital = capital - this.capitalLimits.lowerLimit;
        const tariffIncome = Math.ceil(excessCapital / 250) * 250 * this.capitalLimits.tariffIncome;
        
        return tariffIncome;
    }
    
    /**
     * Validate the rates structure
     * @returns {boolean} True if valid
     */
    validate() {
        // Basic validation checks
        if (!this.taxYear || !this.effectiveFrom || !this.effectiveTo) {
            console.error('Missing tax year information');
            return false;
        }
        
        if (this.earningsTaper.taperRate <= 0 || this.earningsTaper.taperRate > 1) {
            console.error('Invalid taper rate');
            return false;
        }
        
        if (this.childcareElement.maxPercentage <= 0 || this.childcareElement.maxPercentage > 1) {
            console.error('Invalid childcare percentage');
            return false;
        }
        
        return true;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RatesBase;
}








