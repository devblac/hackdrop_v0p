import { supabase } from '../../lib/supabase'
import { Loop } from '../../stores/gameStore'

export const loopsAPI = {
  fetchAvailableLoops: async (): Promise<Loop[]> => {
    try {
      console.log('🔍 Fetching available loops from Supabase...')
      
      const { data, error } = await supabase
        .from('loops')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      console.log('✅ Raw loops data from Supabase:', data)
      console.log('📊 Number of loops found:', data?.length || 0)
      
      if (data && data.length > 0) {
        data.forEach((loop, index) => {
          console.log(`Loop ${index + 1}:`, {
            id: loop.id,
            name: loop.name,
            difficulty: loop.difficulty,
            ticket_price: loop.ticket_price,
            max_tickets: loop.max_tickets,
            prize_pool: loop.prize_pool,
            status: loop.status
          })
        })
      }

      return data || []
    } catch (error) {
      console.error('💥 Error fetching available loops:', error)
      throw error
    }
  },

  getAllLoops: async (): Promise<Loop[]> => {
    try {
      console.log('🔍 Fetching all loops from Supabase...')
      
      const { data, error } = await supabase
        .from('loops')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      console.log('✅ All loops data from Supabase:', data)
      console.log('📊 Number of loops found:', data?.length || 0)
      
      // If no loops exist, show helpful message
      if (!data || data.length === 0) {
        console.log('📝 No loops found in database')
        console.log('💡 To create sample loops, run this SQL in your Supabase dashboard:')
        console.log(`
          INSERT INTO loops (name, difficulty, ticket_price, max_tickets, prize_pool, status) VALUES
            ('Bitcoin Price Prediction', 'EASY', 10, 100, 800, 'active'),
            ('Ethereum Network Activity', 'MEDIUM', 25, 50, 1000, 'active'),
            ('DeFi TVL Prediction', 'HARD', 50, 25, 1000, 'active'),
            ('Crypto Market Sentiment', 'EASY', 15, 80, 1000, 'active');
        `)
      }
      
      return data || []
    } catch (error) {
      console.error('💥 Error fetching all loops:', error)
      throw error
    }
  },

  // Add a method to create test loops if needed
  createTestLoop: async (loopData: Partial<Loop>) => {
    try {
      const { data, error } = await supabase
        .from('loops')
        .insert([{
          name: loopData.name || 'Test Loop',
          difficulty: loopData.difficulty || 'EASY',
          ticket_price: loopData.ticket_price || 1,
          max_tickets: loopData.max_tickets || 10,
          prize_pool: loopData.prize_pool || 8,
          status: 'active'
        }])
        .select()

      if (error) throw error
      return data?.[0]
    } catch (error) {
      console.error('Error creating test loop:', error)
      throw error
    }
  },

  // Manual function to create sample loops (call this from browser console if needed)
  createSampleLoops: async (): Promise<void> => {
    try {
      console.log('🎯 Creating sample loops...')
      
      const sampleLoops = [
        {
          name: 'Bitcoin Price Prediction',
          difficulty: 'EASY',
          ticket_price: 10,
          max_tickets: 100,
          prize_pool: 800,
          status: 'active'
        },
        {
          name: 'Ethereum Network Activity',
          difficulty: 'MEDIUM',
          ticket_price: 25,
          max_tickets: 50,
          prize_pool: 1000,
          status: 'active'
        },
        {
          name: 'DeFi TVL Prediction',
          difficulty: 'HARD',
          ticket_price: 50,
          max_tickets: 25,
          prize_pool: 1000,
          status: 'active'
        },
        {
          name: 'Crypto Market Sentiment',
          difficulty: 'EASY',
          ticket_price: 15,
          max_tickets: 80,
          prize_pool: 1000,
          status: 'active'
        }
      ]

      const { data, error } = await supabase
        .from('loops')
        .insert(sampleLoops)
        .select()

      if (error) {
        console.error('❌ Error creating sample loops:', error)
        console.log('💡 This might be due to RLS policies. Try running the SQL manually in Supabase dashboard:')
        console.log(`
          INSERT INTO loops (name, difficulty, ticket_price, max_tickets, prize_pool, status) VALUES
            ('Bitcoin Price Prediction', 'EASY', 10, 100, 800, 'active'),
            ('Ethereum Network Activity', 'MEDIUM', 25, 50, 1000, 'active'),
            ('DeFi TVL Prediction', 'HARD', 50, 25, 1000, 'active'),
            ('Crypto Market Sentiment', 'EASY', 15, 80, 1000, 'active');
        `)
        throw error
      }

      console.log('✅ Sample loops created successfully:', data)
    } catch (error) {
      console.error('💥 Error creating sample loops:', error)
      throw error
    }
  }
}
