import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Camera } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CameraScanner from './CameraScanner'

export default function SmartBar() {
  const { addLog } = useApp()
  const [input, setInput] = useState('')
  const [parsing, setParsing] = useState(false)
  const [showResult, setShowResult] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    const text = input.trim()
    if (!text || parsing) return

    setParsing(true)
    await new Promise(r => setTimeout(r, 1200))
    setParsing(false)
    addLog(text)
    setInput('')

    const lower = text.toLowerCase()
    let msg = ''
    if (lower.includes('walk') || lower.includes('run')) msg = '🚶 2.4 kg CO₂ saved — equivalent to 100 L-Sits!'
    else if (lower.includes('bike') || lower.includes('cycle')) msg = '🚴 3.1 kg CO₂ saved — burn calories, not carbon!'
    else if (lower.includes('bus') || lower.includes('train')) msg = '🚆 1.8 kg CO₂ saved — public transit hero!'
    else if (lower.includes('plant') || lower.includes('tree')) msg = '🌳 5.0 kg CO₂ saved — the planet thanks you!'
    else if (lower.includes('meatless') || lower.includes('vegan')) msg = '🥗 3.5 kg CO₂ saved — great for the planet!'
    else msg = '✅ 1.0 kg CO₂ saved — every action counts!'

    setShowResult(msg)
    setTimeout(() => setShowResult(null), 3000)
  }

  return (
    <div className="w-full px-4">
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <Sparkles size={16} className="text-accent-purple shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Log your activity... e.g. I drove 15km"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
            aria-label="Log your eco-activity"
            disabled={parsing}
          />
          <motion.button
            onClick={() => setShowCamera(true)}
            className="shrink-0"
            whileTap={{ scale: 0.85 }}
            aria-label="Scan with camera"
          >
            <Camera size={16} className="text-accent-purple" />
          </motion.button>
          <AnimatePresence mode="wait">
            {parsing ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-5 h-5"
              >
                <motion.div
                  className="w-full h-full border-2 border-accent-green/30 border-t-accent-green rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                />
              </motion.div>
            ) : (
              <motion.button
                key="send"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: input.trim() ? 1 : 0.3, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleSubmit}
                className="shrink-0"
                whileTap={{ scale: 0.85 }}
                aria-label="Submit activity"
                disabled={!input.trim()}
              >
                <Send size={16} className="text-accent-green" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showCamera && <CameraScanner onClose={() => setShowCamera(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card mt-2 px-4 py-2.5 border-accent-green/20">
              <p className="text-xs text-accent-green font-medium">{showResult}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
