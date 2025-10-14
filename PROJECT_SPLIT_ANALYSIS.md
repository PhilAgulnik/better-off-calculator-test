# Universal Credit Calculator - Project Split Strategic Analysis

**Document Version:** 1.0
**Date:** 2025-10-14
**Prepared By:** Claude (Project Manager Agent)
**Status:** Analysis & Recommendation

---

## Executive Summary

This document provides a comprehensive analysis of splitting the current monolithic Universal Credit Calculator into multiple separate projects. The analysis considers the current architecture, resource constraints, and the backend migration roadmap (Epic 0) planned for Q1 2026.

**Key Recommendation:** **DO NOT split the project now.** Wait until after the backend migration (Epic 0) is complete in Q1 2026, then reassess. The overhead and complexity of managing multiple projects outweighs the benefits given current resources (1-2 part-time developers) and the imminent architectural transformation.

**Critical Finding:** The planned backend migration to Frontend-API-Database architecture fundamentally changes the splitting calculus. Splitting now would mean migrating 3 separate projects to the new architecture, tripling the effort and risk.

---

## 1. Current Project Audit

### 1.1 Component Inventory (35 components)

#### **Category A: Core UC Calculator (8 components)**
- `CalculatorPage.js` - Main calculator container with state management
- `CalculatorForm.js` - Input form for UC parameters
- `ResultsSection.js` - Calculation results display
- `DetailedResults.js` - Detailed breakdown of UC elements
- `NetEarningsModule.js` - Net earnings calculator (tax/NI/pension)
- `CarerModule.js` - Carer allowance eligibility and calculations
- `StatePensionAgeWarning.js` - Pension age warnings
- `AffordabilityMap.js` - BRMA/LHA visualization and mapping

#### **Category B: Self-Employment Tools (8 components)**
- `SelfEmploymentHub.js` - Hub page for self-employment tools
- `SelfAssessmentTaxForm.js` - Self-assessment tax return form
- `MonthlyProfitTool.js` (feature) - Monthly profit tracking for UC
- `MonthlyReportingForm.js` (feature) - UC monthly reporting
- `AssessmentPeriodCalendar.js` (feature) - Calendar for assessment periods
- `MIFCalculatorTool.js` - Minimum Income Floor calculator
- `MIFHelpGuide.js` - MIF guidance and information
- `InvoicesAndReceipts.js` - Invoice/receipt management with OCR
- `SelfEmploymentIncomeMaximisation.js` - Income optimization for self-employed

#### **Category C: Rehabilitation Services (3 components)**
- `RehabilitationHub.js` - Hub for prison leavers services
- `RehabilitationCalculatorView.js` - Rehabilitation-specific calculator view
- `PrisonLeaversGuide.js` - Comprehensive guide for prison leavers

#### **Category D: Budgeting Tool (5 components)**
- `EnhancedBudgetingTool.js` (feature) - Main budgeting interface
- `BudgetingToolAdmin.js` (feature) - Admin configuration panel
- `HousingReviewAmounts.js` - Housing review standard amounts
- `ONSStandardAmounts.js` - ONS data for budgeting
- Admin config components (2) - Skin and text management

#### **Category E: Help & Guidance (4 components)**
- `HelpGuideBenefits.js` - Benefits guidance
- `HelpGuideHousing.js` - Housing guidance
- `HelpGuideHealth.js` - Health guidance
- `ChildBenefitChargeHelp.js` - Child benefit charge calculator/guide

#### **Category F: Infrastructure & Shared (7 components)**
- `Navigation.js` - Site-wide navigation system
- `Logo.js` - Logo component (supports multiple skins)
- `PasswordProtection.js` - Production authentication
- `AdminPanel.js` - Admin configuration panel
- `SavedScenarios.js` - Saved calculation scenarios
- `BetterOffCalculator.js` - Better-off calculations
- `ComponentTester.js` - Development testing component
- `LoadingOverlay.js` - Loading state UI
- `AmountInputWithPeriod.js` - Reusable input component
- `ExamplesSection.js` - Example calculations

### 1.2 Utilities & Data Services (10 files)

#### **Core Calculation Utilities**
- `calculator.js` (859 lines) - Main UC calculation engine
  - UniversalCreditCalculator class
  - Rate tables for 2023-24, 2024-25, 2025-26
  - All calculation logic (standard allowances, child elements, housing, work allowance, taper, etc.)
  - **HIGHLY COUPLED** - used by almost every calculator feature

- `benefitCalculator.js` - Legacy benefit calculations
- `childBenefitCalculator.js` - Child benefit charge calculations
- `pensionAgeCalculator.js` - State pension age calculations

#### **Data Services**
- `lhaDataService.js` - LHA (Local Housing Allowance) rate lookups
  - Imports `lhaRates2025_26.json`
  - Used by UC calculator and affordability map

- `benefitDataService.js` - Benefit rate data and lookups

#### **Feature-Specific Services**
- `features/budgeting-tool/adminConfigService.js` - Budgeting tool configuration
- `features/budgeting-tool/onsDataService.js` - ONS data for budgeting
- `features/budgeting-tool/housingReviewsDataService.js` - Housing review data

#### **UI & Infrastructure**
- `formatters.js` - Currency and number formatting
- `skinManager.js` - Multi-tenant theming system
- `textManager.js` - Customizable text content management

### 1.3 Data Files (4 JSON files)

- `brmaListEngland.json` - 152 BRMAs in England
- `brmaListScotland.json` - 18 BRMAs in Scotland
- `brmaListWales.json` - 22 BRMAs in Wales
- `lhaRates2025_26.json` - LHA rates for all BRMAs

**Total Data:** ~200KB of static reference data

### 1.4 Styling (6 CSS files)

