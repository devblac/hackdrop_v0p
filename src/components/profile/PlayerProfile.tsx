import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Target, Calendar, Award, Star, Users, TrendingUp, Crown, Flame } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useGameStore } from '../../stores/gameStore'
import { useReferralStore } from '../../stores/referralStore'
import { useAchievementStore } from '../../stores/achievementStore'

export function PlayerProfile() {
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to view your profile.
        </p>
      </div>
    )
  }

  const unlockedAchievements = userProgress.filter(p => p.unlocked_at).length
  const totalXP = user.experience_points || 0
  const currentLevel = user.level || 1
  const nextLevelXP = currentLevel * 1000
  const currentLevelProgress = totalXP % 1000

  const statCards = [
    {
      icon: Zap,
      label: 'Loops Played',
      value: userStats?.total_loops_played || 0,
      color: 'purple' as const
    },
    {
      icon: Trophy,
      label: 'ALGO Earned',
      value: `${(user.total_earnings || 0).toFixed(3)}`,
      color: 'yellow' as const
    },
    {
      icon: Target,
      label: 'ALGO Spent',
      value: `${(user.total_spent || 0).toFixed(3)}`,
      color: 'blue' as const
    },
    {
      icon: Users,
      label: 'Referrals',
      value: referralStats?.total_referrals || 0,
      color: 'green' as const
    },
    {
      icon: Award,
      label: 'Achievements',
      value: unlockedAchievements,
      color: 'orange' as const
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: user.streak_count || 0,
      color: 'red' as const
    }
  ]

  const colorClasses: Record<string, string> = {
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-12 h-12" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {user.display_name || user.email}
            </h1>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6">
              <div>
                <div className="text-2xl font-bold">Level {currentLevel}</div>
                <div className="text-violet-200">Player Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalXP}</div>
                <div className="text-violet-200">Total XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user.streak_count || 0}</div>
                <div className="text-violet-200">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-violet-200">Progress to Level {currentLevel + 1}</span>
            <span className="text-violet-200">{currentLevelProgress} / 1000 XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentLevelProgress / 1000) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Achievements
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {unlockedAchievements} unlocked
          </div>
        </div>

        {unlockedAchievements > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userProgress
              .filter(p => p.unlocked_at)
              .slice(0, 8)
              .map((progress, index) => (
                <motion.div
                  key={progress.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-700/50 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {progress.achievement?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{progress.achievement?.reward_points} XP
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
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="text-gray-900 dark:text-white">
              {user.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Member Since
            </label>
            <div className="text-gray-900 dark:text-white">
              {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Referral Code
            </label>
            <div className="text-gray-900 dark:text-white font-mono">
              {user.referral_code || 'Generating...'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Role
            </label>
            <div className="text-gray-900 dark:text-white capitalize">
              {user.role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}