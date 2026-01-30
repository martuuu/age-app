"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Trophy, Users, Sword, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  nickname: string;
  preferred_color: string;
}

interface Participant {
  player_id: string;
  team: 1 | 2;
  civilization: string;
  player_color: string;
}

const COLORS = ['Blue', 'Red', 'Green', 'Yellow', 'Cyan', 'Purple', 'Gray', 'Orange'];

const CIVILIZATIONS = [
  'Armenians', 'Aztecs', 'Bengalis', 'Berbers', 'Bohemians', 'Britons', 'Bulgarians', 'Burgundians',
  'Burmese', 'Byzantines', 'Celts', 'Chinese', 'Cumans', 'Dravidians', 'Ethiopians', 'Franks',
  'Georgians', 'Goths', 'Gurjaras', 'Hindustanis', 'Huns', 'Inca', 'Italians', 'Japanese',
  'Jurchens', 'Khitans', 'Khmer', 'Koreans', 'Lithuanians', 'Magyars', 'Malay', 'Malians',
  'Mapuche', 'Maya', 'Mongols', 'Muisca', 'Persians', 'Poles', 'Portuguese', 'Romans',
  'Saracens', 'Shu', 'Sicilians', 'Slavs', 'Spanish', 'Tatars', 'Teutons', 'Tupi',
  'Turks', 'Vietnamese', 'Vikings', 'Wei', 'Wu'
];

const MAPS = [
  'Arabia', 'Arena', 'Nomad', 'Islands', 'Migration', '4 Lakes', 'Akropolis',
  'Archipelago', 'Baltic', 'Black Forest', 'Coastal', 'Continental', 'Crater Lake',
  'El Dorado', 'Fortress', 'Ghost Lake', 'Gold Rush', 'Golden Pit', 'Golden Swamp',
  'Hideout', 'Highlands', 'Land Madness', 'Mediterranean', 'Mongolia', 'Oasis',
  'Rivers', 'Salt Marsh', 'Scandinavia', 'Sokotra', 'Team Islands', 'Valley',
  'Yucatan', 'Otro'
];

const GAME_MODES = ['1v1', '2v2', '3v3', '4v4', 'FFA'];

