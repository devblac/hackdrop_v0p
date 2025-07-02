import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, HelpCircle, Sparkles, Shield, Users, Trophy, Zap, Target, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'gameplay' | 'rewards' | 'technical' | 'community'
}

const faqData: FAQItem[] = [
  {
    category: 'general',
    question: 'What is HackPot?',
    answer: 'HackPot is the most transparent community-driven prediction platform on Algorand! Think of it as a social prediction game where players make predictions about outcomes, compete for accuracy, and earn rewards. It\'s like having a crystal ball, but with blockchain transparency and community wisdom.'
  },
  {
    category: 'general',
    question: 'How do I get started?',
    answer: 'Getting started is super easy! Just connect your Algorand wallet, sign up with your email, and you can immediately start participating in active prediction rounds. Each round has a small entry fee and the chance to win ALGO rewards based on your prediction accuracy.'
  },
  {
    category: 'general',
    question: 'Do I need ALGO to play?',
    answer: 'Yes, you need a small amount of ALGO to pay for prediction entry fees and transaction costs. Most prediction rounds have entry fees ranging from 1-10 ALGO depending on the prize pool size. Think of it as your "prediction investment"!'
  },
  {
    category: 'general',
    question: 'Is HackPot safe to use?',
    answer: 'Absolutely! HackPot is built on Algorand\'s ultra-secure blockchain. We use industry-standard security practices, and all transactions are completely transparent and verifiable on the blockchain. Your predictions and rewards are as safe as they can be!'
  },
  {
    category: 'gameplay',
    question: 'How do prediction rounds work?',
    answer: 'Prediction rounds are time-limited events where players make predictions about specific outcomes. Each player gets a unique prediction number, and when the round ends, the winning prediction is determined by our transparent algorithm. Prizes are distributed based on how close your prediction was to the winning number!'
  },
  {
    category: 'gameplay',
    question: 'What are the different difficulty levels?',
    answer: 'We have three exciting difficulty levels: Easy (lower entry fee, smaller prizes - perfect for beginners), Medium (moderate stakes with balanced risk/reward), and Hard (higher stakes with bigger prizes for the bold predictors). Each level offers different challenges and rewards!'
  },
  {
    category: 'gameplay',
    question: 'Can I enter multiple prediction rounds at once?',
    answer: 'Absolutely! You can participate in multiple active prediction rounds simultaneously. Each round operates independently, so you can diversify your predictions across different difficulty levels and prize pools. Spread your prediction wings!'
  },
  {
    category: 'rewards',
    question: 'How do I earn rewards?',
    answer: 'Earn rewards by making accurate predictions! The closer your prediction is to the winning number, the bigger your reward. We also have a generous referral system - invite friends and earn commissions when they participate. Plus, complete achievements to unlock bonus rewards!'
  },
  {
    category: 'rewards',
    question: 'How do achievements work?',
    answer: 'Complete various challenges like making your first prediction, referring friends, or reaching spending milestones to unlock achievements. Each achievement rewards you with XP points that increase your player level and unlock exclusive benefits.'
  },
  {
    category: 'rewards',
    question: 'How do referral rewards work?',
    answer: 'Referral commissions are calculated when your referred friends participate in prediction rounds. Commissions are typically processed and paid out weekly to your connected wallet. The more friends you bring, the more you earn!'
  },
  {
    category: 'technical',
    question: 'What are the transaction fees?',
    answer: 'Algorand transaction fees are minimal (typically 0.001 ALGO). HackPot doesn\'t charge additional fees beyond the prediction entry costs and standard Algorand network fees. We keep it transparent and fair!'
  },
  {
    category: 'technical',
    question: 'Is there a mobile app?',
    answer: 'Currently, HackPot is a web application that works great on mobile browsers. A dedicated mobile app is planned for Q4 2025 as part of our roadmap. Your predictions will be even more accessible!'
  },
  {
    category: 'community',
    question: 'What is the HACK token?',
    answer: 'HACK is the upcoming governance token for HackPot. Token holders will be able to vote on platform decisions, earn revenue sharing, and access exclusive features. Launch is planned for Q3 2025. Get ready to hack the future!'
  },
  {
    category: 'community',
    question: 'What is the HackPot DAO?',
    answer: 'The HackPot DAO will allow HACK token holders to propose and vote on platform changes, prize pool adjustments, new prediction types, and treasury management decisions. True community governance!'
  },
  {
    category: 'community',
    question: 'Will HACK token holders earn revenue?',
    answer: 'Yes! HACK token holders will receive a portion of platform revenue through the DAO treasury. The exact percentage and distribution mechanism will be determined by community governance. Share in our success!'
  },
  {
    category: 'community',
    question: 'How can I earn HACK tokens?',
    answer: 'HACK tokens will be distributed through gameplay rewards, referral bonuses, achievement unlocks, and community participation. Early predictors and active community members will receive priority allocation. Be an early adopter!'
  }
]

export function FAQPage() {
  const [openItem, setOpenItem] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Initialize with the first item of the selected category expanded
  useEffect(() => {
    if (selectedCategory === 'all') {
      setOpenItem(0) // First item overall
    } else {
      const firstItemIndex = faqData.findIndex(item => item.category === selectedCategory)
      setOpenItem(firstItemIndex >= 0 ? firstItemIndex : null)
    }
  }, [selectedCategory])

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'general', name: 'General', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'gameplay', name: 'Gameplay', icon: <Target className="w-4 h-4" /> },
    { id: 'rewards', name: 'Rewards', icon: <Trophy className="w-4 h-4" /> },
    { id: 'technical', name: 'Technical', icon: <Shield className="w-4 h-4" /> },
    { id: 'community', name: 'Community', icon: <Users className="w-4 h-4" /> }
  ]

  const filteredFAQ = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 dark:from-slate-900 dark:via-violet-900/20 dark:to-fuchsia-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              HackPot FAQ
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about HackPot, from getting started to advanced features.
            <br />
            <span className="text-violet-600 dark:text-violet-400 font-semibold">
              Your questions, our transparent answers! 🔮✨
            </span>
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
                    : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredFAQ.map((item, index) => {
            const globalIndex = faqData.findIndex(faq => faq === item)
            const isOpen = openItem === globalIndex
            
            return (
              <motion.div
                key={globalIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(globalIndex)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl text-white shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Start Predicting? 🚀</h3>
          <p className="text-lg mb-6 opacity-90">
            Our community and support team are here to help you get the most out of HackPot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-violet-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Start Predicting Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-violet-600 transition-all duration-300">
              Join Our Community
            </button>
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Lightning Fast
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Predictions settle in seconds thanks to Algorand's speed!
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              100% Transparent
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              All predictions and results are verifiable on the blockchain!
            </p>
          </div>
          
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Community Driven
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              HackPot works perfectly on mobile browsers. A dedicated mobile app is coming in Q4 2025!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}