import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import Navigation from './components/Navigation'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import Quests from './components/Quests'
import Squads from './components/Squads'

function AppContent() {
  const { onboarded, currentView } = useApp()

  if (!onboarded) {
    return <Onboarding />
  }

  return (
    <div className="flex-1 flex flex-col">
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && <Dashboard key="dashboard" />}
        {currentView === 'quests' && <Quests key="quests" />}
        {currentView === 'squads' && <Squads key="squads" />}
      </AnimatePresence>
      <Navigation />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full relative min-h-dvh">
        <AppContent />
      </div>
    </AppProvider>
  )
}
