# Import API Alignment Report
## Comparison between UC Calculator and EntitledTo ImportAPI

**Generated:** 2025-10-23
**Purpose:** Analyze variable and naming convention differences between the current UC Calculator and the EntitledTo ImportAPI specification (v1.2)

---

## Missing Variables - Quick Reference

### Complete List of ImportAPI Fields NOT Collected in Current UC Calculator

#### **HOUSEHOLD SECTION**
- ❌ `household.Postcode` - UK postcode (required for BRMA lookup)
- ❌ `household.RentPeriod` - Enum: Yearly(0), Monthly(1), Weekly(2), FourWeekly(3)
- ❌ `household.RentFreeWeeks` - Number of rent-free weeks per year
- ❌ `household.DependantCount` - Number of non-dependant adults
- ❌ `household.OtherResident` - Type of other occupants enum
- ❌ `household.BritishIrishCitizen` - Boolean eligibility flag
- ❌ `household.HospPrisionerAbroadStudentFlag` - Boolean exclusion flag
- ❌ `household.CalcUniversalCredit` - Boolean to enable UC calculation
- ❌ `household.Email` - Email contact preference
- ❌ `household.Mobile` - Mobile contact preference
- ❌ `household.SubcompanyName` - Multi-tenancy identifier
- ❌ `household.CaseIndentifier` - CRM case reference
- ❌ `household.SecurityToken` - API authentication token
- ❌ `household.ReturnUrl` - Callback URL after calculation
- ❌ `household.ResultsServiceUrl` - Webhook URL for results

#### **CLIENT AGE & DISABILITY**
- ❌ `clientAgeDisability.DateOfBirth` - Date of birth (ISO format)
- ❌ `clientAgeDisability.Gender` - Enum: female(0), male(1)
- ❌ `clientAgeDisability.WeeklyWorkHours` - Hours worked per week
- ❌ `clientAgeDisability.DisabilitySicknessBenefit` - Enum: NotClaimed(0), CurrentlyClaiming(1), RecentlyClaimed(3)
- ❌ `clientAgeDisability.DailyLivingActivities` - Boolean for daily living difficulties
- ❌ `clientAgeDisability.MobilityActivities` - Boolean for mobility difficulties
- ❌ `clientAgeDisability.ESAPhase` - ESA phase enum: WorkRelated(1), Support(2)
- ❌ `clientAgeDisability.ESAMainPhaseComponent` - ESA component type
- ❌ `clientAgeDisability.RegisteredBlind` - Boolean blind registration status
- ❌ `clientAgeDisability.OutOfWorkBenefit` - Out of work benefit enum
- ❌ `clientAgeDisability.WorkStatus` - Full employment status enum (more detailed than current)

#### **PARTNER AGE & DISABILITY**
- ❌ `partnerAgeDisability.DateOfBirth` - Partner date of birth
- ❌ `partnerAgeDisability.Gender` - Partner gender enum
- ❌ `partnerAgeDisability.WeeklyWorkHours` - Partner work hours
- ❌ `partnerAgeDisability.DisabilitySicknessBenefit` - Partner disability benefit status
- ❌ `partnerAgeDisability.DailyLivingActivities` - Partner daily living difficulties
- ❌ `partnerAgeDisability.MobilityActivities` - Partner mobility difficulties
- ❌ `partnerAgeDisability.ESAPhase` - Partner ESA phase
- ❌ `partnerAgeDisability.ESAMainPhaseComponent` - Partner ESA component
- ❌ `partnerAgeDisability.RegisteredBlind` - Partner blind registration
- ❌ `partnerAgeDisability.OutOfWorkBenefit` - Partner out of work benefit
- ❌ `partnerAgeDisability.WorkStatus` - Partner employment status

#### **CLIENT EARNINGS**
- ❌ `clientEarnings.GrossPayFreq` - Payment frequency enum
- ❌ `clientEarnings.PensionContributionsPeriod` - Pension payment period enum
- ❌ `clientEarnings.NetEarningsPeriod` - Net earnings period enum
- ❌ `clientEarnings.EarningsFromPermittedWork` - Boolean for permitted work

