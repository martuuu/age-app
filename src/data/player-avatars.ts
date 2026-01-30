// ============================================
// Player Avatar Mapping
// ============================================
// Mapeo de jugadores a sus avatares (unidades de AoE2)
// Para cambiar el avatar de un jugador, simplemente modifica el valor aquí

export const PLAYER_AVATARS: Record<string, string> = {
  // Formato: 'nickname': 'nombre-del-archivo-sin-extension'
  'Martu': 'knight',
  'Chaca': 'paladin',
  'Tata': 'crusader',
  'dany.24': 'archer',
  'Fran': 'huskarl',
  'Mati': 'cavalry',
  'Ruso': 'samurai',
  'Facu': 'warrior',
  'Chino': 'viking',
  'Bicho': 'eagle',
  'Mosca': 'cannon',
  'Zevj': 'roman',
};

// Todos los avatares disponibles
export const AVAILABLE_AVATARS = [
  'knight',
  'archer',
  'paladin',
  'samurai',
  'cannon',
  'cavalry',
  'huskarl',
  'warrior',
  'eagle',
  'viking',
  'crusader',
  'roman',
  'berserker',
] as const;

// Helper function para obtener la URL del avatar
export function getAvatarUrl(nickname: string): string {
  const avatarName = PLAYER_AVATARS[nickname] || 'knight'; // Default: knight
  return `/assets/player-icons/${avatarName}.png`;
}

// Helper function para obtener avatar aleatorio
export function getRandomAvatar(): string {
  const randomIndex = Math.floor(Math.random() * AVAILABLE_AVATARS.length);
  return AVAILABLE_AVATARS[randomIndex];
}
