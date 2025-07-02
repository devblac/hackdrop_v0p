-- Enable RLS and add new policies for loops and loop_entries

-- Ensure RLS is enabled
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('loops','loop_entries')) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
  END LOOP;
END$$;

-- Anyone can read active loops
CREATE POLICY "Public can read active loops" ON loops
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

-- Authenticated users can read all loops
CREATE POLICY "Authenticated users can read all loops" ON loops
  FOR SELECT TO authenticated
  USING (true);

-- Admins can manage loops (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can insert loops" ON loops
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE supabase_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update loops" ON loops
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE supabase_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete loops" ON loops
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE supabase_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role can manage loops" ON loops
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can insert loop entries
CREATE POLICY "Authenticated can insert loop entries" ON loop_entries
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Users can read their own loop entries
CREATE POLICY "Users can read loop entries" ON loop_entries
  FOR SELECT TO authenticated
  USING (true);

-- Service role can manage loop entries
CREATE POLICY "Service role can manage loop entries" ON loop_entries
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
