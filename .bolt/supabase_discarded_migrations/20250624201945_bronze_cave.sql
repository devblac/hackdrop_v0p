/*
  # Complete Database Schema Migration - Fixed Version
  
  This migration creates the complete database schema for the AlgoLoop gaming platform,
  handling existing objects gracefully to avoid conflicts.
  
  1. New Tables
    - Enhanced users table with viral features
    - game_rounds table (simplified from loops)
    - round_entries table for game participation
    - connected_wallets for wallet management
    - referral system tables
    - achievements system tables
    - app_settings for configuration
    
  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    
  3. Functions & Triggers
    - Automated referral tracking
    - Achievement progress tracking
    - Round player count management
*/

-- Create enum types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE round_status AS ENUM ('open', 'full', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE wallet_type AS ENUM ('pera', 'myalgo', 'walletconnect');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS referral_rewards CASCADE;
DROP TABLE IF EXISTS round_entries CASCADE;
DROP TABLE IF EXISTS user_achievement_progress CASCADE;
DROP TABLE IF EXISTS referral_history CASCADE;
DROP TABLE IF EXISTS referral_stats CASCADE;
DROP TABLE IF EXISTS connected_wallets CASCADE;
DROP TABLE IF EXISTS game_rounds CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS referral_tiers CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;

-- Update existing users table or create if not exists
DO $$
BEGIN
    -- Add new columns to existing users table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'total_earnings') THEN
        ALTER TABLE users ADD COLUMN total_earnings numeric DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'total_spent') THEN
        ALTER TABLE users ADD COLUMN total_spent numeric DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'referral_code') THEN
        ALTER TABLE users ADD COLUMN referral_code text UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'referred_by_code') THEN
        ALTER TABLE users ADD COLUMN referred_by_code text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'level') THEN
        ALTER TABLE users ADD COLUMN level integer DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'experience_points') THEN
        ALTER TABLE users ADD COLUMN experience_points integer DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'streak_count') THEN
        ALTER TABLE users ADD COLUMN streak_count integer DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'display_name') THEN
        ALTER TABLE users ADD COLUMN display_name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_activity') THEN
        ALTER TABLE users ADD COLUMN last_activity timestamptz DEFAULT now();
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        -- Create users table if it doesn't exist
        CREATE TABLE users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            supabase_id uuid UNIQUE,
            email text UNIQUE NOT NULL,
            role text NOT NULL DEFAULT 'user' CHECK (role IN ('guest', 'user', 'admin', 'super_admin')),
            created_at timestamptz DEFAULT now() NOT NULL,
            updated_at timestamptz DEFAULT now() NOT NULL,
            total_earnings numeric DEFAULT 0,
            total_spent numeric DEFAULT 0,
            referral_code text UNIQUE,
            referred_by_code text,
            level integer DEFAULT 1,
            experience_points integer DEFAULT 0,
            streak_count integer DEFAULT 0,
            display_name text,
            last_activity timestamptz DEFAULT now()
        );
END $$;

-- Game rounds table (simplified from loops)
CREATE TABLE game_rounds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    round_number integer UNIQUE NOT NULL,
    ticket_price text NOT NULL, -- Store as string for precision
    max_players integer NOT NULL DEFAULT 10 CHECK (max_players > 0 AND max_players <= 100),
    current_players integer DEFAULT 0 CHECK (current_players >= 0 AND current_players <= max_players),
    status round_status DEFAULT 'open',
    winner_number integer CHECK (winner_number IS NULL OR (winner_number >= 0 AND winner_number <= 9)),
    winner_address text,
    prize_amount text,
    vrf_proof text,
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    transaction_id text,
    created_at timestamptz DEFAULT now()
);

-- Round entries table
CREATE TABLE round_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id uuid REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES users(id) NOT NULL,
    wallet_address text NOT NULL,
    chosen_number integer NOT NULL CHECK (chosen_number >= 0 AND chosen_number <= 9),
    transaction_id text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Connected wallets (for anonymous connections)
