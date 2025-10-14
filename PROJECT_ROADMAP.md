# Universal Credit Calculator Project Roadmap
## Strategic Planning Document (Q1 2026 - Q1 2027)

---

## Executive Summary

### Project Vision
Deliver a comprehensive, accurate, and user-friendly Universal Credit Calculator ecosystem that empowers advisors and claimants to understand their benefit entitlements and navigate the UK benefits system with confidence.

### Key Stakeholders
- **Primary Users**: Benefits advisors, support workers, employment coaches
- **Secondary Users**: Universal Credit claimants (self-service)
- **Development Team**: 1-2 developers (part-time)
- **Project Owner**: Phil Agulnik

### Success Criteria
1. 95%+ calculation accuracy validated against DWP test cases
2. All major UC scenarios handled correctly
3. 85%+ user satisfaction score
4. Sub-2 second calculation response time
5. 99%+ uptime for hosted calculator
6. 80%+ code coverage with automated tests
7. 500+ monthly active users by Q1 2027

### High-Level Timeline
- **Q1 2026**: Foundation & Architecture Migration (Testing, API, Database)
- **Q2 2026**: Core Enhancements (Pension age, MACs, CTR)
- **Q3 2026**: Advanced Features (BYR integration, performance)
- **Q4 2026**: Optimization (UX, mobile, accessibility)
- **Q1 2027**: Expansion (Public API, integrations)

---

## Current State Analysis

### What's Working Well
- **Feature-based architecture** - Recently reorganized (October 2024) for better maintainability
- Modern React architecture with component modularity
- Year-based rate system (2023-26) for historical calculations
- Comprehensive calculator covering major UC elements
- Deployed to GitHub Pages
- Router-based navigation with 15+ tools/pages
- Core calculator with standard allowances, child elements, LCWRA, carer elements
- Self-employment support (accounts, tax forms, MIF calculator)
- Budgeting tool with admin configuration
- Robust data services (LHA, ONS, benefits)
- Clear separation of concerns (UC calculator, self-employment, budgeting, rehabilitation, help guides)

### What Needs Improvement
- **Critical**: No automated test suite (0% coverage)
- **Critical**: Frontend-only architecture limiting scalability
- **Critical**: No backend API or database
- Multiple test case CSV files indicate ongoing calculation issues
- Pension age calculations incomplete
- MACs not implemented
- Mobile responsiveness needs testing
- Large, complex component files
- Split calculation logic across multiple files
- No CI/CD pipeline, monitoring, or error tracking
- All calculation logic exposed in browser

### Technical Debt Priority

**Critical (Phase 1)**
1. Architecture migration to Frontend-API-Database (8-12 weeks)
2. Testing infrastructure setup
3. Calculation accuracy fixes
4. Component refactoring

**High (Next 3-6 months)**
1. State management standardization
2. Code documentation
3. Performance optimization
4. Accessibility compliance

**Medium/Low (6-12 months)**
1. TypeScript migration
2. Build optimization
3. Internationalization framework

---

## Future State Vision

### Target Architecture: Frontend-API-Database

**Frontend Layer** (React SPA)
- User interface and presentation logic
- Client-side validation and UX
- Responsive design and accessibility
- PWA capabilities
- Communicates with API via REST

**API Layer** (Node.js/Express on AWS)
- Business logic and calculation engine
- User authentication and authorization
- Data orchestration and validation
- Rate and rule management
- Integration endpoints
- Server-side PDF generation, email notifications

**Database Layer** (AWS RDS PostgreSQL)
- User accounts and profiles
- Saved calculation scenarios
- Calculation history and audit trails
- Reference data (LHA rates, benefit rules, CTR schemes)
- Rate versioning
- Analytics and usage tracking

**Benefits of Migration**
- Data persistence across devices
- Secure server-side logic
- Centralized rate/rule management
- User accounts and saved scenarios
- Server-side capabilities (PDF, email)
- Analytics and usage insights
- API for third-party integrations
- Audit trails for advisors
- Better testing infrastructure

**AWS Infrastructure**
- **Frontend**: AWS S3 + CloudFront (static hosting)
- **API**: AWS Lambda + API Gateway (serverless) or AWS EC2
- **Database**: AWS RDS PostgreSQL
- **Monitoring**: AWS CloudWatch
- **Storage**: AWS S3 for backups and file storage

**Migration Strategy**
- Phased approach with incremental migration
- Feature flags for gradual rollout
- Maintain backward compatibility
- Start with read-only API, then add calculations
- Finally migrate user features
- Parallel run period for stability

---

## Future Tasks (Prioritized Backlog)

### Epic 0: Architecture Migration to Frontend-API-Database
**Business Value**: Critical - Foundational infrastructure | **Size**: XL (8-12 weeks) | **Risk**: High

#### Phase 1: Architecture Design and Planning (Weeks 1-2)
- **T0.1**: Architecture design and AWS technology selection [M - 1 week]
- **T0.2**: Database schema design [M - 1 week]
- **T0.3**: API contract definition [S - 0.5 weeks]
- **T0.4**: AWS infrastructure planning [S - 0.5 weeks]

#### Phase 2: Backend Foundation (Weeks 3-5)
- **T0.5**: Backend project setup (Node.js/Express) [M - 1 week]
- **T0.6**: AWS RDS database setup and migrations [M - 1 week]
- **T0.7**: Authentication system (JWT) [M - 1.5 weeks]

#### Phase 3: Core API Development (Weeks 6-8)
- **T0.8**: Reference data API [M - 1.5 weeks]
- **T0.9**: Calculation API [L - 2 weeks]
- **T0.10**: User scenarios API [M - 1.5 weeks]

#### Phase 4: Security and Infrastructure (Weeks 9-10)
- **T0.11**: Security hardening [M - 1 week]
- **T0.12**: AWS infrastructure deployment [M - 1.5 weeks]
- **T0.13**: API documentation [S - 0.5 weeks]

