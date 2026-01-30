"use client";

import { useState, useEffect } from "react";
import { MatchCard } from "@/components/match-card";
import { Trophy, History, Filter, Sword, Users, TrendingUp, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Fetch matches
        const { data: matchesData, error: matchesError } = await supabase
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
          .order("played_at", { ascending: false });

        if (matchesError) throw matchesError;
        setMatches(matchesData || []);

        // 2. Fetch player count
        const { count, error: countError } = await supabase
          .from("players")
          .select("*", { count: "exact", head: true });

        if (countError) throw countError;
        setPlayerCount(count || 0);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalMatches = matches.length;
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground font-medium animate-pulse">Contactando con el Imperio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-outfit tracking-tighter text-white">
          HISTORIAL <span className="text-primary italic">AOE2</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Partidas de nuestro grupo de jugadores.
        </p>
      </header>

      {error && (
        <div className="glass-card border-destructive/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-destructive font-bold uppercase text-xs">
            ⚠️ Error de Conexión
          </div>
          <p className="text-sm text-muted-foreground bg-black/20 p-2 rounded font-mono break-all">
            {error}
          </p>
          <div className="text-[10px] text-muted-foreground">
            Verificá tus variables de entorno en <code className="bg-white/10 px-1 rounded">.env.local</code> (SUPABASE_URL y ANON_KEY).
          </div>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="space-y-6">
          <div className="glass-card text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-outfit text-white">¡Bienvenido al Imperio!</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                No hay batallas detectadas. Si ya corriste el seed, verificá la conexión con Supabase.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/admin/matches/new" 
              className="glass-card p-4 space-y-2 hover:border-primary/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Sword size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Cargar Partida</h4>
                <p className="text-[10px] text-muted-foreground">Nueva Batalla</p>
              </div>
            </Link>
            
            <Link 
              href="/admin/players" 
              className="glass-card p-4 space-y-2 hover:border-blue-400/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Jugadores</h4>
                <p className="text-[10px] text-muted-foreground">{playerCount} registrados</p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass p-3 rounded-xl text-center shadow-lg border border-white/5">
              <div className="text-2xl font-black text-primary font-outfit">{totalMatches}</div>
              <div className="text-[10px] uppercase text-muted-foreground font-black tracking-tighter">Partidas</div>
            </div>
            <div className="glass p-3 rounded-xl text-center shadow-lg border border-white/5">
              <div className="text-2xl font-black font-outfit text-white">{playerCount}</div>
              <div className="text-[10px] uppercase text-muted-foreground font-black tracking-tighter">Jugadores</div>
            </div>
            <Link href="/ranking" className="glass p-3 rounded-xl text-center hover:bg-white/10 transition-colors shadow-lg border border-white/5 group">
              <TrendingUp size={24} className="mx-auto text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-[10px] uppercase text-muted-foreground font-black tracking-tighter mt-1">Ranking</div>
            </Link>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-[0.3em] uppercase">
              <History size={14} strokeWidth={3} />
              <span>Cronología Imperial</span>
            </div>
            <button className="text-muted-foreground hover:text-white transition-colors">
              <Filter size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </>
      )}
      
      <div className="text-center py-10 opacity-30 text-[10px] font-black tracking-widest uppercase">
        Age of Empires II History App ⚔️
      </div>
    </div>
  );
}
