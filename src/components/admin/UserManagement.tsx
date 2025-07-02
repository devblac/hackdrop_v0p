import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield, Ban, UserX, Edit, MoreVertical } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'

export function UserManagement() {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

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
      alert('Failed to load users. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      // Prevent users from changing their own role
      if (currentUser && currentUser.id === userId) {
        alert('You cannot change your own role.')
        return
      }
      
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
      console.error('Failed to update user role:', error)
      alert('Failed to update user role. Please try again.')
    }
  }

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      // Prevent users from banning themselves
      if (currentUser && currentUser.id === userId) {
        alert('You cannot ban yourself.')
        return
      }
      
      console.log('Banning user:', userId, 'reason:', reason)

      const { data, error } = await supabase
        .from('users')
        .update({ 
          role: 'guest', // Demote to guest role
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
      console.error('Failed to ban user:', error)
      alert('Failed to ban user. Please try again.')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'guest':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredUsers.length} users
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
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
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
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
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role === 'super_admin' && <Shield size={12} className="mr-1" />}
                        {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                        {user.role.replace('_', ' ')}
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
                      <div className="flex items-center space-x-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          disabled={currentUser && currentUser.id === user.id}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="guest">Guest</option>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter ban reason:')
                            if (reason) handleBanUser(user.id, reason)
                          }}
                          disabled={currentUser && currentUser.id === user.id}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          title="Ban User"
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No users found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}