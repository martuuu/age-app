-- ============================================
-- SEED DE JUGADORES ORIGINALES
-- ============================================
-- Ejecutar en Supabase SQL Editor después del schema
-- Colores asignados al azar dentro de los originales de AoE2

INSERT INTO players (name, nickname, email, steam_id, preferred_color) VALUES
  ('Martu', 'Martu', '', 'Martuuu89', 'Blue'),
  ('Chaca', 'Chaca', '', 'chaquinha', 'Red'),
  ('Tata', 'Tata', '', 'martin.decharras', 'Green'),
  ('Dani', 'dany.24', '', 'dany.24', 'Yellow'),
  ('Fran', 'Fran', '', 'francoollearo', 'Cyan'),
  ('Mati', 'Mati', '', 'ML16798', 'Purple'),
  ('Nico', 'Ruso', '', 'Ruso', 'Orange'),
  ('Facu', 'Facu', '', 'juanfacundomena', 'Gray'),
  ('German', 'Chino', '', 'chino', 'Blue'),
  ('Rami', 'Bicho', '', 'garciagamero.r', 'Red'),
  ('Mosca', 'Mosca', '', '', 'Green'),
  ('Seba', 'Zevj', '', 'Zevj', 'Yellow')
ON CONFLICT (name) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  steam_id = EXCLUDED.steam_id,
  preferred_color = EXCLUDED.preferred_color,
  updated_at = NOW();

-- Verificar inserción
SELECT name, nickname, preferred_color FROM players ORDER BY name;
