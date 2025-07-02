export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          supabase_id: string | null
          email: string
          role: 'guest' | 'user' | 'admin' | 'super_admin'
          created_at: string
          updated_at: string
          total_earnings: number | null
          total_spent: number | null
          referral_code: string | null
          referred_by_code: string | null
          level: number | null
          experience_points: number | null
          streak_count: number | null
          display_name: string | null
          last_activity: string | null
        }
        Insert: {
          id?: string
          supabase_id?: string | null
          email: string
          role?: 'guest' | 'user' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
          total_earnings?: number | null
          total_spent?: number | null
          referral_code?: string | null
          referred_by_code?: string | null
          level?: number | null
          experience_points?: number | null
          streak_count?: number | null
          display_name?: string | null
          last_activity?: string | null
        }
        Update: {
          id?: string
          supabase_id?: string | null
          email?: string
          role?: 'guest' | 'user' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
          total_earnings?: number | null
          total_spent?: number | null
          referral_code?: string | null
          referred_by_code?: string | null
          level?: number | null
          experience_points?: number | null
          streak_count?: number | null
          display_name?: string | null
          last_activity?: string | null
        }
      }
      loops: {
        Row: {
          id: string
          name: string
          difficulty: string
          ticket_price: number
          max_tickets: number
          prize_pool: number
          status: 'active' | 'completed' | 'cancelled'
          winner_address: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          name: string
          difficulty: string
          ticket_price: number
          max_tickets: number
          prize_pool: number
          status?: 'active' | 'completed' | 'cancelled'
          winner_address?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          difficulty?: string
          ticket_price?: number
          max_tickets?: number
          prize_pool?: number
          status?: 'active' | 'completed' | 'cancelled'
          winner_address?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      loop_entries: {
        Row: {
          id: string
          loop_id: string
          wallet_address: string
          ticket_number: number
          amount_paid: number
          transaction_id: string
          created_at: string
        }
        Insert: {
          id?: string
          loop_id: string
          wallet_address: string
          ticket_number: number
          amount_paid: number
          transaction_id: string
          created_at?: string
        }
        Update: {
          id?: string
          loop_id?: string
          wallet_address?: string
          ticket_number?: number
          amount_paid?: number
          transaction_id?: string
          created_at?: string
        }
      }
      connected_wallets: {
        Row: {
          id: string
          user_id: string | null
          wallet_address: string
          wallet_type: 'pera' | 'myalgo' | 'walletconnect'
          is_primary: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          wallet_address: string
          wallet_type?: 'pera' | 'myalgo' | 'walletconnect'
          is_primary?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          wallet_address?: string
          wallet_type?: 'pera' | 'myalgo' | 'walletconnect'
          is_primary?: boolean | null
          created_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          category: 'gameplay' | 'social' | 'milestone' | 'special'
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
          reward_points: number | null
          unlock_criteria: any
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          category: 'gameplay' | 'social' | 'milestone' | 'special'
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
          reward_points?: number | null
          unlock_criteria: any
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          category?: 'gameplay' | 'social' | 'milestone' | 'special'
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
          reward_points?: number | null
          unlock_criteria?: any
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      user_achievement_progress: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          progress: number | null
          target: number
          unlocked_at: string | null
          is_claimed: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          progress?: number | null
          target: number
          unlocked_at?: string | null
          is_claimed?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          progress?: number | null
          target?: number
          unlocked_at?: string | null
          is_claimed?: boolean | null
          created_at?: string | null
        }
      }
      referral_tiers: {
        Row: {
          id: string
          tier_level: number
          commission_percentage: number
          min_referrals: number | null
          tier_name: string
          bonus_multiplier: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          tier_level: number
          commission_percentage: number
          min_referrals?: number | null
          tier_name: string
          bonus_multiplier?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          tier_level?: number
          commission_percentage?: number
          min_referrals?: number | null
          tier_name?: string
          bonus_multiplier?: number | null
          created_at?: string | null
        }
      }
      referral_stats: {
        Row: {
          id: string
          user_id: string
          total_referrals: number | null
          total_commission_earned: number | null
          current_tier: number | null
          this_month_referrals: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          total_referrals?: number | null
          total_commission_earned?: number | null
          current_tier?: number | null
          this_month_referrals?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          total_referrals?: number | null
          total_commission_earned?: number | null
          current_tier?: number | null
          this_month_referrals?: number | null
          updated_at?: string | null
        }
      }
      referral_history: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          commission_earned: number | null
          status: 'pending' | 'confirmed' | 'paid' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          commission_earned?: number | null
          status?: 'pending' | 'confirmed' | 'paid' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          commission_earned?: number | null
          status?: 'pending' | 'confirmed' | 'paid' | null
          created_at?: string | null
        }
      }
      referral_rewards: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          round_id: string
          reward_amount: string
          claimed: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          round_id: string
          reward_amount: string
          claimed?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          round_id?: string
          reward_amount?: string
          claimed?: boolean | null
          created_at?: string | null
        }
      }
      app_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: any
          setting_type: 'string' | 'number' | 'boolean' | 'json'
          description: string | null
          is_public: boolean | null
          updated_by: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: any
          setting_type: 'string' | 'number' | 'boolean' | 'json'
          description?: string | null
          is_public?: boolean | null
          updated_by?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: any
          setting_type?: 'string' | 'number' | 'boolean' | 'json'
          description?: string | null
          is_public?: boolean | null
          updated_by?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}

export type Loop = Database['public']['Tables']['loops']['Row']
export type LoopEntry = Database['public']['Tables']['loop_entries']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type ReferralTier = Database['public']['Tables']['referral_tiers']['Row']
export type AppSetting = Database['public']['Tables']['app_settings']['Row']
