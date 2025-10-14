# Universal Credit Calculator - Claude Code Documentation

## Project Overview

This is a React-based Universal Credit (UC) calculator that helps users estimate their UC entitlement based on various circumstances including income, housing, children, and disability status.

**Live Site:** https://philagulnik.github.io/better-off-calculator-test/

## Key Technologies

- **React 18.2** - UI framework
- **React Router 7.8** - Client-side routing
- **React Scripts 5.0** - Build tooling
- **GitHub Pages** - Deployment platform

## Project Structure

The project uses a **feature-based architecture** for better organization and maintainability:

```
src/
├── features/
│   ├── uc-calculator/              # UC Calculator (Main Feature)
│   │   ├── components/
│   │   │   ├── CalculatorPage.js       # Main calculator page
│   │   │   ├── CalculatorForm.js       # Input form component
│   │   │   ├── ResultsSection.js       # Results display
│   │   │   ├── DetailedResults.js      # Detailed breakdown
│   │   │   ├── NetEarningsModule.js    # Net earnings calculator
│   │   │   ├── CarerModule.js          # Carer allowance module
│   │   │   ├── BetterOffCalculator.js  # Better-off analysis
│   │   │   ├── SavedScenarios.js       # Saved calculations
│   │   │   ├── StatePensionAgeWarning.js
│   │   │   └── AffordabilityMap.js     # BRMA/LHA visualization
│   │   └── utils/
│   │       ├── calculator.js           # Core UC calculation logic
│   │       ├── benefitCalculator.js    # Benefit calculations
│   │       ├── childBenefitCalculator.js
│   │       ├── pensionAgeCalculator.js # State pension age logic
│   │       ├── lhaDataService.js       # LHA data/logic
│   │       └── benefitDataService.js
│   │
│   ├── self-employment/            # Self-Employment Tools
│   │   ├── components/
│   │   │   ├── SelfEmploymentHub.js
│   │   │   ├── SelfAssessmentTaxForm.js
│   │   │   ├── InvoicesAndReceipts.js
│   │   │   ├── SelfEmploymentIncomeMaximisation.js
│   │   │   ├── MIFCalculatorTool.js
│   │   │   └── MIFHelpGuide.js
│   │   └── monthly-profit/
│   │       ├── MonthlyProfitTool.js
│   │       ├── AssessmentPeriodCalendar.js
│   │       └── MonthlyReportingForm.js
│   │
│   ├── budgeting-tool/             # Budgeting Tool
│   │   ├── components/
│   │   │   ├── EnhancedBudgetingTool.js
│   │   │   ├── BudgetingToolAdmin.js
│   │   │   ├── HousingReviewAmounts.js
│   │   │   └── ONSStandardAmounts.js
│   │   └── services/
│   │       ├── adminConfigService.js
│   │       ├── housingReviewsDataService.js
│   │       └── onsDataService.js
│   │
│   ├── rehabilitation/             # Rehabilitation Services
│   │   └── components/
│   │       ├── RehabilitationHub.js
│   │       ├── RehabilitationCalculatorView.js
│   │       └── PrisonLeaversGuide.js
│   │
│   └── help-guides/                # Help & Documentation
│       └── components/
│           ├── HelpGuideBenefits.js
│           ├── HelpGuideHousing.js
│           ├── HelpGuideHealth.js
│           └── ChildBenefitChargeHelp.js
│
├── shared/                         # Shared Components & Utilities
│   ├── components/
│   │   ├── Navigation.js           # Site navigation
│   │   ├── Logo.js
│   │   ├── LoadingOverlay.js
│   │   ├── AmountInputWithPeriod.js
│   │   ├── PasswordProtection.js
│   │   ├── ExamplesSection.js
│   │   ├── AdminPanel.js
│   │   ├── ComponentTester.js
│   │   └── admin/                  # Admin sub-components
│   │       ├── SkinManagement.js
│   │       └── TextManagement.js
│   └── utils/
│       ├── formatters.js           # Formatting utilities
│       ├── skinManager.js          # Theme management
│       ├── textManager.js          # Text/localization
│       └── testChildBenefit.js
│
├── data/                           # Static Data Files
│   ├── brmaListEngland.json        # England BRMA names
│   ├── brmaListScotland.json       # Scotland BRMA names
│   ├── brmaListWales.json          # Wales BRMA names
│   └── lhaRates2025_26.json        # LHA rates for 2025-26
│
├── hooks/                          # Custom React Hooks
│   └── useTextManager.js
│
└── App.js                          # Root app component
```

### Architecture Benefits

- **Feature-based organization**: Each major feature is self-contained
- **Clear boundaries**: Easy to identify what belongs to each feature
- **Shared code isolation**: Common utilities and components in dedicated folder
- **Scalability**: Easy to add new features or split into separate projects
- **Maintainability**: Related code grouped together

