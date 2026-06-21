import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Bus, Footprints, Beef, Wheat, Apple, Building, Home, TreePine, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface Option { value: string; label: string; icon: typeof Car }

const commuteOptions: Option[] = [
  { value: 'car', label: 'Car', icon: Car },
  { value: 'bus', label: 'Public Transit', icon: Bus },
  { value: 'walk', label: 'Walk / Bike', icon: Footprints },
]

const dietOptions: Option[] = [
  { value: 'meat-heavy', label: 'Meat Heavy', icon: Beef },
  { value: 'average', label: 'Mixed Diet', icon: Wheat },
  { value: 'plant-based', label: 'Plant Based', icon: Apple },
]

const housingOptions: Option[] = [
  { value: 'house', label: 'Detached House', icon: Home },
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'eco', label: 'Eco-Friendly', icon: TreePine },
]

type StepData = { commute: string; diet: string; housing: string }

const steps = [
  { key: 'commute' as const, question: 'How do you get around?', options: commuteOptions },
  { key: 'diet' as const, question: 'What does your plate look like?', options: dietOptions },
  { key: 'housing' as const, question: 'Where do you live?', options: housingOptions },
]

export default function Onboarding() {
  const { completeOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<StepData>({ commute: '', diet: '', housing: '' })
  const [calculating, setCalculating] = useState(false)
  const [result, setResult] = useState<number | null>(null)

  const current = steps[step]
  const currentValue = data[current.key]

  const select = (value: string) => {
    const next = { ...data, [current.key]: value }
    setData(next)
    if (step < 2) {
      setStep(s => s + 1)
    } else {
      setCalculating(true)
      const score = value === 'car' || next.commute === 'car' ? 8.4 :
        next.commute === 'bus' ? 4.2 : 1.8
      setTimeout(() => {
        setResult(score)
        setTimeout(() => {
          completeOnboarding(next)
        }, 1800)
      }, 2200)
    }
  }

  if (calculating) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <AnimatePresence mode="wait">
            {result === null ? (
              <motion.div
                key="calc"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative w-24 h-24">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent-green/30 border-t-accent-green"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border-2 border-accent-blue/30 border-b-accent-blue"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">🌍</span>
                  </div>
                </div>
                <p className="text-text-secondary text-lg">Calculating your carbon footprint...</p>
                <motion.div className="h-1 w-48 bg-bg-glass rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="text-6xl"
                >
                  🌱
                </motion.div>
                <h2 className="text-2xl font-bold neon-text">Your Carbon Score</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-accent-green">{result.toFixed(1)}</span>
                  <span className="text-text-secondary text-lg">tons CO₂/yr</span>
                </div>
                <p className="text-text-muted text-sm">That's equivalent to {Math.round(result * 120)} km driven</p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 200 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-1 bg-gradient-to-r from-accent-green to-accent-blue rounded-full mt-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.span
          className="text-5xl block mb-3"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          🌿
        </motion.span>
        <h1 className="text-2xl font-bold">Welcome to Carbon Quest</h1>
        <p className="text-text-secondary mt-1 text-sm">Let's measure your impact</p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="w-full max-w-sm"
        >
          <div className="glass-card p-6">
            <div className="flex gap-1.5 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-accent-green' : 'bg-bg-glass'
                  }`}
                />
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-5">{current.question}</h2>
            <div className="flex flex-col gap-3">
              {current.options.map(opt => {
                const Icon = opt.icon
                const selected = currentValue === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => select(opt.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      selected
                        ? 'border-accent-green bg-accent-green/10'
                        : 'border-border-glass bg-bg-glass hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label={opt.label}
                  >
                    <Icon size={22} className={selected ? 'text-accent-green' : 'text-text-muted'} />
                    <span className="font-medium">{opt.label}</span>
                    {selected && (
                      <motion.div
                        layoutId="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <ArrowRight size={18} className="text-accent-green" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-text-muted text-xs mt-6">Step {step + 1} of 3</p>
    </div>
  )
}
