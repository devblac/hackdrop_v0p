import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Zap, Users } from 'lucide-react'
import { Loop } from '../../stores/gameStore'

interface LoopRevealProps {
  loop: Loop
  onClose: () => void
}

export function LoopReveal({ loop, onClose }: LoopRevealProps) {
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealStep, setRevealStep] = useState(0)
  
  // Mock data for demonstration
  const mockResults = {
    winningNumber: 42,
    winner: 'ABCD...XYZ9',
    totalEntries: 156,
    prizeDistribution: {
      winner: loop.prize_pool * 0.8,
      second: loop.prize_pool * 0.15,
      third: loop.prize_pool * 0.05
    }
  }

  const startReveal = () => {
    setIsRevealing(true)
    
    // Animate through reveal steps
    const steps = [1, 2, 3, 4]
    steps.forEach((step, index) => {
      setTimeout(() => {
        setRevealStep(step)
      }, (index + 1) * 1000)
    })
  }

  return (
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Loop Results
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {!isRevealing ? (
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 mb-6">
              <Zap className="mx-auto h-16 w-16 text-purple-400 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {loop.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ready to reveal the results?
              </p>
              <button
                onClick={startReveal}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                Reveal Winner
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Total Entries */}
            <AnimatePresence>
              {revealStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Users className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockResults.totalEntries}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Total Entries</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: Prize Pool */}
            <AnimatePresence>
              {revealStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Trophy className="mx-auto h-12 w-12 text-yellow-500 mb-2" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {loop.prize_pool} ALGO
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Total Prize Pool</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Winning Number */}
            <AnimatePresence>
              {revealStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                    <div className="text-4xl font-bold text-white">
                      {mockResults.winningNumber}
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    Winning Number
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Winner & Prize Distribution */}
            <AnimatePresence>
              {revealStep >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700/50">
                    <div className="text-center">
                      <Trophy className="mx-auto h-8 w-8 text-yellow-600 dark:text-yellow-400 mb-2" />
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Winner
                      </div>
                      <div className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {mockResults.winner}
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {mockResults.prizeDistribution.winner} ALGO
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        2nd Place
                      </div>
                      <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                        {mockResults.prizeDistribution.second} ALGO
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        3rd Place
                      </div>
                      <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                        {mockResults.prizeDistribution.third} ALGO
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}