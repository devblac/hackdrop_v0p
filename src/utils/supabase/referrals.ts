import { supabase } from '../../lib/supabase'

export const referralAPI = {
  generateCode: async (userId: string): Promise<string> => {
    try {
      // Get user's existing referral code
      const { data: user, error } = await supabase
        .from('users')
        .select('referral_code')
        .eq('id', userId)
        .single()

      if (error) throw error

      return user.referral_code || ''
    } catch (error) {
      console.error('Error generating referral code:', error)
      throw error
    }
  },

  validateCode: async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', code.toUpperCase())
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Error validating referral code:', error)
      return false
    }
  },

  processSignup: async (newUserId: string, referralCode: string): Promise<void> => {
    try {
      // Update the new user with the referral code
      const { error } = await supabase
        .from('users')
        .update({ referred_by_code: referralCode.toUpperCase() })
        .eq('id', newUserId)

      if (error) throw error

      // The database trigger will handle updating referral stats
    } catch (error) {
      console.error('Error processing referral signup:', error)
      throw error
    }
  },

  getEarnings: async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('referral_stats')
        .select('total_commission_earned')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data?.total_commission_earned || 0
    } catch (error) {
      console.error('Error getting referral earnings:', error)
      return 0
    }
  },

  getReferralHistory: async (userId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('referral_history')
        .select(`
          *,
          referred_user:users!referral_history_referred_id_fkey(email, display_name)
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting referral history:', error)
      return []
    }
  },

  updateCommission: async (referralId: string, amount: number): Promise<void> => {
    try {
      // Update referral history with commission
      const { error: historyError } = await supabase
        .from('referral_history')
        .update({ 
          commission_earned: amount,
          status: 'confirmed'
        })
        .eq('id', referralId)

      if (historyError) throw historyError

      // Update referral stats
      const { data: history } = await supabase
        .from('referral_history')
        .select('referrer_id')
        .eq('id', referralId)
        .single()

      if (history) {
        const { error: statsError } = await supabase
          .from('referral_stats')
          .update({
            total_commission_earned: supabase.sql`total_commission_earned + ${amount}`,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', history.referrer_id)

        if (statsError) throw statsError
      }
    } catch (error) {
      console.error('Error updating commission:', error)
      throw error
    }
  }
}