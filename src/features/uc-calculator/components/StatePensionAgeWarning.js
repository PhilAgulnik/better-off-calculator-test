import React from 'react';

function StatePensionAgeWarning({ type }) {
  if (!type) return null;

  const isOver = type === 'over';
  const title = 'State Pension Age Notice';
  const note = 'Note: State pension age is currently 66 but increasing gradually to 67 from April 2026.';
  const message = isOver
    ? (
      <>
        We do not currently calculate benefits for people who are older than state pension age (Pension Credit, Housing Benefit and related benefits).
      </>
    )
    : (
      <>
        You are in a couple where one is older than state pension age and the other younger. This means you count as a 'mixed age couple' and can use the calculator to calculate Universal Credit. To make the calculator you will need to make the older member of couple age 65.
      </>
    );

  return (
    <div className="pension-age-warning">
      <div className="warning-content">
        <div className="warning-icon">⚠️</div>
        <div className="warning-text">
          <h3>{title}</h3>
          <p>{message}</p>
          <p className="pension-age-note">{note}</p>
        </div>
      </div>
    </div>
  );
}

export default StatePensionAgeWarning;
