import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet-react'
import { X, Zap, AlertCircle, Trophy, Target, Users } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { Loop } from '../../stores/gameStore'

interface LoopEntryModalProps {
  isOpen: boolean
  onClose: () => void
  loop: Loop
}

export function LoopEntryModal({ isOpen, onClose, loop }: LoopEntryModalProps) {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const { user } = useAuthStore()
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAddress || !user || selectedNumber === null) return

    setIsSubmitting(true)
    setError('')

    try {
      // TODO: Implement actual transaction using algokit-utils
      // This is a placeholder for the smart contract interaction
      const entryData = {
        loop: loop.id,
        chosenNumber: selectedNumber,
        ticketPrice: loop.ticket_price,
        wallet: activeAddress,
        userId: user.id
      }
      
      console.log('Entering loop:', entryData)

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(true)
      
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (err) {
      setError('Failed to enter loop. Please try again.')
      console.error('Transaction error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY':
        return 'from-green-500 to-emerald-600'
      case 'MEDIUM':
        return 'from-yellow-500 to-orange-600'
      case 'HARD':
        return 'from-red-500 to-pink-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enter Prediction Round
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {success ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Entry Successful!
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                You've entered the prediction round with number {selectedNumber}. Good luck!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Loop Info */}
              <div className={`bg-gradient-to-r ${getDifficultyColor(loop.difficulty)} rounded-lg p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">
                    {loop.difficulty} Round
                  </h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{loop.ticket_price} HACK</div>
                    <div className="text-sm opacity-90">Entry Fee</div>
                  </div>
                </div>
                <div className="text-lg font-semibold mb-2">{loop.name}</div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{loop.prize_pool} HACK</div>
                    <div className="text-xs opacity-90">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{Math.floor(loop.prize_pool / loop.ticket_price)}</div>
                    <div className="text-xs opacity-90">Current Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{loop.max_tickets}</div>
                    <div className="text-xs opacity-90">Max Players</div>
                  </div>
                </div>
              </div>

              {/* Number Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Your Lucky Number (0-9)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setSelectedNumber(number)}
                      className={`aspect-square rounded-lg border-2 font-bold text-lg transition-all ${
                        selectedNumber === number
                          ? `border-purple-500 bg-gradient-to-r ${getDifficultyColor(loop.difficulty)} text-white`
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                {selectedNumber !== null && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Selected number: <span className="font-bold text-purple-600 dark:text-purple-400">{selectedNumber}</span>
                  </p>
                )}
              </div>

              {/* Game Rules */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/50">
                <div className="flex items-start space-x-2">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      How to Win
                    </h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      When the round fills up, a random number (0-9) will be drawn. 
                      The player with the matching number wins 80% of the prize pool!
                    </p>
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Connected Wallet
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                  {activeAddress}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || selectedNumber === null}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedNumber !== null && !isSubmitting
                    ? `bg-gradient-to-r ${getDifficultyColor(loop.difficulty)} text-white hover:shadow-lg`
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Enter Round - {loop.ticket_price} HACK</span>
                  </div>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}