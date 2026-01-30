-- ============================================
-- UPDATE: Agregar avatares a jugadores existentes
-- ============================================
-- Ejecutar en Supabase SQL Editor para actualizar avatares
-- de jugadores que ya existen en la base de datos

UPDATE players SET avatar_url = '/assets/player-icons/knight.png' WHERE nickname = 'Martu';
UPDATE players SET avatar_url = '/assets/player-icons/paladin.png' WHERE nickname = 'Chaca';
UPDATE players SET avatar_url = '/assets/player-icons/crusader.png' WHERE nickname = 'Tata';
UPDATE players SET avatar_url = '/assets/player-icons/archer.png' WHERE nickname = 'dany.24';
UPDATE players SET avatar_url = '/assets/player-icons/huskarl.png' WHERE nickname = 'Fran';
UPDATE players SET avatar_url = '/assets/player-icons/cavalry.png' WHERE nickname = 'Mati';
UPDATE players SET avatar_url = '/assets/player-icons/samurai.png' WHERE nickname = 'Ruso';
UPDATE players SET avatar_url = '/assets/player-icons/warrior.png' WHERE nickname = 'Facu';
UPDATE players SET avatar_url = '/assets/player-icons/viking.png' WHERE nickname = 'Chino';
UPDATE players SET avatar_url = '/assets/player-icons/eagle.png' WHERE nickname = 'Bicho';
UPDATE players SET avatar_url = '/assets/player-icons/cannon.png' WHERE nickname = 'Mosca';
UPDATE players SET avatar_url = '/assets/player-icons/roman.png' WHERE nickname = 'Zevj';

-- Verificar actualización
SELECT name, nickname, avatar_url FROM players ORDER BY name;