- `index.css` - Global styles
- `InvoicesAndReceipts.css` - Feature-specific
- `PasswordProtection.css` - Feature-specific
- `admin/AdminPanel.css` - Admin panel styles
- `admin/SkinManagement.css` - Skin management styles
- `admin/TextManagement.css` - Text management styles

### 1.5 Routing Structure (22 routes)

```
/ - UC Calculator (main)
/self-employment-accounts - Self-employment hub
/self-employment-accounts/invoices-receipts - Invoice management
/self-employment-accounts/income-maximisation - Income optimization
/self-assessment-tax-form - Tax form
/monthly-profit - Monthly profit tool
/mif-help-guide - MIF guidance
/mif-calculator - MIF calculator
/rehabilitation-services - Rehabilitation hub
/rehabilitation-calculator - Rehabilitation calculator view
/affordability-map - BRMA/LHA map
/budgeting-tool - Budgeting tool
/budgeting-tool-admin - Budgeting admin
/housing-review-amounts - Housing review data
/ons-standard-amounts - ONS data display
/help-guide - Prison leavers guide
/help-guide/benefits - Benefits help
/help-guide/housing - Housing help
/help-guide/health - Health help
/help/child-benefit-charge - Child benefit help
```

### 1.6 Dependency Analysis

#### **Tight Coupling (Hard to Split)**

1. **calculator.js is a Universal Dependency**
   - Used by: CalculatorPage, SelfEmploymentIncomeMaximisation, RehabilitationCalculatorView, MonthlyProfitTool
   - Contains: All UC rates, all calculation logic
   - **Impact:** Any split requires duplicating or sharing this 859-line file

2. **lhaDataService.js + LHA JSON files**
   - Used by: CalculatorPage (housing element), AffordabilityMap
   - Contains: All BRMA data and LHA rates (192 areas)
   - **Impact:** Calculator and map both need this data

3. **Navigation.js is Universal**
   - Used by: Every page/component
   - Contains: Cross-project navigation logic and breadcrumbs
   - **Impact:** Would need to be shared or duplicated across all projects

4. **skinManager.js + textManager.js**
   - Used by: Multiple components for multi-tenant support
   - Contains: Theming and customization logic
   - **Impact:** White-label capability spans all tools

5. **formatters.js**
   - Used by: Every component that displays currency
   - Simple utility but universal dependency

#### **Loose Coupling (Easier to Split)**

1. **Self-Employment Feature Modules**
   - MonthlyProfitTool.js, AssessmentPeriodCalendar.js, MonthlyReportingForm.js
   - Relatively self-contained (except for calculator.js dependency)

2. **Budgeting Tool Services**
   - adminConfigService.js, onsDataService.js, housingReviewsDataService.js
   - Mostly isolated to budgeting feature

3. **Help Guides**
   - Minimal dependencies, mostly static content

#### **Shared Infrastructure**

- **Authentication:** PasswordProtection.js (currently simple password, will become user auth in Epic 0)
- **Admin Panel:** AdminPanel.js, SkinManagement, TextManagement
- **Saved Scenarios:** SavedScenarios.js (will move to database in Epic 0)
- **Logo & Branding:** Logo.js (multi-tenant support)

### 1.7 File Structure Metrics

```
src/
├── components/ (35 JS files, 6 CSS files)
├── features/
│   ├── budgeting-tool/ (4 JS files)
│   └── monthly-profit/ (3 JS files)
├── utils/ (10 JS files)
├── data/ (4 JSON files)
├── hooks/ (potentially 1-2 custom hooks)
└── App.js (main router)
```

**Total Frontend Code:** ~5,000-7,000 lines of JavaScript across 52 files

---

## 2. Proposed Project Structure (If Splitting)

### 2.1 Project A: Benefit Calculator (Main)

**Purpose:** Core UC calculator, housing tools, benefit guidance

**Components (15):**
- CalculatorPage, CalculatorForm, ResultsSection, DetailedResults
- NetEarningsModule, CarerModule, StatePensionAgeWarning
- AffordabilityMap
- HelpGuideBenefits, HelpGuideHousing, HelpGuideHealth
- ChildBenefitChargeHelp
- BetterOffCalculator
- SavedScenarios
- ExamplesSection

**Utilities:**
- calculator.js (CORE)
- lhaDataService.js (CORE)
- benefitCalculator.js
- childBenefitCalculator.js
- pensionAgeCalculator.js
- formatters.js

**Data:**
- All BRMA JSON files
- All LHA rate files

**Infrastructure:**
- Navigation.js (shared)
- Logo.js (shared)
- PasswordProtection.js (shared)
- AdminPanel.js (shared)

**Estimated Size:** 3,000-4,000 LOC

### 2.2 Project B: Self-Employment Tool

**Purpose:** Self-employment accounting, tax, MIF, and UC reporting

**Components (9):**
- SelfEmploymentHub
- SelfAssessmentTaxForm
- MonthlyProfitTool, MonthlyReportingForm, AssessmentPeriodCalendar
- MIFCalculatorTool, MIFHelpGuide
- InvoicesAndReceipts
- SelfEmploymentIncomeMaximisation

**Utilities:**
- calculator.js (COPY or SHARED)
- formatters.js (COPY or SHARED)
- Tax calculation utilities (new)
- MIF calculation utilities (new)

**Data:**
- Tax rates and thresholds
- MIF rates

**Infrastructure:**
- Navigation.js (shared)
- Logo.js (shared)
- PasswordProtection.js (shared)

**Estimated Size:** 2,000-3,000 LOC

### 2.3 Project C: Other Tools

**Purpose:** Budgeting, rehabilitation services, misc. calculators

**Components (8):**
- RehabilitationHub
- RehabilitationCalculatorView
- PrisonLeaversGuide
- EnhancedBudgetingTool
- BudgetingToolAdmin
- HousingReviewAmounts
- ONSStandardAmounts
- Admin components

