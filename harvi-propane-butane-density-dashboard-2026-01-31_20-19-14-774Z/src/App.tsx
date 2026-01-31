import React from 'react'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { useTheme } from './hooks/useTheme'

function App() {
  const { mode, isDark, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors duration-300">
      <Header themeMode={mode} onThemeChange={setTheme} />
      <Dashboard />
    </div>
  )
}

export default App