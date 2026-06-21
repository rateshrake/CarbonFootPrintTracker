import { type ViewType, useApp } from '../context/AppContext'
import { Leaf, Target, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const tabs: { id: ViewType; label: string; icon: typeof Leaf }[] = [
  { id: 'dashboard', label: 'Terrarium', icon: Leaf },
  { id: 'quests', label: 'Bounties', icon: Target },
  { id: 'squads', label: 'Squads', icon: Users },
]

export default function Navigation() {
  const { currentView, setView } = useApp()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" aria-label="Main navigation">
      <div className="glass border-t border-border-glass">
        <div className="max-w-lg mx-auto flex items-center justify-around px-4 py-3">
          {tabs.map(tab => {
            const active = currentView === tab.id
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`relative flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                  active ? 'text-accent-green' : 'text-text-muted hover:text-text-secondary'
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`${tab.label} tab`}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-accent-green/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative" />
                <span className="relative text-[10px] font-medium tracking-wide uppercase">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
