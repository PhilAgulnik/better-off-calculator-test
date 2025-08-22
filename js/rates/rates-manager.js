/**
 * Rates Manager for Universal Credit Calculator
 * Manages different tax year rates and provides a unified interface
 */

class RatesManager {
    constructor() {
        this.rates = new Map();
        this.currentTaxYear = '2024_25';
        this.availableYears = [];
        
        this.initializeRates();
    }
    
    /**
     * Initialize all available rate configurations
     */
    initializeRates() {
        // Register available rate configurations
        if (typeof rates202425 !== 'undefined') {
            this.rates.set('2024_25', rates202425);
            this.availableYears.push('2024_25');
        }
        
        if (typeof rates202324 !== 'undefined') {
            this.rates.set('2023_24', rates202324);
            this.availableYears.push('2023_24');
        }
        
        // Sort years in descending order (newest first)
        this.availableYears.sort().reverse();
        
        // Set default to most recent year
        if (this.availableYears.length > 0) {
            this.currentTaxYear = this.availableYears[0];
        }
        
        console.log(`Rates Manager initialized with ${this.availableYears.length} tax years:`, this.availableYears);
    }
    
    /**
     * Get the current tax year
     * @returns {string} Current tax year
     */
    getCurrentTaxYear() {
        return this.currentTaxYear;
    }
    
    /**
     * Set the current tax year
     * @param {string} taxYear - Tax year to set
     * @returns {boolean} Success status
     */
    setCurrentTaxYear(taxYear) {
        if (this.rates.has(taxYear)) {
            this.currentTaxYear = taxYear;
            return true;
        }
        console.error(`Tax year ${taxYear} not found`);
        return false;
    }
    
    /**
     * Get available tax years
     * @returns {Array} Array of available tax years
     */
    getAvailableYears() {
        return [...this.availableYears];
    }
    
    /**
     * Get rates for a specific tax year
     * @param {string} taxYear - Tax year to get rates for
     * @returns {Object|null} Rates object or null if not found
     */
    getRates(taxYear = null) {
        const year = taxYear || this.currentTaxYear;
        return this.rates.get(year) || null;
    }
    
    /**
     * Get current rates
     * @returns {Object|null} Current rates object
     */
    getCurrentRates() {
        return this.getRates(this.currentTaxYear);
    }
    
    /**
     * Calculate Universal Credit using current rates
     * @param {Object} circumstances - Claimant circumstances
     * @returns {Object|null} Calculation result or null if error
     */
    calculate(circumstances) {
        const rates = this.getCurrentRates();
        if (!rates) {
            console.error('No rates available for calculation');
            return null;
        }

        // Initialize carer module if available
        let carerModule = null;
        if (typeof CarerModule !== 'undefined') {
            carerModule = new CarerModule();
        }
        
        try {
            // Calculate housing element using the housing costs module
            let housingElement = 0;
            let housingBreakdown = {};
            
            if (typeof housingCostsModule !== 'undefined') {
                const housingResult = housingCostsModule.calculateHousingElement({
                    tenantType: circumstances.tenantType || 'private',
                    rent: circumstances.rent || 0,
                    serviceCharges: circumstances.serviceCharges || 0,
                    area: circumstances.area || 'default',
                    bedrooms: circumstances.bedrooms || 1,
                    householdSize: this.calculateHouseholdSize(circumstances),
                    nonDependants: circumstances.nonDependants || [],
                    exemptions: circumstances.exemptions || [],
                    taxYear: this.currentTaxYear
                });
                
                housingElement = housingResult.finalHousingElement;
                housingBreakdown = housingResult.breakdown;
            } else {
                // Fallback to basic housing calculation
                housingElement = Math.min(circumstances.rent || 0, 600) + (circumstances.serviceCharges || 0);
            }
            
            // Calculate carer element if carer module is available
            let carerElement = 0;
            if (carerModule && (circumstances.isCarer || circumstances.isPartnerCarer)) {
                const carerResult = carerModule.checkCarerEligibility(circumstances);
                if (carerResult.carerElement && circumstances.includeCarerElement) {
                    carerElement = carerModule.getCarerElementAmount(circumstances);
                }
            }

            // Create modified circumstances with housing element and carer element
            const modifiedCircumstances = {
                ...circumstances,
                housingElement: housingElement,
                carerElement: carerElement
            };
            
            // Calculate using rates
            const result = rates.calculateTotal(modifiedCircumstances);
            
            // Add housing breakdown and carer information to result
            if (result) {
                result.housingBreakdown = housingBreakdown;
                if (carerModule && (circumstances.isCarer || circumstances.isPartnerCarer)) {
                    result.carerInfo = carerModule.checkCarerEligibility(circumstances);
                }
            }
            
            return result;
        } catch (error) {
            console.error('Error calculating Universal Credit:', error);
            return null;
        }
    }

