/**
 * Formatters Utility
 * Handles formatting of numbers, currency, dates, and other display elements
 */

class Formatters {
    /**
     * Format currency amount
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (default: 'GBP')
     * @param {boolean} showSymbol - Whether to show currency symbol
     * @returns {string} Formatted currency string
     */
    static formatCurrency(amount, currency = 'GBP', showSymbol = true) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return showSymbol ? '£0.00' : '0.00';
        }
        
        // Handle infinite values
        if (!isFinite(amount)) {
            return showSymbol ? '£∞' : '∞';
        }
        
        const formatter = new Intl.NumberFormat('en-GB', {
            style: showSymbol ? 'currency' : 'decimal',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        return formatter.format(amount);
    }
    
    /**
     * Format percentage
     * @param {number} value - Value to format as percentage
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted percentage string
     */
    static formatPercentage(value, decimals = 1) {
        if (value === null || value === undefined || isNaN(value)) {
            return '0%';
        }
        
        const formatter = new Intl.NumberFormat('en-GB', {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        
        return formatter.format(value / 100);
    }
    
    /**
     * Format number with specified decimal places
     * @param {number} value - Value to format
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted number string
     */
    static formatNumber(value, decimals = 0) {
        if (value === null || value === undefined || isNaN(value)) {
            return '0';
        }
        
        const formatter = new Intl.NumberFormat('en-GB', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        
        return formatter.format(value);
    }
    
    /**
     * Format date
     * @param {Date|string} date - Date to format
     * @param {string} format - Format style ('short', 'long', 'iso')
     * @returns {string} Formatted date string
     */
    static formatDate(date, format = 'short') {
        if (!date) return '';
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        
        switch (format) {
            case 'long':
                return dateObj.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'iso':
                return dateObj.toISOString().split('T')[0];
            case 'short':
            default:
                return dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
        }
    }
    
    /**
     * Format tax year for display
     * @param {string} taxYear - Tax year in format 'YYYY_YY'
     * @returns {string} Formatted tax year
     */
    static formatTaxYear(taxYear) {
        if (!taxYear) return '';
        
        // Convert '2024_25' to '2024/25'
        return taxYear.replace('_', '/');
    }
    
    /**
     * Format calculation breakdown for display
     * @param {Object} calculation - Calculation result
     * @returns {Object} Formatted calculation
     */
    static formatCalculation(calculation) {
        if (!calculation) return null;
        
        return {
            standardAllowance: this.formatCurrency(calculation.standardAllowance),
            housingElement: this.formatCurrency(calculation.housingElement),
            childElement: this.formatCurrency(calculation.childElement),
            childcareElement: this.formatCurrency(calculation.childcareElement),
            totalElements: this.formatCurrency(calculation.totalElements),
            earningsReduction: this.formatCurrency(calculation.earningsReduction),
            capitalDeduction: this.formatCurrency(calculation.capitalDeduction),
            benefitDeduction: this.formatCurrency(calculation.benefitDeduction),
            totalDeductions: this.formatCurrency(calculation.totalDeductions),
            finalAmount: this.formatCurrency(calculation.finalAmount)
        };
    }
    
    /**
     * Format input values for display
     * @param {Object} input - Input values
     * @returns {Object} Formatted input
     */
    static formatInput(input) {
        if (!input) return null;
        
        return {
            age: input.age,
            circumstances: input.circumstances === 'single' ? 'Single' : 'Couple',
            children: input.children,
            childrenAge: this.formatChildrenAge(input.childrenAge),
            rent: this.formatCurrency(input.rent),
            serviceCharges: this.formatCurrency(input.serviceCharges),
            monthlyEarnings: this.formatCurrency(input.monthlyEarnings),
            childcareCosts: this.formatCurrency(input.childcareCosts),
            savings: this.formatCurrency(input.savings),
            otherBenefits: this.formatCurrency(input.otherBenefits),
            taxYear: this.formatTaxYear(input.taxYear)
        };
    }
    
    /**
     * Format children age category for display
     * @param {string} ageCategory - Age category code
     * @returns {string} Formatted age category
     */
    static formatChildrenAge(ageCategory) {
        const ageMap = {
            'under1': 'Under 1',
            '1to2': '1 to 2',
            '3to4': '3 to 4',
            '5to10': '5 to 10',
            '11to15': '11 to 15',
            '16to19': '16 to 19'
        };
        
        return ageMap[ageCategory] || ageCategory;
    }
    
    /**
     * Format file size
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Format duration in milliseconds
     * @param {number} ms - Duration in milliseconds
     * @returns {string} Formatted duration
     */
    static formatDuration(ms) {
        if (ms < 1000) return ms + 'ms';
        if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
        if (ms < 3600000) return (ms / 60000).toFixed(1) + 'm';
        return (ms / 3600000).toFixed(1) + 'h';
    }
    
    /**
     * Format phone number
     * @param {string} phone - Phone number
     * @returns {string} Formatted phone number
     */
    static formatPhone(phone) {
        if (!phone) return '';
        
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Format UK phone numbers
        if (cleaned.length === 11 && cleaned.startsWith('0')) {
            return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
        }
        
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        }
        
        return phone;
    }
    
    /**
     * Format postcode
     * @param {string} postcode - Postcode
     * @returns {string} Formatted postcode
     */
    static formatPostcode(postcode) {
        if (!postcode) return '';
        
        // Remove spaces and convert to uppercase
        const cleaned = postcode.replace(/\s/g, '').toUpperCase();
        
        // Basic UK postcode formatting
        if (cleaned.length >= 5) {
            return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
        }
        
        return postcode.toUpperCase();
    }
    
    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    static truncateText(text, maxLength = 50) {
        if (!text || text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }
    
    /**
     * Format error message for display
     * @param {string|Array} error - Error message or array of errors
     * @returns {string} Formatted error message
     */
    static formatError(error) {
        if (Array.isArray(error)) {
            return error.join(', ');
        }
        return error || 'An error occurred';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Formatters;
}



