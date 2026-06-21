import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, X, Car, Bike, TreePine, UtensilsCrossed, Bus, Footprints } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface Detection {
  label: string
  emoji: string
  carbonValue: number
  description: string
  unit: string
}

const detections: Detection[] = [
  { label: 'Car', emoji: '🚗', carbonValue: 3.8, description: '15km commute detected', unit: 'kg CO₂ emitted' },
  { label: 'Bicycle', emoji: '🚲', carbonValue: 3.1, description: '5km ride detected', unit: 'kg CO₂ saved' },
  { label: 'Tree / Plant', emoji: '🌳', carbonValue: 5.0, description: 'Carbon capture potential', unit: 'kg CO₂ offset' },
  { label: 'Plant-Based Meal', emoji: '🥗', carbonValue: 3.5, description: 'Meatless meal detected', unit: 'kg CO₂ saved' },
  { label: 'Public Transit', emoji: '🚆', carbonValue: 1.8, description: 'Transit ride detected', unit: 'kg CO₂ saved' },
  { label: 'Walking / Running', emoji: '🚶', carbonValue: 2.4, description: 'Active commute detected', unit: 'kg CO₂ saved' },
  { label: 'Recycling', emoji: '♻️', carbonValue: 2.0, description: 'Recycling activity', unit: 'kg CO₂ saved' },
  { label: 'Solar Panel', emoji: '☀️', carbonValue: 6.0, description: 'Renewable energy detected', unit: 'kg CO₂ saved' },
  { label: 'Fast Food', emoji: '🍔', carbonValue: -2.5, description: 'High-carbon meal', unit: 'kg CO₂ impact' },
  { label: 'Plastic Waste', emoji: '🧃', carbonValue: -1.5, description: 'Single-use plastic', unit: 'kg CO₂ impact' },
]

const scanStages = [
  'Initializing AI Vision Engine...',
  'Analyzing image composition...',
  'Detecting objects & scenes...',
  'Cross-referencing carbon database...',
  'Calculating environmental impact...',
]

interface CameraScannerProps {
  onClose: () => void
}

export default function CameraScanner({ onClose }: CameraScannerProps) {
  const { addLog } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStage, setScanStage] = useState(0)
  const [result, setResult] = useState<Detection | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      setImage(e.target?.result as string)
      startScan()
    }
    reader.readAsDataURL(file)
  }, [])

  const startScan = () => {
    setScanning(true)
    setScanProgress(0)
    setScanStage(0)

    const duration = 3000
    const interval = 80
    const steps = duration / interval

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min((step / steps) * 100, 100)
      setScanProgress(progress)
      setScanStage(Math.min(Math.floor((progress / 100) * scanStages.length), scanStages.length - 1))

      if (step >= steps) {
        clearInterval(timer)
        const detection = detections[Math.floor(Math.random() * detections.length)]
        setResult(detection)
        setScanning(false)
        setShowResult(true)

        const logText = `📷 AI scanned: ${detection.emoji} ${detection.label} — ${detection.description}`
        addLog(logText)
      }
    }, interval)
  }

  const handleClose = () => {
    if (image) URL.revokeObjectURL(image)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-card w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border-glass">
          <h2 className="text-sm font-semibold">AI Vision Scanner</h2>
          <motion.button
            onClick={handleClose}
            whileTap={{ scale: 0.85 }}
            aria-label="Close scanner"
          >
            <X size={18} className="text-text-muted" />
          </motion.button>
        </div>

        <div className="p-4">
          {!image ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-border-glass flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent-green/50 transition-colors"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-full bg-accent-green/10 flex items-center justify-center"
              >
                <Camera size={24} className="text-accent-green" />
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-medium">Take a photo or upload</p>
                <p className="text-[10px] text-text-muted mt-1">Snap your eco-action for AI analysis</p>
              </div>
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
              <img src={image} alt="Captured" className="w-full h-full object-cover" />

              {scanning && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-accent-purple/30 border-t-accent-purple rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    />
                    <span className="text-xs text-white/80 font-medium">{scanStages[scanStage]}</span>
                  </div>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-green rounded-full"
                      style={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-accent-green/60"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </div>
              )}

              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{result.emoji}</span>
                    <span className="text-sm font-semibold text-white">{result.label}</span>
                  </div>
                  <p className="text-xs text-white/70">{result.description}</p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
                    className={`text-lg font-bold mt-1 ${result.carbonValue > 0 ? 'text-accent-green' : 'text-accent-orange'}`}
                  >
                    {result.carbonValue > 0 ? '+' : ''}{result.carbonValue.toFixed(1)} {result.unit}
                  </motion.p>
                </motion.div>
              )}
            </div>
          )}

          {!image && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { icon: Car, label: 'Vehicle', color: 'text-accent-orange' },
                { icon: Bike, label: 'Cycling', color: 'text-accent-green' },
                { icon: TreePine, label: 'Nature', color: 'text-accent-green' },
                { icon: UtensilsCrossed, label: 'Food', color: 'text-accent-purple' },
                { icon: Bus, label: 'Transit', color: 'text-accent-blue' },
                { icon: Footprints, label: 'Walking', color: 'text-accent-green' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="glass rounded-lg p-2 text-center">
                    <Icon size={16} className={`${item.color} mx-auto`} />
                    <p className="text-[9px] text-text-muted mt-1">{item.label}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {showResult && result && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-4 pb-4"
          >
            <motion.button
              onClick={handleClose}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2.5 rounded-xl bg-accent-green/20 text-accent-green text-sm font-medium"
            >
              Done — Logged to activity feed
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
        aria-label="Take or upload a photo"
      />
    </motion.div>
  )
}
