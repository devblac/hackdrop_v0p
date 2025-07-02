import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Target, Zap, Flame, Clock, Users, Trophy, Star, ArrowRight, TrendingUp, Award, Crown, Shield } from 'lucide-react'
import { useGameStore, Loop } from '../../stores/gameStore'
import { loopsAPI } from '../../utils/supabase/loops'
import { LoopEntryModal } from './LoopEntryModal'

const difficultyConfig = {
  EASY: {
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    glowColor: 'shadow-emerald-500/25',
    label: 'Easy Predictions',
    description: 'Perfect for beginners - low risk, steady rewards',
    badge: 'Beginner Friendly',
    riskLevel: 'Low Risk'
  },
  MEDIUM: {
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-600 dark:text-violet-400',
    glowColor: 'shadow-violet-500/25',
    label: 'Medium Predictions',
    description: 'Balanced risk and reward for experienced predictors',
    badge: 'Balanced',
    riskLevel: 'Medium Risk'
  },
  HARD: {
    icon: Flame,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'from-rose-500/10 to-pink-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-600 dark:text-rose-400',
    glowColor: 'shadow-rose-500/25',
    label: 'Hard Predictions',
    description: 'High stakes, high rewards for prediction masters',
    badge: 'Expert Only',
    riskLevel: 'High Risk'
  }
}

// Default config for unknown difficulties
const defaultConfig = {
  icon: Target,
  color: 'from-gray-500 to-gray-600',
  bgColor: 'from-gray-500/10 to-gray-600/10',
  borderColor: 'border-gray-500/30',
  textColor: 'text-gray-600 dark:text-gray-400',
  glowColor: 'shadow-gray-500/25',
  label: 'Unknown Difficulty',
  description: 'Difficulty level not specified',
  badge: 'Unknown',
  riskLevel: 'Unknown Risk'
}

