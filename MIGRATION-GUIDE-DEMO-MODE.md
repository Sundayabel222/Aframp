# Migration Guide: Demo Mode Security Fix

## For Developers

### Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure for your environment:**
   
   **Development/Testing:**
   ```bash
   # .env.local
   NEXT_PUBLIC_DEMO_MODE=true
   ```
   
   **Production:**
   ```bash
   # .env.production or platform environment variables
   NEXT_PUBLIC_DEMO_MODE=false
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Breaking Changes

#### Wallet Connection Hook Return Type
The `connectWallet` function now returns an additional `isDemoMode` boolean:

**Before:**
```typescript
const { address, walletName } = await connectWallet({ id: walletId, name: wallet.name })
```

**After:**
```typescript
const { address, walletName, isDemoMode } = await connectWallet({ id: walletId, name: wallet.name })
```

#### Store and Navigate Function Signature
The `storeAndNavigate` function now requires an additional `isDemoMode` parameter:

**Before:**
```typescript
storeAndNavigate(address, walletName)
```

**After:**
```typescript
storeAndNavigate(address, walletName, isDemoMode)
```

### Behavior Changes

#### Without Demo Mode (Production Default)
- Wallet connection failures throw clear error messages
- No mock addresses are generated
- Users must install wallet extensions to connect
- No demo banner appears

#### With Demo Mode Enabled (Development)
- Wallet connection failures fall back to mock addresses
- Demo banner appears warning users about fake data
- Useful for UI/UX testing without wallet extensions

### Testing Your Integration

```typescript
// Example test for demo mode disabled
describe('Wallet Connection - Production Mode', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false'
  })

  it('should throw error when MetaMask is not installed', async () => {
    // Mock window.ethereum as undefined
    delete window.ethereum
    
    const { connectWallet } = useWalletConnect()
    
    await expect(
      connectWallet({ id: 'metamask', name: 'MetaMask' })
    ).rejects.toThrow('MetaMask is not installed')
  })
})

// Example test for demo mode enabled
describe('Wallet Connection - Demo Mode', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
  })

  it('should generate mock address when MetaMask is not installed', async () => {
    delete window.ethereum
    
    const { connectWallet } = useWalletConnect()
    const result = await connectWallet({ id: 'metamask', name: 'MetaMask' })
    
    expect(result.address).toMatch(/^0x[a-f0-9]{40}$/)
    expect(result.isDemoMode).toBe(true)
  })
})
```

## For DevOps/Deployment

### Environment Variable Setup

#### Vercel
```bash
# In Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_DEMO_MODE=false
```

#### Netlify
```bash
# In netlify.toml
[build.environment]
  NEXT_PUBLIC_DEMO_MODE = "false"
```

#### Docker
```dockerfile
# In Dockerfile
ENV NEXT_PUBLIC_DEMO_MODE=false
```

#### AWS/Heroku/Other Platforms
Set the environment variable through your platform's configuration:
```bash
NEXT_PUBLIC_DEMO_MODE=false
```

### Verification Script

Add this to your CI/CD pipeline to ensure demo mode is disabled in production:

```bash
#!/bin/bash
# verify-production-config.sh

if [ "$NEXT_PUBLIC_DEMO_MODE" = "true" ]; then
  echo "ERROR: Demo mode is enabled in production!"
  echo "Set NEXT_PUBLIC_DEMO_MODE=false or remove the variable"
  exit 1
fi

echo "✓ Production configuration verified"
```

## For End Users

### What Changed?

**Before this fix:**
- Wallet connection would silently create fake addresses
- No indication that data wasn't real
- Potential security confusion

**After this fix:**
- Clear error messages when wallet isn't installed
- Obvious warning banner if demo mode is active
- Better guidance on how to connect real wallets

### What You Need to Do

**If you see an error connecting your wallet:**
1. Install the wallet extension (MetaMask, Trust Wallet, or Coinbase Wallet)
2. Refresh the page
3. Try connecting again

**If you see a yellow "Demo Mode Active" banner:**
- You're using fake test data
- Balances and transactions are not real
- Contact support if you expected to see real data

## Rollback Plan

If issues arise, you can temporarily enable demo mode in production (not recommended):

```bash
# Emergency rollback - NOT FOR LONG-TERM USE
NEXT_PUBLIC_DEMO_MODE=true
```

Then investigate and fix the underlying issue before disabling demo mode again.

## Support

### Common Issues

**Issue:** "MetaMask is not installed" error but MetaMask is installed
- **Solution:** Refresh the page, MetaMask might not have loaded yet
- **Solution:** Check if MetaMask is enabled for the site
- **Solution:** Try disconnecting and reconnecting MetaMask

**Issue:** Demo banner appears with real wallet connected
- **Solution:** Disconnect wallet and reconnect
- **Solution:** Clear localStorage: `localStorage.removeItem('walletDemoMode')`
- **Solution:** Check that demo mode is disabled in environment variables

**Issue:** Can't connect any wallet in development
- **Solution:** Enable demo mode: `NEXT_PUBLIC_DEMO_MODE=true`
- **Solution:** Restart development server after changing .env files

### Getting Help

1. Check `SECURITY-FIX-WALLET-DEMO-MODE.md` for detailed documentation
2. Verify environment variables are set correctly
3. Check browser console for detailed error messages
4. Review localStorage for `walletDemoMode` value

## Timeline

- **Immediate:** Update `.env.local` for development
- **Before next deployment:** Verify production environment variables
- **After deployment:** Monitor for wallet connection errors
- **Within 1 week:** Update any custom wallet integration code