#### Phase 5: Frontend Integration (Weeks 11-12)
- **T0.14**: Frontend API client [M - 1 week]
- **T0.15**: Migrate features to API [M - 1.5 weeks]
- **T0.16**: Data migration and deployment [M - 1 week]
- **T0.17**: Testing and stabilization [M - 1 week]

**Deliverables**: Backend API, AWS RDS database, user authentication, calculation endpoints, saved scenarios, reference data API, frontend integration, API documentation, AWS deployment pipeline, monitoring infrastructure

**Technology Stack**: Node.js + Express, AWS RDS PostgreSQL, Prisma (ORM), JWT with httpOnly cookies, AWS Lambda + API Gateway or AWS EC2, AWS S3 + CloudFront

---

### Epic 1: Testing System Improvements
**Business Value**: Critical - Foundation for reliability | **Size**: XL (8-10 weeks) | **Risk**: Low

#### Phase 1: Foundation (Weeks 1-2)
- **T1.1**: Set up Jest and React Testing Library [S - 0.5 weeks]
- **T1.2**: Configure test environment [S - 0.5 weeks]
- **T1.3**: Create smoke tests [S - 0.5 weeks]
- **T1.4**: Set up GitHub Actions CI/CD [M - 1 week]
- **T1.5**: Configure code coverage reporting [S - 0.5 weeks]

#### Phase 2: Core Calculator Testing (Weeks 3-5)
- **T1.6**: Unit tests for calculator.js [L - 2 weeks]
- **T1.7**: Unit tests for benefitCalculator.js [M - 1 week]
- **T1.8**: Unit tests for childBenefitCalculator.js [M - 1 week]
- **T1.9**: Unit tests for pensionAgeCalculator.js [S - 0.5 weeks]
- **T1.10**: Validate against DWP test cases [M - 1.5 weeks]
- **T1.11**: Target 80% coverage for utils/ [Ongoing]

#### Phase 3: Component Testing (Weeks 6-7)
- **T1.12-16**: Test core components [M - 2.5 weeks total]

#### Phase 4: Integration Testing (Week 8)
- **T1.17**: Test CalculatorPage end-to-end [M - 1 week]
- **T1.18**: Test data service integrations [M - 1 week]
- **T1.19**: Test navigation and routing [S - 0.5 weeks]

#### Phase 5: E2E Testing (Weeks 9-10)
- **T1.20**: Set up Playwright [M - 1 week]
- **T1.21**: Create critical user journey tests [M - 1.5 weeks]
- **T1.22**: Performance testing [S - 0.5 weeks]
- **T1.23**: Accessibility testing automation [M - 1 week]

**Deliverables**: Test infrastructure, 80%+ coverage, CI/CD pipeline, test documentation

---

### Epic 2: Pension Age and MACs Implementation
**Business Value**: High - Required for accurate calculations | **Size**: M (3-4 weeks) | **Risk**: Medium

#### Tasks
- **T2.1**: Research MACs definition and rules [S - 0.5 weeks]
- **T2.2**: Implement pension age calculation enhancement [M - 1 week]
- **T2.3**: Implement MACs calculation logic [M - 1.5 weeks]
- **T2.4**: Update UI for pension age scenarios [M - 1 week]
- **T2.5**: Testing and validation [M - 1 week]

**Deliverables**: Accurate pension age detection, MACs implementation, UI updates, documentation, test coverage

---

### Epic 3: Council Tax Reduction (CTR) Calculator
**Business Value**: High - Significant household income impact | **Size**: L (5-6 weeks) | **Risk**: High

#### Research Phase (Week 1)
- **T3.1**: Research CTR schemes and variations [M - 1 week]

#### Core Development (Weeks 2-4)
- **T3.2**: Create CTR calculation engine [L - 2 weeks]
- **T3.3**: Build CTR calculator UI component [M - 1.5 weeks]
- **T3.4**: Local authority integration [M - 1.5 weeks]

#### Integration (Week 5)
- **T3.5**: Integrate CTR with main calculator [M - 1 week]
- **T3.6**: Create CTR help guide [S - 0.5 weeks]

#### Testing & Launch (Week 6)
- **T3.7**: CTR testing and validation [M - 1.5 weeks]

**Deliverables**: Standalone CTR calculator, integration with UC calculator, CTR help guide, LA data service, test coverage

**Known Limitations**: Standard CTR calculation (90%+ users); LA-specific variations require phased rollout

---

### Epic 4: BYR (Benefits You Receive) Page Enhancements
**Business Value**: Medium - Improves user journey | **Size**: M (3-4 weeks) | **Risk**: Low

#### Tasks
- **T4.1**: Audit current BYR implementation [S - 0.5 weeks]
- **T4.2**: Define enhancement requirements [S - 0.5 weeks]
- **T4.3**: Implement BYR data integration [M - 1.5 weeks]
- **T4.4**: Enhanced benefit lookup [M - 1 week]
- **T4.5**: UI/UX improvements [M - 1 week]
- **T4.6**: Integration with main calculator [M - 1 week]
- **T4.7**: Testing and documentation [S - 0.5 weeks]

**Deliverables**: Enhanced BYR pages, integration with calculator, data import/export, documentation

---

### Epic 5: Rehabilitation Services and Help Guide Expansion
**Business Value**: Medium - Social impact for vulnerable users | **Size**: S (2 weeks) | **Risk**: Low

#### Tasks
- **T5.1**: Expand rehabilitation services content [S - 0.5 weeks]
- **T5.2**: Prison leavers guide enhancement [S - 0.5 weeks]
- **T5.3**: Additional help guides [M - 1 week]
- **T5.4**: Help guide improvements [S - 0.5 weeks]

**Deliverables**: Enhanced rehabilitation services, updated prison leavers guide, 4+ new help guides, improved navigation, printable PDFs

---

