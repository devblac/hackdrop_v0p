/*
  # Create Achievements System Tables

  This migration creates all the necessary tables for the achievements and referral system.
  
  1. New Tables
    - `referral_tiers` - Define commission tiers for referrals
    - `achievements` - Master list of all achievements  
    - `referral_stats` - User referral statistics and tier tracking
    - `referral_history` - Track referral relationships and commissions
    - `user_achievement_progress` - Track user progress on achievements

  2. Enhanced Tables
    - Add viral features to existing `users` table
    - Add referral tracking columns

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies for user data access

  4. Sample Data
    - Insert default referral tiers
    - Insert sample achievements
*/

-- Enhance existing users table with viral features
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'total_earnings') THEN
    ALTER TABLE public.users ADD COLUMN total_earnings NUMERIC DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'total_spent') THEN
    ALTER TABLE public.users ADD COLUMN total_spent NUMERIC DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'referral_code') THEN
    ALTER TABLE public.users ADD COLUMN referral_code TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'referred_by_code') THEN
    ALTER TABLE public.users ADD COLUMN referred_by_code TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'level') THEN
    ALTER TABLE public.users ADD COLUMN level INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'experience_points') THEN
    ALTER TABLE public.users ADD COLUMN experience_points INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'streak_count') THEN
    ALTER TABLE public.users ADD COLUMN streak_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'display_name') THEN
    ALTER TABLE public.users ADD COLUMN display_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_activity') THEN
    ALTER TABLE public.users ADD COLUMN last_activity TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Generate referral codes for existing users
UPDATE public.users 
SET referral_code = UPPER(LEFT(MD5(RANDOM()::TEXT), 8)) 
WHERE referral_code IS NULL;

-- Create referral tiers table
CREATE TABLE IF NOT EXISTS public.referral_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_level INTEGER NOT NULL UNIQUE,
  commission_percentage NUMERIC NOT NULL,
  min_referrals INTEGER DEFAULT 0,
  tier_name TEXT NOT NULL,
  bonus_multiplier NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('gameplay', 'social', 'milestone', 'special')),
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  reward_points INTEGER DEFAULT 0,
  unlock_criteria JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create referral stats table
CREATE TABLE IF NOT EXISTS public.referral_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  total_commission_earned NUMERIC DEFAULT 0,
  current_tier INTEGER DEFAULT 1,
  this_month_referrals INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create referral history table
CREATE TABLE IF NOT EXISTS public.referral_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  commission_earned NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user achievement progress table
CREATE TABLE IF NOT EXISTS public.user_achievement_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  progress NUMERIC DEFAULT 0,
  target NUMERIC NOT NULL,
  unlocked_at TIMESTAMPTZ,
  is_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_referral_stats_user_id ON public.referral_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_history_referrer ON public.referral_history(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_history_referred ON public.referral_history(referred_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_user ON public.user_achievement_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);

-- Enable RLS on new tables
ALTER TABLE public.referral_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievement_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_tiers (public read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'referral_tiers' 
    AND policyname = 'Anyone can read referral tiers'
  ) THEN
    CREATE POLICY "Anyone can read referral tiers"
      ON public.referral_tiers
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- RLS Policies for achievements (public read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'achievements' 
    AND policyname = 'Anyone can read achievements'
  ) THEN
    CREATE POLICY "Anyone can read achievements"
      ON public.achievements
      FOR SELECT
      TO anon, authenticated
      USING (is_active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'achievements' 
    AND policyname = 'Admins can manage achievements'
  ) THEN
    CREATE POLICY "Admins can manage achievements"
      ON public.achievements
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.users 
          WHERE supabase_id = auth.uid()::text 
          AND role IN ('admin', 'super_admin')
        )
      );
  END IF;
END $$;

-- RLS Policies for referral_stats
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'referral_stats' 
    AND policyname = 'Users can read own referral stats'
  ) THEN
    CREATE POLICY "Users can read own referral stats"
      ON public.referral_stats
      FOR SELECT
      TO authenticated
      USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'referral_stats' 
    AND policyname = 'System can update referral stats'
  ) THEN
    CREATE POLICY "System can update referral stats"
      ON public.referral_stats
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- RLS Policies for referral_history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'referral_history' 
    AND policyname = 'Users can read own referral history'
  ) THEN
    CREATE POLICY "Users can read own referral history"
      ON public.referral_history
      FOR SELECT
      TO authenticated
      USING (
        referrer_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text)
        OR referred_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text)
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'referral_history' 
    AND policyname = 'System can manage referral history'
  ) THEN
    CREATE POLICY "System can manage referral history"
      ON public.referral_history
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- RLS Policies for user_achievement_progress
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_achievement_progress' 
    AND policyname = 'Users can read own achievement progress'
  ) THEN
    CREATE POLICY "Users can read own achievement progress"
      ON public.user_achievement_progress
      FOR SELECT
      TO authenticated
      USING (user_id IN (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_achievement_progress' 
    AND policyname = 'System can manage achievement progress'
  ) THEN
    CREATE POLICY "System can manage achievement progress"
      ON public.user_achievement_progress
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Insert default referral tiers
INSERT INTO public.referral_tiers (tier_level, commission_percentage, min_referrals, tier_name, bonus_multiplier) VALUES
  (1, 5.0, 0, 'Bronze', 1.0),
  (2, 7.5, 5, 'Silver', 1.2),
  (3, 10.0, 15, 'Gold', 1.5),
  (4, 15.0, 50, 'Platinum', 2.0),
  (5, 20.0, 100, 'Diamond', 3.0)
ON CONFLICT (tier_level) DO NOTHING;

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, category, rarity, reward_points, unlock_criteria) VALUES
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

-- Create function to update referral stats
CREATE OR REPLACE FUNCTION public.update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update referral stats for new user
  INSERT INTO public.referral_stats (user_id, total_referrals, total_commission_earned, current_tier)
  VALUES (NEW.id, 0, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- If user was referred, update referrer's stats
  IF NEW.referred_by_code IS NOT NULL THEN
    UPDATE public.referral_stats 
    SET total_referrals = total_referrals + 1,
        this_month_referrals = this_month_referrals + 1,
        updated_at = NOW()
    WHERE user_id = (
      SELECT id FROM public.users WHERE referral_code = NEW.referred_by_code
    );
    
    -- Create referral history record
    INSERT INTO public.referral_history (referrer_id, referred_id, commission_earned, status)
    SELECT 
      u.id,
      NEW.id,
      0, -- Commission will be calculated when referred user makes first purchase
      'pending'
    FROM public.users u 
    WHERE u.referral_code = NEW.referred_by_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral stats
DROP TRIGGER IF EXISTS trigger_update_referral_stats ON public.users;
CREATE TRIGGER trigger_update_referral_stats
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_referral_stats();

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Only generate if referral_code is null
  IF NEW.referral_code IS NULL THEN
    LOOP
      new_code := UPPER(LEFT(MD5(RANDOM()::TEXT), 8));
      SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = new_code) INTO code_exists;
      EXIT WHEN NOT code_exists;
    END LOOP;
    NEW.referral_code := new_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral code generation
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON public.users;
CREATE TRIGGER trigger_generate_referral_code
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();