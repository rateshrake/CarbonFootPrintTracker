import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, Camera, Leaf, Image, ArrowDownFromLine } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Quests() {
  const { quests, completeQuest } = useApp()
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback((id: string) => {
    setUploadingId(id)
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      completeQuest(id)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 2000)
  }, [completeQuest])

  const handleDrop = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFile(id)
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 pt-8 pb-28 px-4"
    >
      <div className="text-center">
        <motion.h1
          className="text-lg font-semibold"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Daily Bounties
        </motion.h1>
        <p className="text-text-muted text-xs mt-0.5">Complete quests to grow your impact</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <AnimatePresence>
          {showConfetti && <ConfettiOverlay />}
        </AnimatePresence>

        {quests.map((quest, i) => {
          const isUploading = uploadingId === quest.id
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card overflow-hidden ${
                quest.completed ? 'border-accent-green/30' : 'border-border-glass'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    quest.completed ? 'bg-accent-green/20' : 'bg-bg-glass'
                  }`}>
                    {quest.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold ${quest.completed ? 'text-accent-green' : ''}`}>
                      {quest.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">{quest.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Leaf size={12} className="text-accent-green" />
                      <span className="text-[10px] font-medium text-accent-green">+{quest.reward} impact</span>
                    </div>
                  </div>
                  {quest.completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <CheckCircle size={20} className="text-accent-green" />
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => {
                        setUploadingId(quest.id)
                        fileRef.current?.click()
                      }}
                      className="shrink-0 w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Upload proof for ${quest.title}`}
                    >
                      <Upload size={16} className="text-accent-green" />
                    </motion.button>
                  )}
                </div>
              </div>

              {isUploading && !scanning && !quest.completed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div
                      ref={dropRef}
                      onDrop={e => handleDrop(e, quest.id)}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                        dragOver
                          ? 'border-accent-green bg-accent-green/10 scale-[1.02]'
                          : 'border-border-glass bg-bg-glass hover:border-accent-green/50'
                      }`}
                      onClick={() => fileRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
                      aria-label="Drag and drop photo here to verify quest"
                    >
                      <motion.div
                        animate={dragOver ? { y: [0, -4, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        {dragOver ? (
                          <ArrowDownFromLine size={24} className="text-accent-green mx-auto mb-2" />
                        ) : (
                          <Image size={24} className="text-text-muted mx-auto mb-2" />
                        )}
                      </motion.div>
                      <p className={`text-xs font-medium ${dragOver ? 'text-accent-green' : 'text-text-secondary'}`}>
                        {dragOver ? 'Drop to upload' : 'Drag & drop photo here'}
                      </p>
                      <p className="text-[10px] text-text-muted mt-1">or tap to browse files</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {isUploading && scanning && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div className="glass rounded-xl p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-5 h-5 border-2 border-accent-purple/30 border-t-accent-purple rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          />
                          <span className="text-xs text-text-secondary">Computer Vision scanning your proof...</span>
                        </div>
                        <div className="h-1 w-full bg-bg-glass rounded-full overflow-hidden mt-2">
                          <motion.div
                            className="h-full bg-gradient-to-r from-accent-purple to-accent-green rounded-full"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {isUploading && !scanning && quest.completed && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="glass rounded-xl p-4 text-center flex flex-col items-center gap-1"
                    >
                      <Camera size={20} className="text-accent-green" />
                      <span className="text-xs text-accent-green font-medium">Verification complete!</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => {
          if (e.target.files?.length) {
            const id = quests.find(q => !q.completed)?.id
            if (id) handleFile(id)
          }
          e.target.value = ''
        }}
        aria-label="Upload photo evidence"
      />
    </motion.div>
  )
}

function ConfettiOverlay() {
  const colors = ['#00ff88', '#00d4ff', '#b388ff', '#ff6d00', '#ffd700']
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: colors[i % colors.length] }}
          initial={{ x: '50vw', y: '50vh', scale: 0 }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'easeOut' }}
        />
      ))}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`leaf-${i}`}
          className="absolute text-lg"
          initial={{ x: '50vw', y: '50vh', rotate: 0, scale: 0 }}
          animate={{
            x: `${10 + Math.random() * 80}vw`,
            y: `${10 + Math.random() * 80}vh`,
            rotate: 720 + Math.random() * 360,
            scale: [0, 1.2, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 0.8, ease: 'easeOut' }}
        >
          🍃
        </motion.div>
      ))}
    </motion.div>
  )
}
