import React from 'react';
import { Link } from 'react-router-dom';

function ChildBenefitChargeHelp() {
  return (
    <div className="help-page">
      <div className="help-content">
        <div className="help-header">
          <Link to="/" className="back-link">← Back to Calculator</Link>
          <h1>Child Benefit High Income Tax Charge</h1>
        </div>

        <div className="help-body">
          <div className="help-section">
            <h2>What is the High Income Child Benefit Charge?</h2>
            <p>
              The High Income Child Benefit Charge (HICBC) is a tax charge that applies when you or your partner 
              have an income over £60,000 per year and you're receiving Child Benefit.
            </p>
            <p>
              This charge was introduced to reduce the amount of Child Benefit paid to higher earners, while still 
              allowing families to claim Child Benefit to protect their National Insurance record.
            </p>
          </div>

          <div className="help-section">
            <h2>How the Charge Works</h2>
            
            <div className="charge-brackets">
              <div className="bracket">
                <h3>Income under £60,000</h3>
                <p>No charge applies. You keep all your Child Benefit.</p>
              </div>
              
              <div className="bracket">
                <h3>Income between £60,000 - £80,000</h3>
                <p>
                  The charge is 1% of your Child Benefit for every £100 of income above £60,000. 
                  This means the charge gradually increases as your income rises.
                </p>
                <p><strong>Example:</strong> If you earn £70,000, the charge would be 10% of your Child Benefit.</p>
              </div>
              
              <div className="bracket">
                <h3>Income £80,000 or over</h3>
                <p>
                  The charge equals 100% of your Child Benefit. This means you effectively receive no net benefit 
                  from Child Benefit, but you can still claim it to protect your National Insurance record.
                </p>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h2>Your Options</h2>
            
            <div className="options">
              <div className="option">
                <h3>Option 1: Continue claiming Child Benefit</h3>
                <p>
                  You can continue to claim Child Benefit and pay the tax charge. This ensures you maintain 
                  your National Insurance record, which is important for your State Pension entitlement.
                </p>
                <p><strong>Benefits:</strong></p>
                <ul>
                  <li>Protects your National Insurance record</li>
                  <li>Ensures you get State Pension credits</li>
                  <li>If your income drops below £60,000, you'll automatically receive the full benefit</li>
                </ul>
              </div>
              
              <div className="option">
                <h3>Option 2: Stop claiming Child Benefit</h3>
                <p>
                  You can choose to stop claiming Child Benefit to avoid the tax charge. However, this means 
                  you won't get National Insurance credits.
                </p>
                <p><strong>Considerations:</strong></p>
                <ul>
                  <li>You won't pay the tax charge</li>
                  <li>You won't get National Insurance credits</li>
                  <li>You'll need to manually restart your claim if your income drops</li>
                </ul>
              </div>
              
              <div className="option">
                <h3>Option 3: Claim but opt out of payments</h3>
                <p>
                  You can claim Child Benefit but choose not to receive the payments. This protects your 
                  National Insurance record without creating a tax liability.
                </p>
                <p><strong>Benefits:</strong></p>
                <ul>
                  <li>No tax charge to pay</li>
                  <li>National Insurance record is protected</li>
                  <li>You can opt back into payments if your income drops</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h2>Important Considerations</h2>
            
            <div className="considerations">
              <div className="consideration">
                <h3>National Insurance Credits</h3>
                <p>
                  Child Benefit provides National Insurance credits that count towards your State Pension. 
                  If you stop claiming entirely, you may miss out on these valuable credits.
                </p>
              </div>
              
              <div className="consideration">
                <h3>Income Fluctuations</h3>
                <p>
                  If your income varies from year to year, continuing to claim Child Benefit means you'll 
                  automatically receive the full benefit in years when your income is below £60,000.
                </p>
              </div>
              
              <div className="consideration">
                <h3>Partner's Income</h3>
                <p>
                  The charge applies to the higher earner in a couple. If you're in a couple, it's the 
                  partner with the higher income who will be subject to the charge.
                </p>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h2>How to Pay the Charge</h2>
            <p>
              If you choose to continue claiming Child Benefit and pay the charge, you'll need to:
            </p>
            <ol>
              <li>Complete a Self Assessment tax return</li>
              <li>Declare your Child Benefit payments</li>
              <li>Pay the charge by 31 January following the tax year</li>
            </ol>
            <p>
              HMRC will send you a letter if they think you need to pay the charge, but it's your responsibility 
              to declare it on your tax return.
            </p>
          </div>

          <div className="help-section">
            <h2>Getting Help</h2>
            <p>
              For more information about the High Income Child Benefit Charge, visit:
            </p>
            <ul>
              <li>
                <a href="https://www.gov.uk/child-benefit-tax-charge" target="_blank" rel="noopener noreferrer">
                  GOV.UK - Child Benefit tax charge
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/child-benefit" target="_blank" rel="noopener noreferrer">
                  GOV.UK - Child Benefit
                </a>
              </li>
            </ul>
            <p>
              You can also contact HMRC directly for advice on your specific circumstances.
            </p>
          </div>

          <div className="help-footer">
            <p className="disclaimer">
              <strong>Disclaimer:</strong> This information is for guidance only and should not be considered 
              as official tax advice. Tax rules can change, and individual circumstances vary. For official 
              advice, please consult HMRC or a qualified tax advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildBenefitChargeHelp;