CREATE TABLE connected_wallets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    wallet_address text UNIQUE NOT NULL,
    wallet_type wallet_type DEFAULT 'pera' NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Referral tiers
CREATE TABLE referral_tiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_level integer UNIQUE NOT NULL,
    commission_percentage numeric NOT NULL,
    min_referrals integer DEFAULT 0,
    tier_name text NOT NULL,
    bonus_multiplier numeric DEFAULT 1.0,
    created_at timestamptz DEFAULT now()
);

-- Achievements
CREATE TABLE achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    category text NOT NULL CHECK (category IN ('gameplay', 'social', 'milestone', 'special')),
    rarity text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    reward_points integer DEFAULT 0,
    unlock_criteria jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- User achievement progress
CREATE TABLE user_achievement_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    progress numeric DEFAULT 0,
    target numeric NOT NULL,
    unlocked_at timestamptz,
    is_claimed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- Referral stats
CREATE TABLE referral_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_referrals integer DEFAULT 0,
    total_commission_earned numeric DEFAULT 0,
    current_tier integer DEFAULT 1,
    this_month_referrals integer DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

-- Referral history
CREATE TABLE referral_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    referred_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    commission_earned numeric DEFAULT 0,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
    created_at timestamptz DEFAULT now(),
    CHECK (referrer_id <> referred_id)
);

-- Referral rewards
CREATE TABLE referral_rewards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id uuid REFERENCES users(id) NOT NULL,
    referred_id uuid REFERENCES users(id) NOT NULL,
    round_id uuid REFERENCES game_rounds(id) ON DELETE CASCADE NOT NULL,
    reward_amount text NOT NULL,
    claimed boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- App settings
CREATE TABLE app_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key text UNIQUE NOT NULL,
    setting_value jsonb NOT NULL,
    setting_type text NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description text,
    is_public boolean DEFAULT false,
    updated_by uuid REFERENCES users(id),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes (drop first if they exist)
DROP INDEX IF EXISTS idx_users_supabase_id;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_referral_code;
DROP INDEX IF EXISTS idx_users_referred_by;
DROP INDEX IF EXISTS idx_game_rounds_status;
DROP INDEX IF EXISTS idx_game_rounds_round_number;
DROP INDEX IF EXISTS idx_game_rounds_started_at;
DROP INDEX IF EXISTS idx_round_entries_round_id;
DROP INDEX IF EXISTS idx_round_entries_user_id;
DROP INDEX IF EXISTS idx_round_entries_wallet_address;
DROP INDEX IF EXISTS idx_round_entries_transaction_id;
DROP INDEX IF EXISTS idx_connected_wallets_user_id;
DROP INDEX IF EXISTS idx_connected_wallets_address;
DROP INDEX IF EXISTS idx_referral_stats_user_id;
DROP INDEX IF EXISTS idx_referral_history_referrer;
DROP INDEX IF EXISTS idx_referral_history_referred;
DROP INDEX IF EXISTS idx_user_achievement_progress_user;
DROP INDEX IF EXISTS idx_achievements_category;
DROP INDEX IF EXISTS idx_referral_rewards_referrer_id;
DROP INDEX IF EXISTS idx_referral_rewards_referred_id;
DROP INDEX IF EXISTS idx_referral_rewards_round_id;
DROP INDEX IF EXISTS idx_referral_rewards_claimed;

-- Create indexes
CREATE INDEX idx_users_supabase_id ON users(supabase_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by_code);

CREATE INDEX idx_game_rounds_status ON game_rounds(status);
CREATE INDEX idx_game_rounds_round_number ON game_rounds(round_number);
CREATE INDEX idx_game_rounds_started_at ON game_rounds(started_at);

