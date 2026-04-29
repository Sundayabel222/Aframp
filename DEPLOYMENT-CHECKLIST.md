# Deployment Checklist - Wallet Demo Mode Security Fix

## Pre-Deployment Verification

### ✅ Code Changes
- [ ] `hooks/use-wallet-connect.ts` - Updated with demo mode checks
- [ ] `components/wallet-connect-modal.tsx` - Enhanced error display
- [ ] `components/dashboard/dashboard-layout.tsx` - Demo banner integration
- [ ] `components/demo-mode-banner.tsx` - Warning banner created
- [ ] All TypeScript files compile without errors

### ✅ Configuration Files
- [ ] `.env.example` - Created with NEXT_PUBLIC_DEMO_MODE
- [ ] `.env.local` - Created for local development
- [ ] `.gitignore` - Confirms .env.local is excluded
- [ ] Environment variables documented

### ✅ Documentation
- [ ] `SECURITY-FIX-WALLET-DEMO-MODE.md` - Complete technical documentation
- [ ] `MIGRATION-GUIDE-DEMO-MODE.md` - Migration instructions
- [ ] `WALLET-SECURITY-FIX-SUMMARY.md` - Executive summary
- [ ] `DEPLOYMENT-CHECKLIST.md` - This checklist

### ✅ Testing
- [ ] `hooks/__tests__/use-wallet-connect.test.ts` - Test suite created
- [ ] Tests pass for demo mode disabled
- [ ] Tests pass for demo mode enabled
- [ ] Manual testing completed

## Environment Configuration

### Development Environment
```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
```
- [ ] Set in local `.env.local` file
- [ ] Development server restarted
- [ ] Demo mode banner appears when using mock addresses

### Staging Environment
```bash
# Platform environment variables
NEXT_PUBLIC_DEMO_MODE=false
```
- [ ] Environment variable set to `false`
- [ ] Deployment successful
- [ ] Wallet connection errors display correctly
- [ ] No demo banner appears with real wallets

### Production Environment
```bash
# Platform environment variables
NEXT_PUBLIC_DEMO_MODE=false
# OR omit the variable entirely
```
- [ ] Environment variable set to `false` or omitted
- [ ] Deployment successful
- [ ] Wallet connection tested
- [ ] No mock addresses generated
- [ ] Error messages are clear and helpful

## Manual Testing Checklist

### Test Case 1: Demo Mode Disabled (Production)
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] Restart application
- [ ] Try connecting without MetaMask installed
- [ ] **Expected:** Clear error message, no mock address
- [ ] **Expected:** No demo banner appears

### Test Case 2: Demo Mode Enabled (Development)
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=true`
- [ ] Restart application
- [ ] Try connecting without MetaMask installed
- [ ] **Expected:** Mock address generated
- [ ] **Expected:** Yellow demo banner appears
- [ ] **Expected:** Banner is dismissible

### Test Case 3: Real Wallet Connection
- [ ] Install MetaMask or supported wallet
- [ ] Try connecting (any demo mode setting)
- [ ] **Expected:** Real wallet address connected
- [ ] **Expected:** No demo banner appears
- [ ] **Expected:** Dashboard shows real wallet info

### Test Case 4: User Rejection
- [ ] Have MetaMask installed
- [ ] Try connecting but reject in MetaMask
- [ ] **Expected:** Error message about user cancellation
- [ ] **Expected:** No mock address generated (even in demo mode)

### Test Case 5: Unsupported Wallet
- [ ] Demo mode disabled
- [ ] Try connecting unsupported wallet (e.g., Lobstr)
- [ ] **Expected:** Error message about unavailable integration
- [ ] **Expected:** Suggestion to use supported wallets

## Security Verification

### Critical Checks
- [ ] Production environment has `NEXT_PUBLIC_DEMO_MODE=false` or unset
- [ ] `.env.local` is in `.gitignore`
- [ ] No `.env.local` file committed to repository
- [ ] Error messages don't expose sensitive information
- [ ] Demo banner clearly indicates fake data

### Code Review
- [ ] `isDemoMode()` function checks for explicit `'true'` string
- [ ] All wallet connection paths check demo mode
- [ ] User rejection always throws error (never generates mock)
- [ ] Demo mode status stored in localStorage
- [ ] Dashboard reads demo mode status from localStorage

## Post-Deployment Monitoring

### Immediate (First 24 Hours)
- [ ] Monitor error logs for wallet connection failures
- [ ] Check analytics for demo banner impressions
- [ ] Verify no mock addresses in production database
- [ ] Monitor user support tickets for wallet issues

### Short-term (First Week)
- [ ] Review wallet connection success rates
- [ ] Analyze error message clarity (user feedback)
- [ ] Check for any demo mode false positives
- [ ] Verify environment variable configuration across all environments

### Long-term (First Month)
- [ ] Evaluate need for additional wallet integrations
- [ ] Consider adding wallet connection analytics
- [ ] Review and update documentation based on feedback
- [ ] Plan for automated environment validation

## Rollback Procedure

If critical issues are discovered:

1. **Immediate Rollback**
   ```bash
   # Temporarily enable demo mode (NOT RECOMMENDED)
   NEXT_PUBLIC_DEMO_MODE=true
   ```

2. **Investigate**
   - Check error logs
   - Review user reports
   - Identify root cause

3. **Fix and Redeploy**
   - Apply fix to code
   - Test thoroughly
   - Redeploy with demo mode disabled

4. **Verify**
   - Confirm fix resolves issue
   - Ensure demo mode is disabled
   - Monitor for 24 hours

## Communication Plan

### Internal Team
- [ ] Notify development team of changes
- [ ] Share migration guide with developers
- [ ] Update internal documentation
- [ ] Schedule knowledge sharing session

### DevOps Team
- [ ] Share environment variable requirements
- [ ] Provide deployment checklist
- [ ] Set up monitoring alerts
- [ ] Document rollback procedure

### Support Team
- [ ] Brief on new error messages
- [ ] Provide troubleshooting guide
- [ ] Share demo mode explanation
- [ ] Update support documentation

### Users (if needed)
- [ ] Prepare announcement about improved security
- [ ] Create help article for wallet connection
- [ ] Update FAQ with common issues
- [ ] Provide wallet installation guides

## Success Criteria

### Technical
- ✅ No mock addresses generated in production
- ✅ Clear error messages for all failure scenarios
- ✅ Demo banner appears only when using mock addresses
- ✅ All tests passing
- ✅ No TypeScript errors

### User Experience
- ✅ Users understand when data is fake
- ✅ Error messages guide users to solutions
- ✅ Real wallet connections work seamlessly
- ✅ No confusion about demo vs. real data

### Security
- ✅ Production environment is secure
- ✅ No accidental demo mode in production
- ✅ Environment variables properly configured
- ✅ Sensitive data not exposed

## Sign-off

- [ ] **Developer:** Code changes reviewed and tested
- [ ] **QA:** All test cases passed
- [ ] **DevOps:** Environment variables configured
- [ ] **Security:** Security review completed
- [ ] **Product Owner:** Acceptance criteria met
- [ ] **Release Manager:** Ready for production deployment

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Verified By:** _________________  
**Production URL:** _________________

## Notes

_Add any deployment-specific notes or observations here_
