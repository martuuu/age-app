"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Trophy, Trash2, CheckCircle2, Sword } from "lucide-react";
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
  id?: string;
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

export default function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [players, setPlayers] = useState<Player[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [mapName, setMapName] = useState("Arabia");
  const [gameMode, setGameMode] = useState("1v1");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [playedAt, setPlayedAt] = useState("");
  const [winnerTeam, setWinnerTeam] = useState<1 | 2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // NEW LOGIC: Target Team Selection
  const [activeTeam, setActiveTeam] = useState<1 | 2>(1);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    const { data: playersData } = await supabase.from("players").select("id, name, nickname, preferred_color").order("name");
    if (playersData) setPlayers(playersData);

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select(`
        *,
        participants:match_participants(
          id,
          player_id,
          team,
          civilization,
          player_color
        )
      `)
      .eq("id", id)
      .single();

    if (matchError || !match) {
      alert("Error al cargar partida");
      router.push("/admin/matches");
      return;
    }

    setMapName(match.map_name);
    setGameMode(match.game_mode);
    setDurationMinutes(match.duration_minutes?.toString() || "");
    setPlayedAt(new Date(match.played_at).toISOString().split('T')[0]);
    setWinnerTeam(match.winner_team);
    setParticipants(match.participants);
    setLoading(false);
  }

  const togglePlayer = (playerId: string) => {
    const existing = participants.find(p => p.player_id === playerId);
    
    if (existing) {
      if (existing.team === activeTeam) {
        setParticipants(participants.filter(p => p.player_id !== playerId));
      } else {
        setParticipants(participants.map(p => 
          p.player_id === playerId ? { ...p, team: activeTeam } : p
        ));
      }
    } else {
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

  async function updateMatch() {
    if (!winnerTeam) return alert("Selecciona el equipo ganador");
    
    if (participants.some(p => !p.civilization)) return alert("Asigna una civilización a todos los jugadores");
    
    setSaving(true);
    const { error: matchError } = await supabase
      .from("matches")
      .update({ 
        played_at: playedAt ? new Date(playedAt).toISOString() : new Date().toISOString(),
        map_name: mapName, 
        game_mode: gameMode,
        duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
        winner_team: winnerTeam 
      })
      .eq("id", id);

    if (matchError) {
      alert("Error al actualizar partida: " + matchError.message);
      setSaving(false);
      return;
    }

    await supabase.from("match_participants").delete().eq("match_id", id);

    const participantsData = participants.map(p => ({
      match_id: id,
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
      router.push("/admin/matches");
      router.refresh();
    }
    setSaving(false);
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen opacity-50">Cargando partida...</div>;

  const team1 = participants.filter(p => p.team === 1);
  const team2 = participants.filter(p => p.team === 2);

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/matches" className="p-2 glass rounded-full hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter text-white">Editar Partida</h1>
        </div>
        <button 
          onClick={async () => {
            if (confirm("¿Borrar esta partida definitivamente?")) {
              await supabase.from("matches").delete().eq("id", id);
              router.push("/admin/matches");
            }
          }}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Configuración de la Batalla</h3>
        <div className="glass-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Mapa</label>
              <select className="input-field w-full text-sm font-bold" value={mapName} onChange={(e) => setMapName(e.target.value)}>
                {MAPS.map(map => <option key={map} value={map}>{map}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Modo</label>
              <select className="input-field w-full text-sm font-bold" value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
                {GAME_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Fecha</label>
              <input type="date" className="input-field w-full text-sm font-bold" value={playedAt} onChange={(e) => setPlayedAt(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Duración (min)</label>
              <input type="number" className="input-field w-full text-sm font-bold" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Resultado de Victoria</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setWinnerTeam(1)} className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 font-black transition-all", winnerTeam === 1 ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "glass border-white/10 opacity-50")}>
                <Trophy size={16} /> EQUIPO 1
              </button>
              <button onClick={() => setWinnerTeam(2)} className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 font-black transition-all", winnerTeam === 2 ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "glass border-white/10 opacity-50")}>
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
             <button onClick={() => setActiveTeam(1)} className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all", activeTeam === 1 ? "bg-primary text-black" : "glass text-muted-foreground")}>T1</button>
             <button onClick={() => setActiveTeam(2)} className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all", activeTeam === 2 ? "bg-blue-500 text-white" : "glass text-muted-foreground")}>T2</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={cn("glass-card p-3 space-y-2 transition-all", activeTeam === 1 ? "border-primary/50 bg-primary/5" : "opacity-60")}>
            <div className="text-[10px] font-black uppercase text-primary mb-2">Equipo 1</div>
            {team1.map(p => {
              const player = players.find(pl => pl.id === p.player_id);
              return (
                <div key={p.player_id} className="text-xs bg-black/40 p-2 rounded-lg border border-white/5 space-y-2 relative group">
                  <button onClick={() => togglePlayer(p.player_id)} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-destructive text-white rounded-full p-0.5"><ArrowLeft size={10} className="rotate-45" /></button>
                  <div className="font-bold text-[11px] truncate">{player?.nickname || player?.name}</div>
                  <select className="bg-black/60 text-[9px] w-full p-1.5 rounded border border-white/10" value={p.civilization} onChange={(e) => updateParticipant(p.player_id, 'civilization', e.target.value)}>
                    <option value="">Civi...</option>
                    {CIVILIZATIONS.map(civ => <option key={civ} value={civ}>{civ}</option>)}
                  </select>
                  <div className="flex gap-1">
                    {COLORS.map(c => <button key={c} onClick={() => updateParticipant(p.player_id, 'player_color', c)} className={cn("w-3 h-3 rounded-full border border-white/10", p.player_color === c ? "ring-2 ring-white scale-110" : "opacity-40")} style={{ backgroundColor: c.toLowerCase() }} />)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={cn("glass-card p-3 space-y-2 transition-all", activeTeam === 2 ? "border-blue-500/50 bg-blue-500/5" : "opacity-60")}>
            <div className="text-[10px] font-black uppercase text-blue-400 mb-2">Equipo 2</div>
            {team2.map(p => {
              const player = players.find(pl => pl.id === p.player_id);
              return (
                <div key={p.player_id} className="text-xs bg-black/40 p-2 rounded-lg border border-white/5 space-y-2 relative group">
                  <button onClick={() => togglePlayer(p.player_id)} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-destructive text-white rounded-full p-0.5"><ArrowLeft size={10} className="rotate-45" /></button>
                  <div className="font-bold text-[11px] truncate">{player?.nickname || player?.name}</div>
                  <select className="bg-black/60 text-[9px] w-full p-1.5 rounded border border-white/10" value={p.civilization} onChange={(e) => updateParticipant(p.player_id, 'civilization', e.target.value)}>
                    <option value="">Civi...</option>
                    {CIVILIZATIONS.map(civ => <option key={civ} value={civ}>{civ}</option>)}
                  </select>
                  <div className="flex gap-1">
                    {COLORS.map(c => <button key={c} onClick={() => updateParticipant(p.player_id, 'player_color', c)} className={cn("w-3 h-3 rounded-full border border-white/10", p.player_color === c ? "ring-2 ring-white scale-110" : "opacity-40")} style={{ backgroundColor: c.toLowerCase() }} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-4 space-y-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-[10px] uppercase font-black text-muted-foreground tracking-widest text-white">Selector de Jugadores</h4>
            <p className="text-[9px] text-muted-foreground/60">Agregando al <span className={cn("font-bold underline", activeTeam === 1 ? "text-primary" : "text-blue-400")}>Equipo {activeTeam}</span></p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {players.map(p => {
              const part = participants.find(part => part.player_id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl transition-all border text-left",
                    part?.team === 1 ? "bg-primary/20 border-primary/40 text-primary" : 
                    part?.team === 2 ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : 
                    "glass border-white/5 hover:border-white/20 active:scale-95"
                  )}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black truncate text-white">{p.nickname || p.name}</span>
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
          onClick={updateMatch}
          disabled={saving}
          className="btn-primary w-full h-16 text-lg font-black flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(234,179,8,0.3)]"
        >
          {saving ? "Actualizando Crónica..." : <><Save size={24} /> GUARDAR CAMBIOS</>}
        </button>
      </div>
    </div>
  );
}