    /**
     * Calculate household size for housing calculations
     * @param {Object} circumstances - Claimant circumstances
     * @returns {number} Household size
     */
    calculateHouseholdSize(circumstances) {
        let size = circumstances.circumstances === 'couple' ? 2 : 1;
        size += parseInt(circumstances.children) || 0;
        size += (circumstances.nonDependants || []).length;
        return size;
    }
    
    /**
     * Calculate Universal Credit for a specific tax year
     * @param {string} taxYear - Tax year to use
     * @param {Object} circumstances - Claimant circumstances
     * @returns {Object|null} Calculation result or null if error
     */
    calculateForYear(taxYear, circumstances) {
        const rates = this.getRates(taxYear);
        if (!rates) {
            console.error(`No rates available for tax year ${taxYear}`);
            return null;
        }
        
        try {
            return rates.calculateTotal(circumstances);
        } catch (error) {
            console.error(`Error calculating Universal Credit for ${taxYear}:`, error);
            return null;
        }
    }
    
    /**
     * Compare calculations between two tax years
     * @param {string} year1 - First tax year
     * @param {string} year2 - Second tax year
     * @param {Object} circumstances - Claimant circumstances
     * @returns {Object|null} Comparison result or null if error
     */
    compareYears(year1, year2, circumstances) {
        const result1 = this.calculateForYear(year1, circumstances);
        const result2 = this.calculateForYear(year2, circumstances);
        
        if (!result1 || !result2) {
            return null;
        }
        
        const difference = result2.finalAmount - result1.finalAmount;
        const percentageChange = result1.finalAmount > 0 ? 
            (difference / result1.finalAmount) * 100 : 0;
        
        return {
            year1: {
                taxYear: year1,
                result: result1
            },
            year2: {
                taxYear: year2,
                result: result2
            },
            difference: difference,
            percentageChange: percentageChange
        };
    }
    
    /**
     * Get rate information for display
     * @param {string} taxYear - Tax year to get info for
     * @returns {Object|null} Rate information or null if not found
     */
    getRateInfo(taxYear = null) {
        const rates = this.getRates(taxYear);
        if (!rates) return null;
        
        return {
            taxYear: rates.taxYear,
            effectiveFrom: rates.effectiveFrom,
            effectiveTo: rates.effectiveTo,
            standardAllowance: rates.standardAllowance,
            childElement: rates.childElement,
            earningsTaper: rates.earningsTaper,
            capitalLimits: rates.capitalLimits
        };
    }
    
    /**
     * Validate all rate configurations
     * @returns {Object} Validation results
     */
    validateAllRates() {
        const results = {};
        
        for (const [taxYear, rates] of this.rates) {
            results[taxYear] = {
                valid: rates.validate(),
                errors: []
            };
            
            // Additional validation checks
            if (rates.taxYear !== taxYear) {
                results[taxYear].errors.push('Tax year mismatch');
                results[taxYear].valid = false;
            }
        }
        
        return results;
    }
    
    /**
     * Get summary statistics for all available years
     * @returns {Object} Summary statistics
     */
    getSummaryStats() {
        const stats = {
            totalYears: this.availableYears.length,
            availableYears: this.availableYears,
            currentYear: this.currentTaxYear,
            ratesLoaded: this.rates.size
        };
        
        return stats;
    }
    
    /**
     * Export rates data for external use
     * @param {string} taxYear - Tax year to export
     * @returns {Object|null} Exported rates data
     */
    exportRates(taxYear = null) {
        const rates = this.getRates(taxYear);
        if (!rates) return null;
        
        return {
            taxYear: rates.taxYear,
            effectiveFrom: rates.effectiveFrom,
            effectiveTo: rates.effectiveTo,
            rates: {
                standardAllowance: rates.standardAllowance,
                housingElement: rates.housingElement,
                childElement: rates.childElement,
                childcareElement: rates.childcareElement,
                earningsTaper: rates.earningsTaper,
                capitalLimits: rates.capitalLimits,
                benefitDeductions: rates.benefitDeductions,
                sanctions: rates.sanctions
            },
            exportedAt: new Date().toISOString()
        };
    }
}

// Create global rates manager instance
const ratesManager = new RatesManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ratesManager;
}
