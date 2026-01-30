-- ============================================
-- Age of Empires 2 Match History Schema (v2.1)
-- Enhanced for comprehensive statistics tracking
-- ============================================

-- RESET: Borrar todo lo anterior para evitar errores de duplicidad (políticas, triggers, etc.)
-- Se usa CASCADE para limpiar dependencias automáticamente.
DROP TABLE IF EXISTS match_participants CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- 1. PLAYERS TABLE
-- Stores all registered players with their preferences
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  nickname TEXT,
  email TEXT,                       -- Email for future user authentication
  steam_id TEXT,                    -- Steam ID for API integration (aoe2insights, etc.)
  preferred_color TEXT,             -- Player's favorite color (e.g., 'Blue', 'Red', 'Green')
  avatar_url TEXT,
  elo_rating INTEGER DEFAULT 1000,  -- Starting ELO for ranking
  total_matches INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MATCHES TABLE
-- Records each match with full metadata
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT, -- Optional descriptive title for the match
  map_name TEXT NOT NULL DEFAULT 'Arabia',
  game_mode TEXT DEFAULT '1v1', -- e.g., '1v1', '2v2', '3v3', '4v4', 'FFA'
  duration_minutes INTEGER, -- Match duration in minutes (optional)
  winner_team INTEGER NOT NULL CHECK (winner_team IN (1, 2)),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MATCH PARTICIPANTS TABLE
-- Links players to matches with their in-game stats
CREATE TABLE IF NOT EXISTS match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team INTEGER NOT NULL CHECK (team IN (1, 2)),
  player_color TEXT NOT NULL, -- Actual color used in this match
  civilization TEXT NOT NULL, -- Civ played (e.g., 'Britons', 'Franks', 'Mongols')
  is_winner BOOLEAN DEFAULT false, -- Calculated field for easy querying
  UNIQUE(match_id, player_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_matches_played_at ON matches(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_participants_player ON match_participants(player_id);
CREATE INDEX IF NOT EXISTS idx_match_participants_match ON match_participants(match_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access for players" 
  ON players FOR SELECT USING (true);

CREATE POLICY "Public read access for matches" 
  ON matches FOR SELECT USING (true);

CREATE POLICY "Public read access for match_participants" 
  ON match_participants FOR SELECT USING (true);

-- Admin (authenticated) full CRUD access
CREATE POLICY "Admin full access to players" 
  ON players FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to matches" 
  ON matches FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to match_participants" 
  ON match_participants FOR ALL 
  USING (auth.role() = 'authenticated');

-- ============================================
-- TRIGGER: Auto-update player stats
-- ============================================
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total matches and wins for all participants
  UPDATE players p
  SET 
    total_matches = (
      SELECT COUNT(DISTINCT mp.match_id)
      FROM match_participants mp
      WHERE mp.player_id = p.id
    ),
    total_wins = (
      SELECT COUNT(*)
      FROM match_participants mp
      WHERE mp.player_id = p.id AND mp.is_winner = true
    ),
    updated_at = NOW()
  WHERE p.id IN (
    SELECT player_id FROM match_participants WHERE match_id = NEW.match_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_player_stats
AFTER INSERT OR UPDATE ON match_participants
FOR EACH ROW
EXECUTE FUNCTION update_player_stats();

-- ============================================
-- TRIGGER: Delete empty matches
-- ============================================
CREATE OR REPLACE FUNCTION delete_empty_matches()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete matches that have no participants left
  DELETE FROM matches
  WHERE id = OLD.match_id
  AND NOT EXISTS (
    SELECT 1 FROM match_participants WHERE match_id = OLD.match_id
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_empty_matches
AFTER DELETE ON match_participants
FOR EACH ROW
EXECUTE FUNCTION delete_empty_matches();

-- ============================================
-- SEED DATA: Sample civilizations reference
-- ============================================
-- You can use this list for dropdowns in your forms
COMMENT ON COLUMN match_participants.civilization IS 
'Civilizaciones AoE2: Armenians, Aztecs, Bengalis, Berbers, Bohemians, Britons, Bulgarians, Burgundians, Burmese, Byzantines, Celts, Chinese, Cumans, Dravidians, Ethiopians, Franks, Georgians, Goths, Gurjaras, Hindustanis, Huns, Inca, Italians, Japanese, Jurchens, Khitans, Khmer, Koreans, Lithuanians, Magyars, Malay, Malians, Mapuche, Maya, Mongols, Muisca, Persians, Poles, Portuguese, Romans, Saracens, Shu, Sicilians, Slavs, Spanish, Tatars, Teutons, Tupi, Turks, Vietnamese, Vikings, Wei, Wu';

COMMENT ON COLUMN match_participants.player_color IS 
'Available colors: Blue, Red, Green, Yellow, Cyan, Purple, Gray, Orange';
