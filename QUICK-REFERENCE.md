# Quick Reference - Wallet Demo Mode

## 🚀 Quick Setup

```bash
# Development
cp .env.example .env.local
echo "NEXT_PUBLIC_DEMO_MODE=true" >> .env.local
npm run dev

# Production
export NEXT_PUBLIC_DEMO_MODE=false
npm run build && npm start
```

## 🔧 Environment Variable

| Value | Behavior |
|-------|----------|
| `true` | Mock addresses enabled, demo banner shown |
| `false` | Mock addresses disabled, errors thrown |
| unset | Same as `false` (secure default) |

## 📝 Code Usage

### Hook Return Type
```typescript
const { address, walletName, isDemoMode } = await connectWallet(wallet)
```

### Store and Navigate
```typescript
storeAndNavigate(address, walletName, isDemoMode)
```

### Check Demo Mode
```typescript
const isDemoMode = localStorage.getItem('walletDemoMode') === 'true'
```

## ⚠️ Error Messages

| Scenario | Error Message |
|----------|---------------|
| MetaMask not installed | "MetaMask is not installed. Please install MetaMask extension to connect your wallet." |
| Coinbase not installed | "Coinbase Wallet is not installed. Please install Coinbase Wallet to connect." |
| Trust Wallet unavailable | "Trust Wallet is not available. Please install Trust Wallet to connect." |
| Unsupported wallet | "[Wallet Name] integration is not yet available. Please use MetaMask, Trust Wallet, or Coinbase Wallet." |
| User rejection | "MetaMask connection cancelled by user" |

## 🧪 Testing

```bash
# Run tests
npm test hooks/__tests__/use-wallet-connect.test.ts

# Test demo mode disabled
NEXT_PUBLIC_DEMO_MODE=false npm run dev

# Test demo mode enabled
NEXT_PUBLIC_DEMO_MODE=true npm run dev
```

## 🎯 Behavior Matrix

| Wallet Status | Demo OFF | Demo ON |
|---------------|----------|---------|
| Installed & connected | ✅ Real | ✅ Real |
| Not installed | ❌ Error | ⚠️ Mock + Banner |
| User rejects | ❌ Error | ❌ Error |
| Connection error | ❌ Error | ⚠️ Mock + Banner |

## 📦 Files Modified

- `hooks/use-wallet-connect.ts` - Core logic
- `components/wallet-connect-modal.tsx` - Error UI
- `components/dashboard/dashboard-layout.tsx` - Banner integration
- `components/demo-mode-banner.tsx` - Warning component

## 🔒 Security Rules

1. **Production:** Always `false` or unset
2. **Development:** Can be `true` for testing
3. **User rejection:** Always throws error
4. **Demo banner:** Only shows with mock addresses

## 📚 Documentation

- **Full docs:** `SECURITY-FIX-WALLET-DEMO-MODE.md`
- **Migration:** `MIGRATION-GUIDE-DEMO-MODE.md`
- **Summary:** `WALLET-SECURITY-FIX-SUMMARY.md`
- **Deployment:** `DEPLOYMENT-CHECKLIST.md`

## 🐛 Troubleshooting

**Demo banner won't dismiss:**
```typescript
localStorage.removeItem('walletDemoMode')
```

**Wrong demo mode state:**
```bash
# Restart dev server after changing .env
npm run dev
```

**Tests failing:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm test
```

## 💡 Common Tasks

### Enable demo mode locally
```bash
echo "NEXT_PUBLIC_DEMO_MODE=true" > .env.local
```

### Disable demo mode for production
```bash
# In your deployment platform
NEXT_PUBLIC_DEMO_MODE=false
```

### Check current demo mode
```typescript
console.log('Demo mode:', process.env.NEXT_PUBLIC_DEMO_MODE)
```

### Clear demo mode from localStorage
```typescript
localStorage.removeItem('walletDemoMode')
localStorage.removeItem('walletAddress')
localStorage.removeItem('walletName')
```

## 🎨 Demo Banner Styling

The banner appears at the top with:
- Amber/yellow background
- Warning icon
- Dismissible close button
- Fixed positioning
- High z-index (50)

## ✅ Checklist

Before deploying:
- [ ] Environment variable set correctly
- [ ] Tests passing
- [ ] Manual testing completed
- [ ] Documentation reviewed
- [ ] Team notified

---

**Need help?** Check the full documentation or contact the development team.