#### **PARTNER EARNINGS**
- ❌ `partnerEarnings.GrossPayFreq` - Partner payment frequency
- ❌ `partnerEarnings.PensionContributionsPeriod` - Partner pension period
- ❌ `partnerEarnings.NetEarningsPeriod` - Partner net earnings period
- ❌ `partnerEarnings.EarningsFromPermittedWork` - Partner permitted work flag

#### **BENEFITS STRUCTURE**
- ❌ `clientBenefits[]` - Array structure with BenefitType, BenefitValue, calcPeriod, BenefitOption
- ❌ `partnerBenefits[]` - Same array structure for partner
- ⚠️ Current calculator collects benefit types but not as structured array with amounts/periods

**Missing Benefit Tracking:**
- ❌ Specific benefit amounts per type
- ❌ Benefit payment periods
- ❌ Multiple benefits tracking (currently simplified)
- ❌ Benefit options/variations

#### **CHILDREN ARRAY**
- ❌ `Children[].DateOfBirth` - Each child's date of birth (currently only age)
- ❌ `Children[].ChildCarePeriod` - Childcare payment period per child
- ❌ `Children[].childBenefits[]` - Array of benefit enums per child
- ⚠️ Current uses parallel arrays; API uses array of objects

#### **CAPABILITY (Disability Assessment)**
- ❌ `Capability.DisabilityAffectWork` - Boolean work capability
- ❌ `Capability.ExtraUniversalCredit` - Extra rate enum: None(1), Lower(2), Higher(3)
- ❌ `Capability.ClaimPostApril2017` - Boolean for claim date
- ❌ `Capability.PartnerDisabilityAffectWork` - Partner work capability
- ❌ `Capability.PartnerExtraUniversalCredit` - Partner extra rate
- ❌ `Capability.PartnerClaimPostApril2017` - Partner claim date

#### **OUT OF WORK BENEFITS**
- ❌ `OutOfWorkBenefits.SeekingWork` - Boolean job seeking status
- ❌ `OutOfWorkBenefits.Period26WeekWorked` - Boolean 26-week work history
- ❌ `OutOfWorkBenefits.PartnerSupport` - Partner support amount
- ❌ `OutOfWorkBenefits.PartnerSeekingWork` - Partner job seeking
- ❌ `OutOfWorkBenefits.PartnerPeriod26WeekWorked` - Partner work history

#### **COUNCIL TAX (Full Section Missing)**
- ❌ `CouncilTax.LocalAuthority` - Local authority name
- ❌ `CouncilTax.Band` - Council tax band enum (A-H)
- ❌ `CouncilTax.DisabilityReduction` - Disability reduction flag
- ❌ `CouncilTax.DiscountsApplicable` - Discount percentage enum
- ❌ `CouncilTax.CouncilTaxLiability` - Annual liability amount
- ❌ `CouncilTax.CorrectTaxAmount` - Verification flag
- ❌ `CouncilTax.CouncilTaxLiabilityAfterDiscount` - Post-discount amount
- ❌ `CouncilTax.PaymentPeriod` - Payment period enum

#### **NET INCOME**
- ❌ `NetIncome.NonStatePension.Has` - Boolean for non-state pension
- ❌ `NetIncome.NonStatePension.Pensions[]` - Array of pension details
- ❌ `NetIncome.Income[]` - Array of income types (ChildBenefit, Spousal, Charity, SubTenants, Other)
- ❌ `NetIncome.SubTenantCount` - Number of sub-tenants
- ❌ `NetIncome.Student.Responsible` - Student grant status
- ❌ `NetIncome.Student.Amount` - Grant amount
- ❌ `NetIncome.Student.Period` - Grant period
- ❌ `NetIncome.OtherProperty` - Boolean for additional property
- ❌ `NetIncome.IncomeFromOtherSources` - Other income amount
- ❌ `NetIncome.IncomeFromOtherSourcesPeriod` - Period enum
- ❌ `NetIncome.IncomeFromChildMaintenance` - Maintenance amount
- ❌ `NetIncome.IncomeFromChildMaintenancePeriod` - Period enum

#### **SAVINGS (Detailed Breakdown)**
- ⚠️ `Savings.Bank` - Bank account savings (currently only total)
- ⚠️ `Savings.NationalCerts` - National Savings Certificates
- ⚠️ `Savings.Cash` - Cash holdings
- ⚠️ `Savings.ISA` - ISA savings
- ⚠️ `Savings.Bonds` - Bonds and securities
- ⚠️ `Savings.Shares` - Share holdings
- ⚠️ `Savings.Property` - Property value (excluding main home)

