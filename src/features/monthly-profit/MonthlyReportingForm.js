import React, { useState, useEffect } from 'react';

function MonthlyReportingForm({ period, onClose, exampleData }) {
  const [formData, setFormData] = useState({
    income: {
      bankReceipts: 0,
      cashReceipts: 0,
      onlineSales: 0,
      commission: 0,
      otherIncome: 0
    },
    expenses: {
      materials: 0,
      travel: 0,
      office: 0,
      marketing: 0,
      insurance: 0,
      utilities: 0,
      rent: 0,
      phone: 0,
      internet: 0,
      vehicle: 0,
      meals: 0,
      training: 0,
      professionalFees: 0,
      bankCharges: 0,
      other: 0
    },
    taxAndPensions: {
      incomeTax: 0,
      nationalInsurance: 0,
      pensionContributions: 0
    },
    homeAndCar: {
      businessMiles: 0,
      homeWorkingHours: 0
    },
    adjustments: {
      lossCarriedOver: 0,
      surplusEarningsCarriedOver: 0
    }
  });

  // Step-by-step navigation state for examples
  const [currentExampleMonth, setCurrentExampleMonth] = useState(0);
  const [showStepByStep, setShowStepByStep] = useState(false);

  // Populate form with example data when available
  useEffect(() => {
    if (exampleData && period) {
      // Find the matching month in example data
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const periodMonth = monthNames[period.start.getMonth()];
      
      const exampleMonth = exampleData.months.find(m => m.month === periodMonth);
      
      if (exampleMonth) {
        // Distribute income across different income types based on the example type
        let incomeDistribution = {
          bankReceipts: 0,
          cashReceipts: 0,
          onlineSales: 0,
          commission: 0,
          otherIncome: 0
        };

        // Distribute expenses across different expense types
        let expenseDistribution = {
          materials: 0,
          travel: 0,
          office: 0,
          marketing: 0,
          insurance: 0,
          utilities: 0,
          rent: 0,
          phone: 0,
          internet: 0,
          vehicle: 0,
          meals: 0,
          training: 0,
          professionalFees: 0,
          bankCharges: 0,
          other: 0
        };

        // Distribute income based on example type
        if (exampleData.title.includes('Actor')) {
          incomeDistribution.bankReceipts = exampleMonth.income * 0.8; // Most acting work is bank transfers
          incomeDistribution.cashReceipts = exampleMonth.income * 0.2; // Some cash payments
        } else if (exampleData.title.includes('Market Trader')) {
          incomeDistribution.cashReceipts = exampleMonth.income * 0.7; // Most market trading is cash
          incomeDistribution.bankReceipts = exampleMonth.income * 0.3; // Some bank transfers
        } else if (exampleData.title.includes('Taxi Driver')) {
          incomeDistribution.cashReceipts = exampleMonth.income * 0.6; // Mix of cash and card
          incomeDistribution.bankReceipts = exampleMonth.income * 0.4; // Card payments
        }

        // Distribute expenses based on example type
        if (exampleData.title.includes('Actor')) {
          expenseDistribution.travel = exampleMonth.expenses * 0.4; // Travel to auditions/jobs
          expenseDistribution.marketing = exampleMonth.expenses * 0.2; // Headshots, agents
          expenseDistribution.training = exampleMonth.expenses * 0.2; // Acting classes
          expenseDistribution.other = exampleMonth.expenses * 0.2; // Other expenses
        } else if (exampleData.title.includes('Market Trader')) {
          expenseDistribution.materials = exampleMonth.expenses * 0.5; // Stock and materials
          expenseDistribution.travel = exampleMonth.expenses * 0.2; // Travel to markets
          expenseDistribution.vehicle = exampleMonth.expenses * 0.2; // Vehicle costs
          expenseDistribution.other = exampleMonth.expenses * 0.1; // Other expenses
        } else if (exampleData.title.includes('Taxi Driver')) {
          expenseDistribution.vehicle = exampleMonth.expenses * 0.6; // Fuel, maintenance, insurance
          expenseDistribution.travel = exampleMonth.expenses * 0.2; // Travel costs
          expenseDistribution.phone = exampleMonth.expenses * 0.1; // Phone costs
          expenseDistribution.other = exampleMonth.expenses * 0.1; // Other expenses
        }

        setFormData({
          income: incomeDistribution,
          expenses: expenseDistribution,
          taxAndPensions: {
            incomeTax: Math.round(exampleMonth.income * 0.15), // Rough estimate
            nationalInsurance: Math.round(exampleMonth.income * 0.09), // Rough estimate
            pensionContributions: Math.round(exampleMonth.income * 0.03) // Rough estimate
          },
          homeAndCar: {
            businessMiles: exampleData.title.includes('Taxi Driver') ? 2000 : 
                          exampleData.title.includes('Market Trader') ? 500 : 100,
            homeWorkingHours: exampleData.title.includes('Actor') ? 40 : 0
          },
          adjustments: {
            lossCarriedOver: 0,
            surplusEarningsCarriedOver: 0
          }
        });

        // Show step-by-step navigation for examples
        setShowStepByStep(true);
        // Find the current month index
        const monthIndex = exampleData.months.findIndex(m => m.month === periodMonth);
        setCurrentExampleMonth(monthIndex >= 0 ? monthIndex : 0);
      }
    }
  }, [exampleData, period]);

  // Navigation functions for step-by-step flow
  const handlePreviousMonth = () => {
    if (currentExampleMonth > 0) {
      setCurrentExampleMonth(currentExampleMonth - 1);
      // Update the form with the previous month's data
      const prevMonth = exampleData.months[currentExampleMonth - 1];
      populateFormWithMonthData(prevMonth);
    }
  };

  const handleNextMonth = () => {
    if (currentExampleMonth < exampleData.months.length - 1) {
      setCurrentExampleMonth(currentExampleMonth + 1);
      // Update the form with the next month's data
      const nextMonth = exampleData.months[currentExampleMonth + 1];
      populateFormWithMonthData(nextMonth);
    }
  };



  const populateFormWithMonthData = (monthData) => {
    // Distribute income across different income types based on the example type
    let incomeDistribution = {
      bankReceipts: 0,
      cashReceipts: 0,
      onlineSales: 0,
      commission: 0,
      otherIncome: 0
    };

    // Distribute expenses across different expense types
    let expenseDistribution = {
      materials: 0,
      travel: 0,
      office: 0,
      marketing: 0,
      insurance: 0,
      utilities: 0,
      rent: 0,
      phone: 0,
      internet: 0,
      vehicle: 0,
      meals: 0,
      training: 0,
      professionalFees: 0,
      bankCharges: 0,
      other: 0
    };

    // Distribute income based on example type
    if (exampleData.title.includes('Actor')) {
      incomeDistribution.bankReceipts = monthData.income * 0.8;
      incomeDistribution.cashReceipts = monthData.income * 0.2;
    } else if (exampleData.title.includes('Market Trader')) {
      incomeDistribution.cashReceipts = monthData.income * 0.7;
      incomeDistribution.bankReceipts = monthData.income * 0.3;
    } else if (exampleData.title.includes('Taxi Driver')) {
      incomeDistribution.cashReceipts = monthData.income * 0.6;
      incomeDistribution.bankReceipts = monthData.income * 0.4;
    }

    // Distribute expenses based on example type
    if (exampleData.title.includes('Actor')) {
      expenseDistribution.travel = monthData.expenses * 0.4;
      expenseDistribution.marketing = monthData.expenses * 0.2;
      expenseDistribution.training = monthData.expenses * 0.2;
      expenseDistribution.other = monthData.expenses * 0.2;
    } else if (exampleData.title.includes('Market Trader')) {
      expenseDistribution.materials = monthData.expenses * 0.5;
      expenseDistribution.travel = monthData.expenses * 0.2;
      expenseDistribution.vehicle = monthData.expenses * 0.2;
      expenseDistribution.other = monthData.expenses * 0.1;
    } else if (exampleData.title.includes('Taxi Driver')) {
      expenseDistribution.vehicle = monthData.expenses * 0.6;
      expenseDistribution.travel = monthData.expenses * 0.2;
      expenseDistribution.phone = monthData.expenses * 0.1;
      expenseDistribution.other = monthData.expenses * 0.1;
    }

    setFormData({
      income: incomeDistribution,
      expenses: expenseDistribution,
      taxAndPensions: {
        incomeTax: Math.round(monthData.income * 0.15),
        nationalInsurance: Math.round(monthData.income * 0.09),
        pensionContributions: Math.round(monthData.income * 0.03)
      },
      homeAndCar: {
        businessMiles: exampleData.title.includes('Taxi Driver') ? 2000 : 
                      exampleData.title.includes('Market Trader') ? 500 : 100,
        homeWorkingHours: exampleData.title.includes('Actor') ? 40 : 0
      },
      adjustments: {
        lossCarriedOver: 0,
        surplusEarningsCarriedOver: 0
      }
    });
  };

  const handleInputChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const calculateTotalIncome = () => {
    return Object.values(formData.income).reduce((sum, value) => sum + value, 0);
  };

  const calculateTotalExpenses = () => {
    return Object.values(formData.expenses).reduce((sum, value) => sum + value, 0);
  };

  const calculateTotalTaxAndPensions = () => {
    return Object.values(formData.taxAndPensions).reduce((sum, value) => sum + value, 0);
  };

  const calculateHomeAndCarDeduction = () => {
    const milesDeduction = formData.homeAndCar.businessMiles <= 833 
      ? formData.homeAndCar.businessMiles * 0.45 
      : (833 * 0.45) + ((formData.homeAndCar.businessMiles - 833) * 0.25);
    
    const homeWorkingDeduction = formData.homeAndCar.homeWorkingHours >= 25 
      ? formData.homeAndCar.homeWorkingHours * 0.26 
      : 0;
    
    return milesDeduction + homeWorkingDeduction;
  };

  const calculateNetProfit = () => {
    const totalIncome = calculateTotalIncome();
    const totalExpenses = calculateTotalExpenses();
    const totalTaxAndPensions = calculateTotalTaxAndPensions();
    const homeAndCarDeduction = calculateHomeAndCarDeduction();
    const adjustments = formData.adjustments.lossCarriedOver - formData.adjustments.surplusEarningsCarriedOver;
    
    return totalIncome - totalExpenses - totalTaxAndPensions + homeAndCarDeduction + adjustments;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the data to your backend
    console.log('Monthly report submitted:', {
      period: period,
      data: formData,
      summary: {
        totalIncome: calculateTotalIncome(),
        totalExpenses: calculateTotalExpenses(),
        netProfit: calculateNetProfit()
      }
    });
    alert('Monthly report saved successfully!');
  };

  return (
    <div className="monthly-reporting-form">
      <div className="form-header">
        <h2>Monthly Reporting Form</h2>
        <p>Assessment Period: {period.month}</p>
        <p>Period: {period.start.toLocaleDateString('en-GB')} - {period.end.toLocaleDateString('en-GB')}</p>
        
                 {/* Step-by-step navigation for examples */}
         {showStepByStep && exampleData && (
           <div className="step-by-step-navigation">
             <div className="step-info">
               <h3>Step {currentExampleMonth + 1} of {exampleData.months.length}</h3>
               <p className="step-description">
                 {exampleData.months[currentExampleMonth].notes}
               </p>
               <div className="step-period">
                 <strong>Assessment Period:</strong> {exampleData.months[currentExampleMonth].periodStart} - {exampleData.months[currentExampleMonth].periodEnd}
               </div>
               
             </div>
            
            <div className="step-navigation">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handlePreviousMonth}
                disabled={currentExampleMonth === 0}
              >
                ← Previous Month
              </button>
              
              <span className="step-counter">
                {currentExampleMonth + 1} / {exampleData.months.length}
              </span>
              
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleNextMonth}
                disabled={currentExampleMonth === exampleData.months.length - 1}
              >
                Next Month →
              </button>
            </div>
          </div>
        )}
        
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Money In - Business Income Section */}
        <div className="form-section income-section">
          <div className="section-header">
            <div className="section-indicator"></div>
            <h3>Money in - Business income</h3>
          </div>
          
          <div className="action-buttons">
            <button type="button" className="action-btn import-btn">
              Import data
            </button>
            <button type="button" className="action-btn add-receipt-btn">
              Add receipt
            </button>
          </div>

          <div className="income-inputs">
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="bankReceipts"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.income.bankReceipts || ''}
                  onChange={(e) => handleInputChange('income', 'bankReceipts', e.target.value)}
                />
              </div>
              <label htmlFor="bankReceipts" className="input-label">Bank receipts</label>
            </div>
            
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="cashReceipts"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.income.cashReceipts || ''}
                  onChange={(e) => handleInputChange('income', 'cashReceipts', e.target.value)}
                />
              </div>
              <label htmlFor="cashReceipts" className="input-label">Cash receipts</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="onlineSales"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.income.onlineSales || ''}
                  onChange={(e) => handleInputChange('income', 'onlineSales', e.target.value)}
                />
              </div>
              <label htmlFor="onlineSales" className="input-label">Online sales</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="commission"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.income.commission || ''}
                  onChange={(e) => handleInputChange('income', 'commission', e.target.value)}
                />
              </div>
              <label htmlFor="commission" className="input-label">Commission</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="otherIncome"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.income.otherIncome || ''}
                  onChange={(e) => handleInputChange('income', 'otherIncome', e.target.value)}
                />
              </div>
              <label htmlFor="otherIncome" className="input-label">Other income</label>
            </div>
          </div>
        </div>

        {/* Money Out - Business Expenses Section */}
        <div className="form-section expenses-section">
          <div className="section-header">
            <div className="section-indicator"></div>
            <h3>Money out - Business expenses</h3>
          </div>
          
          <div className="action-buttons">
            <button type="button" className="action-btn import-btn">
              Import data
            </button>
            <button type="button" className="action-btn add-receipt-btn">
              Add receipt
            </button>
          </div>

          <div className="expenses-inputs">
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="materials"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.materials || ''}
                  onChange={(e) => handleInputChange('expenses', 'materials', e.target.value)}
                />
              </div>
              <label htmlFor="materials" className="input-label">Materials & Supplies</label>
            </div>
            
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="travel"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.travel || ''}
                  onChange={(e) => handleInputChange('expenses', 'travel', e.target.value)}
                />
              </div>
              <label htmlFor="travel" className="input-label">Travel & Mileage</label>
            </div>
            
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="office"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.office || ''}
                  onChange={(e) => handleInputChange('expenses', 'office', e.target.value)}
                />
              </div>
              <label htmlFor="office" className="input-label">Office & Equipment</label>
            </div>
            
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="marketing"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.marketing || ''}
                  onChange={(e) => handleInputChange('expenses', 'marketing', e.target.value)}
                />
              </div>
              <label htmlFor="marketing" className="input-label">Marketing & Advertising</label>
            </div>
            
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="insurance"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.insurance || ''}
                  onChange={(e) => handleInputChange('expenses', 'insurance', e.target.value)}
                />
              </div>
              <label htmlFor="insurance" className="input-label">Insurance</label>
            </div>
            
            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="utilities"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.utilities || ''}
                  onChange={(e) => handleInputChange('expenses', 'utilities', e.target.value)}
                />
              </div>
              <label htmlFor="utilities" className="input-label">Utilities</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="rent"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.rent || ''}
                  onChange={(e) => handleInputChange('expenses', 'rent', e.target.value)}
                />
              </div>
              <label htmlFor="rent" className="input-label">Rent</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="phone"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.phone || ''}
                  onChange={(e) => handleInputChange('expenses', 'phone', e.target.value)}
                />
              </div>
              <label htmlFor="phone" className="input-label">Phone</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="internet"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.internet || ''}
                  onChange={(e) => handleInputChange('expenses', 'internet', e.target.value)}
                />
              </div>
              <label htmlFor="internet" className="input-label">Internet</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="vehicle"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.vehicle || ''}
                  onChange={(e) => handleInputChange('expenses', 'vehicle', e.target.value)}
                />
              </div>
              <label htmlFor="vehicle" className="input-label">Vehicle costs</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="meals"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.meals || ''}
                  onChange={(e) => handleInputChange('expenses', 'meals', e.target.value)}
                />
              </div>
              <label htmlFor="meals" className="input-label">Meals & subsistence</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="training"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.training || ''}
                  onChange={(e) => handleInputChange('expenses', 'training', e.target.value)}
                />
              </div>
              <label htmlFor="training" className="input-label">Training & courses</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="professionalFees"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.professionalFees || ''}
                  onChange={(e) => handleInputChange('expenses', 'professionalFees', e.target.value)}
                />
              </div>
              <label htmlFor="professionalFees" className="input-label">Professional fees</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="bankCharges"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.bankCharges || ''}
                  onChange={(e) => handleInputChange('expenses', 'bankCharges', e.target.value)}
                />
              </div>
              <label htmlFor="bankCharges" className="input-label">Bank charges</label>
            </div>

            <div className="form-group">
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input
                  type="number"
                  id="other"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={formData.expenses.other || ''}
                  onChange={(e) => handleInputChange('expenses', 'other', e.target.value)}
                />
              </div>
              <label htmlFor="other" className="input-label">Other expenses</label>
            </div>
          </div>
                 </div>

         {/* Money Out - Tax, NICs and Pensions Section */}
         <div className="form-section tax-section">
           <div className="section-header">
             <div className="section-indicator"></div>
             <h3>Money out – tax, NICs and pensions</h3>
           </div>
           
           <div className="tax-inputs">
             <div className="form-group">
               <div className="input-with-prefix">
                 <span className="prefix">£</span>
                 <input
                   type="number"
                   id="incomeTax"
                   className="form-control"
                   min="0"
                   step="0.01"
                   value={formData.taxAndPensions.incomeTax || ''}
                   onChange={(e) => handleInputChange('taxAndPensions', 'incomeTax', e.target.value)}
                 />
               </div>
               <label htmlFor="incomeTax" className="input-label">Income tax</label>
             </div>
             
             <div className="form-group">
               <div className="input-with-prefix">
                 <span className="prefix">£</span>
                 <input
                   type="number"
                   id="nationalInsurance"
                   className="form-control"
                   min="0"
                   step="0.01"
                   value={formData.taxAndPensions.nationalInsurance || ''}
                   onChange={(e) => handleInputChange('taxAndPensions', 'nationalInsurance', e.target.value)}
                 />
               </div>
               <label htmlFor="nationalInsurance" className="input-label">National Insurance Contributions</label>
             </div>
             
             <div className="form-group">
               <div className="input-with-prefix">
                 <span className="prefix">£</span>
                 <input
                   type="number"
                   id="pensionContributions"
                   className="form-control"
                   min="0"
                   step="0.01"
                   value={formData.taxAndPensions.pensionContributions || ''}
                   onChange={(e) => handleInputChange('taxAndPensions', 'pensionContributions', e.target.value)}
                 />
               </div>
               <label htmlFor="pensionContributions" className="input-label">Pension Contributions</label>
             </div>
           </div>
         </div>

         {/* Home and Car Section */}
         <div className="form-section home-car-section">
           <div className="section-header">
             <div className="section-indicator"></div>
             <h3>Home and car</h3>
           </div>
           
           <div className="home-car-inputs">
             <div className="form-group">
               <div className="input-with-suffix">
                 <input
                   type="number"
                   id="businessMiles"
                   className="form-control"
                   min="0"
                   step="1"
                   value={formData.homeAndCar.businessMiles || ''}
                   onChange={(e) => handleInputChange('homeAndCar', 'businessMiles', e.target.value)}
                 />
                 <span className="suffix">miles</span>
               </div>
               <label htmlFor="businessMiles" className="input-label">Number of miles this assessment period</label>
             </div>
             
             <div className="form-group">
               <div className="input-with-suffix">
                 <input
                   type="number"
                   id="homeWorkingHours"
                   className="form-control"
                   min="0"
                   step="1"
                   value={formData.homeAndCar.homeWorkingHours || ''}
                   onChange={(e) => handleInputChange('homeAndCar', 'homeWorkingHours', e.target.value)}
                 />
                 <span className="suffix">hours</span>
               </div>
               <label htmlFor="homeWorkingHours" className="input-label">Number of hours spent working at home this assessment period</label>
             </div>
           </div>
         </div>

         {/* Adjustments from Last Period Section */}
         <div className="form-section adjustments-section">
           <div className="section-header">
             <div className="section-indicator"></div>
             <h3>Adjustments from last period</h3>
           </div>
           
           <div className="adjustments-inputs">
             <div className="form-group">
               <div className="input-with-prefix">
                 <span className="prefix">£</span>
                 <input
                   type="number"
                   id="lossCarriedOver"
                   className="form-control"
                   min="0"
                   step="0.01"
                   value={formData.adjustments.lossCarriedOver || ''}
                   onChange={(e) => handleInputChange('adjustments', 'lossCarriedOver', e.target.value)}
                 />
               </div>
               <label htmlFor="lossCarriedOver" className="input-label">Loss carried over from last assessment period</label>
             </div>
             
             <div className="form-group">
               <div className="input-with-prefix">
                 <span className="prefix">£</span>
                 <input
                   type="number"
                   id="surplusEarningsCarriedOver"
                   className="form-control"
                   min="0"
                   step="0.01"
                   value={formData.adjustments.surplusEarningsCarriedOver || ''}
                   onChange={(e) => handleInputChange('adjustments', 'surplusEarningsCarriedOver', e.target.value)}
                 />
               </div>
               <label htmlFor="surplusEarningsCarriedOver" className="input-label">Surplus earnings carried over from last assessment period</label>
             </div>
           </div>
         </div>

         {/* Summary Section */}
                 <div className="summary-section">
           <h3>Summary</h3>
           <div className="summary-grid">
             <div className="summary-item">
               <span className="label">Money in - Business income:</span>
               <span className="value income">{formatCurrency(calculateTotalIncome())}</span>
             </div>
             <div className="summary-item">
               <span className="label">Money out – Business expenses:</span>
               <span className="value expense">{formatCurrency(calculateTotalExpenses())}</span>
             </div>
             <div className="summary-item">
               <span className="label">Money out – tax, NICs and pensions:</span>
               <span className="value expense">{formatCurrency(calculateTotalTaxAndPensions())}</span>
             </div>
             <div className="summary-item">
               <span className="label">Home and car deduction:</span>
               <span className="value income">{formatCurrency(calculateHomeAndCarDeduction())}</span>
             </div>
             <div className="summary-item total">
               <span className="label">Net loss this assessment period:</span>
               <span className={`value ${calculateNetProfit() >= 0 ? 'profit' : 'loss'}`}>
                 {formatCurrency(calculateNetProfit())}
               </span>
             </div>
           </div>
         </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Monthly Report
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MonthlyReportingForm;
