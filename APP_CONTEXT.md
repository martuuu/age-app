# 🏰 AOE2 Match History App - Documento de Contexto

## 📋 Descripción General

Esta aplicación es un **historial de partidas de Age of Empires 2** diseñada para un grupo de amigos. Permite registrar partidas, ver estadísticas de jugadores y llevar un ranking competitivo entre el grupo.

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16.1.5 | Framework React con App Router |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4.x | Estilos (con `@tailwindcss/postcss`) |
| **Supabase** | 0.8.0 (SSR) | Backend, Auth, Database |
| **Lucide React** | 0.563.0 | Iconografía |
| **date-fns** | 4.1.0 | Formateo de fechas |
| **Framer Motion** | 12.29.2 | Animaciones |
| **React Hook Form + Zod** | Latest | Manejo de formularios y validación |

---

## 🗂️ Estructura del Proyecto

```
aoe-app/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── page.tsx            # Home - Historial de partidas
│   │   ├── layout.tsx          # Layout principal con Navbar
│   │   ├── globals.css         # Estilos globales + tema AoE2
│   │   ├── admin/              # Panel de administración
│   │   │   ├── page.tsx        # Dashboard admin
│   │   │   ├── players/        # CRUD de jugadores
│   │   │   └── matches/new/    # Crear nueva partida
│   │   ├── login/              # Autenticación admin
│   │   ├── players/[id]/       # Perfil de jugador
│   │   ├── ranking/            # Tabla de clasificación
│   │   └── wiki/               # Wiki de civilizaciones (WIP)
│   ├── components/
│   │   ├── match-card.tsx      # Componente de partida
│   │   ├── navbar.tsx          # Navegación inferior (mobile-first)
│   │   └── ui/                 # Componentes UI reutilizables
│   ├── lib/
│   │   ├── supabase/           # Configuración de Supabase
│   │   │   ├── client.ts       # Cliente para Browser
│   │   │   ├── server.ts       # Cliente para Server Components
│   │   │   └── middleware.ts   # Middleware de autenticación
│   │   └── utils.ts            # Utilidades (cn helper)
│   └── middleware.ts           # Middleware global
├── db_schema.sql               # Schema completo de la DB
├── RESET_DB.sql                # Script para limpiar la DB
├── players_seed.sql            # Seed de jugadores originales
└── matches_seed_template.json  # Template para cargar partidas por seed
```

---

## 🗄️ Modelo de Base de Datos

### Tabla: `players`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `name` | TEXT | Nombre completo (único) |
| `nickname` | TEXT | Nick de Steam / Apodo |
| `email` | TEXT | Email (para futura autenticación) |
| `steam_id` | TEXT | ID de Steam (para API) |
| `preferred_color` | TEXT | Color favorito en partidas |
| `avatar_url` | TEXT | URL de avatar |
| `elo_rating` | INTEGER | Rating ELO (default: 1000) |
| `total_matches` | INTEGER | Total de partidas (auto) |
| `total_wins` | INTEGER | Total de victorias (auto) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

### Tabla: `matches`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `played_at` | TIMESTAMP | Fecha de la partida |
| `map_name` | TEXT | Nombre del mapa |
| `game_mode` | TEXT | Modo de juego (1v1, 2v2, etc.) |
| `duration_minutes` | INTEGER | Duración en minutos |
| `winner_team` | INTEGER | Equipo ganador (1 o 2) |
| `notes` | TEXT | Notas adicionales |
| `created_by` | UUID | Usuario que creó el registro |
| `created_at` | TIMESTAMP | Fecha de creación del registro |

### Tabla: `match_participants`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `match_id` | UUID | FK a matches |
| `player_id` | UUID | FK a players |
| `team` | INTEGER | Equipo (1 o 2) |
| `player_color` | TEXT | Color usado en la partida |
| `civilization` | TEXT | Civilización usada |
| `is_winner` | BOOLEAN | Si ganó la partida |

### Triggers Automáticos
- **`update_player_stats`**: Actualiza `total_matches` y `total_wins` al insertar/actualizar participantes
- **`delete_empty_matches`**: Elimina partidas que quedan sin participantes

---

## 🔐 Autenticación y Autorización

### Roles
1. **Admin**: Usuario autenticado con Supabase Auth
   - Puede crear/editar/eliminar jugadores y partidas
   - Acceso a `/admin/*`

2. **Jugador** (futuro): Usuario con cuenta asignada
   - Puede ver su perfil y estadísticas
   - Puede vincular su cuenta de Steam
   - NO puede crear/editar partidas

3. **Público**: Sin autenticación
   - Puede ver historial, ranking, perfiles
   - Solo lectura

### Row Level Security (RLS)
- **SELECT**: Público para todas las tablas
- **INSERT/UPDATE/DELETE**: Solo usuarios autenticados

---

## 🎨 Sistema de Diseño

