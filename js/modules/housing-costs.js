/**
 * Housing Costs Module for Universal Credit Calculator
 * Handles all housing-related calculations including:
 * - Private tenant LHA calculations
 * - Social tenant bedroom tax calculations
 * - Non-dependant deductions
 */

class HousingCostsModule {
    constructor() {
        this.privateTenantModule = new PrivateTenantModule();
        this.socialTenantModule = new SocialTenantModule();
        this.nonDependantModule = new NonDependantModule();
    }

    /**
     * Calculate total housing element
     * @param {Object} housingData - Housing information
     * @returns {Object} Housing calculation result
     */
    calculateHousingElement(housingData) {
        const {
            tenantType, // 'private' or 'social'
            rent,
            serviceCharges,
            area,
            bedrooms,
            householdSize,
            nonDependants,
            ...otherData
        } = housingData;

        let housingElement = 0;
        let breakdown = {};

        // Calculate base housing element based on tenant type
        if (tenantType === 'private') {
            const privateResult = this.privateTenantModule.calculateLHA({
                rent,
                serviceCharges,
                area,
                bedrooms,
                householdSize,
                ...otherData
            });
            housingElement = privateResult.housingElement;
            breakdown = { ...privateResult };
        } else if (tenantType === 'social') {
            const socialResult = this.socialTenantModule.calculateSocialRent({
                rent,
                serviceCharges,
                bedrooms,
                householdSize,
                ...otherData
            });
            housingElement = socialResult.housingElement;
            breakdown = { ...socialResult };
        }

        // Calculate non-dependant deductions
        const nonDependantResult = this.nonDependantModule.calculateDeductions({
            nonDependants,
            tenantType,
            ...otherData
        });

        // Apply non-dependant deductions
        const totalDeductions = nonDependantResult.totalDeduction;
        housingElement = Math.max(0, housingElement - totalDeductions);

        return {
            housingElement,
            breakdown: {
                ...breakdown,
                nonDependants: nonDependantResult
            },
            totalDeductions,
            finalHousingElement: housingElement
        };
    }

    /**
     * Get available areas for LHA calculations
     * @returns {Array} List of available areas
     */
    getAvailableAreas() {
        return this.privateTenantModule.getAvailableAreas();
    }

    /**
     * Get bedroom entitlement for household size
     * @param {number} householdSize - Number of people in household
     * @param {Array} children - Array of children (for age-based calculations)
     * @returns {number} Number of bedrooms entitled to
     */
    getBedroomEntitlement(householdSize, children = []) {
        // Basic entitlement: 1 bedroom per couple/single + 1 bedroom per 2 children of same sex
        // This is a simplified version - real rules are more complex
        let entitlement = 1; // At least 1 bedroom

        if (householdSize > 2) {
            // Additional bedrooms for larger households
            entitlement = Math.ceil(householdSize / 2);
        }

        // Ensure minimum of 1 bedroom
        return Math.max(1, entitlement);
    }
}

/**
 * Private Tenant Module - Handles LHA calculations
 */
class PrivateTenantModule {
    constructor() {
        this.lhaRates = this.initializeLHARates();
    }

    /**
     * Initialize LHA rates for different areas
     * @returns {Object} LHA rates by area and bedroom count
     */
    initializeLHARates() {
        return {
            'london_central': {
                sharedRoom: 800.00,
                oneBedroom: 1200.00,
                twoBedroom: 1500.00,
                threeBedroom: 1800.00,
                fourBedroom: 2100.00
            },
            'london_outer': {
                sharedRoom: 600.00,
                oneBedroom: 900.00,
                twoBedroom: 1100.00,
                threeBedroom: 1300.00,
                fourBedroom: 1500.00
            },
            'manchester': {
                sharedRoom: 400.00,
                oneBedroom: 600.00,
                twoBedroom: 750.00,
                threeBedroom: 900.00,
                fourBedroom: 1100.00
            },
            'birmingham': {
                sharedRoom: 350.00,
                oneBedroom: 550.00,
                twoBedroom: 700.00,
                threeBedroom: 850.00,
                fourBedroom: 1000.00
            },
            'leeds': {
                sharedRoom: 350.00,
                oneBedroom: 550.00,
                twoBedroom: 700.00,
                threeBedroom: 850.00,
                fourBedroom: 1000.00
            },
            'liverpool': {
                sharedRoom: 300.00,
                oneBedroom: 500.00,
                twoBedroom: 650.00,
                threeBedroom: 800.00,
                fourBedroom: 950.00
            },
            'bristol': {
                sharedRoom: 450.00,
                oneBedroom: 700.00,
                twoBedroom: 900.00,
                threeBedroom: 1100.00,
                fourBedroom: 1300.00
            },
            'cardiff': {
                sharedRoom: 350.00,
                oneBedroom: 550.00,
                twoBedroom: 700.00,
                threeBedroom: 850.00,
                fourBedroom: 1000.00
            },
            'edinburgh': {
                sharedRoom: 400.00,
                oneBedroom: 650.00,
                twoBedroom: 800.00,
                threeBedroom: 950.00,
                fourBedroom: 1100.00
            },
            'glasgow': {
                sharedRoom: 350.00,
                oneBedroom: 550.00,
                twoBedroom: 700.00,
                threeBedroom: 850.00,
                fourBedroom: 1000.00
            },
            'default': {
                sharedRoom: 350.00,
                oneBedroom: 550.00,
                twoBedroom: 700.00,
                threeBedroom: 850.00,
                fourBedroom: 1000.00
            }
        };
    }

