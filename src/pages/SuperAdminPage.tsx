import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Settings, ShieldCheck, AlertTriangle, UserPlus, Search, Trash2, Palette, Globe } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useGameStore } from '../stores/gameStore'
import { adminAPI } from '../utils/supabase/admin'
import { supabase } from '../lib/supabase'

export function SuperAdminPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('users')
  const { theme, setTheme } = useGameStore()

  const tabs = [
    { id: 'users', label: 'User Management', icon: Shield },
    { id: 'settings', label: 'App Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Super Admin Control Panel</h1>
            </div>
            <p className="text-red-100 mb-4">
              Welcome, {user?.email}! You have full system access to manage users, roles, and system-wide settings.
            </p>
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm">
                <AlertTriangle size={16} className="mr-1" />
                <span>High Privilege Access</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm">
                <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
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
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600 dark:text-red-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'settings' && <AppSettings />}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching real users from database...')

      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          role,
          created_at,
          last_activity,
          total_spent,
          total_earnings,
          referral_code
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        throw error
      }

      console.log('Fetched users:', data)
      setUsers(data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setErrorMsg('Unable to load users. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck size={16} />
      case 'admin':
        return <Shield size={16} />
      default:
        return null
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      console.log('Updating user role:', userId, 'to', newRole)
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      if (error) {
        console.error('Error updating user role:', error)
        throw error
      }

      console.log('User role updated successfully:', data)
      
      const userEmail = users.find(u => u.id === userId)?.email
      alert(`User ${userEmail} role updated to ${newRole}`)
      
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    }
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(`Are you sure you want to change the user's role to ${newRole}?`)) {
      handleUpdateUserRole(userId, newRole)
    }
  }

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      console.log('Banning user:', userId, 'reason:', reason)
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          role: 'guest',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      if (error) {
        console.error('Error banning user:', error)
        throw error
      }

      console.log('User banned successfully:', data)
      
      const userEmail = users.find(u => u.id === userId)?.email
      alert(`User ${userEmail} has been banned`)
      
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      console.error('Error banning user:', error)
      alert('Failed to ban user')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          User Management
        </h3>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <UserPlus size={20} />
          <span>Invite Admin</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      {errorMsg && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-600/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600/30"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                      {user.referral_code && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          Ref: {user.referral_code}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span>{user.role.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      Spent: {(user.total_spent || 0)} ALGO
                    </div>
                    <div>
                      Earned: {(user.total_earnings || 0)} ALGO
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.last_activity ? new Date(user.last_activity).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteAdminModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  )
}

function AppSettings() {
  const { theme, setTheme } = useGameStore()
  const [seasonalTheme, setSeasonalTheme] = useState('default')
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    maxLoopEntry: 100,
    rateLimit: true
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Save individual settings to app_settings table
      const settingsToSave = [
        { key: 'maintenance_mode', value: settings.maintenanceMode, type: 'boolean' },
        { key: 'registration_enabled', value: settings.registrationEnabled, type: 'boolean' },
        { key: 'max_loop_entry_amount', value: settings.maxLoopEntry, type: 'number' },
        { key: 'rate_limiting_enabled', value: settings.rateLimit, type: 'boolean' },
        { key: 'seasonal_theme', value: seasonalTheme, type: 'string' }
      ]

      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('app_settings')
          .upsert({
            setting_key: setting.key,
            setting_value: JSON.stringify(setting.value),
            setting_type: setting.type,
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error(`Error saving setting ${setting.key}:`, error)
          throw error
        }
      }
      
      console.log('Settings saved successfully')
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Application Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Theme Settings */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Theme Configuration
            </h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Theme
              </label>
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Note: This only affects your admin interface. User themes are managed individually.
                </p>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                    className="mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Light Theme</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                    className="mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Dark Theme</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seasonal Theme
              </label>
              <select
                value={seasonalTheme}
                onChange={(e) => setSeasonalTheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="default">Default</option>
                <option value="halloween">Halloween</option>
                <option value="winter">Winter Holiday</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Network Configuration
            </h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Network
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="network"
                    value="testnet" 
                    defaultChecked
                    className="mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300">TestNet</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="network"
                    value="mainnet" 
                    className="mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300">MainNet</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Game Settings */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Game Configuration
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maintenance Mode
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="mr-3" 
                />
                <span className="text-gray-700 dark:text-gray-300">Enable maintenance mode</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New User Registration
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={settings.registrationEnabled}
                  onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                  className="mr-3" 
                />
                <span className="text-gray-700 dark:text-gray-300">Allow new user registration</span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Prediction Entry Amount (ALGO)
              </label>
              <input
                type="number"
                value={settings.maxLoopEntry}
                onChange={(e) => setSettings({...settings, maxLoopEntry: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate Limiting
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={settings.rateLimit}
                  onChange={(e) => setSettings({...settings, rateLimit: e.target.checked})}
                  className="mr-3" 
                />
                <span className="text-gray-700 dark:text-gray-300">Enable rate limiting for API calls</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  )
}

function InviteAdminModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('admin')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // TODO: Implement admin invitation via email
      console.log('Inviting admin:', { email, role })
      
      // For now, just simulate the invitation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Invitation sent to ${email} for ${role} role!`)
      onClose()
    } catch (error) {
      console.error('Error inviting admin:', error)
      alert('Failed to send invitation. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          Invite Admin
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="admin@hackpot.xyz"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
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
              disabled={isLoading || !email}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}