import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Share2, Trophy, Target, DollarSign, Calendar, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ViralMetrics {
  totalReferrals: number
  activeReferrers: number
  conversionRate: number
  totalCommissionPaid: number
  topReferrers: Array<{
    email: string
    referrals: number
    commission: number
  }>
  achievementStats: Array<{
    name: string
    unlocks: number
    category: string
  }>
  dailySignups: Array<{
    date: string
    signups: number
    referralSignups: number
  }>
}

export function ViralAnalytics() {
  const [metrics, setMetrics] = useState<ViralMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchViralMetrics()
  }, [timeRange])

  const fetchViralMetrics = async () => {
    try {
      setIsLoading(true)

      // Fetch referral metrics
      const { data: referralStats } = await supabase
        .from('referral_stats')
        .select('*')

      const { data: referralHistory } = await supabase
        .from('referral_history')
        .select(`
          *,
          referrer:users!referral_history_referrer_id_fkey(email)
        `)

      const { data: achievements } = await supabase
        .from('user_achievement_progress')
        .select(`
          *,
          achievement:achievements(name, category)
        `)
        .not('unlocked_at', 'is', null)

      const { data: users } = await supabase
        .from('users')
        .select('created_at, referred_by_code')
        .order('created_at', { ascending: false })

      // Calculate metrics
      const totalReferrals = referralStats?.reduce((sum, stat) => sum + stat.total_referrals, 0) || 0
      const activeReferrers = referralStats?.filter(stat => stat.total_referrals > 0).length || 0
      const totalCommissionPaid = referralHistory?.reduce((sum, history) => sum + history.commission_earned, 0) || 0
      
      // Calculate conversion rate
      const totalUsers = users?.length || 0
      const referredUsers = users?.filter(user => user.referred_by_code).length || 0
      const conversionRate = totalUsers > 0 ? (referredUsers / totalUsers) * 100 : 0

      // Top referrers
      const referrerMap = new Map()
      referralHistory?.forEach(history => {
        const email = history.referrer?.email
        if (email) {
          const existing = referrerMap.get(email) || { email, referrals: 0, commission: 0 }
          existing.referrals += 1
          existing.commission += history.commission_earned
          referrerMap.set(email, existing)
        }
      })
      const topReferrers = Array.from(referrerMap.values())
        .sort((a, b) => b.referrals - a.referrals)
        .slice(0, 5)

      // Achievement stats
      const achievementMap = new Map()
      achievements?.forEach(progress => {
        const name = progress.achievement?.name
        const category = progress.achievement?.category
        if (name) {
          const existing = achievementMap.get(name) || { name, unlocks: 0, category }
          existing.unlocks += 1
          achievementMap.set(name, existing)
        }
      })
      const achievementStats = Array.from(achievementMap.values())
        .sort((a, b) => b.unlocks - a.unlocks)

      // Daily signups (last 30 days)
      const dailySignups = []
      const now = new Date()
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        const dayUsers = users?.filter(user => 
          user.created_at.startsWith(dateStr)
        ) || []
        
        const dayReferralUsers = dayUsers.filter(user => user.referred_by_code)
        
        dailySignups.push({
          date: dateStr,
          signups: dayUsers.length,
          referralSignups: dayReferralUsers.length
        })
      }

      setMetrics({
        totalReferrals,
        activeReferrers,
        conversionRate,
        totalCommissionPaid,
        topReferrers,
        achievementStats,
        dailySignups
      })
    } catch (error) {
      console.error('Error fetching viral metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Failed to load viral analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Viral Analytics</h1>
              <p className="text-green-100">
                Track referral performance and user engagement metrics
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-white/20 text-white'
                    : 'text-green-100 hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {metrics.totalReferrals}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Referrals
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {metrics.activeReferrers}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Referrers
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {metrics.conversionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Referral Rate
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {metrics.totalCommissionPaid.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ALGO Paid Out
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Signups Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Signups (Last 30 Days)
          </h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {metrics.dailySignups.map((day, index) => {
              const maxSignups = Math.max(...metrics.dailySignups.map(d => d.signups))
              const height = maxSignups > 0 ? (day.signups / maxSignups) * 100 : 0
              const referralHeight = maxSignups > 0 ? (day.referralSignups / maxSignups) * 100 : 0
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t relative" style={{ height: '200px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                    <div
                      className="absolute bottom-0 w-full bg-green-500 rounded-t transition-all duration-300"
                      style={{ height: `${referralHeight}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transform -rotate-45 origin-top-left">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Total Signups</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Referral Signups</span>
            </div>
          </div>
        </motion.div>

        {/* Top Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Popular Achievements
          </h3>
          <div className="space-y-3">
            {metrics.achievementStats.slice(0, 8).map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {achievement.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {achievement.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {achievement.unlocks}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    unlocks
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Referrers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Referrers
          </h3>
        </div>
        <div className="p-6">
          {metrics.topReferrers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    <th className="pb-3">Rank</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Referrals</th>
                    <th className="pb-3">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {metrics.topReferrers.map((referrer, index) => (
                    <motion.tr
                      key={referrer.email}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="border-t border-gray-100 dark:border-gray-700"
                    >
                      <td className="py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                          index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-gray-900 dark:text-white">
                          {referrer.email}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {referrer.referrals}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {referrer.commission.toFixed(3)} ALGO
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No referral data yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}