import React from 'react';

const AmountInputWithPeriod = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  min = 0,
  step = 0.01,
  periodValue,
  onPeriodChange,
  className = "form-control"
}) => {
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onChange('');
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onChange(numValue);
      }
    }
  };

  const handleAmountBlur = (e) => {
    const value = e.target.value;
    if (value === '') {
      onChange(0);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-period">
        <div className="input-with-prefix">
          <span className="prefix">£</span>
          <input 
            type="number" 
            id={id} 
            className={className} 
            min={min} 
            step={step} 
            value={value || ''}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
          />
        </div>
        <select 
          className="period-selector"
          value={periodValue || 'per_month'}
          onChange={onPeriodChange}
        >
          <option value="per_week">per week</option>
          <option value="per_month">per month</option>
          <option value="per_year">per year</option>
        </select>
      </div>
    </div>
  );
};

export default AmountInputWithPeriod;
