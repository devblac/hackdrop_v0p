/*
  # Replace game_rounds with loops

  Drops legacy tables and creates new loop tables with
  row level security and indexes.
*/

-- Drop legacy tables
DROP TABLE IF EXISTS round_entries CASCADE;
DROP TABLE IF EXISTS game_rounds CASCADE;
DROP TABLE IF EXISTS loop_entries CASCADE;
DROP TABLE IF EXISTS loops CASCADE;

-- Create loops table
CREATE TABLE loops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  difficulty text NOT NULL,
  ticket_price numeric NOT NULL CHECK (ticket_price > 0),
  max_tickets integer NOT NULL CHECK (max_tickets > 0),
  prize_pool numeric NOT NULL CHECK (prize_pool >= 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  winner_address text,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Create loop_entries table
CREATE TABLE loop_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid REFERENCES loops(id) ON DELETE CASCADE NOT NULL,
  wallet_address text NOT NULL,
  ticket_number integer NOT NULL,
  amount_paid numeric NOT NULL CHECK (amount_paid > 0),
  transaction_id text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_loops_status ON loops(status);
CREATE INDEX idx_loops_created_at ON loops(created_at);
CREATE INDEX idx_loop_entries_loop_id ON loop_entries(loop_id);
CREATE INDEX idx_loop_entries_wallet ON loop_entries(wallet_address);
CREATE UNIQUE INDEX idx_loop_entries_unique ON loop_entries(loop_id, ticket_number);

-- Enable RLS
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if rerun
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('loops','loop_entries')) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
  END LOOP;
END$$;

-- RLS policies for loops
CREATE POLICY "Anyone can read active loops" ON loops
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Authenticated users can read all loops" ON loops
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage loops" ON loops
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE supabase_id = auth.uid() AND role IN ('admin','super_admin')));

-- RLS policies for loop_entries
CREATE POLICY "Users can read all loop entries" ON loop_entries
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create loop entries" ON loop_entries
  FOR INSERT TO authenticated
  WITH CHECK (true);
