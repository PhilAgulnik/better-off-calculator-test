import React, { useState, useEffect } from 'react';
import { useTextManager } from '../hooks/useTextManager';

function CarerModule({ 
  formData, 
  onFormChange, 
  isPartner = false, 
  isScotland = false, 
  isUniversalCredit = true,
  earningsBelowLimit = true 
}) {
  const [showCarerQuestions, setShowCarerQuestions] = useState(false);
  const [showEligibilityQuestions, setShowEligibilityQuestions] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  // const [estimatedAmount, setEstimatedAmount] = useState(0);

  const { getTextValue } = useTextManager();

  // const prefix = isPartner ? 'partner' : '';
  const carerKey = isPartner ? 'isPartnerCarer' : 'isCarer';
  const currentlyReceivingKey = isPartner ? 'partnerCurrentlyReceivingCarersAllowance' : 'currentlyReceivingCarersAllowance';
  const caringHoursKey = isPartner ? 'partnerCaringHours' : 'caringHours';
  const personReceivesBenefitsKey = isPartner ? 'partnerPersonReceivesBenefits' : 'personReceivesBenefits';
  const includeCarersAllowanceKey = isPartner ? 'partnerIncludeCarersAllowance' : 'includeCarersAllowance';
  const includeCarerElementKey = isPartner ? 'partnerIncludeCarerElement' : 'includeCarerElement';

  // Check if we should show carer questions
  useEffect(() => {
    const shouldShow = formData[carerKey] === 'yes';
    setShowCarerQuestions(shouldShow);
    
    if (shouldShow) {
      // Check if we should show eligibility questions
      const currentlyReceiving = formData[currentlyReceivingKey] === 'no';
      const shouldShowEligibility = currentlyReceiving && earningsBelowLimit;
      setShowEligibilityQuestions(shouldShowEligibility);
    } else {
      setShowEligibilityQuestions(false);
    }
  }, [formData, carerKey, currentlyReceivingKey, earningsBelowLimit]);

  // Check eligibility when relevant fields change
  useEffect(() => {
    if (showEligibilityQuestions) {
      const hours = parseInt(formData[caringHoursKey]) || 0;
      const receivesBenefits = formData[personReceivesBenefitsKey] === 'yes';
      const eligible = hours >= 35 && receivesBenefits;
             setIsEligible(eligible);
    }
  }, [formData, caringHoursKey, personReceivesBenefitsKey, showEligibilityQuestions]);

  const handleInputChange = (field, value) => {
    onFormChange(field, value);
  };

  const getBenefitName = () => {
    if (isScotland) {
      return isUniversalCredit ? 'Carer Support Payment' : 'Carer Support Payment';
    } else {
      return isUniversalCredit ? 'Carer\'s Allowance' : 'Carer\'s Allowance';
    }
  };

  const getPageHeading = () => {
    if (isUniversalCredit) {
      return isScotland 
        ? getTextValue('Carer.Allowance.Scotland.Title', 'Carer Support Payment and UC carer element eligibility check')
        : getTextValue('Carer.Allowance.Title', 'Carer\'s Allowance and UC carer element eligibility check');
    } else {
      return isScotland 
        ? getTextValue('Carer.Allowance.Scotland.Title', 'Carer Support Payment eligibility check')
        : getTextValue('Carer.Allowance.Title', 'Carer\'s Allowance eligibility check');
    }
  };

  const getEligibilityText = () => {
    const benefitName = getBenefitName();
    const earningsText = isUniversalCredit 
      ? getTextValue('Carer.Allowance.Eligibility.Earnings', '• For Carer\'s Allowance, have net earnings under an earnings limit (£151 a week); we have already checked that your earnings are under this level.')
      : getTextValue('Carer.Allowance.Eligibility.Earnings.Standalone', '• Have net earnings under an earnings limit (£151 a week); we have already checked that your earnings are under this level.');

    return (
      <div className="eligibility-text">
        <p>{getTextValue('Carer.Allowance.Eligibility.Intro', `If you care for someone who gets a disability benefit you may be entitled to ${benefitName}. To get ${benefitName} you must:`)}</p>
        <ul>
          <li>{getTextValue('Carer.Allowance.Eligibility.Hours', 'Spend at least 35 hours a week looking after the person in need of care')}</li>
          <li>{getTextValue('Carer.Allowance.Eligibility.Benefits', 'Look after someone who is claiming a qualifying disability benefit')}</li>
          <li>{earningsText}</li>
        </ul>
        <p>{getTextValue('Carer.Allowance.Eligibility.MoreInfo', `For more information see ${benefitName} eligibility rules.`)}</p>
        {isUniversalCredit && (
          <div className="info-box">
            <p>{getTextValue('Carer.Allowance.UC.InfoBox', `You will not be better off financially if you claim ${benefitName} and the Universal Credit carer element together because ${benefitName} counts as income when calculating your UC award. But you won't be worse off and claiming ${benefitName} gets you class 1 National Insurance credits, so if you are not getting class 1 credits another way, you may want to claim ${benefitName} as well.`)}</p>
          </div>
        )}
      </div>
    );
  };

  const getEligibilityMessage = () => {
    const benefitName = getBenefitName();
    const elementText = isUniversalCredit ? 'and the Universal Credit carer element' : '';
    
    return (
      <div className="eligibility-message info-box">
        <p>{getTextValue('Carer.Allowance.EligibilityMessage.Intro', `You meet the eligibility conditions for ${benefitName} ${elementText}. We have worked out the amount you are entitled to below. This might be an 'underlying entitlement' of £0 if you already get an 'overlapping benefit' but by claiming this you could also get a carer premium in other benefits you are entitled to.`)}</p>
        <p><strong>Important!</strong> {getTextValue('Carer.Allowance.EligibilityMessage.Important', `If the person you care for gets a 'Severe Disability premium' in any of their benefits, you getting ${benefitName} (unless it's an underlying entitlement) ${isUniversalCredit ? 'or the Universal Credit carer element' : ''} means they won't get that premium anymore. Before claiming you should discuss this with the person you are caring for and if you need to you can seek more advice.`)}</p>
      </div>
    );
  };

  if (!showCarerQuestions) {
    return null;
  }

  return (
    <div className="carer-module">
      <div className="card">
        <h3>{getPageHeading()}</h3>
        
        {getEligibilityText()}

                 {/* Currently receiving question */}
         <div className="form-group">
           <label>{getTextValue('Carer.Allowance.Questions.CurrentlyReceiving', `Do you currently receive ${getBenefitName()}?`)}</label>
           <div className="radio-group">
             <label className="radio-label">
               <input 
                 type="radio" 
                 name={currentlyReceivingKey}
                 value="yes" 
                 checked={formData[currentlyReceivingKey] === 'yes'}
                 onChange={(e) => handleInputChange(currentlyReceivingKey, e.target.value)}
               />
               <span className="radio-custom"></span>
               {getTextValue('Calculator.Form.Carer.Yes', 'Yes')}
             </label>
             <label className="radio-label">
               <input 
                 type="radio" 
                 name={currentlyReceivingKey}
                 value="no" 
                 checked={formData[currentlyReceivingKey] === 'no'}
                 onChange={(e) => handleInputChange(currentlyReceivingKey, e.target.value)}
               />
               <span className="radio-custom"></span>
               {getTextValue('Calculator.Form.Carer.No', 'No')}
             </label>
           </div>
         </div>

        {showEligibilityQuestions && (
          <>
                         {/* Caring hours question */}
             <div className="form-group">
               <label>{getTextValue('Carer.Allowance.Questions.CaringHours', 'How many hours a week do you spend caring?')}</label>
               <div className="radio-group">
                 <label className="radio-label">
                   <input 
                     type="radio" 
                     name={caringHoursKey}
                     value="0" 
                     checked={formData[caringHoursKey] === '0'}
                     onChange={(e) => handleInputChange(caringHoursKey, e.target.value)}
                   />
                   <span className="radio-custom"></span>
                   {getTextValue('Carer.Allowance.Questions.CaringHours.Less35', 'Less than 35 hours')}
                 </label>
                 <label className="radio-label">
                   <input 
                     type="radio" 
                     name={caringHoursKey}
                     value="35" 
                     checked={formData[caringHoursKey] === '35'}
                     onChange={(e) => handleInputChange(caringHoursKey, e.target.value)}
                   />
                   <span className="radio-custom"></span>
                   {getTextValue('Carer.Allowance.Questions.CaringHours.35Plus', '35 hours or more')}
                 </label>
               </div>
             </div>

                         {/* Person receives benefits question */}
             <div className="form-group">
               <label>{getTextValue('Carer.Allowance.Questions.PersonBenefits', 'Does the person you care for receive one of the following benefits?')}</label>
               <div className="help-text">
                 <p>{getTextValue('Carer.Allowance.Questions.PersonBenefits.Help', 'Qualifying benefits include:')}</p>
                 <ul>
                   <li>Personal Independence Payment (PIP) - daily living component</li>
                   <li>Disability Living Allowance (DLA) - middle or highest care rate</li>
                   <li>Attendance Allowance</li>
                   <li>Armed Forces Independence Payment</li>
                   <li>Constant Attendance Allowance</li>
                 </ul>
               </div>
               <div className="radio-group">
                 <label className="radio-label">
                   <input 
                     type="radio" 
                     name={personReceivesBenefitsKey}
                     value="yes" 
                     checked={formData[personReceivesBenefitsKey] === 'yes'}
                     onChange={(e) => handleInputChange(personReceivesBenefitsKey, e.target.value)}
                   />
                   <span className="radio-custom"></span>
                   {getTextValue('Calculator.Form.Carer.Yes', 'Yes')}
                 </label>
                 <label className="radio-label">
                   <input 
                     type="radio" 
                     name={personReceivesBenefitsKey}
                     value="no" 
                     checked={formData[personReceivesBenefitsKey] === 'no'}
                     onChange={(e) => handleInputChange(personReceivesBenefitsKey, e.target.value)}
                   />
                   <span className="radio-custom"></span>
                   {getTextValue('Calculator.Form.Carer.No', 'No')}
                 </label>
               </div>
             </div>

            {/* Eligibility message */}
            {isEligible && getEligibilityMessage()}

                         {/* Include Carer's Allowance question */}
             {isEligible && (
               <div className="form-group">
                 <label>{getTextValue('Carer.Allowance.Questions.IncludeInCalculation', `Should we include ${getBenefitName()} in your benefit calculation?`)}</label>
                 <div className="help-text">
                                       <p>{getTextValue('Carer.Allowance.EstimatedAmount', `Estimated entitlement to ${getBenefitName()} (weekly): £81.90`)}</p>
                 </div>
                 <div className="radio-group">
                   <label className="radio-label">
                     <input 
                       type="radio" 
                       name={includeCarersAllowanceKey}
                       value="yes" 
                       checked={formData[includeCarersAllowanceKey] === 'yes'}
                       onChange={(e) => handleInputChange(includeCarersAllowanceKey, e.target.value)}
                     />
                     <span className="radio-custom"></span>
                     {getTextValue('Calculator.Form.Carer.Yes', 'Yes')}
                   </label>
                   <label className="radio-label">
                     <input 
                       type="radio" 
                       name={includeCarersAllowanceKey}
                       value="no" 
                       checked={formData[includeCarersAllowanceKey] === 'no'}
                       onChange={(e) => handleInputChange(includeCarersAllowanceKey, e.target.value)}
                     />
                     <span className="radio-custom"></span>
                     {getTextValue('Calculator.Form.Carer.No', 'No')}
                   </label>
                 </div>
               </div>
             )}

                         {/* Include UC Carer Element question (only for UC calculations) */}
             {isEligible && isUniversalCredit && (
               <div className="form-group">
                 <label>{getTextValue('Carer.Allowance.Questions.IncludeCarerElement', 'Should we calculate your Universal Credit including a carer element?')}</label>
                 <div className="radio-group">
                   <label className="radio-label">
                     <input 
                       type="radio" 
                       name={includeCarerElementKey}
                       value="yes" 
                       checked={formData[includeCarerElementKey] === 'yes'}
                       onChange={(e) => handleInputChange(includeCarerElementKey, e.target.value)}
                     />
                     <span className="radio-custom"></span>
                     {getTextValue('Calculator.Form.Carer.Yes', 'Yes')}
                   </label>
                   <label className="radio-label">
                     <input 
                       type="radio" 
                       name={includeCarerElementKey}
                       value="no" 
                       checked={formData[includeCarerElementKey] === 'no'}
                       onChange={(e) => handleInputChange(includeCarerElementKey, e.target.value)}
                     />
                     <span className="radio-custom"></span>
                     {getTextValue('Calculator.Form.Carer.No', 'No')}
                   </label>
                 </div>
               </div>
             )}
          </>
        )}
      </div>
    </div>
  );
}

export default CarerModule;