### Epic 6: Performance Optimization and Technical Improvements
**Business Value**: Medium - Improves UX and maintainability | **Size**: M (3-4 weeks) | **Risk**: Low

#### Tasks
- **T6.1**: Component refactoring [M - 1.5 weeks]
- **T6.2**: State management improvement [M - 1 week]
- **T6.3**: Code documentation [S - 0.5 weeks]
- **T6.4**: Bundle optimization [M - 1 week]
- **T6.5**: Runtime performance [S - 0.5 weeks]
- **T6.6**: Error tracking and monitoring [M - 1 week]
- **T6.7**: Development tooling [S - 0.5 weeks]

**Deliverables**: Refactored components, improved state management, comprehensive documentation, optimized bundle, error tracking, enhanced tooling

---

### Epic 7: Mobile Optimization and Progressive Web App
**Business Value**: High - Many users access on mobile | **Size**: M (3 weeks) | **Risk**: Low

#### Tasks
- **T7.1**: Mobile UX audit and fixes [M - 1.5 weeks]
- **T7.2**: PWA implementation [M - 1 week]
- **T7.3**: Mobile-specific features [S - 0.5 weeks]

**Deliverables**: Mobile-optimized UI, PWA with offline support, improved mobile UX, install prompt

---

### Epic 8: API and Integration Layer
**Business Value**: High - Enables third-party integrations | **Size**: L (5-6 weeks) | **Risk**: Medium

#### Tasks
- **T8.1**: Design API architecture [S - 0.5 weeks]
- **T8.2**: Build calculation API [L - 2 weeks]
- **T8.3**: API authentication and security [M - 1 week]
- **T8.4**: Webhook support [M - 1 week]
- **T8.5**: Third-party integrations [M - 1.5 weeks]
- **T8.6**: API documentation [M - 1 week]
- **T8.7**: API testing and launch [M - 1 week]

**Deliverables**: REST API, authentication and security, comprehensive documentation, integration examples, API sandbox

**AWS Infrastructure**: AWS Lambda + API Gateway for serverless API, AWS RDS for data, AWS CloudWatch for monitoring

---

### Epic 9: Additional Features and Enhancements
**Business Value**: Medium - Nice-to-have features | **Size**: Variable | **Risk**: Low

#### Data and Reporting
- **T9.1**: Saved scenarios enhancement [S - 0.5 weeks]
- **T9.2**: Report generation [M - 1 week]
- **T9.3**: Examples section activation [S - 0.5 weeks]

#### Admin and Configuration
- **T9.4**: Admin panel enhancements [M - 1 week]
- **T9.5**: White-label improvements [M - 1 week]

#### User Experience
- **T9.6**: Guided calculator workflows [M - 1.5 weeks]
- **T9.7**: Accessibility audit and fixes [M - 1.5 weeks]

---

## Phased Delivery Plan

### Phase 1: Q1 2026 (January - March) - Foundation & Architecture Migration
**Theme**: Architectural migration + testing foundation | **Duration**: 13 weeks | **Effort**: 80-100 hours

#### Goals
- Architecture migration to Frontend-API-Database complete
- Backend API and AWS RDS database live
- User authentication and saved scenarios functional
- Frontend integrated with API
- CI/CD pipeline operational

#### Sprint Breakdown

**Sprint 1 (Weeks 1-3): Architecture & Backend Foundation**
- Architecture design and planning (T0.1-0.4)
- Backend project setup (T0.5)
- AWS RDS database setup (T0.6)
- Backend testing setup (T1.1-1.3 adapted)
- Buffer: 25%

**Sprint 2 (Weeks 4-6): Authentication & Core API**
- Authentication system (T0.7)
- Reference data API (T0.8 started)
- Frontend testing setup (T1.1-1.5)
- GitHub Actions CI/CD (T1.4)
- Buffer: 25%

**Sprint 3 (Weeks 7-9): API Development & Testing**
- Complete reference data API (T0.8)
- Calculation API (T0.9)
- User scenarios API (T0.10)
- Backend unit tests
- API documentation (T0.13)
- Buffer: 30%

**Sprint 4 (Weeks 10-13): Security, Infrastructure & Integration**
- Security hardening (T0.11)
- AWS infrastructure deployment (T0.12)
- Frontend API client (T0.14)
- Migrate features to API (T0.15)
- Data migration (T0.16)
- Integration testing (T0.17)
- Frontend testing (T1.6-1.8 partial)
- Buffer: 35%

#### Success Metrics
- Backend API live and responding
- AWS RDS database operational
- User authentication working
- 3+ core calculation endpoints operational
- Saved scenarios migrated to database
- Frontend integrated with API
- CI/CD pipeline running
- 40% code coverage achieved
- API response time < 500ms (95th percentile)
- Zero P0 bugs
- AWS CloudWatch monitoring operational
- Database backups configured

---

### Phase 2: Q2 2026 (April - June) - Core Enhancements & Stabilization
**Theme**: Stabilize architecture and add calculation capabilities | **Duration**: 13 weeks | **Effort**: 60-75 hours

#### Goals
- Architecture stabilization
- Pension age and MACs implemented
- CTR calculator live
- Testing coverage at 60%+

#### Sprint Breakdown

**Sprint 5 (Weeks 14-16): Architecture Stabilization**
- Bug fixes from Phase 1
- API performance optimization
- AWS RDS query optimization
- Monitoring and alerting setup
- Backend test coverage improvement
- Buffer: 25%

**Sprint 6 (Weeks 17-19): Pension Age & MACs**
- Research MACs requirements (T2.1)
- Implement pension age enhancements (T2.2)
- Implement MACs calculation (T2.3)
- Update UI (T2.4)
- Testing and validation (T2.5)
- Buffer: 25%

**Sprint 7 (Weeks 20-22): CTR Development**
- CTR research (T3.1)
- CTR calculation engine (T3.2)
- CTR UI component (T3.3)
- LA integration (T3.4)
- Buffer: 25%

