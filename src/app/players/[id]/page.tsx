"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { MatchCard } from "@/components/match-card";
import { ArrowLeft, Trophy, Swords, Calendar, Loader2, ExternalLink, Activity, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [player, setPlayer] = useState<any>(null);
  const [playerMatches, setPlayerMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchPlayerData() {
      try {
        setLoading(true);
        
        // 1. Fetch Player
        const { data: p, error: pErr } = await supabase
          .from("players")
          .select("*")
          .eq("id", id)
          .single();

        if (pErr) throw pErr;
        setPlayer(p);

        // 2. Fetch matches for this player
        const { data: participation, error: partErr } = await supabase
          .from("match_participants")
          .select("match_id")
          .eq("player_id", id);

        if (partErr) throw partErr;
        
        const matchIds = participation?.map((part: any) => part.match_id) || [];
        
        if (matchIds.length > 0) {
          const { data: matches, error: mErr } = await supabase
            .from("matches")
            .select(`
              *,
              participants:match_participants(
                team,
                civilization,
                player_color,
                is_winner,
                player:players(id, name, nickname, avatar_url)
              )
            `)
            .in("id", matchIds)
            .order("played_at", { ascending: false });

          if (mErr) throw mErr;
          setPlayerMatches(matches || []);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Leyendo Crónicas...</div>
    </div>
  );

  if (!player && !loading) return notFound();

  // Stats calculation
  const totalMatches = player.total_matches || playerMatches.length;
  const totalWins = player.total_wins || 0;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  // Most played civ
  const civCounts: Record<string, number> = {};
  playerMatches.forEach(m => {
    const p = m.participants.find((part: any) => part.player.id === id);
    if (p) civCounts[p.civilization] = (civCounts[p.civilization] || 0) + 1;
  });
  const favoriteCiv = Object.entries(civCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 glass rounded-full hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        {/* Eliminado "Expediente de Guerrero" por solicitud */}
      </div>

      {/* Header Profile - Rediseñado */}
      <div className="glass-card p-8 relative overflow-hidden group">
        {/* Glow effect */}
        <div 
          className="absolute -top-24 -left-24 w-64 h-64 blur-[120px] rounded-full opacity-20 transition-all group-hover:opacity-30"
          style={{ backgroundColor: player.preferred_color || 'var(--color-primary)' }}
        />
        
        <div className="flex justify-between items-start relative z-10 w-full">
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <h2 className="text-5xl font-black font-outfit uppercase tracking-tighter leading-none break-words">
                {player.nickname || player.name}
              </h2>
              {player.steam_id ? (
                <div className="pt-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500/50 mb-1 flex items-center gap-1">
                    <Activity size={10} /> Steam ID
                  </div>
                  <div className="text-3xl font-black font-mono text-yellow-500 tracking-tighter shadow-yellow-500/10 drop-shadow-lg">
                    {player.steam_id}
                  </div>
                </div>
              ) : (
                <p className="text-primary/60 font-bold tracking-[0.4em] text-[10px] uppercase pt-2">{player.name}</p>
              )}
            </div>
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="shrink-0 ml-4"
          >
            <div 
              className="w-24 h-24 rounded-3xl border-4 flex items-center justify-center text-4xl font-black bg-black/40 shadow-2xl transition-all hover:rotate-3 overflow-hidden"
              style={{ borderColor: player.preferred_color || 'white', color: player.preferred_color }}
            >
              {player.avatar_url ? (
                <Image 
                  src={player.avatar_url} 
                  alt={player.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{player.name[0]}</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats Overlay - Animated Graphs */}
        <div className="mt-10 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Win Rate Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Efectividad en Combate</span>
                <span className="text-2xl font-black font-outfit text-primary">{winRate}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${winRate}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Wins Graph */}
              <div className="glass p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Trophy size={10} className="text-yellow-500" /> Victorias
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black font-outfit">{totalWins}</span>
                  <div className="flex gap-0.5 pb-1.5 flex-1">
                    {[1, 0.6, 0.8, 0.4, 0.9, 0.7].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex-1 bg-primary/20 rounded-t-sm"
                        style={{ maxHeight: '20px' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

               {/* Matches Graph */}
               <div className="glass p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Swords size={10} className="text-blue-400" /> Partidas
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black font-outfit text-white/80">{totalMatches}</span>
                  <div className="flex gap-0.5 pb-1.5 flex-1">
                    {[0.4, 0.8, 0.5, 0.9, 0.6, 1].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex-1 bg-blue-400/20 rounded-t-sm"
                        style={{ maxHeight: '20px' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-3 border-l-4 border-l-primary/50 group hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <Swords size={14} className="text-primary" /> Especialidad
          </div>
          <div className="text-xl font-black truncate text-white uppercase font-outfit tracking-tight">{favoriteCiv}</div>
        </div>
        <div className="glass-card p-5 space-y-3 border-l-4 border-l-emerald-500/50 group hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <Activity size={14} className="text-emerald-400" /> Prestigio (ELO)
          </div>
          <div className="text-xl font-black text-white font-outfit">{player.elo_rating}</div>
        </div>
      </div>

      {/* External Links */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 mb-4 flex items-center gap-2">
           Enlaces Externos <ExternalLink size={10} />
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {player.steam_id && (
            <a 
              href={`https://www.aoe2insights.com/user/${player.steam_id}/`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass p-4 rounded-3xl flex items-center justify-between hover:bg-primary/10 transition-all border border-white/5 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                  📈
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight text-white/90">AoE2 Insights</div>
                  <div className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">Estadísticas Detalladas</div>
                </div>
              </div>
              <ArrowLeft className="rotate-180 text-muted-foreground/30 group-hover:text-primary transition-colors" size={18} />
            </a>
          )}
          <a 
            href={`https://steamcommunity.com/search/users/#text=${player.nickname || player.name}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass p-4 rounded-3xl flex items-center justify-between hover:bg-slate-500/10 transition-all border border-white/5 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-500/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                🎮
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight text-white/90">Steam Community</div>
                <div className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">Perfil de Plataforma</div>
              </div>
            </div>
            <ArrowLeft className="rotate-180 text-muted-foreground/30 group-hover:text-primary transition-colors" size={18} />
          </a>
        </div>
      </div>

      {/* Match History */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 flex items-center gap-2">
           Crónicas de Batalla <Calendar size={10} />
        </h3>
        {playerMatches.length === 0 ? (
          <div className="glass-card text-center py-16 opacity-40 text-[10px] font-black uppercase tracking-widest italic border-dashed">
            Sin registros en la biblioteca imperial.
          </div>
        ) : (
          <div className="space-y-4">
            {playerMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