**Utilities:**
- calculator.js (COPY or SHARED)
- formatters.js (COPY or SHARED)
- adminConfigService.js
- onsDataService.js
- housingReviewsDataService.js

**Data:**
- ONS data
- Housing review data

**Infrastructure:**
- Navigation.js (shared)
- Logo.js (shared)
- PasswordProtection.js (shared)
- AdminPanel.js

**Estimated Size:** 1,500-2,000 LOC

---

## 3. Shared Infrastructure Considerations

### 3.1 What Needs to be Shared?

#### **Critical Shared Code**

1. **calculator.js (859 lines)**
   - **Rationale:** All projects need UC calculations
   - **Options:**
     - NPM package (best for monorepo)
     - Code duplication (simplest but risky)
     - Shared git submodule (complex)
     - API endpoint (after Epic 0)

2. **lhaDataService.js + LHA data**
   - **Rationale:** Calculator and map both need BRMA/LHA data
   - **Options:**
     - Shared package
     - API endpoint (after Epic 0)
     - Code duplication (not recommended - 200KB data)

3. **Navigation.js**
   - **Rationale:** Cross-project navigation links
   - **Challenge:** How to link between separate domains/deployments?
   - **Options:**
     - Separate navigation per project (breaks unified UX)
     - Shared navigation package (complex)
     - Iframe/micro-frontend approach (overkill)

4. **Authentication & User Management**
   - **Current:** Simple password protection
   - **Future (Epic 0):** User accounts, saved scenarios, API authentication
   - **Challenge:** Shared auth across multiple projects/domains
   - **Options:**
     - OAuth/SSO (complex to implement)
     - Shared auth service (requires backend)
     - Separate auth per project (poor UX)

5. **Design System & Styling**
   - **Current:** Global CSS + component-specific CSS
   - **Future:** Consistent branding across projects
   - **Options:**
     - Shared CSS package
     - Design tokens
     - Component library (React)

6. **Skin Manager & Text Manager**
   - **Rationale:** White-label/multi-tenant support spans all projects
   - **Challenge:** How to manage skins and text across projects?
   - **Options:**
     - Shared configuration via API (after Epic 0)
     - Duplicated configuration per project
     - Shared configuration package

#### **Nice-to-Have Shared Code**

- formatters.js (simple utility)
- Logo.js (branding)
- Reusable UI components (AmountInputWithPeriod, LoadingOverlay)

### 3.2 Database Schema Considerations (Post-Epic 0)

When backend is implemented, database will contain:

**Shared Across All Projects:**
- Users table (authentication)
- User profiles
- API keys (for third-party integrations)
- Audit logs

**Project-Specific:**
- Saved UC calculations (Project A)
- Self-employment records (Project B)
- Budget data (Project C)
- Invoice/receipt storage (Project B)

**Cross-Project:**
- User preferences
- Notification settings
- Multi-tenant configuration (skins, text overrides)

**Challenge:** Single database vs. separate databases per project?

---

## 4. Migration Strategy (If Splitting)

### 4.1 Phased Approach

#### **Phase 0: Preparation (2-3 weeks)**
1. Complete dependency audit
2. Identify all imports across files
3. Create shared code extraction plan
4. Set up monorepo structure (if chosen)
5. Create shared packages for calculator.js, lhaDataService.js, formatters.js
6. Test shared packages in current project

#### **Phase 1: Extract Self-Employment Tool (3-4 weeks)**

**Why First?**
- Most self-contained feature set
- Least coupling to core calculator
- Clear value proposition as standalone product

**Steps:**
1. Create new repo (or workspace in monorepo)
2. Copy/link shared packages
3. Extract self-employment components
4. Extract MIF components
5. Set up separate build pipeline
6. Create standalone navigation
7. Deploy to separate subdomain (e.g., se-accounts.example.com)
8. Test end-to-end
9. Update links in main project

**Risks:**
- Calculator.js dependency
- Cross-project navigation breaks
- User confusion with separate sites

#### **Phase 2: Extract Budgeting/Other Tools (2-3 weeks)**

**Steps:**
1. Create new repo (or workspace)
2. Copy/link shared packages
3. Extract budgeting tool
4. Extract rehabilitation services
5. Extract admin components
6. Deploy to separate subdomain (e.g., tools.example.com)
7. Update links in main project

#### **Phase 3: Integration & Polish (2-3 weeks)**

**Steps:**
1. Implement cross-project navigation
2. Test authentication flow across projects
3. Ensure consistent branding
4. Update documentation
5. User acceptance testing
6. Launch communication plan

**Total Estimated Effort:** 10-13 weeks (2.5-3 months) with 1-2 developers

### 4.2 Rollback Plan

