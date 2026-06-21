import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Terrarium from './Terrarium'
import SmartBar from './SmartBar'
import CameraScanner from './CameraScanner'
import CarbonFloat from './CarbonFloat'
import { useApp } from '../context/AppContext'
import { Flame, Droplets, Zap, Camera } from 'lucide-react'

export default function Dashboard() {
  const { carbonScore, logs } = useApp()
  const [showCamera, setShowCamera] = useState(false)
  const prevLogCount = useRef(logs.length)
  const [floatTrigger, setFloatTrigger] = useState(0)

  if (logs.length > prevLogCount.current) {
    prevLogCount.current = logs.length
    setFloatTrigger(t => t + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 pt-8 pb-28"
    >
      <CarbonFloat trigger={floatTrigger} />

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

      <Terrarium />

      <div className="grid grid-cols-3 gap-3 px-4 w-full max-w-sm">
        {[
          { label: 'Footprint', value: `${carbonScore.toFixed(1)}t`, icon: Flame, color: 'text-accent-orange' },
          { label: 'Saved', value: `${logs.reduce((s, l) => s + l.carbonSaved, 0).toFixed(1)}kg`, icon: Droplets, color: 'text-accent-blue' },
          { label: 'Actions', value: `${logs.length}`, icon: Zap, color: 'text-accent-purple' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-3 text-center"
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
            </motion.div>
          )
        })}
      </div>

      <SmartBar />

      {logs.length > 0 && (
        <div className="w-full max-w-sm px-4">
          <p className="text-text-muted text-[10px] uppercase tracking-wider mb-3 font-medium">Recent Activity</p>
          <div className="flex flex-col gap-2">
            {logs.slice(0, 5).map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card px-4 py-2.5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center shrink-0">
                  <span className="text-sm">{log.activity === 'walking' ? '🚶' : log.activity === 'cycling' ? '🚴' : log.activity === 'transit' ? '🚆' : log.activity === 'planting' ? '🌳' : log.activity === 'plant-based meal' ? '🥗' : '🌱'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{log.text}</p>
                  <p className="text-[10px] text-accent-green">-{log.carbonSaved} kg CO₂</p>
                </div>
                <span className="text-[10px] text-text-muted shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCamera && <CameraScanner onClose={() => setShowCamera(false)} />}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowCamera(true)}
        className="fixed right-5 bottom-20 z-40 w-12 h-12 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center shadow-lg shadow-accent-green/10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open AI camera scanner"
      >
        <Camera size={20} className="text-accent-green" />
      </motion.button>
    </motion.div>
  )
}
