import { supabase } from '../../lib/supabase'

export const adminAPI = {
  createAchievement: async (achievementData: any): Promise<void> => {
    try {
      console.log('Creating achievement:', achievementData)
      
      const { data, error } = await supabase
        .from('achievements')
        .insert([achievementData])
        .select()

      console.log('Create achievement result:', { data, error })

      if (error) {
        console.error('Supabase error creating achievement:', error)
        throw error
      }

      console.log('Achievement created successfully:', data)
    } catch (error) {
      console.error('Error creating achievement:', error)
      throw error
    }
  },

  updateAchievement: async (id: string, updates: any): Promise<void> => {
    try {
      console.log('Updating achievement:', id, updates)
      
      const { data, error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', id)
        .select()

      console.log('Update achievement result:', { data, error })

      if (error) {
        console.error('Supabase error updating achievement:', error)
        throw error
      }

      console.log('Achievement updated successfully:', data)
    } catch (error) {
      console.error('Error updating achievement:', error)
      throw error
    }
  },

  deleteAchievement: async (id: string): Promise<void> => {
    try {
      console.log('Deleting achievement:', id)
      
      const { data, error } = await supabase
        .from('achievements')
        .update({ is_active: false })
        .eq('id', id)
        .select()

      console.log('Delete achievement result:', { data, error })

      if (error) {
        console.error('Supabase error deleting achievement:', error)
        throw error
      }

      console.log('Achievement deleted successfully:', data)
    } catch (error) {
      console.error('Error deleting achievement:', error)
      throw error
    }
  },

  banUser: async (userId: string, reason: string): Promise<void> => {
    try {
      console.log('Banning user:', userId, reason)
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          role: 'guest',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      console.log('Ban user result:', { data, error })

      if (error) {
        console.error('Supabase error banning user:', error)
        throw error
      }

      console.log('User banned successfully:', data)
    } catch (error) {
      console.error('Error banning user:', error)
      throw error
    }
  },

  updateUserRole: async (userId: string, newRole: string): Promise<void> => {
    try {
      console.log('Updating user role:', userId, newRole)
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      console.log('Update user role result:', { data, error })

      if (error) {
        console.error('Supabase error updating user role:', error)
        throw error
      }

      console.log('User role updated successfully:', data)
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  },

  updateGameSettings: async (settings: any): Promise<void> => {
    try {
      console.log('Updating game settings:', settings)
      
      // For now, just log the settings
      // In a real implementation, you'd save these to a settings table
      console.log('Game settings would be saved:', settings)
    } catch (error) {
      console.error('Error updating game settings:', error)
      throw error
    }
  },

  getReferralStats: async (): Promise<any> => {
    try {
      console.log('Getting referral stats...')
      
      // Get total referrals
      const { data: referralStats, error: statsError } = await supabase
        .from('referral_stats')
        .select('total_referrals, total_commission_earned')

      if (statsError) {
        console.error('Error getting referral stats:', statsError)
        throw statsError
      }

      // Get referral history
      const { data: referralHistory, error: historyError } = await supabase
        .from('referral_history')
        .select('*')

      if (historyError) {
        console.error('Error getting referral history:', historyError)
        throw historyError
      }

      // Calculate metrics
      const totalReferrals = referralStats?.reduce((sum, stat) => sum + stat.total_referrals, 0) || 0
      const totalCommission = referralStats?.reduce((sum, stat) => sum + stat.total_commission_earned, 0) || 0
      const activeReferrers = referralStats?.filter(stat => stat.total_referrals > 0).length || 0

      const result = {
        totalReferrals,
        totalCommission,
        activeReferrers,
        referralHistory: referralHistory || []
      }

      console.log('Referral stats result:', result)
      return result
    } catch (error) {
      console.error('Error getting referral stats:', error)
      return {
        totalReferrals: 0,
        totalCommission: 0,
        activeReferrers: 0,
        referralHistory: []
      }
    }
  },

  getUserManagementData: async (): Promise<any[]> => {
    try {
      console.log('Getting user management data...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('User management data result:', { data, error })

      if (error) {
        console.error('Error getting user management data:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Error getting user management data:', error)
      return []
    }
  },

  createLoop: async (loopData: any): Promise<void> => {
    try {
      console.log('Creating loop:', loopData)
      
      // First, verify the current user is an admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      console.log('Current user:', user.id)

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('supabase_id', user.id)
        .single()

      if (userError) {
        console.error('Error fetching user role:', userError)
        throw new Error('Failed to verify admin permissions')
      }

      if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
        throw new Error('Insufficient permissions. Admin role required.')
      }

      console.log('User role verified:', userData.role)

      // Create the loop
      const { data, error } = await supabase
        .from('loops')
        .insert([{
          name: loopData.name,
          difficulty: loopData.difficulty,
          ticket_price: parseFloat(loopData.ticketPrice),
          max_tickets: parseInt(loopData.maxTickets),
          prize_pool: parseFloat(loopData.prizePool),
          status: 'active'
        }])
        .select()

      console.log('Create loop result:', { data, error })

      if (error) {
        console.error('Supabase error creating loop:', error)
        throw error
      }

      console.log('Loop created successfully:', data)
    } catch (error) {
      console.error('Error creating loop:', error)
      throw error
    }
  },

  updateLoopStatus: async (loopId: string, status: string): Promise<void> => {
    try {
      console.log('Updating loop status:', loopId, status)
      
      // First, verify the current user is an admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      console.log('Current user:', user.id)

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('supabase_id', user.id)
        .single()

      if (userError) {
        console.error('Error fetching user role:', userError)
        throw new Error('Failed to verify admin permissions')
      }

      if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
        throw new Error('Insufficient permissions. Admin role required.')
      }

      console.log('User role verified:', userData.role)
      
      const { data, error } = await supabase
        .from('loops')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', loopId)
        .select()

      console.log('Update loop status result:', { data, error })

      if (error) {
        console.error('Supabase error updating loop status:', error)
        throw error
      }

      console.log('Loop status updated successfully:', data)
    } catch (error) {
      console.error('Error updating loop status:', error)
      throw error
    }
  },

  deleteLoop: async (loopId: string): Promise<void> => {
    try {
      console.log('Deleting loop:', loopId)
      
      // First, verify the current user is an admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      console.log('Current user:', user.id)

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('supabase_id', user.id)
        .single()

      if (userError) {
        console.error('Error fetching user role:', userError)
        throw new Error('Failed to verify admin permissions')
      }

      if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
        throw new Error('Insufficient permissions. Admin role required.')
      }

      console.log('User role verified:', userData.role)
      
      const { data, error } = await supabase
        .from('loops')
        .delete()
        .eq('id', loopId)
        .select()

      console.log('Delete loop result:', { data, error })

      if (error) {
        console.error('Supabase error deleting loop:', error)
        throw error
      }

      console.log('Loop deleted successfully:', data)
    } catch (error) {
      console.error('Error deleting loop:', error)
      throw error
    }
  },

  getAllLoops: async (): Promise<any[]> => {
    try {
      console.log('Getting all loops for admin...')
      
      // First, verify the current user is an admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('supabase_id', user.id)
        .single()

      if (userError) {
        console.error('Error fetching user role:', userError)
        throw new Error('Failed to verify admin permissions')
      }

      if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
        throw new Error('Insufficient permissions. Admin role required.')
      }

      const { data, error } = await supabase
        .from('loops')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Get all loops result:', { data, error })

      if (error) {
        console.error('Supabase error getting loops:', error)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Error getting all loops:', error)
      throw error
    }
  }
}