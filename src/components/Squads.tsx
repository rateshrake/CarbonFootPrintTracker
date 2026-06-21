import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Trophy, ArrowUp, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Squads() {
  const { squadMembers, carbonBudget, carbonUsed } = useApp()
  const [expandedMember, setExpandedMember] = useState<string | null>(null)
  const [shieldExpanded, setShieldExpanded] = useState(false)
  const budgetPercent = Math.round((carbonUsed / carbonBudget) * 100)
  const sorted = [...squadMembers].sort((a, b) => b.score - a.score)

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
          Co-Op Mode
        </motion.h1>
        <p className="text-text-muted text-xs mt-0.5">Together, we offset more</p>
      </div>

      <div className="w-full max-w-sm">
        <motion.div
          className="glass-card p-5 cursor-pointer"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShieldExpanded(!shieldExpanded)}
          role="button"
          tabIndex={0}
          aria-label="Co-Op Shield progress. Tap for details"
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShieldExpanded(!shieldExpanded) }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center"
              animate={shieldExpanded ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Shield size={20} className="text-accent-purple" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Co-Op Shield</p>
              <p className="text-[10px] text-text-muted">Weekly squad carbon budget</p>
            </div>
            {shieldExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
          </div>
          <div className="relative h-3 bg-bg-glass rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-green via-accent-blue to-accent-purple"
              initial={{ width: '0%' }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/10 border border-white/20"
              animate={{ left: `${budgetPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-text-muted">
            <span>{carbonUsed} kg used</span>
            <span>{carbonBudget} kg budget</span>
          </div>
          <motion.p
            className="text-center text-xs font-medium mt-3"
            style={{ color: budgetPercent > 80 ? '#ff6d00' : '#00ff88' }}
          >
            {budgetPercent > 80 ? '⚠️ Almost at limit!' : '✅ Looking good, squad!'}
          </motion.p>
          <AnimatePresence>
            {shieldExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-border-glass">
                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <Users size={12} />
                    <span>{squadMembers.length} members · {budgetPercent}% of budget used</span>
                  </div>
                  <p className="text-[9px] text-text-muted mt-1 leading-relaxed">
                    Your squad's collective carbon budget resets every Monday. 
                    Staying under 80% unlocks a bonus multiplier for all members.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} className="text-accent-orange" />
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Leaderboard</span>
        </div>
        <div className="flex flex-col gap-2">
          {sorted.map((member, i) => {
            const isExpanded = expandedMember === member.name
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`glass-card px-4 py-3 flex flex-col cursor-pointer ${
                  member.isYou ? 'border-accent-green/20' : ''
                }`}
                onClick={() => setExpandedMember(isExpanded ? null : member.name)}
                whileHover={{ scale: 1.02, x: 3 }}
                whileTap={{ scale: 0.98 }}
                role="button"
                tabIndex={0}
                aria-label={`${member.name}: ${member.score} points. Tap for details`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedMember(isExpanded ? null : member.name) }}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center text-xs font-bold ${
                    i === 0 ? 'text-accent-orange' : i === 1 ? 'text-accent-blue' : i === 2 ? 'text-accent-purple' : 'text-text-muted'
                  }`}>
                    #{i + 1}
                  </span>
                  <motion.span
                    className="text-lg"
                    animate={isExpanded ? { rotate: [0, -15, 15, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {member.avatar}
                  </motion.span>
                  <span className="flex-1 text-sm font-medium">
                    {member.name}
                    {member.isYou && <span className="text-[10px] text-accent-green ml-1">(you)</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="text-sm font-bold text-accent-green"
                      key={member.score}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                    >
                      {member.score}
                    </motion.span>
                    {i < 3 && <ArrowUp size={12} className="text-accent-green" />}
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pt-2 border-t border-border-glass text-[10px] text-text-muted">
                        <p>This week: <span className="text-accent-green font-medium">{member.score} impact points</span></p>
                        <p className="mt-0.5">Rank: #{i + 1} of {sorted.length}</p>
                        {member.isYou && (
                          <p className="text-accent-green mt-0.5">
                            {i === 0 ? '👑 You\'re in the lead!' : `📊 ${sorted[0].score - member.score} points behind #1`}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div
        className="glass-card p-4 w-full max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <p className="text-xs text-text-secondary">
          Squad total: <span className="text-accent-green font-bold">{sorted.reduce((s, m) => s + m.score, 0)}</span> impact points
        </p>
      </motion.div>
    </motion.div>
  )
}
