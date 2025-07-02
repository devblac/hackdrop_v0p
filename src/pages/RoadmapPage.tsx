import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, Zap, Users, Coins, Shield, Rocket, Star, Target } from 'lucide-react'

export function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: 'Q1 2025',
      title: 'Foundation',
      items: [
        'Core prediction platform launch',
        'Basic prediction mechanics',
        'Wallet integration',
        'Community building'
      ],
      status: 'completed'
    },
    {
      quarter: 'Q2 2025',
      title: 'Growth',
      items: [
        'Advanced prediction types',
        'HACK token launch',
        'Referral system',
        'Achievement system'
      ],
      status: 'in-progress'
    },
    {
      quarter: 'Q3 2025',
      title: 'Expansion',
      items: [
        'HACK token public launch',
        'DAO governance',
        'Mobile app development',
        'Partnership integrations'
      ],
      status: 'planned'
    },
    {
      quarter: 'Q4 2025',
      title: 'Ecosystem',
      items: [
        'Mobile app launch',
        'Advanced analytics',
        'Cross-chain predictions',
        'Global expansion'
      ],
      status: 'planned'
    }
  ]

  const milestones = [
    {
      title: '10K+ Active Users',
      description: 'Growing community of engaged players',
      achieved: true,
      date: 'Dec 2024'
    },
    {
      title: '1M ALGO Distributed',
      description: 'Total prizes paid to winners',
      achieved: true,
      date: 'Jan 2025'
    },
    {
      title: 'Smart Contract Audit',
      description: 'Security audit by leading firm',
      achieved: false,
      date: 'Mar 2025'
    },
    {
      title: 'Token Generation Event',
      description: 'LOOP token public launch',
      achieved: false,
      date: 'Jul 2025'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'current':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'upcoming':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'future':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'blue':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'purple':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'orange':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
          >
            <Calendar className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-4xl font-bold mb-4">HackPot Roadmap</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our journey to becoming the most transparent and community-driven prediction platform on Algorand.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full">
              <Clock className="w-5 h-5 mr-2" />
              <span>Last updated: January 2025</span>
            </div>
          </motion.div>

          {/* Current Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Key Milestones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`p-6 rounded-lg border-2 ${
                    milestone.achieved 
                      ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20' 
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    {milestone.achieved ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Target className="w-6 h-6 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {milestone.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Roadmap Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              Development Timeline
            </h2>
            <div className="space-y-8">
              {roadmapItems.map((item, index) => (
                <motion.div
                  key={item.quarter}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Line */}
                  {index < roadmapItems.length - 1 && (
                    <div className="absolute left-6 top-20 w-0.5 h-32 bg-gray-300 dark:bg-gray-600 z-0" />
                  )}
                  
                  <div className="flex items-start space-x-6">
                    {/* Phase Icon */}
                    <div className={`w-12 h-12 rounded-full ${getIconColor(item.status)} flex items-center justify-center flex-shrink-0 z-10 relative`}>
                      {item.status === 'completed' ? (
                        <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                      ) : item.status === 'in-progress' ? (
                        <Clock size={24} className="text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Target size={24} className="text-gray-400" />
                      )}
                    </div>
                    
                    {/* Phase Content */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                              {item.status === 'completed' ? 'Completed' :
                               item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {item.items.join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                            {item.quarter}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Future Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-700/50"
          >
            <div className="text-center">
              <Star className="mx-auto h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Vision for the Future
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                HackPot will become the leading decentralized prediction platform on Algorand,
                empowering communities to make transparent, fair predictions and earn rewards together.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1M+</div>
                  <div className="text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100+</div>
                  <div className="text-gray-600 dark:text-gray-400">Game Variants</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">$50M+</div>
                  <div className="text-gray-600 dark:text-gray-400">Distributed Rewards</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stay Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Follow our progress and be the first to know about new features, partnerships, and opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Join Newsletter
              </button>
              <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500">
                Follow Updates
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}