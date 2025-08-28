import React from 'react';
import CarerModule from './CarerModule';
import { useTextManager } from '../hooks/useTextManager';

function CalculatorForm({ formData, onFormChange, onCalculate, onSave, onReset }) {
  const { getTextValue } = useTextManager();
  
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
            <label className={`radio-label ${formData.taxYear === '2025_26' ? 'default-option' : ''}`}>
              <input 
                type="radio" 
                name="taxYear" 
                value="2025_26" 
                checked={formData.taxYear === '2025_26'}
                onChange={(e) => handleInputChange('taxYear', e.target.value)}
              />
              <span className="radio-custom"></span>
              <span>2025/26</span>
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
              <span>2024/25</span>
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
              <span>2023/24</span>
            </label>
          </div>
        </div>

        {/* Personal Circumstances */}
        <div className="form-group">
          <label>Personal Circumstances</label>
          <div className="radio-group">
            <label className={`radio-label ${formData.circumstances === 'single' ? 'default-option' : ''}`}>
              <input 
                type="radio" 
                name="circumstances" 
                value="single" 
                checked={formData.circumstances === 'single'}
                onChange={(e) => handleInputChange('circumstances', e.target.value)}
              />
              <span className="radio-custom"></span>
              <span>Single</span>
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
              <span>Couple</span>
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

        {/* Housing Section */}
        <div className="form-group">
          <label>Housing Status</label>
          <div className="radio-group">
            <label className={`radio-label ${formData.housingStatus === 'no_housing_costs' ? 'default-option' : ''}`}>
              <input 
                type="radio" 
                name="housingStatus" 
                value="no_housing_costs" 
                checked={formData.housingStatus === 'no_housing_costs'}
                onChange={(e) => handleInputChange('housingStatus', e.target.value)}
              />
              <span className="radio-custom"></span>
              <span>No Housing Costs</span>
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

        {/* Employment and Disability Section - Main Person */}
        <div className="employment-disability-section">
          <h3>Employment and Disability - Main Person</h3>
          
          <div className="form-group">
            <label>Employment Status</label>
            <div className="radio-group">
              <label className={`radio-label ${formData.employmentType === 'not_working' ? 'default-option' : ''}`}>
                <input 
                  type="radio" 
                  name="employmentType" 
                  value="not_working" 
                  checked={formData.employmentType === 'not_working'}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                />
                <span className="radio-custom"></span>
                <span>Not Working</span>
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
                <span>Employed</span>
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
                <span>Self-employed</span>
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

                       {/* Pension Contributions - only show for employed */}
         {formData.employmentType === 'employed' && (
           <div className="form-group">
             <label>Pension Contributions</label>
             <div className="radio-group">
               <label className={`radio-label ${formData.pensionType === 'amount' ? 'default-option' : ''}`}>
                 <input
                   type="radio"
                   name="pensionType"
                   value="amount"
                   checked={formData.pensionType === 'amount'}
                   onChange={(e) => handleInputChange('pensionType', e.target.value)}
                 />
                 <span className="radio-custom"></span>
                 <span>Fixed Amount</span>
               </label>
               <label className="radio-label">
                 <input
                   type="radio"
                   name="pensionType"
                   value="percentage"
                   checked={formData.pensionType === 'percentage'}
                   onChange={(e) => handleInputChange('pensionType', e.target.value)}
                 />
                 <span className="radio-custom"></span>
                 <span>Percentage of Gross</span>
               </label>
             </div>

                           {formData.pensionType === 'amount' && (
                <div className="form-group">
                  <label htmlFor="pensionAmount">Pension Amount (per month)</label>
                  <div className="input-with-prefix">
                    <span className="prefix">£</span>
                    <input
                      type="number"
                      id="pensionAmount"
                      className="form-control"
                      min="0"
                      step="0.01"
                      value={formData.pensionAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleInputChange('pensionAmount', 0);
                        } else {
                          handleInputChange('pensionAmount', parseFloat(value) || 0);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

                           {formData.pensionType === 'percentage' && (
                <div className="form-group">
                  <label htmlFor="pensionPercentage">Pension Percentage</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="pensionPercentage"
                      className="form-control"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.pensionPercentage || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleInputChange('pensionPercentage', 0);
                        } else {
                          handleInputChange('pensionPercentage', parseFloat(value) || 0);
                        }
                      }}
                    />
                    <span className="suffix">%</span>
                  </div>
                  {formData.monthlyEarnings > 0 && (
                    <div className="help-text">
                      {formData.pensionPercentage}% of £{formData.monthlyEarnings.toLocaleString()} = £{((formData.monthlyEarnings * formData.pensionPercentage) / 100).toFixed(2)} per month
                    </div>
                  )}
                </div>
              )}
           </div>
         )}

              
            </>
          )}

          {/* Disability Status */}
          <div className="form-group">
            <label>Are you sick or disabled?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="isDisabled" 
                  value="yes" 
                  checked={formData.isDisabled === 'yes'}
                  onChange={(e) => handleInputChange('isDisabled', e.target.value)}
                />
                <span className="radio-custom"></span>
                Yes
              </label>
                          <label className={`radio-label ${formData.isDisabled === 'no' ? 'default-option' : ''}`}>
              <input 
                type="radio" 
                name="isDisabled" 
                value="no" 
                checked={formData.isDisabled === 'no'}
                onChange={(e) => handleInputChange('isDisabled', e.target.value)}
              />
              <span className="radio-custom"></span>
              <span>No</span>
            </label>
            </div>
          </div>

          {/* Disability Benefits - only show if disabled */}
          {formData.isDisabled === 'yes' && (
            <>
              <div className="form-group">
                <label>Do you claim disability benefits?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="claimsDisabilityBenefits" 
                      value="yes" 
                      checked={formData.claimsDisabilityBenefits === 'yes'}
                      onChange={(e) => handleInputChange('claimsDisabilityBenefits', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    Yes
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="claimsDisabilityBenefits" 
                      value="no" 
                      checked={formData.claimsDisabilityBenefits === 'no'}
                      onChange={(e) => handleInputChange('claimsDisabilityBenefits', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    No
                  </label>
                </div>
              </div>

                             {/* Disability Benefit Type - only show if claiming */}
               {formData.claimsDisabilityBenefits === 'yes' && (
                 <div className="form-group">
                   <label>What disability benefit do you claim?</label>
                   <div className="radio-group">
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="disabilityBenefitType" 
                         value="pip" 
                         checked={formData.disabilityBenefitType === 'pip'}
                         onChange={(e) => handleInputChange('disabilityBenefitType', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Personal Independence Payment (PIP)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="disabilityBenefitType" 
                         value="dla" 
                         checked={formData.disabilityBenefitType === 'dla'}
                         onChange={(e) => handleInputChange('disabilityBenefitType', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Disability Living Allowance (DLA)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="disabilityBenefitType" 
                         value="aa" 
                         checked={formData.disabilityBenefitType === 'aa'}
                         onChange={(e) => handleInputChange('disabilityBenefitType', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Attendance Allowance (AA)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="disabilityBenefitType" 
                         value="other" 
                         checked={formData.disabilityBenefitType === 'other'}
                         onChange={(e) => handleInputChange('disabilityBenefitType', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Other
                     </label>
                   </div>
                 </div>
               )}

               {/* PIP Rates - only show if claiming PIP */}
               {formData.claimsDisabilityBenefits === 'yes' && formData.disabilityBenefitType === 'pip' && (
                 <div className="form-group">
                   <label>PIP Daily Living Component Rate</label>
                   <div className="radio-group">
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="pipDailyLivingRate" 
                         value="none" 
                         checked={formData.pipDailyLivingRate === 'none'}
                         onChange={(e) => handleInputChange('pipDailyLivingRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       No award
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="pipDailyLivingRate" 
                         value="standard" 
                         checked={formData.pipDailyLivingRate === 'standard'}
                         onChange={(e) => handleInputChange('pipDailyLivingRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Standard Rate (£72.65)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="pipDailyLivingRate" 
                         value="enhanced" 
                         checked={formData.pipDailyLivingRate === 'enhanced'}
                         onChange={(e) => handleInputChange('pipDailyLivingRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Enhanced Rate (£108.55)
                     </label>
                   </div>
                 </div>
               )}

               {formData.claimsDisabilityBenefits === 'yes' && formData.disabilityBenefitType === 'pip' && (
                 <div className="form-group">
                   <label>PIP Mobility Component Rate</label>
                   <div className="radio-group">
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="pipMobilityRate" 
                         value="none" 
                         checked={formData.pipMobilityRate === 'none'}
                         onChange={(e) => handleInputChange('pipMobilityRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       No award
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="pipMobilityRate" 
                         value="standard" 
                         checked={formData.pipMobilityRate === 'standard'}
                         onChange={(e) => handleInputChange('pipMobilityRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Standard Rate (£28.70)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="pipMobilityRate" 
                         value="enhanced" 
                         checked={formData.pipMobilityRate === 'enhanced'}
                         onChange={(e) => handleInputChange('pipMobilityRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Enhanced Rate (£75.75)
                     </label>
                   </div>
                 </div>
               )}

               {/* DLA Rates - only show if claiming DLA */}
               {formData.claimsDisabilityBenefits === 'yes' && formData.disabilityBenefitType === 'dla' && (
                 <div className="form-group">
                   <label>DLA Care Component Rate</label>
                   <div className="radio-group">
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="dlaCareRate" 
                         value="none" 
                         checked={formData.dlaCareRate === 'none'}
                         onChange={(e) => handleInputChange('dlaCareRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       No award
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="dlaCareRate" 
                         value="lowest" 
                         checked={formData.dlaCareRate === 'lowest'}
                         onChange={(e) => handleInputChange('dlaCareRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Lowest Rate (£28.70)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="dlaCareRate" 
                         value="middle" 
                         checked={formData.dlaCareRate === 'middle'}
                         onChange={(e) => handleInputChange('dlaCareRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Middle Rate (£72.65)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="dlaCareRate" 
                         value="highest" 
                         checked={formData.dlaCareRate === 'highest'}
                         onChange={(e) => handleInputChange('dlaCareRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Highest Rate (£108.55)
                     </label>
                   </div>
                 </div>
               )}

               {formData.claimsDisabilityBenefits === 'yes' && formData.disabilityBenefitType === 'dla' && (
                 <div className="form-group">
                   <label>DLA Mobility Component Rate</label>
                   <div className="radio-group">
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="dlaMobilityRate" 
                         value="none" 
                         checked={formData.dlaMobilityRate === 'none'}
                         onChange={(e) => handleInputChange('dlaMobilityRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       No award
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="dlaMobilityRate" 
                         value="lowest" 
                         checked={formData.dlaMobilityRate === 'lowest'}
                         onChange={(e) => handleInputChange('dlaMobilityRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Lowest Rate (£28.70)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="dlaMobilityRate" 
                         value="highest" 
                         checked={formData.dlaMobilityRate === 'highest'}
                         onChange={(e) => handleInputChange('dlaMobilityRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Highest Rate (£75.75)
                     </label>
                   </div>
                 </div>
               )}

               {/* AA Rates - only show if claiming AA */}
               {formData.claimsDisabilityBenefits === 'yes' && formData.disabilityBenefitType === 'aa' && (
                 <div className="form-group">
                   <label>Attendance Allowance Rate</label>
                   <div className="radio-group">
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="aaRate" 
                         value="none" 
                         checked={formData.aaRate === 'none'}
                         onChange={(e) => handleInputChange('aaRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       No award
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="aaRate" 
                         value="lower" 
                         checked={formData.aaRate === 'lower'}
                         onChange={(e) => handleInputChange('aaRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Lower Rate (£72.65)
                     </label>
                     <label className="radio-label">
                       <input 
                         type="radio" 
                         name="aaRate" 
                         value="higher" 
                         checked={formData.aaRate === 'higher'}
                         onChange={(e) => handleInputChange('aaRate', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       Higher Rate (£108.55)
                     </label>
                   </div>
                 </div>
               )}

              {/* LCWRA Status */}
              <div className="form-group">
                <label>Do you qualify for Limited Capability for Work and Work-Related Activity (LCWRA)?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="hasLCWRA" 
                      value="yes" 
                      checked={formData.hasLCWRA === 'yes'}
                      onChange={(e) => handleInputChange('hasLCWRA', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    Yes
                  </label>
                                     <label className={`radio-label ${formData.hasLCWRA === 'no' ? 'default-option' : ''}`}>
                     <input 
                       type="radio" 
                       name="hasLCWRA" 
                       value="no" 
                       checked={formData.hasLCWRA === 'no'}
                       onChange={(e) => handleInputChange('hasLCWRA', e.target.value)}
                     />
                     <span className="radio-custom"></span>
                     <span>No</span>
                   </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="hasLCWRA" 
                      value="waiting" 
                      checked={formData.hasLCWRA === 'waiting'}
                      onChange={(e) => handleInputChange('hasLCWRA', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    Waiting for assessment
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Minimum Income Floor Alert */}
          {((formData.employmentType === 'self-employed' && formData.circumstances === 'single') ||
           (formData.circumstances === 'couple' && ((formData.employmentType === 'self-employed' && formData.partnerEmploymentType !== 'self-employed') || (formData.employmentType !== 'self-employed' && formData.partnerEmploymentType === 'self-employed')))) && (
            <div className="alert alert-info mif-alert" role="alert">
              <strong>You might be affected by the Minimum Income Floor.</strong> Continue through the calculator and we'll tell you about it on the results page.
              <br /><br />
              {getTextValue('MIF.SelfEmploymentAccounts.Info', 'Self-employed people have to fill in a monthly form to report their income to DWP. Our new self-employment accounts can help fill in this form and also ensure you claim all relevant allowances in Universal Credit. We can even help you fill out your annual income tax self-assessment form. Go to our self-employment accounts page to see how we can help and to sign up for the new service.')}
              <br /><br />
              <a href="/self-employment-accounts" className="btn btn-primary btn-sm">Go to Self-Employment Accounts</a>
            </div>
          )}
        </div>

        {/* Employment and Disability Section - Partner (only show if couple) */}
        {formData.circumstances === 'couple' && (
          <div className="employment-disability-section">
            <h3>Employment and Disability - Partner</h3>
            
            <div className="form-group">
              <label>Partner's Employment Status</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="partnerEmploymentType" 
                    value="not_working" 
                    checked={formData.partnerEmploymentType === 'not_working'}
                    onChange={(e) => handleInputChange('partnerEmploymentType', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Not Working
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="partnerEmploymentType" 
                    value="employed" 
                    checked={formData.partnerEmploymentType === 'employed'}
                    onChange={(e) => handleInputChange('partnerEmploymentType', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Employed
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="partnerEmploymentType" 
                    value="self-employed" 
                    checked={formData.partnerEmploymentType === 'self-employed'}
                    onChange={(e) => handleInputChange('partnerEmploymentType', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Self-employed
                </label>
              </div>
            </div>

            {/* Show partner employment fields only if working */}
            {(formData.partnerEmploymentType === 'employed' || formData.partnerEmploymentType === 'self-employed') && (
              <>
                <div className="form-group">
                  <label htmlFor="partnerMonthlyEarnings">Partner's Monthly Earnings</label>
                  <div className="input-with-prefix">
                    <span className="prefix">£</span>
                    <input 
                      type="number" 
                      id="partnerMonthlyEarnings" 
                      className="form-control" 
                      min="0" 
                      step="0.01" 
                      value={formData.partnerMonthlyEarnings}
                      onChange={(e) => handleInputChange('partnerMonthlyEarnings', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                         {/* Partner Pension Contributions - only show for employed */}
         {formData.partnerEmploymentType === 'employed' && (
           <div className="form-group">
             <label>Partner's Pension Contributions</label>
             <div className="radio-group">
               <label className={`radio-label ${formData.partnerPensionType === 'amount' ? 'default-option' : ''}`}>
                 <input
                   type="radio"
                   name="partnerPensionType"
                   value="amount"
                   checked={formData.partnerPensionType === 'amount'}
                   onChange={(e) => handleInputChange('partnerPensionType', e.target.value)}
                 />
                 <span className="radio-custom"></span>
                 <span>Fixed Amount</span>
               </label>
               <label className="radio-label">
                 <input
                   type="radio"
                   name="partnerPensionType"
                   value="percentage"
                   checked={formData.partnerPensionType === 'percentage'}
                   onChange={(e) => handleInputChange('partnerPensionType', e.target.value)}
                 />
                 <span className="radio-custom"></span>
                 <span>Percentage of Gross</span>
               </label>
             </div>

                           {formData.partnerPensionType === 'amount' && (
                <div className="form-group">
                  <label htmlFor="partnerPensionAmount">Partner's Pension Amount (per month)</label>
                  <div className="input-with-prefix">
                    <span className="prefix">£</span>
                    <input
                      type="number"
                      id="partnerPensionAmount"
                      className="form-control"
                      min="0"
                      step="0.01"
                      value={formData.partnerPensionAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleInputChange('partnerPensionAmount', 0);
                        } else {
                          handleInputChange('partnerPensionAmount', parseFloat(value) || 0);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

                           {formData.partnerPensionType === 'percentage' && (
                <div className="form-group">
                  <label htmlFor="partnerPensionPercentage">Partner's Pension Percentage</label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="partnerPensionPercentage"
                      className="form-control"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.partnerPensionPercentage || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleInputChange('partnerPensionPercentage', 0);
                        } else {
                          handleInputChange('partnerPensionPercentage', parseFloat(value) || 0);
                        }
                      }}
                    />
                    <span className="suffix">%</span>
                  </div>
                  {formData.partnerMonthlyEarnings > 0 && (
                    <div className="help-text">
                      {formData.partnerPensionPercentage}% of £{formData.partnerMonthlyEarnings.toLocaleString()} = £{((formData.partnerMonthlyEarnings * formData.partnerPensionPercentage) / 100).toFixed(2)} per month
                    </div>
                  )}
                </div>
              )}
           </div>
         )}
              </>
            )}

            {/* Partner Disability Status */}
            <div className="form-group">
              <label>Is your partner sick or disabled?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="partnerIsDisabled" 
                    value="yes" 
                    checked={formData.partnerIsDisabled === 'yes'}
                    onChange={(e) => handleInputChange('partnerIsDisabled', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Yes
                </label>
                <label className={`radio-label ${formData.partnerIsDisabled === 'no' ? 'default-option' : ''}`}>
                  <input 
                    type="radio" 
                    name="partnerIsDisabled" 
                    value="no" 
                    checked={formData.partnerIsDisabled === 'no'}
                    onChange={(e) => handleInputChange('partnerIsDisabled', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Partner Disability Benefits - only show if disabled */}
            {formData.partnerIsDisabled === 'yes' && (
              <>
                <div className="form-group">
                  <label>Does your partner claim disability benefits?</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="partnerClaimsDisabilityBenefits" 
                        value="yes" 
                        checked={formData.partnerClaimsDisabilityBenefits === 'yes'}
                        onChange={(e) => handleInputChange('partnerClaimsDisabilityBenefits', e.target.value)}
                      />
                      <span className="radio-custom"></span>
                      Yes
                    </label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="partnerClaimsDisabilityBenefits" 
                        value="no" 
                        checked={formData.partnerClaimsDisabilityBenefits === 'no'}
                        onChange={(e) => handleInputChange('partnerClaimsDisabilityBenefits', e.target.value)}
                      />
                      <span className="radio-custom"></span>
                      No
                    </label>
                  </div>
                </div>

                                 {/* Partner Disability Benefit Type - only show if claiming */}
                 {formData.partnerClaimsDisabilityBenefits === 'yes' && (
                   <div className="form-group">
                     <label>What disability benefit does your partner claim?</label>
                     <div className="radio-group">
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDisabilityBenefitType" 
                           value="pip" 
                           checked={formData.partnerDisabilityBenefitType === 'pip'}
                           onChange={(e) => handleInputChange('partnerDisabilityBenefitType', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Personal Independence Payment (PIP)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDisabilityBenefitType" 
                           value="dla" 
                           checked={formData.partnerDisabilityBenefitType === 'dla'}
                           onChange={(e) => handleInputChange('partnerDisabilityBenefitType', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Disability Living Allowance (DLA)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDisabilityBenefitType" 
                           value="aa" 
                           checked={formData.partnerDisabilityBenefitType === 'aa'}
                           onChange={(e) => handleInputChange('partnerDisabilityBenefitType', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Attendance Allowance (AA)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDisabilityBenefitType" 
                           value="other" 
                           checked={formData.partnerDisabilityBenefitType === 'other'}
                           onChange={(e) => handleInputChange('partnerDisabilityBenefitType', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Other
                       </label>
                     </div>
                   </div>
                 )}

                 {/* Partner PIP Rates - only show if claiming PIP */}
                 {formData.partnerClaimsDisabilityBenefits === 'yes' && formData.partnerDisabilityBenefitType === 'pip' && (
                   <div className="form-group">
                     <label>Partner's PIP Daily Living Component Rate</label>
                     <div className="radio-group">
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerPipDailyLivingRate" 
                           value="none" 
                           checked={formData.partnerPipDailyLivingRate === 'none'}
                           onChange={(e) => handleInputChange('partnerPipDailyLivingRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         No award
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerPipDailyLivingRate" 
                           value="standard" 
                           checked={formData.partnerPipDailyLivingRate === 'standard'}
                           onChange={(e) => handleInputChange('partnerPipDailyLivingRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Standard Rate (£72.65)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerPipDailyLivingRate" 
                           value="enhanced" 
                           checked={formData.partnerPipDailyLivingRate === 'enhanced'}
                           onChange={(e) => handleInputChange('partnerPipDailyLivingRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Enhanced Rate (£108.55)
                       </label>
                     </div>
                   </div>
                 )}

                 {formData.partnerClaimsDisabilityBenefits === 'yes' && formData.partnerDisabilityBenefitType === 'pip' && (
                   <div className="form-group">
                     <label>Partner's PIP Mobility Component Rate</label>
                     <div className="radio-group">
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerPipMobilityRate" 
                           value="none" 
                           checked={formData.partnerPipMobilityRate === 'none'}
                           onChange={(e) => handleInputChange('partnerPipMobilityRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         No award
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerPipMobilityRate" 
                           value="standard" 
                           checked={formData.partnerPipMobilityRate === 'standard'}
                           onChange={(e) => handleInputChange('partnerPipMobilityRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Standard Rate (£28.70)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerPipMobilityRate" 
                           value="enhanced" 
                           checked={formData.partnerPipMobilityRate === 'enhanced'}
                           onChange={(e) => handleInputChange('partnerPipMobilityRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Enhanced Rate (£75.75)
                       </label>
                     </div>
                   </div>
                 )}

                 {/* Partner DLA Rates - only show if claiming DLA */}
                 {formData.partnerClaimsDisabilityBenefits === 'yes' && formData.partnerDisabilityBenefitType === 'dla' && (
                   <div className="form-group">
                     <label>Partner's DLA Care Component Rate</label>
                     <div className="radio-group">
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDlaCareRate" 
                           value="none" 
                           checked={formData.partnerDlaCareRate === 'none'}
                           onChange={(e) => handleInputChange('partnerDlaCareRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         No award
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDlaCareRate" 
                           value="lowest" 
                           checked={formData.partnerDlaCareRate === 'lowest'}
                           onChange={(e) => handleInputChange('partnerDlaCareRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Lowest Rate (£28.70)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDlaCareRate" 
                           value="middle" 
                           checked={formData.partnerDlaCareRate === 'middle'}
                           onChange={(e) => handleInputChange('partnerDlaCareRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Middle Rate (£72.65)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDlaCareRate" 
                           value="highest" 
                           checked={formData.partnerDlaCareRate === 'highest'}
                           onChange={(e) => handleInputChange('partnerDlaCareRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Highest Rate (£108.55)
                       </label>
                     </div>
                   </div>
                 )}

                 {formData.partnerClaimsDisabilityBenefits === 'yes' && formData.partnerDisabilityBenefitType === 'dla' && (
                   <div className="form-group">
                     <label>Partner's DLA Mobility Component Rate</label>
                     <div className="radio-group">
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDlaMobilityRate" 
                           value="none" 
                           checked={formData.partnerDlaMobilityRate === 'none'}
                           onChange={(e) => handleInputChange('partnerDlaMobilityRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         No award
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDlaMobilityRate" 
                           value="lowest" 
                           checked={formData.partnerDlaMobilityRate === 'lowest'}
                           onChange={(e) => handleInputChange('partnerDlaMobilityRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Lowest Rate (£28.70)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerDlaMobilityRate" 
                           value="highest" 
                           checked={formData.partnerDlaMobilityRate === 'highest'}
                           onChange={(e) => handleInputChange('partnerDlaMobilityRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Highest Rate (£75.75)
                       </label>
                     </div>
                   </div>
                 )}

                 {/* Partner AA Rates - only show if claiming AA */}
                 {formData.partnerClaimsDisabilityBenefits === 'yes' && formData.partnerDisabilityBenefitType === 'aa' && (
                   <div className="form-group">
                     <label>Partner's Attendance Allowance Rate</label>
                     <div className="radio-group">
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerAaRate" 
                           value="none" 
                           checked={formData.partnerAaRate === 'none'}
                           onChange={(e) => handleInputChange('partnerAaRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         No award
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerAaRate" 
                           value="lower" 
                           checked={formData.partnerAaRate === 'lower'}
                           onChange={(e) => handleInputChange('partnerAaRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Lower Rate (£72.65)
                       </label>
                       <label className="radio-label">
                         <input 
                           type="radio" 
                           name="partnerAaRate" 
                           value="higher" 
                           checked={formData.partnerAaRate === 'higher'}
                           onChange={(e) => handleInputChange('partnerAaRate', e.target.value)}
                         />
                         <span className="radio-custom"></span>
                         Higher Rate (£108.55)
                       </label>
                     </div>
                   </div>
                 )}

                {/* Partner LCWRA Status */}
                <div className="form-group">
                  <label>Does your partner qualify for Limited Capability for Work and Work-Related Activity (LCWRA)?</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="partnerHasLCWRA" 
                        value="yes" 
                        checked={formData.partnerHasLCWRA === 'yes'}
                        onChange={(e) => handleInputChange('partnerHasLCWRA', e.target.value)}
                      />
                      <span className="radio-custom"></span>
                      Yes
                    </label>
                                         <label className={`radio-label ${formData.partnerHasLCWRA === 'no' ? 'default-option' : ''}`}>
                       <input 
                         type="radio" 
                         name="partnerHasLCWRA" 
                         value="no" 
                         checked={formData.partnerHasLCWRA === 'no'}
                         onChange={(e) => handleInputChange('partnerHasLCWRA', e.target.value)}
                       />
                       <span className="radio-custom"></span>
                       <span>No</span>
                     </label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="partnerHasLCWRA" 
                        value="waiting" 
                        checked={formData.partnerHasLCWRA === 'waiting'}
                        onChange={(e) => handleInputChange('partnerHasLCWRA', e.target.value)}
                      />
                      <span className="radio-custom"></span>
                      Waiting for assessment
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Children Section */}
        <div className="form-group">
          <label>Do you have children?</label>
          <div className="radio-group">
            <label className={`radio-label ${!formData.hasChildren ? 'default-option' : ''}`}>
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
                  handleInputChange('childGenders', []);
                }}
              />
              <span className="radio-custom"></span>
              <span>No Children</span>
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
                 onChange={(e) => {
                   const value = e.target.value;
                   if (value === '') {
                     // Allow empty input while typing
                     handleInputChange('children', '');
                   } else {
                     const numValue = parseInt(value);
                     if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
                       handleInputChange('children', numValue);
                     }
                   }
                 }}
                 onBlur={(e) => {
                   // Ensure minimum value when input loses focus
                   const value = e.target.value;
                   if (value === '' || parseInt(value) < 1) {
                     handleInputChange('children', 1);
                   }
                 }}
               />
             </div>

             <div className="form-group">
               <label htmlFor="childcareCosts">Monthly Childcare Costs</label>
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
               <div className="help-text">
                 Enter the total monthly cost of childcare for all your children. Universal Credit can help with up to 85% of childcare costs.
               </div>
             </div>

            {/* Individual child information - grouped by child */}
            <div className="form-group">
              <label>Information for Each Child</label>
              {Array.from({ length: Math.max(1, formData.children || 1) }, (_, index) => (
                <div key={index} className="child-section" style={{ 
                  border: '1px solid #ddd', 
                  padding: '20px', 
                  marginBottom: '20px', 
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h4 style={{ marginTop: '0', marginBottom: '20px', color: '#333' }}>Child {index + 1}</h4>
                  
                  {/* Child's Age */}
                  <div className="form-group">
                    <label htmlFor={`childAge${index}`}>Age:</label>
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
                  
                  {/* Child's Gender - only show if renting and 2+ children */}
                  {formData.housingStatus === 'renting' && formData.children >= 2 && (
                    <>
                      <div className="info-box" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '4px' }}>
                        <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
                          We need to know the gender of your children to calculate the correct bedroom entitlement for Local Housing Allowance. Children of the same gender or under 10 years old can share a bedroom.
                        </p>
                      </div>
                      <div className="form-group">
                        <label>Child {index + 1} Gender</label>
                        <div className="radio-group">
                          <label className="radio-label">
                            <input 
                              type="radio" 
                              name={`childGender${index}`} 
                              value="male" 
                              checked={formData.childGenders[index] === 'male'}
                              onChange={(e) => {
                                const newChildGenders = [...(formData.childGenders || [])];
                                newChildGenders[index] = e.target.value;
                                handleInputChange('childGenders', newChildGenders);
                              }}
                            />
                            <span className="radio-custom"></span>
                            Male
                          </label>
                          <label className="radio-label">
                            <input 
                              type="radio" 
                              name={`childGender${index}`} 
                              value="female" 
                              checked={formData.childGenders[index] === 'female'}
                              onChange={(e) => {
                                const newChildGenders = [...(formData.childGenders || [])];
                                newChildGenders[index] = e.target.value;
                                handleInputChange('childGenders', newChildGenders);
                              }}
                            />
                            <span className="radio-custom"></span>
                            Female
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                  
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
                          <label className={`radio-label ${formData.isCarer === 'no' ? 'default-option' : ''}`}>
              <input 
                type="radio" 
                name="isCarer" 
                value="no" 
                checked={formData.isCarer === 'no'}
                onChange={(e) => handleInputChange('isCarer', e.target.value)}
              />
              <span className="radio-custom"></span>
              <span>No</span>
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
                <label className={`radio-label ${formData.isPartnerCarer === 'no' ? 'default-option' : ''}`}>
                  <input 
                    type="radio" 
                    name="isPartnerCarer" 
                    value="no" 
                    checked={formData.isPartnerCarer === 'no'}
                    onChange={(e) => handleInputChange('isPartnerCarer', e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  <span>No</span>
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
           <label>Do you receive any other benefits?</label>
           <div className="radio-group">
             <label className={`radio-label ${formData.hasOtherBenefits === 'no' ? 'default-option' : ''}`}>
               <input 
                 type="radio" 
                 name="hasOtherBenefits" 
                 value="no" 
                 checked={formData.hasOtherBenefits === 'no'}
                 onChange={(e) => handleInputChange('hasOtherBenefits', e.target.value)}
               />
               <span className="radio-custom"></span>
               <span>No</span>
             </label>
             <label className="radio-label">
               <input 
                 type="radio" 
                 name="hasOtherBenefits" 
                 value="yes" 
                 checked={formData.hasOtherBenefits === 'yes'}
                 onChange={(e) => handleInputChange('hasOtherBenefits', e.target.value)}
               />
               <span className="radio-custom"></span>
               <span>Yes</span>
             </label>
           </div>
         </div>

         {/* Show other benefits list only if user selects yes */}
         {formData.hasOtherBenefits === 'yes' && (
           <div className="form-group">
             <label>Select the benefits you receive:</label>
             <div className="checkbox-group">
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="child_benefit" 
                   checked={formData.otherBenefitsList?.includes('child_benefit')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Child Benefit</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="housing_benefit" 
                   checked={formData.otherBenefitsList?.includes('housing_benefit')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Housing Benefit</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="council_tax_reduction" 
                   checked={formData.otherBenefitsList?.includes('council_tax_reduction')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Council Tax Reduction</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="carers_allowance" 
                   checked={formData.otherBenefitsList?.includes('carers_allowance')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Carer's Allowance</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="employment_support_allowance" 
                   checked={formData.otherBenefitsList?.includes('employment_support_allowance')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Employment and Support Allowance (ESA)</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="jobseekers_allowance" 
                   checked={formData.otherBenefitsList?.includes('jobseekers_allowance')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Jobseeker's Allowance (JSA)</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="income_support" 
                   checked={formData.otherBenefitsList?.includes('income_support')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Income Support</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="pension_credit" 
                   checked={formData.otherBenefitsList?.includes('pension_credit')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Pension Credit</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="working_tax_credit" 
                   checked={formData.otherBenefitsList?.includes('working_tax_credit')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Working Tax Credit</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="child_tax_credit" 
                   checked={formData.otherBenefitsList?.includes('child_tax_credit')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Child Tax Credit</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="maternity_allowance" 
                   checked={formData.otherBenefitsList?.includes('maternity_allowance')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Maternity Allowance</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="statutory_sick_pay" 
                   checked={formData.otherBenefitsList?.includes('statutory_sick_pay')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Statutory Sick Pay (SSP)</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="statutory_maternity_pay" 
                   checked={formData.otherBenefitsList?.includes('statutory_maternity_pay')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Statutory Maternity Pay (SMP)</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="statutory_paternity_pay" 
                   checked={formData.otherBenefitsList?.includes('statutory_paternity_pay')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Statutory Paternity Pay (SPP)</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="statutory_adoption_pay" 
                   checked={formData.otherBenefitsList?.includes('statutory_adoption_pay')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Statutory Adoption Pay (SAP)</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="bereavement_benefits" 
                   checked={formData.otherBenefitsList?.includes('bereavement_benefits')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Bereavement Benefits</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="industrial_injuries" 
                   checked={formData.otherBenefitsList?.includes('industrial_injuries')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Industrial Injuries Disablement Benefit</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="war_pension" 
                   checked={formData.otherBenefitsList?.includes('war_pension')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>War Pension</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="armed_forces_compensation" 
                   checked={formData.otherBenefitsList?.includes('armed_forces_compensation')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Armed Forces Compensation Scheme</span>
               </label>
               <label className="checkbox-label">
                 <input 
                   type="checkbox" 
                   name="otherBenefitsList" 
                   value="other" 
                   checked={formData.otherBenefitsList?.includes('other')}
                   onChange={(e) => {
                     const currentList = formData.otherBenefitsList || [];
                     if (e.target.checked) {
                       handleInputChange('otherBenefitsList', [...currentList, e.target.value]);
                     } else {
                       handleInputChange('otherBenefitsList', currentList.filter(benefit => benefit !== e.target.value));
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>Other (please specify)</span>
               </label>
             </div>
           </div>
         )}

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