    /**
     * Calculate LHA for private tenant
     * @param {Object} data - Tenant data
     * @returns {Object} LHA calculation result
     */
    calculateLHA(data) {
        const {
            rent,
            serviceCharges = 0,
            area = 'default',
            bedrooms = 1,
            householdSize = 1,
            children = []
        } = data;

        // Get bedroom entitlement
        const bedroomEntitlement = this.getBedroomEntitlement(householdSize, children);
        
        // Get LHA rate for area and bedroom entitlement
        const lhaRate = this.getLHARate(area, bedroomEntitlement);
        
        // Calculate eligible rent (lower of actual rent or LHA rate)
        const eligibleRent = Math.min(rent, lhaRate);
        
        // Add service charges (up to reasonable limit)
        const maxServiceCharges = 100; // Reasonable limit
        const eligibleServiceCharges = Math.min(serviceCharges, maxServiceCharges);
        
        const housingElement = eligibleRent + eligibleServiceCharges;

        return {
            housingElement,
            lhaRate,
            eligibleRent,
            eligibleServiceCharges,
            bedroomEntitlement,
            breakdown: {
                actualRent: rent,
                lhaRate,
                eligibleRent,
                serviceCharges,
                eligibleServiceCharges,
                totalHousingElement: housingElement
            }
        };
    }

    /**
     * Get LHA rate for area and bedroom count
     * @param {string} area - Area code
     * @param {number} bedrooms - Number of bedrooms
     * @returns {number} LHA rate
     */
    getLHARate(area, bedrooms) {
        const areaRates = this.lhaRates[area] || this.lhaRates.default;
        
        if (bedrooms === 0) return areaRates.sharedRoom;
        if (bedrooms === 1) return areaRates.oneBedroom;
        if (bedrooms === 2) return areaRates.twoBedroom;
        if (bedrooms === 3) return areaRates.threeBedroom;
        if (bedrooms >= 4) return areaRates.fourBedroom;
        
        return areaRates.oneBedroom; // Default
    }

    /**
     * Get bedroom entitlement for private tenants
     * @param {number} householdSize - Number of people
     * @param {Array} children - Children in household
     * @returns {number} Bedroom entitlement
     */
    getBedroomEntitlement(householdSize, children = []) {
        // Private tenant bedroom entitlement rules
        if (householdSize === 1) return 1;
        if (householdSize === 2) return 1; // Couple shares bedroom
        if (householdSize === 3) return 2; // Couple + 1 child
        if (householdSize === 4) return 2; // Couple + 2 children (same sex under 16)
        if (householdSize === 5) return 3; // Couple + 3 children
        if (householdSize >= 6) return Math.ceil(householdSize / 2);
        
        return 1;
    }

    /**
     * Get available areas
     * @returns {Array} List of available areas
     */
    getAvailableAreas() {
        return Object.keys(this.lhaRates).filter(area => area !== 'default');
    }
}

/**
 * Social Tenant Module - Handles bedroom tax calculations
 */
class SocialTenantModule {
    constructor() {
        this.bedroomTaxRates = {
            oneSpareBedroom: 0.14, // 14% reduction
            twoOrMoreSpareBedrooms: 0.25 // 25% reduction
        };
    }

