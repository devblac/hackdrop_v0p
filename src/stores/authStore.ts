import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { User } from '../types/database'

export interface UserWallet {
  id: string
  user_id: string
  wallet_address: string
  wallet_type: 'pera' | 'myalgo' | 'walletconnect'
  is_primary: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  userWallets: UserWallet[]
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setSupabaseUser: (user: SupabaseUser | null) => void
  setSession: (session: Session | null) => void
  setUserWallets: (wallets: UserWallet[]) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  linkWallet: (walletAddress: string) => Promise<void>
  unlinkWallet: (walletId: string) => Promise<void>
  fetchUserWallets: () => Promise<void>
  createOrUpdateUser: (supabaseUser: SupabaseUser) => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      supabaseUser: null,
      session: null,
      userWallets: [],
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),
      setSupabaseUser: (user) => set({ supabaseUser: user }),
      setSession: (session) => set({ session }),
      setUserWallets: (wallets) => set({ userWallets: wallets }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true })
          const redirectTo = window.location.origin


          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo
            }
          })

          if (error) {
            console.error('Error signing in with Google:', error)
            throw error
          }

          // The redirect will handle the rest of the authentication flow
        } catch (error) {
          console.error('Error during Google sign in:', error)
          set({ isLoading: false })
          throw error
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        try {
          set({ isLoading: true })

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (error) {
            console.error('Error signing in with email:', error)
            // Propagate the error so calling components can handle it
            throw error
          }

          if (data.user) {
            await get().createOrUpdateUser(data.user)
          }
        } catch (error) {
          console.error('Error during email sign in:', error)
          // Re-throw the error to surface it to the UI
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signUpWithEmail: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin
            }
          })

          if (error) {
            console.error('Error signing up with email:', error)
            throw error
          }

          if (data.session) {
            set({ session: data.session, supabaseUser: data.session.user })
            await get().createOrUpdateUser(data.session.user)
          } else if (data.user) {
            await get().createOrUpdateUser(data.user)
          }
        } catch (error) {
          console.error('Error during email sign up:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true })
          
          const { error } = await supabase.auth.signOut()
          
          if (error) {
            console.error('Error signing out:', error)
            throw error
          }

          set({
            user: null,
            supabaseUser: null,
            session: null,
            userWallets: [],
            isAuthenticated: false
          })
          
          // Redirect to root after successful logout
          window.location.href = '/'
        } catch (error) {
          console.error('Error during sign out:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      linkWallet: async (walletAddress: string) => {
        const { user } = get()
        if (!user) return

        try {
          console.log('Linking wallet:', walletAddress, 'to user:', user.id)
          
          // Check if wallet is already linked to this user
          const { data: existingWallet } = await supabase
            .from('connected_wallets')
            .select('id')
            .eq('user_id', user.id)
            .eq('wallet_address', walletAddress)
            .single()

          if (existingWallet) {
            console.log('Wallet already linked to this user')
            return
          }

          const { error } = await supabase
            .from('connected_wallets')
            .insert({
              user_id: user.id,
              wallet_address: walletAddress,
              wallet_type: 'pera',
              is_primary: false
            })

          if (error) {
            console.error('Error linking wallet:', error)
            throw error
          }

          console.log('Wallet linked successfully')
          await get().fetchUserWallets()
        } catch (error) {
          console.error('Error linking wallet:', error)
          throw error
        }
      },

      unlinkWallet: async (walletId: string) => {
        try {
          const { error } = await supabase
            .from('connected_wallets')
            .delete()
            .eq('id', walletId)

          if (error) {
            console.error('Error unlinking wallet:', error)
            return
          }

          await get().fetchUserWallets()
        } catch (error) {
          console.error('Error unlinking wallet:', error)
        }
      },

      fetchUserWallets: async () => {
        const { user } = get()
        if (!user) return

        try {
          const { data, error } = await supabase
            .from('connected_wallets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error fetching user wallets:', error)
            return
          }

          set({ userWallets: data || [] })
        } catch (error) {
          console.error('Error fetching user wallets:', error)
        }
      },

      createOrUpdateUser: async (supabaseUser: SupabaseUser) => {
        try {
          const email = supabaseUser.email
          if (!email) {
            console.error('No email found for user')
            return
          }

        // Check if user already exists by supabase_id
        const { data: userById, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('supabase_id', supabaseUser.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error checking existing user:', fetchError)
          return
        }

        let existingUser = userById

        // If no user found by supabase_id, look up by email
        if (!existingUser) {
          const { data: userByEmail, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

          if (emailError && emailError.code !== 'PGRST116') {
            console.error('Error checking user by email:', emailError)
            return
          }

          if (userByEmail) {
            existingUser = userByEmail
          }
        }

        if (existingUser) {
          // Build update payload
          const updatePayload: any = {
            email: email,
            updated_at: new Date().toISOString()
          }

          // If account was found by email but doesn't have supabase_id, set it
          if (!existingUser.supabase_id) {
            updatePayload.supabase_id = supabaseUser.id
          }

          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updatePayload)
            .eq('id', existingUser.id)
            .select()
            .single()

          if (updateError) {
            console.error('Error updating existing user:', updateError)
            return
          }

          set({ user: updatedUser, isAuthenticated: true })
          console.log('Successfully updated existing user:', updatedUser)
        } else {
          // User doesn't exist, create new one
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              supabase_id: supabaseUser.id,
              email: email,
              role: 'user'
            })
            .select()
            .single()

          if (insertError) {
            console.error('Error creating new user:', insertError)
            return
          }

          set({ user: newUser, isAuthenticated: true })
          console.log('Successfully created new user in Supabase:', newUser)
        }

          // Fetch user wallets after successful authentication
          await get().fetchUserWallets()
        } catch (error) {
          console.error('Error creating/updating user:', error)
        }
      },

      initializeAuth: async () => {
        try {
          set({ isLoading: true })

          // Get initial session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession()

          if (error) {
            console.error('Error getting session:', error)
            return
          }

          // Check if the URL contains OAuth params that need to be exchanged
          const hasAuthParams =
            /code=|access_token=/.test(window.location.hash) ||
            /code=|access_token=/.test(window.location.search)

          if (hasAuthParams) {
            const {
              data: exchangeData,
              error: exchangeError,
            } = await supabase.auth.exchangeCodeForSession(window.location.href)

            if (exchangeError) {
              console.error(
                'Error exchanging code for session:',
                exchangeError,
              )
            } else if (exchangeData.session && exchangeData.user) {
              set({
                session: exchangeData.session,
                supabaseUser: exchangeData.user,
              })
              await get().createOrUpdateUser(exchangeData.user)
            }

            // Remove the auth parameters from the URL
            window.history.replaceState({}, document.title, window.location.pathname)
          }

          if (session?.user) {
            set({ 
              session, 
              supabaseUser: session.user 
            })
            await get().createOrUpdateUser(session.user)
          } else {
            // If no active session but we have persisted user data, try to validate it
            const currentState = get()
            if (currentState.user && currentState.isAuthenticated) {
              console.log('Found persisted user data, validating...')
              // Try to fetch fresh user data to ensure it's still valid
              try {
                const { data: freshUser, error: fetchError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', currentState.user.id)
                  .single()

                if (fetchError || !freshUser) {
                  console.log('Persisted user data is invalid, clearing...')
                  set({
                    user: null,
                    supabaseUser: null,
                    session: null,
                    userWallets: [],
                    isAuthenticated: false
                  })
                } else {
                  console.log('Persisted user data is valid, updating...')
                  set({ user: freshUser, isAuthenticated: true })
                  await get().fetchUserWallets()
                }
              } catch (error) {
                console.error('Error validating persisted user data:', error)
                set({
                  user: null,
                  supabaseUser: null,
                  session: null,
                  userWallets: [],
                  isAuthenticated: false
                })
              }
            }
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session)
            
            set({ 
              session, 
              supabaseUser: session?.user || null 
            })

            if (event === 'SIGNED_IN' && session?.user) {
              await get().createOrUpdateUser(session.user)
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                supabaseUser: null,
                session: null,
                userWallets: [],
                isAuthenticated: false
              })
            }
          })
        } catch (error) {
          console.error('Error initializing auth:', error)
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        // Persist authentication state but not sensitive data
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          id: state.user.id,
          email: state.user.email,
          role: state.user.role,
          level: state.user.level,
          experience_points: state.user.experience_points,
          streak_count: state.user.streak_count,
          total_earnings: state.user.total_earnings,
          display_name: state.user.display_name,
          created_at: state.user.created_at,
          updated_at: state.user.updated_at
        } : null,
        userWallets: state.userWallets
      }),
    }
  )
)
