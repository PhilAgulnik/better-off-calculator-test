/**
 * Universal Credit Calculator - Main Application
 * Initializes the calculator and handles the user interface
 */

class UniversalCreditApp {
    constructor() {
        this.calculator = null;
        this.isInitialized = false;
        this.currentCalculation = null;
        this.savedScenarios = [];
        
        // DOM elements
        this.elements = {};
        
        // Event handlers
        this.handlers = {};
        
        this.initialize();
    }
    
    /**
     * Initialize the application
     */
    initialize() {
        console.log('Initializing Universal Credit Calculator App...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }
    
    /**
     * Setup the application after DOM is ready
     */
    setupApp() {
        try {
            // Initialize calculator
            this.calculator = typeof universalCreditCalculator !== 'undefined' ? 
                universalCreditCalculator : null;
            
            if (!this.calculator) {
                console.error('Calculator not available');
                this.showError('Calculator failed to initialize');
                return;
            }
            
            // Initialize calculator
            if (!this.calculator.initialize()) {
                console.error('Calculator initialization failed');
                this.showError('Calculator initialization failed');
                return;
            }
            
            // Cache DOM elements
            this.cacheElements();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Load saved scenarios
            this.loadSavedScenarios();
            
            // Setup form validation
            this.setupValidation();
            
            // Initialize UI state
            this.initializeUI();
            
            this.isInitialized = true;
            console.log('Universal Credit Calculator App initialized successfully');
            
        } catch (error) {
            console.error('App initialization error:', error);
            this.showError('Application failed to initialize');
        }
    }
    
    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            // Form elements
            taxYear: document.getElementById('taxYear'),
            circumstances: document.querySelectorAll('input[name="circumstances"]'),
            age: document.getElementById('age'),
            partnerAge: document.getElementById('partnerAge'),
            partnerAgeGroup: document.getElementById('partnerAgeGroup'),
            children: document.getElementById('children'),
            childrenAge: document.getElementById('childrenAge'),
            rent: document.getElementById('rent'),
            rentPeriod: document.getElementById('rentPeriod'),
            serviceCharges: document.getElementById('serviceCharges'),
            serviceChargesPeriod: document.getElementById('serviceChargesPeriod'),
            bedrooms: document.getElementById('bedrooms'),
            tenantType: document.querySelectorAll('input[name="tenantType"]'),
            area: document.getElementById('area'),
            privateTenantOptions: document.getElementById('privateTenantOptions'),
            socialTenantOptions: document.getElementById('socialTenantOptions'),
            nonDependants: document.getElementById('nonDependants'),
            nonDependantsDetails: document.getElementById('nonDependantsDetails'),
            monthlyEarnings: document.getElementById('monthlyEarnings'),
            monthlyEarningsPeriod: document.getElementById('monthlyEarningsPeriod'),
            childcareCosts: document.getElementById('childcareCosts'),
            childcareCostsPeriod: document.getElementById('childcareCostsPeriod'),
            
            // Employment type toggle
            employmentType: document.querySelectorAll('input[name="employmentType"]'),
            employedSection: document.getElementById('employedSection'),
            selfEmployedSection: document.getElementById('selfEmployedSection'),
            
            // Self-employed business income
            businessIncomeBank: document.getElementById('businessIncomeBank'),
            businessIncomeBankPeriod: document.getElementById('businessIncomeBankPeriod'),
            businessIncomeCash: document.getElementById('businessIncomeCash'),
            businessIncomeCashPeriod: document.getElementById('businessIncomeCashPeriod'),
            
            // Self-employed business expenses
            businessExpensesRent: document.getElementById('businessExpensesRent'),
            businessExpensesRentPeriod: document.getElementById('businessExpensesRentPeriod'),
            businessExpensesRates: document.getElementById('businessExpensesRates'),
            businessExpensesRatesPeriod: document.getElementById('businessExpensesRatesPeriod'),
            businessExpensesUtilities: document.getElementById('businessExpensesUtilities'),
            businessExpensesUtilitiesPeriod: document.getElementById('businessExpensesUtilitiesPeriod'),
            businessExpensesInsurance: document.getElementById('businessExpensesInsurance'),
            businessExpensesInsurancePeriod: document.getElementById('businessExpensesInsurancePeriod'),
            businessExpensesTelephone: document.getElementById('businessExpensesTelephone'),
            businessExpensesTelephonePeriod: document.getElementById('businessExpensesTelephonePeriod'),
            businessExpensesMarketing: document.getElementById('businessExpensesMarketing'),
            businessExpensesMarketingPeriod: document.getElementById('businessExpensesMarketingPeriod'),
            businessExpensesVehicle: document.getElementById('businessExpensesVehicle'),
            businessExpensesVehiclePeriod: document.getElementById('businessExpensesVehiclePeriod'),
            businessExpensesEquipment: document.getElementById('businessExpensesEquipment'),
            businessExpensesEquipmentPeriod: document.getElementById('businessExpensesEquipmentPeriod'),
            businessExpensesPostage: document.getElementById('businessExpensesPostage'),
            businessExpensesPostagePeriod: document.getElementById('businessExpensesPostagePeriod'),
            businessExpensesTransport: document.getElementById('businessExpensesTransport'),
            businessExpensesTransportPeriod: document.getElementById('businessExpensesTransportPeriod'),
            businessExpensesProfessional: document.getElementById('businessExpensesProfessional'),
            businessExpensesProfessionalPeriod: document.getElementById('businessExpensesProfessionalPeriod'),
            
            // Self-employed tax, NIC, pensions
            businessTax: document.getElementById('businessTax'),
            businessTaxPeriod: document.getElementById('businessTaxPeriod'),
            businessNIC: document.getElementById('businessNIC'),
            businessNICPeriod: document.getElementById('businessNICPeriod'),
            businessPension: document.getElementById('businessPension'),
            businessPensionPeriod: document.getElementById('businessPensionPeriod'),
            
            // Self-employed home and car costs
            businessCarMiles: document.getElementById('businessCarMiles'),
            businessCarDeduction: document.getElementById('businessCarDeduction'),
            businessHomeHours: document.getElementById('businessHomeHours'),
            businessHomeDeduction: document.getElementById('businessHomeDeduction'),
            
            // Net loss display elements
            totalBusinessIncome: document.getElementById('totalBusinessIncome'),
            totalBusinessExpenses: document.getElementById('totalBusinessExpenses'),
            totalTaxNICPension: document.getElementById('totalTaxNICPension'),
            totalHomeAndCar: document.getElementById('totalHomeAndCar'),
            netBusinessProfit: document.getElementById('netBusinessProfit'),
            
            // Carer elements
            isCarer: document.getElementById('isCarer'),
            isPartnerCarer: document.getElementById('isPartnerCarer'),
            currentlyReceivingCA: document.getElementById('currentlyReceivingCA'),
            isScotland: document.getElementById('isScotland'),
            carerDetails: document.getElementById('carerDetails'),
            caringHours: document.getElementById('caringHours'),
            caredForPersonBenefits: document.getElementById('caredForPersonBenefits'),
            includeCarerAllowance: document.getElementById('includeCarerAllowance'),
            includeCarerElement: document.getElementById('includeCarerElement'),
            
            savings: document.getElementById('savings'),
            otherBenefits: document.getElementById('otherBenefits'),
            otherBenefitsPeriod: document.getElementById('otherBenefitsPeriod'),
            
            // Buttons
            calculateBtn: document.getElementById('calculateBtn'),
            saveBtn: document.getElementById('saveBtn'),
            resetBtn: document.getElementById('resetBtn'),
            printBtn: document.getElementById('printBtn'),
            exportBtn: document.getElementById('exportBtn'),
            
            // Results elements
            resultsSection: document.getElementById('resultsSection'),
            resultsContainer: document.getElementById('resultsContainer'),
            detailedResults: document.getElementById('detailedResults'),
            standardAllowance: document.getElementById('standardAllowance'),
            housingElement: document.getElementById('housingElement'),
            childElement: document.getElementById('childElement'),
            childcareElement: document.getElementById('childcareElement'),
            totalElements: document.getElementById('totalElements'),
            earningsReduction: document.getElementById('earningsReduction'),
            otherDeductions: document.getElementById('otherDeductions'),
            finalAmount: document.getElementById('finalAmount'),
            
            // Saved scenarios
            savedScenariosList: document.getElementById('savedScenariosList'),
            
            // Loading overlay
            loadingOverlay: document.getElementById('loadingOverlay')
        };
    }
    
    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Calculate button
        this.elements.calculateBtn.addEventListener('click', () => this.handleCalculate());
        
