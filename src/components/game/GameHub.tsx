import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet-react'
import { Zap, Trophy, Users, Target, Play, ArrowRight, Star } from 'lucide-react'
import { useGameStore } from '../../stores/gameStore'
import { useAuthStore } from '../../stores/authStore'
import { LoopSelectionGrid } from './LoopSelectionGrid'
import { loopsAPI } from '../../utils/supabase/loops'
import { Link } from 'react-router-dom'

export function GameHub() {
  const { activeAddress } = useWallet()
  const { user } = useAuthStore()
  const { fetchCurrentLoop, isLoading } = useGameStore()
  const [showLoopSelection, setShowLoopSelection] = useState(false)
  const [activeLoopCount, setActiveLoopCount] = useState(0)

  useEffect(() => {
    const loadLoops = async () => {
      const loops = await loopsAPI.fetchAvailableLoops()
      setActiveLoopCount(loops.length)
    }

    loadLoops()
    fetchCurrentLoop()
  }, [fetchCurrentLoop])

  if (showLoopSelection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <button
            onClick={() => setShowLoopSelection(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl text-violet-600 dark:text-violet-400 hover:from-violet-500/20 hover:to-fuchsia-500/20 transition-all duration-300 group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Hub</span>
          </button>
        </div>
        <LoopSelectionGrid />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-4 sm:mb-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            Welcome to HackPot
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-violet-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            The ultimate decentralized prediction platform on Algorand. 
            Choose your prediction round, make your prediction, and win big!
          </p>
        </motion.div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-4">
            <Trophy className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-bold">80,000+</div>
            <div className="text-xs sm:text-sm text-violet-200">HACK Distributed</div>
          </div>
          <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-4">
            <Users className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-blue-300 mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-bold">12,500+</div>
            <div className="text-xs sm:text-sm text-violet-200">Active Predictors</div>
          </div>
          <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-4">
            <Zap className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-green-300 mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-bold">{activeLoopCount}</div>
            <div className="text-xs sm:text-sm text-violet-200">Active Rounds</div>
          </div>
          <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-4">
            <Star className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-pink-300 mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-bold">98.5%</div>
            <div className="text-xs sm:text-sm text-violet-200">Success Rate</div>
          </div>
        </div>

        {/* Primary CTA - Only show if wallet is connected */}
        {activeAddress && (
          <motion.button
            onClick={() => setShowLoopSelection(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-12 py-3 sm:py-4 bg-white text-violet-600 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Choose Your Round</span>
            </div>
          </motion.button>
        )}

        {/* Wallet connection prompt - Only show if wallet is NOT connected */}
        {!activeAddress && (
          <div className="text-center">
            <p className="text-violet-100 mb-3 sm:mb-4 text-base sm:text-lg">
              Connect your wallet to start predicting
            </p>
            <div className="text-xs sm:text-sm text-violet-200">
              Use the wallet button in the top right corner
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Stats Bar */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-300/50 dark:border-gray-700 shadow-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-400">
                {user.level || 1}
              </div>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
                {user.experience_points || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">XP</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
                {user.streak_count || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {(user.total_earnings || 0).toFixed(2)}
              </div>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">HACK Earned</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}