#### **SEVERE DISABILITY PREMIUM**
- ❌ `SevereDisabilityPremium.CarersAllowanceReceived` - Boolean CA receipt
- ❌ `SevereDisabilityPremium.PartnerCarersAllowanceReceived` - Partner CA
- ❌ `SevereDisabilityPremium.NonDependantDisability` - Non-dependant disability flag

#### **WTC DISABILITY**
- ❌ `WTCDisability.ConfirmWTCEligible` - WTC eligibility confirmation
- ❌ `WTCDisability.PartnerConfirmWTCEligible` - Partner WTC eligibility

#### **TAX CREDITS (Full Section)**
- ❌ `clientTaxCredits.Frequency` - Payment frequency
- ❌ `clientTaxCredits.PensionContributions` - Pension amount for tax credits
- ❌ `clientTaxCredits.Charity` - Charitable giving
- ❌ `clientTaxCredits.BenefitIncome` - Benefit income
- ❌ `clientTaxCredits.OtherIncome` - Other income
- ❌ `clientTaxCredits.MaternityAdoptionPay` - Maternity/adoption pay
- ❌ `clientTaxCredits.IncomeThisYear` - Income band
- ❌ `partnerTaxCredits.*` - All partner tax credit fields

#### **INCOME FOR TAX CREDITS**
- ❌ `IncomeForTaxCredits.PaymentFrequency` - Full frequency details
- ❌ `IncomeForTaxCredits.EarningsBeforeTax` - Gross earnings
- ❌ `IncomeForTaxCredits.PensionContributions` - Pension amounts
- ❌ `IncomeForTaxCredits.Charity` - Charitable contributions
- ❌ `IncomeForTaxCredits.BenefitIncome` - Benefit income
- ❌ `IncomeForTaxCredits.OtherIncome` - Other income
- ❌ `IncomeForTaxCredits.MaternityAdoptionPay` - Mat/adoption pay
- ❌ `IncomeForTaxCredits.IncomeThisYear` - Income band enum

#### **CARERS ALLOWANCE ELIGIBILITY**
- ⚠️ `CarersAllowanceEligibility.HoursCaring` - Hours band enum (vs actual hours)
- ❌ `CarersAllowanceEligibility.CaredReceiveBenefits` - Person cared for receives benefits
- ⚠️ `CarersAllowanceEligibility.PartnerHoursCaring` - Partner hours band
- ❌ `CarersAllowanceEligibility.PartnerCaredReceiveBenefits` - Partner cared person benefits
- ❌ `CarersAllowanceEligibility.CareForPartner` - Boolean caring for partner

#### **CARERS ALLOWANCE AWARD**
- ❌ `CarersAllowanceAward.IncludeInOtherBenefits` - String instruction
- ❌ `CarersAllowanceAward.CarersAllowanceReceived` - Amount received
- ❌ `CarersAllowanceAward.CarersAllowanceFreq` - Payment frequency
- ❌ `CarersAllowanceAward.PartnerIncludeInOtherBenefits` - Partner instruction
- ❌ `CarersAllowanceAward.PartnerCarersAllowanceReceived` - Partner amount
- ❌ `CarersAllowanceAward.PartnerCarersAllowanceFreq` - Partner frequency

#### **HOUSING COSTS**
- ❌ `HousingCosts.MortgageOutstanding` - Outstanding mortgage amount
- ❌ `HousingCosts.OtherHousing` - Other housing costs

### **SUMMARY STATISTICS**

**Total ImportAPI Fields:** ~150+ fields
**Currently Collected:** ~45-50 fields
**Missing:** ~100+ fields
**Alignment:** ~30-35% complete

**Critical Missing Categories:**
1. 🔴 Council Tax (entire section)
2. 🔴 Tax Credits (entire section)
3. 🔴 Detailed benefit tracking with amounts
4. 🔴 Period/frequency fields throughout
5. 🔴 Non-state pensions and other income
6. 🟡 Detailed disability assessments
7. 🟡 Work capability details
8. 🟡 CRM integration fields