export function LoopSelectionGrid() {
  const [loops, setLoops] = useState<Loop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('EASY') // Default to EASY
  const [mobileStep, setMobileStep] = useState<'difficulty' | 'pots'>('difficulty') // Mobile step state
  const [selectedLoop, setSelectedLoop] = useState<Loop | null>(null)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const { setSelectedLoop: setGameStoreLoop } = useGameStore()

  useEffect(() => {
    fetchLoops()
  }, [])

  const fetchLoops = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching loops...')
      const fetchedLoops = await loopsAPI.getAllLoops()
      console.log('✅ Fetched loops:', fetchedLoops)
      
      // Filter and validate loops
      const validLoops = (fetchedLoops || []).filter(loop => {
        if (!loop.difficulty) {
          console.warn('⚠️ Loop missing difficulty:', loop)
          return false
        }
        return true
      })
      
      setLoops(validLoops)
    } catch (err) {
      console.error('❌ Failed to fetch loops:', err)
      setError('Failed to load prediction rounds')
    } finally {
      setLoading(false)
    }
  }

  const handleLoopSelect = (loop: Loop) => {
    setSelectedLoop(loop)
    setGameStoreLoop(loop)
    setShowEntryModal(true)
  }

  const getLoopsByDifficulty = (difficulty: string) => {
    const filtered = loops.filter(loop => loop.difficulty.toUpperCase() === difficulty.toUpperCase())
    return filtered
  }

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
    setMobileStep('pots')
  }

  const handleBackToDifficulty = () => {
    setMobileStep('difficulty')
  }

  const formatTimeRemaining = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diff = created.getTime() - now.getTime() + (7 * 24 * 60 * 60 * 1000) // Add 7 days
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h left`
    return 'Less than 1h left'
  }

  const getParticipationPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

  // Safe function to get config for a difficulty
  const getDifficultyConfig = (difficulty: string) => {
    const upperDifficulty = difficulty.toUpperCase()
    return difficultyConfig[upperDifficulty as keyof typeof difficultyConfig] || defaultConfig
  }

  const filteredLoops = useMemo(() => {
    return getLoopsByDifficulty(selectedDifficulty)
  }, [loops, selectedDifficulty])

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading prediction rounds...</p>
        </div>
      </div>
    )
  }

  if (error && loops.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchLoops}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Mobile: Two-step selection */}
      <div className="md:hidden">
        {mobileStep === 'difficulty' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Select Your Round
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your preferred difficulty level
              </p>
            </div>
            
            <div className="grid gap-4">
              {Object.entries(difficultyConfig).map(([difficulty, config]) => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultySelect(difficulty)}
                  className="w-full p-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-300/50 dark:border-gray-700/20 hover:bg-white/90 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <config.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {config.label}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {config.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-medium bg-gradient-to-r ${config.color} text-white rounded-full`}>
                          {config.badge}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {config.riskLevel}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Mobile: Back button and current selection */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToDifficulty}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl text-gray-600 dark:text-gray-400 hover:from-gray-500/20 hover:to-gray-600/20 transition-all duration-300 group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </button>
              <div className="text-center">
                {(() => {
                  const config = getDifficultyConfig(selectedDifficulty)
                  const IconComponent = config.icon
                  return (
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${config.color} text-white rounded-full text-sm font-medium`}>
                      <IconComponent className="w-4 h-4" />
                      <span>{config.label}</span>
                    </div>
                  )
                })()}
              </div>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Available Rounds
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select your preferred prediction round
              </p>
            </div>

            {/* Mobile: Pot selection */}
            <div className="grid gap-4">
              {filteredLoops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-6">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No prediction rounds available
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    No active rounds in {getDifficultyConfig(selectedDifficulty).label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-500">
                    Check back soon for new rounds!
                  </p>
                </div>
              ) : (
                filteredLoops.map((loop, index) => {
                  const config = getDifficultyConfig(loop.difficulty)
                  const IconComponent = config.icon

                  return (
                    <motion.div
                      key={loop.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => handleLoopSelect(loop)}
                    >
                      <div className="relative p-4 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-300/50 dark:border-gray-700/20 hover:bg-white/90 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <div className="relative">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors mb-2">
                                {loop.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium bg-gradient-to-r ${config.color} text-white rounded-lg`}>
                                  {config.badge}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {config.riskLevel}
                                </span>
                              </div>
                            </div>
                            <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center shadow-lg`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="text-center p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-gray-200/50 dark:border-gray-700/20">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {loop.ticket_price}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Entry Fee (HACK)
                              </div>
                            </div>
                            <div className="text-center p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-gray-200/50 dark:border-gray-700/20">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {loop.prize_pool}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Prize Pool (HACK)
                              </div>
                            </div>
                          </div>

                          {/* Participation Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-700 dark:text-gray-400">Participation</span>
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                {Math.floor(loop.prize_pool / loop.ticket_price)}/{loop.max_tickets}
                              </span>
                            </div>
                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 bg-gradient-to-r ${config.color} rounded-full transition-all duration-300`}
                                style={{ width: `${getParticipationPercentage(Math.floor(loop.prize_pool / loop.ticket_price), loop.max_tickets)}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Time Remaining */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-700 dark:text-gray-400">Time Left</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                              {formatTimeRemaining(loop.created_at)}
                            </span>
                          </div>

                          {/* Action Button */}
                          <div className="mt-auto">
                            <div className="flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 dark:border-violet-500/20 rounded-lg group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 transition-all duration-300">
                              <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                                Select Round
                              </span>
                              <ArrowRight className="w-3 h-3 text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden md:block">
        {/* Difficulty Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {Object.entries(difficultyConfig).map(([difficulty, config]) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                selectedDifficulty === difficulty
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                  : 'bg-white/80 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/20 text-gray-800 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-800/70'
              }`}
            >
              <config.icon className="w-4 h-4" />
              <span>{config.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Prediction Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredLoops.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No prediction rounds available
              </h3>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                No active rounds in {difficultyConfig[selectedDifficulty as keyof typeof difficultyConfig]?.label}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-500">
                Check back soon for new rounds!
              </p>
            </div>
          ) : (
            filteredLoops.map((loop, index) => {
              // Safely get config with fallback
              const config = getDifficultyConfig(loop.difficulty)
              const IconComponent = config.icon

              return (
                <motion.div
                  key={loop.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => handleLoopSelect(loop)}
                >
                  <div className="relative h-full p-4 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-300/50 dark:border-gray-700/20 hover:bg-white/90 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors mb-2">
                            {loop.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium bg-gradient-to-r ${config.color} text-white rounded-lg`}>
                              {config.badge}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {config.riskLevel}
                            </span>
                          </div>
                        </div>
                        <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-gray-200/50 dark:border-gray-700/20">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {loop.ticket_price}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Entry Fee (HACK)
                          </div>
                        </div>
                        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-gray-200/50 dark:border-gray-700/20">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {loop.prize_pool}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Prize Pool (HACK)
                          </div>
                        </div>
                      </div>

                      {/* Participation Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-700 dark:text-gray-400">Participation</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {Math.floor(loop.prize_pool / loop.ticket_price)}/{loop.max_tickets}
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 bg-gradient-to-r ${config.color} rounded-full transition-all duration-300`}
                            style={{ width: `${getParticipationPercentage(Math.floor(loop.prize_pool / loop.ticket_price), loop.max_tickets)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Time Remaining */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-700 dark:text-gray-400">Time Left</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatTimeRemaining(loop.created_at)}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 dark:border-violet-500/20 rounded-lg group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 transition-all duration-300">
                          <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                            Select Round
                          </span>
                          <ArrowRight className="w-3 h-3 text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 dark:border-violet-500/20 rounded-2xl">
          <Star className="w-6 h-6 text-violet-700 dark:text-violet-400" />
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              New rounds added regularly
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-400">
              Check back often for fresh prediction opportunities!
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loop Entry Modal */}
      <AnimatePresence>
        {showEntryModal && selectedLoop && (
          <LoopEntryModal
            isOpen={showEntryModal}
            onClose={() => {
              setShowEntryModal(false)
              setSelectedLoop(null)
            }}
            loop={selectedLoop}
          />
        )}
      </AnimatePresence>
    </div>
  )
}