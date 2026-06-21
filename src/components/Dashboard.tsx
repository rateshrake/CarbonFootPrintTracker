import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Terrarium from './Terrarium'
import SmartBar from './SmartBar'
import CameraScanner from './CameraScanner'
import CarbonFloat from './CarbonFloat'
import MilestonePopup from './MilestonePopup'
import { useApp } from '../context/AppContext'
import { Flame, Droplets, Zap, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react'

const physicalEquivalents = [
  { min: 3, label: '🏋️ 100 L-Sits', desc: 'Burn calories, not carbon!' },
  { min: 2, label: '🚴 30 min cycling', desc: 'Pedal power offsets your footprint' },
  { min: 1.5, label: '🧘 45 min yoga', desc: 'Find your eco-zen' },
  { min: 1, label: '🚶 20 min walk', desc: 'Every step counts' },
  { min: 0, label: '🌱 1 tree planted', desc: 'Small actions, big impact' },
]

function getEquivalent(carbonSaved: number) {
  return physicalEquivalents.find(eq => carbonSaved >= eq.min) ?? physicalEquivalents[physicalEquivalents.length - 1]
}

const statDetails: Record<string, { detail: string; color: string }> = {
  Footprint: { detail: 'Your estimated annual carbon footprint based on your lifestyle and logged activities', color: 'text-accent-orange' },
  Saved: { detail: 'Total CO₂ saved across all your logged eco-actions this session', color: 'text-accent-blue' },
  Actions: { detail: 'Every logged action helps grow your digital terrarium and reduce your impact', color: 'text-accent-purple' },
}

export default function Dashboard() {
  const { carbonScore, logs, currentStreak } = useApp()
  const [showCamera, setShowCamera] = useState(false)
  const [expandedStat, setExpandedStat] = useState<string | null>(null)
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [showMilestone, setShowMilestone] = useState<string | null>(null)
  const prevLogCount = useRef(logs.length)
  const [floatTrigger, setFloatTrigger] = useState(0)
  const prevStreak = useRef(currentStreak)

  if (logs.length > prevLogCount.current) {
    prevLogCount.current = logs.length
    setFloatTrigger(t => t + 1)
  }

  if (currentStreak > 0 && currentStreak !== prevStreak.current && (currentStreak % 5 === 0 || currentStreak === 1 || currentStreak === 3 || currentStreak === 7)) {
    prevStreak.current = currentStreak
    const messages: Record<number, string> = {
      1: '🌱 First action logged! Your journey begins',
      3: '🌿 3-day streak — you\'re building momentum',
      5: '🌟 5-day streak — eco-warrior in the making!',
      7: '🌳 One week strong — nature approves!',
      10: '🔥 10-day streak — unstoppable force!',
      15: '⚡ 15 days — legend status loading...',
      20: '🏆 20-day streak — you\'re a climate hero!',
      30: '👑 30 days — MAX STREAK! Eternal eco-legend!',
    }
    const msg = messages[currentStreak] || `🎯 ${currentStreak}-day streak! Keep going!`
    setShowMilestone(msg)
    setTimeout(() => setShowMilestone(null), 3500)
  }

  const totalSaved = logs.reduce((s, l) => s + l.carbonSaved, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 pt-8 pb-28"
    >
      <CarbonFloat trigger={floatTrigger} />

      <AnimatePresence>
        {showMilestone && <MilestonePopup message={showMilestone} onClose={() => setShowMilestone(null)} />}
      </AnimatePresence>

      <div className="text-center px-4">
        <motion.h1
          className="text-lg font-semibold"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Your Ecosystem
        </motion.h1>
        <p className="text-text-muted text-xs mt-0.5">Your actions shape the world</p>
      </div>

      <Terrarium onTap={() => setExpandedStat(expandedStat === 'streak' ? null : 'streak')} />

      <div className="grid grid-cols-3 gap-3 px-4 w-full max-w-sm">
        {[
          { label: 'Footprint', value: `${carbonScore.toFixed(1)}t`, icon: Flame, color: 'text-accent-orange' },
          { label: 'Saved', value: `${totalSaved.toFixed(1)}kg`, icon: Droplets, color: 'text-accent-blue' },
          { label: 'Actions', value: `${logs.length}`, icon: Zap, color: 'text-accent-purple' },
        ].map((stat, i) => {
          const Icon = stat.icon
          const isExpanded = expandedStat === stat.label
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-3 text-center cursor-pointer"
              onClick={() => setExpandedStat(isExpanded ? null : stat.label)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              tabIndex={0}
              aria-label={`${stat.label}: ${stat.value}. Tap for details`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedStat(isExpanded ? null : stat.label) }}
            >
              <Icon size={16} className={`${stat.color} mx-auto mb-1`} />
              <p className="text-text-muted text-[10px] uppercase tracking-wider">{stat.label}</p>
              <motion.p
                className="text-sm font-bold mt-0.5"
                key={stat.value}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {stat.value}
              </motion.p>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-2 pt-2 border-t border-border-glass"
                >
                  <p className="text-[9px] text-text-secondary leading-relaxed">{statDetails[stat.label]?.detail}</p>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {logs.length > 0 && (
        <div className="w-full max-w-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 border-accent-green/10 relative overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpandedLog(expandedLog === 'burn' ? null : 'burn')}
            role="button"
            tabIndex={0}
            aria-label="Burn Calories, Not Carbon widget. Tap for details"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedLog(expandedLog === 'burn' ? null : 'burn') }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-green/5 via-transparent to-accent-blue/5"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-orange/20 flex items-center justify-center shrink-0">
                <Dumbbell size={18} className="text-accent-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
                  Burn Calories, Not Carbon
                </p>
                <motion.p
                  key={logs[0]?.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold text-accent-green mt-1"
                >
                  {getEquivalent(logs[0]?.carbonSaved ?? 0).label}
                </motion.p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  {getEquivalent(logs[0]?.carbonSaved ?? 0).desc}
                </p>
                {expandedLog === 'burn' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-2 pt-2 border-t border-border-glass"
                  >
                    <p className="text-[10px] text-text-muted">
                      You've saved a total of <span className="text-accent-green font-medium">{totalSaved.toFixed(1)} kg CO₂</span> across {logs.length} actions.
                      That's like planting <span className="text-accent-green font-medium">{(totalSaved / 21).toFixed(1)} trees</span>!
                    </p>
                  </motion.div>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-[10px] text-text-muted">{logs[0]?.carbonSaved.toFixed(1)} kg CO₂ saved</p>
                  {expandedLog === 'burn' ? <ChevronUp size={10} className="text-text-muted" /> : <ChevronDown size={10} className="text-text-muted" />}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <SmartBar />

      {logs.length > 1 && (
        <div className="w-full max-w-sm px-4">
          <p className="text-text-muted text-[10px] uppercase tracking-wider mb-3 font-medium">Recent Activity</p>
          <div className="flex flex-col gap-2">
            {logs.slice(0, 5).map(log => {
              const isExpanded = expandedLog === log.id
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card px-4 py-2.5 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                  role="button"
                  tabIndex={0}
                  aria-label={`Activity: ${log.text}. Tap for details`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedLog(isExpanded ? null : log.id) }}
                >
                  <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center shrink-0">
                    <span className="text-sm">{log.activity === 'walking' ? '🚶' : log.activity === 'cycling' ? '🚴' : log.activity === 'transit' ? '🚆' : log.activity === 'planting' ? '🌳' : log.activity === 'plant-based meal' ? '🥗' : '🌱'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{log.text}</p>
                    <p className="text-[10px] text-accent-green">-{log.carbonSaved} kg CO₂</p>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-1.5 pt-1.5 border-t border-border-glass"
                      >
                        <p className="text-[9px] text-text-muted">
                          Logged at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[9px] text-text-muted mt-0.5">
                          Activity type: <span className="text-accent-green capitalize">{log.activity}</span>
                        </p>
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCamera && <CameraScanner onClose={() => setShowCamera(false)} />}
      </AnimatePresence>
    </motion.div>
  )
}
