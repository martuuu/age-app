import { createClient } from "@/lib/supabase/server";
import { Trophy, Star, TrendingUp, Medal } from "lucide-react";
import Link from "next/link";

export default async function RankingPage() {
  const supabase = await createClient();

  // Fetch players with stats
  const { data: players, error } = await supabase
    .from("players")
    .select("*");

  if (error) {
    return <div className="text-red-500">Error al cargar ranking</div>;
  }

  // Calculate win rate
  const rankedPlayers = (players || []).map((p: any) => ({
    ...p,
    win_rate: p.total_matches > 0 ? Math.round((p.total_wins / p.total_matches) * 100) : 0
  })).sort((a: any, b: any) => {
    // Custom sort: Wins > Win Rate > Matches
    if (a.total_wins !== b.total_wins) return b.total_wins - a.total_wins;
    if (a.win_rate !== b.win_rate) return b.win_rate - a.win_rate;
    return b.total_matches - a.total_matches;
  });

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">
          Ranking <span className="text-primary italic">Global</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Los mejores generales del Imperio.
        </p>
      </header>

      {/* Top 3 Podium */}
      {rankedPlayers.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 items-end mb-8 pt-8">
          {/* Silver */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-slate-300 bg-slate-900/50 flex items-center justify-center text-xl font-black">
              {rankedPlayers[1].name[0]}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm truncate w-20">{rankedPlayers[1].name}</div>
              <div className="text-xs text-muted-foreground">{rankedPlayers[1].total_wins} Wins</div>
            </div>
            <div className="h-16 w-full bg-slate-800/50 rounded-t-lg flex items-center justify-center font-black text-2xl text-slate-500">2</div>
          </div>

          {/* Gold */}
          <div className="flex flex-col items-center gap-2 -mt-8">
            <Trophy className="text-yellow-500 absolute -mt-12 animate-bounce" size={24} />
            <div className="w-20 h-20 rounded-full border-4 border-yellow-500/50 bg-yellow-900/20 flex items-center justify-center text-2xl font-black text-primary shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              {rankedPlayers[0].name[0]}
            </div>
            <div className="text-center">
              <div className="font-bold text-base truncate w-24 text-primary">{rankedPlayers[0].name}</div>
              <div className="text-xs text-primary/80 font-bold">{rankedPlayers[0].total_wins} Wins</div>
            </div>
            <div className="h-24 w-full bg-yellow-900/40 rounded-t-lg flex items-center justify-center font-black text-4xl text-yellow-600/50">1</div>
          </div>

          {/* Bronze */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-orange-700 bg-orange-900/20 flex items-center justify-center text-xl font-black text-orange-700">
              {rankedPlayers[2].name[0]}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm truncate w-20">{rankedPlayers[2].name}</div>
              <div className="text-xs text-muted-foreground">{rankedPlayers[2].total_wins} Wins</div>
            </div>
            <div className="h-12 w-full bg-orange-900/30 rounded-t-lg flex items-center justify-center font-black text-xl text-orange-800/50">3</div>
          </div>
        </div>
      )}

      {/* Full List */}
      <div className="space-y-3">
        {rankedPlayers.map((player: any, index: number) => (
          <Link 
            key={player.id} 
            href={`/players/${player.id}`}
            className="glass-card p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform"
          >
            <div className="font-black text-lg w-6 text-muted-foreground text-center">
              {index + 1}
            </div>
            
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border shrink-0"
              style={{ 
                borderColor: player.preferred_color || 'gray',
                backgroundColor: `${player.preferred_color?.toLowerCase() || 'gray'}20` 
              }}
            >
              {player.name[0]}
            </div>

            <div className="flex-1">
              <div className="font-bold text-base flex items-center gap-2">
                {player.name}
                {index === 0 && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <TrendingUp size={10} /> {player.win_rate}% WR
                </span>
                <span className="flex items-center gap-1">
                  <Medal size={10} /> {player.total_matches} Partidas
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-primary">{player.total_wins}</div>
              <div className="text-[9px] uppercase font-bold text-muted-foreground">Wins</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
