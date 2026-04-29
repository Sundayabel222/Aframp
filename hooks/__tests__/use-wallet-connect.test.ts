/**
 * Tests for wallet connection hook with demo mode security fix
 */

import { renderHook, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useWalletConnect } from '../use-wallet-connect'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('useWalletConnect - Demo Mode Security', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    localStorage.clear()
    // Clear window.ethereum
    delete (window as any).ethereum
  })

  describe('Demo Mode Disabled (Production)', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'false'
    })

    it('should throw error when MetaMask is not installed', async () => {
      const { result } = renderHook(() => useWalletConnect())

      await expect(
        act(async () => {
          await result.current.connectWallet({ id: 'metamask', name: 'MetaMask' })
        })
      ).rejects.toThrow('MetaMask is not installed')
    })

    it('should throw error when Coinbase Wallet is not installed', async () => {
      const { result } = renderHook(() => useWalletConnect())

      await expect(
        act(async () => {
          await result.current.connectWallet({ id: 'coinbase-wallet', name: 'Coinbase Wallet' })
        })
      ).rejects.toThrow('Coinbase Wallet is not installed')
    })

    it('should throw error when Trust Wallet is not available', async () => {
      const { result } = renderHook(() => useWalletConnect())

      await expect(
        act(async () => {
          await result.current.connectWallet({ id: 'trust-wallet', name: 'Trust Wallet' })
        })
      ).rejects.toThrow('Trust Wallet is not available')
    })

    it('should throw error for unsupported wallets', async () => {
      const { result } = renderHook(() => useWalletConnect())

      await expect(
        act(async () => {
          await result.current.connectWallet({ id: 'lobstr', name: 'Lobstr' })
        })
      ).rejects.toThrow('integration is not yet available')
    })

    it('should connect successfully when MetaMask is available', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890'
      ;(window as any).ethereum = {
        request: jest.fn().mockResolvedValue([mockAddress]),
      }

      const { result } = renderHook(() => useWalletConnect())

      let connectionResult
      await act(async () => {
        connectionResult = await result.current.connectWallet({ id: 'metamask', name: 'MetaMask' })
      })

      expect(connectionResult).toEqual({
        address: mockAddress,
        walletName: 'MetaMask',
        isDemoMode: false,
      })
    })

    it('should throw error when user rejects MetaMask connection', async () => {
      ;(window as any).ethereum = {
        request: jest.fn().mockRejectedValue(new Error('User rejected the request')),
      }

      const { result } = renderHook(() => useWalletConnect())

      await expect(
        act(async () => {
          await result.current.connectWallet({ id: 'metamask', name: 'MetaMask' })
        })
      ).rejects.toThrow('MetaMask connection cancelled by user')
    })
  })

  describe('Demo Mode Enabled (Development)', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
    })

    it('should generate mock address when MetaMask is not installed', async () => {
      const { result } = renderHook(() => useWalletConnect())

      let connectionResult
      await act(async () => {
        connectionResult = await result.current.connectWallet({ id: 'metamask', name: 'MetaMask' })
      })

      expect(connectionResult).toMatchObject({
        walletName: 'MetaMask',
        isDemoMode: true,
      })
      expect(connectionResult.address).toMatch(/^0x[a-f0-9]{40}$/)
    })

    it('should generate mock address when Coinbase Wallet is not installed', async () => {
      const { result } = renderHook(() => useWalletConnect())

      let connectionResult
      await act(async () => {
        connectionResult = await result.current.connectWallet({
          id: 'coinbase-wallet',
          name: 'Coinbase Wallet',
        })
      })

      expect(connectionResult).toMatchObject({
        walletName: 'Coinbase Wallet',
        isDemoMode: true,
      })
      expect(connectionResult.address).toMatch(/^0x[a-f0-9]{40}$/)
    })

    it('should generate Stellar-like address for Stellar wallets', async () => {
      const { result } = renderHook(() => useWalletConnect())

      let connectionResult
      await act(async () => {
        connectionResult = await result.current.connectWallet({ id: 'lobstr', name: 'Lobstr' })
      })

      expect(connectionResult).toMatchObject({
        walletName: 'Lobstr',
        isDemoMode: true,
      })
      expect(connectionResult.address).toMatch(/^G[A-Z0-9]{55}$/)
    })

    it('should generate Bitcoin-like address for Bitcoin wallets', async () => {
      const { result } = renderHook(() => useWalletConnect())

      let connectionResult
      await act(async () => {
        connectionResult = await result.current.connectWallet({ id: 'electrum', name: 'Electrum' })
      })

      expect(connectionResult).toMatchObject({
        walletName: 'Electrum',
        isDemoMode: true,
      })
      expect(connectionResult.address).toMatch(/^bc1q[a-z0-9]{30}$/)
    })

    it('should still connect to real wallet when available', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890'
      ;(window as any).ethereum = {
        request: jest.fn().mockResolvedValue([mockAddress]),
      }

      const { result } = renderHook(() => useWalletConnect())

      let connectionResult
      await act(async () => {
        connectionResult = await result.current.connectWallet({ id: 'metamask', name: 'MetaMask' })
      })

      expect(connectionResult).toEqual({
        address: mockAddress,
        walletName: 'MetaMask',
        isDemoMode: false,
      })
    })

    it('should still throw error when user rejects connection', async () => {
      ;(window as any).ethereum = {
        request: jest.fn().mockRejectedValue(new Error('User rejected the request')),
      }

      const { result } = renderHook(() => useWalletConnect())

      // User rejection should always throw, even in demo mode
      await expect(
        act(async () => {
          await result.current.connectWallet({ id: 'metamask', name: 'MetaMask' })
        })
      ).rejects.toThrow('MetaMask connection cancelled by user')
    })
  })

  describe('storeAndNavigate', () => {
    it('should store wallet info and demo mode status in localStorage', () => {
      const { result } = renderHook(() => useWalletConnect())

      act(() => {
        result.current.storeAndNavigate('0x123', 'MetaMask', true)
      })

      expect(localStorage.getItem('walletName')).toBe('MetaMask')
      expect(localStorage.getItem('walletAddress')).toBe('0x123')
      expect(localStorage.getItem('walletDemoMode')).toBe('true')
    })

    it('should navigate to dashboard with wallet params', () => {
      const { result } = renderHook(() => useWalletConnect())

      act(() => {
        result.current.storeAndNavigate('0x123', 'MetaMask', false)
      })

      expect(mockPush).toHaveBeenCalledWith('/dashboard?wallet=MetaMask&address=0x123')
    })

    it('should store false demo mode status', () => {
      const { result } = renderHook(() => useWalletConnect())

      act(() => {
        result.current.storeAndNavigate('0x123', 'MetaMask', false)
      })

      expect(localStorage.getItem('walletDemoMode')).toBe('false')
    })
  })
})
