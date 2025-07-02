import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Shield, Users } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { EmailPasswordAuth } from './EmailPasswordAuth'
import { GoogleSignInButton } from './GoogleSignInButton'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

// Memoized close button to prevent re-renders
const CloseButton = memo(({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <X className="w-5 h-5" />
  </button>
))

// Memoized feature item to prevent re-renders
const FeatureItem = memo(({ icon: Icon, text, gradient }: { icon: any; text: string; gradient: string }) => (
  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
    <div className={`w-6 h-6 ${gradient} rounded-lg flex items-center justify-center`}>
      <Icon className="w-3 h-3 text-white" />
    </div>
    <span>{text}</span>
  </div>
))

export const AuthModal = memo(({ isOpen, onClose }: AuthModalProps) => {
  const { isLoading } = useAuthStore()

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose()
    }
  }, [isLoading, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-sm sm:max-w-md mx-4"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-300 dark:border-gray-700 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5"></div>
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-300 dark:border-gray-700">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        Welcome to HackPot
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">
                        The most transparent prediction platform
                      </p>
                    </div>
                  </div>
                  
                  <CloseButton onClick={handleClose} disabled={isLoading} />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Auth Form */}
                  <EmailPasswordAuth />

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <GoogleSignInButton />

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      Why join HackPot?
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <FeatureItem 
                        icon={Shield} 
                        text="Transparent prediction platform" 
                        gradient="bg-gradient-to-br from-emerald-500 to-teal-500" 
                      />
                      <FeatureItem 
                        icon={Users} 
                        text="Join thousands of predictors" 
                        gradient="bg-gradient-to-br from-violet-500 to-purple-500" 
                      />
                      <FeatureItem 
                        icon={Sparkles} 
                        text="Earn rewards for accurate predictions" 
                        gradient="bg-gradient-to-br from-rose-500 to-pink-500" 
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-violet-700 dark:text-violet-400 hover:underline transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-violet-700 dark:text-violet-400 hover:underline transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
})