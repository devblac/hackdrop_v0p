/*
  # Fix Authentication Migration from Clerk to Supabase Auth

  1. Database Schema Updates
    - Update users table structure for Supabase Auth
    - Remove old Clerk-based RLS policies
    - Add new Supabase Auth RLS policies

  2. Security
    - Enable RLS on users table with proper Supabase Auth policies
    - Update other table policies to work with Supabase Auth
    - Remove all Clerk references

  3. Changes
    - Drop old Clerk-based policies
    - Update users table structure if needed
    - Add new RLS policies for Supabase Auth
*/

-- First, drop all existing RLS policies that reference clerk_id
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Users can manage own wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Admins can manage loops" ON public.loops;
DROP POLICY IF EXISTS "Users can read own achievements" ON public.user_achievements;

-- Update users table structure to use supabase_id instead of clerk_id
DO $$
BEGIN
  -- Check if clerk_id column exists and rename it to supabase_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'clerk_id'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN clerk_id TO supabase_id;
  END IF;
  
  -- Ensure supabase_id column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'supabase_id'
  ) THEN
    ALTER TABLE public.users ADD COLUMN supabase_id text UNIQUE NOT NULL;
  END IF;
END $$;

-- Update indexes
DROP INDEX IF EXISTS idx_users_clerk_id;
CREATE INDEX IF NOT EXISTS idx_users_supabase_id ON public.users(supabase_id);

-- New RLS policies for users table with Supabase Auth
CREATE POLICY "Allow insert for authenticated users"
    ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can read own data"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (supabase_id = auth.uid()::text);

CREATE POLICY "Users can update own data"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (supabase_id = auth.uid()::text);

-- Update user_wallets policies
CREATE POLICY "Users can manage own wallets"
    ON public.user_wallets
    FOR ALL
    TO authenticated
    USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));

-- Update loops policies for admin access
CREATE POLICY "Admins can manage loops"
    ON public.loops
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE supabase_id = auth.uid()::text 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Update user_achievements policies
CREATE POLICY "Users can read own achievements"
    ON public.user_achievements
    FOR SELECT
    TO authenticated
    USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));