**Sprint 8 (Weeks 23-26): CTR Integration & Testing**
- Main calculator integration (T3.5)
- CTR help guide (T3.6)
- CTR testing (T3.7)
- Integration testing (T1.17-1.19)
- Buffer: 30%

#### Success Metrics
- Architecture stable with <1% error rate
- Pension age calculations validated
- MACs implementation verified
- CTR calculator live
- 60% code coverage
- API response time <300ms (95th percentile)
- 100+ users migrated
- AWS RDS performance optimized

---

### Phase 3: Q3 2026 (July - September) - Advanced Features & Performance
**Theme**: Performance optimization, BYR integration, code quality | **Duration**: 13 weeks | **Effort**: 50-60 hours

#### Goals
- Performance optimization complete
- BYR pages enhanced with database integration
- Testing coverage at 70%+
- E2E testing implemented

#### Sprint Breakdown

**Sprint 9 (Weeks 27-29): BYR Enhancement & Integration**
- BYR analysis (T4.1-4.2)
- BYR data integration with API (T4.3)
- Enhanced benefit lookup (T4.4)
- Buffer: 20%

**Sprint 10 (Weeks 30-32): BYR & Performance**
- BYR UI/UX improvements (T4.5)
- BYR integration (T4.6-4.7)
- Component refactoring (T6.1)
- State management improvement (T6.2)
- Buffer: 25%

**Sprint 11 (Weeks 33-35): Performance & Testing**
- Bundle optimization (T6.4)
- API performance optimization (T6.5)
- AWS RDS query optimization
- E2E test setup (T1.20)
- Critical user journey tests (T1.21)
- Buffer: 25%

**Sprint 12 (Weeks 36-39): Quality & Infrastructure**
- Performance testing (T1.22)
- Accessibility testing (T1.23)
- Enhanced monitoring (T6.6)
- Development tooling (T6.7)
- Code documentation (T6.3)
- Buffer: 30%

#### Success Metrics
- 70% code coverage
- BYR integration complete
- Bundle size reduced by 25%
- Page load time under 2 seconds
- API response time under 200ms (95th percentile)
- Error tracking operational
- 10+ critical journeys covered by E2E tests

---

### Phase 4: Q4 2026 (October - December) - User Experience & Accessibility
**Theme**: Polish, accessibility, user experience | **Duration**: 13 weeks | **Effort**: 40-50 hours

#### Goals
- Rehabilitation services enhanced
- Mobile optimization complete
- PWA launched
- Accessibility compliance

#### Sprint Breakdown

**Sprint 13 (Weeks 40-42): Content & Guides**
- Rehabilitation services expansion (T5.1)
- Prison leavers guide update (T5.2)
- Additional help guides (T5.3)
- Help guide improvements (T5.4)
- Buffer: 20%

**Sprint 14 (Weeks 43-45): Mobile PWA**
- Mobile optimization (T7.1)
- PWA implementation (T7.2)
- Mobile-specific features (T7.3)
- Buffer: 25%

**Sprint 15 (Weeks 46-48): UX & Accessibility**
- Guided workflows (T9.6)
- Accessibility audit (T9.7)
- Examples section activation (T9.3)
- Buffer: 25%

**Sprint 16 (Weeks 49-52): Polish & Prepare**
- User testing and feedback
- Bug fixes
- Documentation updates
- Buffer: 30%

#### Success Metrics
- PWA installable
- WCAG 2.1 AA compliance verified
- Mobile user satisfaction 80%+
- Help guide usage increased 100%
- Time to complete calculation reduced 20%

---

### Phase 5: Q1 2027 (January - March) - Public API & Third-Party Integrations
**Theme**: Public API launch and third-party integrations | **Duration**: 13 weeks | **Effort**: 50-65 hours

#### Goals
- Public API launched
- API partners onboarded
- Admin and reporting enhanced
- Documentation complete
- Sustainability plan

#### Sprint Breakdown

**Sprint 17 (Weeks 53-55): Public API Preparation**
- Public API architecture (T8.1 adapted)
- API key management
- Partner authentication (T8.3 enhanced)
- Rate limiting and quotas
- Enhanced saved scenarios (T9.1)
- Buffer: 20%

**Sprint 18 (Weeks 56-58): API Features & Admin**
- Webhook support (T8.4)
- API usage analytics
- Admin panel enhancements (T9.4)
- Report generation (T9.2)
- Buffer: 25%

**Sprint 19 (Weeks 59-61): Integrations & Documentation**
- Third-party integrations (T8.5)
- Public API documentation (T8.6)
- White-label improvements (T9.5)
- Partner onboarding process
- Buffer: 25%

**Sprint 20 (Weeks 62-65): Launch & Sustainability**
- Public API testing and launch (T8.7)
- Partner onboarding
- Documentation finalization
- AWS infrastructure optimization
- Long-term maintenance plan
- Buffer: 30%

#### Success Metrics
- Public API live and documented
- 3+ integration partners onboarded
- API usage at 1000+ requests/day
- Admin panel deployed
- Enhanced reporting live
- Sustainability plan approved
- Project goals achieved

---

## Resource Planning

### Current Team Composition

**Developers**:
- Phil Agulnik (Lead Developer / Domain Expert)
  - Availability: 10-15 hours/week
  - Skills: React, benefits domain knowledge, full-stack
  - Role: Architecture, complex features, domain logic

- Additional Developer (if available)
  - Availability: 5-10 hours/week
  - Skills needed: React, testing, frontend development
  - Role: Testing, UI components, bug fixes

### Skills Required by Phase

**Phase 1 (Q1 2026)**: Backend development (Node.js/Express), Database design (AWS RDS PostgreSQL), API design (REST), Authentication/security (JWT), AWS deployment, Testing (Jest), CI/CD (GitHub Actions), ORM (Prisma)

