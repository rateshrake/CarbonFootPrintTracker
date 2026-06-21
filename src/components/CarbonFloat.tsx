import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  delay: number
  size: number
  text: string
  color: string
}

const texts = ['CO₂', '-kg', '🌱', '↓CO₂', 'saved']
const colors = ['#00ff88', '#00d4ff', '#b388ff', '#ff6d00', '#00ff88']

export default function CarbonFloat({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const counterRef = useRef(0)

  useEffect(() => {
    if (trigger === 0) return

    const newParticles: Particle[] = []
    const count = 3 + Math.floor(Math.random() * 3)

    for (let i = 0; i < count; i++) {
      counterRef.current++
      newParticles.push({
        id: counterRef.current,
        x: 15 + Math.random() * 70,
        delay: Math.random() * 0.8,
        size: 12 + Math.random() * 10,
        text: texts[Math.floor(Math.random() * texts.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    setParticles(prev => [...prev, ...newParticles])

    const timer = setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)))
    }, 5000)

    return () => clearTimeout(timer)
  }, [trigger])

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {particles.map(p => {
          const drift = (Math.random() - 0.5) * 30
          const wobble = (Math.random() - 0.5) * 10
          return (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: '100vh',
                opacity: 0,
                scale: 0.3,
              }}
              animate={{
                y: ['100vh', '-10vh'],
                x: [
                  `${p.x}vw`,
                  `${p.x + wobble}vw`,
                  `${p.x + drift}vw`,
                  `${p.x + wobble}vw`,
                ],
                opacity: [0, 0.5, 0.5, 0.5, 0],
                scale: [0.3, 1, 1.1, 1.05, 1.3],
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 4 + Math.random() * 1.5,
                delay: p.delay,
                ease: [0.22, 0.61, 0.36, 1],
                x: {
                  duration: 4 + Math.random() * 1.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'reverse',
                },
                opacity: {
                  duration: 4 + Math.random() * 1.5,
                  ease: 'easeOut',
                  times: [0, 0.05, 0.4, 0.8, 1],
                },
                scale: {
                  duration: 4 + Math.random() * 1.5,
                  ease: 'easeInOut',
                },
              }}
              className="absolute font-bold tracking-widest drop-shadow-[0_0_8px_rgba(0,255,136,0.3)] select-none"
              style={{
                color: p.color,
                opacity: 0.5,
                fontSize: p.size,
              }}
            >
              {p.text}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