CREATE INDEX idx_round_entries_round_id ON round_entries(round_id);
CREATE INDEX idx_round_entries_user_id ON round_entries(user_id);
CREATE INDEX idx_round_entries_wallet_address ON round_entries(wallet_address);
CREATE INDEX idx_round_entries_transaction_id ON round_entries(transaction_id);

CREATE INDEX idx_connected_wallets_user_id ON connected_wallets(user_id);
CREATE INDEX idx_connected_wallets_address ON connected_wallets(wallet_address);

CREATE INDEX idx_referral_stats_user_id ON referral_stats(user_id);
CREATE INDEX idx_referral_history_referrer ON referral_history(referrer_id);
CREATE INDEX idx_referral_history_referred ON referral_history(referred_id);
CREATE INDEX idx_user_achievement_progress_user ON user_achievement_progress(user_id);
CREATE INDEX idx_achievements_category ON achievements(category);

CREATE INDEX idx_referral_rewards_referrer_id ON referral_rewards(referrer_id);
CREATE INDEX idx_referral_rewards_referred_id ON referral_rewards(referred_id);
CREATE INDEX idx_referral_rewards_round_id ON referral_rewards(round_id);
CREATE INDEX idx_referral_rewards_claimed ON referral_rewards(claimed);

-- Unique constraints (drop first if they exist)
DROP INDEX IF EXISTS idx_users_referral_code_unique;
DROP INDEX IF EXISTS idx_round_entries_unique_number_per_round;
DROP INDEX IF EXISTS idx_round_entries_unique_user_per_round;
DROP INDEX IF EXISTS idx_connected_wallets_primary_unique;

CREATE UNIQUE INDEX idx_round_entries_unique_number_per_round ON round_entries(round_id, chosen_number);
CREATE UNIQUE INDEX idx_round_entries_unique_user_per_round ON round_entries(round_id, user_id);
CREATE UNIQUE INDEX idx_connected_wallets_primary_unique ON connected_wallets(user_id) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on our tables
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN (
        'users', 'game_rounds', 'round_entries', 'connected_wallets', 'referral_tiers', 
        'achievements', 'user_achievement_progress', 'referral_stats', 'referral_history', 
        'referral_rewards', 'app_settings'
    )) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- RLS Policies

-- Users policies
CREATE POLICY "Allow insert for authenticated users" ON users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow insert from anyone" ON users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow user self-insert" ON users FOR INSERT TO public WITH CHECK (supabase_id = auth.uid());
CREATE POLICY "Allow user to read own data" ON users FOR SELECT TO public USING (supabase_id = auth.uid());
CREATE POLICY "Allow user to update own data" ON users FOR UPDATE TO public USING (supabase_id = auth.uid());

-- Game rounds policies
CREATE POLICY "Anyone can read game rounds" ON game_rounds FOR SELECT TO authenticated USING (true);

-- Round entries policies
CREATE POLICY "Anyone can read round entries" ON round_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create own entries" ON round_entries FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Connected wallets policies
CREATE POLICY "Users can manage own wallets" ON connected_wallets FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Referral tiers policies (public read)
CREATE POLICY "Anyone can read referral tiers" ON referral_tiers FOR SELECT TO anon, authenticated USING (true);

-- Achievements policies
CREATE POLICY "Anyone can read achievements" ON achievements FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can manage achievements" ON achievements FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM users WHERE supabase_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- User achievement progress policies
CREATE POLICY "Users can read own achievement progress" ON user_achievement_progress FOR SELECT TO authenticated USING (
    user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid())
);
CREATE POLICY "System can manage achievement progress" ON user_achievement_progress FOR ALL TO authenticated USING (true);

-- Referral stats policies
CREATE POLICY "Users can read own referral stats" ON referral_stats FOR SELECT TO authenticated USING (
    user_id IN (SELECT id FROM users WHERE supabase_id = auth.uid())
);
CREATE POLICY "System can update referral stats" ON referral_stats FOR ALL TO authenticated USING (true);

