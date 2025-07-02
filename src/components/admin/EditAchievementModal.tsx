import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Loader2 } from 'lucide-react'
import { Achievement } from '../../types/database'

interface EditAchievementModalProps {
  isOpen: boolean
  onClose: () => void
  achievement: Achievement | null
  onSave: (id: string, data: Partial<Achievement>) => Promise<void>
}

export function EditAchievementModal({ isOpen, onClose, achievement, onSave }: EditAchievementModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Trophy',
    category: 'gameplay' as const,
    rarity: 'common' as const,
    reward_points: 10,
    unlock_criteria: { type: 'loop_entries', target: 1 }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (achievement) {
      setFormData({
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        reward_points: achievement.reward_points || 10,
        unlock_criteria: achievement.unlock_criteria
      })
    }
  }, [achievement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!achievement) return

    setIsSubmitting(true)
    setError('')

    try {
      await onSave(achievement.id, formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update achievement')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !achievement) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Achievement
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Trophy">Trophy</option>
                <option value="Award">Award</option>
                <option value="Star">Star</option>
                <option value="Crown">Crown</option>
                <option value="Zap">Zap</option>
                <option value="Target">Target</option>
                <option value="Users">Users</option>
                <option value="Megaphone">Megaphone</option>
                <option value="DollarSign">DollarSign</option>
                <option value="Sunrise">Sunrise</option>
                <option value="Flame">Flame</option>
              </select>
            </div>

            {/* Category and Rarity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="gameplay">Gameplay</option>
                  <option value="social">Social</option>
                  <option value="milestone">Milestone</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rarity
                </label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
            </div>

            {/* Reward Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reward Points
              </label>
              <input
                type="number"
                value={formData.reward_points}
                onChange={(e) => setFormData({ ...formData, reward_points: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="1"
                required
              />
            </div>

            {/* Unlock Criteria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Value
              </label>
              <input
                type="number"
                value={formData.unlock_criteria.target}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  unlock_criteria: { 
                    ...formData.unlock_criteria, 
                    target: parseInt(e.target.value) 
                  } 
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="1"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}