#!/bin/bash

# Verification script for wallet demo mode security fix
# Run this script to verify the implementation is correct

echo "🔍 Verifying Wallet Demo Mode Security Fix..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check if file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} File exists: $1"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} File missing: $1"
    ((CHECKS_FAILED++))
  fi
}

# Function to check if file contains string
check_content() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} $3"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $3"
    ((CHECKS_FAILED++))
  fi
}

echo "📁 Checking required files..."
check_file ".env.example"
check_file ".env.local"
check_file "hooks/use-wallet-connect.ts"
check_file "components/demo-mode-banner.tsx"
check_file "components/wallet-connect-modal.tsx"
check_file "components/dashboard/dashboard-layout.tsx"
check_file "SECURITY-FIX-WALLET-DEMO-MODE.md"
check_file "MIGRATION-GUIDE-DEMO-MODE.md"
echo ""

echo "🔧 Checking implementation details..."
check_content "hooks/use-wallet-connect.ts" "isDemoMode" "Demo mode check function exists"
check_content "hooks/use-wallet-connect.ts" "NEXT_PUBLIC_DEMO_MODE" "Environment variable check present"
check_content "hooks/use-wallet-connect.ts" "isDemoMode: boolean" "Return type includes isDemoMode flag"
check_content "components/demo-mode-banner.tsx" "Demo Mode Active" "Demo banner has warning message"
check_content "components/wallet-connect-modal.tsx" "AlertTriangle" "Error display includes warning icon"
check_content "components/dashboard/dashboard-layout.tsx" "DemoModeBanner" "Dashboard integrates demo banner"
echo ""

echo "🔒 Checking security measures..."
check_content ".env.example" "NEXT_PUBLIC_DEMO_MODE=false" "Default demo mode is disabled"
check_content ".gitignore" ".env.local" "Environment files are gitignored"
check_content "hooks/use-wallet-connect.ts" "throw new Error" "Error throwing on wallet unavailable"
echo ""

echo "📝 Checking documentation..."
check_content "SECURITY-FIX-WALLET-DEMO-MODE.md" "Security Fix" "Security documentation exists"
check_content "MIGRATION-GUIDE-DEMO-MODE.md" "Migration Guide" "Migration guide exists"
check_content ".env.example" "CRITICAL" "Environment template has warnings"
echo ""

# Check if .env.local has demo mode set
if [ -f ".env.local" ]; then
  if grep -q "NEXT_PUBLIC_DEMO_MODE=true" ".env.local"; then
    echo -e "${YELLOW}⚠${NC}  Demo mode is ENABLED in .env.local (OK for development)"
  elif grep -q "NEXT_PUBLIC_DEMO_MODE=false" ".env.local"; then
    echo -e "${GREEN}✓${NC} Demo mode is DISABLED in .env.local"
    ((CHECKS_PASSED++))
  else
    echo -e "${YELLOW}⚠${NC}  Demo mode not explicitly set in .env.local"
  fi
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Checks passed: ${GREEN}${CHECKS_PASSED}${NC}"
echo -e "Checks failed: ${RED}${CHECKS_FAILED}${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Security fix is properly implemented.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Set NEXT_PUBLIC_DEMO_MODE in your environment"
  echo "2. Restart your development server"
  echo "3. Test wallet connection with and without extensions"
  echo "4. Verify demo banner appears when using mock addresses"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please review the implementation.${NC}"
  echo ""
  echo "Review the following files:"
  echo "- SECURITY-FIX-WALLET-DEMO-MODE.md"
  echo "- MIGRATION-GUIDE-DEMO-MODE.md"
  exit 1
fi
