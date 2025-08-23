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

        {/* Children Section */}
        <div className="form-group">
          <label>Do you have children?</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="hasChildren" 
                value="no" 
                checked={!formData.hasChildren}
                onChange={(e) => {
                  handleInputChange('hasChildren', false);
                  handleInputChange('children', 0);
                  handleInputChange('childAges', []);
                  handleInputChange('childDisabilities', []);
                }}
              />
              <span className="radio-custom"></span>
              No Children
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="hasChildren" 
                value="yes" 
                checked={formData.hasChildren}
                onChange={(e) => {
                  handleInputChange('hasChildren', true);
                  if (formData.children === 0) {
                    handleInputChange('children', 1);
                  }
                }}
              />
              <span className="radio-custom"></span>
              Yes, I have children
            </label>
          </div>
        </div>

        {/* Show children fields only if they have children */}
        {formData.hasChildren && (
          <>
            <div className="form-group">
              <label htmlFor="children">Number of Children</label>
              <input 
                type="number" 
                id="children" 
                className="form-control" 
                min="1" 
                max="10" 
                value={formData.children}
                onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Individual child ages */}
            <div className="form-group">
              <label>Age of Each Child</label>
              {Array.from({ length: formData.children }, (_, index) => (
                <div key={index} className="child-age-input" style={{ marginBottom: '10px' }}>
                  <label htmlFor={`childAge${index}`}>Child {index + 1} Age:</label>
                  <input 
                    type="number" 
                    id={`childAge${index}`} 
                    className="form-control" 
                    min="0" 
                    max="19" 
                    value={formData.childAges[index] || ''}
                    onChange={(e) => {
                      const newChildAges = [...(formData.childAges || [])];
                      newChildAges[index] = parseInt(e.target.value) || 0;
                      handleInputChange('childAges', newChildAges);
                    }}
                    placeholder="Enter age"
                  />
                </div>
              ))}
            </div>

            {/* Children's disability information */}
            <div className="form-group">
              <label>Children's Disability Information</label>
              {Array.from({ length: formData.children }, (_, index) => (
                <div key={index} className="child-disability-section" style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  marginBottom: '15px', 
                  borderRadius: '5px' 
                }}>
                  <h4 style={{ marginTop: '0', marginBottom: '15px' }}>Child {index + 1}</h4>
                  
                  {/* Does child have illness or disability? */}
                  <div className="form-group">
                    <label>Does Child {index + 1} have an illness or disability?</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name={`childDisability${index}`} 
                          value="yes" 
                          checked={formData.childDisabilities[index]?.hasDisability === true}
                          onChange={(e) => {
                            const newChildDisabilities = [...(formData.childDisabilities || [])];
                            if (!newChildDisabilities[index]) newChildDisabilities[index] = {};
                            newChildDisabilities[index].childIndex = index;
                            newChildDisabilities[index].hasDisability = true;
                            handleInputChange('childDisabilities', newChildDisabilities);
                          }}
                        />
                        <span className="radio-custom"></span>
                        Yes
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name={`childDisability${index}`} 
                          value="no" 
                          checked={formData.childDisabilities[index]?.hasDisability === false}
                          onChange={(e) => {
                            const newChildDisabilities = [...(formData.childDisabilities || [])];
                            if (!newChildDisabilities[index]) newChildDisabilities[index] = {};
                            newChildDisabilities[index].childIndex = index;
                            newChildDisabilities[index].hasDisability = false;
                            newChildDisabilities[index].claimsDLA = false;
                            newChildDisabilities[index].careRate = '';
                            newChildDisabilities[index].mobilityRate = '';
                            handleInputChange('childDisabilities', newChildDisabilities);
                          }}
                        />
                        <span className="radio-custom"></span>
                        No
                      </label>
                    </div>
                  </div>

                  {/* Show DLA questions only if child has disability */}
                  {formData.childDisabilities[index]?.hasDisability && (
                    <>
                      <div className="form-group">
                        <label>Does Child {index + 1} claim Disability Living Allowance (DLA)?</label>
                        <div className="radio-group">
                          <label className="radio-label">
                            <input 
                              type="radio" 
                              name={`childDLA${index}`} 
                              value="yes" 
                              checked={formData.childDisabilities[index]?.claimsDLA === true}
                              onChange={(e) => {
                                const newChildDisabilities = [...(formData.childDisabilities || [])];
                                newChildDisabilities[index].claimsDLA = true;
                                handleInputChange('childDisabilities', newChildDisabilities);
                              }}
                            />
                            <span className="radio-custom"></span>
                            Yes
                          </label>
                          <label className="radio-label">
                            <input 
                              type="radio" 
                              name={`childDLA${index}`} 
                              value="no" 
                              checked={formData.childDisabilities[index]?.claimsDLA === false}
                              onChange={(e) => {
                                const newChildDisabilities = [...(formData.childDisabilities || [])];
                                newChildDisabilities[index].claimsDLA = false;
                                newChildDisabilities[index].careRate = '';
                                newChildDisabilities[index].mobilityRate = '';
                                handleInputChange('childDisabilities', newChildDisabilities);
                              }}
                            />
                            <span className="radio-custom"></span>
                            No
                          </label>
                        </div>
                      </div>

                      {/* Show DLA rates only if child claims DLA */}
                      {formData.childDisabilities[index]?.claimsDLA && (
                        <>
                          <div className="form-group">
                            <label>DLA Care Component Rate</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  name={`childCareRate${index}`} 
                                  value="lowest" 
                                  checked={formData.childDisabilities[index]?.careRate === 'lowest'}
                                  onChange={(e) => {
                                    const newChildDisabilities = [...(formData.childDisabilities || [])];
                                    newChildDisabilities[index].careRate = e.target.value;
                                    handleInputChange('childDisabilities', newChildDisabilities);
                                  }}
                                />
                                <span className="radio-custom"></span>
                                Lowest Rate (£26.90)
                              </label>
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  name={`childCareRate${index}`} 
                                  value="middle" 
                                  checked={formData.childDisabilities[index]?.careRate === 'middle'}
                                  onChange={(e) => {
                                    const newChildDisabilities = [...(formData.childDisabilities || [])];
                                    newChildDisabilities[index].careRate = e.target.value;
                                    handleInputChange('childDisabilities', newChildDisabilities);
                                  }}
                                />
                                <span className="radio-custom"></span>
                                Middle Rate (£68.10)
                              </label>
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  name={`childCareRate${index}`} 
                                  value="highest" 
                                  checked={formData.childDisabilities[index]?.careRate === 'highest'}
                                  onChange={(e) => {
                                    const newChildDisabilities = [...(formData.childDisabilities || [])];
                                    newChildDisabilities[index].careRate = e.target.value;
                                    handleInputChange('childDisabilities', newChildDisabilities);
                                  }}
                                />
                                <span className="radio-custom"></span>
                                Highest Rate (£101.75)
                              </label>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>DLA Mobility Component Rate</label>
                            <div className="radio-group">
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  name={`childMobilityRate${index}`} 
                                  value="lowest" 
                                  checked={formData.childDisabilities[index]?.mobilityRate === 'lowest'}
                                  onChange={(e) => {
                                    const newChildDisabilities = [...(formData.childDisabilities || [])];
                                    newChildDisabilities[index].mobilityRate = e.target.value;
                                    handleInputChange('childDisabilities', newChildDisabilities);
                                  }}
                                />
                                <span className="radio-custom"></span>
                                Lowest Rate (£26.90)
                              </label>
                              <label className="radio-label">
                                <input 
                                  type="radio" 
                                  name={`childMobilityRate${index}`} 
                                  value="highest" 
                                  checked={formData.childDisabilities[index]?.mobilityRate === 'highest'}
                                  onChange={(e) => {
                                    const newChildDisabilities = [...(formData.childDisabilities || [])];
                                    newChildDisabilities[index].mobilityRate = e.target.value;
                                    handleInputChange('childDisabilities', newChildDisabilities);
                                  }}
                                />
                                <span className="radio-custom"></span>
                                Highest Rate (£71.00)
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Housing Section */}
        <div className="form-group">
          <label>Housing Status</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="housingStatus" 
                value="no_housing_costs" 
                checked={formData.housingStatus === 'no_housing_costs'}
                onChange={(e) => handleInputChange('housingStatus', e.target.value)}
              />
              <span className="radio-custom"></span>
              No Housing Costs
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="housingStatus" 
                value="renting" 
                checked={formData.housingStatus === 'renting'}
                onChange={(e) => handleInputChange('housingStatus', e.target.value)}
              />
              <span className="radio-custom"></span>
              Renting
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="housingStatus" 
                value="homeowner" 
                checked={formData.housingStatus === 'homeowner'}
                onChange={(e) => handleInputChange('housingStatus', e.target.value)}
              />
              <span className="radio-custom"></span>
              Homeowner
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="housingStatus" 
                value="other" 
                checked={formData.housingStatus === 'other'}
                onChange={(e) => handleInputChange('housingStatus', e.target.value)}
              />
              <span className="radio-custom"></span>
              Other
            </label>
          </div>
        </div>

        {/* Show tenant type options only if renting */}
        {formData.housingStatus === 'renting' && (
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
        )}

        {/* Show message for non-renting options */}
        {(formData.housingStatus === 'homeowner' || formData.housingStatus === 'other') && (
          <div className="info-box">
            <p><strong>Not covered yet:</strong> {formData.housingStatus === 'homeowner' ? 'We do not currently support calculations for homeowners. Please select "Renting" or "No Housing Costs" to continue with the calculation.' : 'We do not yet cover people who live in Temporary Accommodation, Supported Accommodation, Residential care or in prison. Please select "Renting" or "No Housing Costs" to continue with the calculation.'}</p>
          </div>
        )}

        {/* Show rent and service charges only if renting */}
        {formData.housingStatus === 'renting' && (
          <>
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
          </>
        )}

        {/* Show bedrooms and other housing fields only if not "no housing costs" */}
        {formData.housingStatus !== 'no_housing_costs' && (
          <>
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
              <label htmlFor="nonDependants">Number of Non-Dependants</label>
          <input 
            type="number" 
            id="nonDependants" 
            className="form-control" 
            min="0" 
            value={formData.nonDependants}
            onChange={(e) => handleInputChange('nonDependants', parseInt(e.target.value) || 0)}
          />
        </div>
          </>
        )}

        {/* Employment Section */}
        <div className="form-group">
          <label>Employment Status</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="employmentType" 
                value="not_working" 
                checked={formData.employmentType === 'not_working'}
                onChange={(e) => handleInputChange('employmentType', e.target.value)}
              />
              <span className="radio-custom"></span>
              Not Working
            </label>
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

        {/* Show employment fields only if working */}
        {(formData.employmentType === 'employed' || formData.employmentType === 'self-employed') && (
          <>
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
          </>
        )}

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