**Phase 2 (Q2 2026)**: AWS infrastructure optimization, Database performance tuning, Benefits domain knowledge, React/state management, API integration

**Phase 3 (Q3 2026)**: Performance optimization (backend/frontend), AWS RDS query optimization, E2E testing, Code quality/refactoring

**Phase 4 (Q4 2026)**: Accessibility (WCAG 2.1), UX design, PWA development, Content writing

**Phase 5 (Q1 2027)**: Public API design, API security/rate limiting, Partner onboarding, API documentation, AWS infrastructure scaling

### Capacity Analysis

**Available Capacity**: 10-20 hours/week × 52 weeks = 520-1040 hours/year
With 30% buffer: 364-728 productive hours

**Estimated Work**:
- Epic 0 (Architecture): 80-100 hours
- Epic 1 (Testing): 80-100 hours
- Epic 2 (Pension/MACs): 30-40 hours
- Epic 3 (CTR): 50-60 hours
- Epic 4 (BYR): 30-40 hours
- Epic 5 (Rehabilitation): 15-20 hours
- Epic 6 (Performance): 30-40 hours
- Epic 7 (Mobile PWA): 25-30 hours
- Epic 8 (Public API): 40-50 hours
- Epic 9 (Various): 40-60 hours

**Total Estimated**: 420-540 hours (within capacity)

### Recommendations

**Immediate (Q1 2026)**
- **CRITICAL**: Backend developer skills (Node.js/Express) required
- **CRITICAL**: AWS infrastructure skills required
- **CRITICAL**: Database administration skills (AWS RDS PostgreSQL) required
- Consider hiring backend consultant for architecture setup (20-40 hours)
- Upskill current team on backend development
- Consider testing specialist consultation (10-20 hours)

**Short-term (Q2-Q3 2026)**
- UX/design consultation for CTR calculator (5-10 hours)
- Accessibility consultant for compliance (10-15 hours)
- Community contributions for help guide content

**Long-term (Q4 2026-Q1 2027)**
- AWS infrastructure optimization support
- Technical writer for public API documentation
- Security consultant for public API audit

---

## Risk Register

### Technical Risks

#### RISK-T1: Testing Implementation Challenges
**Likelihood**: Medium | **Impact**: High | **Phase**: Q1 2026

**Mitigation**: Start with simple smoke tests; engage testing expert; break into smaller chunks; accept lower initial coverage (60%); use CSV test cases as integration suite

**Contingency**: Defer component testing to Phase 2; focus only on core calculator unit tests in Phase 1

---

#### RISK-T2: Calculation Accuracy Issues
**Likelihood**: High | **Impact**: Critical | **Phase**: All phases

**Mitigation**: Thorough research of DWP guidelines; comprehensive test cases; consult with benefits advisors; implement calculation logging; build audit trail in UI

**Contingency**: Create "known issues" documentation and UI warnings; add manual override for advisors

---

#### RISK-T3: CTR Local Authority Variations
**Likelihood**: High | **Impact**: Medium | **Phase**: Q2 2026

**Mitigation**: Implement standard calculation only initially; clear disclaimers; create framework for LA-specific rules; focus on 20-30 largest LAs; allow user overrides

**Contingency**: Pivot to "CTR estimator" with disclaimers; provide links to LA-specific calculators

---

#### RISK-T4: Architecture Migration Complexity
**Likelihood**: High | **Impact**: Critical | **Phase**: Q1 2026

**Mitigation**: Phased approach; thorough planning; consider hiring consultant; use proven technology stacks; start simple; feature flags; maintain frontend fallback; comprehensive testing; regular checkpoints

**Contingency**: Reassess scope (minimal backend only); extend timeline; seek external expertise; if not feasible, revert to frontend-only

---

#### RISK-T5: Performance Degradation
**Likelihood**: Medium | **Impact**: Medium | **Phase**: Q1 2026 onwards

**Mitigation**: Establish performance baselines; implement aggressive caching (Redis); optimize AWS RDS queries with indexes; use CloudFront CDN; implement API response caching; monitor response times; performance testing in CI/CD

**Performance Targets**: API response <300ms (95th), Database queries <50ms (95th), Page load <2 seconds, Calculation complete <1 second

**Contingency**: Implement caching strategy; move calculation logic to frontend where possible; use service workers; optimize database; upgrade AWS infrastructure; hybrid approach

---

#### RISK-T6: Data Migration and Loss
**Likelihood**: Medium | **Impact**: High | **Phase**: Q1 2026

**Mitigation**: Robust migration scripts with validation; test thoroughly; implement data export before migration; clear user communication; maintain localStorage backup; rollback capability; manual recovery process

**Contingency**: Pause migration and investigate; restore from localStorage backup; manual data recovery; extend parallel run period; improve migration scripts; gradual migration

---

### Resource Risks

#### RISK-R1: Backend Development Expertise Gap
**Likelihood**: High | **Impact**: Critical | **Phase**: Q1 2026

**Mitigation**: Assess current backend skills honestly; invest in learning/training; consider hiring consultant (20-40 hours); use well-documented technologies; start with proof-of-concept; leverage community support; budget extra time for learning; be realistic about timeline

**Contingency**: Hire experienced backend developer; partner with developer with backend experience; extend timeline significantly; start with minimal backend (auth only); consider alternative architecture (serverless); reassess viability

---

#### RISK-R2: Developer Availability
**Likelihood**: High | **Impact**: High | **Phase**: All phases

**Mitigation**: Build 30-35% buffer; maintain detailed documentation; break work into small chunks; prioritize ruthlessly; consider contractors; be realistic about time commitment; communicate timeline expectations; regular check-ins

**Contingency**: **Priority 1**: Complete architecture migration (Epic 0); **Priority 2**: Stabilize and debug; **Priority 3**: Defer all other features; extend timeline; seek contractor help; pause new features; communicate delays

---

