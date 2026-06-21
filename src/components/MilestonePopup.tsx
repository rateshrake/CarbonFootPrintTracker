import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface MilestonePopupProps {
  message: string
  onClose: () => void
}

export default function MilestonePopup({ message, onClose }: MilestonePopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
      onClick={onClose}
      role="alert"
      aria-live="polite"
    >
      <motion.div
        className="glass-card px-5 py-3 flex items-center gap-3 border-accent-green/30 shadow-lg shadow-accent-green/10"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles size={16} className="text-accent-green" />
        </motion.div>
        <p className="text-xs font-medium text-text-primary whitespace-nowrap">{message}</p>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-accent-green"
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.div>
    </motion.div>
  )
}