---

## Executive Summary

This report compares the Universal Credit Calculator project with the EntitledTo ImportAPI documentation to identify:
1. Variable naming mismatches
2. Data structure differences
3. Required API fields not present in current implementation
4. Opportunities for alignment

**Key Findings:**
- Current calculator uses simplified, user-friendly variable names
- ImportAPI uses more technical/formal naming conventions
- Many ImportAPI fields are not collected in current calculator
- Significant mapping work required for full API integration

---

## 1. HOUSEHOLD INFORMATION

### 1.1 Housing Status

| **Current Calculator** | **ImportAPI Field** | **ImportAPI Enum** | **Alignment Status** |
|------------------------|---------------------|-------------------|----------------------|
| `housingStatus` | `household.HousingStatus` | `NationalHousingStatusEnum` | ⚠️ **Partial** |
| Values: | | | |
| - `no_housing_costs` | Not mapped | - | ❌ Missing |
| - `renting` | Mapped to enum values 0 or 1 | `CouncilTenant(0)` or `TenantPrivateSector(1)` | ✅ Mappable |
| - `homeowner` | `MortgageOrOwned` | `2` | ✅ Match |
| - `other` | `Other` | `8` | ✅ Match |
| - `in_prison` | Not directly mapped | - | ❌ Missing |

**ImportAPI Values Not Used:**
- `SharedOwnership (3)`
- `LivingWithParents (4)`
- `Homeless (5)`
- `SupportedAccommodation (6)`
- `BoarderOrLodger (7)`
- `TemporaryAccommodation (9)`
- `ResidentialCare (10)`

**Recommendation:** Add mapping table to convert calculator values to ImportAPI enum values.

---

### 1.2 Tenant Type

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `tenantType` | Derived from `HousingStatus` | ⚠️ **Implicit** |
| Values: `social`, `private` | Determines enum value 0 vs 1 | ✅ Mappable |

---

### 1.3 Household Composition

| **Current Calculator** | **ImportAPI Field** | **Data Type** | **Alignment** |
|------------------------|---------------------|---------------|---------------|
| `circumstances` | `household.PartnerResiding` | boolean | ✅ **Mappable** |
| - `single` → `false` | `false` | bool | ✅ |
| - `couple` → `true` | `true` | bool | ✅ |
| `children` | `household.ChildrenCount` | integer | ✅ **Match** |
| Not collected | `household.DependantCount` | integer | ❌ **Missing** |

**Missing Fields:**
- `household.DependantCount` - non-dependant adults in household
- `household.OtherResident` - type of other occupants

---

### 1.4 Location

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `brma` (BRMA name string) | `household.Postcode` | ❌ **Different Approach** |
| Selected from dropdown | UK postcode with space | |

**Issue:** Current calculator uses BRMA selection, ImportAPI expects postcode. BRMA is derived from postcode in ImportAPI system.

**Recommendation:**
- Option 1: Collect postcode instead of BRMA
- Option 2: Map BRMA back to representative postcode
- Option 3: Add postcode field alongside BRMA

---

### 1.5 Rent Information

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `rent` (monthly) | `household.RentAmount` | ✅ **Match** |
| Not explicitly collected | `household.RentPeriod` | ❌ **Missing** |
| `serviceCharges` | Not separate in API | ⚠️ **Different** |
| Not collected | `household.RentFreeWeeks` | ❌ **Missing** |
| `bedrooms` | `household.CurrentBedrooms` | ✅ **Match** |

**ImportAPI Period Enum:**
```
Yearly = 0
CalendarMonthly = 1
Weekly = 2
FourWeekly = 3
```

**Recommendation:** Add rent period field (default to CalendarMonthly=1)

---

### 1.6 Citizenship & Eligibility

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| Not collected | `household.BritishIrishCitizen` | ❌ **Missing** |
| Not collected | `household.HospPrisionerAbroadStudentFlag` | ❌ **Missing** |
| Not collected | `household.CalcUniversalCredit` | ❌ **Missing** |

**Recommendation:** Add eligibility screening questions.

---

## 2. PERSONAL DETAILS (CLIENT)

