import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Gift, Star } from 'lucide-react'
import { useReferralStore } from '../../stores/referralStore'

interface ReferralSignupProps {
  onReferralCodeChange: (code: string) => void
  initialCode?: string
}

export function ReferralSignup({ onReferralCodeChange, initialCode }: ReferralSignupProps) {
  const [referralCode, setReferralCode] = useState(initialCode || '')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const { validateReferralCode } = useReferralStore()

  useEffect(() => {
    if (initialCode) {
      setReferralCode(initialCode)
      checkReferralCode(initialCode.trim().toUpperCase())
    }
  }, [initialCode])

  const checkReferralCode = async (code: string) => {
    if (!code.trim()) {
      setIsValid(null)
      return
    }

    setIsChecking(true)
    try {
      const valid = await validateReferralCode(code.trim().toUpperCase())
      setIsValid(valid)
    } catch (error) {
      setIsValid(false)
    } finally {
      setIsChecking(false)
    }
  }

  const handleCodeChange = (value: string) => {
    const upperCode = value.toUpperCase().trim()
    setReferralCode(upperCode)
    onReferralCodeChange(upperCode)
    
    // Debounce validation
    if (upperCode.length >= 6) {
      setTimeout(() => checkReferralCode(upperCode), 500)
    } else {
      setIsValid(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Referral Code Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Referral Code (Optional)
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={referralCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              isValid === true ? 'border-green-300 dark:border-green-600' :
              isValid === false ? 'border-red-300 dark:border-red-600' :
              'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter referral code"
            maxLength={8}
          />
          {isChecking && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            </div>
          )}
          {!isChecking && isValid === true && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
              ✓
            </div>
          )}
          {!isChecking && isValid === false && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600">
              ✗
            </div>
          )}
        </div>
        
        {isValid === true && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Valid referral code!</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              You'll receive bonus rewards when you sign up with this code.
            </p>
          </motion.div>
        )}
        
        {isValid === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg"
          >
            <p className="text-sm text-red-600 dark:text-red-400">
              Invalid referral code. Please check and try again.
            </p>
          </motion.div>
        )}
      </div>

      {/* Benefits Info */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700/50">
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
            Referral Benefits
          </span>
        </div>
        <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
          <li>• Get bonus XP when you complete your first loop</li>
          <li>• Help your friend earn commission on your gameplay</li>
          <li>• Join a community of HackPot predictors</li>
        </ul>
      </div>
    </div>
  )
}