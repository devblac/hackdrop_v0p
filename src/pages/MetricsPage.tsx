import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, DollarSign, Target, Calendar, Trophy, Activity, BarChart3 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

export function MetricsPage() {
  const { user } = useAuthStore()
  const [timeRange, setTimeRange] = useState('7d')
  
  // Mock metrics data
  const metrics = {
    totalUsers: 15420,
    totalPredictions: 42,
    totalVolume: 125000,
    activeUsers: 3420,
    successRate: 98.5,
    avgPrizePool: 29.8,
    retention: 67.3,
    totalPlayers: 1247,
    totalPrizesPaid: 892.4
  }

  const metricCards = [
    {
      icon: DollarSign,
      label: 'Total Predictions',
      value: metrics.totalPredictions.toLocaleString(),
      change: '+12%',
      color: 'purple' as const
    },
    {
      icon: TrendingUp,
      label: 'Total Volume',
      value: `$${metrics.totalVolume.toLocaleString()}`,
      change: '+8%',
      color: 'green' as const
    },
    {
      icon: Users,
      label: 'Active Users',
      value: metrics.activeUsers.toLocaleString(),
      change: '+15%',
      color: 'blue' as const
    },
    {
      icon: Target,
      label: 'Success Rate',
      value: `${metrics.successRate}%`,
      change: '+2%',
      color: 'yellow' as const
    },
    {
      icon: DollarSign,
      label: 'Avg Prize Pool',
      value: `${metrics.avgPrizePool} ALGO`,
      change: '+5%',
      color: 'indigo' as const
    },
    {
      icon: TrendingUp,
      label: 'Retention',
      value: `${metrics.retention}%`,
      change: '+3%',
      color: 'pink' as const
    }
  ]

  const colorClasses = {
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
    pink: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    teal: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30'
  }

  const leaderboardData = [
    { rank: 1, address: 'ABCD...XYZ9', winnings: 245.7, loops: 12 },
    { rank: 2, address: 'EFGH...ABC3', winnings: 189.2, loops: 8 },
    { rank: 3, address: 'IJKL...DEF6', winnings: 156.8, loops: 15 },
    { rank: 4, address: 'MNOP...GHI2', winnings: 134.5, loops: 6 },
    { rank: 5, address: 'QRST...JKL8', winnings: 98.3, loops: 9 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold mb-2">Game Metrics</h1>
                  <p className="text-blue-100">
                    Analytics and insights for LoopDrop performance
                  </p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm">
                    <span>Viewing as: {user?.role?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      timeRange === range
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:bg-white/10'
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
            {metricCards.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[metric.color]} flex items-center justify-center`}>
                    <metric.icon size={24} />
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Volume Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ALGO Volume Over Time
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Volume Chart</p>
                  <p className="text-sm">Chart visualization integration needed</p>
                </div>
              </div>
            </motion.div>

            {/* User Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daily Active Users
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Users size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="font-medium">User Activity Chart</p>
                  <p className="text-sm">Chart visualization integration needed</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Winners Leaderboard
              </h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">Address</th>
                      <th className="pb-3">Total Winnings</th>
                      <th className="pb-3">Loops Won</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {leaderboardData.map((player, index) => (
                      <motion.tr
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              player.rank === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              player.rank === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                              player.rank === 3 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {player.rank}
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {player.address}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {player.winnings} ALGO
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-gray-600 dark:text-gray-400">
                            {player.loops}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Prediction Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Zap size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Prediction #{item} completed
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item} hours ago
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {(Math.random() * 50 + 10).toFixed(1)} ALGO
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 50 + 10)} players
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}