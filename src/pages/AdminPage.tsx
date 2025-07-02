import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Settings, Zap, Play, Pause, Plus, Edit, Trash2, AlertCircle, Shield, BarChart3, Users as UsersIcon } from 'lucide-react'
import { useGameStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'
import { ViralAnalytics } from '../components/admin/ViralAnalytics'
import { AchievementManagement } from '../components/admin/AchievementManagement'
import { UserManagement } from '../components/admin/UserManagement'
import { supabase } from '../lib/supabase'
import { Loop } from '../types/database'
import { adminAPI } from '../utils/supabase/admin'

export function AdminPage() {
  const { user } = useAuthStore()
  const { fetchCurrentLoop } = useGameStore()
  const [currentLoops, setCurrentLoops] = useState<Loop[]>([])
  const [showCreateLoop, setShowCreateLoop] = useState(false)
  const [activeTab, setActiveTab] = useState('loops')
  const [isLoading, setIsLoading] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)

  const fetchCurrentLoops = async () => {
    try {
      const loops = await adminAPI.getAllLoops()
      setCurrentLoops(loops)
    } catch (error) {
      console.error('Error fetching current loops:', error)
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Error fetching loops: ${error.message}`)
      } else {
        alert('Error fetching loops. Please try again.')
      }
    }
  }

  const handleCreateLoop = async (formData: any) => {
    setIsLoading(true)
    try {
      await adminAPI.createLoop(formData)
      setShowCreateLoop(false)
      await fetchCurrentLoops()
      alert('Loop created successfully!')
    } catch (error) {
      console.error('Error creating loop:', error)
      if (error instanceof Error) {
        alert(`Failed to create loop: ${error.message}`)
      } else {
        alert('Failed to create loop. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleLoop = async (loopId: string, action: 'pause' | 'resume') => {
    setIsLoading(true)
    try {
      const newStatus = action === 'pause' ? 'cancelled' : 'active'

      await adminAPI.updateLoopStatus(loopId, newStatus)
      await fetchCurrentLoops()
      alert(`Loop ${action === 'pause' ? 'paused' : 'resumed'} successfully!`)
    } catch (error) {
      console.error(`Error ${action}ing loop:`, error)
      if (error instanceof Error) {
        alert(`Failed to ${action} loop: ${error.message}`)
      } else {
        alert(`Failed to ${action} loop. Please try again.`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLoop = async (loopId: string) => {
    if (!confirm('Are you sure you want to delete this loop? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    try {
      await adminAPI.deleteLoop(loopId)
      await fetchCurrentLoops()
      alert('Loop deleted successfully!')
    } catch (error) {
      console.error('Error deleting loop:', error)
      if (error instanceof Error) {
        alert(`Failed to delete loop: ${error.message}`)
      } else {
        alert('Failed to delete loop. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'loops', label: 'Game Management' },
    { id: 'achievements', label: 'Achievement Management' },
    { id: 'users', label: 'User Management' },
    { id: 'viral', label: 'Viral Analytics' },
    { id: 'settings', label: 'Settings' }
  ]
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-purple-100">
              Welcome, {user?.email}! Manage prediction rounds, control game flow, and configure HackPot settings.
            </p>
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm">
              <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'loops' && <LoopManagement />}
              {activeTab === 'achievements' && <AchievementManagement />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'viral' && <ViralAnalytics />}
              {activeTab === 'settings' && <AdminSettings />}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function LoopManagement() {
  const { fetchCurrentLoop } = useGameStore()
  const [currentLoops, setCurrentLoops] = useState<Loop[]>([])
  const [showCreateLoop, setShowCreateLoop] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)

  useEffect(() => {
    fetchCurrentLoops()
  }, [])

  const fetchCurrentLoops = async () => {
    try {
      const loops = await adminAPI.getAllLoops()
      setCurrentLoops(loops)
    } catch (error) {
      console.error('Error fetching current loops:', error)
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Error fetching loops: ${error.message}`)
      } else {
        alert('Error fetching loops. Please try again.')
      }
    }
  }

  const handleCreateLoop = async (formData: any) => {
    setIsLoading(true)
    try {
      await adminAPI.createLoop(formData)
      setShowCreateLoop(false)
      await fetchCurrentLoops()
    } catch (error) {
      console.error('Error creating loop:', error)
      alert('Failed to create loop. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleLoop = async (loopId: string, action: 'pause' | 'resume') => {
    setIsLoading(true)
    try {
      const newStatus = action === 'pause' ? 'cancelled' : 'active'

      await adminAPI.updateLoopStatus(loopId, newStatus)

      await fetchCurrentLoops()
    } catch (error) {
      console.error(`Error ${action}ing round:`, error)
      alert(`Failed to ${action} round. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLoop = async (loopId: string) => {
    if (!confirm('Are you sure you want to delete this loop? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    try {
      await adminAPI.deleteLoop(loopId)
      await fetchCurrentLoops()
      alert('Loop deleted successfully!')
    } catch (error) {
      console.error('Error deleting loop:', error)
      if (error instanceof Error) {
        alert(`Failed to delete loop: ${error.message}`)
      } else {
        alert('Failed to delete loop. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
          {/* Current Loops Control */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Game Control Center
              </h2>
              <button
                onClick={() => setShowCreateLoop(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                <span>Create New Loop</span>
              </button>
            </div>

            {currentLoops.length > 0 ? (
              <div className="space-y-6">
                {currentLoops.map((loop) => (
                  <div key={loop.id} className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {loop.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Difficulty: {loop.difficulty}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleLoop(loop.id, loop.status === 'active' ? 'pause' : 'resume')}
                          disabled={isLoading}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            loop.status === 'active'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          {loop.status === 'active' ? <Pause size={20} /> : <Play size={20} />}
                          <span>{loop.status === 'active' ? 'Pause' : 'Resume'}</span>
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteLoop(loop.id)}
                          disabled={isLoading}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete Loop"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {loop.ticket_price}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Ticket Price (ALGO)</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {loop.max_tickets}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Max Tickets</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {loop.prize_pool}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Prize Pool (ALGO)</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <div className={`text-2xl font-bold capitalize ${
                          loop.status === 'active'
                            ? 'text-green-600 dark:text-green-400'
                            : loop.status === 'completed'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {loop.status}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Active Loops
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create a new loop to get started.
                </p>
                <button
                  onClick={() => setShowCreateLoop(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Your First Loop
                </button>
              </div>
            )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                View game performance and user engagement metrics.
              </p>
              <button 
                onClick={() => setShowAnalytics(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <BarChart3 size={16} />
                  <span>View Analytics</span>
                </div>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Game Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Configure game parameters and platform settings.
              </p>
              <button 
                onClick={() => setShowSettings(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Settings size={16} />
                  <span>Configure Settings</span>
                </div>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                User Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage player accounts and game participation.
              </p>
              <button 
                onClick={() => setShowUserManagement(true)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <UsersIcon size={16} />
                  <span>Manage Users</span>
                </div>
              </button>
            </div>
          </div>

          {/* Modals */}
          {showCreateLoop && (
            <CreateLoopModal
              onClose={() => setShowCreateLoop(false)}
              onSubmit={handleCreateLoop}
              isLoading={isLoading}
            />
          )}
          
          {showAnalytics && (
            <AnalyticsModal onClose={() => setShowAnalytics(false)} />
          )}
          
          {showSettings && (
            <SettingsModal onClose={() => setShowSettings(false)} />
          )}
          
          {showUserManagement && (
            <UserManagementModal onClose={() => setShowUserManagement(false)} />
          )}
    </div>
  )
}

function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Settings
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Configure global application settings and preferences.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Game Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Loop Duration (minutes)
              </label>
              <input
                type="number"
                defaultValue="60"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Entries Per User
              </label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Referral Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Enable referral system</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Commission Rate (%)
              </label>
              <input
                type="number"
                defaultValue="5"
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  )
}
function CreateLoopModal({ onClose, onSubmit, isLoading }: {
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    difficulty: 'EASY',
    ticketPrice: '1',
    maxTickets: '10',
    prizePool: '10'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Loop
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loop Name
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
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ticket Price (ALGO)
              </label>
              <input
                type="number"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0.001"
                step="0.001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Tickets
              </label>
              <input
                type="number"
                value={formData.maxTickets}
                onChange={(e) => setFormData({ ...formData, maxTickets: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="1"
                max="1000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prize Pool (ALGO)
              </label>
              <input
                type="number"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                step="0.001"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>Create Loop</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Placeholder modals for the quick actions
function AnalyticsModal({ onClose }: { onClose: () => void }) {
  return (
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="text-center py-8">
          <BarChart3 className="mx-auto h-16 w-16 text-blue-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Analytics dashboard coming soon. This will show detailed game metrics and performance data.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Game Settings</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="text-center py-8">
          <Settings className="mx-auto h-16 w-16 text-green-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Settings panel coming soon. This will allow configuration of game parameters and platform settings.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function UserManagementModal({ onClose }: { onClose: () => void }) {
  return (
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="text-center py-8">
          <UsersIcon className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            User management interface coming soon. This will show player participation and account management.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}