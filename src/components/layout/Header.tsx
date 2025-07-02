import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import { WalletButton } from '@txnlab/use-wallet-ui-react'
import { Moon, Sun, Settings, User, LogOut, Shield, BarChart3, Trophy, Users, Award, Sparkles, Menu, X, Star, Share2, MessageCircle, ExternalLink } from 'lucide-react'
import { useGameStore } from '../../stores/gameStore'
import { useAuthStore } from '../../stores/authStore'
import { AuthModal } from '../auth/AuthModal'

export function Header() {
  const { activeAddress } = useWallet()
  const { user, isAuthenticated, signOut } = useAuthStore()
  const { theme, setTheme } = useGameStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const location = useLocation()

  // Close auth modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showAuthModal) {
      setShowAuthModal(false)
    }
  }, [isAuthenticated, showAuthModal])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  const navigation = [
    { name: 'Predict', href: '/', icon: Sparkles },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Roadmap', href: '/roadmap', icon: Trophy },
    { name: 'FAQ', href: '/faq', icon: Award },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsProfileDropdownOpen(false)
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/10 border-b border-gray-200/50 dark:border-gray-800/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile: Menu Button (Left) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gray-100/80 dark:bg-gray-800/10 border border-gray-300/50 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-gray-200/80 dark:hover:bg-gray-800/20 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            {/* Desktop: Logo (Left) */}
            <div className="hidden md:flex flex-shrink-0">
              <Link to="/">
                <div className="flex items-center space-x-3 group">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300 group-hover:scale-110">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent group-hover:from-violet-500 group-hover:via-purple-500 group-hover:to-fuchsia-500 transition-all duration-300">
                    HackPot
                  </span>
                </div>
              </Link>
            </div>

            {/* Mobile: Centered Logo */}
            <div className="md:hidden flex-shrink-0">
              <Link to="/">
                <div className="flex items-center space-x-2 group">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300 group-hover:scale-110">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent group-hover:from-violet-500 group-hover:via-purple-500 group-hover:to-fuchsia-500 transition-all duration-300">
                    HackPot
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-700 dark:text-violet-400 border border-violet-500/40 dark:border-violet-500/30'
                      : 'text-gray-800 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-xl blur-sm"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gray-100/80 dark:bg-gray-800/10 border border-gray-300/50 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-gray-200/80 dark:hover:bg-gray-800/20 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
              </button>

              {/* Authentication */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Sign In Button */}
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="relative px-3 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-lg sm:rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-1 sm:space-x-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">Sign In</span>
                    </div>
                  </button>

                  {/* Wallet Connection */}
                  <div className="scale-75 sm:scale-100 origin-right">
                    <WalletButton />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* User Profile */}
                  <div className="relative profile-dropdown">
                    <button 
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/40 dark:border-violet-500/30 text-violet-700 dark:text-violet-400 hover:from-violet-500/30 hover:to-fuchsia-500/30 transition-all duration-300"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                        <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">{user?.email?.split('@')[0]}</span>
                      <span className="text-xs sm:text-sm font-medium sm:hidden">{user?.email?.split('@')[0]?.substring(0, 8)}...</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl border border-gray-300/50 dark:border-gray-700/20 shadow-2xl z-50">
                        <div className="py-2">
                          {/* User Section */}
                          <div className="px-3 py-2 border-b border-gray-300/50 dark:border-gray-700/50 mb-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user?.display_name || user?.email?.split('@')[0]}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {user?.email}
                            </div>
                          </div>

                          {/* Profile Links */}
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          
                          <Link
                            to="/achievements"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                          >
                            <Award className="w-4 h-4" />
                            <span>Achievements</span>
                          </Link>
                          
                          <Link
                            to="/referrals"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Referrals</span>
                          </Link>
                          
                          <Link
                            to="/user-settings"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>User Settings</span>
                          </Link>
                          
                          {/* Admin Links - Only show for admin/super_admin */}
                          {(user?.role === 'admin' || user?.role === 'super_admin') && (
                            <>
                              <div className="border-t border-gray-300/50 dark:border-gray-700/50 my-1"></div>
                              <Link
                                to="/metrics"
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                              >
                                <BarChart3 className="w-4 h-4" />
                                <span>Metrics</span>
                              </Link>
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                              >
                                <Shield className="w-4 h-4" />
                                <span>Admin Panel</span>
                              </Link>
                              {user?.role === 'super_admin' && (
                                <Link
                                  to="/super-admin"
                                  onClick={() => setIsProfileDropdownOpen(false)}
                                  className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                                >
                                  <Settings className="w-4 h-4" />
                                  <span>Super Admin</span>
                                </Link>
                              )}
                            </>
                          )}
                          
                          {/* Divider */}
                          <div className="border-t border-gray-300/50 dark:border-gray-700/50 my-1"></div>
                          
                          {/* Sign Out */}
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wallet Connection */}
                  <div className="scale-75 sm:scale-100 origin-right">
                    <WalletButton />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-300/50 dark:border-gray-800/20">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-700 dark:text-violet-400 border border-violet-500/40 dark:border-violet-500/30'
                        : 'text-gray-800 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Contact Us */}
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/10 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Us</span>
                </Link>

                {/* Mobile Auth */}
                {!isAuthenticated && (
                  <div className="pt-2 border-t border-gray-300/50 dark:border-gray-600/30">
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-700 dark:text-violet-400 border border-violet-500/40 dark:border-violet-500/30 hover:from-violet-500/30 hover:to-fuchsia-500/30 transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}