### Colores (AoE2 Theme)
```css
--color-background: oklch(0.08 0 0);        /* Dark background */
--color-foreground: oklch(0.9 0.02 80);     /* Antique white */
--color-primary: oklch(0.75 0.15 85);       /* Rich gold */
--color-secondary: oklch(0.25 0.08 240);    /* Deep royal blue */
--color-accent: oklch(0.7 0.15 40);         /* Warm bronze */
```

### Colores de Jugadores (AoE2 Original)
- Blue, Red, Green, Yellow, Cyan, Purple, Gray, Orange

### Componentes CSS Personalizados
- `.glass`: Efecto glassmorphism
- `.glass-card`: Tarjeta con glassmorphism + hover
- `.aoe-gradient`: Fondo premium con textura de piedra
- `.btn-primary`: Botón dorado principal
- `.input-field`: Campo de input estilizado

### Tipografía
- **Outfit**: Títulos y headers (bold, uppercase)
- **Inter**: Texto de cuerpo

---

## ⚠️ Issues Conocidos y TODOs

### 🔴 Críticos (Bloquean uso productivo)
1. ~~**CRUD incompleto**: Falta edición de jugadores y partidas~~
2. ~~**Fecha de partida**: No se puede seleccionar fecha (siempre usa la actual)~~

### 🟡 Mejoras UX/UI
1. ~~**Home vacío**: Mejorado con acciones rápidas y estadísticas~~
2. ~~**Wiki page**: Ahora dinámica con datos reales y diseño premium~~
3. **Filtros**: El botón de filtro en Home aún es estético
4. **Responsive**: Optimizado para mobile, aceptable en desktop

### 🟢 Nice to Have
1. ~~**Enlaces Externos**: Links directos a AoE2Insights y Steam en perfiles~~
2. **Gráficos**: Charts de estadísticas por jugador (Framer Motion / Recharts)
3. **Predictor**: ML para predecir resultados
4. **Export**: Exportar datos a PDF/Excel
5. **ELO dinámico**: Cálculo real post-partida

---

## 📊 Métricas de Civilizaciones AoE2

### Lista Completa (40 civilizaciones)
```
Aztecs, Berbers, Bohemians, Britons, Bulgarians, Burgundians,
Burmese, Byzantines, Celts, Chinese, Cumans, Ethiopians,
Franks, Goths, Gurjaras, Hindustanis, Huns, Incas,
Italians, Japanese, Khmer, Koreans, Lithuanians, Magyars,
Malay, Malians, Mayans, Mongols, Persians, Poles,
Portuguese, Saracens, Sicilians, Slavs, Spanish, Tatars,
Teutons, Turks, Vietnamese, Vikings
```

### Mapas Disponibles
```
Arabia, Arena, Nomad, Islands, Hideout, Hill Fort,
Black Forest, Continental, Coastal, Four Lakes, Gold Rush
```

---

## 🚀 Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint

# Reset de DB (ejecutar en Supabase SQL Editor)
-- Copiar contenido de RESET_DB.sql

# Seed de jugadores (ejecutar en Supabase SQL Editor)
-- Copiar contenido de players_seed.sql
```

---

## 🔮 Roadmap

### Fase 1: Core Functionality ✅
- [x] Schema DB completo
- [x] Login admin
- [x] CRUD Players
- [x] CRUD Matches con fecha seleccionable
- [x] Historial de partidas
- [x] Ranking básico
- [x] Perfiles de jugador

### Fase 2: Estadísticas Avanzadas
- [ ] Gráficos interactivos
- [ ] Win rate por civilización
- [ ] Mapas de calor (mejores mapas)
- [ ] Racha de victorias
- [ ] Comparación 1v1 entre jugadores

### Fase 3: Integración Steam
- [ ] Conexión con Steam API
- [ ] Importar stats de aoe2insights.com
- [ ] Sincronizar avatares/perfiles

### Fase 4: Features Premium
- [ ] Sistema de ELO dinámico
- [ ] Predictor de resultados
- [ ] Achievements/Logros
- [ ] Exportar a PDF/Excel

---

## 👥 Jugadores Originales del Grupo

| Nombre | Nickname (Steam) | Color Favorito |
|--------|------------------|----------------|
|- **Martu** (Martuuu89) - Blue
- **chaquinha** (chaquinha) - Red
- **Tata** (martin.decharras) - Green
- **dany.24** (dany.24) - Yellow
- **francoollearo** (francoollearo) - Cyan
- **Mati** (ML16798) - Purple
- **Ruso** (Ruso) - Orange
- **Facu** (juanfacundomena) - Gray
- **chino** (chino) - Blue
- **garciagamero.r** (garciagamero.r) - Red
- **Mosca** (Mosca) - Green
- **Zevj** (Zevj) - Yellow |
| Seba | Zevj | Yellow |

---

**Última actualización**: 2026-01-29
**Estado**: ✅ PRODUCTIVO - Listo para usar con funcionalidades core
