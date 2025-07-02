import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Target, Calendar, Award, Star, Users, TrendingUp } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useGameStore } from '../../stores/gameStore'
import { useReferralStore } from '../../stores/referralStore'
import { useAchievementStore } from '../../stores/achievementStore'

export function UserStats() {
  const { user } = useAuthStore()
  const { userStats, fetchUserStats } = useGameStore()
  const { stats: referralStats, fetchStats: fetchReferralStats } = useReferralStore()
  const { userProgress, fetchUserProgress } = useAchievementStore()

  useEffect(() => {
    if (user) {
      fetchUserStats(user.id)
      fetchReferralStats(user.id)
      fetchUserProgress(user.id)
    }
  }, [user, fetchUserStats, fetchReferralStats, fetchUserProgress])

  if (!user || !userStats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Your Stats
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to view your gaming statistics and achievements.
        </p>
      </div>
    )
  }

  const unlockedAchievements = userProgress.filter(p => p.unlocked_at).length
  const totalXP = user.experience_points || 0
  const currentLevel = user.level || 1

  const statCards = [
    {
      icon: Zap,
      label: 'Loops Played',
      value: userStats.total_loops_played,
      color: 'purple'
    },
    {
      icon: Trophy,
      label: 'ALGO Earned',
      value: `${userStats.total_algo_earned.toFixed(3)}`,
      color: 'yellow'
    },
    {
      icon: Target,
      label: 'ALGO Spent',
      value: `${userStats.total_algo_spent.toFixed(3)}`,
      color: 'blue'
    },
    {
      icon: Users,
      label: 'Referrals',
      value: referralStats?.total_referrals || 0,
      color: 'green'
    },
    {
      icon: Award,
      label: 'Achievements',
      value: unlockedAchievements,
      color: 'orange'
    },
    {
      icon: Star,
      label: 'Experience',
      value: totalXP,
      color: 'pink'
    }
  ]

  const colorClasses = {
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    pink: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30'
  }

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Level {currentLevel}</h3>
            <p className="text-purple-100">
              {user.display_name || user.email}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalXP}</div>
            <div className="text-purple-200 text-sm">Total XP</div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-purple-200">Progress to Level {currentLevel + 1}</span>
            <span className="text-purple-200">{totalXP % 1000} / 1000 XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalXP % 1000) / 10}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-700 dark:text-purple-300 font-medium">Invite Friends</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-700 dark:text-yellow-300 font-medium">View Achievements</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">View Stats</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">Play Loop</span>
          </button>
        </div>
      </motion.div>
      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Achievements
          </h3>
        </div>

        {unlockedAchievements > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userProgress.filter(p => p.unlocked_at).slice(0, 8).map((progress, index) => (
              <motion.div
                key={progress.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700/50"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {progress.achievement?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    +{progress.achievement?.reward_points} XP
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No achievements yet. Start playing to earn your first badge!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}