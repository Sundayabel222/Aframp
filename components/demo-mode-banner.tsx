'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 dark:bg-amber-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Demo Mode Active</p>
              <p className="text-xs opacity-90">
                You are using mock wallet addresses. Balances and transactions are not real. Real
                wallet connection failed or is unavailable.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
