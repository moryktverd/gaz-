import React from 'react'
import { Smartphone } from 'lucide-react'
import { usePWAInstall } from '../hooks/usePWAInstall'

export function MobileOptimized() {
  const { isInstalled } = usePWAInstall()

  if (!isInstalled) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
        <Smartphone className="w-3 h-3" />
        <span>Установлено</span>
      </div>
    </div>
  )
}
