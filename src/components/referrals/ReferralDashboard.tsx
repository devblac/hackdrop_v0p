import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Share2, Copy, Trophy, TrendingUp, Gift, Star } from 'lucide-react'
import { useReferralStore } from '../../stores/referralStore'
import { useAuthStore } from '../../stores/authStore'

export function ReferralDashboard() {
  const { user } = useAuthStore()
  const { stats, history, tiers, isLoading, fetchStats, fetchHistory, fetchTiers, generateReferralLink } = useReferralStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user) {
      fetchStats(user.id)
      fetchHistory(user.id)
      fetchTiers()
    }
  }, [user, fetchStats, fetchHistory, fetchTiers])

  const handleCopyLink = async () => {
    if (!user?.referral_code) return
    
    const link = generateReferralLink(user.referral_code.trim())
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentTier = tiers.find(tier => tier.tier_level === (stats?.current_tier || 1))
  const nextTier = tiers.find(tier => tier.tier_level === (stats?.current_tier || 1) + 1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Referral Dashboard</h1>
        </div>
        <p className="text-purple-100 mb-6">
          Invite friends and earn commissions on their gameplay. The more you refer, the higher your tier!
        </p>
        
        {/* Referral Link */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Your Referral Link</h3>
              <p className="text-purple-100 text-sm">Share this link to start earning</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {copied ? (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          {user?.referral_code && (
            <div className="mt-3 p-3 bg-black/20 rounded font-mono text-sm break-all">
              {generateReferralLink(user.referral_code.trim())}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              +{stats?.this_month_referrals || 0} this month
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats?.total_referrals || 0}
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
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {(stats?.total_commission_earned || 0).toFixed(3)} ALGO
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Earned
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
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {currentTier?.tier_name || 'Bronze'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current Tier
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
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {currentTier?.commission_percentage || 5}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Commission Rate
          </div>
        </motion.div>
      </div>

      {/* Tier Progress */}
      {nextTier && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Progress to {nextTier.tier_name}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {stats?.total_referrals || 0} / {nextTier.min_referrals} referrals
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {nextTier.commission_percentage}% commission rate
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((stats?.total_referrals || 0) / nextTier.min_referrals) * 100, 100)}%`
                }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {nextTier.min_referrals - (stats?.total_referrals || 0)} more referrals to unlock {nextTier.tier_name} tier
            </p>
          </div>
        </motion.div>
      )}

      {/* Referral History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Referral History
          </h3>
        </div>
        <div className="p-6">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.referred_user?.display_name || item.referred_user?.email || 'Anonymous User'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.commission_earned.toFixed(3)} ALGO
                    </div>
                    <div className={`text-sm capitalize ${
                      item.status === 'paid' ? 'text-green-600 dark:text-green-400' :
                      item.status === 'confirmed' ? 'text-blue-600 dark:text-blue-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Referrals Yet
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Start sharing your referral link to see your referrals here!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Share Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/50"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share & Earn
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Share your referral link on social media, with friends, or in gaming communities to maximize your earnings!
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Twitter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Discord</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}