### 2.1 Age & Demographics

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `age` | `clientAgeDisability.Age` | ✅ **Match** |
| Not collected | `clientAgeDisability.DateOfBirth` | ❌ **Missing** |
| Not collected | `clientAgeDisability.Gender` | ❌ **Missing** |

**Gender Enum:** `female = 0`, `male = 1`

---

### 2.2 Employment Status

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `employmentType` | `clientAgeDisability.WorkStatus` | ⚠️ **Partial** |
| Values: | `WorkStatusEnum` | |
| - `unemployed` | `NotEmployed (0)` | ✅ |
| - `employed` | `Employed (2)` | ✅ |
| - `self-employed` | `SelfEmployed (4)` | ✅ |

**ImportAPI Values Not Used:**
- `NotEmployedButWorkedRecently (1)`
- `EmployedOnStatutoryLeave (3)`
- `DirectorOfOwnCompany (5)`

---

### 2.3 Work Hours

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| Not collected | `clientAgeDisability.WeeklyWorkHours` | ❌ **Missing** |

**Recommendation:** Add work hours field for employed/self-employed users.

---

### 2.4 Disability Status

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `hasLCWRA` | `clientAgeDisability.ESAPhase` / `DisabilitySicknessBenefit` | ⚠️ **Partial** |
| Not collected | `clientAgeDisability.DailyLivingActivities` | ❌ **Missing** |
| Not collected | `clientAgeDisability.MobilityActivities` | ❌ **Missing** |
| Not collected | `clientAgeDisability.RegisteredBlind` | ❌ **Missing** |

**ImportAPI Has:**
- `DisabilitySicknessBenefit` enum: NotClaimed(0), CurrentlyClaiming(1), RecentlyClaimed(3)
- `ESAPhase`: WorkRelated(1), Support(2)
- `ESAMainPhaseComponent`: WorkRelated(1), Support(2)

---

## 3. EARNINGS

### 3.1 Client Earnings

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `monthlyEarnings` | `clientEarnings.GrossEarnings` | ✅ **Match** |
| Implied monthly | `clientEarnings.GrossPayFreq` | ❌ **Missing** |
| `pensionAmount/Percentage` | `clientEarnings.PensionContributions` | ✅ **Match** |
| Not collected | `clientEarnings.PensionContributionsPeriod` | ❌ **Missing** |
| `netMonthlyEarningsCalculated` | `clientEarnings.NetEarnings` | ✅ **Match** |
| Implied monthly | `clientEarnings.NetEarningsPeriod` | ❌ **Missing** |
| Not collected | `clientEarnings.EarningsFromPermittedWork` | ❌ **Missing** |

**ImportAPI Period Enum (calcPeriod):**
- `Yearly = 0`
- `CalendarMonthly = 1`
- `Weekly = 2`
- `FourWeekly = 3`

---

### 3.2 Partner Earnings

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `partnerMonthlyEarnings` | `partnerEarnings.GrossEarnings` | ✅ **Match** |
| Same structure as client | Same structure | ✅ **Match** |

---

## 4. BENEFITS

### 4.1 Disability Benefits

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `disabilityBenefitType` | `clientBenefits[].BenefitType` | ⚠️ **Different Structure** |
| - `PIP` | Multiple enum values | |
| - `DLA` | Multiple enum values | |
| - `AA` | `AttendanceAllowance (30)` | |

**ImportAPI Structure:**
```javascript
clientBenefits: [
  {
    BenefitType: <enum>,
    BenefitValue: <decimal>,
    calcPeriod: <enum>,
    BenefitOption: <int>
  }
]
```

**Current Structure:** Single benefit type with rate details collected separately.

**Recommendation:** Map benefit types and rates to ImportAPI's array structure.

---

### 4.2 Benefit Type Mappings

| **Calculator Value** | **ImportAPI BenefitEnum** | **Code** |
|----------------------|---------------------------|----------|
| PIP Daily Living Lower | `PIPStandardDailyLivingComponent` | 89 |
| PIP Daily Living Higher | `PIPEnhancedDailyLivingComponent` | 90 |
| PIP Mobility Lower | `PIPLowerMobilityComponent` | 87 |
| PIP Mobility Higher | `PIPHigherMobilityComponent` | 88 |
| DLA Care Lower | `DLALowerRateCareComponent` | 95 |
| DLA Care Middle | `DLAMiddleRateCareComponent` | 94 |
| DLA Care Higher | `DLAHigherRateCareComponent` | 93 |
| DLA Mobility Lower | `DLALowerRateMobilityComponent` | 97 |
| DLA Mobility Higher | `DLAHigherRateMobilityComponent` | 96 |
| AA Lower | `AttendanceAllowanceLowerRate` | 92 |
| AA Higher | `AttendanceAllowanceHigherRate` | 91 |