#### RISK-R3: Domain Expertise Dependency
**Likelihood**: Medium | **Impact**: High | **Phase**: All phases

**Mitigation**: Document all business rules; create decision logs; link code to DWP guidance; build relationship with advisor community; consider co-developing with another organization

**Contingency**: Recruit benefits advisors as consultants; create advisory board of 2-3 benefits professionals

---

#### RISK-R4: Testing Expertise Gap
**Likelihood**: Medium | **Impact**: Medium | **Phase**: Q1 2026

**Mitigation**: Hire testing consultant for setup (10-20 hours); follow React community patterns; start simple and increase complexity; leverage online resources; consider testing workshop

**Contingency**: Pivot to manual testing checklist; CSV test case validation only; critical path testing only; focus on backend testing (more critical); defer comprehensive frontend coverage

---

### Timeline Risks

#### RISK-TL1: Scope Creep
**Likelihood**: High | **Impact**: Medium | **Phase**: All phases

**Mitigation**: Maintain strict backlog prioritization; evaluate requests against roadmap; use "parking lot" for ideas; require business case for unplanned features; protect 20% capacity for unplanned work

**Contingency**: Hold roadmap review; defer lower-priority items; communicate changes; extend phase or descope features

---

#### RISK-TL2: Dependencies and Blockers
**Likelihood**: Medium | **Impact**: Medium | **Phase**: All phases

**Mitigation**: Monitor DWP announcements; build abstraction layers around external services; maintain relationships with data providers; have fallback plans; build flexibility into rate/rule system

**Contingency**: Pivot to parallel work stream; implement feature flags; communicate limitations; seek alternative approaches

---

### External Risks

#### RISK-E1: DWP Rate/Rule Changes
**Likelihood**: High | **Impact**: Medium | **Phase**: All phases (April 2026)

**Mitigation**: Monitor DWP announcements from December onwards; maintain flexible rate configuration; plan for April update sprint (2-3 weeks); build version history; maintain good test coverage

**Contingency**: Immediately pause new features; dedicate full capacity to updates; communicate timeline; may need multiple versions live temporarily

---

#### RISK-E2: Data Privacy and GDPR Compliance
**Likelihood**: Medium | **Impact**: Critical | **Phase**: Q1 2026 onwards

**Mitigation**: Privacy-by-design principles; minimize personal data collection; implement data encryption (at rest and in transit); user consent management; data deletion/export capabilities; clear privacy policy; regular security audits; data retention policies; secure authentication

**GDPR Requirements**: Right to access, deletion, portability; consent management; data breach notification; privacy policy; data retention limits

**Contingency**: Immediately address vulnerabilities; seek legal advice; implement changes as P0; notify users; may pause new registrations

---

#### RISK-E3: Security Vulnerabilities
**Likelihood**: Medium | **Impact**: Critical | **Phase**: Q1 2026 onwards

**Mitigation**: Follow OWASP Top 10; input validation; parameterized queries; HTTPS/TLS; secure authentication (bcrypt/argon2); rate limiting; CORS configuration; security headers; regular audits; keep dependencies updated; monitor suspicious activity; incident response plan

**Security Checklist**: SQL injection prevention, XSS prevention, authentication security, authorization checks, rate limiting, HTTPS enforcement, secure password storage, security headers, dependency updates, secure error messages, logging and monitoring

**Contingency**: Immediate incident response; take systems offline if necessary; notify affected users per GDPR (72 hours); engage security expert; implement fixes; security audit before restoring; post-mortem

---

#### RISK-E4: Competitive Products
**Likelihood**: Medium | **Impact**: Low | **Phase**: All phases

**Mitigation**: Focus on unique value propositions (advisor-focused, integration-friendly); build community; maintain open-source approach; emphasize accuracy and comprehensiveness; consider partnerships

**Contingency**: Evaluate whether to continue; focus on niche use cases; explore merger/collaboration; pivot to API/library for other calculators

---

## Success Metrics

### Phase-Level Metrics

**Phase 1 (Q1 2026)**
- Backend API operational and stable
- AWS RDS database implemented and tested
- User authentication working
- Frontend integrated with API
- Data migrated from localStorage to database
- API documentation complete
- CI/CD pipeline running (95% uptime)
- 40% code coverage
- API response time < 500ms (95th)
- Zero P0 bugs
- AWS CloudWatch monitoring operational
- Database backups configured

**Phase 2 (Q2 2026)**
- Architecture stable (<1% error rate)
- Pension age calculations validated (20+ test cases)
- MACs implementation verified
- CTR calculator live (90% accuracy)
- 60% code coverage
- API response time <300ms (95th)
- 100+ users migrated

**Phase 3 (Q3 2026)**
- BYR integration complete with database
- 70% code coverage
- Bundle size reduced 25%
- Page load time under 2 seconds
- API response time <200ms (95th)
- Error tracking operational
- 10+ critical journeys covered by E2E tests

**Phase 4 (Q4 2026)**
- PWA installed by 50+ users
- WCAG 2.1 AA compliance verified
- Mobile user satisfaction 80%+
- Help guide page views increased 100%
- Time to complete calculation reduced 20%

**Phase 5 (Q1 2027)**
- Public API live and documented
- 3+ integration partners onboarded
- API usage at 1000+ requests/day
- Admin panel with database analytics deployed
- Enhanced reporting features live
- Sustainability plan approved
- Project success criteria achieved

### Overall Project KPIs (By End Q1 2027)

**Usage Metrics**
- 500+ monthly active users
- 2000+ calculations per month
- 80%+ calculation completion rate
- Average session duration 8+ minutes

**Quality Metrics**
- 95%+ calculation accuracy vs DWP test cases
- 75%+ code coverage (backend + frontend)
- Page load time <2 seconds (95th)
- API response time <300ms (95th)
- Database query time <50ms (95th)
- API uptime 99%+
- Zero critical accessibility violations
- <1% error rate in production
- Zero security vulnerabilities (high/critical)

