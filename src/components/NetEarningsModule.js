import React, { useMemo, useState } from 'react';

function NetEarningsModule({ formData, onFormChange }) {
  const gross = parseFloat(formData.monthlyEarnings) || 0;
  const overrideNet = formData.netMonthlyEarningsOverride;

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [useOverride, setUseOverride] = useState(Boolean(overrideNet));

  const calc = useMemo(() => {
    // Assumptions (simplified):
    // - Personal allowance: £12,570/year
    // - Basic rate 20% up to £37,700 taxable; Higher rate 40% above
    // - Employee NI: 8% above £1,048/month
    // - Minimum pension contribution (employee): 3% of gross
    const personalAllowanceYear = 12570;
    const basicBandYear = 37700;
    const niMonthlyThreshold = 1048;
    const niRate = 0.08;
    const minPensionRate = 0.03;

    const grossYear = gross * 12;
    const taxableYear = Math.max(0, grossYear - personalAllowanceYear);
    const basicTaxYear = Math.min(taxableYear, basicBandYear) * 0.20;
    const higherTaxYear = Math.max(0, taxableYear - basicBandYear) * 0.40;
    const taxMonthly = (basicTaxYear + higherTaxYear) / 12;

    const niMonthly = Math.max(0, gross - niMonthlyThreshold) * niRate;
    const pensionMonthly = gross * minPensionRate;

    const netCalculated = Math.max(0, gross - taxMonthly - niMonthly - pensionMonthly);
    return {
      taxMonthly,
      basicTaxMonthly: basicTaxYear / 12,
      higherTaxMonthly: higherTaxYear / 12,
      niMonthly,
      pensionMonthly,
      netCalculated
    };
  }, [gross]);

  const effectiveNet = useOverride && (overrideNet || overrideNet === 0)
    ? parseFloat(overrideNet) || 0
    : calc.netCalculated;

  // Reflect calculated (non-override) net into form for other modules to use
  React.useEffect(() => {
    onFormChange({ ...formData, netMonthlyEarningsCalculated: Math.round(calc.netCalculated * 100) / 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calc.netCalculated]);

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <h3>Net earnings</h3>

      <div className="form-group">
        <label>Calculated net earnings (per month)</label>
        <input
          type="number"
          className="form-control"
          value={Math.round(calc.netCalculated * 100) / 100}
          readOnly
        />
        <small className="help-text">Based on current gross earnings, income tax, National Insurance, and minimum pension contribution.</small>
      </div>

      <div className="form-group">
        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={useOverride}
            onChange={(e) => {
              const next = e.target.checked;
              setUseOverride(next);
              if (!next) {
                onFormChange({ ...formData, netMonthlyEarningsOverride: '' });
              }
            }}
          />
          <span>Enter net earnings myself instead</span>
        </label>
      </div>

      {useOverride && (
        <div className="form-group">
          <label>Your net earnings (per month)</label>
          <input
            type="number"
            className="form-control"
            min="0"
            step="0.01"
            value={overrideNet ?? ''}
            onChange={(e) => onFormChange({ ...formData, netMonthlyEarningsOverride: e.target.value })}
          />
        </div>
      )}

      {gross > 0 && Math.abs(effectiveNet - gross) > 0.005 && (
        <div className="form-group">
          <button type="button" className="btn btn-secondary" onClick={() => setShowBreakdown((s) => !s)}>
            {showBreakdown ? 'Hide' : 'How we worked out your net earnings'}
          </button>
        </div>
      )}

      {showBreakdown && (
        <div className="breakdown">
          <table className="table">
            <tbody>
              <tr>
                <td>Gross earnings</td>
                <td>£{gross.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Income tax — basic rate</td>
                <td>-£{calc.basicTaxMonthly.toFixed(2)}</td>
              </tr>
              {calc.higherTaxMonthly > 0 && (
                <tr>
                  <td>Income tax — higher rate</td>
                  <td>-£{calc.higherTaxMonthly.toFixed(2)}</td>
                </tr>
              )}
              <tr>
                <td>National Insurance</td>
                <td>-£{calc.niMonthly.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Pension (min 3%)</td>
                <td>-£{calc.pensionMonthly.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Net earnings</strong></td>
                <td><strong>£{calc.netCalculated.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NetEarningsModule;


