# 🏰 Integración Completa de Supabase - Age of Empires 2 App

## ✅ Estado Actual

### Base de Datos (Schema SQL)
- ✅ Schema completo creado en `db_schema.sql`
- ✅ 3 tablas principales: `players`, `matches`, `match_participants`
- ✅ Campos ampliados para estadísticas completas
- ✅ Triggers automáticos para actualizar stats de jugadores
- ✅ Row Level Security (RLS) configurado

### Frontend Actualizado
- ✅ Página de login funcionando (`/login`)
- ✅ Panel admin (`/admin`)
- ✅ CRUD de jugadores (`/admin/players`)
- ✅ Creación de partidas con todos los campos (`/admin/matches/new`)

---

## 📋 Próximos Pasos Obligatorios

### 1. Ejecutar el Schema en Supabase

**IMPORTANTE**: La app NO funcionará hasta que ejecutes este paso.

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: `jzrfhklkvawefjcqjbte`
3. Click en **"SQL Editor"** (menú lateral)
4. Click en **"New query"**
5. Copia TODO el contenido de `db_schema.sql`
6. Pégalo y haz click en **"Run"**

**Verificación**: En "Table Editor" deberías ver 3 tablas nuevas.

### 2. Verificar Variables de Entorno

Tu archivo `.env.local` debe tener:

```env
DIRECT_URL="postgresql://postgres:Olimpo.2013aA@db.jzrfhklkvawefjcqjbte.supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres.jzrfhklkvawefjcqjbte:Olimpo.2013aA@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://jzrfhklkvawefjcqjbte.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<tu-anon-key-aqui>"
```

⚠️ **Falta la ANON_KEY**: Buscala en Supabase Dashboard → Settings → API

### 3. Reiniciar el Servidor

```bash
npm run dev
```

---

## 🎯 Funcionalidades Implementadas

### Gestión de Jugadores (`/admin/players`)
- ✅ Crear jugadores con: nombre, nickname, color favorito
- ✅ Ver lista completa de jugadores
- ✅ Eliminar jugadores
- ✅ Stats auto-calculados (total partidas, victorias)

**Campos capturados:**
- Nombre completo
- Nickname/Apodo
- Color favorito (Blue, Red, Green, Yellow, Cyan, Purple, Gray, Orange)

### Creación de Partidas (`/admin/matches/new`)
- ✅ Selector de mapa (Arabia, Arena, Nomad, etc.)
- ✅ Modo de juego (1v1, 2v2, 3v3, 4v4, FFA)
- ✅ Duración en minutos (opcional)
- ✅ Asignación de equipos (Team 1 vs Team 2)
- ✅ Selector de civilización por jugador (40+ civis)
- ✅ Selector de color por jugador
- ✅ Indicador de equipo ganador

**Campos capturados por partida:**
- Mapa jugado
- Modo de juego
- Duración (minutos)
- Equipo ganador (1 o 2)

**Campos capturados por jugador en partida:**
- Civilización usada
- Color del jugador (puede ser diferente al favorito)
- Equipo asignado (1 o 2)
- Si fue ganador o no (auto-calculado)

### Estadísticas Auto-Generadas
Gracias al trigger en la DB, cada vez que se carga una partida:
- ✅ Se actualiza `total_matches` de cada jugador
- ✅ Se actualiza `total_wins` de ganadores
- ✅ Campo `updated_at` se modifica automáticamente

---

## 🔮 Páginas Faltantes (Próximas Tareas)

### Homepage (`/`)
**Estado actual**: Muestra un empty state
**Necesita**:
- Historial completo de partidas (ordenadas por fecha reciente)
- Ver detalles de cada partida: mapa, equipos, civilizaciones, ganador
- Indicador visual de quién ganó (trofeo, badge, etc.)

### Ranking (`/ranking`)
**Estado actual**: Estructura básica
**Necesita**:
- Tabla de jugadores ordenados por:
  - Total victorias
  - ELO rating
  - Win rate (%)
- Tarjetas con estadísticas individuales:
  - Civilización más usada
  - Mapa con mejor win rate
  - Racha de victorias
  - Color más usado

