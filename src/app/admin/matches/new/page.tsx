"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
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
  'Aztecs', 'Berbers', 'Bohemians', 'Britons', 'Bulgarians', 'Burgundians',
  'Burmese', 'Byzantines', 'Celts', 'Chinese', 'Cumans', 'Ethiopians',
  'Franks', 'Goths', 'Gurjaras', 'Hindustanis', 'Huns', 'Incas',
  'Italians', 'Japanese', 'Khmer', 'Koreans', 'Lithuanians', 'Magyars',
  'Malay', 'Malians', 'Mayans', 'Mongols', 'Persians', 'Poles',
  'Portuguese', 'Saracens', 'Sicilians', 'Slavs', 'Spanish', 'Tatars',
  'Teutons', 'Turks', 'Vietnamese', 'Vikings'
];

const MAPS = [
  'Arabia', 'Arena', 'Nomad', 'Islands', 'Hideout', 'Hill Fort',
  'Black Forest', 'Continental', 'Coastal', 'Four Lakes', 'Gold Rush'
];

const GAME_MODES = ['1v1', '2v2', '3v3', '4v4', 'FFA'];

export default function NewMatchPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [mapName, setMapName] = useState("Arabia");
  const [gameMode, setGameMode] = useState("1v1");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [winnerTeam, setWinnerTeam] = useState<1 | 2 | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const { data } = await supabase.from("players").select("id, name, preferred_color").order("name");
    if (data) setPlayers(data);
  }

  const togglePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    const existing = participants.find(p => p.player_id === playerId);
    
    if (existing) {
      if (existing.team === 1) {
        setParticipants(participants.map(p => 
          p.player_id === playerId ? { ...p, team: 2 } : p
        ));
      } else {
        setParticipants(participants.filter(p => p.player_id !== playerId));
      }
    } else {
      setParticipants([...participants, { 
        player_id: playerId, 
        team: 1, 
        civilization: "",
        player_color: player?.preferred_color || "Blue"
      }]);
    }
  };

  const updateParticipant = (playerId: string, field: keyof Participant, value: string) => {
    setParticipants(participants.map(p => 
      p.player_id === playerId ? { ...p, [field]: value } : p
    ));
  };

  async function saveMatch() {
    if (!winnerTeam) return alert("Selecciona el equipo ganador");
    if (participants.length < 2) return alert("Selecciona al menos 2 jugadores");
    
    // Validate all participants have civilization
    if (participants.some(p => !p.civilization)) {
      return alert("Todos los jugadores deben tener una civilización asignada");
    }
    
    setLoading(true);
    
    // 1. Create match
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert([{ 
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

    // 2. Add participants with winner flag
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
        <h1 className="text-3xl font-black font-outfit uppercase">Nueva Partida</h1>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Configuración</h3>
        <div className="glass-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Mapa</label>
              <select
                className="input-field w-full text-sm"
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
                className="input-field w-full text-sm"
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
              >
                {GAME_MODES.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Duración (minutos, opcional)</label>
            <input
              type="number"
              className="input-field w-full text-sm"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Ej: 35"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Equipo Ganador</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setWinnerTeam(1)}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all",
                  winnerTeam === 1 ? "bg-primary text-primary-foreground border-primary" : "glass border-white/10 opacity-50"
                )}
              >
                <Trophy size={16} /> Equipo 1
              </button>
              <button
                onClick={() => setWinnerTeam(2)}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all",
                  winnerTeam === 2 ? "bg-primary text-primary-foreground border-primary" : "glass border-white/10 opacity-50"
                )}
              >
                <Trophy size={16} /> Equipo 2
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Armar Equipos ({participants.length})</h3>
        
        {/* Teams Visualizer */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase text-primary mb-2">Equipo 1 ({team1.length})</div>
            {team1.map(p => {
              const player = players.find(pl => pl.id === p.player_id);
              return (
                <div key={p.player_id} className="text-xs bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
                  <div className="font-bold text-sm">{player?.name}</div>
                  <select
                    className="bg-black/30 text-[10px] w-full p-1.5 rounded border border-white/10 focus:outline-none focus:border-primary"
                    value={p.civilization}
                    onChange={(e) => updateParticipant(p.player_id, 'civilization', e.target.value)}
                  >
                    <option value="">Elegir civi...</option>
                    {CIVILIZATIONS.map(civ => (
                      <option key={civ} value={civ}>{civ}</option>
                    ))}
                  </select>
                  <select
                    className="bg-black/30 text-[10px] w-full p-1.5 rounded border border-white/10 focus:outline-none focus:border-primary"
                    value={p.player_color}
                    onChange={(e) => updateParticipant(p.player_id, 'player_color', e.target.value)}
                  >
                    {COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <div className="glass-card p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase text-blue-400 mb-2">Equipo 2 ({team2.length})</div>
            {team2.map(p => {
              const player = players.find(pl => pl.id === p.player_id);
              return (
                <div key={p.player_id} className="text-xs bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
                  <div className="font-bold text-sm">{player?.name}</div>
                  <select
                    className="bg-black/30 text-[10px] w-full p-1.5 rounded border border-white/10 focus:outline-none focus:border-primary"
                    value={p.civilization}
                    onChange={(e) => updateParticipant(p.player_id, 'civilization', e.target.value)}
                  >
                    <option value="">Elegir civi...</option>
                    {CIVILIZATIONS.map(civ => (
                      <option key={civ} value={civ}>{civ}</option>
                    ))}
                  </select>
                  <select
                    className="bg-black/30 text-[10px] w-full p-1.5 rounded border border-white/10 focus:outline-none focus:border-primary"
                    value={p.player_color}
                    onChange={(e) => updateParticipant(p.player_id, 'player_color', e.target.value)}
                  >
                    {COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Selection List */}
        <div className="glass-card p-2">
          <div className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-2">Toca un jugador para agregarlo</div>
          <div className="max-h-[300px] overflow-y-auto space-y-1">
            {players.map(p => {
              const part = participants.find(part => part.player_id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg transition-all text-sm",
                    part?.team === 1 ? "bg-primary/20 text-primary" : 
                    part?.team === 2 ? "bg-blue-400/20 text-blue-400" : "hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-white/20" 
                      style={{ backgroundColor: part?.player_color?.toLowerCase() || 'transparent' }}
                    />
                    <span className="font-bold">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {part?.team === 1 ? <div className="text-[9px] font-bold bg-primary text-black px-2 py-0.5 rounded">T1</div> : 
                     part?.team === 2 ? <div className="text-[9px] font-bold bg-blue-400 text-black px-2 py-0.5 rounded">T2</div> : 
                     <div className="text-[9px] opacity-40">Agregar</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md px-4">
        <button
          onClick={saveMatch}
          disabled={loading}
          className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2 shadow-2xl"
        >
          {loading ? "Guardando..." : <><Save size={20} /> Guardar Partida</>}
        </button>
      </div>
    </div>
  );
}
