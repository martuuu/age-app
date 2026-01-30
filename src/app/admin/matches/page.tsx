"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Trash2, Pencil, Calendar, Loader2, Sword, Map, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  team: number;
  civilization: string;
  player_color: string;
  is_winner: boolean;
  player: {
    id: string;
    name: string;
    nickname?: string;
  };
}

interface Match {
  id: string;
  played_at: string;
  map_name: string;
  game_mode: string;
  duration_minutes?: number;
  winner_team: number;
  participants: Participant[];
}

export default function MatchesAdminPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("matches")
        .select(`
          *,
          participants:match_participants(
            id,
            team,
            civilization,
            player_color,
            is_winner,
            player:players(id, name, nickname)
          )
        `)
        .order("played_at", { ascending: false });

      if (fetchError) throw fetchError;
      setMatches(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMatch(id: string) {
    if (confirm("¿Seguro que quieres eliminar esta partida? Esta acción no se puede deshacer.")) {
      const { error: delErr } = await supabase.from("matches").delete().eq("id", id);
      if (delErr) {
        alert("Error al eliminar: " + delErr.message);
      } else {
        fetchMatches();
      }
    }
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 glass rounded-full hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter">Gestión <span className="text-primary italic">Partidas</span></h1>
        </div>
        <Link
          href="/admin/matches/new"
          className="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          <Plus size={24} strokeWidth={3} />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
          <Loader2 className="animate-spin" size={32} />
          <div className="text-[10px] font-black uppercase tracking-widest">Sincronizando Archivos...</div>
        </div>
      ) : matches.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="text-muted-foreground/30" size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-xl font-outfit uppercase">Biblioteca Vacía</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">No se han registrado batallas todavía.</p>
          </div>
          <Link href="/admin/matches/new" className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-xs tracking-[0.2em]">
            <Sword size={14} /> Registrar Primera
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{matches.length} REGISTROS</p>
          </div>
          
          <div className="grid gap-4">
            {matches.map((match) => {
              const team1 = match.participants.filter(p => p.team === 1);
              const team2 = match.participants.filter(p => p.team === 2);
              
              return (
                <div key={match.id} className="glass-card p-5 space-y-4 border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-xl font-outfit uppercase tracking-tight text-white">{match.map_name}</span>
                        <div className="text-[9px] font-black bg-white/10 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-tighter opacity-60">{match.game_mode}</div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Calendar size={12} className="text-primary/60" /> {format(new Date(match.played_at), "d MMM, yyyy", { locale: es })}</span>
                        {match.duration_minutes && <span>• {match.duration_minutes} MIN</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/matches/${match.id}`}
                        className="p-2.5 glass rounded-xl text-muted-foreground hover:text-primary transition-all active:scale-90"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => deleteMatch(match.id)}
                        className="p-2.5 glass rounded-xl text-muted-foreground hover:text-destructive transition-all active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={cn(
                      "p-3 rounded-2xl border transition-all",
                      match.winner_team === 1 
                        ? "bg-primary/10 border-primary/30 shadow-[0_4px_15px_rgba(234,179,8,0.1)]" 
                        : "bg-black/20 border-white/5 opacity-50 grayscale"
                    )}>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center justify-between">
                        T1 {match.winner_team === 1 && <span className="text-primary">🏆</span>}
                      </div>
                      <div className="space-y-2">
                        {team1.map((p, i) => (
                          <div key={i} className="text-[11px] font-bold flex items-center gap-2 truncate">
                            <div className="w-2 h-2 rounded-full shadow-sm shrink-0" style={{ backgroundColor: p.player_color }} />
                            <span className="truncate">{p.player.nickname || p.player.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={cn(
                      "p-3 rounded-2xl border transition-all",
                      match.winner_team === 2 
                        ? "bg-blue-500/10 border-blue-500/30 shadow-[0_4px_15px_rgba(59,130,246,0.1)]" 
                        : "bg-black/20 border-white/5 opacity-50 grayscale"
                    )}>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center justify-between">
                        T2 {match.winner_team === 2 && <span className="text-blue-400">🏆</span>}
                      </div>
                      <div className="space-y-2">
                        {team2.map((p, i) => (
                          <div key={i} className="text-[11px] font-bold flex items-center gap-2 truncate">
                            <div className="w-2 h-2 rounded-full shadow-sm shrink-0" style={{ backgroundColor: p.player_color }} />
                            <span className="truncate">{p.player.nickname || p.player.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
