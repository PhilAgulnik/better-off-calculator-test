/**
 * Universal Credit Calculator Engine
 * Main calculation orchestrator that handles all Universal Credit calculations
 */

class UniversalCreditCalculator {
    constructor() {
        this.ratesManager = typeof ratesManager !== 'undefined' ? ratesManager : null;
        this.lastCalculation = null;
        this.calculationHistory = [];
        this.maxHistorySize = 10;
    }
    
    /**
     * Initialize the calculator
     */
    initialize() {
        if (!this.ratesManager) {
            console.error('Rates Manager not available');
            return false;
        }
        
        console.log('Universal Credit Calculator initialized');
        console.log('Available tax years:', this.ratesManager.getAvailableYears());
        console.log('Current tax year:', this.ratesManager.getCurrentTaxYear());
        
        return true;
    }
    
    /**
     * Validate input data
     * @param {Object} input - Input data to validate
     * @returns {Object} Validation result
     */
    validateInput(input) {
        const errors = [];
        const warnings = [];
        
        // Required fields
        if (!input.age || input.age < 16 || input.age > 120) {
            errors.push('Age must be between 16 and 120');
        }
        
        if (!input.circumstances || !['single', 'couple'].includes(input.circumstances)) {
            errors.push('Circumstances must be either "single" or "couple"');
        }
        
        // Validate partner age for couples
        if (input.circumstances === 'couple') {
            if (!input.partnerAge || input.partnerAge < 16 || input.partnerAge > 120) {
                errors.push('Partner age must be between 16 and 120 for couples');
            }
        }
        
        // Optional but important validations
        if (input.children < 0 || input.children > 10) {
            errors.push('Number of children must be between 0 and 10');
        }
        
        if (input.monthlyEarnings < 0) {
            errors.push('Monthly earnings cannot be negative');
        }
        
        // Validate self-employed fields
        const businessFields = [
            'businessIncomeBank', 'businessIncomeCash', 'businessExpensesRent',
            'businessExpensesRates', 'businessExpensesUtilities', 'businessExpensesInsurance',
            'businessExpensesTelephone', 'businessExpensesMarketing', 'businessExpensesVehicle',
            'businessExpensesEquipment', 'businessExpensesPostage', 'businessExpensesTransport',
            'businessExpensesProfessional', 'businessTax', 'businessNIC', 'businessPension',
            'businessCarMiles', 'businessHomeHours'
        ];
        
        businessFields.forEach(field => {
            if (input[field] < 0) {
                errors.push(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} cannot be negative`);
            }
        });
        
        if (input.rent < 0) {
            errors.push('Rent cannot be negative');
        }
        
        if (input.savings < 0) {
            errors.push('Savings cannot be negative');
        }
        
        // Warnings for unusual values
        if (input.monthlyEarnings > 5000) {
            warnings.push('High earnings may result in no Universal Credit entitlement');
        }
        
        if (input.savings > 15000) {
            warnings.push('High savings may affect Universal Credit entitlement');
        }
        
        if (input.rent > 2000) {
            warnings.push('High rent amount - verify this is correct');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }
    
    /**
     * Prepare input data for calculation
     * @param {Object} rawInput - Raw input from form
     * @returns {Object} Processed input data
     */
    prepareInput(rawInput) {
        return {
            age: parseInt(rawInput.age) || 25,
            partnerAge: rawInput.circumstances === 'couple' ? (parseInt(rawInput.partnerAge) || 25) : null,
            circumstances: rawInput.circumstances || 'single',
            children: parseInt(rawInput.children) || 0,
            childrenAge: rawInput.childrenAge || '5to10',
            tenantType: rawInput.tenantType || 'private',
            rent: parseFloat(rawInput.rent) || 0,
            serviceCharges: parseFloat(rawInput.serviceCharges) || 0,
            bedrooms: parseInt(rawInput.bedrooms) || 1,
            area: rawInput.area || 'default',
            exemptions: rawInput.exemptions || [],
            nonDependants: rawInput.nonDependants || [],
            monthlyEarnings: parseFloat(rawInput.monthlyEarnings) || 0,
            childcareCosts: parseFloat(rawInput.childcareCosts) || 0,
            
            // Carer data
            isCarer: rawInput.isCarer || false,
            isPartnerCarer: rawInput.isPartnerCarer || false,
            currentlyReceivingCA: rawInput.currentlyReceivingCA || false,
            isScotland: rawInput.isScotland || false,
            caringHours: parseInt(rawInput.caringHours) || 0,
            caredForPersonBenefits: rawInput.caredForPersonBenefits || false,
            includeCarerAllowance: rawInput.includeCarerAllowance !== false,
            includeCarerElement: rawInput.includeCarerElement !== false,
            
            // Self-employed data
            businessIncomeBank: parseFloat(rawInput.businessIncomeBank) || 0,
            businessIncomeCash: parseFloat(rawInput.businessIncomeCash) || 0,
            businessExpensesRent: parseFloat(rawInput.businessExpensesRent) || 0,
            businessExpensesRates: parseFloat(rawInput.businessExpensesRates) || 0,
            businessExpensesUtilities: parseFloat(rawInput.businessExpensesUtilities) || 0,
            businessExpensesInsurance: parseFloat(rawInput.businessExpensesInsurance) || 0,
            businessExpensesTelephone: parseFloat(rawInput.businessExpensesTelephone) || 0,
            businessExpensesMarketing: parseFloat(rawInput.businessExpensesMarketing) || 0,
            businessExpensesVehicle: parseFloat(rawInput.businessExpensesVehicle) || 0,
            businessExpensesEquipment: parseFloat(rawInput.businessExpensesEquipment) || 0,
            businessExpensesPostage: parseFloat(rawInput.businessExpensesPostage) || 0,
            businessExpensesTransport: parseFloat(rawInput.businessExpensesTransport) || 0,
            businessExpensesProfessional: parseFloat(rawInput.businessExpensesProfessional) || 0,
            businessTax: parseFloat(rawInput.businessTax) || 0,
            businessNIC: parseFloat(rawInput.businessNIC) || 0,
            businessPension: parseFloat(rawInput.businessPension) || 0,
            businessCarMiles: parseFloat(rawInput.businessCarMiles) || 0,
            businessCarDeduction: parseFloat(rawInput.businessCarDeduction) || 0,
            businessHomeHours: parseFloat(rawInput.businessHomeHours) || 0,
            businessHomeDeduction: parseFloat(rawInput.businessHomeDeduction) || 0,
            
            savings: parseFloat(rawInput.savings) || 0,
            otherBenefits: parseFloat(rawInput.otherBenefits) || 0,
            taxYear: rawInput.taxYear || this.ratesManager.getCurrentTaxYear()
        };
    }
    
    /**
     * Calculate Universal Credit entitlement
     * @param {Object} input - Input data
     * @returns {Object} Calculation result
     */
    calculate(input) {
        try {
            // Prepare and validate input
            const processedInput = this.prepareInput(input);
            const validation = this.validateInput(processedInput);
            
            if (!validation.valid) {
                return {
                    success: false,
                    errors: validation.errors,
                    warnings: validation.warnings
                };
            }
            
            // Set tax year if specified
            if (processedInput.taxYear && processedInput.taxYear !== this.ratesManager.getCurrentTaxYear()) {
                this.ratesManager.setCurrentTaxYear(processedInput.taxYear);
            }
            
            // Perform calculation
            const calculation = this.ratesManager.calculate(processedInput);
            
            if (!calculation) {
                return {
                    success: false,
                    errors: ['Calculation failed - please check your input']
                };
            }
            
            // Add metadata to result
            const result = {
                success: true,
                calculation: calculation,
                input: processedInput,
                taxYear: this.ratesManager.getCurrentTaxYear(),
                calculatedAt: new Date().toISOString(),
                warnings: validation.warnings
            };
            
            // Store in history
            this.addToHistory(result);
            this.lastCalculation = result;
            
            return result;
            
        } catch (error) {
            console.error('Calculation error:', error);
            return {
                success: false,
                errors: ['An unexpected error occurred during calculation']
            };
        }
    }
    
    /**
     * Calculate for multiple scenarios
     * @param {Array} scenarios - Array of input scenarios
     * @returns {Array} Array of calculation results
     */
    calculateMultiple(scenarios) {
        const results = [];
        
        for (const scenario of scenarios) {
            const result = this.calculate(scenario);
            results.push({
                scenario: scenario.name || 'Unnamed Scenario',
                result: result
            });
        }
        
        return results;
    }
    
    /**
     * Compare two scenarios
     * @param {Object} scenario1 - First scenario
     * @param {Object} scenario2 - Second scenario
     * @returns {Object} Comparison result
     */
    compareScenarios(scenario1, scenario2) {
        const result1 = this.calculate(scenario1);
        const result2 = this.calculate(scenario2);
        
        if (!result1.success || !result2.success) {
            return {
                success: false,
                errors: ['One or both scenarios failed to calculate']
            };
        }
        
        const calc1 = result1.calculation;
        const calc2 = result2.calculation;
        
        const differences = {
            finalAmount: calc2.finalAmount - calc1.finalAmount,
            standardAllowance: calc2.standardAllowance - calc1.standardAllowance,
            housingElement: calc2.housingElement - calc1.housingElement,
            childElement: calc2.childElement - calc1.childElement,
            childcareElement: calc2.childcareElement - calc1.childcareElement,
            earningsReduction: calc2.earningsReduction - calc1.earningsReduction
        };
        
        const percentageChanges = {
            finalAmount: calc1.finalAmount > 0 ? (differences.finalAmount / calc1.finalAmount) * 100 : 0
        };
        
        return {
            success: true,
            scenario1: {
                name: scenario1.name || 'Scenario 1',
                result: result1
            },
            scenario2: {
                name: scenario2.name || 'Scenario 2',
                result: result2
            },
            differences: differences,
            percentageChanges: percentageChanges
        };
    }
    
    /**
     * Add calculation to history
     * @param {Object} calculation - Calculation result
     */
    addToHistory(calculation) {
        this.calculationHistory.unshift(calculation);
        
        // Keep only the most recent calculations
        if (this.calculationHistory.length > this.maxHistorySize) {
            this.calculationHistory = this.calculationHistory.slice(0, this.maxHistorySize);
        }
    }
    
    /**
     * Get calculation history
     * @returns {Array} Array of recent calculations
     */
    getHistory() {
        return [...this.calculationHistory];
    }
    
    /**
     * Clear calculation history
     */
    clearHistory() {
        this.calculationHistory = [];
    }
    
    /**
     * Get the last calculation
     * @returns {Object|null} Last calculation result
     */
    getLastCalculation() {
        return this.lastCalculation;
    }
    
    /**
     * Export calculation data
     * @param {Object} calculation - Calculation to export
     * @returns {Object} Exportable data
     */
    exportCalculation(calculation = null) {
        const calc = calculation || this.lastCalculation;
        if (!calc) return null;
        
        return {
            calculation: calc.calculation,
            input: calc.input,
            taxYear: calc.taxYear,
            calculatedAt: calc.calculatedAt,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
    }
    
    /**
     * Get calculator statistics
     * @returns {Object} Statistics
     */
    getStats() {
        return {
            totalCalculations: this.calculationHistory.length,
            lastCalculation: this.lastCalculation ? this.lastCalculation.calculatedAt : null,
            availableTaxYears: this.ratesManager ? this.ratesManager.getAvailableYears() : [],
            currentTaxYear: this.ratesManager ? this.ratesManager.getCurrentTaxYear() : null
        };
    }
    
    /**
     * Reset calculator state
     */
    reset() {
        this.lastCalculation = null;
        this.calculationHistory = [];
    }
}

// Create global calculator instance
const universalCreditCalculator = new UniversalCreditCalculator();

// Initialize when rates are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure rates are loaded
    setTimeout(() => {
        universalCreditCalculator.initialize();
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = universalCreditCalculator;
}
