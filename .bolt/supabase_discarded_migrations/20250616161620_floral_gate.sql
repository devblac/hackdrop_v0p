/*
  # Initial Database Schema for Algorand Loop Game

  1. New Tables
    - `users` - User accounts with Clerk integration
      - `id` (uuid, primary key)
      - `clerk_id` (text, unique, for Clerk authentication)
      - `email` (text, unique)
      - `role` (enum: guest, user, admin, super_admin)
      - `created_at`, `updated_at` (timestamps)
    
    - `user_wallets` - Algorand wallet addresses linked to users
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `wallet_address` (text, Algorand wallet address)
      - `is_primary` (boolean, primary wallet flag)
      - `created_at` (timestamp)
    
    - `loops` - Game loops/rounds
      - `id` (uuid, primary key)
      - `name` (text, loop name)
      - `difficulty` (text, difficulty level)
      - `ticket_price` (numeric, price per ticket in ALGO)
      - `max_tickets` (integer, maximum tickets available)
      - `prize_pool` (numeric, total prize pool in ALGO)
      - `status` (enum: active, completed, cancelled)
      - `winner_address` (text, nullable, winner's wallet address)
      - `created_at`, `completed_at` (timestamps)
    
    - `loop_entries` - User entries/tickets for loops
      - `id` (uuid, primary key)
      - `loop_id` (uuid, foreign key to loops)
      - `wallet_address` (text, participant's wallet)
      - `ticket_number` (integer, ticket number)
      - `amount_paid` (numeric, amount paid in ALGO)
      - `transaction_id` (text, Algorand transaction ID)
      - `created_at` (timestamp)
    
    - `user_achievements` - User achievements and rewards
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `achievement_type` (text, type of achievement)
      - `earned_at` (timestamp)
      - `metadata` (jsonb, additional achievement data)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
    - Add admin policies for loop management

  3. Indexes
    - Add indexes for frequently queried columns
    - Add unique constraints where needed
*/

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    role text NOT NULL DEFAULT 'user' CHECK (role IN ('guest', 'user', 'admin', 'super_admin')),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_wallets table
CREATE TABLE IF NOT EXISTS public.user_wallets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    wallet_address text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create loops table
CREATE TABLE IF NOT EXISTS public.loops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    difficulty text NOT NULL,
    ticket_price numeric NOT NULL CHECK (ticket_price > 0),
    max_tickets integer NOT NULL CHECK (max_tickets > 0),
    prize_pool numeric NOT NULL CHECK (prize_pool >= 0),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    winner_address text,
    created_at timestamptz DEFAULT now() NOT NULL,
    completed_at timestamptz
);

-- Create loop_entries table
CREATE TABLE IF NOT EXISTS public.loop_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    loop_id uuid NOT NULL REFERENCES public.loops(id) ON DELETE CASCADE,
    wallet_address text NOT NULL,
    ticket_number integer NOT NULL,
    amount_paid numeric NOT NULL CHECK (amount_paid > 0),
    transaction_id text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_type text NOT NULL,
    earned_at timestamptz DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id ON public.user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallets_address ON public.user_wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_loops_status ON public.loops(status);
CREATE INDEX IF NOT EXISTS idx_loops_created_at ON public.loops(created_at);
CREATE INDEX IF NOT EXISTS idx_loop_entries_loop_id ON public.loop_entries(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_entries_wallet ON public.loop_entries(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- Add unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_wallets_primary ON public.user_wallets(user_id) WHERE is_primary = true;
CREATE UNIQUE INDEX IF NOT EXISTS idx_loop_entries_unique ON public.loop_entries(loop_id, ticket_number);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update own data"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = clerk_id);

CREATE POLICY "Allow user registration"
    ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = clerk_id);

-- RLS Policies for user_wallets table
CREATE POLICY "Users can manage own wallets"
    ON public.user_wallets
    FOR ALL
    TO authenticated
    USING (user_id IN (SELECT id FROM public.users WHERE clerk_id = auth.uid()::text));

-- RLS Policies for loops table (public read, admin write)
CREATE POLICY "Anyone can read active loops"
    ON public.loops
    FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

CREATE POLICY "Authenticated users can read all loops"
    ON public.loops
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage loops"
    ON public.loops
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE clerk_id = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- RLS Policies for loop_entries table
CREATE POLICY "Users can read all entries"
    ON public.loop_entries
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create entries"
    ON public.loop_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- RLS Policies for user_achievements table
CREATE POLICY "Users can read own achievements"
    ON public.user_achievements
    FOR SELECT
    TO authenticated
    USING (user_id IN (SELECT id FROM public.users WHERE clerk_id = auth.uid()::text));

CREATE POLICY "System can create achievements"
    ON public.user_achievements
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.loops (name, difficulty, ticket_price, max_tickets, prize_pool, status) VALUES
    ('Daily Loop #1', 'Easy', 1.0, 100, 90.0, 'active'),
    ('Weekly Challenge', 'Medium', 5.0, 50, 225.0, 'active'),
    ('Monthly Tournament', 'Hard', 10.0, 25, 225.0, 'active')
ON CONFLICT DO NOTHING;