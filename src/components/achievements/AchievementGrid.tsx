import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Zap, Users, Target, Award, Crown, DollarSign, Sunrise, Flame, Megaphone } from 'lucide-react'
import { useAchievementStore } from '../../stores/achievementStore'
import { useAuthStore } from '../../stores/authStore'

const iconMap = {
  Zap,
  Target,
  Trophy,
  Award,
  Users,
  Megaphone,
  Star,
  DollarSign,
  Crown,
  Sunrise,
  Flame
}

export function AchievementGrid() {
  const { user } = useAuthStore()
  const { achievements, userProgress, recentUnlocks, isLoading, fetchAchievements, fetchUserProgress, claimAchievement, clearRecentUnlocks } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
    if (user) {
      fetchUserProgress(user.id)
    }
  }, [user, fetchAchievements, fetchUserProgress])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600'
      case 'rare':
        return 'from-blue-400 to-blue-600'
      case 'epic':
        return 'from-purple-400 to-purple-600'
      case 'legendary':
        return 'from-yellow-400 to-orange-500'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 dark:border-gray-600'
      case 'rare':
        return 'border-blue-300 dark:border-blue-600'
      case 'epic':
        return 'border-purple-300 dark:border-purple-600'
      case 'legendary':
        return 'border-yellow-300 dark:border-yellow-600'
      default:
        return 'border-gray-300 dark:border-gray-600'
    }
  }

  const getProgressForAchievement = (achievementId: string) => {
    return userProgress.find(p => p.achievement_id === achievementId)
  }

  const handleClaimAchievement = async (progressId: string) => {
    await claimAchievement(progressId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const categorizedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = []
    }
    acc[achievement.category].push(achievement)
    return acc
  }, {} as Record<string, typeof achievements>)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Achievements</h1>
        </div>
        <p className="text-yellow-100 mb-4">
          Complete challenges, unlock achievements, and earn experience points to level up your profile!
        </p>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {userProgress.filter(p => p.unlocked_at).length}
            </div>
            <div className="text-yellow-200 text-sm">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {achievements.length}
            </div>
            <div className="text-yellow-200 text-sm">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {userProgress.filter(p => p.unlocked_at).reduce((sum, p) => sum + (p.achievement?.reward_points || 0), 0)}
            </div>
            <div className="text-yellow-200 text-sm">XP Earned</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Unlocks */}
      <AnimatePresence>
        {recentUnlocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎉 Achievement Unlocked!</h3>
                <div className="space-y-1">
                  {recentUnlocks.map(achievement => (
                    <div key={achievement.id} className="flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>{achievement.name}</span>
                      <span className="text-purple-200">+{achievement.reward_points} XP</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={clearRecentUnlocks}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Categories */}
      {Object.entries(categorizedAchievements).map(([category, categoryAchievements], categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {category} Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryAchievements.map((achievement, index) => {
              const progress = getProgressForAchievement(achievement.id)
              const isUnlocked = !!progress?.unlocked_at
              const isClaimed = !!progress?.is_claimed
              const progressPercentage = progress ? (progress.progress / progress.target) * 100 : 0
              const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Trophy

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                  className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${getRarityBorder(achievement.rarity)} ${
                    isUnlocked ? 'shadow-lg' : 'opacity-75'
                  } hover:shadow-xl transition-all`}
                >
                  {/* Rarity Indicator */}
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`} />
                  
                  {/* Achievement Icon */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} flex items-center justify-center mb-4 mx-auto`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Achievement Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {achievement.reward_points} XP
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        achievement.rarity === 'common' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {progress && !isUnlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {progress.progress} / {progress.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} transition-all duration-300`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {isUnlocked && !isClaimed && progress && (
                    <button
                      onClick={() => handleClaimAchievement(progress.id)}
                      className="w-full py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                    >
                      Claim Reward
                    </button>
                  )}

                  {isUnlocked && isClaimed && (
                    <div className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-center">
                      ✓ Claimed
                    </div>
                  )}

                  {!progress && (
                    <div className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-center">
                      Not Started
                    </div>
                  )}

                  {/* Unlock Effect */}
                  {isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
                    >
                      <Trophy className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ))}
    </div>
  )
}