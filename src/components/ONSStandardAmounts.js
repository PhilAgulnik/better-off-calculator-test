import React from 'react';
import { 
  householdTypes, 
  getONSData, 
  getDataSourceInfo,
  // eslint-disable-next-line no-unused-vars
  getInflationRate,
  inflationRates
} from '../features/budgeting-tool/onsDataService';

function ONSStandardAmounts() {
  const dataSourceInfo = getDataSourceInfo();

  return (
    <div className="ons-standard-amounts">
      <div className="container">
        <header className="page-header">
          <h1>ONS Standard Amounts</h1>
          <div className="adviser-only-notice">
            <p><strong>This page will only be available to advisers</strong></p>
          </div>
        </header>

        <div className="content-section">
          <div className="data-source-info">
            <h2>Data Source Information</h2>
            <p><strong>Source:</strong> {dataSourceInfo.source}</p>
            <p><strong>Publication:</strong> {dataSourceInfo.publication}</p>
            <p><strong>Last Updated:</strong> {dataSourceInfo.lastUpdated}</p>
            <p><strong>URL:</strong> <a href={dataSourceInfo.url} target="_blank" rel="noopener noreferrer">{dataSourceInfo.url}</a></p>
            <p><strong>Disclaimer:</strong> {dataSourceInfo.disclaimer}</p>
          </div>

          <div className="inflation-section">
            <h2>Inflation Rates by Household Type</h2>
            <p className="section-description">
              Current inflation rates from ONS Household Costs Indices (June 2025). These rates can be used to adjust amounts for future periods.
            </p>
            <div className="inflation-grid">
              {Object.entries(inflationRates).map(([key, rate]) => (
                <div key={key} className="inflation-item">
                  <span className="household-type">{householdTypes[key]}</span>
                  <span className="inflation-rate">{rate}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="amounts-section">
            <h2>Standard Amounts by Household Type</h2>
            <p className="section-description">
              The following amounts are based on ONS Household Costs Indices and Living Costs and Food Survey data. 
              These represent estimated monthly averages for different household types.
            </p>

            <div className="household-types-grid">
              {Object.entries(householdTypes).map(([key, label]) => {
                const amounts = getONSData(key);
                if (!amounts) return null;
                
                return (
                  <div key={key} className="household-type-card">
                    <h3>{label}</h3>
                    <div className="amounts-list">
                      {amounts.rent > 0 && (
                        <div className="amount-item">
                          <span className="amount-label">Rent:</span>
                          <span className="amount-value">£{amounts.rent}</span>
                        </div>
                      )}
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
                        <span className="amount-value">£{amounts.debtPayments}</span>
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
                <li>Select "ONS Data" from the Data Source dropdown</li>
                <li>Choose your household type</li>
                <li>Click "Pre-fill Budget" to populate the form with these amounts</li>
              </ol>
              
              <h3>About ONS Data:</h3>
              <p>
                These amounts are based on official statistics from the Office for National Statistics, 
                specifically the Household Costs Indices and Living Costs and Food Survey. They represent 
                average spending patterns for different household types across the UK.
              </p>
              
              <h3>Inflation Adjustments:</h3>
              <p>
                The inflation rates shown above can be used to adjust these amounts for different time periods. 
                Each household type has its own inflation rate based on their typical spending patterns.
              </p>
              
              <h3>Customization:</h3>
              <p>
                These amounts serve as starting points based on national averages. You can adjust any amount 
                in the budgeting tool to better reflect your personal circumstances and local area costs.
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

export default ONSStandardAmounts;
