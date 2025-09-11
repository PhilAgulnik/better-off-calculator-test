# Universal Credit Calculator - API Migration Plan

## Scope
**This migration applies ONLY to the Universal Credit Calculator functionality.** All other app features (Self-Employment Hub, Self-Assessment Tax Form, Budgeting Tool, etc.) will remain client-side and unchanged.

## Current State - UC Calculator Only
- React-based Universal Credit Calculator at ~40% completion
- Client-side calculation logic in `calculator.js` (IP exposed to competitors)
- UC calculations performed entirely in browser
- No user accounts for UC calculations, saved calculations, or usage statistics
- Local storage only for UC calculation data

## Business Drivers for Migration
1. **IP Protection**: Calculation logic currently visible to competitors
2. **Customer Requirements**: Users want statistics and access to old calculations
3. **Scalability**: Database needed for multi-user features
4. **Timing**: 40% completion is optimal migration point

## Migration Timing Strategy

**Product Launch**: 10 weeks until public availability
**Migration Window**: Execute at weeks 6-8 of development cycle  
**Rationale**: IP protection must be in place before public launch

### Why This Timing
**IP Protection**: Once launched publicly, competitors can access calculation logic
**Feature Maturity**: 70-80% of features complete = more efficient migration
**Launch Buffer**: 2-4 weeks to test and deploy before public availability

## Technical Architecture Change

### From: Mixed Client-Side Architecture
```
React Frontend
├── UC Calculator (calculator.js) → Local Storage [TO MIGRATE]
├── Self-Employment Tools → Local Storage [UNCHANGED]
├── Budgeting Tool → Local Storage [UNCHANGED]
└── Other Tools → Local Storage [UNCHANGED]
```

### To: Hybrid Architecture
```
React Frontend
├── UC Calculator → REST API → Database [NEW]
├── Self-Employment Tools → Local Storage [UNCHANGED]
├── Budgeting Tool → Local Storage [UNCHANGED]
└── Other Tools → Local Storage [UNCHANGED]
```

## Migration Timeline (6 Weeks - Execute at Development Week 6-8)

### Week 1-2: Backend Foundation
**AI Tasks (Claude Code):**
- Set up Node.js/Express API server structure
- Design PostgreSQL database schema
- Implement basic user authentication (JWT)
- Create foundational API endpoints
- Set up development environment

**Developer Review Points:**
- Review database schema design
- Approve authentication approach
- Security review of API structure

### Week 3-4: UC Calculator Migration
**AI Tasks (Claude Code):**
- Move `calculator.js` logic to backend endpoints (UC calculations only)
- Create protected UC calculation API endpoints
- Implement UC calculation history storage
- Update UC Calculator React components for API calls
- Maintain all other tools unchanged

**Developer Review Points:**
- Verify calculation accuracy (UC results match exactly)
- Review API security implementation
- Test authentication flow

### Week 5-6: UC Features & Testing
**AI Tasks (Claude Code):**
- Add UC calculation statistics dashboard
- Implement saved UC calculations feature
- Comprehensive testing of UC Calculator functionality
- Create deployment scripts

**Developer Review Points:**
- Final security audit
- Performance testing
- Production deployment approval
- Go/no-go decision for launch

## Expected Benefits

### Immediate (Week 3-4)
- **IP Protection**: Calculation logic secured server-side
- **User Accounts**: Login/registration functionality
- **Data Persistence**: Cross-device calculation access

### Medium Term (Week 5-6)
- **UC Usage Statistics**: Track UC calculation patterns
- **UC Calculation History**: Users can review past UC calculations
- **Enhanced UC Features**: Multi-user UC admin capabilities
- **Other Tools**: Continue to work exactly as before

## Resource Requirements
- **AI Development**: Claude Code handles 80% of implementation work
- **Developer Review**: Strategic review points and final approval
- **Infrastructure**: Cloud hosting (API + Database)
- **Time Investment**: 6 weeks full migration (AI work + review cycles)
- **Migration Timing**: Execute at weeks 6-8 of development cycle (before week 10 public launch)
- **Code Scope**: ~70-80% of UC Calculator features will need refactoring by migration time

## Division of Labor
**Claude Code (AI) Responsibilities:**
- Code generation and implementation
- Database schema design
- API endpoint creation
- React component updates
- Testing and bug fixes
- Documentation

**Developer Responsibilities:**
- Architectural decisions and approval
- Security reviews
- Production deployment
- Performance validation
- Final quality assurance

## UI/UX Design Integration

**Optimal Timing for UI Designer**: Week 8-9 (Post-migration, Pre-launch)

**Why This Timing:**
- ✅ All functionality complete and stable
- ✅ API integration tested and working
- ✅ Focus purely on visual improvements
- ✅ No risk of design breaking during architecture changes
- ✅ 1-2 weeks buffer before launch

**UI Designer Scope:**
- Visual design improvements (colors, typography, spacing)
- User experience optimization
- Responsive design enhancements
- Accessibility improvements
- Component styling consistency

**Collaboration Approach:**
- AI handles implementation of design changes
- Designer provides mockups and design specifications
- Developer reviews final design integration

## Risk Mitigation
- **Isolated Migration**: Only UC Calculator affected, all other tools unchanged
- **Gradual Migration**: UC Calculator continues working during backend development
- **Feature Parity**: All current UC Calculator functionality preserved
- **Testing**: Comprehensive testing of migrated UC calculations
- **Rollback Plan**: Original client-side UC Calculator available if needed

## Success Metrics
- ✅ All UC calculations produce identical results
- ✅ User authentication working for UC Calculator
- ✅ UC calculation history saved and retrievable
- ✅ UC statistics dashboard functional
- ✅ IP protection achieved (no client-side UC calculation logic)
- ✅ All other app tools continue working unchanged

---
*Prepared by: Claude Code*  
*Date: 2025-09-09*