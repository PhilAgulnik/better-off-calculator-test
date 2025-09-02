import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BudgetingTool() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the enhanced budgeting tool
    navigate('/budgeting-tool', { replace: true });
  }, [navigate]);

  return (
    <div className="budgeting-tool">
      <div className="container">
        <p>Redirecting to the budgeting tool...</p>
      </div>
    </div>
  );
}

export default BudgetingTool;
