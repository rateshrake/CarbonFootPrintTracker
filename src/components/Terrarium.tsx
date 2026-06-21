import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const stageConfig = {
  seedling: { emoji: '🌱', label: 'Seedling', scale: 0.7, color: '#00ff88' },
  sprout: { emoji: '🌿', label: 'Sprout', scale: 1, color: '#00d4ff' },
  mature: { emoji: '🌳', label: 'Mature', scale: 1.1, color: '#b388ff' },
}

export default function Terrarium() {
  const { terrariumStage, currentStreak, logs } = useApp()
  const config = stageConfig[terrariumStage]

  return (
    <div className="relative flex flex-col items-center" aria-label={`Terrarium: ${config.label}`}>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${config.color}15 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-white/5"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), transparent)' }}
        />
        <motion.span
          className="text-6xl relative z-10"
          key={terrariumStage}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: config.scale, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          role="img"
          aria-label={config.label}
        >
          {config.emoji}
        </motion.span>
        {terrariumStage !== 'mature' && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: config.color }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <motion.p
        className="text-xs font-medium tracking-wider uppercase mt-3"
        style={{ color: config.color }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        {config.label}
      </motion.p>

      <div className="flex items-center gap-3 mt-3">
        <div className="glass-card px-3 py-1.5 text-center">
          <p className="text-text-muted text-[10px] uppercase tracking-wider">Streak</p>
          <motion.p
            className="text-lg font-bold text-accent-green"
            key={currentStreak}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {currentStreak}
          </motion.p>
        </div>
        <div className="glass-card px-3 py-1.5 text-center">
          <p className="text-text-muted text-[10px] uppercase tracking-wider">Actions</p>
          <p className="text-lg font-bold text-accent-blue">{logs.length}</p>
        </div>
      </div>

      {terrariumStage === 'seedling' && logs.length === 0 && (
        <motion.p
          className="text-text-muted text-xs mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Log your first activity below to grow your plant
        </motion.p>
      )}
    </div>
  )
}