        // Save scenario button
        this.elements.saveBtn.addEventListener('click', () => this.handleSaveScenario());
        
        // Reset button
        this.elements.resetBtn.addEventListener('click', () => this.handleReset());
        
        // Print button
        this.elements.printBtn.addEventListener('click', () => this.handlePrint());
        
        // Export button
        this.elements.exportBtn.addEventListener('click', () => this.handleExport());
        
        // Tax year change
        this.elements.taxYear.addEventListener('change', () => this.handleTaxYearChange());
        
        // Real-time calculation on input change
        this.setupRealTimeCalculation();
        
        // Form validation on input
        this.setupFormValidation();
    }
    
    /**
     * Setup real-time calculation
     */
    setupRealTimeCalculation() {
        const inputs = [
            this.elements.age,
            this.elements.partnerAge,
            this.elements.children,
            this.elements.rent,
            this.elements.serviceCharges,
            this.elements.bedrooms,
            this.elements.nonDependants,
            this.elements.monthlyEarnings,
            this.elements.childcareCosts,
            
            // Self-employed fields
            this.elements.businessIncomeBank,
            this.elements.businessIncomeCash,
            this.elements.businessExpensesRent,
            this.elements.businessExpensesRates,
            this.elements.businessExpensesUtilities,
            this.elements.businessExpensesInsurance,
            this.elements.businessExpensesTelephone,
            this.elements.businessExpensesMarketing,
            this.elements.businessExpensesVehicle,
            this.elements.businessExpensesEquipment,
            this.elements.businessExpensesPostage,
            this.elements.businessExpensesTransport,
            this.elements.businessExpensesProfessional,
            this.elements.businessTax,
            this.elements.businessNIC,
            this.elements.businessPension,
            this.elements.businessCarMiles,
            this.elements.businessHomeHours,
            
            // Carer fields
            this.elements.caringHours,
            this.elements.caredForPersonBenefits,
            this.elements.includeCarerAllowance,
            this.elements.includeCarerElement,
            
            this.elements.savings,
            this.elements.otherBenefits
        ];
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                // Update self-employed calculation if it's a business field
                if (input.id && input.id.startsWith('business')) {
                    this.updateSelfEmployedCalculation();
                }
                
                // Debounce the calculation
                clearTimeout(this.calculationTimeout);
                this.calculationTimeout = setTimeout(() => {
                    this.handleCalculate();
                }, 500);
            });
        });
        
        // Period selectors - trigger recalculation when period changes
        const periodSelectors = [
            this.elements.rentPeriod,
            this.elements.serviceChargesPeriod,
            this.elements.monthlyEarningsPeriod,
            this.elements.childcareCostsPeriod,
            this.elements.businessIncomeBankPeriod,
            this.elements.businessIncomeCashPeriod,
            this.elements.businessExpensesRentPeriod,
            this.elements.businessExpensesRatesPeriod,
            this.elements.businessExpensesUtilitiesPeriod,
            this.elements.businessExpensesInsurancePeriod,
            this.elements.businessExpensesTelephonePeriod,
            this.elements.businessExpensesMarketingPeriod,
            this.elements.businessExpensesVehiclePeriod,
            this.elements.businessExpensesEquipmentPeriod,
            this.elements.businessExpensesPostagePeriod,
            this.elements.businessExpensesTransportPeriod,
            this.elements.businessExpensesProfessionalPeriod,
            this.elements.businessTaxPeriod,
            this.elements.businessNICPeriod,
            this.elements.businessPensionPeriod,
            this.elements.otherBenefitsPeriod
        ];
        
        periodSelectors.forEach(selector => {
            if (selector) {
                selector.addEventListener('change', () => {
                    // Update self-employed calculation if it's a business field period
                    if (selector.id && selector.id.startsWith('business')) {
                        this.updateSelfEmployedCalculation();
                    }
                    
                    // Trigger immediate calculation for period changes
                    this.handleCalculate();
                });
            }
        });
        
        // Radio buttons for circumstances
        this.elements.circumstances.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handleCircumstancesChange();
                this.handleCalculate();
            });
        });

        // Radio buttons for tenant type
        this.elements.tenantType.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handleTenantTypeChange();
                this.handleCalculate();
            });
        });
        
        // Select elements
        this.elements.childrenAge.addEventListener('change', () => {
            this.handleCalculate();
        });

        // Non-dependants field
        this.elements.nonDependants.addEventListener('input', () => {
            this.handleNonDependantsChange();
            this.handleCalculate();
        });

        // Employment type toggle
        this.elements.employmentType.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handleEmploymentTypeChange();
                this.handleCalculate();
            });
        });

        // Carer checkboxes
        this.elements.isCarer.addEventListener('change', () => {
            this.handleCarerChange();
            this.handleCalculate();
        });

        this.elements.isPartnerCarer.addEventListener('change', () => {
            this.handleCarerChange();
            this.handleCalculate();
        });

        this.elements.currentlyReceivingCA.addEventListener('change', () => {
            this.handleCalculate();
        });

        this.elements.isScotland.addEventListener('change', () => {
            this.handleCalculate();
        });
    }
    
    /**
     * Setup form validation
     */
    setupFormValidation() {
        const inputs = [
            this.elements.age,
            this.elements.partnerAge,
            this.elements.children,
            this.elements.rent,
            this.elements.serviceCharges,
            this.elements.bedrooms,
            this.elements.nonDependants,
            this.elements.monthlyEarnings,
            this.elements.childcareCosts,
            
            // Self-employed fields
            this.elements.businessIncomeBank,
            this.elements.businessIncomeCash,
            this.elements.businessExpensesRent,
            this.elements.businessExpensesRates,
            this.elements.businessExpensesUtilities,
            this.elements.businessExpensesInsurance,
            this.elements.businessExpensesTelephone,
            this.elements.businessExpensesMarketing,
            this.elements.businessExpensesVehicle,
            this.elements.businessExpensesEquipment,
            this.elements.businessExpensesPostage,
            this.elements.businessExpensesTransport,
            this.elements.businessExpensesProfessional,
            this.elements.businessTax,
            this.elements.businessNIC,
            this.elements.businessPension,
            this.elements.businessCarMiles,
            this.elements.businessHomeHours,
            
            this.elements.savings,
            this.elements.otherBenefits
        ];
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    /**
     * Handle calculate button click
     */
    handleCalculate() {
        if (!this.isInitialized) return;
        
        this.showLoading(true);
        
        try {
            const input = this.getFormData();
            const result = this.calculator.calculate(input);
            
            if (result.success) {
                this.displayResults(result);
                this.currentCalculation = result;
            } else {
                this.showErrors(result.errors);
            }
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('An error occurred during calculation');
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * Handle save scenario button click
     */
    handleSaveScenario() {
        if (!this.currentCalculation) {
            this.showError('No calculation to save');
            return;
        }
        
        const scenarioName = prompt('Enter a name for this scenario:');
        if (!scenarioName) return;
        
        const scenario = {
            name: scenarioName,
            input: this.currentCalculation.input,
            calculation: this.currentCalculation.calculation,
            taxYear: this.currentCalculation.taxYear,
            savedAt: new Date().toISOString()
        };
        
        this.savedScenarios.push(scenario);
        this.saveScenariosToStorage();
        this.displaySavedScenarios();
        
        this.showSuccess(`Scenario "${scenarioName}" saved successfully`);
    }
    
    /**
     * Handle reset button click
     */
    handleReset() {
        if (confirm('Are you sure you want to reset all fields?')) {
            this.resetForm();
            this.clearResults();
        }
    }
    
    /**
     * Handle print button click
     */
    handlePrint() {
        if (!this.currentCalculation) {
            this.showError('No calculation to print');
            return;
        }
        
        window.print();
    }
    
    /**
     * Handle export button click
     */
    handleExport() {
        if (!this.currentCalculation) {
            this.showError('No calculation to export');
            return;
        }
        
        const exportData = this.calculator.exportCalculation();
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `universal-credit-calculation-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Handle tax year change
     */
    handleTaxYearChange() {
        const newTaxYear = this.elements.taxYear.value;
        if (this.calculator.ratesManager.setCurrentTaxYear(newTaxYear)) {
            // Recalculate if we have current data
            if (this.currentCalculation) {
                this.handleCalculate();
            }
        }
    }
    
    /**
     * Handle circumstances change
     */
    handleCircumstancesChange() {
        const circumstances = Array.from(this.elements.circumstances)
            .find(radio => radio.checked)?.value || 'single';
        
        if (circumstances === 'couple') {
            this.elements.partnerAgeGroup.style.display = 'block';
        } else {
            this.elements.partnerAgeGroup.style.display = 'none';
        }
    }

    /**
     * Handle tenant type change
     */
    handleTenantTypeChange() {
        const tenantType = Array.from(this.elements.tenantType)
            .find(radio => radio.checked)?.value || 'private';
        
        if (tenantType === 'private') {
            this.elements.privateTenantOptions.style.display = 'block';
            this.elements.socialTenantOptions.style.display = 'none';
        } else {
            this.elements.privateTenantOptions.style.display = 'none';
            this.elements.socialTenantOptions.style.display = 'block';
        }
    }

    /**
     * Handle non-dependants change
     */
    handleNonDependantsChange() {
        const count = parseInt(this.elements.nonDependants.value) || 0;
        
        if (count > 0) {
            this.elements.nonDependantsDetails.style.display = 'block';
            this.createNonDependantsForm(count);
        } else {
            this.elements.nonDependantsDetails.style.display = 'none';
            this.elements.nonDependantsDetails.innerHTML = '';
        }
    }

    /**
     * Handle employment type change
     */
    handleEmploymentTypeChange() {
        const employmentType = Array.from(this.elements.employmentType)
            .find(radio => radio.checked)?.value || 'employed';
        
        if (employmentType === 'employed') {
            this.elements.employedSection.style.display = 'block';
            this.elements.selfEmployedSection.style.display = 'none';
        } else {
            this.elements.employedSection.style.display = 'none';
            this.elements.selfEmployedSection.style.display = 'block';
        }
    }

    /**
     * Handle carer change
     */
    handleCarerChange() {
        const isCarer = this.elements.isCarer.checked;
        const isPartnerCarer = this.elements.isPartnerCarer.checked;
        
        if (isCarer || isPartnerCarer) {
            this.elements.carerDetails.style.display = 'block';
        } else {
            this.elements.carerDetails.style.display = 'none';
        }
    }

    /**
     * Create non-dependants form
     */
    createNonDependantsForm(count) {
        let html = '<h4>Non-Dependant Details</h4>';
        
        for (let i = 0; i < count; i++) {
            html += `
                <div class="non-dependant-item">
                    <div class="non-dependant-header">
                        <span class="non-dependant-title">Non-Dependant ${i + 1}</span>
                        <button type="button" class="remove-non-dependant" onclick="app.removeNonDependant(${i})">Remove</button>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nonDependantAge${i}">Age</label>
                            <input type="number" id="nonDependantAge${i}" class="form-control" min="16" max="120" value="25">
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="nonDependantCouple${i}">
                                <span class="checkbox-custom"></span>
                                Is a couple
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="nonDependantExemption${i}">
                                <span class="checkbox-custom"></span>
                                Has exemption
                            </label>
                        </div>
                    </div>
                </div>
            `;
        }
        
        this.elements.nonDependantsDetails.innerHTML = html;
    }

    /**
     * Remove non-dependant
     */
    removeNonDependant(index) {
        const currentCount = parseInt(this.elements.nonDependants.value) || 0;
        if (currentCount > 0) {
            this.elements.nonDependants.value = currentCount - 1;
            this.handleNonDependantsChange();
            this.handleCalculate();
        }
    }
    
    /**
     * Convert amount with period to monthly value
     * @param {string} inputId - The input field ID
     * @param {string} periodId - The period selector ID
     * @returns {number} The amount converted to monthly
     */
    convertToMonthly(inputId, periodId) {
        const amount = parseFloat(this.elements[inputId]?.value) || 0;
        const period = this.elements[periodId]?.value || 'monthly';
        
        if (amount === 0 || period === 'monthly') {
            return amount;
        }
        
        // Use the period converter utility
        if (typeof periodConverter !== 'undefined') {
            return periodConverter.toMonthly(amount, period);
        }
        
        // Fallback conversion if periodConverter is not available
        const conversions = {
            weekly: 4.33, // 52 weeks / 12 months
            fortnightly: 2.17, // 26 fortnights / 12 months
            yearly: 0.083 // 1 year / 12 months
        };
        
        return amount * (conversions[period] || 1);
    }
    
    /**
     * Get form data
     * @returns {Object} Form data
     */
    getFormData() {
        const circumstances = Array.from(this.elements.circumstances)
            .find(radio => radio.checked)?.value || 'single';
        const tenantType = Array.from(this.elements.tenantType)
            .find(radio => radio.checked)?.value || 'private';
        
        // Get exemptions for social tenants
        const exemptions = [];
        if (tenantType === 'social') {
            const exemptionCheckboxes = document.querySelectorAll('input[type="checkbox"][value]');
            exemptionCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    exemptions.push(checkbox.value);
                }
            });
        }

        // Get non-dependants data
        const nonDependantsCount = parseInt(this.elements.nonDependants.value) || 0;
        const nonDependants = [];
        for (let i = 0; i < nonDependantsCount; i++) {
            const age = parseInt(document.getElementById(`nonDependantAge${i}`)?.value) || 25;
            const isCouple = document.getElementById(`nonDependantCouple${i}`)?.checked || false;
            const hasExemption = document.getElementById(`nonDependantExemption${i}`)?.checked || false;
            
            nonDependants.push({
                age,
                isCouple,
                hasExemption
            });
        }

        return {
            taxYear: this.elements.taxYear.value,
            circumstances: circumstances,
            age: this.elements.age.value,
            partnerAge: this.elements.partnerAge.value,
            children: this.elements.children.value,
            childrenAge: this.elements.childrenAge.value,
            tenantType: tenantType,
            rent: this.convertToMonthly('rent', 'rentPeriod'),
            serviceCharges: this.convertToMonthly('serviceCharges', 'serviceChargesPeriod'),
            bedrooms: this.elements.bedrooms.value,
            area: this.elements.area.value,
            exemptions: exemptions,
            nonDependants: nonDependants,
            monthlyEarnings: this.convertToMonthly('monthlyEarnings', 'monthlyEarningsPeriod'),
            childcareCosts: this.convertToMonthly('childcareCosts', 'childcareCostsPeriod'),
            
            // Carer data
            isCarer: this.elements.isCarer.checked,
            isPartnerCarer: this.elements.isPartnerCarer.checked,
            currentlyReceivingCA: this.elements.currentlyReceivingCA.checked,
            isScotland: this.elements.isScotland.checked,
            caringHours: this.elements.caringHours.value,
            caredForPersonBenefits: this.elements.caredForPersonBenefits.checked,
            includeCarerAllowance: this.elements.includeCarerAllowance.checked,
            includeCarerElement: this.elements.includeCarerElement.checked,
            
            // Self-employed data (all converted to monthly)
            businessIncomeBank: this.convertToMonthly('businessIncomeBank', 'businessIncomeBankPeriod'),
            businessIncomeCash: this.convertToMonthly('businessIncomeCash', 'businessIncomeCashPeriod'),
            businessExpensesRent: this.convertToMonthly('businessExpensesRent', 'businessExpensesRentPeriod'),
            businessExpensesRates: this.convertToMonthly('businessExpensesRates', 'businessExpensesRatesPeriod'),
            businessExpensesUtilities: this.convertToMonthly('businessExpensesUtilities', 'businessExpensesUtilitiesPeriod'),
            businessExpensesInsurance: this.convertToMonthly('businessExpensesInsurance', 'businessExpensesInsurancePeriod'),
            businessExpensesTelephone: this.convertToMonthly('businessExpensesTelephone', 'businessExpensesTelephonePeriod'),
            businessExpensesMarketing: this.convertToMonthly('businessExpensesMarketing', 'businessExpensesMarketingPeriod'),
            businessExpensesVehicle: this.convertToMonthly('businessExpensesVehicle', 'businessExpensesVehiclePeriod'),
            businessExpensesEquipment: this.convertToMonthly('businessExpensesEquipment', 'businessExpensesEquipmentPeriod'),
            businessExpensesPostage: this.convertToMonthly('businessExpensesPostage', 'businessExpensesPostagePeriod'),
            businessExpensesTransport: this.convertToMonthly('businessExpensesTransport', 'businessExpensesTransportPeriod'),
            businessExpensesProfessional: this.convertToMonthly('businessExpensesProfessional', 'businessExpensesProfessionalPeriod'),
            businessTax: this.convertToMonthly('businessTax', 'businessTaxPeriod'),
            businessNIC: this.convertToMonthly('businessNIC', 'businessNICPeriod'),
            businessPension: this.convertToMonthly('businessPension', 'businessPensionPeriod'),
            businessCarMiles: this.elements.businessCarMiles.value,
            businessCarDeduction: this.elements.businessCarDeduction.value,
            businessHomeHours: this.elements.businessHomeHours.value,
            businessHomeDeduction: this.elements.businessHomeDeduction.value,
            
            savings: this.elements.savings.value,
            otherBenefits: this.convertToMonthly('otherBenefits', 'otherBenefitsPeriod')
        };
    }
    
    /**
     * Display calculation results
     * @param {Object} result - Calculation result
     */
    displayResults(result) {
        const calculation = result.calculation;
        
        // Update breakdown values
        this.elements.standardAllowance.textContent = Formatters.formatCurrency(calculation.standardAllowance);
        this.elements.housingElement.textContent = Formatters.formatCurrency(calculation.housingElement);
        this.elements.childElement.textContent = Formatters.formatCurrency(calculation.childElement);
        this.elements.childcareElement.textContent = Formatters.formatCurrency(calculation.childcareElement);
        
        // Add carer element if available
        if (calculation.carerElement && calculation.carerElement > 0) {
            this.addCarerElementToBreakdown(calculation.carerElement);
        }
        
        this.elements.totalElements.textContent = Formatters.formatCurrency(calculation.totalElements);
        this.elements.earningsReduction.textContent = Formatters.formatCurrency(calculation.earningsReduction);
        this.elements.otherDeductions.textContent = Formatters.formatCurrency(calculation.capitalDeduction + calculation.benefitDeduction);
        this.elements.finalAmount.textContent = Formatters.formatCurrency(calculation.finalAmount);
        
        // Show housing breakdown if available
        if (calculation.housingBreakdown) {
            this.displayHousingBreakdown(calculation.housingBreakdown);
        }
        
        // Show results section and detailed results
        this.elements.resultsSection.style.display = 'block';
        this.elements.detailedResults.style.display = 'block';
        
        // Update results container
        this.elements.resultsContainer.innerHTML = `
            <div class="result-summary">
                <h3>Your Universal Credit Entitlement</h3>
                <div class="final-amount">${Formatters.formatCurrency(calculation.finalAmount)}</div>
                <p class="result-note">per month</p>
                <p class="tax-year">Tax Year: ${Formatters.formatTaxYear(result.taxYear)}</p>
            </div>
        `;
        
        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
            this.showWarnings(result.warnings);
        }
    }

    /**
     * Add carer element to breakdown display
     * @param {number} carerElement - Carer element amount
     */
    addCarerElementToBreakdown(carerElement) {
        // Find the breakdown list
        const breakdownList = document.querySelector('.breakdown-list');
        if (!breakdownList) return;

        // Check if carer element already exists
        let carerElementItem = document.getElementById('carerElement');
        if (!carerElementItem) {
            // Create new carer element item
            carerElementItem = document.createElement('div');
            carerElementItem.className = 'breakdown-item';
            carerElementItem.id = 'carerElement';
            
            // Insert after childcare element
            const childcareElement = document.getElementById('childcareElement');
            if (childcareElement && childcareElement.parentNode) {
                childcareElement.parentNode.insertBefore(carerElementItem, childcareElement.nextSibling);
            } else {
                breakdownList.appendChild(carerElementItem);
            }
        }

        // Update carer element content
        carerElementItem.innerHTML = `
            <span class="label">Carer Element</span>
            <span class="value">${Formatters.formatCurrency(carerElement)}</span>
        `;
    }

    /**
     * Display housing breakdown
     * @param {Object} housingBreakdown - Housing calculation breakdown
     */
    displayHousingBreakdown(housingBreakdown) {
        // Create housing breakdown section if it doesn't exist
        let housingBreakdownSection = document.getElementById('housingBreakdown');
        if (!housingBreakdownSection) {
            housingBreakdownSection = document.createElement('div');
            housingBreakdownSection.id = 'housingBreakdown';
            housingBreakdownSection.className = 'housing-breakdown';
            housingBreakdownSection.innerHTML = '<h4>Housing Breakdown</h4><div class="breakdown-content"></div>';
            
            // Insert after the main breakdown
            const detailedResults = document.getElementById('detailedResults');
            detailedResults.appendChild(housingBreakdownSection);
        }

        const breakdownContent = housingBreakdownSection.querySelector('.breakdown-content');
        let html = '';

        // Add housing breakdown details based on tenant type
        if (housingBreakdown.lhaRate) {
            // Private tenant breakdown
            html += `
                <div class="breakdown-item">
                    <span class="label">LHA Rate for your area</span>
                    <span class="value">${Formatters.formatCurrency(housingBreakdown.lhaRate)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">Eligible Rent</span>
                    <span class="value">${Formatters.formatCurrency(housingBreakdown.eligibleRent)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">Bedroom Entitlement</span>
                    <span class="value">${housingBreakdown.bedroomEntitlement} bedroom(s)</span>
                </div>
            `;
        } else if (housingBreakdown.bedroomTaxReduction) {
            // Social tenant breakdown
            html += `
                <div class="breakdown-item">
                    <span class="label">Bedroom Entitlement</span>
                    <span class="value">${housingBreakdown.bedroomEntitlement} bedroom(s)</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">Spare Bedrooms</span>
                    <span class="value">${housingBreakdown.spareBedrooms} bedroom(s)</span>
                </div>
                <div class="breakdown-item">
                    <span class="label">Bedroom Tax Reduction</span>
                    <span class="value deduction">-${Formatters.formatCurrency(housingBreakdown.bedroomTaxReduction)}</span>
                </div>
            `;
        }

        // Add non-dependant deductions if any
        if (housingBreakdown.nonDependants && housingBreakdown.nonDependants.totalDeduction > 0) {
            html += `
                <div class="breakdown-item">
                    <span class="label">Non-Dependant Deductions</span>
                    <span class="value deduction">-${Formatters.formatCurrency(housingBreakdown.nonDependants.totalDeduction)}</span>
                </div>
            `;
        }

        breakdownContent.innerHTML = html;
    }
    
    /**
     * Clear results display
     */
    clearResults() {
        this.elements.resultsSection.style.display = 'none';
        this.elements.resultsContainer.innerHTML = `
            <div class="placeholder">
                <p>Your calculation results will appear here</p>
            </div>
        `;
        this.elements.detailedResults.style.display = 'none';
        this.currentCalculation = null;
    }
    
    /**
     * Reset form to default values
     */
    resetForm() {
        this.elements.taxYear.value = '2024_25';
        this.elements.circumstances[0].checked = true; // Single
        this.elements.age.value = '25';
        this.elements.partnerAge.value = '25';
        this.elements.partnerAgeGroup.style.display = 'none'; // Hide partner age initially
        this.elements.children.value = '0';
        this.elements.childrenAge.value = '5to10';
        this.elements.tenantType[0].checked = true; // Private tenant
        this.elements.rent.value = '0';
        this.elements.serviceCharges.value = '0';
        this.elements.bedrooms.value = '1';
        this.elements.area.value = 'default';
        this.elements.nonDependants.value = '0';
        this.elements.monthlyEarnings.value = '0';
        this.elements.childcareCosts.value = '0';
        
        // Reset carer fields
        this.elements.isCarer.checked = false;
        this.elements.isPartnerCarer.checked = false;
        this.elements.currentlyReceivingCA.checked = false;
        this.elements.isScotland.checked = false;
        this.elements.caringHours.value = '0';
        this.elements.caredForPersonBenefits.checked = false;
        this.elements.includeCarerAllowance.checked = true;
        this.elements.includeCarerElement.checked = true;
        this.elements.carerDetails.style.display = 'none';
        
        // Reset self-employed fields
        this.elements.businessIncomeBank.value = '0';
        this.elements.businessIncomeCash.value = '0';
        this.elements.businessExpensesRent.value = '0';
        this.elements.businessExpensesRates.value = '0';
        this.elements.businessExpensesUtilities.value = '0';
        this.elements.businessExpensesInsurance.value = '0';
        this.elements.businessExpensesTelephone.value = '0';
        this.elements.businessExpensesMarketing.value = '0';
        this.elements.businessExpensesVehicle.value = '0';
        this.elements.businessExpensesEquipment.value = '0';
        this.elements.businessExpensesPostage.value = '0';
        this.elements.businessExpensesTransport.value = '0';
        this.elements.businessExpensesProfessional.value = '0';
        this.elements.businessTax.value = '0';
        this.elements.businessNIC.value = '0';
        this.elements.businessPension.value = '0';
        this.elements.businessCarMiles.value = '0';
        this.elements.businessHomeHours.value = '0';
        
        // Update self-employed calculation display
        this.updateSelfEmployedCalculation();
        
        this.elements.savings.value = '0';
        this.elements.otherBenefits.value = '0';
        
        // Reset tenant options visibility
        this.handleTenantTypeChange();
        
        // Clear non-dependants details
        this.elements.nonDependantsDetails.style.display = 'none';
        this.elements.nonDependantsDetails.innerHTML = '';
        
        // Clear exemption checkboxes
        const exemptionCheckboxes = document.querySelectorAll('input[type="checkbox"][value]');
        exemptionCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear any field errors
        this.clearAllFieldErrors();
    }
    
    /**
     * Display saved scenarios
     */
    displaySavedScenarios() {
        if (this.savedScenarios.length === 0) {
            this.elements.savedScenariosList.innerHTML = `
                <p class="no-scenarios">No saved scenarios yet. Save your first calculation to compare different scenarios.</p>
            `;
            return;
        }
        
        const scenariosHTML = this.savedScenarios.map((scenario, index) => `
            <div class="scenario-item">
                <div class="scenario-header">
                    <h4>${scenario.name}</h4>
                    <div class="scenario-actions">
                        <button class="btn btn-small" onclick="app.loadScenario(${index})">Load</button>
                        <button class="btn btn-small btn-outline" onclick="app.deleteScenario(${index})">Delete</button>
                    </div>
                </div>
                <div class="scenario-details">
                    <p><strong>Amount:</strong> ${Formatters.formatCurrency(scenario.calculation.finalAmount)}</p>
                    <p><strong>Tax Year:</strong> ${Formatters.formatTaxYear(scenario.taxYear)}</p>
                    <p><strong>Saved:</strong> ${Formatters.formatDate(scenario.savedAt)}</p>
                </div>
            </div>
        `).join('');
        
        this.elements.savedScenariosList.innerHTML = scenariosHTML;
    }
    
    /**
     * Load a saved scenario
     * @param {number} index - Scenario index
     */
    loadScenario(index) {
        const scenario = this.savedScenarios[index];
        if (!scenario) return;
        
        // Populate form with scenario data
        this.elements.taxYear.value = scenario.taxYear;
        this.elements.circumstances.forEach(radio => {
            radio.checked = radio.value === scenario.input.circumstances;
        });
        this.elements.age.value = scenario.input.age;
        this.elements.children.value = scenario.input.children;
        this.elements.childrenAge.value = scenario.input.childrenAge;
        this.elements.rent.value = scenario.input.rent;
        this.elements.serviceCharges.value = scenario.input.serviceCharges;
        this.elements.monthlyEarnings.value = scenario.input.monthlyEarnings;
        this.elements.childcareCosts.value = scenario.input.childcareCosts;
        this.elements.savings.value = scenario.input.savings;
        this.elements.otherBenefits.value = scenario.input.otherBenefits;
        
        // Recalculate
        this.handleCalculate();
        
        this.showSuccess(`Scenario "${scenario.name}" loaded`);
    }
    
    /**
     * Delete a saved scenario
     * @param {number} index - Scenario index
     */
    deleteScenario(index) {
        const scenario = this.savedScenarios[index];
        if (!scenario) return;
        
        if (confirm(`Are you sure you want to delete "${scenario.name}"?`)) {
            this.savedScenarios.splice(index, 1);
            this.saveScenariosToStorage();
            this.displaySavedScenarios();
            this.showSuccess('Scenario deleted');
        }
    }
    
    /**
     * Save scenarios to local storage
     */
    saveScenariosToStorage() {
        try {
            localStorage.setItem('uc-calculator-scenarios', JSON.stringify(this.savedScenarios));
        } catch (error) {
            console.error('Failed to save scenarios:', error);
        }
    }
    
    /**
     * Load saved scenarios from local storage
     */
    loadSavedScenarios() {
        try {
            const saved = localStorage.getItem('uc-calculator-scenarios');
            if (saved) {
                this.savedScenarios = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load saved scenarios:', error);
            this.savedScenarios = [];
        }
    }
    
    /**
     * Show loading overlay
     * @param {boolean} show - Whether to show loading
     */
    showLoading(show) {
        this.elements.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    /**
     * Show warning messages
     * @param {Array} warnings - Warning messages
     */
    showWarnings(warnings) {
        if (warnings && warnings.length > 0) {
            this.showNotification(warnings.join(', '), 'warning');
        }
    }
    
    /**
     * Show notification
     * @param {string} message - Message to show
     * @param {string} type - Notification type
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    /**
     * Validate a form field
     * @param {HTMLElement} field - Field to validate
     */
    validateField(field) {
        const value = field.value;
        const fieldName = field.id;
        
        // Clear previous error
        this.clearFieldError(field);
        
        // Basic validation
        if (fieldName === 'age' && (value < 16 || value > 120)) {
            this.showFieldError(field, 'Age must be between 16 and 120');
        } else if (fieldName === 'partnerAge' && (value < 16 || value > 120)) {
            this.showFieldError(field, 'Partner age must be between 16 and 120');
        } else if (fieldName === 'children' && (value < 0 || value > 10)) {
            this.showFieldError(field, 'Number of children must be between 0 and 10');
        } else if (['rent', 'serviceCharges', 'monthlyEarnings', 'childcareCosts', 'savings', 'otherBenefits'].includes(fieldName) && value < 0) {
            this.showFieldError(field, 'Value cannot be negative');
        }
    }
    
    /**
     * Show field error
     * @param {HTMLElement} field - Field to show error for
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    /**
     * Clear field error
     * @param {HTMLElement} field - Field to clear error for
     */
    clearFieldError(field) {
        field.classList.remove('error');
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Clear all field errors
     */
    clearAllFieldErrors() {
        const fields = document.querySelectorAll('.form-control');
        fields.forEach(field => this.clearFieldError(field));
    }
    
    /**
     * Show errors
     * @param {Array} errors - Error messages
     */
    showErrors(errors) {
        if (errors && errors.length > 0) {
            this.showError(errors.join(', '));
        }
    }
    
    /**
     * Initialize UI state
     */
    initializeUI() {
        // Set default tax year
        const availableYears = this.calculator.ratesManager.getAvailableYears();
        if (availableYears.length > 0) {
            this.elements.taxYear.value = availableYears[0];
        }
        
        // Initialize partner age field visibility
        this.handleCircumstancesChange();
        
        // Initialize tenant type field visibility
        this.handleTenantTypeChange();
        
        // Initialize employment type field visibility
        this.handleEmploymentTypeChange();
        
        // Initialize carer field visibility
        this.handleCarerChange();
        
        // Display saved scenarios
        this.displaySavedScenarios();
        
        // Clear any existing errors
        this.clearAllFieldErrors();
        
        // Initialize self-employed calculation display
        this.updateSelfEmployedCalculation();
    }
    
    /**
     * Calculate and update self-employed net profit/loss
     */
    updateSelfEmployedCalculation() {
        // Calculate total business income
        const businessIncomeBank = parseFloat(this.elements.businessIncomeBank.value) || 0;
        const businessIncomeCash = parseFloat(this.elements.businessIncomeCash.value) || 0;
        const totalBusinessIncome = businessIncomeBank + businessIncomeCash;
        
        // Calculate total business expenses
        const businessExpensesRent = parseFloat(this.elements.businessExpensesRent.value) || 0;
        const businessExpensesRates = parseFloat(this.elements.businessExpensesRates.value) || 0;
        const businessExpensesUtilities = parseFloat(this.elements.businessExpensesUtilities.value) || 0;
        const businessExpensesInsurance = parseFloat(this.elements.businessExpensesInsurance.value) || 0;
        const businessExpensesTelephone = parseFloat(this.elements.businessExpensesTelephone.value) || 0;
        const businessExpensesMarketing = parseFloat(this.elements.businessExpensesMarketing.value) || 0;
        const businessExpensesVehicle = parseFloat(this.elements.businessExpensesVehicle.value) || 0;
        const businessExpensesEquipment = parseFloat(this.elements.businessExpensesEquipment.value) || 0;
        const businessExpensesPostage = parseFloat(this.elements.businessExpensesPostage.value) || 0;
        const businessExpensesTransport = parseFloat(this.elements.businessExpensesTransport.value) || 0;
        const businessExpensesProfessional = parseFloat(this.elements.businessExpensesProfessional.value) || 0;
        const businessTax = parseFloat(this.elements.businessTax.value) || 0;
        const businessNIC = parseFloat(this.elements.businessNIC.value) || 0;
        const businessPension = parseFloat(this.elements.businessPension.value) || 0;
        
        // Calculate car and home deductions
        const businessCarMiles = parseFloat(this.elements.businessCarMiles.value) || 0;
        const businessHomeHours = parseFloat(this.elements.businessHomeHours.value) || 0;
        
        // Car deduction calculation (45p per mile for first 10,000 miles, 25p thereafter)
        const carDeductionRate = businessCarMiles <= 10000 ? 0.45 : 0.25;
        const businessCarDeduction = businessCarMiles * carDeductionRate;
        
        // Home deduction calculation (£6 per week for 25+ hours, £4 per week for less)
        const weeklyHours = businessHomeHours / 4.33; // Convert monthly hours to weekly
        const homeDeductionRate = weeklyHours >= 25 ? 6 : 4;
        const businessHomeDeduction = homeDeductionRate * 4.33; // Convert weekly to monthly
        
        // Update deduction fields
        this.elements.businessCarDeduction.value = businessCarDeduction.toFixed(2);
        this.elements.businessHomeDeduction.value = businessHomeDeduction.toFixed(2);
        
        // Calculate subtotals
        const totalBusinessExpenses = businessExpensesRent + businessExpensesRates + 
                                    businessExpensesUtilities + businessExpensesInsurance + 
                                    businessExpensesTelephone + businessExpensesMarketing + 
                                    businessExpensesVehicle + businessExpensesEquipment + 
                                    businessExpensesPostage + businessExpensesTransport + 
                                    businessExpensesProfessional;
        
        const totalTaxNICPension = businessTax + businessNIC + businessPension;
        const totalHomeAndCar = businessCarDeduction + businessHomeDeduction;
        
        const totalAllExpenses = totalBusinessExpenses + totalTaxNICPension + totalHomeAndCar;
        
        // Calculate net profit/loss
        const netBusinessProfit = totalBusinessIncome - totalAllExpenses;
        
        // Update display
        this.elements.totalBusinessIncome.textContent = Formatters.formatCurrency(totalBusinessIncome);
        this.elements.totalBusinessExpenses.textContent = Formatters.formatCurrency(totalBusinessExpenses);
        
        // Add new subtotal displays
        const taxNICPensionElement = document.getElementById('totalTaxNICPension');
        const homeAndCarElement = document.getElementById('totalHomeAndCar');
        
        if (taxNICPensionElement) {
            taxNICPensionElement.textContent = Formatters.formatCurrency(totalTaxNICPension);
        }
        if (homeAndCarElement) {
            homeAndCarElement.textContent = Formatters.formatCurrency(totalHomeAndCar);
        }
        
        this.elements.netBusinessProfit.textContent = Formatters.formatCurrency(netBusinessProfit);
        
        // Add visual styling for profit/loss
        this.elements.netBusinessProfit.className = 'value ' + (netBusinessProfit >= 0 ? 'profit' : 'loss');
    }
    
    /**
     * Setup validation
     */
    setupValidation() {
        // This is handled in setupFormValidation()
    }
}

// Create global app instance
const app = new UniversalCreditApp();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
}
