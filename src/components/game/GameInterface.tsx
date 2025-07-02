import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet-react'
import { Zap, Trophy, Clock, Users } from 'lucide-react'
import { useGameStore } from '../../stores/gameStore'
import { useAuthStore } from '../../stores/authStore'
import { useAchievementStore } from '../../stores/achievementStore'
import { TicketPurchase } from './TicketPurchase'
import { LoopReveal } from './LoopReveal'

export function GameInterface() {
  const { activeAddress } = useWallet()
  const { user } = useAuthStore()
  const { currentLoop, fetchCurrentLoop, isLoading } = useGameStore()
  const { checkProgress } = useAchievementStore()
  const [showPurchase, setShowPurchase] = useState(false)
  const [showReveal, setShowReveal] = useState(false)

  useEffect(() => {
    fetchCurrentLoop()
  }, [fetchCurrentLoop])

  const handleTicketPurchase = async (ticketData: any) => {
    // Handle ticket purchase logic here
    console.log('Ticket purchased:', ticketData)
    
    // Check for achievements after ticket purchase
    if (user && activeAddress) {
      await checkProgress(user.id, 'loop_entries', {
        walletAddress: activeAddress,
        amount: ticketData.amount
      })
    }
    
    setShowPurchase(false)
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!currentLoop) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/20">
          <Zap className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Active Loop
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back soon for the next mysterious loop to begin...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Current Loop Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-500/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {currentLoop.name}
          </h2>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
            <Zap size={16} className="mr-1" />
            {currentLoop.difficulty}
          </div>
        </div>

        {/* Loop Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <Trophy className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentLoop.prize_pool} ALGO
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Prize Pool</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <Users className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentLoop.max_tickets}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Max Tickets</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <Zap className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentLoop.ticket_price} ALGO
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ticket Price</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <Clock className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Active
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {activeAddress ? (
            <>
              <button
                onClick={() => setShowPurchase(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                Enter Loop
              </button>
              <button
                onClick={() => setShowReveal(true)}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                View Results
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect your wallet to enter the loop
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showPurchase && (
          <TicketPurchase
            loop={currentLoop}
            onClose={() => setShowPurchase(false)}
            onPurchase={handleTicketPurchase}
          />
        )}
        {showReveal && (
          <LoopReveal
            loop={currentLoop}
            onClose={() => setShowReveal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}