---

### 4.3 Other Benefits Received

| **Current Calculator** | **ImportAPI Fields** | **Alignment** |
|------------------------|----------------------|---------------|
| Not collected | `OutOfWorkBenefits.SeekingWork` | ❌ **Missing** |
| Not collected | `OutOfWorkBenefits.Period26WeekWorked` | ❌ **Missing** |
| Not collected (implies in other benefits) | Various benefit enum values | ❌ **Missing** |

**ImportAPI Tracks:**
- Housing Benefit (currently receiving)
- Working Tax Credit (currently receiving)
- Carer's Allowance
- Maternity Allowance
- Bereavement benefits
- War pensions

---

## 5. CHILDREN

### 5.1 Child Information

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `children` (count) | `household.ChildrenCount` | ✅ **Match** |
| `childAges` (array) | `Children[].Age` | ✅ **Match** |
| Not collected | `Children[].DateOfBirth` | ❌ **Missing** |
| `childGenders` (array) | `Children[].Gender` | ✅ **Match** |
| `childcareCosts` (single value) | `Children[].ChildCareAmout` | ⚠️ **Different** |
| Not collected per child | `Children[].ChildCarePeriod` | ❌ **Missing** |
| `childDisabilities` (array) | `Children[].ChildDisability` + `childBenefits` | ⚠️ **Partial** |

**ImportAPI Structure:**
```javascript
Children: [
  {
    Age: <int>,
    DateOfBirth: <DateTime>,
    Gender: <enum>,
    ChildCarePeriod: <enum>,
    ChildCareAmout: <decimal>,
    ChildDisability: <boolean>,
    childBenefits: [<BenefitEnum>]
  }
]
```

**Current Structure:** Parallel arrays for child details.

---

## 6. CARER INFORMATION

### 6.1 Carer Status

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `isCarer` | `clientAgeDisability.Carer` | ✅ **Match** |
| `caringHours` | `CarersAllowanceEligibility.HoursCaring` | ⚠️ **Different** |
| Not collected | `CarersAllowanceEligibility.CaredReceiveBenefits` | ❌ **Missing** |
| `currentlyReceivingCarersAllowance` | `CarersAllowanceAward.IncludedCarersAllowance` | ✅ **Match** |
| Not collected | `CarersAllowanceAward.CarersAllowanceReceived` (amount) | ❌ **Missing** |
| Not collected | `CarersAllowanceAward.CarersAllowanceFreq` | ❌ **Missing** |

**ImportAPI Caring Hours Enum:**
- `Under20 = 1`
- `Over20Under34 = 2`
- `Over34 = 3`

**Current Calculator:** Collects actual hours (e.g., "35").

---

## 7. SAVINGS & CAPITAL

### 7.1 Savings

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| `savings` (total) | `Savings.Bank + NationalCerts + Cash + ISA + Bonds + Shares + Property` | ⚠️ **Simplified** |
| Single total | Multiple categories | |

**ImportAPI Categories:**
- `Savings.Bank`
- `Savings.NationalCerts`
- `Savings.Cash`
- `Savings.ISA`
- `Savings.Bonds`
- `Savings.Shares`
- `Savings.Property`

**Recommendation:** Either:
1. Accept total savings only
2. Add breakdown fields for detailed mapping

---

## 8. NET INCOME

### 8.1 Other Income

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| Not collected | `NetIncome.NonStatePension` | ❌ **Missing** |
| Not collected | `NetIncome.Income[]` (array of income types) | ❌ **Missing** |
| Not collected | `NetIncome.SubTenantCount` | ❌ **Missing** |
| Not collected | `NetIncome.Student` | ❌ **Missing** |
| Not collected | `NetIncome.OtherProperty` | ❌ **Missing** |
| `otherBenefits` | Implied in various benefit fields | ⚠️ **Partial** |

