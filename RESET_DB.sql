-- ============================================
-- RESET DATABASE 🏰
-- ============================================

-- Purgar toda la data de las tablas públicas.
-- Se usa DROP CASCADE para asegurar que no queden rastros de políticas o triggers viejos.

DROP TABLE IF EXISTS match_participants CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
