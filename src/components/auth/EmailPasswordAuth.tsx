import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useReferralStore } from '../../stores/referralStore'
import { ReferralSignup } from './ReferralSignup'

// Memoized button components to prevent constant re-renders
const SignInButton = memo(({ isActive, onClick, disabled }: { isActive: boolean; onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive
        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
        : 'text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400'
    }`}
  >
    Sign In
  </button>
))

const SignUpButton = memo(({ isActive, onClick, disabled }: { isActive: boolean; onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive
        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
        : 'text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400'
    }`}
  >
    Sign Up
  </button>
))

export function EmailPasswordAuth() {
  const { signInWithEmail, signUpWithEmail, isLoading, user } = useAuthStore()
  const { processReferral } = useReferralStore()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check for referral code in session storage or URL
  useEffect(() => {
    // First check session storage (from referral landing page)
    const storedRefCode = sessionStorage.getItem('referral_code')
    if (storedRefCode) {
      setReferralCode(storedRefCode)
      setMode('signup')
      return
    }
    
    // Then check URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    if (refCode) {
      setReferralCode(refCode)
      setMode('signup') // Switch to signup mode if referral code is present
    }
  }, [])
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError(new Error('Passwords do not match'))
          return
        }
        if (password.length < 6) {
          setError(new Error('Password must be at least 6 characters'))
          return
        }
        const result = await signUpWithEmail(email, password)
        
        // Process referral if code was provided
        if (referralCode && user) {
          // Clear the stored referral code
          sessionStorage.removeItem('referral_code')
          
          try {
            await processReferral(user.id, referralCode)
          } catch (referralError) {
            console.error('Failed to process referral:', referralError)
            // Don't fail the signup if referral processing fails
          }
        }
      } else {
        await signInWithEmail(email, password)
      }
    } catch (err: any) {
      // Provide more user-friendly error messages
      if (err.message === 'Invalid login credentials') {
        setError(new Error('Incorrect email or password. Please check your details or sign up if you don\'t have an account.'))
      } else {
        setError(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [mode, email, password, confirmPassword, referralCode, user, signInWithEmail, signUpWithEmail, processReferral])

  const handleModeChange = useCallback((newMode: 'signin' | 'signup') => {
    setMode(newMode)
    setError(null) // Clear any existing errors when switching modes
  }, [])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError(null) // Clear errors when user starts typing
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setError(null) // Clear errors when user starts typing
  }, [])

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setError(null) // Clear errors when user starts typing
  }, [])

  const handleReferralCodeChange = useCallback((code: string) => {
    setReferralCode(code)
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  // Memoize the loading state to prevent unnecessary re-renders
  const loading = useMemo(() => isLoading || isSubmitting, [isLoading, isSubmitting])

  // Memoize button click handlers
  const handleSignInClick = useCallback(() => handleModeChange('signin'), [handleModeChange])
  const handleSignUpClick = useCallback(() => handleModeChange('signup'), [handleModeChange])

  // Memoize button props to prevent unnecessary re-renders
  const signInButtonProps = useMemo(() => ({
    isActive: mode === 'signin',
    onClick: handleSignInClick,
    disabled: loading
  }), [mode, handleSignInClick, loading])

  const signUpButtonProps = useMemo(() => ({
    isActive: mode === 'signup',
    onClick: handleSignUpClick,
    disabled: loading
  }), [mode, handleSignUpClick, loading])

  return (
    <div className="space-y-4">
      {/* Auth Mode Toggle */}
      <div className="flex bg-white/20 dark:bg-gray-800/20 rounded-xl p-1">
        <SignInButton {...signInButtonProps} />
        <SignUpButton {...signUpButtonProps} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Referral Code Input (Sign Up Only) */}
        {mode === 'signup' && (
          <ReferralSignup
            onReferralCodeChange={handleReferralCodeChange}
            initialCode={referralCode}
          />
        )}

        {/* Email Input */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5 sm:mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-400/50 dark:border-gray-700/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/80 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5 sm:mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className="w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-3 border border-gray-400/50 dark:border-gray-700/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/80 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={6}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-violet-700 dark:hover:text-violet-400 transition-colors duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password (Sign Up Only) */}
        {mode === 'signup' && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5 sm:mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-400/50 dark:border-gray-700/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/80 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm"
                placeholder="Confirm your password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 sm:p-4 bg-red-50/90 dark:bg-red-900/20 border border-red-300/50 dark:border-red-700/50 rounded-lg sm:rounded-xl"
          >
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">{error.message}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg sm:rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base font-medium"
        >
          <div className="relative flex items-center space-x-2">
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : mode === 'signup' ? (
              <>
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Sign In</span>
              </>
            )}
          </div>
        </motion.button>
      </form>
    </div>
  )
}