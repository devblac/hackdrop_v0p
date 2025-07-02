import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'gameplay' | 'social' | 'milestone' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  reward_points: number
  unlock_criteria: any
  is_active: boolean
  created_at: string
}

export interface UserAchievementProgress {
  id: string
  user_id: string
  achievement_id: string
  progress: number
  target: number
  unlocked_at: string | null
  is_claimed: boolean
  created_at: string
  achievement?: Achievement
}

interface AchievementState {
  achievements: Achievement[]
  userProgress: UserAchievementProgress[]
  recentUnlocks: Achievement[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchAchievements: () => Promise<void>
  fetchUserProgress: (userId: string) => Promise<void>
  checkProgress: (userId: string, eventType: string, eventData: any) => Promise<void>
  claimAchievement: (progressId: string) => Promise<void>
  clearRecentUnlocks: () => void
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  userProgress: [],
  recentUnlocks: [],
  isLoading: false,
  error: null,

  fetchAchievements: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })

      if (error) throw error

      set({ achievements: data || [] })
    } catch (error) {
      console.error('Error fetching achievements:', error)
      set({ error: 'Failed to load achievements' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchUserProgress: async (userId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const { data, error } = await supabase
        .from('user_achievement_progress')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ userProgress: data || [] })
    } catch (error) {
      console.error('Error fetching user progress:', error)
      set({ error: 'Failed to load achievement progress' })
    } finally {
      set({ isLoading: false })
    }
  },

  checkProgress: async (userId: string, eventType: string, eventData: any) => {
    try {
      const { achievements } = get()
      const newUnlocks: Achievement[] = []

      // Filter achievements that match the event type
      const relevantAchievements = achievements.filter(achievement => {
        const criteria = achievement.unlock_criteria
        return criteria.type === eventType
      })

      for (const achievement of relevantAchievements) {
        const criteria = achievement.unlock_criteria
        let currentProgress = 0

        // Calculate current progress based on event type
        switch (eventType) {
          case 'loop_entries':
            // Get total loop entries for user
            const { count: entryCount } = await supabase
              .from('loop_entries')
              .select('*', { count: 'exact', head: true })
              .eq('wallet_address', eventData.walletAddress)
            currentProgress = entryCount || 0
            break

          case 'loop_wins':
            // Get total wins for user
            const { count: winCount } = await supabase
              .from('loops')
              .select('*', { count: 'exact', head: true })
              .eq('winner_address', eventData.walletAddress)
            currentProgress = winCount || 0
            break

          case 'referrals':
            // Get referral stats
            const { data: referralStats } = await supabase
              .from('referral_stats')
              .select('total_referrals')
              .eq('user_id', userId)
              .single()
            currentProgress = referralStats?.total_referrals || 0
            break

          case 'total_spent':
            // Get user's total spent
            const { data: userData } = await supabase
              .from('users')
              .select('total_spent')
              .eq('id', userId)
              .single()
            currentProgress = userData?.total_spent || 0
            break

          default:
            currentProgress = eventData.value || 0
        }

        // Check if achievement should be unlocked
        const target = criteria.target
        const hasUnlocked = currentProgress >= target

        // Update or create progress record
        const { data: existingProgress } = await supabase
          .from('user_achievement_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('achievement_id', achievement.id)
          .single()

        if (existingProgress) {
          // Update existing progress
          const shouldUnlock = hasUnlocked && !existingProgress.unlocked_at
          
          const { error } = await supabase
            .from('user_achievement_progress')
            .update({
              progress: currentProgress,
              unlocked_at: shouldUnlock ? new Date().toISOString() : existingProgress.unlocked_at
            })
            .eq('id', existingProgress.id)

          if (error) throw error

          if (shouldUnlock) {
            newUnlocks.push(achievement)
            
            // Award experience points
            await supabase
              .from('users')
              .update({
                experience_points: supabase.sql`experience_points + ${achievement.reward_points}`
              })
              .eq('id', userId)
          }
        } else {
          // Create new progress record
          const { error } = await supabase
            .from('user_achievement_progress')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              progress: currentProgress,
              target: target,
              unlocked_at: hasUnlocked ? new Date().toISOString() : null
            })

          if (error) throw error

          if (hasUnlocked) {
            newUnlocks.push(achievement)
            
            // Award experience points
            await supabase
              .from('users')
              .update({
                experience_points: supabase.sql`experience_points + ${achievement.reward_points}`
              })
              .eq('id', userId)
          }
        }
      }

      // Add new unlocks to recent unlocks
      if (newUnlocks.length > 0) {
        set(state => ({
          recentUnlocks: [...state.recentUnlocks, ...newUnlocks]
        }))
        
        // Refresh user progress
        await get().fetchUserProgress(userId)
      }
    } catch (error) {
      console.error('Error checking achievement progress:', error)
    }
  },

  claimAchievement: async (progressId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const { error } = await supabase
        .from('user_achievement_progress')
        .update({ is_claimed: true })
        .eq('id', progressId)

      if (error) throw error

      // Refresh user progress
      const { userProgress } = get()
      const progress = userProgress.find(p => p.id === progressId)
      if (progress) {
        await get().fetchUserProgress(progress.user_id)
      }
    } catch (error) {
      console.error('Error claiming achievement:', error)
      set({ error: 'Failed to claim achievement' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearRecentUnlocks: () => {
    set({ recentUnlocks: [] })
  }
}))