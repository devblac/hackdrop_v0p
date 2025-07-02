import { motion } from 'framer-motion'
import { PlayerProfile } from '../components/profile/PlayerProfile'

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 dark:from-slate-900 dark:via-violet-900/20 dark:to-fuchsia-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            Your Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track your prediction performance, achievements, and progress in the HackPot community.
          </p>
        </motion.div>

        <PlayerProfile />
      </div>
    </div>
  )
} 