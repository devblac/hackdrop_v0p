import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  Trophy, 
  HelpCircle, 
  BarChart3,
  Sparkles
} from 'lucide-react'

const navigation = [
  { name: 'Predict', href: '/', icon: Sparkles },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Roadmap', href: '/roadmap', icon: Trophy },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: 'Metrics', href: '/metrics', icon: BarChart3 },
]

export function BottomNavigation() {
  const location = useLocation()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background blur and gradient */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-white/20 dark:border-gray-800/20"></div>
      
      <nav className="relative px-4 py-2">
        <div className="flex items-center justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 shadow-lg shadow-violet-500/25'
                      : 'hover:bg-white/20 dark:hover:bg-gray-800/20'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <div className="relative flex flex-col items-center space-y-1">
                    <div className={`relative w-6 h-6 flex items-center justify-center ${
                      isActive 
                        ? 'text-violet-600 dark:text-violet-400' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                    } transition-colors duration-300`}>
                      <item.icon className="w-5 h-5" />
                      
                      {/* Glow effect for active state */}
                      {isActive && (
                        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-sm"></div>
                      )}
                    </div>
                    
                    <span className={`text-xs font-medium ${
                      isActive 
                        ? 'text-violet-600 dark:text-violet-400' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                    } transition-colors duration-300`}>
                      {item.name}
                    </span>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}