**If Split Fails:**
1. Keep all original code in main repo (don't delete until stabilized)
2. Maintain ability to revert routes back to main project
3. Use feature flags to toggle between monolith and split projects
4. Parallel run period of 2-4 weeks before decommissioning monolith

**Rollback Triggers:**
- User confusion > 25%
- Error rate increases > 10%
- Development velocity decreases > 30%
- Maintenance burden increases significantly
- Team overwhelmed

---

## 5. Pros and Cons Analysis

### 5.1 Benefits of Splitting

#### **Code Organization & Maintainability**
- **Pro:** Clearer separation of concerns
- **Pro:** Smaller codebases easier to understand
- **Pro:** Focused feature development
- **Reality Check:** Current codebase is only ~5,000-7,000 LOC - not unmanageable
- **Rating:** Minor benefit (3/10)

#### **Deployment Independence**
- **Pro:** Can deploy self-employment tool without affecting calculator
- **Pro:** Reduces risk of breaking core calculator with feature changes
- **Pro:** Independent release cycles
- **Reality Check:** Current deployment is simple (GitHub Pages), rarely breaks
- **Reality Check:** Will have backend deployments to coordinate in Epic 0
- **Rating:** Moderate benefit (5/10)

#### **Team Structure**
- **Pro:** Different developers can own different projects
- **Pro:** Parallel development without merge conflicts
- **Reality Check:** Team is 1-2 part-time developers - no parallel work
- **Reality Check:** More projects = more context switching for small team
- **Rating:** Negative for current team (-3/10)

#### **Technology Choices**
- **Pro:** Could use different tech stacks per project
- **Con:** Increases complexity, learning curve, and maintenance burden
- **Reality Check:** All projects are currently React - no reason to diverge
- **Rating:** Not applicable (0/10)

#### **Scaling & Performance**
- **Pro:** Can scale projects independently
- **Con:** Current app is tiny, performance is not an issue
- **Reality Check:** Each project would be <1MB bundle - no scaling needed
- **Rating:** Not applicable (0/10)

#### **Business & Product**
- **Pro:** Self-employment tool could be sold/licensed separately
- **Pro:** Clearer product boundaries for users
- **Pro:** Different pricing models per product
- **Reality Check:** No current business model or pricing - all free/open
- **Reality Check:** Products are complementary, not competitive
- **Rating:** Future potential (6/10) but not immediate

### 5.2 Drawbacks and Challenges

#### **Code Duplication**
- **Con:** calculator.js (859 lines) must be shared or duplicated
- **Con:** Utilities (formatters, data services) must be shared
- **Con:** Shared components (Navigation, Logo) must be shared
- **Con:** Managing shared code updates across 3 projects
- **Impact:** High effort to maintain consistency
- **Rating:** Major drawback (-8/10)

#### **Cross-Project Navigation**
- **Con:** Users expect seamless navigation between tools
- **Con:** Separate domains/deployments break user flow
- **Con:** Breadcrumbs and related tools become complex
- **Con:** Deep linking between projects difficult
- **Impact:** Poor user experience
- **Rating:** Critical drawback (-9/10)

#### **Authentication & User Management**
- **Con:** Shared authentication across multiple projects is complex
- **Con:** Session management across domains requires SSO or cookies
- **Con:** Saved scenarios can't span projects without shared database
- **Impact:** Severely complicates Epic 0 (backend migration)
- **Rating:** Critical drawback (-10/10)

#### **Deployment & DevOps**
- **Con:** 3x the deployment pipelines to manage
- **Con:** 3x the CI/CD configurations
- **Con:** 3x the hosting setups (currently GitHub Pages, future AWS)
- **Con:** Coordinated releases become complex
- **Con:** Testing across projects required for integration
- **Impact:** Significant operational overhead
- **Rating:** Major drawback (-8/10)

#### **Development Velocity**
- **Con:** Context switching between 3 projects for small team
- **Con:** Dependency updates must be propagated to all projects
- **Con:** Bug fixes in shared code affect multiple projects
- **Con:** Testing burden increases significantly
- **Impact:** Development slows down by 30-50%
- **Rating:** Critical for small team (-10/10)

#### **Epic 0 Complexity**
- **Con:** Backend migration must happen for ALL 3 projects
- **Con:** API design must serve all 3 projects
- **Con:** Database schema must support all 3 projects
- **Con:** Authentication must work across all 3 projects
- **Con:** Testing and stabilization effort triples
- **Impact:** Epic 0 timeline extends from 12 weeks to 20-30 weeks
- **Rating:** CRITICAL BLOCKER (-10/10)

#### **User Confusion**
- **Con:** Users expect one integrated tool, not 3 separate sites
- **Con:** "Why do I have to go to a different site?"
- **Con:** Saved calculations can't be accessed from other tools
- **Con:** Different URLs to remember/bookmark
- **Impact:** User satisfaction decreases
- **Rating:** Significant drawback (-7/10)

#### **Maintenance Burden**
- **Con:** Monitoring 3 separate deployments
- **Con:** Bug tracking across 3 projects
- **Con:** Documentation for 3 projects
- **Con:** Security updates for 3 projects
- **Impact:** Ongoing overhead increases 3x
- **Rating:** Major drawback (-8/10)

### 5.3 Decision Matrix

| Factor | Weight | Monolith Score | Split Score | Weighted Monolith | Weighted Split |
|--------|--------|----------------|-------------|-------------------|----------------|
| Development velocity | 10 | 8 | 3 | 80 | 30 |
| Ease of maintenance | 9 | 7 | 4 | 63 | 36 |
| User experience | 10 | 9 | 4 | 90 | 40 |
| Code organization | 5 | 6 | 8 | 30 | 40 |
| Deployment complexity | 8 | 8 | 3 | 64 | 24 |
| Epic 0 compatibility | 10 | 9 | 2 | 90 | 20 |
| Team size suitability | 10 | 9 | 3 | 90 | 30 |
| Future flexibility | 6 | 5 | 7 | 30 | 42 |
| **TOTAL** | **68** | - | - | **537** | **262** |

**Conclusion:** Monolith scores 2x higher than split architecture (537 vs 262).

---

## 6. Technical Architecture Options

### 6.1 Option 1: Separate Repos, Separate Deployments

**Structure:**
```
uc-calculator-main/          (GitHub repo 1)
├── Frontend A (main calculator)
└── Deployed to: calculator.example.com

self-employment-tool/        (GitHub repo 2)
├── Frontend B (SE tools)
└── Deployed to: se-accounts.example.com

other-tools/                 (GitHub repo 3)
├── Frontend C (budgeting, rehab)
└── Deployed to: tools.example.com

shared-packages/             (GitHub repo 4)
├── calculator-core (npm package)
├── lha-data-service (npm package)
└── ui-components (npm package)
```

**Pros:**
- Complete independence
- Clear ownership boundaries
- Can have different maintainers

**Cons:**
- Hardest to coordinate
- Shared packages become bottleneck
- Cross-project navigation difficult
- User experience fragmented
- Most operational overhead

**Backend Integration:** 3 separate frontends calling same API - manageable but complex

**Verdict:** ❌ **Not Recommended** - Too complex for current team size

### 6.2 Option 2: Monorepo with Multiple Apps

**Structure:**
```
uc-calculator-workspace/     (Single GitHub repo)
├── packages/
│   ├── calculator-main/     (React app)
│   ├── self-employment/     (React app)
│   ├── other-tools/         (React app)
│   ├── shared-core/         (npm package)
│   ├── shared-ui/           (npm package)
│   └── shared-data/         (npm package)
├── lerna.json or pnpm-workspace.yaml
└── Deployed to separate subdomains
```

**Pros:**
- Easier to share code
- Single repo for version control
- Coordinated releases possible
- Dependency management centralized

**Cons:**
- Still 3 separate builds
- Still 3 separate deployments
- Cross-project navigation still complex
- Monorepo tooling adds complexity (Lerna, Nx, Turborepo)

**Backend Integration:** 3 separate frontends calling same API

**Verdict:** ⚠️ **Possible but Not Ideal** - Better than Option 1, but still significant overhead

### 6.3 Option 3: Monolith with Feature Flags

**Structure:**
```
uc-calculator/               (Single GitHub repo)
├── src/
│   ├── components/          (all components)
│   ├── features/            (organized by feature)
│   │   ├── calculator/
│   │   ├── self-employment/
│   │   ├── budgeting/
│   │   └── rehabilitation/
│   ├── utils/               (shared utilities)
│   └── App.js               (single router)
├── .env.production          (feature flags)
└── Deployed to: calculator.example.com
```

**Pros:**
- Single codebase - easiest to manage
- Seamless user experience
- Shared code is trivial
- Single deployment pipeline
- Feature flags allow gradual rollout
- Cross-project navigation works perfectly
- Unified authentication/user management

**Cons:**
- Larger codebase (but not unmanageably large at 5-7k LOC)
- All features deployed together
- Can't scale projects independently (but not needed)

**Backend Integration:** Single frontend calling single API - simplest

**Verdict:** ✅ **RECOMMENDED** - Best fit for current team and roadmap

### 6.4 Option 4: Hybrid Approach (Future Consideration)

**Structure:**
```
Main Calculator (Monolith)
├── Core UC calculator
├── Housing tools
├── Help guides

Separate: Self-Employment Platform
├── Standalone product
├── Can be licensed independently
└── Calls same API for UC calculations

Separate: Budgeting Tool
├── Lightweight standalone tool
└── Optional integration with calculator
```

**When to Consider:**
- AFTER Epic 0 backend migration is complete
- AFTER user base grows significantly (500+ monthly active users)
- IF business model emerges for self-employment tool
- IF specific partners want white-label self-employment tool only

**Verdict:** ⏳ **Future Option** - Revisit in 12-18 months (Q2-Q3 2027)

---

## 7. Cross-Project Integration (If Splitting)

### 7.1 Navigation Between Projects

**Challenge:** Users expect seamless navigation, but projects are on different domains.

**Option A: Client-Side Links**
```javascript
// In Project A (calculator)
<Link to="https://se-accounts.example.com/monthly-profit">
  Monthly Profit Tool
</Link>
```
- **Pro:** Simple to implement
- **Con:** Full page reload, loses state
- **Con:** Session/auth must transfer across domains

**Option B: Iframe Integration**
```javascript
// In Project A
<iframe src="https://se-accounts.example.com/monthly-profit" />
```
- **Pro:** Keeps user in same context
- **Con:** Poor UX (scrolling, mobile issues)
- **Con:** SEO problems
- **Con:** Complex state management

**Option C: Micro-Frontend Architecture**
- Use single-spa, Module Federation, or similar
- **Pro:** Seamless integration
- **Con:** Significant complexity
- **Con:** Overkill for project size

**Recommendation:** If splitting, use Option A with shared authentication cookie.

### 7.2 Shared Authentication/Session

**Challenge:** User logs in to Project A, navigates to Project B - should stay logged in.

**Option A: SSO (OAuth/OpenID Connect)**
- Use Auth0, AWS Cognito, or self-hosted Keycloak
- **Pro:** Industry standard
- **Pro:** Works across domains
- **Con:** Significant implementation effort (2-3 weeks)
- **Con:** Ongoing costs (Auth0, Cognito)

**Option B: Shared Cookie Domain**
- Set cookie for `.example.com` domain
- All subdomains can read cookie
- **Pro:** Simple
- **Con:** Requires projects on same domain
- **Con:** Security considerations (CSRF)

**Option C: Token Passing via URL**
- Pass JWT token in URL when navigating
- **Con:** Security risk (token in URL)
- **Con:** Not recommended

**Recommendation:** If splitting, use Option A (SSO) for proper multi-app auth.

### 7.3 Consistent Branding and UX

**Approach:**
1. **Shared Design System**
   - Create `@uc-calculator/design-system` npm package
   - Contains CSS variables, React components, design tokens
   - Published to npm or private registry

2. **Shared Component Library**
   - Button, Input, Modal, Navigation components
   - Ensures visual consistency

3. **Shared CSS/SCSS**
   - Global styles, typography, colors
   - Imported by all projects

**Effort:** 2-3 weeks to extract and package, ongoing maintenance

### 7.4 Analytics and Monitoring Across Projects

**Challenge:** Need to track user journeys across multiple projects.

**Solutions:**
1. **Shared Analytics ID**
   - Use same Google Analytics property
   - Track cross-domain events

2. **User ID Tracking**
   - Associate events with user ID across projects

3. **Centralized Error Tracking**
   - Use Sentry or similar with shared project

4. **Custom Dashboard**
   - Aggregate metrics from all projects

**Effort:** 1-2 weeks setup, ongoing monitoring overhead

---

## 8. Deployment and DevOps

### 8.1 CI/CD for Multiple Projects

**Current (Monolith):**
```
main branch → GitHub Actions → npm run build → gh-pages deploy
```
**Simple, works well, rarely breaks**

**If Split (Monorepo):**
```
packages/calculator-main → build → deploy to calculator.example.com
packages/self-employment → build → deploy to se-accounts.example.com
packages/other-tools → build → deploy to tools.example.com
packages/shared-core → publish to npm → trigger rebuilds of consumers
```

**Complexity:**
- Detect which package changed
- Run appropriate builds
- Manage interdependencies
- Coordinate releases
- Handle shared package updates

**Tools:** Lerna, Nx, Turborepo, or custom GitHub Actions

**Effort:** 1-2 weeks setup, ongoing maintenance

### 8.2 Staging and Production Environments

**Current (Monolith):**
- Production: GitHub Pages
- Staging: Local testing only

**If Split:**
- Production: 3 separate deployments
- Staging: 3 separate staging environments
- Testing: Need to test integration between projects

**Infrastructure:**
```
Production:
- calculator.example.com
- se-accounts.example.com
- tools.example.com

Staging:
- staging-calculator.example.com
- staging-se-accounts.example.com
- staging-tools.example.com
```

**Cost:** 6x the hosting (if not static hosting)

### 8.3 Shared Infrastructure (AWS)

**After Epic 0 (Backend Migration):**

**Monolith Approach:**
```
Frontend: calculator.example.com (S3 + CloudFront)
API: api.example.com (Lambda + API Gateway)
Database: RDS PostgreSQL (single instance)
```

**Split Approach:**
```
Frontends:
- calculator.example.com (S3 + CloudFront)
- se-accounts.example.com (S3 + CloudFront)
- tools.example.com (S3 + CloudFront)

API: api.example.com (Lambda + API Gateway) - SHARED
Database: RDS PostgreSQL - SHARED

OR separate APIs per project (much more complex)
```

**Recommendation:** Keep API and Database shared even if frontends split.

### 8.4 Version Management and Release Coordination

**Challenge:** Shared packages need versioning, coordinated releases.

**Monolith:**
- Single version number
- Single CHANGELOG
- Simple

**Split:**
- Each project has own version
- Shared packages have own versions
- Coordinating breaking changes is complex
- Need semantic versioning strategy

**Example Breaking Change Scenario:**
1. calculator.js v2.0.0 released (breaking change)
2. Must update calculator-main v3.0.0
3. Must update self-employment v2.5.0
4. Must update other-tools v1.8.0
5. All must deploy together or maintain backwards compatibility

**Effort:** Ongoing complexity, slower release cycles

---

## 9. Resource and Timeline Implications

### 9.1 Effort Required for Splitting

**Preparation & Setup:** 3-4 weeks
- Dependency analysis: 0.5 weeks
- Monorepo setup (if chosen): 1 week
- Shared package extraction: 1.5 weeks
- CI/CD setup: 1 week

**Project Extraction:** 8-10 weeks
- Self-employment project: 3-4 weeks
- Other tools project: 2-3 weeks
- Cross-project integration: 2-3 weeks

**Testing & Stabilization:** 2-3 weeks
- Integration testing: 1 week
- User acceptance testing: 1 week
- Bug fixes: 1 week

**Total:** 13-17 weeks (3-4 months) of focused work

### 9.2 Skills Needed

**Required:**
- React expertise (have)
- Monorepo tooling (Lerna/Nx) - NEW SKILL
- DevOps/CI/CD - some learning required
- Cross-domain authentication (SSO) - NEW SKILL
- Package management (npm publishing) - NEW SKILL

**Challenge:** Small team (1-2 developers) learning new tools while splitting project.

### 9.3 Impact on Epic 0 (Backend Migration)

**Epic 0 Timeline (Current Plan):** 12 weeks

**If Monolith:**
- Single frontend to integrate with API
- Single authentication system
- Single database schema
- Timeline: 12 weeks as planned

**If Split (3 Projects):**
- 3 frontends to integrate with API
- Shared authentication across 3 frontends
- Database schema must serve all 3 projects
- 3x the testing and stabilization
- Timeline: **20-30 weeks** (5-7 months)

**Impact:** Epic 0 becomes 2-2.5x longer if project is split.

**Critical Insight:** Splitting before Epic 0 effectively delays the backend migration by 3-6 months.

### 9.4 Timeline Comparison

**Scenario A: Stay Monolith, Complete Epic 0**
```
Q4 2025 (Oct-Dec): Continue current development
Q1 2026 (Jan-Mar): Epic 0 - Backend migration (12 weeks)
Q2 2026 (Apr-Jun): Stabilization, Epic 2 (Pension/MACs), Epic 3 (CTR)
Q3 2026 (Jul-Sep): Epic 4 (BYR), Epic 6 (Performance)
Q4 2026 (Oct-Dec): Epic 7 (Mobile/PWA), Epic 5 (Rehabilitation)
Q1 2027 (Jan-Mar): Epic 8 (Public API)
```
**Result:** Roadmap complete by Q1 2027 as planned.

**Scenario B: Split Now, Then Complete Epic 0**
```
Q4 2025 (Oct-Dec): Split project into 3 (13-17 weeks) - ONLY HALFWAY DONE
Q1 2026 (Jan-Mar): Finish split, stabilization
Q2 2026 (Apr-Jun): Begin Epic 0 for Project A (12 weeks)
Q3 2026 (Jul-Sep): Epic 0 for Project B (10 weeks)
Q4 2026 (Oct-Dec): Epic 0 for Project C (8 weeks)
Q1 2027 (Jan-Mar): Stabilization, integration testing
Q2 2027 (Apr-Jun): Finally ready to continue roadmap...
```
**Result:** Roadmap delayed by 6-9 months.

### 9.5 Ongoing Maintenance Implications

**Current Maintenance (Monolith):** 4-6 hours/week
- Bug fixes
- Dependency updates
- Monitoring
- Rate updates (annual)

**If Split:** 12-18 hours/week (3x increase)
- Bug fixes across 3 projects
- Dependency updates for 3 projects + shared packages
- Monitoring 3 deployments
- Coordinating releases
- Managing shared package versions

**Impact:** Maintenance burden increases significantly, reducing capacity for new features.

---

## 10. Recommendation and Decision Framework

### 10.1 Primary Recommendation

### **DO NOT SPLIT THE PROJECT NOW**

**Rationale:**

1. **Epic 0 Blocker:** Backend migration in Q1 2026 is critical priority. Splitting beforehand makes it 2-3x more complex and delays by 6-9 months.

2. **Team Size:** 1-2 part-time developers cannot effectively manage 3 separate projects. Context switching and overhead would cripple development velocity.

3. **User Experience:** Current integrated experience is superior. Users expect seamless navigation between calculator, self-employment tools, and budgeting. Splitting fragments the UX.

4. **Code Size:** At 5,000-7,000 LOC, current codebase is not unmanageably large. Code organization can be improved with better folder structure without splitting.

5. **Shared Dependencies:** calculator.js, lhaDataService.js, and navigation are tightly coupled across "projects". Splitting creates significant duplication and coordination overhead.

6. **No Clear Business Driver:** There's no current business model or product separation that requires split deployment. All tools are complementary and free.

7. **Premature Optimization:** Splitting is optimizing for scale that doesn't exist yet (current user base unknown, but GitHub Pages deployment suggests small-medium scale).

### 10.2 Alternative: Improve Code Organization Within Monolith

Instead of splitting, reorganize the codebase:

```
src/
├── features/
│   ├── uc-calculator/
│   │   ├── components/
│   │   ├── utils/
│   │   └── data/
│   ├── self-employment/
│   │   ├── components/
│   │   ├── utils/
│   │   └── pages/
│   ├── budgeting-tool/
│   │   ├── components/
│   │   ├── services/
│   │   └── pages/
│   └── rehabilitation/
│       ├── components/
│       └── pages/
├── shared/
│   ├── components/ (Navigation, Logo, etc.)
│   ├── utils/ (formatters, calculator core)
│   ├── data/ (LHA rates, BRMA lists)
│   └── hooks/
├── infrastructure/
│   ├── auth/ (PasswordProtection, future auth)
│   ├── routing/ (App.js)
│   └── admin/ (AdminPanel, etc.)
└── App.js
```

**Benefits:**
- Clear feature boundaries
- Easy to navigate codebase
- Preparation for potential future split
- No operational overhead
- Maintains integrated UX
- Compatible with Epic 0

**Effort:** 1-2 weeks of refactoring

### 10.3 When to Revisit Splitting Decision

**Reconsider splitting if:**

1. **After Epic 0 is complete** (Q2 2026 earliest)
   - Backend, API, and database are established
   - Authentication system works
   - User accounts and saved scenarios implemented

2. **User base grows significantly** (500+ monthly active users)
   - Performance or scaling concerns emerge
   - Different user segments identified

3. **Business model emerges for specific product**
   - Self-employment tool generates revenue
   - Partner wants white-label deployment
   - Licensing opportunities arise

4. **Team grows to 3+ developers**
   - Parallel development becomes feasible
   - Dedicated ownership per project possible

5. **Technical complexity becomes problematic**
   - Codebase exceeds 15,000-20,000 LOC
   - Deploy conflicts become frequent
   - Feature development slows due to monolith

**Next Review Date:** Q2 2026 (after Epic 0)

### 10.4 Decision Criteria Framework

Use this framework to evaluate whether to split:

| Criterion | Threshold for Splitting | Current Status |
|-----------|-------------------------|----------------|
| Team size | 3+ full-time developers | ❌ 1-2 part-time |
| Codebase size | >15,000 LOC | ❌ 5,000-7,000 LOC |
| User base | >1,000 monthly active | ❓ Unknown (likely <500) |
| Backend architecture | Established | ❌ Planned for Q1 2026 |
| Business model | Separate pricing/licensing | ❌ All free, no business model |
| Deploy frequency | Multiple per week | ❌ Infrequent (monthly?) |
| Performance issues | Page load >5 seconds | ❌ Fast (static site) |
| Feature conflicts | Frequent merge conflicts | ❌ Rare (small team) |
| User segments | Distinct non-overlapping | ❌ Overlapping (advisors use all) |
| Operational capacity | Team can handle 3 projects | ❌ Stretched with 1 project |

**Score:** 0/10 criteria met for splitting

---

## 11. Conclusion

### 11.1 Summary

The Universal Credit Calculator project is currently a well-organized monolith of 5,000-7,000 lines of code deployed to GitHub Pages. While the codebase contains distinct feature areas (UC calculator, self-employment tools, budgeting tool, rehabilitation services), these features share significant infrastructure and dependencies.

**Analysis shows splitting the project into 3 separate applications would:**
- Increase operational overhead by 3x
- Delay the critical backend migration (Epic 0) by 6-9 months
- Fragment user experience across multiple domains
- Require learning new tools (monorepo, SSO, cross-domain auth)
- Burden small development team (1-2 part-time developers)
- Provide minimal benefits given current scale and team size

**The current monolithic architecture is appropriate because:**
- Codebase size is manageable (5,000-7,000 LOC)
- Features are complementary and users benefit from integration
- Shared dependencies (calculator.js, LHA data) would require duplication or complex sharing
- Backend migration is imminent and will fundamentally change architecture
- Team size is too small to manage multiple projects effectively
- No business driver exists for separate deployments

### 11.2 Final Recommendation

**Stay Monolith Until Q2 2026 (After Epic 0)**

**Immediate Actions:**
1. ✅ **Reorganize codebase** within monolith using feature-based folder structure (1-2 weeks)
2. ✅ **Continue with current roadmap** - prioritize Epic 0 (backend migration)
3. ✅ **Document architecture** to prepare for potential future split
4. ✅ **Implement feature flags** for gradual rollout of new features
5. ✅ **Monitor metrics** to determine if/when splitting becomes necessary

**Q2 2026 Review:**
- Assess whether backend migration was successful
- Evaluate user base growth and segmentation
- Reconsider splitting if business model emerges
- Check team size and capacity

**If Future Split is Pursued:**
- Use monorepo approach (Option 2)
- Extract self-employment tool first
- Maintain shared API and database
- Implement SSO for authentication
- Budget 3-4 months for migration

### 11.3 Next Steps

1. **Share this analysis** with project owner (Phil Agulnik) for review
2. **Discuss concerns** about current architecture and confirm priorities
3. **Plan codebase reorganization** if approved (1-2 weeks)
4. **Focus on Epic 0** as the critical path forward
5. **Set calendar reminder** for Q2 2026 to revisit splitting decision

---

## Appendix A: Detailed File Dependency Graph

```
calculator.js (CORE - 859 lines)
├── Used by:
│   ├── CalculatorPage.js
│   ├── SelfEmploymentIncomeMaximisation.js
│   ├── RehabilitationCalculatorView.js
│   ├── MonthlyProfitTool.js (for UC calculations)
│   └── MIFCalculatorTool.js (indirectly)
└── Imports:
    └── lhaDataService.js

lhaDataService.js
├── Used by:
│   ├── calculator.js (housing element calculation)
│   ├── AffordabilityMap.js (map visualization)
│   └── CalculatorPage.js (BRMA selection)
└── Imports:
    ├── brmaListEngland.json
    ├── brmaListScotland.json
    ├── brmaListWales.json
    └── lhaRates2025_26.json

Navigation.js
├── Used by: ALL pages/components (20+ files)
└── Imports:
    └── react-router-dom

formatters.js
├── Used by: ALL components that display currency (15+ files)
└── No dependencies

skinManager.js
├── Used by:
│   ├── App.js
│   ├── RehabilitationHub.js
│   ├── CalculatorPage.js
│   └── AdminPanel.js
└── Manages: CSS classes and theme switching

textManager.js
├── Used by:
│   ├── SelfEmploymentHub.js (via useTextManager hook)
│   └── Other components for customizable text
└── Manages: Customizable text content
```

## Appendix B: Estimation Breakdown

### If Splitting Project

**Preparation Phase (3-4 weeks):**
- Dependency mapping: 4-6 hours
- Monorepo setup: 8-12 hours
- Extract calculator.js to package: 8-12 hours
- Extract lhaDataService to package: 4-6 hours
- Extract shared UI components: 12-16 hours
- CI/CD setup: 12-16 hours
- Testing: 8-12 hours
**Total:** 56-80 hours

**Self-Employment Project (3-4 weeks):**
- Create new project structure: 4 hours
- Move components: 8-12 hours
- Set up routing: 4-6 hours
- Configure build: 4-6 hours
- Implement cross-project navigation: 8-12 hours
- Set up deployment: 4-6 hours
- Testing: 12-16 hours
- Bug fixes: 8-12 hours
**Total:** 52-74 hours

**Other Tools Project (2-3 weeks):**
- Create project structure: 4 hours
- Move components: 6-8 hours
- Set up routing: 4 hours
- Configure build: 4 hours
- Navigation: 6-8 hours
- Deployment: 4 hours
- Testing: 8-12 hours
- Bug fixes: 6-10 hours
**Total:** 42-58 hours

**Integration & Polish (2-3 weeks):**
- Shared authentication: 12-16 hours
- Cross-project state management: 8-12 hours
- Design system consistency: 8-12 hours
- Analytics setup: 4-6 hours
- Documentation: 8-12 hours
- User testing: 8-12 hours
- Bug fixes: 12-16 hours
**Total:** 60-86 hours

**Grand Total:** 210-298 hours (26-37 working days)

With 1-2 part-time developers (10-20 hours/week):
- **Best case:** 11 weeks
- **Realistic:** 15-20 weeks
- **With Epic 0 interference:** 20-30 weeks

## Appendix C: Backend Architecture Impact

### Monolith + Backend (Epic 0)

```
Frontend (Single React App)
    ↓ HTTPS
API (Lambda + API Gateway)
    ↓
AWS RDS PostgreSQL
```

**Complexity:** Low
**Implementation:** 12 weeks
**Maintenance:** Low

### Split Projects + Backend

```
Frontend A (Calculator)
    ↓ HTTPS
Frontend B (Self-Employment) → API (Lambda + API Gateway)
    ↓ HTTPS                       ↓
Frontend C (Other Tools)      AWS RDS PostgreSQL
    ↓ HTTPS
    ↓
SSO/Auth Service (required)
```

**Complexity:** High
**Implementation:** 20-30 weeks
**Maintenance:** High
**Additional Infrastructure:**
- SSO/Auth service (Auth0, Cognito, or self-hosted)
- Cross-origin resource sharing (CORS) configuration
- Session management across domains
- Shared API versioning strategy

---

**END OF ANALYSIS**

**Document Approval:**
- [ ] Project Owner Review (Phil Agulnik)
- [ ] Development Team Feedback
- [ ] Decision Recorded

**Next Review:** Q2 2026 (April-June 2026)
