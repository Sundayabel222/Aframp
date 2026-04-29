'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface WalletProvider {
  id: string
  name: string
}

// Check if demo mode is enabled (only for development/testing)
const isDemoMode = () => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export const useWalletConnect = () => {
  const router = useRouter()

  const generateMockAddress = useCallback((walletId: string) => {
    // EVM-like address for Ethereum wallets
    if (['metamask', 'trust-wallet', 'walletconnect', 'coinbase-wallet'].includes(walletId)) {
      return `0x${Math.random().toString(16).slice(2).padEnd(40, '0').slice(0, 40)}`
    }
    // Bitcoin-like address (very rough demo format)
    if (['electrum', 'blue-wallet'].includes(walletId)) {
      return `bc1q${Math.random().toString(36).slice(2).padEnd(30, '0').slice(0, 30)}`
    }
    // Lightning invoice / node id placeholder
    if (['lightning-wallet', 'phoenix'].includes(walletId)) {
      return `lnbc${Math.random().toString(36).slice(2).padEnd(20, '0').slice(0, 20)}`
    }
    // Stellar-like public key placeholder
    if (['lobstr', 'stellar-xlm'].includes(walletId)) {
      return `G${Math.random().toString(36).toUpperCase().slice(2).padEnd(55, 'A').slice(0, 55)}`
    }
    return `0x${Math.random().toString(16).slice(2).padEnd(40, '0').slice(0, 40)}`
  }, [])

  const connectWallet = useCallback(
    async (wallet: WalletProvider): Promise<{ address: string; walletName: string; isDemoMode: boolean }> => {
      const { id: walletId, name: walletName } = wallet
      let address: string | null = null
      let usingDemoMode = false

      // MetaMask connection
      if (walletId === 'metamask') {
        if (!window.ethereum) {
          if (!isDemoMode()) {
            throw new Error(
              'MetaMask is not installed. Please install MetaMask extension to connect your wallet.'
            )
          }
          // Demo mode enabled: use mock address
          address = generateMockAddress(walletId)
          usingDemoMode = true
          return { address, walletName, isDemoMode: usingDemoMode }
        }
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          if (Array.isArray(accounts) && accounts.length > 0) {
            address = accounts[0] as string
          }
        } catch (error) {
          if (error instanceof Error) {
            // If user rejects, always throw error
            if (error.message.toLowerCase().includes('user rejected')) {
              throw new Error('MetaMask connection cancelled by user')
            }
            // For other errors, only use demo mode if enabled
            if (!isDemoMode()) {
              throw new Error(`MetaMask connection failed: ${error.message}`)
            }
            address = generateMockAddress(walletId)
            usingDemoMode = true
            return { address, walletName, isDemoMode: usingDemoMode }
          }
          if (!isDemoMode()) {
            throw new Error('MetaMask connection failed')
          }
          address = generateMockAddress(walletId)
          usingDemoMode = true
          return { address, walletName, isDemoMode: usingDemoMode }
        }
      }

      // Coinbase Wallet connection
      else if (walletId === 'coinbase-wallet') {
        if (!window.coinbaseWalletProvider) {
          if (!isDemoMode()) {
            throw new Error(
              'Coinbase Wallet is not installed. Please install Coinbase Wallet to connect.'
            )
          }
          address = generateMockAddress(walletId)
          usingDemoMode = true
          return { address, walletName, isDemoMode: usingDemoMode }
        }
        try {
          const accounts = await window.coinbaseWalletProvider.request({
            method: 'eth_requestAccounts',
          })
          if (Array.isArray(accounts) && accounts.length > 0) {
            address = accounts[0] as string
          }
        } catch (error) {
          if (error instanceof Error) {
            if (!isDemoMode()) {
              throw new Error(`Coinbase Wallet connection failed: ${error.message}`)
            }
            address = generateMockAddress(walletId)
            usingDemoMode = true
            return { address, walletName, isDemoMode: usingDemoMode }
          }
          if (!isDemoMode()) {
            throw new Error('Coinbase Wallet connection failed')
          }
          address = generateMockAddress(walletId)
          usingDemoMode = true
          return { address, walletName, isDemoMode: usingDemoMode }
        }
      }

      // Trust Wallet connection
      else if (walletId === 'trust-wallet') {
        try {
          if (!window.ethereum) {
            if (!isDemoMode()) {
              throw new Error(
                'Trust Wallet is not available. Please install Trust Wallet to connect.'
              )
            }
            address = generateMockAddress(walletId)
            usingDemoMode = true
            return { address, walletName, isDemoMode: usingDemoMode }
          }
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          if (Array.isArray(accounts) && accounts.length > 0) {
            address = accounts[0] as string
          }
        } catch (error) {
          if (error instanceof Error) {
            if (!isDemoMode()) {
              throw new Error(`Trust Wallet connection failed: ${error.message}`)
            }
            address = generateMockAddress(walletId)
            usingDemoMode = true
            return { address, walletName, isDemoMode: usingDemoMode }
          }
          if (!isDemoMode()) {
            throw new Error('Trust Wallet connection failed')
          }
          address = generateMockAddress(walletId)
          usingDemoMode = true
          return { address, walletName, isDemoMode: usingDemoMode }
        }
      }

      // All other wallets: require demo mode to be enabled
      else {
        if (!isDemoMode()) {
          throw new Error(
            `${walletName} integration is not yet available. Please use MetaMask, Trust Wallet, or Coinbase Wallet.`
          )
        }
        address = generateMockAddress(walletId)
        usingDemoMode = true
        return { address, walletName, isDemoMode: usingDemoMode }
      }

      if (!address) {
        throw new Error('Failed to retrieve wallet address')
      }

      return { address, walletName, isDemoMode: usingDemoMode }
    },
    [generateMockAddress]
  )

  const storeAndNavigate = useCallback(
    (address: string, walletName: string, isDemoMode: boolean) => {
      localStorage.setItem('walletName', walletName)
      localStorage.setItem('walletAddress', address)
      localStorage.setItem('walletDemoMode', isDemoMode.toString())
      router.push(`/dashboard?wallet=${encodeURIComponent(walletName)}&address=${address}`)
    },
    [router]
  )

  return { connectWallet, storeAndNavigate }
}
