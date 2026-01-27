import { MatchCard } from "@/components/match-card";
import { Trophy, History, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Try to fetch matches
  const { data: matches, error } = await supabase
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

  // Fallback to empty or mock if error (e.g. env not set)
  const displayMatches = matches || [];

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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
          <History size={16} />
          <span>Partidas Recientes</span>
        </div>
        <button className="text-muted-foreground hover:text-white transition-colors">
          <Filter size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {displayMatches.length === 0 ? (
          <div className="text-center py-10 glass rounded-[2rem] overflow-hidden group">
            <div className="h-48 w-full relative mb-6">
              <img 
                src="/assets/empty-state.png" 
                alt="Empire silhouette" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="px-6 space-y-2">
              <Trophy size={40} className="mx-auto text-primary animate-pulse mb-2" />
              <h3 className="text-lg font-bold font-outfit text-white">El campo está vacío</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px] mx-auto">
                Aún no hay crónicas de batallas registradas en el Imperio.
              </p>
            </div>
            {error && (
              <div className="text-[10px] text-destructive/60 mt-6 px-4 font-mono uppercase tracking-tighter">
                ERR: {error.message}
              </div>
            )}
          </div>
        ) : (
          displayMatches.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>
      
      <div className="text-center py-10 opacity-30 text-xs">
        Hecho para el Imperio. Nos vemos en el campo de batalla.
      </div>
    </div>
  );
}
