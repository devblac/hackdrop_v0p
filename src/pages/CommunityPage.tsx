import { motion } from 'framer-motion'
import { Users, MessageCircle, Globe, Coins, Vote, Calendar, ExternalLink, Heart, Star, Zap, Trophy } from 'lucide-react'

export function CommunityPage() {
  const communityFeatures = [
    {
      icon: Vote,
      title: 'Community Governance',
      description: 'Participate in community decisions and shape the future of HackPot',
      status: 'Coming Soon',
      color: 'purple' as const
    },
    {
      icon: Trophy,
      title: 'HACK Token Rewards',
      description: 'Earn HACK tokens through gameplay and referrals',
      status: 'Q2 2025',
      color: 'blue' as const
    },
    {
      icon: MessageCircle,
      title: 'Community Chat',
      description: 'Join discussions, share strategies, and connect with fellow predictors',
      status: 'Q3 2025',
      color: 'green' as const
    },
    {
      icon: Globe,
      title: 'Global Events',
      description: 'Participate in special prediction events and tournaments',
      status: 'Q4 2025',
      color: 'yellow' as const
    }
  ]

  const socialLinks = [
    {
      name: 'Discord',
      icon: MessageCircle,
      url: '#',
      description: 'Join our community discussions',
      members: '2.5K+'
    },
    {
      name: 'Twitter',
      icon: Globe,
      url: '#',
      description: 'Follow for updates and announcements',
      followers: '8.2K+'
    },
    {
      name: 'Telegram',
      icon: MessageCircle,
      url: '#',
      description: 'Real-time community chat',
      members: '1.8K+'
    }
  ]

  const colorClasses = {
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"
          >
            <Users className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-4xl font-bold mb-4">Join the HackPot Community</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Connect with fellow predictors, share strategies, and help build the future of transparent community predictions!
            </p>
            <div className="flex justify-center space-x-6 text-center">
              <div>
                <div className="text-3xl font-bold">12K+</div>
                <div className="text-purple-200">Active Players</div>
              </div>
              <div>
                <div className="text-3xl font-bold">450+</div>
                <div className="text-purple-200">Daily Games</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2.8M</div>
                <div className="text-purple-200">ALGO Distributed</div>
              </div>
            </div>
          </motion.div>

          {/* Community Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              Community-Driven Future
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${colorClasses[feature.color]} flex items-center justify-center flex-shrink-0`}>
                      <feature.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Token Economics Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-700/50"
          >
            <div className="text-center mb-8">
              <Coins className="mx-auto h-12 w-12 text-yellow-600 dark:text-yellow-400 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">HACK Token Economics</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                The HACK token will power the HackPot ecosystem, providing governance rights, revenue sharing, and exclusive benefits to holders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">40%</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">Community Rewards</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Distributed to players and referrers</div>
              </div>
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">30%</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">DAO Treasury</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Community-controlled funds</div>
              </div>
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">20%</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">Development</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Platform improvements</div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              Connect With Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:scale-105 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                      <link.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {link.name}
                      </h3>
                      <div className="text-purple-600 dark:text-purple-400 font-medium">
                        {link.members || link.followers}
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Community Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Community Guidelines
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Our Values</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Fair play and transparency</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Respectful communication</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Collaborative decision making</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Innovation and creativity</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Get Involved</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span>Participate in governance votes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span>Propose new features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span>Help moderate discussions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span>Share feedback and ideas</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Shape the Future?</h2>
            <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of players building the next generation of decentralized gaming.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Join Discord
              </button>
              <button className="px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors border border-purple-500">
                Follow on Twitter
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}