import React from 'react'
import { Download, X } from 'lucide-react'
import { usePWAInstall } from '../hooks/usePWAInstall'

export function PWAInstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstall()
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable])

  if (!isVisible || !isInstallable) {
    return null
  }

  const handleInstall = async () => {
    const installed = await promptInstall()
    if (installed) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Don't show again for this session
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 animate-slide-up">
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 shadow-2xl border border-blue-400/20">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white/20">
            <Download className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="text-white font-bold text-lg mb-1">
              Установить приложение
            </h3>
            <p className="text-blue-50 text-sm mb-3">
              Добавьте на домашний экран для быстрого доступа и работы офлайн
            </p>
            
            <button
              onClick={handleInstall}
              className="w-full py-2.5 px-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Установить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
