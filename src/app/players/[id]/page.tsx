import { createClient } from "@/lib/supabase/server";
import { MatchCard } from "@/components/match-card";
import { ArrowLeft, Trophy, Swords, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Player Details
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (playerError || !player) {
    return notFound();
  }

  // 2. Fetch Player's Recent Matches
  // We first need to find matches where this player participated
  const { data: participation } = await supabase
    .from("match_participants")
    .select("match_id, civilization, is_winner")
    .eq("player_id", id);
    
  const matchIds = participation?.map((p: any) => p.match_id) || [];
  
  let playerMatches: any[] = [];
  
  if (matchIds.length > 0) {
    const { data: fullMatches } = await supabase
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
      
    playerMatches = fullMatches || [];
  }

  // Calculate stats
  const totalMatches = player.total_matches || playerMatches.length;
  const totalWins = player.total_wins || participation?.filter((p: any) => p.is_winner).length || 0;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  // Most played civ
  const civCounts: Record<string, number> = {};
  participation?.forEach((p: any) => {
    civCounts[p.civilization] = (civCounts[p.civilization] || 0) + 1;
  });
  const favoriteCiv = Object.entries(civCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 glass rounded-full hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">Perfil de Jugador</h1>
      </div>

      {/* Header Profile */}
      <div className="glass-card flex flex-col items-center justify-center p-8 space-y-4">
        <div 
          className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center text-4xl font-black bg-black/40 shadow-[0_0_30px_rgba(255,200,0,0.2)]"
          style={{ borderColor: player.preferred_color }}
        >
          {player.name[0]}
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black font-outfit uppercase">{player.name}</h2>
          <p className="text-primary font-bold tracking-widest text-sm">{player.nickname || "Guerrero"}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-8 w-full max-w-sm pt-4">
          <div className="text-center space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Batallas</div>
            <div className="text-2xl font-black">{totalMatches}</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Victorias</div>
            <div className="text-2xl font-black text-primary">{totalWins}</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Win Rate</div>
            <div className="text-2xl font-black">{winRate}%</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <Swords size={14} /> Civi Favorita
          </div>
          <div className="text-lg font-black truncate text-primary">{favoriteCiv}</div>
        </div>
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <Trophy size={14} /> ELO Rating
          </div>
          <div className="text-lg font-black">{player.elo_rating}</div>
        </div>
      </div>

      {/* Match History */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Historial de Batallas</h3>
        {playerMatches.length === 0 ? (
          <div className="text-center py-10 opacity-50">Sin batallas registradas.</div>
        ) : (
          playerMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>
    </div>
  );
}