    /**
     * Calculate social rent with bedroom tax
     * @param {Object} data - Tenant data
     * @returns {Object} Social rent calculation result
     */
    calculateSocialRent(data) {
        const {
            rent,
            serviceCharges = 0,
            bedrooms = 1,
            householdSize = 1,
            children = [],
            exemptions = []
        } = data;

        // Get bedroom entitlement
        const bedroomEntitlement = this.getBedroomEntitlement(householdSize, children);
        
        // Check for exemptions
        const hasExemption = this.checkExemptions(exemptions);
        
        let bedroomTaxReduction = 0;
        let spareBedrooms = 0;
        
        if (!hasExemption) {
            spareBedrooms = Math.max(0, bedrooms - bedroomEntitlement);
            
            if (spareBedrooms === 1) {
                bedroomTaxReduction = rent * this.bedroomTaxRates.oneSpareBedroom;
            } else if (spareBedrooms >= 2) {
                bedroomTaxReduction = rent * this.bedroomTaxRates.twoOrMoreSpareBedrooms;
            }
        }

        // Calculate eligible rent after bedroom tax
        const eligibleRent = rent - bedroomTaxReduction;
        
        // Add service charges
        const maxServiceCharges = 100;
        const eligibleServiceCharges = Math.min(serviceCharges, maxServiceCharges);
        
        const housingElement = eligibleRent + eligibleServiceCharges;

        return {
            housingElement,
            bedroomEntitlement,
            spareBedrooms,
            bedroomTaxReduction,
            eligibleRent,
            eligibleServiceCharges,
            hasExemption,
            breakdown: {
                actualRent: rent,
                bedroomEntitlement,
                spareBedrooms,
                bedroomTaxReduction,
                eligibleRent,
                serviceCharges,
                eligibleServiceCharges,
                totalHousingElement: housingElement
            }
        };
    }

    /**
     * Get bedroom entitlement for social tenants
     * @param {number} householdSize - Number of people
     * @param {Array} children - Children in household
     * @returns {number} Bedroom entitlement
     */
    getBedroomEntitlement(householdSize, children = []) {
        // Social tenant bedroom entitlement rules (similar to private but can be more generous)
        if (householdSize === 1) return 1;
        if (householdSize === 2) return 1; // Couple shares bedroom
        if (householdSize === 3) return 2; // Couple + 1 child
        if (householdSize === 4) return 2; // Couple + 2 children (same sex under 16)
        if (householdSize === 5) return 3; // Couple + 3 children
        if (householdSize >= 6) return Math.ceil(householdSize / 2);
        
        return 1;
    }

    /**
     * Check for bedroom tax exemptions
     * @param {Array} exemptions - List of exemptions
     * @returns {boolean} Whether tenant has exemption
     */
    checkExemptions(exemptions) {
        const validExemptions = [
            'disabled_adaptations',
            'foster_carer',
            'armed_forces',
            'bereavement',
            'over_65'
        ];
        
        return exemptions.some(exemption => validExemptions.includes(exemption));
    }
}

/**
 * Non-Dependant Module - Handles non-dependant deductions
 */
class NonDependantModule {
    constructor() {
        this.deductionRates = {
            // 2024/25 rates
            '2024_25': {
                single: {
                    under25: 85.73,
                    over25: 85.73
                },
                couple: {
                    under25: 134.25,
                    over25: 134.25
                }
            },
            // 2023/24 rates
            '2023_24': {
                single: {
                    under25: 80.40,
                    over25: 80.40
                },
                couple: {
                    under25: 126.00,
                    over25: 126.00
                }
            }
        };
    }

    /**
     * Calculate non-dependant deductions
     * @param {Object} data - Non-dependant data
     * @returns {Object} Deduction calculation result
     */
    calculateDeductions(data) {
        const {
            nonDependants = [],
            tenantType = 'private',
            taxYear = '2024_25'
        } = data;

        if (!nonDependants || nonDependants.length === 0) {
            return {
                totalDeduction: 0,
                breakdown: [],
                exemptions: []
            };
        }

        const rates = this.deductionRates[taxYear] || this.deductionRates['2024_25'];
        let totalDeduction = 0;
        const breakdown = [];

        nonDependants.forEach((nonDependant, index) => {
            const {
                age = 25,
                isCouple = false,
                hasExemption = false
            } = nonDependant;

            if (hasExemption) {
                breakdown.push({
                    index,
                    age,
                    isCouple,
                    deduction: 0,
                    reason: 'Exempt from deduction'
                });
                return;
            }

            let deduction = 0;
            if (isCouple) {
                deduction = age < 25 ? rates.couple.under25 : rates.couple.over25;
            } else {
                deduction = age < 25 ? rates.single.under25 : rates.single.over25;
            }

            totalDeduction += deduction;
            breakdown.push({
                index,
                age,
                isCouple,
                deduction,
                reason: `Standard deduction for ${isCouple ? 'couple' : 'single'} ${age < 25 ? 'under 25' : 'over 25'}`
            });
        });

        return {
            totalDeduction,
            breakdown,
            exemptions: nonDependants.filter(nd => nd.hasExemption).map(nd => nd.exemptionReason)
        };
    }
}

// Create and export the housing costs module
const housingCostsModule = new HousingCostsModule();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = housingCostsModule;
}








