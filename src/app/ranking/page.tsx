"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Star, TrendingUp, Medal, Sword, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RankingPage() {
  const [rankedPlayers, setRankedPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRanking() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("players")
          .select("*")
          .order("total_wins", { ascending: false })
          .order("elo_rating", { ascending: false });

        if (fetchError) throw fetchError;
        setRankedPlayers(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={32} />
      <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculando Honor...</div>
    </div>
  );

  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-2">
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">Ranking <span className="text-primary italic">Global</span></h1>
        <p className="text-muted-foreground text-sm font-medium">Los guerreros más destacados del imperio.</p>
      </header>

      {error && (
        <div className="glass p-4 rounded-xl border-destructive/20 text-destructive text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {rankedPlayers.length >= 3 && (
        <div className="grid grid-cols-3 items-end gap-2 pt-16 pb-8 px-2 relative min-h-[300px]">
          {/* Silver - Rank 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-slate-400 bg-slate-400/10 flex items-center justify-center text-xl font-black text-slate-300 shadow-lg">
              {rankedPlayers[1].name[0]}
            </div>
            <div className="text-center">
              <div className="font-black text-[11px] truncate w-20 uppercase tracking-tighter">{rankedPlayers[1].nickname || rankedPlayers[1].name}</div>
              <div className="text-[10px] text-muted-foreground font-bold">{rankedPlayers[1].total_wins}W</div>
            </div>
            <div className="h-16 w-full bg-slate-400/20 rounded-t-2xl flex items-center justify-center font-black text-2xl text-slate-400">2</div>
          </div>

          {/* Gold - Rank 1 */}
          <div className="flex flex-col items-center gap-2 -mt-12 relative z-10">
            <Trophy className="text-yellow-500 absolute -mt-10 animate-bounce" size={28} />
            <div className="w-24 h-24 rounded-full border-4 border-yellow-500/50 bg-yellow-500/10 flex items-center justify-center text-3xl font-black text-primary shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              {rankedPlayers[0].name[0]}
            </div>
            <div className="text-center">
              <div className="font-black text-sm truncate w-24 text-primary uppercase tracking-tighter">{rankedPlayers[0].nickname || rankedPlayers[0].name}</div>
              <div className="text-[10px] text-primary/80 font-black">{rankedPlayers[0].total_wins} VICTORIAS</div>
            </div>
            <div className="h-28 w-full bg-primary/30 rounded-t-2xl flex items-center justify-center font-black text-4xl text-primary shadow-inner">1</div>
          </div>

          {/* Bronze - Rank 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-orange-700 bg-orange-700/10 flex items-center justify-center text-xl font-black text-orange-600 shadow-lg">
              {rankedPlayers[2].name[0]}
            </div>
            <div className="text-center">
              <div className="font-black text-[11px] truncate w-20 uppercase tracking-tighter">{rankedPlayers[2].nickname || rankedPlayers[2].name}</div>
              <div className="text-[10px] text-muted-foreground font-bold">{rankedPlayers[2].total_wins}W</div>
            </div>
            <div className="h-12 w-full bg-orange-700/20 rounded-t-2xl flex items-center justify-center font-black text-xl text-orange-700">3</div>
          </div>
        </div>
      )}

      {/* Full List */}
      <div className="space-y-3">
        {rankedPlayers.map((player: any, index: number) => (
          <Link 
            key={player.id} 
            href={`/players/${player.id}`}
            className={cn(
               "glass-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300",
               index < 3 ? "border-white/10" : "opacity-80"
            )}
          >
            <div className="font-black text-lg w-8 text-muted-foreground/50 text-center font-outfit">
              {index + 1}
            </div>
            
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border-2 shrink-0 bg-black/20"
              style={{ 
                borderColor: player.preferred_color || 'gray',
                color: player.preferred_color || 'white'
              }}
            >
              {player.name[0]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-black text-[13px] uppercase tracking-wider flex items-center gap-2 truncate">
                {player.nickname || player.name}
                {index === 0 && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Sword size={10} /> {player.total_matches}p</span>
                <span className="flex items-center gap-1 text-primary"><Trophy size={10} /> {player.total_wins}w</span>
                <span className="text-[9px] bg-white/5 px-1.5 rounded opacity-50 uppercase tracking-tighter">Elo: {player.elo_rating}</span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="text-lg font-black text-white font-outfit leading-none">
                {player.total_matches > 0 ? Math.round((player.total_wins / player.total_matches) * 100) : 0}%
              </div>
              <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mt-1">Win Rate</div>
            </div>
          </Link>
        ))}

        {rankedPlayers.length === 0 && (
          <div className="text-center py-20 opacity-30 text-xs font-black uppercase tracking-[0.3em]">
            No hay leyendas registradas aún...
          </div>
        )}
      </div>
    </div>
  );
}
