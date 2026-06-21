import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ViewType = 'dashboard' | 'quests' | 'squads'

export interface ActivityLog {
  id: string
  text: string
  carbonSaved: number
  activity: string
  timestamp: number
}

export interface Quest {
  id: string
  title: string
  description: string
  reward: number
  icon: string
  completed: boolean
  verified: boolean
}

export interface SquadMember {
  name: string
  score: number
  avatar: string
  isYou?: boolean
}

export interface UserProfile {
  commute: string
  diet: string
  housing: string
}

interface AppState {
  onboarded: boolean
  userProfile: UserProfile | null
  carbonScore: number
  currentStreak: number
  terrariumStage: 'seedling' | 'sprout' | 'mature'
  logs: ActivityLog[]
  quests: Quest[]
  squadMembers: SquadMember[]
  carbonBudget: number
  carbonUsed: number
  currentView: ViewType
}

interface AppContextType extends AppState {
  completeOnboarding: (profile: UserProfile) => void
  addLog: (text: string) => void
  completeQuest: (id: string) => void
  setView: (view: ViewType) => void
}

const initialQuests: Quest[] = [
  { id: '1', title: 'Meatless Monday', description: 'Go plant-based for the day', reward: 5, icon: '🍃', completed: false, verified: false },
  { id: '2', title: 'Public Transit Hero', description: 'Take the bus or train instead of driving', reward: 8, icon: '🚆', completed: false, verified: false },
  { id: '3', title: 'Eco Shopper', description: 'Bring your own bags and buy local', reward: 6, icon: '🛍️', completed: false, verified: false },
  { id: '4', title: 'Energy Saver', description: 'Unplug unused devices for 4+ hours', reward: 4, icon: '⚡', completed: false, verified: false },
]

const initialSquadMembers: SquadMember[] = [
  { name: 'You', score: 42, avatar: '🌱', isYou: true },
  { name: 'Luna', score: 68, avatar: '🌿' },
  { name: 'Max', score: 55, avatar: '🍀' },
  { name: 'Aria', score: 37, avatar: '🌻' },
  { name: 'Kai', score: 29, avatar: '🌵' },
]

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [onboarded, setOnboarded] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [carbonScore, setCarbonScore] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [terrariumStage, setTerrariumStage] = useState<'seedling' | 'sprout' | 'mature'>('seedling')
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [squadMembers] = useState<SquadMember[]>(initialSquadMembers)
  const [carbonBudget] = useState(200)
  const [carbonUsed, setCarbonUsed] = useState(78)
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  const completeOnboarding = useCallback((profile: UserProfile) => {
    setUserProfile(profile)
    const score = profile.commute === 'car' ? 8.4 : profile.commute === 'bus' ? 4.2 : 1.8
    setCarbonScore(score)
    setTimeout(() => {
      setOnboarded(true)
    }, 2000)
  }, [])

  const addLog = useCallback((text: string) => {
    const lower = text.toLowerCase()
    let carbonSaved = 0
    let activity = ''
    if (lower.includes('walk') || lower.includes('run') || lower.includes('jog')) {
      carbonSaved = 2.4
      activity = 'walking'
    } else if (lower.includes('bike') || lower.includes('cycle')) {
      carbonSaved = 3.1
      activity = 'cycling'
    } else if (lower.includes('bus') || lower.includes('train') || lower.includes('transit')) {
      carbonSaved = 1.8
      activity = 'transit'
    } else if (lower.includes('plant') || lower.includes('tree')) {
      carbonSaved = 5.0
      activity = 'planting'
    } else if (lower.includes('meatless') || lower.includes('vegan') || lower.includes('plant-based')) {
      carbonSaved = 3.5
      activity = 'plant-based meal'
    } else {
      carbonSaved = 1.0
      activity = 'eco-action'
    }

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      text,
      carbonSaved: Math.round(carbonSaved * 10) / 10,
      activity,
      timestamp: Date.now(),
    }

    setLogs(prev => [newLog, ...prev])
    setCurrentStreak(prev => Math.min(prev + 1, 30))
    setTerrariumStage(prev =>
      prev === 'seedling' && logs.length > 3 ? 'sprout' :
      prev === 'sprout' && logs.length > 10 ? 'mature' : prev
    )
    setCarbonUsed(prev => Math.max(0, prev - carbonSaved))
    setCarbonScore(prev => Math.max(0, prev - carbonSaved / 10))
  }, [logs])

  const completeQuest = useCallback((id: string) => {
    setQuests(prev => prev.map(q =>
      q.id === id ? { ...q, completed: true, verified: true } : q
    ))
    setCurrentStreak(prev => Math.min(prev + 2, 30))
    setTerrariumStage(prev =>
      prev === 'seedling' ? 'sprout' :
      prev === 'sprout' ? 'mature' : prev
    )
  }, [])

  return (
    <AppContext.Provider value={{
      onboarded, userProfile, carbonScore, currentStreak, terrariumStage,
      logs, quests, squadMembers, carbonBudget, carbonUsed, currentView,
      completeOnboarding, addLog, completeQuest, setView: setCurrentView,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
