# 🏰 Creación de la Base de Datos en Supabase

## ⚠️ IMPORTANTE: Este paso es OBLIGATORIO antes de usar la app

La app actualmente NO tiene tablas creadas en Supabase. Por eso ves el error:
```
"Could not find the table 'public.players' in the schema cache"
```

## 📋 Pasos para ejecutar el schema

### 1. Acceder al SQL Editor de Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: `jzrfhklkvawefjcqjbte`
3. En el menú lateral, haz clic en **"SQL Editor"**

### 2. Crear un nuevo query

1. Haz clic en **"New query"** (esquina superior izquierda)
2. Copia **TODO** el contenido del archivo `db_schema.sql` (ubicado en la raíz del proyecto)
3. Pégalo en el editor de SQL
4. Haz clic en **"Run"** (o presiona Cmd+Enter / Ctrl+Enter)

### 3. Verificar que se creó correctamente

Deberías ver un mensaje de éxito. Para verificar:

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver 3 tablas nuevas:
   - `players` - Jugadores registrados
   - `matches` - Partidas jugadas
   - `match_participants` - Relación de jugadores en cada partida

### 4. Reiniciar el servidor de desarrollo

Una vez ejecutado el SQL:

```bash
# Detén el servidor actual (Ctrl+C si está corriendo)
# Luego inicia nuevamente:
npm run dev
```

## 🎯 ¿Qué incluye este schema?

### Tabla `players`
- **Datos básicos**: nombre, nickname, avatar
- **Preferencias**: color favorito
- **Estadísticas auto-calculadas**: total de partidas, victorias, ELO rating
- **Timestamps**: fecha de creación y última actualización

### Tabla `matches`
- **Metadata del partido**: fecha, título descriptivo, mapa, modo de juego (1v1, 2v2, etc.)
- **Resultados**: equipo ganador
- **Duración**: minutos jugados (opcional)
- **Notas**: comentarios sobre la partida

### Tabla `match_participants`
- **Relación jugador-partida**: quién jugó en qué partido
- **Detalles in-game**: civilización usada, color del jugador, equipo
- **Resultado**: si fue ganador o no

### Funciones automáticas (Triggers)
- **Auto-actualización de estadísticas**: Cuando se carga una partida, las victorias y total de partidas de cada jugador se actualizan automáticamente.

## 🔐 Seguridad (RLS)

- **Lectura pública**: Cualquiera puede ver los datos (para que funcione el ranking público)
- **Escritura protegida**: Solo usuarios autenticados (admins) pueden crear/editar/borrar

## 🧪 Próximo paso

Una vez ejecutado el schema, podrás:
1. ✅ Crear jugadores desde `/admin/players`
2. ✅ Cargar partidas desde `/admin/matches/new`
3. ✅ Ver estadísticas en `/ranking`
4. ✅ Ver historial completo en `/`

## 💡 Tip Pro

Si querés empezar con datos de prueba, podés ejecutar esto DESPUÉS del schema principal:

```sql
-- Insertar jugadores de ejemplo
INSERT INTO players (name, nickname, preferred_color) VALUES
  ('Martin', 'Marti', 'Blue'),
  ('Gustavo', 'Gus', 'Red'),
  ('Santiago', 'Santi', 'Green'),
  ('Lucas', 'Luca', 'Yellow')
ON CONFLICT (name) DO NOTHING;
```

---

**¿Dudas?** Si el SQL da algún error, copiá el mensaje completo y consultame.
