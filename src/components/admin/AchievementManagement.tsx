import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Trophy, Star, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { EditAchievementModal } from './EditAchievementModal'
import { Achievement } from '../../types/database'

export function AchievementManagement() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Trophy',
    category: 'gameplay',
    rarity: 'common',
    reward_points: 10,
    unlock_criteria: { type: 'loop_entries', target: 1 }
  })

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching achievements...')
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Achievements fetch result:', { data, error })

      if (error) {
        console.error('Error fetching achievements:', error)
        throw error
      }

      setAchievements(data || [])
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      console.log('Creating achievement with data:', formData)

      const { data, error } = await supabase
        .from('achievements')
        .insert([{
          ...formData,
          unlock_criteria: JSON.stringify(formData.unlock_criteria)
        }])
        .select()

      console.log('Create achievement result:', { data, error })

      if (error) {
        console.error('Error creating achievement:', error)
        throw error
      }

      console.log('Achievement created successfully:', data)
      await fetchAchievements()
      setShowCreateForm(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create achievement:', error)
      alert('Failed to create achievement. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAchievement = async (id: string, updates: Partial<Achievement>) => {
    try {
      setIsLoading(true)
      console.log('Updating achievement:', id, updates)

      const { data, error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', id)
        .select()

      console.log('Update achievement result:', { data, error })

      if (error) {
        console.error('Error updating achievement:', error)
        throw error
      }

      await fetchAchievements()
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update achievement:', error)
      alert('Failed to update achievement. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return

    try {
      setIsLoading(true)
      console.log('Deleting achievement:', id)

      const { error } = await supabase
        .from('achievements')
        .update({ is_active: false })
        .eq('id', id)

      console.log('Delete achievement result:', { error })

      if (error) {
        console.error('Error deleting achievement:', error)
        throw error
      }

      await fetchAchievements()
    } catch (error) {
      console.error('Failed to delete achievement:', error)
      alert('Failed to delete achievement. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (id: string, updates: Partial<Achievement>) => {
    try {
      setIsLoading(true)
      console.log('Updating achievement:', id, updates)

      const { data, error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', id)
        .select()

      console.log('Update achievement result:', { data, error })

      if (error) {
        console.error('Error updating achievement:', error)
        throw error
      }

      await fetchAchievements()
      setShowEditModal(false)
      setEditingAchievement(null)
    } catch (error) {
      console.error('Failed to update achievement:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (achievement: Achievement) => {
    setDeletingId(achievement.id)
  }

  const confirmDelete = async () => {
    if (!deletingId) return

    try {
      setIsLoading(true)
      console.log('Deleting achievement:', deletingId)

      const { error } = await supabase
        .from('achievements')
        .update({ is_active: false })
        .eq('id', deletingId)

      console.log('Delete achievement result:', { error })

      if (error) {
        console.error('Error deleting achievement:', error)
        throw error
      }

      await fetchAchievements()
      setDeletingId(null)
    } catch (error) {
      console.error('Failed to delete achievement:', error)
      alert('Failed to delete achievement. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelDelete = () => {
    setDeletingId(null)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Trophy',
      category: 'gameplay',
      rarity: 'common',
      reward_points: 10,
      unlock_criteria: { type: 'loop_entries', target: 1 }
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
      case 'rare':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300'
      case 'epic':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300'
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Achievement Management
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Plus size={20} />
          <span>Create Achievement</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleCreateAchievement} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

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
            </div>

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

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  resetForm()
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <Save size={16} />
                <span>Create</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Achievements List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {isLoading && achievements.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : achievements.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {achievement.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {achievement.description}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {achievement.reward_points} XP
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditAchievement(achievement)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit Achievement"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(achievement)}
                      className={`p-2 rounded-lg transition-colors ${
                        deletingId === achievement.id
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                      }`}
                      title="Delete Achievement"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Delete Confirmation */}
                {deletingId === achievement.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-900 dark:text-red-100">
                        Confirm Deletion
                      </span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Are you sure you want to delete "{achievement.name}"? This action cannot be undone.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={confirmDelete}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={cancelDelete}
                        disabled={isLoading}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No achievements created yet. Create your first achievement to get started.
            </p>
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      <EditAchievementModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingAchievement(null)
        }}
        achievement={editingAchievement}
        onSave={handleSaveEdit}
      />
    </div>
  )
}