/**
 * Period Converter Utility
 * Handles conversion of amounts between different time periods
 */

class PeriodConverter {
    constructor() {
        this.periodMultipliers = {
            weekly: {
                weekly: 1,
                fortnightly: 2,
                monthly: 4.33, // 52 weeks / 12 months
                yearly: 52
            },
            fortnightly: {
                weekly: 0.5,
                fortnightly: 1,
                monthly: 2.17, // 26 fortnights / 12 months
                yearly: 26
            },
            monthly: {
                weekly: 0.23, // 12 months / 52 weeks
                fortnightly: 0.46, // 12 months / 26 fortnights
                monthly: 1,
                yearly: 12
            },
            yearly: {
                weekly: 0.019, // 1 year / 52 weeks
                fortnightly: 0.038, // 1 year / 26 fortnights
                monthly: 0.083, // 1 year / 12 months
                yearly: 1
            }
        };
    }

    /**
     * Convert an amount from one period to another
     * @param {number} amount - The amount to convert
     * @param {string} fromPeriod - The source period (weekly, fortnightly, monthly, yearly)
     * @param {string} toPeriod - The target period (weekly, fortnightly, monthly, yearly)
     * @returns {number} The converted amount
     */
    convert(amount, fromPeriod, toPeriod) {
        if (!amount || amount === 0) return 0;
        
        if (fromPeriod === toPeriod) return amount;
        
        const multiplier = this.periodMultipliers[fromPeriod]?.[toPeriod];
        if (!multiplier) {
            console.warn(`Invalid period conversion: ${fromPeriod} to ${toPeriod}`);
            return amount;
        }
        
        return amount * multiplier;
    }

    /**
     * Convert an amount to monthly (the standard period for UC calculations)
     * @param {number} amount - The amount to convert
     * @param {string} period - The source period
     * @returns {number} The amount converted to monthly
     */
    toMonthly(amount, period) {
        return this.convert(amount, period, 'monthly');
    }

    /**
     * Convert an amount from monthly to another period
     * @param {number} amount - The monthly amount
     * @param {string} period - The target period
     * @returns {number} The amount converted to the target period
     */
    fromMonthly(amount, period) {
        return this.convert(amount, 'monthly', period);
    }

    /**
     * Get all periods available for conversion
     * @returns {string[]} Array of available periods
     */
    getAvailablePeriods() {
        return Object.keys(this.periodMultipliers);
    }

    /**
     * Validate if a period is supported
     * @param {string} period - The period to validate
     * @returns {boolean} True if the period is supported
     */
    isValidPeriod(period) {
        return this.periodMultipliers.hasOwnProperty(period);
    }

    /**
     * Get the display name for a period
     * @param {string} period - The period code
     * @returns {string} The display name
     */
    getPeriodDisplayName(period) {
        const displayNames = {
            weekly: 'per week',
            fortnightly: 'per fortnight',
            monthly: 'per month',
            yearly: 'per year'
        };
        return displayNames[period] || period;
    }

    /**
     * Get the short name for a period
     * @param {string} period - The period code
     * @returns {string} The short name
     */
    getPeriodShortName(period) {
        const shortNames = {
            weekly: 'week',
            fortnightly: 'fortnight',
            monthly: 'month',
            yearly: 'year'
        };
        return shortNames[period] || period;
    }
}

// Create and export a singleton instance
const periodConverter = new PeriodConverter();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = periodConverter;
} else if (typeof window !== 'undefined') {
    window.periodConverter = periodConverter;
}
