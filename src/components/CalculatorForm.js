import React from 'react';
import CarerModule from './CarerModule';

function CalculatorForm({ formData, onFormChange, onCalculate, onSave, onReset }) {
  const handleInputChange = (field, value) => {
    onFormChange(field, value);
  };

  return (
    <section className="input-section">
      <div className="card">
        <h2>Your Details</h2>
        
        {/* Tax Year Selection */}
        <div className="form-group">
          <label>Tax Year</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="taxYear" 
                value="2025_26" 
                checked={formData.taxYear === '2025_26'}
                onChange={(e) => handleInputChange('taxYear', e.target.value)}
              />
              <span className="radio-custom"></span>
              2025/26
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="taxYear" 
                value="2024_25" 
                checked={formData.taxYear === '2024_25'}
                onChange={(e) => handleInputChange('taxYear', e.target.value)}
              />
              <span className="radio-custom"></span>
              2024/25
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="taxYear" 
                value="2023_24" 
                checked={formData.taxYear === '2023_24'}
                onChange={(e) => handleInputChange('taxYear', e.target.value)}
              />
              <span className="radio-custom"></span>
              2023/24
            </label>
          </div>
        </div>

        {/* Personal Circumstances */}
        <div className="form-group">
          <label>Personal Circumstances</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="circumstances" 
                value="single" 
                checked={formData.circumstances === 'single'}
                onChange={(e) => handleInputChange('circumstances', e.target.value)}
              />
              <span className="radio-custom"></span>
              Single
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="circumstances" 
                value="couple" 
                checked={formData.circumstances === 'couple'}
                onChange={(e) => handleInputChange('circumstances', e.target.value)}
              />
              <span className="radio-custom"></span>
              Couple
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input 
            type="number" 
            id="age" 
            className="form-control" 
            min="16" 
            max="120" 
            value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
          />
        </div>

        {formData.circumstances === 'couple' && (
          <div className="form-group">
            <label htmlFor="partnerAge">Partner's Age</label>
            <input 
              type="number" 
              id="partnerAge" 
              className="form-control" 
              min="16" 
              max="120" 
              value={formData.partnerAge}
              onChange={(e) => handleInputChange('partnerAge', parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        {/* Children */}
        <div className="form-group">
          <label htmlFor="children">Number of Children</label>
          <input 
            type="number" 
            id="children" 
            className="form-control" 
            min="0" 
            max="10" 
            value={formData.children}
            onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Age of Youngest Child</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="childrenAge" 
                value="under1" 
                checked={formData.childrenAge === 'under1'}
                onChange={(e) => handleInputChange('childrenAge', e.target.value)}
              />
              <span className="radio-custom"></span>
              Under 1
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="childrenAge" 
                value="1to2" 
                checked={formData.childrenAge === '1to2'}
                onChange={(e) => handleInputChange('childrenAge', e.target.value)}
              />
              <span className="radio-custom"></span>
              1 to 2
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="childrenAge" 
                value="3to4" 
                checked={formData.childrenAge === '3to4'}
                onChange={(e) => handleInputChange('childrenAge', e.target.value)}
              />
              <span className="radio-custom"></span>
              3 to 4
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="childrenAge" 
                value="5to10" 
                checked={formData.childrenAge === '5to10'}
                onChange={(e) => handleInputChange('childrenAge', e.target.value)}
              />
              <span className="radio-custom"></span>
              5 to 10
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="childrenAge" 
                value="11to15" 
                checked={formData.childrenAge === '11to15'}
                onChange={(e) => handleInputChange('childrenAge', e.target.value)}
              />
              <span className="radio-custom"></span>
              11 to 15
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="childrenAge" 
                value="16to19" 
                checked={formData.childrenAge === '16to19'}
                onChange={(e) => handleInputChange('childrenAge', e.target.value)}
              />
              <span className="radio-custom"></span>
              16 to 19
            </label>
          </div>
        </div>

        {/* Housing Section */}
        <div className="form-group">
          <label>Tenant Type</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="tenantType" 
                value="private" 
                checked={formData.tenantType === 'private'}
                onChange={(e) => handleInputChange('tenantType', e.target.value)}
              />
              <span className="radio-custom"></span>
              Private Tenant
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="tenantType" 
                value="social" 
                checked={formData.tenantType === 'social'}
                onChange={(e) => handleInputChange('tenantType', e.target.value)}
              />
              <span className="radio-custom"></span>
              Social Housing
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="rent">Monthly Rent</label>
          <div className="input-with-prefix">
            <span className="prefix">£</span>
            <input 
              type="number" 
              id="rent" 
              className="form-control" 
              min="0" 
              step="0.01" 
              value={formData.rent}
              onChange={(e) => handleInputChange('rent', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="serviceCharges">Service Charges</label>
          <div className="input-with-prefix">
            <span className="prefix">£</span>
            <input 
              type="number" 
              id="serviceCharges" 
              className="form-control" 
              min="0" 
              step="0.01" 
              value={formData.serviceCharges}
              onChange={(e) => handleInputChange('serviceCharges', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Number of Bedrooms</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="bedrooms" 
                value="0" 
                checked={formData.bedrooms === 0}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
              />
              <span className="radio-custom"></span>
              Studio
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="bedrooms" 
                value="1" 
                checked={formData.bedrooms === 1}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 1)}
              />
              <span className="radio-custom"></span>
              1 Bedroom
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="bedrooms" 
                value="2" 
                checked={formData.bedrooms === 2}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 2)}
              />
              <span className="radio-custom"></span>
              2 Bedrooms
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="bedrooms" 
                value="3" 
                checked={formData.bedrooms === 3}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 3)}
              />
              <span className="radio-custom"></span>
              3 Bedrooms
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="bedrooms" 
                value="4" 
                checked={formData.bedrooms === 4}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 4)}
              />
              <span className="radio-custom"></span>
              4 Bedrooms
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="bedrooms" 
                value="5" 
                checked={formData.bedrooms === 5}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 5)}
              />
              <span className="radio-custom"></span>
              5+ Bedrooms
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="nonDependants">Non-dependants</label>
          <input 
            type="number" 
            id="nonDependants" 
            className="form-control" 
            min="0" 
            max="10" 
            value={formData.nonDependants}
            onChange={(e) => handleInputChange('nonDependants', parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Employment Section */}
        <div className="form-group">
          <label>Employment Type</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="employmentType" 
                value="employed" 
                checked={formData.employmentType === 'employed'}
                onChange={(e) => handleInputChange('employmentType', e.target.value)}
              />
              <span className="radio-custom"></span>
              Employed
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="employmentType" 
                value="self-employed" 
                checked={formData.employmentType === 'self-employed'}
                onChange={(e) => handleInputChange('employmentType', e.target.value)}
              />
              <span className="radio-custom"></span>
              Self-employed
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="monthlyEarnings">Monthly Earnings</label>
          <div className="input-with-prefix">
            <span className="prefix">£</span>
            <input 
              type="number" 
              id="monthlyEarnings" 
              className="form-control" 
              min="0" 
              step="0.01" 
              value={formData.monthlyEarnings}
              onChange={(e) => handleInputChange('monthlyEarnings', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="childcareCosts">Childcare Costs</label>
          <div className="input-with-prefix">
            <span className="prefix">£</span>
            <input 
              type="number" 
              id="childcareCosts" 
              className="form-control" 
              min="0" 
              step="0.01" 
              value={formData.childcareCosts}
              onChange={(e) => handleInputChange('childcareCosts', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Carer Section */}
        <div className="carer-section">
          <h3>Carer Status</h3>
          
          <div className="form-group">
            <label>Do you care for someone who is sick or disabled?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="isCarer" 
                  value="yes" 
                  checked={formData.isCarer === 'yes'}
                  onChange={(e) => handleInputChange('isCarer', e.target.value)}
                />
                <span className="radio-custom"></span>
                Yes
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="isCarer" 
                  value="no" 
                  checked={formData.isCarer === 'no'}
                  onChange={(e) => handleInputChange('isCarer', e.target.value)}
                />
                <span className="radio-custom"></span>
                No
              </label>
            </div>
          </div>

          {formData.circumstances === 'couple' && (
            <div className="form-group">
              <label>Does your partner care for someone who is sick or disabled?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="isPartnerCarer" 
                    value="yes" 
                    checked={formData.isPartnerCarer === 'yes'}
                    onChange={(e) => handleInputChange('isPartnerCarer', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Yes
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="isPartnerCarer" 
                    value="no" 
                    checked={formData.isPartnerCarer === 'no'}
                    onChange={(e) => handleInputChange('isPartnerCarer', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  No
                </label>
              </div>
            </div>
          )}

          {/* Carer Module for Client */}
          <CarerModule 
            formData={formData}
            onFormChange={onFormChange}
            isPartner={false}
            isScotland={formData.area === 'scotland'}
            isUniversalCredit={true}
            earningsBelowLimit={formData.monthlyEarnings <= 655} // £151/week * 4.33
          />

          {/* Carer Module for Partner */}
          {formData.circumstances === 'couple' && (
            <CarerModule 
              formData={formData}
              onFormChange={onFormChange}
              isPartner={true}
              isScotland={formData.area === 'scotland'}
              isUniversalCredit={true}
              earningsBelowLimit={formData.partnerMonthlyEarnings <= 655} // £151/week * 4.33
            />
          )}
        </div>

        {/* Other Benefits */}
        <div className="form-group">
          <label htmlFor="otherBenefits">Other Benefits</label>
          <div className="input-with-period">
            <div className="input-with-prefix">
              <span className="prefix">£</span>
              <input 
                type="number" 
                id="otherBenefits" 
                className="form-control" 
                min="0" 
                step="0.01" 
                value={formData.otherBenefits}
                onChange={(e) => handleInputChange('otherBenefits', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="otherBenefitsPeriod" 
                  value="weekly" 
                  checked={formData.otherBenefitsPeriod === 'weekly'}
                  onChange={(e) => handleInputChange('otherBenefitsPeriod', e.target.value)}
                />
                <span className="radio-custom"></span>
                per week
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="otherBenefitsPeriod" 
                  value="fortnightly" 
                  checked={formData.otherBenefitsPeriod === 'fortnightly'}
                  onChange={(e) => handleInputChange('otherBenefitsPeriod', e.target.value)}
                />
                <span className="radio-custom"></span>
                per fortnight
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="otherBenefitsPeriod" 
                  value="monthly" 
                  checked={formData.otherBenefitsPeriod === 'monthly'}
                  onChange={(e) => handleInputChange('otherBenefitsPeriod', e.target.value)}
                />
                <span className="radio-custom"></span>
                per month
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="otherBenefitsPeriod" 
                  value="yearly" 
                  checked={formData.otherBenefitsPeriod === 'yearly'}
                  onChange={(e) => handleInputChange('otherBenefitsPeriod', e.target.value)}
                />
                <span className="radio-custom"></span>
                per year
              </label>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="form-group">
          <label htmlFor="savings">Savings</label>
          <div className="input-with-prefix">
            <span className="prefix">£</span>
            <input 
              type="number" 
              id="savings" 
              className="form-control" 
              min="0" 
              step="0.01" 
              value={formData.savings}
              onChange={(e) => handleInputChange('savings', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button type="button" onClick={onCalculate} className="btn btn-primary">
            Calculate
          </button>
          <button type="button" onClick={onSave} className="btn btn-secondary">
            Save Scenario
          </button>
          <button type="button" onClick={onReset} className="btn btn-outline">
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export default CalculatorForm;
