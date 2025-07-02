import { motion } from 'framer-motion'
import { Mail, MessageCircle, ExternalLink, Globe, Heart, MessageSquare, Send } from 'lucide-react'

export function ContactPage() {
  const socialLinks = [
    {
      name: 'X (Twitter)',
      href: 'https://x.com/hackpotxyz',
      icon: MessageSquare,
      color: 'from-gray-800 to-gray-900',
      description: 'Follow us for updates and announcements'
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/MHNUANDfPk',
      icon: MessageSquare,
      color: 'from-indigo-500 to-purple-600',
      description: 'Join our community and chat with other predictors'
    },
    {
      name: 'Telegram',
      href: 'https://t.me/hackpot',
      icon: Send,
      color: 'from-blue-500 to-cyan-600',
      description: 'Get instant updates and support'
    }
  ]

  const contactMethods = [
    {
      name: 'Email Support',
      href: 'mailto:support@hackpot.com',
      icon: Mail,
      color: 'from-violet-500 to-fuchsia-600',
      description: 'Get help with your account or technical issues'
    },
    {
      name: 'Live Chat',
      href: 'https://support.hackpot.com',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-600',
      description: 'Chat with our support team in real-time'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Get in Touch
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Have questions or need support? We're here to help.
        </p>
      </motion.div>

      {/* Social Media Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connect With Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Follow us for the latest updates and community discussions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <social.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {social.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {social.description}
              </p>
              <div className="flex items-center text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                <span className="text-sm font-medium">Visit {social.name}</span>
                <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Contact Methods Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Need Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our support team is here to help you.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.name}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {method.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {method.description}
              </p>
              <div className="flex items-center text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                <span className="font-medium">Contact Us</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Quick Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-700/50"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Help
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Find answers to common questions in our FAQ.
          </p>
          <a
            href="/faq"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-semibold hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>View FAQ</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </div>
  )
} 