export default function NewMatchPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [mapName, setMapName] = useState("Arabia");
  const [gameMode, setGameMode] = useState("1v1");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [playedAt, setPlayedAt] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [winnerTeam, setWinnerTeam] = useState<1 | 2 | null>(null);
  const [loading, setLoading] = useState(false);
  
  // NEW LOGIC: Target Team Selection
  const [activeTeam, setActiveTeam] = useState<1 | 2>(1);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchPlayers() {
      const { data } = await supabase.from("players").select("id, name, nickname, preferred_color").order("name");
      if (data) setPlayers(data);
    }
    fetchPlayers();
  }, []);

  const togglePlayer = (playerId: string) => {
    const existing = participants.find(p => p.player_id === playerId);
    
    if (existing) {
      // If clicking a player already in the active team, remove them
      if (existing.team === activeTeam) {
        setParticipants(participants.filter(p => p.player_id !== playerId));
      } else {
        // If clicking a player from the OTHER team, move them to ACTIVE team
        setParticipants(participants.map(p => 
          p.player_id === playerId ? { ...p, team: activeTeam } : p
        ));
      }
    } else {
      // Add new player to active team
      const player = players.find(p => p.id === playerId);
      setParticipants([...participants, { 
        player_id: playerId, 
        team: activeTeam, 
        civilization: "",
        player_color: player?.preferred_color || "Blue"
      }]);
    }
  };

  const updateParticipant = (playerId: string, field: keyof Participant, value: any) => {
    setParticipants(participants.map(p => 
      p.player_id === playerId ? { ...p, [field]: value } : p
    ));
  };

  async function saveMatch() {
    if (!winnerTeam) return alert("Selecciona el equipo ganador (necesario para las estadísticas)");
    
    // Solo validamos civilizaciones si hay participantes, para evitar registros rotos en stats
    if (participants.some(p => !p.civilization)) {
      return alert("Asigna una civilización a todos los jugadores seleccionados");
    }
    
    setLoading(true);
    
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert([{ 
        played_at: playedAt ? new Date(playedAt).toISOString() : new Date().toISOString(),
        map_name: mapName, 
        game_mode: gameMode,
        duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
        winner_team: winnerTeam 
      }])
      .select()
      .single();

    if (matchError) {
      alert("Error al crear partida: " + matchError.message);
      setLoading(false);
      return;
    }

    const participantsData = participants.map(p => ({
      match_id: match.id,
      player_id: p.player_id,
      team: p.team,
      civilization: p.civilization,
      player_color: p.player_color,
      is_winner: p.team === winnerTeam
    }));

    const { error: partError } = await supabase.from("match_participants").insert(participantsData);
    
    if (partError) {
      alert("Error al cargar participantes: " + partError.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  }

  const team1 = participants.filter(p => p.team === 1);
  const team2 = participants.filter(p => p.team === 2);

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 glass rounded-full hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter">Nueva Partida</h1>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Configuración del Campo</h3>
        <div className="glass-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Mapa</label>
              <select
                className="input-field w-full text-sm font-bold"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
              >
                {MAPS.map(map => (
                  <option key={map} value={map}>{map}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Modo</label>
              <select
                className="input-field w-full text-sm font-bold"
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
              >
                {GAME_MODES.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Fecha de Batalla</label>
              <input
                type="date"
                className="input-field w-full text-sm font-bold"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Duración (min)</label>
              <input
                type="number"
                className="input-field w-full text-sm font-bold"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="Ej: 45"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Victoria para</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setWinnerTeam(1)}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 font-black transition-all",
                  winnerTeam === 1 ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "glass border-white/10 opacity-50"
                )}
              >
                <Trophy size={16} /> EQUIPO 1
              </button>
              <button
                onClick={() => setWinnerTeam(2)}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 font-black transition-all",
                  winnerTeam === 2 ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "glass border-white/10 opacity-50"
                )}
              >
                <Trophy size={16} /> EQUIPO 2
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Formación de Equipos</h3>
          <div className="flex gap-2">
             <button 
              onClick={() => setActiveTeam(1)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
                activeTeam === 1 ? "bg-primary text-black" : "glass text-muted-foreground"
              )}
             >
               Cargar Equipo 1
             </button>
             <button 
              onClick={() => setActiveTeam(2)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
                activeTeam === 2 ? "bg-blue-500 text-white" : "glass text-muted-foreground"
              )}
             >
               Cargar Equipo 2
             </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Team 1 Column */}
          <div className={cn(
            "glass-card p-3 space-y-2 transition-all duration-300",
            activeTeam === 1 ? "border-primary/50 bg-primary/5" : "opacity-60"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase text-primary tracking-widest">Equipo 1</div>
              {activeTeam === 1 && <span className="text-[8px] bg-primary text-black px-1 rounded animate-pulse">ACTIVO</span>}
            </div>
            {team1.length === 0 && <div className="text-[9px] text-muted-foreground text-center py-4 italic">Sin jugadores</div>}
            {team1.map(p => {
              const player = players.find(pl => pl.id === p.player_id);
              return (
                <div key={p.player_id} className="text-xs bg-black/40 p-2 rounded-lg border border-white/5 space-y-2 relative group">
                   <button 
                    onClick={() => togglePlayer(p.player_id)}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-destructive text-white rounded-full p-0.5"
                  >
                    <ArrowLeft size={10} className="rotate-45" />
                  </button>
                  <div className="font-bold text-[11px] truncate">{player?.nickname || player?.name}</div>
                  <select
                    className="bg-black/60 text-[9px] w-full p-1.5 rounded border border-white/10 focus:outline-none focus:border-primary"
                    value={p.civilization}
                    onChange={(e) => updateParticipant(p.player_id, 'civilization', e.target.value)}
                  >
                    <option value="">Civi...</option>
                    {CIVILIZATIONS.map(civ => (
                      <option key={civ} value={civ}>{civ}</option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    {COLORS.slice(0, 4).map(c => (
                      <button 
                        key={c}
                        onClick={() => updateParticipant(p.player_id, 'player_color', c)}
                        className={cn("w-3 h-3 rounded-full border border-white/10", p.player_color === c ? "ring-2 ring-white scale-110" : "opacity-40")}
                        style={{ backgroundColor: c.toLowerCase() }}
                      />
                    ))}
                    {COLORS.slice(4).map(c => (
                      <button 
                        key={c}
                        onClick={() => updateParticipant(p.player_id, 'player_color', c)}
                        className={cn("w-3 h-3 rounded-full border border-white/10", p.player_color === c ? "ring-2 ring-white scale-110" : "opacity-40")}
                        style={{ backgroundColor: c.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Team 2 Column */}
          <div className={cn(
            "glass-card p-3 space-y-2 transition-all duration-300",
            activeTeam === 2 ? "border-blue-500/50 bg-blue-500/5" : "opacity-60"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Equipo 2</div>
              {activeTeam === 2 && <span className="text-[8px] bg-blue-500 text-white px-1 rounded animate-pulse">ACTIVO</span>}
            </div>
            {team2.length === 0 && <div className="text-[9px] text-muted-foreground text-center py-4 italic">Sin jugadores</div>}
            {team2.map(p => {
              const player = players.find(pl => pl.id === p.player_id);
              return (
                <div key={p.player_id} className="text-xs bg-black/40 p-2 rounded-lg border border-white/5 space-y-2 relative group">
                  <button 
                    onClick={() => togglePlayer(p.player_id)}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-destructive text-white rounded-full p-0.5"
                  >
                    <ArrowLeft size={10} className="rotate-45" />
                  </button>
                  <div className="font-bold text-[11px] truncate">{player?.nickname || player?.name}</div>
                  <select
                    className="bg-black/60 text-[9px] w-full p-1.5 rounded border border-white/10 focus:outline-none focus:border-primary"
                    value={p.civilization}
                    onChange={(e) => updateParticipant(p.player_id, 'civilization', e.target.value)}
                  >
                    <option value="">Civi...</option>
                    {CIVILIZATIONS.map(civ => (
                      <option key={civ} value={civ}>{civ}</option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    {COLORS.map(c => (
                      <button 
                        key={c}
                        onClick={() => updateParticipant(p.player_id, 'player_color', c)}
                        className={cn("w-3 h-3 rounded-full border border-white/10", p.player_color === c ? "ring-1 ring-white scale-110" : "opacity-40")}
                        style={{ backgroundColor: c.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Selector Grid */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Lista de Jugadores</h4>
            <p className="text-[9px] text-muted-foreground/60">Presiona para agregar al <span className={cn("font-bold underline", activeTeam === 1 ? "text-primary" : "text-blue-400")}>Equipo {activeTeam}</span></p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {players.map(p => {
              const part = participants.find(part => part.player_id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl transition-all border text-left group",
                    part?.team === 1 ? "bg-primary/20 border-primary/40 text-primary" : 
                    part?.team === 2 ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : 
                    "glass border-white/5 hover:border-white/20 active:scale-95"
                  )}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black truncate">{p.nickname || p.name}</span>
                    <span className="text-[8px] opacity-40 uppercase tracking-tighter">{part ? `Equipo ${part.team}` : 'Libre'}</span>
                  </div>
                  {part && <CheckCircle2 size={12} className="shrink-0 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md px-4 z-[60]">
        <button
          onClick={saveMatch}
          disabled={loading}
          className="btn-primary w-full h-16 text-lg font-black flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(234,179,8,0.3)] hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
        >
          {loading ? "Registrando Crónica..." : <><Sword size={24} /> REGISTRAR BATALLA</>}
        </button>
      </div>
    </div>
  );
}
