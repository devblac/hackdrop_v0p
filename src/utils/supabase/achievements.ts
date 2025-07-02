import { supabase } from '../../lib/supabase'

export const achievementAPI = {
  checkProgress: async (userId: string, eventType: string, eventData: any): Promise<void> => {
    try {
      // Get all active achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)

      if (achievementsError) throw achievementsError

      // Filter achievements that match the event type
      const relevantAchievements = achievements?.filter(achievement => {
        const criteria = achievement.unlock_criteria
        return criteria.type === eventType
      }) || []

      for (const achievement of relevantAchievements) {
        const criteria = achievement.unlock_criteria
        let currentProgress = 0

        // Calculate current progress based on event type
        switch (eventType) {
          case 'loop_entries':
            // Get total loop entries for user's wallet
            const { count: entryCount } = await supabase
              .from('loop_entries')
              .select('*', { count: 'exact', head: true })
              .eq('wallet_address', eventData.walletAddress)
            currentProgress = entryCount || 0
            break

          case 'loop_wins':
            // Get total wins for user's wallet
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

          case 'early_user':
            // Check if user joined before a certain date
            const { data: userJoinData } = await supabase
              .from('users')
              .select('created_at')
              .eq('id', userId)
              .single()
            
            if (userJoinData) {
              const joinDate = new Date(userJoinData.created_at)
              const cutoffDate = new Date('2025-03-01') // Beta cutoff date
              currentProgress = joinDate < cutoffDate ? 1 : 0
            }
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
    } catch (error) {
      console.error('Error checking achievement progress:', error)
    }
  },

  awardAchievement: async (userId: string, achievementId: string): Promise<void> => {
    try {
      // Get achievement details
      const { data: achievement, error: achievementError } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single()

      if (achievementError) throw achievementError

      // Update progress to unlocked
      const { error: progressError } = await supabase
        .from('user_achievement_progress')
        .upsert({
          user_id: userId,
          achievement_id: achievementId,
          progress: achievement.unlock_criteria.target,
          target: achievement.unlock_criteria.target,
          unlocked_at: new Date().toISOString()
        })

      if (progressError) throw progressError

      // Award experience points
      const { error: userError } = await supabase
        .from('users')
        .update({
          experience_points: supabase.sql`experience_points + ${achievement.reward_points}`
        })
        .eq('id', userId)

      if (userError) throw userError
    } catch (error) {
      console.error('Error awarding achievement:', error)
      throw error
    }
  },

  getUserProgress: async (userId: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('user_achievement_progress')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting user progress:', error)
      return []
    }
  },

  calculateLevel: async (userId: string): Promise<number> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('experience_points')
        .eq('id', userId)
        .single()

      if (error) throw error

      const xp = user.experience_points || 0
      const level = Math.floor(xp / 1000) + 1 // 1000 XP per level

      // Update user level if it changed
      const { error: updateError } = await supabase
        .from('users')
        .update({ level })
        .eq('id', userId)

      if (updateError) throw updateError

      return level
    } catch (error) {
      console.error('Error calculating level:', error)
      return 1
    }
  },

  getAchievementStats: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('user_achievement_progress')
        .select(`
          achievement_id,
          achievement:achievements(name, category),
          count:id.count()
        `)
        .not('unlocked_at', 'is', null)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting achievement stats:', error)
      return []
    }
  }
}