import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export interface Loop {
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

export interface LoopEntry {
  id: string
  loop_id: string
  wallet_address: string
  ticket_number: number
  amount_paid: number
  transaction_id: string
  created_at: string
}

export interface UserStats {
  total_loops_played: number
  total_algo_spent: number
  total_algo_earned: number
  consecutive_days: number
  achievements: string[]
}

interface GameState {
  currentLoop: Loop | null
  selectedLoop: Loop | null
  userEntries: LoopEntry[]
  userStats: UserStats | null
  isLoading: boolean
  theme: 'dark' | 'light'
  
  // Actions
  setCurrentLoop: (loop: Loop | null) => void
  setSelectedLoop: (loop: Loop | null) => void
  setUserEntries: (entries: LoopEntry[]) => void
  setUserStats: (stats: UserStats | null) => void
  setLoading: (loading: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void
  fetchCurrentLoop: () => Promise<void>
  fetchUserEntries: (walletAddress: string) => Promise<void>
  fetchUserStats: (userId: string) => Promise<void>
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLoop: null,
      selectedLoop: null,
      userEntries: [],
      userStats: null,
      isLoading: false,
      theme: 'dark',

      setCurrentLoop: (loop) => set({ currentLoop: loop }),
      setSelectedLoop: (loop) => set({ selectedLoop: loop }),
      setUserEntries: (entries) => set({ userEntries: entries }),
      setUserStats: (stats) => set({ userStats: stats }),
      setLoading: (loading) => set({ isLoading: loading }),
      setTheme: (theme) => {
        set({ theme })
        
        // Only apply theme changes for individual users, not system-wide
        if (typeof window !== 'undefined') {
          localStorage.setItem('user-theme', theme)
          
          // Apply theme to document immediately
          if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            document.documentElement.classList.remove('light')
          } else {
            document.documentElement.classList.add('light')
            document.documentElement.classList.remove('dark')
          }
        }
      },

      fetchCurrentLoop: async () => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase
            .from('loops')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching current loop:', error)
            return
          }

          set({ currentLoop: data || null })
        } catch (error) {
          console.error('Error fetching current loop:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      fetchUserEntries: async (walletAddress: string) => {
        try {
          const { data, error } = await supabase
            .from('loop_entries')
            .select('*')
            .eq('wallet_address', walletAddress)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error fetching user entries:', error)
            return
          }

          set({ userEntries: data || [] })
        } catch (error) {
          console.error('Error fetching user entries:', error)
        }
      },

      fetchUserStats: async (userId: string) => {
        try {
          // This would be implemented with proper aggregation queries
          // For now, we'll use mock data
          const mockStats: UserStats = {
            total_loops_played: 0,
            total_algo_spent: 0,
            total_algo_earned: 0,
            consecutive_days: 0,
            achievements: []
          }
          
          set({ userStats: mockStats })
        } catch (error) {
          console.error('Error fetching user stats:', error)
        }
      }
    }),
    {
      name: 'game-store',
      partialize: (state) => ({ 
        theme: state.theme // Keep theme in localStorage per user
      }),
    }
  )
)

// Initialize theme on store creation and page load
const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    // Check for user preference first, then fall back to system default (dark)
    const userTheme = localStorage.getItem('user-theme')
    const defaultTheme = 'dark' // Default to dark theme
    const theme = userTheme || defaultTheme
    
    useGameStore.getState().setTheme(theme as 'dark' | 'light')
  }
}

// Initialize theme immediately
if (typeof window !== 'undefined') {
  initializeTheme()
}