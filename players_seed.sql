-- ============================================
-- SEED DE JUGADORES ORIGINALES
-- ============================================
-- Ejecutar en Supabase SQL Editor después del schema
-- Colores asignados al azar dentro de los originales de AoE2
-- Avatares asignados: unidades de Age of Empires 2

INSERT INTO players (name, nickname, email, steam_id, preferred_color, avatar_url) VALUES
  ('Martu', 'Martu', '', 'Martuuu89', 'Blue', '/assets/player-icons/knight.png'),
  ('Chaca', 'Chaca', '', 'chaquinha', 'Red', '/assets/player-icons/paladin.png'),
  ('Tata', 'Tata', '', 'martin.decharras', 'Green', '/assets/player-icons/crusader.png'),
  ('Dani', 'dany.24', '', 'dany.24', 'Yellow', '/assets/player-icons/archer.png'),
  ('Fran', 'Fran', '', 'francoollearo', 'Cyan', '/assets/player-icons/huskarl.png'),
  ('Mati', 'Mati', '', 'ML16798', 'Purple', '/assets/player-icons/cavalry.png'),
  ('Nico', 'Ruso', '', 'Ruso', 'Orange', '/assets/player-icons/samurai.png'),
  ('Facu', 'Facu', '', 'juanfacundomena', 'Gray', '/assets/player-icons/warrior.png'),
  ('German', 'Chino', '', 'chino', 'Blue', '/assets/player-icons/viking.png'),
  ('Rami', 'Bicho', '', 'garciagamero.r', 'Red', '/assets/player-icons/eagle.png'),
  ('Mosca', 'Mosca', '', '', 'Green', '/assets/player-icons/cannon.png'),
  ('Seba', 'Zevj', '', 'Zevj', 'Yellow', '/assets/player-icons/roman.png')
ON CONFLICT (name) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  steam_id = EXCLUDED.steam_id,
  preferred_color = EXCLUDED.preferred_color,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- Verificar inserción
SELECT name, nickname, preferred_color FROM players ORDER BY name;