### Perfil de Jugador (`/players/[id]`)
**Estado**: NO EXISTE AÚN
**Necesita**:
- Vista detallada de un jugador individual
- Gráfico de win rate por civilización
- Historial de partidas del jugador
- Estadísticas avanzadas:
  - Win rate por mapa
  - Compañeros de equipo frecuentes
  - Civilizaciones favoritas
  - Racha actual

### Historial de Partidas (`/matches` o integrado en `/`)
**Necesita**:
- Lista completa paginada
- Filtros:
  - Por jugador
  - Por mapa
  - Por civilización
  - Por fecha
- Detalles de cada match al hacer click

---

## 🎨 Mejoras Visuales Pendientes

### Diseño General
- ✅ Background premium con textura de piedra
- ✅ Animación de brasas flotantes
- ⚠️ Mobile: fondo muy oscuro, dificulta lectura (revisar contraste)

### Componentes Específicos
- [ ] Badges para civilizaciones (iconos pequeños)
- [ ] Indicadores de color (círculos de colores en listas)
- [ ] Iconos de mapas
- [ ] Trofeos/medallas para ganadores
- [ ] Gráficos de estadísticas (usar Chart.js o Recharts)

---

## 🔧 Queries SQL Útiles

### Ver todas las partidas con detalles
```sql
SELECT 
  m.id,
  m.map_name,
  m.game_mode,
  m.played_at,
  m.winner_team,
  p.name as player_name,
  mp.civilization,
  mp.player_color,
  mp.team,
  mp.is_winner
FROM matches m
JOIN match_participants mp ON m.id = mp.match_id
JOIN players p ON mp.player_id = p.id
ORDER BY m.played_at DESC;
```

### Ranking de jugadores
```sql
SELECT 
  name,
  total_matches,
  total_wins,
  ROUND((total_wins::float / NULLIF(total_matches, 0)) * 100, 2) as win_rate,
  elo_rating
FROM players
WHERE total_matches > 0
ORDER BY total_wins DESC, win_rate DESC;
```

### Civilización más usada por jugador
```sql
SELECT 
  p.name,
  mp.civilization,
  COUNT(*) as times_used
FROM match_participants mp
JOIN players p ON mp.player_id = p.id
GROUP BY p.id, p.name, mp.civilization
ORDER BY p.name, times_used DESC;
```

---

## 🚨 Errores Comunes y Soluciones

### Error: "Could not find the table 'public.players'"
**Causa**: No ejecutaste el schema SQL en Supabase
**Solución**: Seguir "Paso 1" de este documento

### Error: "Supabase credentials missing. UI is in mock mode."
**Causa**: Falta `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local`
**Solución**: Agregar la clave desde Supabase Dashboard → Settings → API

### Error: Login no funciona
**Causa**: Usuario no creado en Supabase Auth
**Solución**: Dashboard → Authentication → Users → Add user

### Error: "Unable to acquire lock"
**Causa**: Otra instancia de Next.js corriendo
**Solución**: 
```bash
pkill -f next
npm run dev
```

---

## 📊 Métricas de Éxito

Una vez todo esté funcionando, podrás:
- [x] Crear jugadores con sus preferencias
- [x] Cargar partidas completas con todos los detalles
- [ ] Ver historial completo en homepage
- [ ] Ver ranking actualizado automáticamente
- [ ] Filtrar estadísticas por jugador/mapa/civi
- [ ] Exportar datos para análisis externos

---

## 🎯 Roadmap Sugerido

### Fase 1: Core Functionality (ACTUAL)
- [x] Schema DB
- [x] Login admin
- [x] CRUD Players
- [x] CRUD Matches
- [ ] Historial de partidas
- [ ] Ranking básico

### Fase 2: Estadísticas Avanzadas
- [ ] Perfiles de jugador
- [ ] Gráficos interactivos
- [ ] Win rate por civilización
- [ ] Mapas de calor (mejores mapas)

### Fase 3: Features Premium
- [ ] Sistema de ELO dinámico (cálculo real post-partida)
- [ ] Predictor de resultados (ML básico)
- [ ] Achievements/Logros
- [ ] Comparación 1v1 entre jugadores
- [ ] Exportar a PDF/Excel

---

**Última actualización**: 2026-01-27
**Estado**: ⚠️ EN CONFIGURACIÓN - Requiere ejecutar schema SQL