## Core Features

### 1. UC Calculation
- Standard allowances (single/couple, under/over 25)
- Child elements with two-child limit rules (pre/post April 2017)
- Disabled child additions (lower/higher rates)
- Housing element with LHA caps for private tenants
- Childcare costs (85% up to max amounts)
- LCWRA element
- Carer element
- Work allowances
- Taper rate (55%)
- Capital deductions

### 2. BRMA Selection
- Grouped dropdown with England, Scotland, and Wales sections
- 152 BRMAs in England (alphabetized)
- 18 BRMAs in Scotland (alphabetized)
- 22 BRMAs in Wales (alphabetized)
- Validation for private tenants (must select BRMA)
- LHA rate lookup based on BRMA and bedroom entitlement

### 3. Net Earnings Calculator
- Calculates take-home pay after tax and NI
- Pension contribution calculations
- Integration with UC taper calculations

### 4. Multiple Tax Years
- Supports 2023-24, 2024-25, and 2025-26 rates
- Rates stored in `calculator.js`

## Important Constants (2025-26)

### Standard Allowances
- Single under 25: £316.98
- Single 25+: £400.14
- Couple both under 25: £497.55
- Couple one/both 25+: £628.10

### Child Elements
- Pre-2017 (born before 6 April 2017): £339.00
- Post-2017 (born after 6 April 2017): £292.81

### Disabled Child Additions
- Lower rate: £158.76
- Higher rate: £495.87

### Childcare Costs
- Max 85% of costs
- One child: £1,031.88
- Two or more: £1,768.94

### Other Elements
- LCWRA: £423.27
- Carer: £201.68
- Work allowance with housing: £411
- Work allowance without housing: £684
- Taper rate: 55%

## Development Commands

```bash
# Start development server (localhost:3000)
npm start

# Build for production
npm run build

# Build without source maps
npm run build:production

# Deploy to GitHub Pages
npm run deploy

# Run tests
npm test

# Serve production build locally
npm run serve
```

## Testing

The project includes custom test scripts for validating UC calculations:

- `improved-test-runner.js` - Main test runner
- `calculator-test-2025-26-final.csv` - Test cases with expected values
- Run tests: `node improved-test-runner.js calculator-test-2025-26-final.csv`

## Key Calculations

### Work Allowance Calculation
```javascript
// Depends on whether claimant has housing costs or LCWRA/child
const workAllowance = (hasHousingElement || (hasLCWRA || children > 0))
  ? rates.workAllowance.withHousing  // £411
  : rates.workAllowance.withoutHousing;  // £684
```

### Taper Calculation
```javascript
const earningsAboveWorkAllowance = Math.max(0, monthlyEarnings - workAllowance);
const earningsReduction = earningsAboveWorkAllowance * 0.55; // 55% taper
```

### Child Element with Birth Date Logic
```javascript
// Children born before 6 April 2017 get higher rate
const twoChildLimitDate = new Date('2017-04-06');
if (approximateBirthDate < twoChildLimitDate) {
  childElement += rates.childElement.preTwoChildLimit; // £339
} else {
  childElement += rates.childElement.postTwoChildLimit; // £292.81
}
```

## Deployment

The app is deployed to GitHub Pages using `gh-pages` package.

**Important:** The `package.json` must include:
```json
"homepage": "https://philagulnik.github.io/better-off-calculator-test"
```

This ensures React builds with the correct base path for the subdirectory.

## Common Issues

### Blank Screen on GitHub Pages
- **Cause:** Missing or incorrect `homepage` field in `package.json`
- **Fix:** Add/update homepage field and rebuild

### BRMA Validation Not Working
- **Cause:** Validation only applies when `housingStatus === 'renting'` AND `tenantType === 'private'`
- **Fix:** Check both conditions in `handleCalculate` function

### Incorrect Child Element Calculations
- **Cause:** Birth date calculation or two-child limit logic
- **Fix:** Verify `childAges` array is properly passed and parsed

## Data Sources

- UC rates: https://www.gov.uk/government/publications/benefit-and-pension-rates-2025-to-2026
- LHA rates: https://www.gov.uk/government/publications/local-housing-allowance-indicative-rates-2025-to-2026
- BRMA lists: GOV.UK CSV data files

## Code Style

- Use ES6+ features
- Functional components with hooks
- PropTypes for component props (where applicable)
- Consistent naming: camelCase for variables/functions, PascalCase for components

## Git Workflow

```bash
# Stage changes
git add [files]

# Commit with structured message
git commit -m "Brief description

Detailed explanation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push

# Deploy to production
npm run deploy
```

## Environment

- **Node.js:** v22.18.0
- **npm:** Included with Node.js
- **Platform:** Windows (WSL-compatible)

## Contact

For questions or issues, please open an issue on the GitHub repository.
