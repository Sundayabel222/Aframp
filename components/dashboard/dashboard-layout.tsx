'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { EthPriceTicker } from '@/components/dashboard/eth-price-ticker'
import { BalanceProvider } from '@/contexts/balance-context'
import { DemoModeBanner } from '@/components/demo-mode-banner'
import { useEffect, useState } from 'react'

import { ConnectButton } from '@/components/Wallet'

interface DashboardLayoutProps {
  children: React.ReactNode
  walletAddress?: string
}

export function DashboardLayout({ children, walletAddress }: DashboardLayoutProps) {
  const [showDemoBanner, setShowDemoBanner] = useState(false)

  useEffect(() => {
    // Check if the current wallet connection is using demo mode
    const isDemoMode = localStorage.getItem('walletDemoMode') === 'true'
    setShowDemoBanner(isDemoMode)
  }, [])

  return (
    <BalanceProvider walletAddress={walletAddress}>
      <div className="min-h-screen bg-background">
        {/* Demo Mode Banner */}
        {showDemoBanner && <DemoModeBanner />}

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`sticky z-50 border-b border-border bg-card/80 backdrop-blur-md ${showDemoBanner ? 'top-[72px]' : 'top-0'}`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-base">A</span>
                </div>
                <span className="font-semibold text-foreground text-lg">Aframp</span>
              </Link>

              <div className="flex items-center gap-3">
                <EthPriceTicker />
                <ThemeToggle />
                <ConnectButton />
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </BalanceProvider>
  )
}