**ImportAPI Income Types:**
- `ChildBenefit = 1`
- `SpousalMainenance = 2`
- `Charity = 3`
- `SubTenants = 4`
- `OtherSources = 5`

---

## 9. COUNCIL TAX

### 9.1 Council Tax Details

| **Current Calculator** | **ImportAPI Field** | **Alignment** |
|------------------------|---------------------|---------------|
| Not collected | `CouncilTax.LocalAuthority` | ❌ **Missing** |
| Not collected | `CouncilTax.Band` | ❌ **Missing** |
| Not collected | `CouncilTax.DisabilityReduction` | ❌ **Missing** |
| Not collected | `CouncilTax.DiscountsApplicable` | ❌ **Missing** |
| Not collected | `CouncilTax.CouncilTaxLiability` | ❌ **Missing** |
| Not collected | `CouncilTax.PaymentPeriod` | ❌ **Missing** |

**Note:** Current calculator focuses on Universal Credit only, not Council Tax Reduction.

---

## 10. ADDITIONAL FIELDS

### 10.1 Calculator Control Fields

| **Current Calculator** | **ImportAPI Field** | **Purpose** | **Alignment** |
|------------------------|---------------------|-------------|---------------|
| Not applicable | `household.SubcompanyName` | Multi-tenancy | ❌ **N/A** |
| Not applicable | `household.CaseIndentifier` | CRM reference | ❌ **N/A** |
| Not applicable | `household.SecurityToken` | Authentication | ❌ **N/A** |
| Not applicable | `household.CalcIdent` | Calculation ID (returned) | ❌ **N/A** |
| Not applicable | `household.ReturnUrl` | Callback URL | ❌ **N/A** |
| Not applicable | `household.ResultsServiceUrl` | Results webhook | ❌ **N/A** |

---

## 11. OUTPUT MAPPING

### 11.1 Results Return Format

**ImportAPI Returns (Appendix 3):**
```javascript
{
  "data": {
    "client": "73485",
    "entitlements": [
      {
        "code": "UniversalCredit",
        "name": " Universal Credit",
        "value": "£87.54"
      }
      // ... other benefits
    ]
  },
  "document": "https://...pdf"
}
```

**Current Calculator Returns:**
```javascript
{
  success: true,
  taxYear: "2025_26",
  calculation: {
    standardAllowance: 316.98,
    housingElement: 500,
    childElement: 339,
    // ... detailed breakdown
    finalAmount: 1234.56
  }
}
```

**Gap:** ImportAPI expects list of benefit entitlements, current returns detailed calculation breakdown.

---

## 12. CRITICAL GAPS SUMMARY

### 12.1 Essential Fields Missing

❌ **High Priority:**
1. `household.Postcode` - Required for BRMA lookup
2. `household.BritishIrishCitizen` - Eligibility screening
3. `clientAgeDisability.DateOfBirth` - Age verification
4. `clientAgeDisability.Gender` - Required field
5. `clientEarnings.GrossPayFreq` - Period specification
6. All period fields (`calcPeriod` enum)

⚠️ **Medium Priority:**
1. `household.DependantCount` - Affects bedroom calculation
2. `clientAgeDisability.WeeklyWorkHours` - Work allowance determination
3. Detailed benefit breakdowns per ImportAPI enum
4. Council Tax information (if expanding calculator)

🔵 **Low Priority:**
1. `household.Email` / `Mobile` - Contact preferences
2. CRM integration fields (SubcompanyName, etc.)
3. Student income details
4. Non-state pension details

---

## 13. MAPPING STRATEGY

### 13.1 Recommended Approach

**Phase 1: Core Field Mapping**
1. Create mapping layer between calculator and ImportAPI
2. Add missing essential fields to calculator form
3. Implement enum conversion functions
4. Handle period conversions (monthly ↔ weekly ↔ yearly)

**Phase 2: Enhanced Data Collection**
1. Add benefit amount collection per type
2. Implement detailed savings breakdown (optional)
3. Add work hours and detailed employment data
4. Collect date of birth alongside age

**Phase 3: API Integration**
1. Build JSON payload constructor
2. Implement ImportAPI POST request
3. Parse and map response back to calculator format
4. Handle errors and validation

