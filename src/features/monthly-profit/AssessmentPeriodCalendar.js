import React, { useState, useEffect } from 'react';
import { format, addMonths, isWithinInterval, isSameDay, startOfMonth, endOfMonth } from 'date-fns';

function AssessmentPeriodCalendar({ assessmentPeriodStart, onPeriodSelect, selectedPeriod }) {
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [periodIndex, setPeriodIndex] = useState(0);

  useEffect(() => {
    if (assessmentPeriodStart) {
      generateCurrentPeriod();
    }
  }, [assessmentPeriodStart, periodIndex]);

  const generateCurrentPeriod = () => {
    if (!assessmentPeriodStart) return;

    const startDate = new Date(assessmentPeriodStart);
    const now = new Date();
    
    // Calculate the current assessment period based on periodIndex
    let currentPeriodStart = new Date(startDate);
    let currentPeriodEnd = new Date(startDate);
    currentPeriodEnd.setDate(startDate.getDate() - 1);
    currentPeriodEnd.setMonth(startDate.getMonth() + 1);

    // Move to the selected period
    for (let i = 0; i < periodIndex; i++) {
      currentPeriodStart.setMonth(currentPeriodStart.getMonth() + 1);
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    setCurrentPeriod({
      id: periodIndex,
      start: new Date(currentPeriodStart),
      end: new Date(currentPeriodEnd),
      month: currentPeriodStart.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      isCurrent: isWithinInterval(now, { start: currentPeriodStart, end: currentPeriodEnd }),
      isPast: currentPeriodEnd < now,
      isFuture: currentPeriodStart > now
    });
  };

  const handlePreviousPeriod = () => {
    setPeriodIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextPeriod = () => {
    setPeriodIndex(prev => prev + 1);
  };

  const handlePeriodSelect = () => {
    if (currentPeriod) {
      onPeriodSelect(currentPeriod);
    }
  };

  const formatDate = (date) => {
    return format(date, 'dd/MM/yyyy');
  };

  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Start from Monday
    
             const days = [];
         const currentDate = new Date(startDate);

         while (currentDate <= lastDay || days.length < 28) { // 4 weeks * 7 days
           days.push(new Date(currentDate));
           currentDate.setDate(currentDate.getDate() + 1);
         }
    
    return days;
  };

  const getDayClassName = (date) => {
    if (!currentPeriod) return 'calendar-day';
    
    const classes = ['calendar-day'];
    
    // Check if it's outside the current month
    const currentMonth = currentPeriod.start.getMonth();
    const currentYear = currentPeriod.start.getFullYear();
    if (date.getMonth() !== currentMonth && date.getMonth() !== (currentMonth + 1) % 12) {
      classes.push('other-month');
    }
    
    // Check if it's within the assessment period
    if (isWithinInterval(date, { start: currentPeriod.start, end: currentPeriod.end })) {
      classes.push('assessment-period');
    }
    
    // Check if it's the start or end date
    if (isSameDay(date, currentPeriod.start)) {
      classes.push('period-start');
    }
    if (isSameDay(date, currentPeriod.end)) {
      classes.push('period-end');
    }
    
    // Check if it's today
    if (isSameDay(date, new Date())) {
      classes.push('today');
    }
    
    return classes.join(' ');
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  if (!currentPeriod) return null;

  const firstMonthDays = generateCalendarDays(
    currentPeriod.start.getFullYear(), 
    currentPeriod.start.getMonth()
  );
  
  const secondMonthDays = generateCalendarDays(
    currentPeriod.end.getFullYear(), 
    currentPeriod.end.getMonth()
  );

  return (
    <div className="assessment-period-calendar">
      {/* Header */}
      <div className="calendar-header">
        <h2>Universal Credit assessment period</h2>
        
        {/* Navigation */}
        <div className="calendar-navigation">
          <button 
            className="nav-btn prev-btn"
            onClick={handlePreviousPeriod}
            disabled={periodIndex === 0}
          >
            ← Previous period
          </button>
          <button 
            className="nav-btn next-btn"
            onClick={handleNextPeriod}
          >
            Next period →
          </button>
        </div>
        
        {/* Current Period Display */}
        <div className="current-period">
          {formatDate(currentPeriod.start)} - {formatDate(currentPeriod.end)}
        </div>
        
        {/* Progress Indicator */}
        <div className="progress-indicator">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className={`progress-segment ${i === periodIndex ? 'current' : i < periodIndex ? 'completed' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Two Month Calendar View */}
      <div className="two-month-calendar">
        {/* First Month */}
        <div className="month-calendar">
          <h3>{getMonthName(currentPeriod.start)}</h3>
          <div className="calendar-grid">
            <div className="day-header">MON</div>
            <div className="day-header">TUE</div>
            <div className="day-header">WED</div>
            <div className="day-header">THU</div>
            <div className="day-header">FRI</div>
            <div className="day-header">SAT</div>
            <div className="day-header">SUN</div>
            
            {firstMonthDays.map((date, index) => (
              <div 
                key={index}
                className={getDayClassName(date)}
                onClick={() => handlePeriodSelect()}
              >
                {date.getDate()}
              </div>
            ))}
          </div>
        </div>

        {/* Second Month */}
        <div className="month-calendar">
          <h3>{getMonthName(currentPeriod.end)}</h3>
          <div className="calendar-grid">
            <div className="day-header">MON</div>
            <div className="day-header">TUE</div>
            <div className="day-header">WED</div>
            <div className="day-header">THU</div>
            <div className="day-header">FRI</div>
            <div className="day-header">SAT</div>
            <div className="day-header">SUN</div>
            
            {secondMonthDays.map((date, index) => (
              <div 
                key={index}
                className={getDayClassName(date)}
                onClick={() => handlePeriodSelect()}
              >
                {date.getDate()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentPeriodCalendar;
