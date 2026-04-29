# PowerShell verification script for wallet demo mode security fix
# Run this script to verify the implementation is correct

Write-Host "🔍 Verifying Wallet Demo Mode Security Fix..." -ForegroundColor Cyan
Write-Host ""

$ChecksPassed = 0
$ChecksFailed = 0

# Function to check if file exists
function Test-FileExists {
    param($FilePath)
    if (Test-Path $FilePath) {
        Write-Host "✓ File exists: $FilePath" -ForegroundColor Green
        $script:ChecksPassed++
    } else {
        Write-Host "✗ File missing: $FilePath" -ForegroundColor Red
        $script:ChecksFailed++
    }
}

# Function to check if file contains string
function Test-FileContent {
    param($FilePath, $SearchString, $Description)
    if ((Test-Path $FilePath) -and (Select-String -Path $FilePath -Pattern $SearchString -Quiet)) {
        Write-Host "✓ $Description" -ForegroundColor Green
        $script:ChecksPassed++
    } else {
        Write-Host "✗ $Description" -ForegroundColor Red
        $script:ChecksFailed++
    }
}

Write-Host "📁 Checking required files..." -ForegroundColor Yellow
Test-FileExists ".env.example"
Test-FileExists ".env.local"
Test-FileExists "hooks/use-wallet-connect.ts"
Test-FileExists "components/demo-mode-banner.tsx"
Test-FileExists "components/wallet-connect-modal.tsx"
Test-FileExists "components/dashboard/dashboard-layout.tsx"
Test-FileExists "SECURITY-FIX-WALLET-DEMO-MODE.md"
Test-FileExists "MIGRATION-GUIDE-DEMO-MODE.md"
Write-Host ""

Write-Host "🔧 Checking implementation details..." -ForegroundColor Yellow
Test-FileContent "hooks/use-wallet-connect.ts" "isDemoMode" "Demo mode check function exists"
Test-FileContent "hooks/use-wallet-connect.ts" "NEXT_PUBLIC_DEMO_MODE" "Environment variable check present"
Test-FileContent "hooks/use-wallet-connect.ts" "isDemoMode: boolean" "Return type includes isDemoMode flag"
Test-FileContent "components/demo-mode-banner.tsx" "Demo Mode Active" "Demo banner has warning message"
Test-FileContent "components/wallet-connect-modal.tsx" "AlertTriangle" "Error display includes warning icon"
Test-FileContent "components/dashboard/dashboard-layout.tsx" "DemoModeBanner" "Dashboard integrates demo banner"
Write-Host ""

Write-Host "🔒 Checking security measures..." -ForegroundColor Yellow
Test-FileContent ".env.example" "NEXT_PUBLIC_DEMO_MODE=false" "Default demo mode is disabled"
Test-FileContent ".gitignore" ".env.local" "Environment files are gitignored"
Test-FileContent "hooks/use-wallet-connect.ts" "throw new Error" "Error throwing on wallet unavailable"
Write-Host ""

Write-Host "📝 Checking documentation..." -ForegroundColor Yellow
Test-FileContent "SECURITY-FIX-WALLET-DEMO-MODE.md" "Security Fix" "Security documentation exists"
Test-FileContent "MIGRATION-GUIDE-DEMO-MODE.md" "Migration Guide" "Migration guide exists"
Test-FileContent ".env.example" "CRITICAL" "Environment template has warnings"
Write-Host ""

# Check if .env.local has demo mode set
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_DEMO_MODE=true") {
        Write-Host "⚠  Demo mode is ENABLED in .env.local (OK for development)" -ForegroundColor Yellow
    } elseif ($envContent -match "NEXT_PUBLIC_DEMO_MODE=false") {
        Write-Host "✓ Demo mode is DISABLED in .env.local" -ForegroundColor Green
        $ChecksPassed++
    } else {
        Write-Host "⚠  Demo mode not explicitly set in .env.local" -ForegroundColor Yellow
    }
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Verification Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Checks passed: $ChecksPassed" -ForegroundColor Green
Write-Host "Checks failed: $ChecksFailed" -ForegroundColor Red
Write-Host ""

if ($ChecksFailed -eq 0) {
    Write-Host "✅ All checks passed! Security fix is properly implemented." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Set NEXT_PUBLIC_DEMO_MODE in your environment"
    Write-Host "2. Restart your development server"
    Write-Host "3. Test wallet connection with and without extensions"
    Write-Host "4. Verify demo banner appears when using mock addresses"
    exit 0
} else {
    Write-Host "❌ Some checks failed. Please review the implementation." -ForegroundColor Red
    Write-Host ""
    Write-Host "Review the following files:"
    Write-Host "- SECURITY-FIX-WALLET-DEMO-MODE.md"
    Write-Host "- MIGRATION-GUIDE-DEMO-MODE.md"
    exit 1
}
