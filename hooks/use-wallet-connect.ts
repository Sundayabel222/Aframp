'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Keypair } from '@stellar/stellar-sdk'

interface WalletProvider {
  id: string
  name: string
}

const STELLAR_WALLET_IDS = ['freighter', 'lobstr', 'stellar-xlm']

export const useWalletConnect = () => {
  const router = useRouter()

  const generateMockAddress = useCallback((walletId: string) => {
    if (['metamask', 'trust-wallet', 'walletconnect', 'coinbase-wallet'].includes(walletId)) {
      return `0x${Math.random().toString(16).slice(2).padEnd(40, '0').slice(0, 40)}`
    }
    if (['electrum', 'blue-wallet'].includes(walletId)) {
      return `bc1q${Math.random().toString(36).slice(2).padEnd(30, '0').slice(0, 30)}`
    }
    if (['lightning-wallet', 'phoenix'].includes(walletId)) {
      return `lnbc${Math.random().toString(36).slice(2).padEnd(20, '0').slice(0, 20)}`
    }
    // Valid Stellar public key (passes StellarSdk.PublicKey.isValid)
    if (['lobstr', 'stellar-xlm'].includes(walletId)) {
      return Keypair.random().publicKey()
    }
    return `0x${Math.random().toString(16).slice(2).padEnd(40, '0').slice(0, 40)}`
  }, [])

  const connectWallet = useCallback(
    async (wallet: WalletProvider): Promise<{ address: string; walletName: string; network?: string }> => {
      const { id: walletId, name: walletName } = wallet

      // Real Freighter connection for all Stellar wallets
      if (STELLAR_WALLET_IDS.includes(walletId)) {
        const address = await requestFreighterAccess()
        if (!address) {
          throw new Error('Freighter connection rejected or extension not installed')
        }
        const network = await getFreighterNetwork()
        return { address, walletName, network: network ?? undefined }
      }

      // MetaMask
      if (walletId === 'metamask') {
        if (!window.ethereum) {
          return { address: generateMockAddress(walletId), walletName }
        }
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          if (Array.isArray(accounts) && accounts.length > 0) {
            return { address: accounts[0] as string, walletName }
          }
        } catch (error) {
          if (error instanceof Error && error.message.toLowerCase().includes('user rejected')) {
            throw new Error('MetaMask connection cancelled')
          }
        }
        return { address: generateMockAddress(walletId), walletName }
      }

      // Coinbase Wallet
      if (walletId === 'coinbase-wallet') {
        if (window.coinbaseWalletProvider) {
          try {
            const accounts = await window.coinbaseWalletProvider.request({ method: 'eth_requestAccounts' })
            if (Array.isArray(accounts) && accounts.length > 0) {
              return { address: accounts[0] as string, walletName }
            }
          } catch {
            // fall through to mock
          }
        }
        return { address: generateMockAddress(walletId), walletName }
      }

      // Trust Wallet
      if (walletId === 'trust-wallet') {
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            if (Array.isArray(accounts) && accounts.length > 0) {
              return { address: accounts[0] as string, walletName }
            }
          } catch {
            // fall through to mock
          }
        }
        return { address: generateMockAddress(walletId), walletName }
      }

      // All other wallets: demo connect
      return { address: generateMockAddress(walletId), walletName }
    },
    [generateMockAddress]
  )

  const storeAndNavigate = useCallback(
    (address: string, walletName: string) => {
      localStorage.setItem('walletName', walletName)
      localStorage.setItem('walletAddress', address)
      router.push(`/dashboard?wallet=${encodeURIComponent(walletName)}&address=${address}`)
    },
    [router]
  )

  return { connectWallet, storeAndNavigate }
}
