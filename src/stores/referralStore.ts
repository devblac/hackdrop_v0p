import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface ReferralTier {
  id: string
  tier_level: number
  commission_percentage: number
  min_referrals: number
  tier_name: string
  bonus_multiplier: number
}

export interface ReferralStats {
  id: string
  user_id: string
  total_referrals: number
  total_commission_earned: number
  current_tier: number
  this_month_referrals: number
  updated_at: string
}

export interface ReferralHistory {
  id: string
  referrer_id: string
  referred_id: string
  commission_earned: number
  status: 'pending' | 'confirmed' | 'paid'
  created_at: string
  referred_user?: {
    email: string
    display_name?: string
  }
}

interface ReferralState {
  stats: ReferralStats | null
  history: ReferralHistory[]
  tiers: ReferralTier[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchStats: (userId: string) => Promise<void>
  fetchHistory: (userId: string) => Promise<void>
  fetchTiers: () => Promise<void>
  generateReferralLink: (referralCode: string) => string
  validateReferralCode: (code: string) => Promise<boolean>
  processReferral: (newUserId: string, referralCode: string) => Promise<void>
  claimCommission: (historyId: string) => Promise<void>
}

export const useReferralStore = create<ReferralState>((set, get) => ({
  stats: null,
  history: [],
  tiers: [],
  isLoading: false,
  error: null,

  fetchStats: async (userId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const { data, error } = await supabase
        .from('referral_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // If no stats exist, create them
      if (!data) {
        const { data: newStats, error: insertError } = await supabase
          .from('referral_stats')
          .insert({
            user_id: userId,
            total_referrals: 0,
            total_commission_earned: 0,
            current_tier: 1,
            this_month_referrals: 0
          })
          .select()
          .single()

        if (insertError) throw insertError
        set({ stats: newStats })
      } else {
        set({ stats: data })
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error)
      set({ error: 'Failed to load referral statistics' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchHistory: async (userId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const { data, error } = await supabase
        .from('referral_history')
        .select(`
          *,
          referred_user:users!referral_history_referred_id_fkey(email, display_name)
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ history: data || [] })
    } catch (error) {
      console.error('Error fetching referral history:', error)
      set({ error: 'Failed to load referral history' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchTiers: async () => {
    try {
      const { data, error } = await supabase
        .from('referral_tiers')
        .select('*')
        .order('tier_level', { ascending: true })

      if (error) throw error

      set({ tiers: data || [] })
    } catch (error) {
      console.error('Error fetching referral tiers:', error)
      set({ error: 'Failed to load referral tiers' })
    }
  },

  generateReferralLink: (referralCode: string) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/signup?ref=${referralCode.trim()}`
  },

  validateReferralCode: async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', code.trim().toUpperCase())
        .single()

      if (error) return false
      return !!data
    } catch (error) {
      console.error('Error validating referral code:', error)
      return false
    }
  },

  processReferral: async (newUserId: string, referralCode: string) => {
    try {
      // Update the new user with the referral code
      const { error } = await supabase
        .from('users')
        .update({ referred_by_code: referralCode.trim().toUpperCase() })
        .eq('id', newUserId)

      if (error) throw error

      // The database trigger will handle updating referral stats
    } catch (error) {
      console.error('Error processing referral:', error)
      throw error
    }
  },

  claimCommission: async (historyId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const { error } = await supabase
        .from('referral_history')
        .update({ status: 'paid' })
        .eq('id', historyId)

      if (error) throw error

      // Refresh history
      const { stats } = get()
      if (stats) {
        await get().fetchHistory(stats.user_id)
      }
    } catch (error) {
      console.error('Error claiming commission:', error)
      set({ error: 'Failed to claim commission' })
    } finally {
      set({ isLoading: false })
    }
  }
}))