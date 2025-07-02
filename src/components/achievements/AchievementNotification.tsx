import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Star } from 'lucide-react'
import { useAchievementStore } from '../../stores/achievementStore'

export function AchievementNotification() {
  const { recentUnlocks, clearRecentUnlocks } = useAchievementStore()

  useEffect(() => {
    if (recentUnlocks.length > 0) {
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        clearRecentUnlocks()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [recentUnlocks, clearRecentUnlocks])

  return (
    <AnimatePresence>
      {recentUnlocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg p-4 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                  {recentUnlocks.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 mt-1"
                    >
                      <Star className="w-4 h-4" />
                      <span className="font-medium">{achievement.name}</span>
                      <span className="text-yellow-200">+{achievement.reward_points} XP</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <button
                onClick={clearRecentUnlocks}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}