**User Satisfaction Metrics**
- 85%+ user satisfaction score
- 4.5+ star rating
- 70%+ would recommend
- 20+ positive testimonials

**Development Metrics**
- 90%+ CI/CD success rate
- Mean time to resolution <7 days
- 100% of P0 bugs resolved within 48 hours
- <2 days between commits
- Database backups successful 100%
- API documentation up-to-date (100% endpoints)

**Business Impact Metrics**
- Documented benefit increases for 100+ claimants
- Estimated £100k+ in additional benefits claimed
- 500+ advisor hours saved
- 3+ organizational partnerships

### Quality Gates

**Before Phase Completion**
1. All P0 and P1 bugs resolved
2. Phase deliverables completed or deferred
3. Regression tests passing (frontend + backend)
4. API health checks passing
5. AWS RDS backups verified
6. Security scan clean
7. Documentation updated
8. Stakeholder approval
9. Retrospective completed

**Before Production Deployment**
1. Test coverage maintained/improved
2. Performance benchmarks met
3. API contract validated
4. AWS RDS migrations tested
5. Accessibility checks pass
6. Security scan clean
7. GDPR compliance verified
8. Load testing passed
9. User acceptance testing completed
10. AWS CloudWatch monitoring and alerts configured
11. Database backup verified
12. Rollback plan documented

---

## Governance and Decision Making

### Project Governance Structure

**Project Owner**: Phil Agulnik
- Final decision authority
- Represents user/advisor community
- Approves major architectural changes

**Development Team**: Core developers
- Technical implementation decisions
- Day-to-day prioritization
- Raise risks to project owner

**Advisory Group** (Recommended)
- 2-3 benefits advisors for domain expertise
- Validates calculations and user flows
- Provides user feedback
- Meets quarterly

### Decision-Making Framework

**Day-to-day decisions**: Development team autonomy (technical implementation, bug fixes, minor enhancements, code refactoring, test approaches)

**Sprint/phase level decisions**: Project owner consultation (feature prioritization, scope adjustments, timeline trade-offs, resource allocation)

**Strategic decisions**: Project owner with advisory group (roadmap changes, major new features, architectural shifts, partnership opportunities)

### Change Management

**Adding New Features**
1. Document feature request with business case
2. Estimate effort and impact
3. Evaluate against roadmap priorities
4. Identify what to defer if high priority
5. Get project owner approval
6. Update roadmap and communicate

**Handling Urgent Issues**
- P0/P1: Stop current work, address immediately
- P2: Address in current sprint if capacity
- P3: Add to backlog
- Document root cause and prevention

**Scope Changes**
- <10% effort increase: Team decision
- 10-25% effort increase: Project owner approval
- >25% effort increase: Formal roadmap review
- Always document rationale

---

## Sustainability and Maintenance

### Post-Roadmap Maintenance (2027 and beyond)

**Annual Maintenance Requirements** (80-120 hours/year):
1. **April Update**: Update rates and rules (25-35 hours) - Update AWS RDS database with new rates, API calculation logic, frontend display, test and validate
2. **Quarterly Reviews**: Bug reports (15-20 hours each)
3. **Security Updates**: Dependencies (10-15 hours quarterly)
4. **AWS Infrastructure**: Maintain hosting, database, monitoring (15-25 hours/year)
5. **Database Management**: Backups, optimization, schema changes (10-15 hours/year)

**Ongoing Support**:
- User support: 3-6 hours/month
- Bug fixes: 8-12 hours/month
- Minor enhancements: 10-15 hours/month
- Infrastructure monitoring: 3-5 hours/month

**Total Estimated Ongoing**: 220-330 hours/year (4-6 hours/week)

### Sustainability Strategies

**Technical Sustainability**: Comprehensive documentation; High test coverage and clean code; Automation (CI/CD, automated testing); Proactive monitoring; Simple, straightforward architecture

**Community Sustainability**: Open source to enable contributions; Contributor guidelines; Build network of advisors and developers; Good documentation for self-service; Modular architecture for extensions

**Organizational Sustainability**: Partnership model with established organization; Advisory board relationships; Succession planning; Flexible commitment design; Clear ownership model

### Succession Planning

**Documentation Requirements**: Architecture decision records; Frontend and backend architecture; API documentation (internal and public); AWS RDS database schema with ERD diagrams; Authentication and security documentation; Calculation logic with DWP source links; Development environment setup (frontend + backend); Deployment process (frontend + backend + database); AWS infrastructure documentation; Troubleshooting guide; Data migration documentation; Security and GDPR compliance

**Knowledge Transfer**: Pair programming or code reviews; Regular documentation updates; Mentor relationship with potential maintainer

**Handoff Checklist**: All documentation up to date; Repository access transferred; AWS access, database, monitoring, domain transferred; Database credentials securely transferred; API keys and secrets securely transferred; Infrastructure documentation complete; Relationships introduced (advisory board, partners); Outstanding issues triaged; Roadmap and backlog reviewed; Support channels transferred; On-call/monitoring responsibilities transferred

---

## Appendices

### Appendix A: Acronyms and Definitions

**Universal Credit Terms**:
- **UC**: Universal Credit
- **DWP**: Department for Work and Pensions
- **LCWRA**: Limited Capability for Work and Work-Related Activity
- **MIF**: Minimum Income Floor (for self-employed)
- **CTR**: Council Tax Reduction (Support)
- **LHA**: Local Housing Allowance
- **BRMA**: Broad Rental Market Area
- **MACs**: Maximum Amount of Capital / Minimum Amount of Credit
- **BYR**: Benefits You Receive

**Technical Terms**:
- **CI/CD**: Continuous Integration / Continuous Deployment
- **PWA**: Progressive Web App
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **GDPR**: General Data Protection Regulation
- **CORS**: Cross-Origin Resource Sharing
- **E2E**: End-to-End (testing)
- **WCAG**: Web Content Accessibility Guidelines
- **ONS**: Office for National Statistics
- **ERD**: Entity Relationship Diagram

