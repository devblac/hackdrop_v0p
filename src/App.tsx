import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Shield, Users, Globe, Heart, ExternalLink, ArrowUpRight } from 'lucide-react'
import { Header } from './components/layout/Header'
import { BottomNavigation } from './components/navigation/BottomNavigation'
import { GameHub } from './components/game/GameHub'
import { CommunityPage } from './pages/CommunityPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { FAQPage } from './pages/FAQPage'
import { ContactPage } from './pages/ContactPage'
import { MetricsPage } from './pages/MetricsPage'
import { AdminPage } from './pages/AdminPage'
import { SuperAdminPage } from './pages/SuperAdminPage'
import { ProfilePage } from './pages/ProfilePage'
import { AchievementsPage } from './pages/AchievementsPage'
import { ReferralsPage } from './pages/ReferralsPage'
import { UserSettingsPage } from './pages/UserSettingsPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ReferralLandingPage } from './pages/ReferralLandingPage'
import { useAuthStore } from './stores/authStore'

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
    WalletId.EXODUS,
    {
      id: WalletId.WALLETCONNECT,
      options: { projectId: 'fcfde0713d43baa0d23be0773c80a72b' },
    },
  ],
  defaultNetwork: NetworkId.TESTNET,
})

// 404 Component
function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 dark:from-slate-900 dark:via-violet-900/20 dark:to-fuchsia-900/20 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/25">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-gray-600 dark:text-gray-400 mb-8"
        >
          Oops! This prediction round doesn't exist yet.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Back to Predictions</span>
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  )
}

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 dark:from-slate-900 dark:via-violet-900/20 dark:to-fuchsia-900/20">
          {/* Bolt.new Badge - Desktop: below menu, Mobile: near bottom */}
          <div className="fixed top-20 right-4 md:top-24 md:right-4 bottom-20 md:bottom-auto z-40">
            <a 
              href="https://bolt.new/?rid=n4h4a5" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block transition-all duration-300 hover:shadow-2xl group"
            >
              <img 
                src="https://storage.bolt.army/white_circle_360x360.png" 
                alt="Built with Bolt.new badge" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
            </a>
          </div>

          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<GameHub />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/metrics" element={<MetricsPage />} />
                    <Route path="/admin" element={
                      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/super-admin" element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <SuperAdminPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/achievements" element={
                      <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
                        <AchievementsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/referrals" element={
                      <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
                        <ReferralsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/user-settings" element={
                      <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
                        <UserSettingsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/ref/:referralCode" element={<ReferralLandingPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </main>

              {/* Stunning Footer */}
              <footer className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 via-purple-500/5 to-fuchsia-500/5"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-7 h-7 text-white" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl blur-xl"></div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            HackPot
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Transparent Community Predictions
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        The most transparent community-driven prediction platform on Algorand. 
                        Join thousands of predictors making predictions and earning rewards.
                      </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Platform
                      </h4>
                      <ul className="space-y-3">
                        <li>
                          <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Make Predictions
                          </a>
                        </li>
                        <li>
                          <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Your Profile
                          </a>
                        </li>
                        <li>
                          <a href="/achievements" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Achievements
                          </a>
                        </li>
                        <li>
                          <a href="/referrals" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Referrals
                          </a>
                        </li>
                        <li>
                          <a href="/community" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Community
                          </a>
                        </li>
                        <li>
                          <a href="/roadmap" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Roadmap
                          </a>
                        </li>
                        <li>
                          <a href="/faq" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            FAQ
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Resources
                      </h4>
                      <ul className="space-y-3">
                        <li>
                          <a href="/metrics" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Analytics
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Documentation
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            API Reference
                          </a>
                        </li>
                        <li>
                          <a href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Support
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Social & Legal */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Connect
                      </h4>
                      <ul className="space-y-3">
                        <li>
                          <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            <Globe className="w-4 h-4" />
                            <span>Discord</span>
                          </a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            <span>Twitter</span>
                          </a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>Blog</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="mt-12 pt-8 border-t border-gray-300/50 dark:border-gray-700/50">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        © 2025 HackPot. Built on Algorand. All rights reserved.
                      </p>
                      <div className="flex items-center space-x-6 text-sm">
                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                          Privacy Policy
                        </a>
                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                          Terms of Service
                        </a>
                        <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                          Cookie Policy
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>

              <BottomNavigation />
            </div>
          </Router>
        </div>
      </WalletUIProvider>
    </WalletProvider>
  )
}

export default App