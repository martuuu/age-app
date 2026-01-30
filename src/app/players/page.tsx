"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Loader2, Star, Sword, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Player {
  id: string;
  name: string;
  nickname: string;
  steam_id: string;
  preferred_color: string;
  avatar_url?: string;
  total_matches: number;
  total_wins: number;
  elo_rating: number;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      const { data } = await supabase
        .from("players")
        .select("*")
        .order("total_wins", { ascending: false })
        .order("name");
      if (data) setPlayers(data);
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  return (
    <div className="space-y-8 pb-32">
      <header className="space-y-2">
        <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter">
          <span className="text-primary italic">jugadores</span>
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
          Lista de jugadores
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <div className="text-[10px] font-black uppercase tracking-widest">Llamando a las Tropas...</div>
        </div>
      ) : players.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-4">
          <Users size={40} className="mx-auto text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Sin guerreros en el cuartel.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
            {players.length} jugadores
          </p>
          {players.map((p, index) => (
            <Link
              key={p.id}
              href={`/players/${p.id}`}
              className={cn(
                "glass-card p-4 flex items-center justify-between group hover:border-white/10 transition-all border-white/5 hover:scale-[1.02]",
                index === 0 && "border-primary/20 bg-primary/5"
              )}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-black/40 border-2 overflow-hidden"
                  style={{ borderColor: p.preferred_color }}
                >
                  {p.avatar_url ? (
                    <Image 
                      src={p.avatar_url} 
                      alt={p.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span 
                      className="text-xl font-black"
                      style={{ color: p.preferred_color }}
                    >
                      {p.name[0]}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-black text-sm uppercase tracking-tight flex items-center gap-2 truncate">
                    {p.nickname || p.name}
                    {index === 0 && (
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter mt-0.5">
                    {p.name || "Sin nombre"}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Sword size={10} /> {p.total_matches}p
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <Trophy size={10} /> {p.total_wins}w
                    </span>
                    <span className="text-[9px] bg-white/5 px-1.5 rounded opacity-50 uppercase tracking-tighter">
                      Elo: {p.elo_rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end ml-4">
                <div className="text-2xl font-black text-white font-outfit leading-none">
                  {p.total_matches > 0 ? Math.round((p.total_wins / p.total_matches) * 100) : 0}%
                </div>
                <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mt-1">
                  Win Rate
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
