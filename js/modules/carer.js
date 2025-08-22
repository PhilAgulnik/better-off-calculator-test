/**
 * Carer Module - Handles carer eligibility and calculations
 */

class CarerModule {
    constructor() {
        this.carerAllowanceRates = {
            '2024_25': 81.90,
            '2023_24': 76.75
        };
        this.earningsLimit = 151;
        this.caringHoursThreshold = 35;
    }

    checkCarerEligibility(input) {
        const result = {
            isEligible: false,
            route: null,
            carerAllowance: 0,
            carerElement: false,
            warnings: []
        };

        const isCarer = input.isCarer || false;
        const isPartnerCarer = input.isPartnerCarer || false;
        const currentlyReceivingCA = input.currentlyReceivingCA || false;
        const isScotland = input.isScotland || false;
        const isUniversalCredit = true; // Always true for UC calculator

        if (!isCarer && !isPartnerCarer) return result;

        // Route 1: Already receiving CA/CSP
        if (currentlyReceivingCA) {
            result.route = 'route1';
            result.isEligible = true;
            result.carerAllowance = this.calculateCarerAllowance(input);
            result.carerElement = true;
            return result;
        }

        const earnings = this.calculateWeeklyEarnings(input);
        const isUnderEarningsLimit = earnings <= this.earningsLimit;
        const caringHours = input.caringHours || 0;
        const meetsHoursRequirement = caringHours >= this.caringHoursThreshold;
        const caredForPersonBenefits = input.caredForPersonBenefits || false;

        if (!meetsHoursRequirement) {
            result.warnings.push('You must spend at least 35 hours per week caring.');
            return result;
        }

        if (!caredForPersonBenefits) {
            result.warnings.push('The person you care for must receive a qualifying disability benefit.');
            return result;
        }

        // Route 2: Potentially eligible for CA/CSP
        if (isUnderEarningsLimit) {
            result.route = isScotland ? 'route2BS' : 'route2B';
            result.isEligible = true;
            
            if (input.includeCarerAllowance !== false) {
                result.carerAllowance = this.calculateCarerAllowance(input);
            }
            
            if (input.includeCarerElement !== false) {
                result.carerElement = true;
            }
        }
        // Route 3: Not eligible for CA due to earnings but potentially eligible for UC CE
        else {
            result.route = 'route3';
            result.isEligible = true;
            
            if (input.includeCarerElement !== false) {
                result.carerElement = true;
            }
        }

        return result;
    }

    calculateWeeklyEarnings(input) {
        const monthlyEarnings = parseFloat(input.monthlyEarnings) || 0;
        const businessIncome = this.calculateBusinessIncome(input);
        const totalMonthlyIncome = monthlyEarnings + businessIncome;
        return totalMonthlyIncome / 4.33;
    }

    calculateBusinessIncome(input) {
        const businessIncomeBank = parseFloat(input.businessIncomeBank) || 0;
        const businessIncomeCash = parseFloat(input.businessIncomeCash) || 0;
        const businessExpenses = this.calculateBusinessExpenses(input);
        return Math.max(0, (businessIncomeBank + businessIncomeCash) - businessExpenses);
    }

    calculateBusinessExpenses(input) {
        const expenses = [
            'businessExpensesRent', 'businessExpensesRates', 'businessExpensesUtilities',
            'businessExpensesInsurance', 'businessExpensesTelephone', 'businessExpensesMarketing',
            'businessExpensesVehicle', 'businessExpensesEquipment', 'businessExpensesPostage',
            'businessExpensesTransport', 'businessExpensesProfessional'
        ];
        return expenses.reduce((total, expense) => total + (parseFloat(input[expense]) || 0), 0);
    }

    calculateCarerAllowance(input) {
        const taxYear = input.taxYear || '2024_25';
        return this.carerAllowanceRates[taxYear] || this.carerAllowanceRates['2024_25'];
    }

    getCarerElementAmount(input) {
        const carerElementRates = {
            '2024_25': 198.31,
            '2023_24': 185.86
        };
        const taxYear = input.taxYear || '2024_25';
        return carerElementRates[taxYear] || carerElementRates['2024_25'];
    }

    determineCarerRoute(input) {
        const isCarer = input.isCarer || false;
        const isPartnerCarer = input.isPartnerCarer || false;
        const currentlyReceivingCA = input.currentlyReceivingCA || false;
        const isScotland = input.isScotland || false;
        const earnings = this.calculateWeeklyEarnings(input);
        const isUnderEarningsLimit = earnings <= this.earningsLimit;

        if (!isCarer && !isPartnerCarer) return null;
        if (currentlyReceivingCA) return 'route1';
        if (isUnderEarningsLimit) return isScotland ? 'route2BS' : 'route2B';
        return 'route3';
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarerModule;
}