**Project Terms**:
- **P0/P1/P2/P3**: Priority levels (Critical/High/Medium/Low)
- **T-shirt sizing**: Estimation method (XS/S/M/L/XL)
- **Epic**: Large body of work broken into tasks
- **Sprint**: Fixed time period for work (2-3 weeks)
- **Buffer**: Extra time for unexpected issues

### Appendix B: Reference Documents

**Government Sources**: DWP Universal Credit Regulations 2013; Universal Credit Full Service Guidance; Council Tax Reduction Schemes Regulations; State Pension Age Calculator (gov.uk); LHA Rates by BRMA (gov.uk)

**Development Resources**: React Documentation (react.dev); Jest Documentation (jestjs.io); React Testing Library (testing-library.com); GitHub Actions Documentation; Node.js/Express Documentation; PostgreSQL Documentation; Prisma Documentation; JWT Best Practices (jwt.io); OWASP Security Guidelines (owasp.org); AWS Documentation (aws.amazon.com)

### Appendix C: Assumptions and Constraints

**Assumptions**:
1. GitHub Pages remains available and free for frontend
2. AWS infrastructure can be utilized
3. Team has or can acquire necessary backend development skills
4. Part-time development team availability remains stable
5. DWP guidelines remain consistent aside from annual updates
6. User base will grow organically
7. No significant legal or regulatory changes
8. Benefits advisor community remains engaged
9. Data migration from localStorage to database proceeds smoothly
10. Architecture migration is feasible within estimated timeline

**Constraints**:
1. Part-time development capacity (10-20 hours/week)
2. May lack backend development expertise
3. AWS services must be cost-effective
4. No dedicated support team
5. Manual testing by small user group
6. No professional UI/UX designer
7. No dedicated security expert
8. Limited AWS infrastructure expertise

---

## Conclusion

This roadmap provides a comprehensive plan for the Universal Credit Calculator project from January 2026 through March 2027 (15 months). The plan centers on a major architectural transformation and subsequent feature development:

1. **Architectural Migration** to Frontend-API-Database infrastructure on AWS (Phase 1)
2. **Stabilization and core enhancements** with pension age, MACs, and CTR (Phase 2)
3. **Advanced features and performance optimization** with BYR integration (Phase 3)
4. **User experience polish** with mobile optimization and accessibility (Phase 4)
5. **Public API launch** and third-party integrations (Phase 5)

**Critical Success Factor**: The architecture migration in Phase 1 is the most important endeavor in this roadmap. Success depends on:
- Securing backend development expertise (hire consultant or upskill team)
- Realistic timeline expectations (architecture migration is complex)
- Thorough planning and design before implementation
- Phased approach with feature flags and fallbacks
- Comprehensive testing at each stage
- Buffer time for unexpected challenges

**Key Success Factors**: Successfully completing architecture migration (Phase 1 priority #1); Securing backend development expertise (critical skill gap); AWS infrastructure planning; Maintaining focus on accuracy and reliability; Building comprehensive test coverage; Ruthless prioritization given resource constraints; Building in sufficient buffer (30-35%); Strong domain expertise in benefits system; Engaged advisor community; Flexible approach to adjust as needed; Security and data privacy as top priorities (GDPR); Performance optimization (API response times, AWS RDS queries)

**Flexibility**: This roadmap should be treated as a living document. Regular reviews (at minimum at each phase boundary) should assess progress, priorities, risks, and opportunities.

**Next Steps**:
1. Review and approve this roadmap
2. Assess backend development skills honestly
3. Select backend approach: Option A (Custom backend - Node.js/Express), Option B (Backend-as-a-Service), or Option C (Hire backend consultant)
4. Plan AWS infrastructure deployment
5. Conduct detailed architecture planning (2-3 days)
6. Set up project tracking
7. Begin Phase 1, Sprint 1
8. Establish communication channels
9. Recruit advisory board members (2-3 advisors)
10. Schedule first retrospective
11. Prepare development environment for backend
12. Research and select technology stack

**Contact and Governance**:
- Project Owner: Phil Agulnik
- Last Updated: 2025-10-14
- Next Review: End of Phase 1 (March 2026)
- Document Version: 5.0 - Condensed AWS Edition

**Document Changes in v5.0**:
- Condensed document to ~50% of previous length
- Removed all pricing and cost information
- Standardized on AWS infrastructure exclusively
- Removed verbose descriptions and explanations
- Simplified risk descriptions
- Reduced success metrics to key items only
- Shortened task descriptions
- Condensed governance and sustainability sections
- Made document more scannable with bullet points
- Maintained all epic titles, task IDs, timelines, effort estimates, and critical information

---

*This roadmap was created as a strategic planning document for the Universal Credit Calculator project. It should be reviewed and updated regularly to reflect changing priorities, learnings, and circumstances.*

**Document Approval**:
- [ ] Project Owner Approval
- [ ] Development Team Review
- [ ] Advisory Board Review (if established)
- [ ] Stakeholder Sign-off

**Revision History**:
- v5.0 (2025-10-14): **CONDENSED AWS EDITION** - Reduced document length by ~50%; standardized on AWS infrastructure exclusively; removed all pricing/cost information; removed alternative hosting options; simplified all descriptions; removed verbose explanations; made more scannable
- v4.0 (2025-10-13): CONDENSED AWS EDITION - Reduced document length by ~50%; standardized on AWS infrastructure only; removed all pricing/cost information
- v3.0 (2025-10-13): MAJOR ARCHITECTURAL CHANGE - Added Epic 0 (Architecture Migration); added backend, database, API considerations
- v2.0 (2025-10-13): Updated timeline Q1 2026 - Q1 2027; removed Epic 5; recalculated resources
- v1.0 (2025-10-13): Initial comprehensive roadmap created
