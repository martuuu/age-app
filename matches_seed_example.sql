-- ============================================
-- SEED DE PARTIDAS REALES (PLANILLA WHATSAPP)
-- ============================================

DO $$
DECLARE
  v_match_id UUID;
BEGIN
  -- PARTIDA 1: Arabia (4v3)
  INSERT INTO matches (played_at, title, map_name, game_mode, winner_team, notes)
  VALUES ('2026-01-24 18:00:00+00', 'Los lanceros esteparios de Martu arrasaron', 'Arabia', '4v3', 1, 'Partida 1 - Planilla')
  RETURNING id INTO v_match_id;
  
  INSERT INTO match_participants (match_id, player_id, team, civilization, player_color, is_winner)
  VALUES
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Chaca'), 1, 'Slavs', 'Orange', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Facu'), 1, 'Byzantines', 'Gray', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Martu'), 1, 'Mongols', 'Yellow', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Ruso'), 1, 'Bohemians', 'Red', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Zevj'), 2, 'Persians', 'Green', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Mati'), 2, 'Sicilians', 'Blue', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Fran'), 2, 'Mongols', 'Cyan', false);

  -- PARTIDA 2: Yucatan (4v3)
  INSERT INTO matches (played_at, title, map_name, game_mode, winner_team, notes)
  VALUES ('2026-01-24 19:00:00+00', 'La resistencia malaya de juanfacundomena', 'Yucatan', '4v3', 1, 'Partida 2 - Planilla')
  RETURNING id INTO v_match_id;
  
  INSERT INTO match_participants (match_id, player_id, team, civilization, player_color, is_winner)
  VALUES
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Chaca'), 1, 'Berbers', 'Yellow', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Facu'), 1, 'Malay', 'Gray', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Martu'), 1, 'Bulgarians', 'Purple', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Ruso'), 1, 'Portuguese', 'Red', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Zevj'), 2, 'Gurjaras', 'Blue', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Mati'), 2, 'Italians', 'Green', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Fran'), 2, 'Byzantines', 'Cyan', false);

  -- PARTIDA 3: Arabia (4v3)
  INSERT INTO matches (played_at, title, map_name, game_mode, winner_team, notes)
  VALUES ('2026-01-24 20:00:00+00', 'No importa cuando leas esto: zevj corriendo', 'Arabia', '4v3', 2, 'Partida 3 - Planilla')
  RETURNING id INTO v_match_id;
  
  INSERT INTO match_participants (match_id, player_id, team, civilization, player_color, is_winner)
  VALUES
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Chaca'), 1, 'Poles', 'Yellow', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Facu'), 1, 'Ethiopians', 'Cyan', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Martu'), 1, 'Bohemians', 'Purple', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Ruso'), 1, 'Saracens', 'Red', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Zevj'), 2, 'Teutons', 'Blue', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Mati'), 2, 'Romans', 'Gray', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Fran'), 2, 'Goths', 'Green', true);

  -- PARTIDA 4: Valle (4v3)
  INSERT INTO matches (played_at, title, map_name, game_mode, winner_team, notes)
  VALUES ('2026-01-24 21:00:00+00', 'Solides ofensiva', 'Valley', '4v3', 1, 'Partida 4 - Planilla')
  RETURNING id INTO v_match_id;
  
  INSERT INTO match_participants (match_id, player_id, team, civilization, player_color, is_winner)
  VALUES
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Chaca'), 1, 'Romans', 'Cyan', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Facu'), 1, 'Burmese', 'Yellow', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Martu'), 1, 'Malay', 'Purple', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Ruso'), 1, 'Hindustanis', 'Red', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Zevj'), 2, 'Chinese', 'Red', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Mati'), 2, 'Wei', 'Blue', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Fran'), 2, 'Mongols', 'Green', false);

  -- PARTIDA 5: Selva negra (3v4)
  INSERT INTO matches (played_at, title, map_name, game_mode, winner_team, notes)
  VALUES ('2026-01-24 22:00:00+00', 'La partida de la polémica. Easy GG. Zevj en japi.', 'Black Forest', '3v4', 1, 'Partida 5 - Planilla')
  RETURNING id INTO v_match_id;
  
  INSERT INTO match_participants (match_id, player_id, team, civilization, player_color, is_winner)
  VALUES
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Chaca'), 1, 'Khmer', 'Green', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Zevj'), 1, 'Dravidians', 'Red', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Mati'), 1, 'Byzantines', 'Yellow', true),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Martu'), 2, 'Portuguese', 'Purple', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Fran'), 2, 'Goths', 'Blue', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Facu'), 2, 'Spanish', 'Cyan', false),
    (v_match_id, (SELECT id FROM players WHERE nickname = 'Ruso'), 2, 'Malians', 'Orange', false);

END $$;
