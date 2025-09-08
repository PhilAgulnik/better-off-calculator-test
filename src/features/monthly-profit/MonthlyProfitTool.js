import React, { useState, useEffect } from 'react';
import { useTextManager } from '../../hooks/useTextManager';
import AssessmentPeriodCalendar from './AssessmentPeriodCalendar';
import MonthlyReportingForm from './MonthlyReportingForm';
import Navigation from '../../components/Navigation';

function MonthlyProfitTool() {
  // eslint-disable-next-line no-unused-vars
  const { getTextValue } = useTextManager();
  const [assessmentPeriodStart, setAssessmentPeriodStart] = useState('');
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [selectedExample, setSelectedExample] = useState(null);

  // Example data for different types of self-employed workers
  const exampleCases = {
    actor: {
      title: "Actor with Intermittent Work",
      description: "Shows how income varies dramatically between months with work and months without",
      assessmentPeriodStart: "2024-01-15", // Actor's UC claim started on 15th of month
      months: [
        {
          month: "January",
          income: 0,
          expenses: 150,
          notes: "No acting work this month, only basic expenses",
          periodStart: "2024-01-15",
          periodEnd: "2024-02-14"
        },
        {
          month: "February", 
          income: 2500,
          expenses: 800,
          notes: "Small theatre role for 2 weeks",
          periodStart: "2024-02-15",
          periodEnd: "2024-03-14"
        },
        {
          month: "March",
          income: 0,
          expenses: 150,
          notes: "Between jobs, minimal expenses",
          periodStart: "2024-03-15",
          periodEnd: "2024-04-14"
        },
        {
          month: "April",
          income: 4500,
          expenses: 1200,
          notes: "TV commercial and voiceover work",
          periodStart: "2024-04-15",
          periodEnd: "2024-05-14"
        }
      ]
    },
    marketTrader: {
      title: "Market Trader",
      description: "Shows seasonal variation with increased earnings before Christmas",
      assessmentPeriodStart: "2024-10-03", // Market trader's UC claim started on 3rd of month
      months: [
        {
          month: "October",
          income: 1800,
          expenses: 600,
          notes: "Regular market trading, steady income",
          periodStart: "2024-10-03",
          periodEnd: "2024-11-02"
        },
        {
          month: "November",
          income: 2200,
          expenses: 700,
          notes: "Starting to see Christmas demand increase",
          periodStart: "2024-11-03",
          periodEnd: "2024-12-02"
        },
        {
          month: "December",
          income: 3800,
          expenses: 900,
          notes: "Peak Christmas trading period",
          periodStart: "2024-12-03",
          periodEnd: "2025-01-02"
        },
        {
          month: "January",
          income: 1200,
          expenses: 500,
          notes: "Post-Christmas slump, reduced trading",
          periodStart: "2025-01-03",
          periodEnd: "2025-02-02"
        }
      ]
    },
    taxiDriver: {
      title: "Taxi Driver",
      description: "Shows consistent but variable income with regular expenses",
      assessmentPeriodStart: "2024-01-22", // Taxi driver's UC claim started on 22nd of month
      months: [
        {
          month: "January",
          income: 2800,
          expenses: 1200,
          notes: "Regular fares, fuel and maintenance costs",
          periodStart: "2024-01-22",
          periodEnd: "2024-02-21"
        },
        {
          month: "February",
          income: 2600,
          expenses: 1100,
          notes: "Slightly quieter month, reduced fuel costs",
          periodStart: "2024-02-22",
          periodEnd: "2024-03-21"
        },
        {
          month: "March",
          income: 3000,
          expenses: 1250,
          notes: "Busy month with events and good weather",
          periodStart: "2024-03-22",
          periodEnd: "2024-04-21"
        },
        {
          month: "April",
          income: 2750,
          expenses: 1200,
          notes: "Steady month, regular maintenance due",
          periodStart: "2024-04-22",
          periodEnd: "2024-05-21"
        }
      ]
    }
  };

  // Set default assessment period start to today's date and show form
  useEffect(() => {
    if (!assessmentPeriodStart) {
      setAssessmentPeriodStart(currentDate);
    }
    // Show form by default when assessment period is set
    if (assessmentPeriodStart && !showForm) {
      setShowForm(true);
    }
  }, [assessmentPeriodStart, currentDate, showForm]);

  const handleAssessmentPeriodChange = (date) => {
    setAssessmentPeriodStart(date);
    setSelectedPeriod(null);
    // Keep form visible when assessment period changes
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    // Don't automatically show form - it will be shown by default
  };

  const handleExampleSelect = (exampleKey) => {
    setSelectedExample(exampleKey);
    setShowExampleModal(false);
    // Use the specific assessment period start date for this example
    setAssessmentPeriodStart(exampleCases[exampleKey].assessmentPeriodStart);
  };

  const handleCloseExample = () => {
    setSelectedExample(null);
    setSelectedPeriod(null);
    // Keep form visible when closing example
  };

  return (
    <div className="monthly-profit-tool">
      <div className="container">
        <div className="card">
          <h1>Manage Monthly Profit</h1>
          
          <div className="info-section">
            <p>
              Universal Credit is worked out according to your income and outgoings every 'assessment period'. 
              The start date for the assessment period is the day of the month you first made a claim for UC. 
              You can also find it on your UC journal.
            </p>
          </div>

          {/* Example Button */}
          <div className="example-section">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setShowExampleModal(true)}
            >
              See an example
            </button>
            <p className="help-text">
              See how different types of self-employed workers' income and expenses change from month to month
            </p>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="assessmentPeriodStart">What does your assessment period start?</label>
              <input
                type="date"
                id="assessmentPeriodStart"
                className="form-control"
                value={assessmentPeriodStart}
                onChange={(e) => handleAssessmentPeriodChange(e.target.value)}
              />
            </div>
          </div>

          {assessmentPeriodStart && (
            <div className="calendar-section">
              <h2>Your Assessment Periods</h2>
              <AssessmentPeriodCalendar 
                assessmentPeriodStart={assessmentPeriodStart}
                onPeriodSelect={handlePeriodSelect}
                selectedPeriod={selectedPeriod}
              />
            </div>
          )}

                     {showForm && (
             <div className="reporting-form-section">
               <MonthlyReportingForm 
                 period={selectedPeriod || { 
                   start: new Date(assessmentPeriodStart), 
                   end: new Date(new Date(assessmentPeriodStart).setMonth(new Date(assessmentPeriodStart).getMonth() + 1) - 1),
                   month: new Date(assessmentPeriodStart).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                 }}
                 onClose={() => setShowForm(false)}
                 exampleData={selectedExample ? exampleCases[selectedExample] : null}
               />
             </div>
           )}

          {/* Example Modal */}
          {showExampleModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Choose an Example</h2>
                  <button 
                    type="button" 
                    className="modal-close"
                    onClick={() => setShowExampleModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p>Select an example to see how different types of self-employed workers' data changes from month to month:</p>
                  
                                     <div className="example-options">
                     {Object.entries(exampleCases).map(([key, example]) => (
                       <div key={key} className="example-option">
                         <h3>{example.title}</h3>
                         <p>{example.description}</p>
                         <div className="example-preview">
                           <h4>UC Assessment Period:</h4>
                           <p className="assessment-period-info">
                             <strong>Start Date:</strong> {new Date(example.assessmentPeriodStart).toLocaleDateString('en-GB')}
                           </p>
                           <h4>Monthly Overview:</h4>
                           <div className="monthly-preview">
                             {example.months.map((month, index) => (
                               <div key={index} className="month-preview">
                                 <strong>{month.month}:</strong> £{month.income} income, £{month.expenses} expenses
                                 <div className="month-note">{month.notes}</div>
                                 <div className="period-dates">
                                   <small>Period: {month.periodStart} - {month.periodEnd}</small>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                         <button 
                           type="button" 
                           className="btn btn-primary"
                           onClick={() => handleExampleSelect(key)}
                         >
                           Use this example
                         </button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Example Banner */}
          {selectedExample && (
            <div className="example-banner">
              <div className="example-banner-content">
                <h3>Example: {exampleCases[selectedExample].title}</h3>
                <p>You're viewing example data. This shows how {exampleCases[selectedExample].title.toLowerCase()} income and expenses change from month to month.</p>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={handleCloseExample}
                >
                  Use my own data instead
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Navigation showRelatedTools={false} />
    </div>
  );
}

export default MonthlyProfitTool;
