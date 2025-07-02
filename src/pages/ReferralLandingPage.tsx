import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Gift, Star, Trophy, Zap, ArrowRight } from 'lucide-react'
import { useReferralStore } from '../stores/referralStore'
import { useAuthStore } from '../stores/authStore'

export function ReferralLandingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { validateReferralCode } = useReferralStore()
  const { isAuthenticated } = useAuthStore()
  const [referralCode, setReferralCode] = useState('')
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      setReferralCode(refCode.toUpperCase())
      validateCode(refCode)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const validateCode = async (code: string) => {
    try {
      setIsLoading(true)
      const valid = await validateReferralCode(code)
      setIsValidCode(valid)
    } catch (error) {
      console.error('Error validating referral code:', error)
      setIsValidCode(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/')
    } else {
      // Store referral code for signup process
      if (referralCode) {
        sessionStorage.setItem('referral_code', referralCode)
      }
      navigate('/')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to HackPot
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                The most transparent community-driven prediction platform on Algorand
              </p>
            </div>

            {/* Referral Status */}
            {referralCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${
                  isValidCode 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700/50'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700/50'
                }`}
              >
                {isValidCode ? <Gift className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                <span className="font-medium">
                  {isValidCode 
                    ? `Valid referral code: ${referralCode}`
                    : `Invalid referral code: ${referralCode}`
                  }
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Instant Gaming
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start playing loops immediately with just your Algorand wallet. No complex setup required.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Win ALGO Prizes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compete for real ALGO rewards in our fair, transparent, and provably random games.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Earn Achievements
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Unlock achievements, level up your profile, and earn experience points as you play.
              </p>
            </div>
          </motion.div>

          {/* Referral Benefits */}
          {referralCode && isValidCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-700/50"
            >
              <div className="text-center mb-6">
                <Gift className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Special Referral Benefits
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You're joining through a friend's referral! Here's what you get:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Bonus XP</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Extra experience points on your first prediction</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Community Access</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Join an active community of players</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Achievement Boost</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Faster progress toward unlocking achievements</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Friend Support</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Help your friend earn referral rewards</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span>{isAuthenticated ? 'Enter Game Hub' : 'Get Started'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              {isAuthenticated 
                ? 'Welcome back! Ready to make some predictions?'
                : 'Connect your wallet and start playing in under 30 seconds'
              }
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">12K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Players</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">80K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ALGO Distributed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">98.5%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}