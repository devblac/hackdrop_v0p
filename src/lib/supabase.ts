import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          supabase_id: string
          email: string
          role: 'guest' | 'user' | 'admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supabase_id: string
          email: string
          role?: 'guest' | 'user' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supabase_id?: string
          email?: string
          role?: 'guest' | 'user' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
      }
      connected_wallets: {
        Row: {
          id: string
          user_id: string
          wallet_address: string
          wallet_type: 'pera' | 'myalgo' | 'walletconnect'
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wallet_address: string
          wallet_type?: 'pera' | 'myalgo' | 'walletconnect'
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wallet_address?: string
          wallet_type?: 'pera' | 'myalgo' | 'walletconnect'
          is_primary?: boolean
          created_at?: string
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
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          earned_at: string
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          earned_at?: string
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          earned_at?: string
          metadata?: any
        }
      }
    }
  }
}
