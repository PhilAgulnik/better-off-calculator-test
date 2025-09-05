import React from 'react';
import { 
  housingReviewTypes, 
  getHousingReviewAmounts, 
  getHousingReviewDataSourceInfo 
} from '../features/budgeting-tool/housingReviewsDataService';

function HousingReviewAmounts() {
  const dataSourceInfo = getHousingReviewDataSourceInfo();

  return (
    <div className="housing-review-amounts">
      <div className="container">
        <header className="page-header">
          <h1>Housing Review Standard Amounts</h1>
          <div className="adviser-only-notice">
            <p><strong>This page will only be available to advisers</strong></p>
          </div>
        </header>

        <div className="content-section">
          <div className="data-source-info">
            <h2>Data Source Information</h2>
            <p><strong>Source:</strong> {dataSourceInfo.name}</p>
            <p><strong>Description:</strong> {dataSourceInfo.description}</p>
            <p><strong>Based on:</strong> {dataSourceInfo.source}</p>
            <p><strong>Last Updated:</strong> {dataSourceInfo.lastUpdated}</p>
            <p><strong>Note:</strong> {dataSourceInfo.note}</p>
          </div>

          <div className="amounts-section">
            <h2>Standard Amounts by Household Type</h2>
            <p className="section-description">
              The following amounts are used as standard affordability guidelines in housing reviews. 
              Rent amounts are calculated as 30% of monthly income and are not shown as fixed amounts.
            </p>

            <div className="household-types-grid">
              {Object.entries(housingReviewTypes).map(([key, label]) => {
                const amounts = getHousingReviewAmounts(key);
                return (
                  <div key={key} className="household-type-card">
                    <h3>{label}</h3>
                    <div className="amounts-list">
                      <div className="amount-item">
                        <span className="amount-label">Rent:</span>
                        <span className="amount-value">30% of monthly income</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Council Tax:</span>
                        <span className="amount-value">£{amounts.councilTax}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Gas & Electricity:</span>
                        <span className="amount-value">£{amounts.gasAndElectricity}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Water:</span>
                        <span className="amount-value">£{amounts.water}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Broadband:</span>
                        <span className="amount-value">£{amounts.broadband}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Food:</span>
                        <span className="amount-value">£{amounts.food}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Transport:</span>
                        <span className="amount-value">£{amounts.transport}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Phone:</span>
                        <span className="amount-value">£{amounts.phone}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Clothing:</span>
                        <span className="amount-value">£{amounts.clothing}</span>
                      </div>
                      {amounts.childcare > 0 && (
                        <div className="amount-item">
                          <span className="amount-label">Childcare:</span>
                          <span className="amount-value">£{amounts.childcare}</span>
                        </div>
                      )}
                      <div className="amount-item">
                        <span className="amount-label">Debt Payments:</span>
                        <span className="amount-value">£{amounts.debtPayments} (user defined)</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Other Expenses:</span>
                        <span className="amount-value">£{amounts.otherExpenses}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="usage-section">
            <h2>How to Use These Amounts</h2>
            <div className="usage-info">
              <h3>In the Budgeting Tool:</h3>
              <ol>
                <li>Go to the Budgeting Tool</li>
                <li>Click "Pre-fill with Standard Amounts"</li>
                <li>Select "Housing Reviews Standard Amounts" from the Data Source dropdown</li>
                <li>Choose your household type</li>
                <li>Click "Pre-fill Budget" to populate the form with these amounts</li>
              </ol>
              
              <h3>Rent Calculation:</h3>
              <p>
                Rent amounts are calculated as 30% of your monthly income. This is the standard 
                affordability ratio used in housing reviews. If you enter your monthly income 
                in the wages field, the rent amount will be automatically calculated.
              </p>
              
              <h3>Customization:</h3>
              <p>
                These amounts serve as starting points. You can adjust any amount in the 
                budgeting tool to better reflect your personal circumstances.
              </p>
            </div>
          </div>

          <div className="back-link">
            <a href="/budgeting-tool" className="btn btn-primary">
              ← Back to Budgeting Tool
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HousingReviewAmounts;