---

## 14. EXAMPLE MAPPING FUNCTIONS

### 14.1 Housing Status Mapping

```javascript
function mapHousingStatusToAPI(calculatorData) {
  const { housingStatus, tenantType } = calculatorData;

  const mapping = {
    'no_housing_costs': 4, // LivingWithParents
    'renting': tenantType === 'social' ? 0 : 1, // CouncilTenant or TenantPrivateSector
    'homeowner': 2, // MortgageOrOwned
    'other': 8, // Other
    'in_prison': 10 // ResidentialCare (approximate)
  };

  return mapping[housingStatus] || -1; // NotSet
}
```

### 14.2 Circumstances Mapping

```javascript
function mapCircumstancesToAPI(calculatorData) {
  return {
    PartnerResiding: calculatorData.circumstances === 'couple'
  };
}
```

### 14.3 Period Conversion

```javascript
const CALC_PERIOD_ENUM = {
  yearly: 0,
  monthly: 1,
  weekly: 2,
  fourWeekly: 3
};

function convertToWeekly(amount, period) {
  switch(period) {
    case 0: return amount / 52; // yearly
    case 1: return amount / 4.33; // monthly
    case 2: return amount; // weekly
    case 3: return amount / 4; // four-weekly
    default: return amount;
  }
}
```

---

## 15. NAMING CONVENTIONS ANALYSIS

### 15.1 Current Calculator Conventions

**Style:** `camelCase`
**Approach:** User-friendly, descriptive
**Examples:**
- `monthlyEarnings`
- `housingStatus`
- `childcareCosts`
- `hasLCWRA`

**Characteristics:**
- Clear, self-documenting names
- Focused on user perspective
- Simplified structure (single values where possible)

---

### 15.2 ImportAPI Conventions

**Style:** `PascalCase` for classes, `camelCase` for properties
**Approach:** Technical, system-oriented
**Examples:**
- `household.HousingStatus`
- `clientAgeDisability.DisabilitySicknessBenefit`
- `clientEarnings.GrossPayFreq`

**Characteristics:**
- Formal, enterprise naming
- Namespace organization (grouped by category)
- Detailed, explicit structure
- Heavy use of enums

---

## 16. RECOMMENDATIONS

### 16.1 Short Term (Integration Prep)

1. **Create Adapter Layer**
   - Build `ImportAPIAdapter` class
   - Map calculator fields → API fields
   - Handle enum conversions
   - Manage period conversions

2. **Add Critical Fields**
   - Postcode field (can be optional with BRMA fallback)
   - Gender selection
   - Date of birth fields
   - Payment frequency fields

3. **Documentation**
   - Create field mapping reference document
   - Document all enum mappings
   - Create example JSON payloads

### 16.2 Long Term (Full Alignment)

1. **Refactor Data Model**
   - Consider adopting closer naming to ImportAPI
   - Implement enum types matching ImportAPI
   - Add comprehensive benefit tracking

2. **API Integration**
   - Implement full ImportAPI submission
   - Handle response parsing
   - Store CalcIdent for reference
   - Implement results callback handling

3. **Validation**
   - Add validation matching ImportAPI requirements
   - Implement client-side checks before submission
   - Handle API error responses

---

## 17. CONCLUSION

**Current State:**
- Calculator is feature-complete for UC calculations
- Uses simplified, user-friendly structure
- ~60% field alignment with ImportAPI

**Required Work for Full Integration:**
- Medium complexity mapping layer needed
- ~15-20 additional fields to collect
- Enum conversion system required
- Period conversion utilities needed

**Estimated Effort:**
- Mapping layer: 2-3 days
- Additional fields: 3-5 days
- Testing & validation: 2-3 days
- **Total: 1-2 weeks development time**

**Benefits of Alignment:**
- Enable ImportAPI integration
- Pre-populate EntitledTo calculator
- Receive comprehensive benefit calculations
- Access to PDF reports
- Integration with existing CRM systems

---

## APPENDICES

### A. Complete Field Mapping Table

Available in separate CSV file: `field-mapping-table.csv`

### B. Enum Conversion Reference

Available in separate file: `enum-mappings.js`

### C. Sample JSON Payloads

Available in separate file: `sample-api-payloads.json`

---

**Report End**
