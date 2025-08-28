import React, { useState, useEffect } from 'react';
import { useTextManager } from '../../hooks/useTextManager';
import AssessmentPeriodCalendar from './AssessmentPeriodCalendar';
import MonthlyReportingForm from './MonthlyReportingForm';

function MonthlyProfitTool() {
  const { getTextValue } = useTextManager();
  const [assessmentPeriodStart, setAssessmentPeriodStart] = useState('');
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Set default assessment period start to today's date
  useEffect(() => {
    if (!assessmentPeriodStart) {
      setAssessmentPeriodStart(currentDate);
    }
  }, [assessmentPeriodStart, currentDate]);

  const handleAssessmentPeriodChange = (date) => {
    setAssessmentPeriodStart(date);
    setSelectedPeriod(null);
    setShowForm(false);
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowForm(true);
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

          {showForm && selectedPeriod && (
            <div className="reporting-form-section">
              <MonthlyReportingForm 
                period={selectedPeriod}
                onClose={() => setShowForm(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyProfitTool;