-- Referral history policies
CREATE POLICY "Users can read own referral history" ON referral_history FOR SELECT TO authenticated USING (
    referrer_id IN (SELECT id FROM users WHERE supabase_id = auth.uid()) OR
    referred_id IN (SELECT id FROM users WHERE supabase_id = auth.uid())
);
CREATE POLICY "System can manage referral history" ON referral_history FOR ALL TO authenticated USING (true);

-- Referral rewards policies
CREATE POLICY "Users can read own referral rewards" ON referral_rewards FOR SELECT TO authenticated USING (referrer_id = auth.uid());

-- App settings policies
CREATE POLICY "Anyone can read public settings" ON app_settings FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Admins can manage settings" ON app_settings FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM users WHERE supabase_id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Functions (drop existing first)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;
DROP FUNCTION IF EXISTS update_round_player_count() CASCADE;
DROP FUNCTION IF EXISTS handle_referral_reward() CASCADE;
DROP FUNCTION IF EXISTS update_referral_stats() CASCADE;

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Generate referral code function
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    IF NEW.referral_code IS NULL THEN
        LOOP
            new_code := UPPER(LEFT(MD5(RANDOM()::TEXT), 8));
            SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = new_code) INTO code_exists;
            EXIT WHEN NOT code_exists;
        END LOOP;
        NEW.referral_code := new_code;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update round player count function
CREATE OR REPLACE FUNCTION update_round_player_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE game_rounds 
        SET current_players = current_players + 1,
            status = CASE 
                WHEN current_players + 1 >= max_players THEN 'full'::round_status
                ELSE status
            END
        WHERE id = NEW.round_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE game_rounds 
        SET current_players = current_players - 1,
            status = CASE 
                WHEN current_players - 1 < max_players AND status = 'full'::round_status THEN 'open'::round_status
                ELSE status
            END
        WHERE id = OLD.round_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Handle referral reward function
CREATE OR REPLACE FUNCTION handle_referral_reward()
RETURNS TRIGGER AS $$
DECLARE
    referrer_user_id uuid;
    commission_rate numeric;
    reward_amount numeric;
    ticket_price_numeric numeric;
BEGIN
    -- Get referrer user ID
    SELECT u.id INTO referrer_user_id
    FROM users u
    JOIN users referred ON referred.referred_by_code = u.referral_code
    WHERE referred.id = NEW.user_id;
    
    IF referrer_user_id IS NOT NULL THEN
        -- Get commission rate (default 5%)
        SELECT COALESCE(rt.commission_percentage, 5.0) INTO commission_rate
        FROM referral_stats rs
        LEFT JOIN referral_tiers rt ON rt.tier_level = rs.current_tier
        WHERE rs.user_id = referrer_user_id;
        
        -- Get ticket price from round
        SELECT gr.ticket_price::numeric INTO ticket_price_numeric
        FROM game_rounds gr
        WHERE gr.id = NEW.round_id;
        
        -- Calculate reward (commission of ticket price)
        reward_amount := (ticket_price_numeric * commission_rate / 100);
        
        -- Insert referral reward
        INSERT INTO referral_rewards (referrer_id, referred_id, round_id, reward_amount)
        VALUES (referrer_user_id, NEW.user_id, NEW.round_id, reward_amount::text);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update referral stats function
CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update referral stats for new user
    INSERT INTO referral_stats (user_id, total_referrals, total_commission_earned, current_tier)
    VALUES (NEW.id, 0, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- If user was referred, update referrer's stats
    IF NEW.referred_by_code IS NOT NULL THEN
        UPDATE referral_stats 
        SET total_referrals = total_referrals + 1,
            this_month_referrals = this_month_referrals + 1,
            updated_at = NOW()
        WHERE user_id = (
            SELECT id FROM users WHERE referral_code = NEW.referred_by_code
        );
        
        -- Create referral history record
        INSERT INTO referral_history (referrer_id, referred_id, commission_earned, status)
        SELECT 
            u.id,
            NEW.id,
            0,
            'pending'
        FROM users u 
        WHERE u.referral_code = NEW.referred_by_code;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON users;
DROP TRIGGER IF EXISTS trigger_update_referral_stats ON users;
DROP TRIGGER IF EXISTS update_round_player_count_trigger ON round_entries;
DROP TRIGGER IF EXISTS handle_referral_reward_trigger ON round_entries;

-- Create triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_generate_referral_code 
    BEFORE INSERT ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_referral_code();

CREATE TRIGGER trigger_update_referral_stats 
    AFTER INSERT ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_referral_stats();

CREATE TRIGGER update_round_player_count_trigger 
    AFTER INSERT OR DELETE ON round_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_round_player_count();

CREATE TRIGGER handle_referral_reward_trigger 
    AFTER INSERT ON round_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION handle_referral_reward();

-- Insert default data

-- Referral tiers
INSERT INTO referral_tiers (tier_level, commission_percentage, min_referrals, tier_name, bonus_multiplier) VALUES
    (1, 5.0, 0, 'Bronze', 1.0),
    (2, 7.5, 5, 'Silver', 1.2),
    (3, 10.0, 15, 'Gold', 1.5),
    (4, 15.0, 50, 'Platinum', 2.0),
    (5, 20.0, 100, 'Diamond', 3.0)
ON CONFLICT (tier_level) DO NOTHING;

-- Sample achievements
INSERT INTO achievements (name, description, icon, category, rarity, reward_points, unlock_criteria) VALUES
    ('First Steps', 'Complete your first loop entry', 'Zap', 'gameplay', 'common', 10, '{"type": "loop_entries", "target": 1}'),
    ('Loop Veteran', 'Enter 10 loops', 'Target', 'gameplay', 'common', 50, '{"type": "loop_entries", "target": 10}'),
    ('Loop Master', 'Enter 100 loops', 'Trophy', 'gameplay', 'rare', 200, '{"type": "loop_entries", "target": 100}'),
    ('First Win', 'Win your first loop', 'Award', 'gameplay', 'rare', 100, '{"type": "loop_wins", "target": 1}'),
    ('Lucky Streak', 'Win 3 loops in a row', 'Flame', 'gameplay', 'epic', 500, '{"type": "win_streak", "target": 3}'),
    ('Social Butterfly', 'Refer your first friend', 'Users', 'social', 'common', 25, '{"type": "referrals", "target": 1}'),
    ('Influencer', 'Refer 10 friends', 'Megaphone', 'social', 'rare', 250, '{"type": "referrals", "target": 10}'),
    ('Viral Star', 'Refer 50 friends', 'Star', 'social', 'legendary', 1000, '{"type": "referrals", "target": 50}'),
    ('Big Spender', 'Spend 100 ALGO total', 'DollarSign', 'milestone', 'rare', 150, '{"type": "total_spent", "target": 100}'),
    ('High Roller', 'Spend 1000 ALGO total', 'Crown', 'milestone', 'epic', 750, '{"type": "total_spent", "target": 1000}'),
    ('Early Bird', 'Join during beta period', 'Sunrise', 'special', 'legendary', 500, '{"type": "early_user", "target": 1}')
ON CONFLICT (name) DO NOTHING;

-- App settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
    ('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false),
    ('registration_enabled', 'true', 'boolean', 'Allow new user registration', false),
    ('max_loop_entry_amount', '100', 'number', 'Maximum loop entry amount in ALGO', false),
    ('default_theme', 'dark', 'string', 'Default application theme', true),
    ('platform_commission', '20', 'number', 'Platform commission percentage', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Generate referral codes for existing users
UPDATE users 
SET referral_code = UPPER(LEFT(MD5(RANDOM()::TEXT), 8)) 
WHERE referral_code IS NULL;